#!/usr/bin/env python3
import json
from pathlib import Path

def main():
    fundamentals=json.loads(Path("data/fundamentals.json").read_text())
    payload="window.NEPSE_FUNDAMENTALS = "+json.dumps(fundamentals,separators=(",",":"))+";\n"
    Path("data/fundamentals.js").write_text(payload)
    print("Rebuilt data/fundamentals.js")

if __name__=="__main__":
    main()
