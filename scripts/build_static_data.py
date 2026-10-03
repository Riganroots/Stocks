#!/usr/bin/env python3
import json
from pathlib import Path

def main():
    fundamentals=json.loads(Path("data/fundamentals.json").read_text())
    payload="window.NEPSE_FUNDAMENTALS = "+json.dumps(fundamentals,separators=(",",":"))+";\n"
    Path("data/fundamentals.js").write_text(payload)
    announcements=json.loads(Path("data/announcements.json").read_text())
    Path("data/announcements.js").write_text("window.NEPSE_ANNOUNCEMENTS = "+json.dumps(announcements,separators=(",",":"),ensure_ascii=False)+";\n")
    swing=json.loads(Path("data/swing_setups.json").read_text())
    Path("data/swing_setups.js").write_text("window.NEPSE_SWING_SETUPS = "+json.dumps(swing,separators=(",",":"),ensure_ascii=False)+";\n")
    backtest=json.loads(Path("data/swing_backtest.json").read_text())
    Path("data/swing_backtest.js").write_text("window.NEPSE_SWING_BACKTEST = "+json.dumps(backtest,separators=(",",":"),ensure_ascii=False)+";\n")
    daily=json.loads(Path("data/daily_swing_plan.json").read_text())
    Path("data/daily_swing_plan.js").write_text("window.NEPSE_DAILY_SWING_PLAN = "+json.dumps(daily,separators=(",",":"),ensure_ascii=False)+";\n")
    print("Rebuilt static fundamentals, announcements, scanner, backtest and daily plan data")

if __name__=="__main__":
    main()
