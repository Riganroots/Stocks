#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

RULE_VERSION="support-pullback-v0.1.0"
CUTOFF="2026-06-30"

def load(path):
    return json.loads(Path(path).read_text())

def passes(setup):
    m=setup.get("metrics") or {}
    return (
        setup.get("status")=="scanned"
        and m.get("supportDistancePct") is not None and float(m["supportDistancePct"])<=6
        and m.get("rsi14") is not None and 30<=float(m["rsi14"])<50
        and m.get("avgVolume20") is not None and float(m["avgVolume20"])>=20000
        and m.get("atrPct14") is not None and float(m["atrPct14"])<5
        and setup.get("draft") is not None
    )

def summarize(trades):
    if not trades:
        return {"trades":0,"winRatePct":None,"avgR":None,"profitFactorR":None}
    rs=[float(t["rMultiple"]) for t in trades]
    wins=[r for r in rs if r>0]
    losses=[r for r in rs if r<0]
    return {
        "trades":len(trades),
        "winRatePct":round(len(wins)/len(trades)*100,2),
        "avgR":round(sum(rs)/len(rs),3),
        "profitFactorR":round(sum(wins)/abs(sum(losses)),3) if losses and sum(losses)!=0 else None
    }

def trade_passes(t):
    m=t.get("signalMetrics") or {}
    return (
        m.get("supportDistancePct") is not None and float(m["supportDistancePct"])<=6
        and m.get("rsi14") is not None and 30<=float(m["rsi14"])<50
        and m.get("avgVolume20") is not None and float(m["avgVolume20"])>=20000
        and m.get("atrPct14") is not None and float(m["atrPct14"])<5
    )

def main():
    swing=load("data/swing_setups.json")
    bt=load("data/swing_backtest.json")
    setups=swing.get("setups",{})
    candidates=[]
    for sym,s in setups.items():
        if not passes(s):continue
        m=s.get("metrics") or {}
        candidates.append({
            "symbol":sym,
            "marketAsOf":s.get("asOf"),
            "close":s.get("close"),
            "scannerScore":s.get("setupScore"),
            "scannerLabel":s.get("label"),
            "pattern":"Support pullback",
            "draft":s.get("draft"),
            "metrics":{
                "rsi14":m.get("rsi14"),
                "supportDistancePct":m.get("supportDistancePct"),
                "avgVolume20":m.get("avgVolume20"),
                "volumeRatio":m.get("volumeRatio"),
                "atrPct14":m.get("atrPct14"),
                "support20":m.get("support20"),
                "resistance20":m.get("resistance20")
            },
            "reasons":[
                "within 6% of 20-session support",
                "RSI is between 30 and 49",
                "20-session average volume is at least 20,000",
                "ATR is below 5% of price"
            ]
        })
    candidates.sort(key=lambda x:(float(x["metrics"]["supportDistancePct"]),-float(x["scannerScore"] or 0)))

    matched=[t for t in bt.get("trades",[]) if trade_passes(t)]
    dev=[t for t in matched if t.get("signalDate","")<=CUTOFF]
    hold=[t for t in matched if t.get("signalDate","")>CUTOFF]

    payload={
        "generatedAt":datetime.now(timezone.utc).isoformat(),
        "marketAsOf":swing.get("marketAsOf"),
        "ruleVersion":RULE_VERSION,
        "validationStatus":"provisional",
        "validationNote":"Rule was derived from the same historical universe; the later-date split is a retrospective robustness check, not untouched independent validation.",
        "criteria":{
            "supportDistancePctMax":6,
            "rsiMin":30,
            "rsiMaxExclusive":50,
            "avgVolume20Min":20000,
            "atrPct14MaxExclusive":5
        },
        "historicalCheck":{
            "developmentThrough":CUTOFF,
            "development":summarize(dev),
            "laterPeriod":summarize(hold),
            "allMatched":summarize(matched),
            "feesIncluded":False,
            "taxesIncluded":False,
            "slippageIncluded":False
        },
        "candidates":candidates
    }
    Path("data/daily_swing_plan.json").write_text(json.dumps(payload,indent=2))
    print("Daily plan candidates:",len(candidates))

if __name__=="__main__":
    main()
