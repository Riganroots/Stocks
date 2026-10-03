#!/usr/bin/env python3
import json, statistics
from pathlib import Path
from calculate_technicals import sma, rsi_wilder, atr_wilder, ret
from calculate_swing_setups import score

MODEL_VERSION="swing-backtest-v0.1.0"
MIN_HISTORY=50
ENTRY_WINDOW=3
MAX_HOLD=10

def load(path):
    return json.loads(Path(path).read_text())

def snapshot(rows):
    closes=[float(r["close"]) for r in rows]
    vols=[float(r["volume"]) for r in rows]
    atr=atr_wilder(rows,14)
    if len(rows)<MIN_HISTORY or atr is None:return None
    recent20=rows[-20:]
    return {
        "asOf":rows[-1]["date"],"sessions":len(rows),
        "close":closes[-1],"prevClose":closes[-2] if len(closes)>=2 else None,
        "lastVolume":vols[-1],"atr14":atr,"atrPct14":atr/closes[-1]*100 if closes[-1] else None,
        "support20":min(float(r["low"]) for r in recent20),
        "resistance20":max(float(r["high"]) for r in recent20),
        "rsi14":rsi_wilder(closes,14),"sma20":sma(closes,20),"sma50":sma(closes,50),
        "sma200":sma(closes,200),"avgVolume20":sma(vols,20),
        "return5d":ret(closes,5),"return20d":ret(closes,20),"return60d":ret(closes,60)
    }

def find_fill(rows,start,draft):
    lo=float(draft["entryLow"]); hi=float(draft["entryHigh"])
    for j in range(start,min(start+ENTRY_WINDOW,len(rows))):
        r=rows[j]; low=float(r["low"]); high=float(r["high"]); op=float(r["open"])
        if low<=hi and high>=lo:
            if lo<=op<=hi: fill=op
            elif op<lo: fill=lo
            else: fill=hi
            return j,fill
    return None,None

def simulate_exit(rows,fill_idx,fill,draft):
    stop=float(draft["stop"]); target=float(draft["target1"])
    risk=fill-stop
    if risk<=0:return None
    last=min(fill_idx+MAX_HOLD-1,len(rows)-1)
    for j in range(fill_idx,last+1):
        r=rows[j]; low=float(r["low"]); high=float(r["high"])
        stop_hit=low<=stop; target_hit=high>=target
        if stop_hit and target_hit:
            return j,stop,(stop-fill)/risk,"stop_same_day_ambiguous"
        if stop_hit:return j,stop,(stop-fill)/risk,"stop"
        if target_hit:return j,target,(target-fill)/risk,"target1"
    exit_price=float(rows[last]["close"])
    return last,exit_price,(exit_price-fill)/risk,"time_exit"

def bucket(score_value):
    if score_value>=80:return "80-100"
    if score_value>=65:return "65-79"
    return "50-64"

def summarize(trades):
    rs=[t["rMultiple"] for t in trades]
    pos=[r for r in rs if r>0]; neg=[r for r in rs if r<0]
    return {
        "trades":len(trades),
        "wins":len(pos),
        "losses":len(neg),
        "winRatePct":round(len(pos)/len(trades)*100,2) if trades else None,
        "avgR":round(sum(rs)/len(rs),3) if rs else None,
        "medianR":round(statistics.median(rs),3) if rs else None,
        "profitFactorR":round(sum(pos)/abs(sum(neg)),3) if neg and sum(neg)!=0 else None,
        "target1Hits":sum(1 for t in trades if t["exitReason"]=="target1"),
        "stopHits":sum(1 for t in trades if t["exitReason"].startswith("stop")),
        "timeExits":sum(1 for t in trades if t["exitReason"]=="time_exit")
    }

def main():
    universe=load("data/universe.json")
    market=load("data/market_history.json")
    meta={x["symbol"]:x for x in universe["symbols"]}
    trades=[]
    per_symbol={}

    for sym,rows in market.get("history",{}).items():
        m=meta.get(sym)
        if not m or m.get("instrumentType")!="equity":continue
        rows=sorted(rows,key=lambda r:r["date"])
        i=MIN_HISTORY-1
        while i<len(rows)-1:
            t=snapshot(rows[:i+1])
            if not t:
                i+=1;continue
            setup=score(m,t,{})
            if setup.get("status")!="scanned" or setup.get("setupScore",0)<50 or not setup.get("draft"):
                i+=1;continue
            fill_idx,fill=find_fill(rows,i+1,setup["draft"])
            if fill_idx is None:
                i+=ENTRY_WINDOW+1;continue
            result=simulate_exit(rows,fill_idx,fill,setup["draft"])
            if not result:
                i=fill_idx+1;continue
            exit_idx,exit_price,r_mult,reason=result
            metrics=setup.get("metrics",{})
            trade={
                "symbol":sym,"signalDate":rows[i]["date"],"fillDate":rows[fill_idx]["date"],
                "exitDate":rows[exit_idx]["date"],"setupScore":setup["setupScore"],
                "scoreBucket":bucket(setup["setupScore"]),
                "components":setup.get("components",{}),
                "riskFlags":setup.get("riskFlags",[]),
                "signalMetrics":{
                    "rsi14":metrics.get("rsi14"),
                    "volumeRatio":metrics.get("volumeRatio"),
                    "supportDistancePct":metrics.get("supportDistancePct"),
                    "resistanceHeadroomPct":metrics.get("resistanceHeadroomPct"),
                    "atrPct14":metrics.get("atrPct14"),
                    "avgVolume20":metrics.get("avgVolume20")
                },
                "entry":round(fill,2),
                "stop":setup["draft"]["stop"],"target1":setup["draft"]["target1"],
                "exitPrice":round(exit_price,2),"rMultiple":round(r_mult,3),
                "exitReason":reason
            }
            trades.append(trade);per_symbol.setdefault(sym,[]).append(trade)
            i=exit_idx+1

    by_bucket={}
    for b in ("50-64","65-79","80-100"):
        by_bucket[b]=summarize([t for t in trades if t["scoreBucket"]==b])
    by_symbol={sym:summarize(ts) for sym,ts in sorted(per_symbol.items())}

    payload={
        "generatedAt":market.get("latestMarketDate"),
        "modelVersion":MODEL_VERSION,
        "scannerModelVersion":"swing-v0.1.0",
        "assumptions":{
            "minimumHistorySessions":MIN_HISTORY,
            "entryWindowSessions":ENTRY_WINDOW,
            "maxHoldSessions":MAX_HOLD,
            "targetUsed":"target1",
            "sameDayStopAndTarget":"stop assumed first (conservative)",
            "feesIncluded":False,
            "taxesIncluded":False,
            "slippageIncluded":False
        },
        "overall":summarize(trades),"byScoreBucket":by_bucket,"bySymbol":by_symbol,
        "trades":trades
    }
    Path("data/swing_backtest.json").write_text(json.dumps(payload,indent=2))
    print("Backtest trades:",len(trades),"avgR:",payload["overall"]["avgR"])

if __name__=="__main__":
    main()
