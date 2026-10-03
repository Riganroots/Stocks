#!/usr/bin/env python3
import argparse, csv, json, re
from datetime import datetime, timedelta
from pathlib import Path

DATE_RE = re.compile(r"unadj_(\d{4}-\d{2}-\d{2})\.csv$")

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--source-dir", required=True)
    p.add_argument("--universe", default="data/universe.json")
    p.add_argument("--output", default="data/market_history.json")
    p.add_argument("--calendar-days", type=int, default=370)
    args=p.parse_args()

    universe=json.loads(Path(args.universe).read_text())
    wanted={x["symbol"] for x in universe["symbols"]}
    source=Path(args.source_dir)
    dated=[]
    for f in source.glob("unadj_*.csv"):
        m=DATE_RE.search(f.name)
        if m:
            dated.append((datetime.strptime(m.group(1),"%Y-%m-%d").date(),f))
    if not dated:
        raise SystemExit("No OHLC CSV files found")
    dated.sort()
    max_date=dated[-1][0]
    cutoff=max_date-timedelta(days=args.calendar_days)
    history={sym:[] for sym in sorted(wanted)}
    used=0

    for market_date,f in dated:
        if market_date<cutoff:
            continue
        with f.open(newline="",encoding="utf-8-sig") as fh:
            for row in csv.DictReader(fh):
                sym=row.get("symbol","").strip()
                if sym not in wanted:
                    continue
                try:
                    history[sym].append({
                        "date":row["date"],
                        "open":float(row["open"]),
                        "high":float(row["high"]),
                        "low":float(row["low"]),
                        "close":float(row["close"]),
                        "volume":float(row["volume"]),
                    })
                except (KeyError,TypeError,ValueError):
                    continue
        used+=1

    payload={
        "source":"socrateai-official/nepse-open-data",
        "dataset":"ohlc_unadjusted_stock",
        "latestMarketDate":max_date.isoformat(),
        "calendarWindowDays":args.calendar_days,
        "filesScanned":used,
        "history":history
    }
    out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(payload,indent=2,separators=(",",": ")))
    print(f"Wrote {out} through {max_date}")

if __name__=="__main__":
    main()
