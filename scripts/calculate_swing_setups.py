#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

MODEL_VERSION="swing-v0.1.0"

def load(path):
    return json.loads(Path(path).read_text())

def clamp(v,lo=0,hi=100):
    return max(lo,min(hi,v))

def draft(t):
    close=float(t["close"]); atr=float(t["atr14"]); support=float(t["support20"]); sma20=float(t["sma20"])
    entry_low=max(support,min(close,sma20)-0.5*atr)
    entry_high=max(entry_low+0.15*atr,min(close+0.25*atr,sma20+0.35*atr))
    mid=(entry_low+entry_high)/2
    stop=min(entry_low-0.75*atr,support-0.25*atr)
    risk=mid-stop
    if risk<=0:return None
    return {
        "entryLow":round(entry_low,2),
        "entryHigh":round(entry_high,2),
        "stop":round(stop,2),
        "target1":round(mid+1.5*risk,2),
        "target2":round(mid+2.5*risk,2),
        "riskPerShare":round(risk,2),
        "rrTarget1":1.5,
        "rrTarget2":2.5,
        "method":"ATR/support template"
    }

def score(meta,t,research):
    sym=meta["symbol"]
    if meta.get("instrumentType")!="equity":
        return {"symbol":sym,"status":"excluded","reason":"non-equity instrument","setupScore":None,"modelVersion":MODEL_VERSION}

    required=["close","sma20","sma50","rsi14","avgVolume20","lastVolume","support20","resistance20","atr14","atrPct14"]
    missing=[k for k in required if t.get(k) is None]
    if missing:
        return {"symbol":sym,"status":"insufficient_data","missing":missing,"setupScore":None,"modelVersion":MODEL_VERSION}

    close=float(t["close"]); sma20=float(t["sma20"]); sma50=float(t["sma50"]); rsi=float(t["rsi14"])
    avgv=float(t["avgVolume20"]); lastv=float(t["lastVolume"]); support=float(t["support20"]); resistance=float(t["resistance20"])
    atrpct=float(t["atrPct14"])
    volume_ratio=(lastv/avgv) if avgv>0 else 0
    support_distance=((close-support)/close*100) if close else None
    resistance_headroom=((resistance-close)/close*100) if close else None

    trend=(10 if close>sma20 else 0)+(10 if close>sma50 else 0)+(10 if sma20>sma50 else 0)
    if 45<=rsi<=65: momentum=20
    elif 35<=rsi<45 or 65<rsi<=72: momentum=12
    elif 30<=rsi<35: momentum=6
    else: momentum=0

    if avgv>=100000: liquidity=20
    elif avgv>=50000: liquidity=16
    elif avgv>=20000: liquidity=12
    elif avgv>=5000: liquidity=8
    elif avgv>0: liquidity=4
    else: liquidity=0

    if volume_ratio>=1.5: participation=10
    elif volume_ratio>=1.0: participation=8
    elif volume_ratio>=0.7: participation=5
    else: participation=2

    if support_distance is None or support_distance<0: location=0
    elif support_distance<=3: location=20
    elif support_distance<=6: location=15
    elif support_distance<=10: location=8
    else: location=3
    if resistance_headroom is not None and resistance_headroom<2:
        location=max(0,location-5)

    total=clamp(trend+momentum+liquidity+participation+location)

    flags=[]
    if close<sma50: flags.append("below_sma50")
    if rsi>70: flags.append("rsi_overbought")
    if rsi<30: flags.append("rsi_oversold")
    if avgv<5000: flags.append("low_liquidity")
    if atrpct>5: flags.append("high_volatility")
    if resistance_headroom is not None and resistance_headroom<2: flags.append("near_resistance")
    if t.get("return20d") is not None and float(t["return20d"])<-8: flags.append("weak_20d_return")

    if total>=80: label="High-quality setup"
    elif total>=65: label="Developing setup"
    elif total>=50: label="Mixed setup"
    else: label="Weak setup"

    reasons=[
        f"trend {trend}/30",
        f"momentum {momentum}/20",
        f"liquidity {liquidity}/20",
        f"volume participation {participation}/10",
        f"support location {location}/20"
    ]

    return {
        "symbol":sym,"status":"scanned","setupScore":int(total),"label":label,"modelVersion":MODEL_VERSION,
        "asOf":t.get("asOf"),"close":close,
        "metrics":{
            "rsi14":rsi,"sma20":sma20,"sma50":sma50,"atrPct14":atrpct,
            "avgVolume20":avgv,"lastVolume":lastv,"volumeRatio":round(volume_ratio,2),
            "support20":support,"resistance20":resistance,
            "supportDistancePct":round(support_distance,2) if support_distance is not None else None,
            "resistanceHeadroomPct":round(resistance_headroom,2) if resistance_headroom is not None else None
        },
        "components":{"trend":trend,"momentum":momentum,"liquidity":liquidity,"participation":participation,"location":location},
        "riskFlags":flags,"reasons":reasons,
        "researchScore":research.get("score") if research and research.get("status")=="scored" else None,
        "draft":draft(t)
    }

def main():
    universe=load("data/universe.json")
    technicals=load("data/technicals.json")
    scores=load("data/scores.json")
    out={}
    for meta in universe["symbols"]:
        sym=meta["symbol"]
        out[sym]=score(meta,technicals.get("technicals",{}).get(sym,{}),scores.get("scores",{}).get(sym,{}))
    payload={
        "generatedAt":datetime.now(timezone.utc).isoformat(),
        "marketAsOf":technicals.get("latestMarketDate"),
        "modelVersion":MODEL_VERSION,
        "setups":out
    }
    Path("data/swing_setups.json").write_text(json.dumps(payload,indent=2))
    scanned=sum(1 for v in out.values() if v.get("status")=="scanned")
    print(f"Swing scanner: {scanned}/{len(out)} equities scanned")

if __name__=="__main__":
    main()
