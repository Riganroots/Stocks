#!/usr/bin/env python3
import json
from pathlib import Path

def load(path):
    return json.loads(Path(path).read_text())

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

def range_bucket(v,cuts):
    if v is None:return "missing"
    v=float(v)
    for lo,hi,label in cuts:
        if lo<=v<hi:return label
    return cuts[-1][2]

def main():
    bt=load("data/swing_backtest.json")
    trades=bt.get("trades",[])
    diagnostics={}

    dimensions={
        "trend":[(0,10,"0"),(10,20,"10"),(20,30,"20"),(30,999,"30")],
        "momentum":[(0,6,"0"),(6,12,"6"),(12,20,"12"),(20,999,"20")],
        "liquidity":[(0,8,"0-4"),(8,12,"8"),(12,16,"12"),(16,20,"16"),(20,999,"20")],
        "participation":[(0,5,"2"),(5,8,"5"),(8,10,"8"),(10,999,"10")],
        "location":[(0,3,"0"),(3,8,"3"),(8,15,"8"),(15,20,"15"),(20,999,"20")],
    }
    for dim,cuts in dimensions.items():
        buckets={}
        for t in trades:
            v=(t.get("components") or {}).get(dim)
            label=range_bucket(v,cuts)
            buckets.setdefault(label,[]).append(t)
        diagnostics[dim]={k:summarize(v) for k,v in buckets.items()}

    metric_dims={
        "rsi14":[(0,30,"<30"),(30,40,"30-39"),(40,50,"40-49"),(50,60,"50-59"),(60,70,"60-69"),(70,999,">=70")],
        "volumeRatio":[(0,.7,"<0.7"),(.7,1.0,"0.7-0.99"),(1.0,1.5,"1.0-1.49"),(1.5,999,">=1.5")],
        "supportDistancePct":[(-999,3,"<=3"),(3,6,"3-6"),(6,10,"6-10"),(10,999,">10")],
        "resistanceHeadroomPct":[(-999,2,"<2"),(2,5,"2-5"),(5,10,"5-10"),(10,999,">=10")],
        "atrPct14":[(0,2,"<2"),(2,3,"2-3"),(3,5,"3-5"),(5,999,">=5")]
    }
    for dim,cuts in metric_dims.items():
        buckets={}
        for t in trades:
            v=(t.get("signalMetrics") or {}).get(dim)
            label=range_bucket(v,cuts)
            buckets.setdefault(label,[]).append(t)
        diagnostics[dim]={k:summarize(v) for k,v in buckets.items()}

    flag_diag={}
    all_flags=sorted({f for t in trades for f in t.get("riskFlags",[])})
    for flag in all_flags:
        flagged=[t for t in trades if flag in t.get("riskFlags",[])]
        clean=[t for t in trades if flag not in t.get("riskFlags",[])]
        flag_diag[flag]={"flagged":summarize(flagged),"notFlagged":summarize(clean)}

    payload={
        "modelVersion":"swing-diagnostics-v0.1.0",
        "sourceBacktestModel":bt.get("modelVersion"),
        "sourceScannerModel":bt.get("scannerModelVersion"),
        "overall":bt.get("overall"),
        "byScoreBucket":bt.get("byScoreBucket"),
        "dimensions":diagnostics,
        "riskFlags":flag_diag
    }
    Path("data/swing_diagnostics.json").write_text(json.dumps(payload,indent=2))
    print("Swing diagnostics generated")

if __name__=="__main__":
    main()
