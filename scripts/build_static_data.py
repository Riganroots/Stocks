#!/usr/bin/env python3
import json
from pathlib import Path

def main():
    fundamentals=json.loads(Path("data/fundamentals.json").read_text())
    payload="window.NEPSE_FUNDAMENTALS = "+json.dumps(fundamentals,separators=(",",":"))+";\n"
    Path("data/fundamentals.js").write_text(payload)
    announcements=json.loads(Path("data/announcements.json").read_text())
    Path("data/announcements.js").write_text("window.NEPSE_ANNOUNCEMENTS = "+json.dumps(announcements,separators=(",",":"),ensure_ascii=False)+";\n")
    print("Rebuilt static fundamentals and announcements data")

if __name__=="__main__":
    main()
