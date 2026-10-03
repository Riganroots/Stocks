#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

MODEL_VERSION = "v0.1.0"

SECTOR_PROFILES = {
    "Commercial Banks": {
        "roe": [(15,35),(12,31),(9,26),(6,18),(0,10)],
        "pe": [(12,25),(16,22),(20,18),(25,13),(35,7)],
        "pb": [(1.5,25),(2.0,22),(2.5,18),(3.0,13),(4.0,7)],
    },
    "Hydro Power": {
        "roe": [(16,35),(12,31),(8,25),(5,18),(0,9)],
        "pe": [(15,25),(22,22),(30,18),(40,13),(60,7)],
        "pb": [(1.8,25),(2.5,22),(3.2,18),(4.0,13),(5.5,7)],
    },
    "Manufacturing And Processing": {
        "roe": [(20,35),(15,31),(10,25),(6,18),(0,9)],
        "pe": [(15,25),(22,22),(30,18),(40,13),(55,7)],
        "pb": [(2.0,25),(3.0,22),(4.0,18),(6.0,13),(9.0,7)],
    },
    "Life Insurance": {
        "roe": [(15,35),(12,31),(8,25),(5,18),(0,9)],
        "pe": [(20,25),(30,22),(45,18),(65,13),(90,7)],
        "pb": [(2.0,25),(3.0,22),(4.0,18),(5.0,13),(7.0,7)],
    },
    "Others": {
        "roe": [(15,35),(12,31),(8,25),(5,18),(0,9)],
        "pe": [(15,25),(25,22),(35,18),(50,13),(75,7)],
        "pb": [(2.0,25),(3.0,22),(4.0,18),(5.0,13),(7.0,7)],
    },
}

def load(path):
    return json.loads(Path(path).read_text())

def points_desc(value, bands):
    if value is None:
        return 0
    for threshold, points in bands:
        if value >= threshold:
            return points
    return 0

def points_asc(value, bands):
    if value is None or value <= 0:
        return 0
    for threshold, points in bands:
        if value <= threshold:
            return points
    return 0

def score_symbol(meta, fund, tech, latest_close):
    sym=meta["symbol"]
    sector=meta["sector"]
    instrument=meta.get("instrumentType","equity")

    missing=[]
    if instrument!="equity":
        return {
            "symbol":sym,"status":"insufficient_data","score":None,
            "modelVersion":MODEL_VERSION,
            "missing":["sector-specific fund model not implemented"],
            "evidence":[]
        }

    for key in ("eps","bookValue","period"):
        if not fund or fund.get(key) is None:
            missing.append("fundamental."+key)
    for key in ("rsi14","sma20","sma50","avgVolume20","sessions"):
        if not tech or tech.get(key) is None:
            missing.append("technical."+key)
    if latest_close is None:
        missing.append("latest close")
    if tech and tech.get("sessions",0)<50:
        missing.append("minimum 50 trading sessions")

    profile=SECTOR_PROFILES.get(sector)
    if not profile:
        missing.append("sector scoring profile")

    if missing:
        return {
            "symbol":sym,"status":"insufficient_data","score":None,
            "modelVersion":MODEL_VERSION,"missing":sorted(set(missing)),"evidence":[]
        }

    eps=float(fund["eps"])
    bv=float(fund["bookValue"])
    price=float(latest_close)
    roe=(eps/bv*100) if bv>0 else None
    pe=(price/eps) if eps>0 else None
    pb=(price/bv) if bv>0 else None

    fundamental=points_desc(roe,profile["roe"])
    pe_points=points_asc(pe,profile["pe"])
    pb_points=points_asc(pb,profile["pb"])
    valuation=round((pe_points+pb_points)/2)

    technical=0
    evidence=[]
    sma20=float(tech["sma20"]); sma50=float(tech["sma50"]); rsi=float(tech["rsi14"])
    if price>sma20: technical+=6
    if price>sma50: technical+=6
    if sma20>sma50: technical+=4
    if 40<=rsi<=65: technical+=4
    elif 30<=rsi<40 or 65<rsi<=70: technical+=2

    avgv=float(tech["avgVolume20"] or 0)
    if avgv>=100000: liquidity=10
    elif avgv>=50000: liquidity=8
    elif avgv>=20000: liquidity=6
    elif avgv>=5000: liquidity=4
    elif avgv>0: liquidity=2
    else: liquidity=0

    risk=10
    if eps<=0: risk-=7
    if pe is not None and pe>60: risk-=2
    if pb is not None and pb>6: risk-=2
    if avgv<5000: risk-=2
    if rsi>75 or rsi<25: risk-=1
    risk=max(0,min(10,risk))

    total=int(round(fundamental+valuation+technical+liquidity+risk))
    if total>=80: label="Research"
    elif total>=70: label="Watch"
    elif total>=55: label="Neutral"
    else: label="Caution"

    evidence=[
        {"metric":"ROE proxy","value":round(roe,2) if roe is not None else None,"points":fundamental,"max":35,
         "explanation":"EPS divided by book value; a proxy until richer sector fundamentals are connected."},
        {"metric":"Valuation","value":{"pe":round(pe,2) if pe is not None else None,"pb":round(pb,2) if pb is not None else None},
         "points":valuation,"max":25,"explanation":"Sector-relative P/E and P/B bands."},
        {"metric":"Technical","value":{"rsi14":rsi,"sma20":sma20,"sma50":sma50,"close":price},
         "points":technical,"max":20,"explanation":"Trend position plus RSI range."},
        {"metric":"Liquidity","value":{"avgVolume20":avgv},"points":liquidity,"max":10,
         "explanation":"20-session average trading volume."},
        {"metric":"Risk","value":{"eps":eps,"pe":round(pe,2) if pe is not None else None,"pb":round(pb,2) if pb is not None else None},
         "points":risk,"max":10,"explanation":"Penalty bucket for loss-making, extreme valuation, low liquidity or extreme RSI."},
    ]

    return {
        "symbol":sym,"status":"scored","label":label,"score":total,
        "modelVersion":MODEL_VERSION,
        "components":{"fundamental":fundamental,"valuation":valuation,"technical":technical,"liquidity":liquidity,"risk":risk},
        "derived":{"roeProxy":round(roe,2) if roe is not None else None,"pe":round(pe,2) if pe is not None else None,"pb":round(pb,2) if pb is not None else None},
        "fundamentalPeriod":fund.get("period"),"technicalAsOf":tech.get("asOf"),
        "missing":[],"evidence":evidence
    }

def main():
    universe=load("data/universe.json")
    fundamentals_raw=load("data/fundamentals.json")
    technicals_raw=load("data/technicals.json")
    market=load("data/market_history.json")

    fundamentals=fundamentals_raw.get("records",fundamentals_raw)
    technicals=technicals_raw.get("technicals",technicals_raw)
    history=market.get("history",{})

    scores={}
    for meta in universe["symbols"]:
        sym=meta["symbol"]
        rows=history.get(sym,[])
        latest_close=float(rows[-1]["close"]) if rows else None
        scores[sym]=score_symbol(meta,fundamentals.get(sym),technicals.get(sym),latest_close)

    result={
        "generatedAt":datetime.now(timezone.utc).isoformat(),
        "modelVersion":MODEL_VERSION,
        "scores":scores
    }
    Path("data/scores.json").write_text(json.dumps(result,indent=2))

    generated={
        "generatedAt":result["generatedAt"],
        "source":technicals_raw.get("source"),
        "latestMarketDate":technicals_raw.get("latestMarketDate"),
        "technicals":technicals,
        "scores":scores,
        "scoreModelVersion":MODEL_VERSION
    }
    Path("data/generated_market.js").write_text("window.NEPSE_GENERATED = "+json.dumps(generated,separators=(",",":"))+";\n")
    scored=sum(1 for v in scores.values() if v["status"]=="scored")
    print(f"Scored {scored}/{len(scores)} symbols with {MODEL_VERSION}")

if __name__=="__main__":
    main()
