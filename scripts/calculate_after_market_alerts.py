#!/usr/bin/env python3
import json
from datetime import datetime, timezone, date
from pathlib import Path

MODEL_VERSION="after-market-alerts-v0.1.0"

def load(path,default=None):
    p=Path(path)
    if not p.exists():
        return default if default is not None else {}
    return json.loads(p.read_text())

def add(alerts,kind,severity,title,message,**extra):
    item={
        "id":f"{kind}-{len(alerts)+1}",
        "kind":kind,
        "severity":severity,
        "title":title,
        "message":message
    }
    item.update(extra)
    alerts.append(item)

def latest_previous(entries,current_date):
    earlier=[e for e in entries if e.get("marketAsOf") and e.get("marketAsOf")<current_date]
    return earlier[-1] if earlier else None

def level_state(candidate):
    d=candidate.get("draft") or {}
    close=candidate.get("close")
    if close is None:return None
    close=float(close)
    stop=d.get("stop"); t1=d.get("target1"); t2=d.get("target2"); lo=d.get("entryLow"); hi=d.get("entryHigh")
    if None not in (stop,) and close<=float(stop): return ("stop","danger","Close is at/below the draft stop")
    if t2 is not None and close>=float(t2): return ("target2","good","Close is at/above draft Target 2")
    if t1 is not None and close>=float(t1): return ("target1","good","Close is at/above draft Target 1")
    if lo is not None and hi is not None and float(lo)<=close<=float(hi): return ("entry_range","info","Close is inside the draft entry range")
    if lo is not None and close<float(lo): return ("below_entry","warn","Close is below the draft entry range")
    return ("waiting","none","No draft price level was triggered")

def main():
    daily=load("data/daily_swing_plan.json")
    history=load("data/daily_swing_plan_history.json",{"entries":[]})
    technicals=load("data/technicals.json")
    announcements=load("data/announcements.json")
    market_date=daily.get("marketAsOf") or technicals.get("latestMarketDate")
    generated_at=datetime.now(timezone.utc).isoformat()
    alerts=[]

    entries=history.get("entries",[])
    prev=latest_previous(entries,market_date) if market_date else None
    current_syms={c["symbol"] for c in daily.get("candidates",[])}
    prev_syms=set(prev.get("candidateSymbols",[])) if prev else set()

    if prev:
        for sym in sorted(current_syms-prev_syms):
            add(alerts,"candidate_new","info",f"{sym}: new Daily Plan candidate",
                f"{sym} newly matches the provisional support-pullback gate versus {prev.get('marketAsOf')}.",
                symbol=sym,marketAsOf=market_date,previousMarketAsOf=prev.get("marketAsOf"))
        for sym in sorted(current_syms&prev_syms):
            add(alerts,"candidate_continues","none",f"{sym}: candidate continues",
                f"{sym} still matches the Daily Plan gate.",
                symbol=sym,marketAsOf=market_date,previousMarketAsOf=prev.get("marketAsOf"))
        for sym in sorted(prev_syms-current_syms):
            add(alerts,"candidate_removed","warn",f"{sym}: no longer matches Daily Plan",
                f"{sym} matched on {prev.get('marketAsOf')} but no longer meets the current gate. This is not a sell instruction.",
                symbol=sym,marketAsOf=market_date,previousMarketAsOf=prev.get("marketAsOf"))
    else:
        for sym in sorted(current_syms):
            add(alerts,"candidate_seed","info",f"{sym}: Daily Plan candidate",
                "First stored market-date snapshot; change detection begins from the next market session.",
                symbol=sym,marketAsOf=market_date)

    tech_map=technicals.get("technicals",{})
    for c in daily.get("candidates",[]):
        sym=c["symbol"]
        state=level_state(c)
        if state and state[0]!="waiting":
            add(alerts,"price_level",state[1],f"{sym}: {state[0].replace('_',' ')}",
                state[2],symbol=sym,marketAsOf=market_date,
                close=c.get("close"),draft=c.get("draft"))
        t=tech_map.get(sym,{})
        close=t.get("close"); sma20=t.get("sma20"); sma50=t.get("sma50"); rsi=t.get("rsi14")
        reasons=[]
        if close is not None and sma20 is not None and float(close)<float(sma20): reasons.append("close below SMA20")
        if close is not None and sma50 is not None and float(close)<float(sma50): reasons.append("close below SMA50")
        if rsi is not None and float(rsi)<30: reasons.append("RSI below 30")
        if reasons:
            add(alerts,"technical_warning","warn",f"{sym}: technical warning",
                ", ".join(reasons)+".",symbol=sym,marketAsOf=market_date,
                technicalAsOf=t.get("asOf"),reasons=reasons)

    if market_date:
        try:
            age=(datetime.now(timezone.utc).date()-date.fromisoformat(market_date)).days
        except Exception:
            age=None
        if age is not None and age>3:
            add(alerts,"data_stale","danger","Market data may be stale",
                f"Latest stored market session is {market_date}, {age} calendar days old. Weekend/holiday context should be checked before acting.",
                marketAsOf=market_date,ageCalendarDays=age)

    prev_date=prev.get("marketAsOf") if prev else None
    for a in announcements.get("items",[]):
        pub=a.get("publishedAt")
        if not pub: continue
        is_new=(prev_date is not None and pub>prev_date) or (prev_date is None and market_date and pub>=market_date)
        if is_new:
            add(alerts,"announcement_new","info","New sourced market announcement",
                a.get("title","Sourced announcement"),publishedAt=pub,
                fetchedAt=a.get("fetchedAt"),source=a.get("source"),sourceUrl=a.get("sourceUrl"),
                marketAsOf=market_date)

    severity_order={"danger":0,"warn":1,"info":2,"good":3,"none":4}
    alerts.sort(key=lambda a:(severity_order.get(a.get("severity"),9),a.get("symbol") or "",a["kind"]))

    payload={
        "generatedAt":generated_at,
        "marketAsOf":market_date,
        "modelVersion":MODEL_VERSION,
        "previousMarketAsOf":prev_date,
        "summary":{
            "total":len(alerts),
            "danger":sum(1 for a in alerts if a["severity"]=="danger"),
            "warn":sum(1 for a in alerts if a["severity"]=="warn"),
            "info":sum(1 for a in alerts if a["severity"]=="info"),
            "good":sum(1 for a in alerts if a["severity"]=="good")
        },
        "alerts":alerts
    }
    Path("data/after_market_alerts.json").write_text(json.dumps(payload,indent=2,ensure_ascii=False))
    print("After-market alerts:",len(alerts))

if __name__=="__main__":
    main()
