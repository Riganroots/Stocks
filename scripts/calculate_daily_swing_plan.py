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
        return {"trades":0,"winRatePct":None,"avgR":None,"profitFactorR":None,"netWinRatePct":None,"netAvgR":None,"netProfitFactorR":None}
    rs=[float(t["rMultiple"]) for t in trades]
    net_rs=[float(t.get("netRMultiple",t["rMultiple"])) for t in trades]
    wins=[r for r in rs if r>0]; losses=[r for r in rs if r<0]
    net_wins=[r for r in net_rs if r>0]; net_losses=[r for r in net_rs if r<0]
    return {
        "trades":len(trades),
        "winRatePct":round(len(wins)/len(trades)*100,2),
        "avgR":round(sum(rs)/len(rs),3),
        "profitFactorR":round(sum(wins)/abs(sum(losses)),3) if losses and sum(losses)!=0 else None,
        "netWinRatePct":round(len(net_wins)/len(trades)*100,2),
        "netAvgR":round(sum(net_rs)/len(net_rs),3),
        "netProfitFactorR":round(sum(net_wins)/abs(sum(net_losses)),3) if net_losses and sum(net_losses)!=0 else None
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

    generated_at=datetime.now(timezone.utc).isoformat()
    payload={
        "generatedAt":generated_at,
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
            "feesIncluded":True,
            "taxesIncluded":True,
            "slippageIncluded":False,
            "costModel":"data/trading_costs.json"
        },
        "candidates":candidates
    }
    Path("data/daily_swing_plan.json").write_text(json.dumps(payload,indent=2))

    history_path=Path("data/daily_swing_plan_history.json")
    if history_path.exists():
        try:
            history=json.loads(history_path.read_text())
        except Exception:
            history={"entries":[]}
    else:
        history={"entries":[]}
    entries=history.get("entries",[])
    market_date=payload.get("marketAsOf")
    snapshot={
        "marketAsOf":market_date,
        "generatedAt":generated_at,
        "ruleVersion":RULE_VERSION,
        "candidateSymbols":[c["symbol"] for c in candidates],
        "candidates":[{
            "symbol":c["symbol"],
            "close":c.get("close"),
            "entryLow":(c.get("draft") or {}).get("entryLow"),
            "entryHigh":(c.get("draft") or {}).get("entryHigh"),
            "stop":(c.get("draft") or {}).get("stop"),
            "target1":(c.get("draft") or {}).get("target1"),
            "target2":(c.get("draft") or {}).get("target2")
        } for c in candidates]
    }
    entries=[e for e in entries if e.get("marketAsOf")!=market_date]
    entries.append(snapshot)
    entries=sorted(entries,key=lambda e:e.get("marketAsOf") or "")[-60:]
    history={
        "generatedAt":generated_at,
        "ruleVersion":RULE_VERSION,
        "entries":entries
    }
    history_path.write_text(json.dumps(history,indent=2))
    print("Daily plan candidates:",len(candidates),"history entries:",len(entries))

if __name__=="__main__":
    main()
