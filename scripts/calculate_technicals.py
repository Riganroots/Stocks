#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

def sma(vals,n):
    return sum(vals[-n:])/n if len(vals)>=n else None

def rsi_wilder(vals,n=14):
    if len(vals)<n+1:return None
    deltas=[vals[i]-vals[i-1] for i in range(1,len(vals))]
    gains=[max(d,0) for d in deltas]
    losses=[max(-d,0) for d in deltas]
    ag=sum(gains[:n])/n; al=sum(losses[:n])/n
    for i in range(n,len(deltas)):
        ag=(ag*(n-1)+gains[i])/n
        al=(al*(n-1)+losses[i])/n
    if al==0:return 100.0
    rs=ag/al
    return 100-(100/(1+rs))

def ret(vals,n):
    if len(vals)<n+1 or vals[-n-1]==0:return None
    return (vals[-1]/vals[-n-1]-1)*100

def main():
    inp=Path("data/market_history.json")
    data=json.loads(inp.read_text())
    out={}
    for sym,rows in data["history"].items():
        rows=sorted(rows,key=lambda r:r["date"])
        closes=[float(r["close"]) for r in rows]
        vols=[float(r["volume"]) for r in rows]
        recent252=rows[-252:]
        out[sym]={
            "asOf":rows[-1]["date"] if rows else None,
            "sessions":len(rows),
            "rsi14":round(rsi_wilder(closes),2) if rsi_wilder(closes) is not None else None,
            "sma20":round(sma(closes,20),2) if sma(closes,20) is not None else None,
            "sma50":round(sma(closes,50),2) if sma(closes,50) is not None else None,
            "sma200":round(sma(closes,200),2) if sma(closes,200) is not None else None,
            "avgVolume20":round(sma(vols,20),2) if sma(vols,20) is not None else None,
            "return5d":round(ret(closes,5),2) if ret(closes,5) is not None else None,
            "return20d":round(ret(closes,20),2) if ret(closes,20) is not None else None,
            "return60d":round(ret(closes,60),2) if ret(closes,60) is not None else None,
            "high52w":max((r["high"] for r in recent252),default=None),
            "low52w":min((r["low"] for r in recent252),default=None)
        }
    result={
        "generatedAt":datetime.now(timezone.utc).isoformat(),
        "source":data.get("source"),
        "latestMarketDate":data.get("latestMarketDate"),
        "technicals":out
    }
    Path("data/technicals.json").write_text(json.dumps(result,indent=2))
    Path("data/generated_market.js").write_text("window.NEPSE_GENERATED = "+json.dumps(result,separators=(",",":"))+";\n")
    print("Calculated technicals for",len(out),"symbols")

if __name__=="__main__":
    main()
