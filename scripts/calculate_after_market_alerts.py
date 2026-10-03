#!/usr/bin/env python3
import json, re
from datetime import datetime, timezone, date
from pathlib import Path

MODEL_VERSION="after-market-alerts-v0.2.0"

def load(path,default=None):
    p=Path(path)
    if not p.exists():
        return default if default is not None else {}
    return json.loads(p.read_text())

def slug(value):
    return re.sub(r"[^a-z0-9]+","-",str(value or "").lower()).strip("-")

def add(alerts,kind,severity,title,message,market_date=None,symbol=None,**extra):
    ident="-".join(x for x in [market_date or "na",kind,symbol or "market",slug(title)[:40]] if x)
    item={"id":ident,"kind":kind,"severity":severity,"title":title,"message":message}
    if symbol:item["symbol"]=symbol
    if market_date:item["marketAsOf"]=market_date
    item.update(extra)
    alerts.append(item)

def latest_previous(entries,current_date):
    earlier=sorted([e for e in entries if e.get("marketAsOf") and e.get("marketAsOf")<current_date],key=lambda e:e.get("marketAsOf"))
    return earlier[-1] if earlier else None

def level_state(candidate):
    d=candidate.get("draft") or {}
    close=candidate.get("close")
    if close is None:return None
    close=float(close)
    stop=d.get("stop"); t1=d.get("target1"); t2=d.get("target2"); lo=d.get("entryLow"); hi=d.get("entryHigh")
    if stop is not None and close<=float(stop): return ("stop","danger","Close is at/below the draft stop")
    if t2 is not None and close>=float(t2): return ("target2","good","Close is at/above draft Target 2")
    if t1 is not None and close>=float(t1): return ("target1","good","Close is at/above draft Target 1")
    if lo is not None and hi is not None and float(lo)<=close<=float(hi): return ("entry_range","info","Close is inside the draft entry range")
    if lo is not None and close<float(lo): return ("below_entry","warn","Close is below the draft entry range; re-check support before using the old draft")
    return ("waiting","none","No draft price level was triggered")

def gate_failures(setup):
    m=(setup or {}).get("metrics") or {}
    reasons=[]
    if m.get("supportDistancePct") is None or float(m["supportDistancePct"])>6:
        reasons.append("more than 6% above 20-session support")
    if m.get("rsi14") is None or not (30<=float(m["rsi14"])<50):
        reasons.append("RSI left the 30–49 gate")
    if m.get("avgVolume20") is None or float(m["avgVolume20"])<20000:
        reasons.append("20-session average volume fell below 20,000")
    if m.get("atrPct14") is None or float(m["atrPct14"])>=5:
        reasons.append("ATR rose to 5% or more")
    return reasons

def candidate_warning(candidate,setup):
    m=(setup or {}).get("metrics") or {}
    close=candidate.get("close")
    reasons=[]
    if close is not None and m.get("support20") is not None and float(close)<float(m["support20"]):
        reasons.append("close broke below 20-session support")
    if m.get("rsi14") is not None and float(m["rsi14"])<30:
        reasons.append("RSI fell below 30")
    if m.get("atrPct14") is not None and float(m["atrPct14"])>=5:
        reasons.append("ATR reached 5% or more")
    if m.get("avgVolume20") is not None and float(m["avgVolume20"])<20000:
        reasons.append("20-session average volume fell below 20,000")
    return reasons

def main():
    daily=load("data/daily_swing_plan.json")
    history=load("data/daily_swing_plan_history.json",{"entries":[]})
    technicals=load("data/technicals.json")
    swing=load("data/swing_setups.json")
    announcements=load("data/announcements.json")
    market_date=daily.get("marketAsOf") or technicals.get("latestMarketDate")
    generated_at=datetime.now(timezone.utc).isoformat()
    alerts=[]

    entries=history.get("entries",[])
    prev=latest_previous(entries,market_date) if market_date else None
    current_syms={c["symbol"] for c in daily.get("candidates",[])}
    prev_syms=set(prev.get("candidateSymbols",[])) if prev else set()
    setup_map=swing.get("setups",{})

    if prev:
        for sym in sorted(current_syms-prev_syms):
            add(alerts,"candidate_new","info",f"{sym}: new Daily Plan candidate",
                f"{sym} newly matches the provisional support-pullback gate versus {prev.get('marketAsOf')}.",
                market_date=market_date,symbol=sym,previousMarketAsOf=prev.get("marketAsOf"))
        for sym in sorted(current_syms&prev_syms):
            add(alerts,"candidate_continues","none",f"{sym}: candidate continues",
                f"{sym} still matches the Daily Plan gate.",
                market_date=market_date,symbol=sym,previousMarketAsOf=prev.get("marketAsOf"))
        for sym in sorted(prev_syms-current_syms):
            failures=gate_failures(setup_map.get(sym,{}))
            why="; ".join(failures) if failures else "one or more gate conditions no longer pass"
            add(alerts,"candidate_removed","warn",f"{sym}: no longer matches Daily Plan",
                f"{sym} matched on {prev.get('marketAsOf')} but no longer meets the current gate: {why}. This is not a sell instruction.",
                market_date=market_date,symbol=sym,previousMarketAsOf=prev.get("marketAsOf"),failedCriteria=failures)
    else:
        for sym in sorted(current_syms):
            add(alerts,"candidate_seed","info",f"{sym}: Daily Plan candidate",
                "First stored market-date snapshot; change detection begins from the next market session.",
                market_date=market_date,symbol=sym)

    for c in daily.get("candidates",[]):
        sym=c["symbol"]
        state=level_state(c)
        if state and state[0]!="waiting":
            add(alerts,"price_level",state[1],f"{sym}: {state[0].replace('_',' ')}",
                state[2],market_date=market_date,symbol=sym,close=c.get("close"),draft=c.get("draft"))
        reasons=candidate_warning(c,setup_map.get(sym,{}))
        if reasons:
            severity="danger" if any("broke below" in x for x in reasons) else "warn"
            add(alerts,"strategy_warning",severity,f"{sym}: support-pullback warning",
                ", ".join(reasons)+".",market_date=market_date,symbol=sym,
                technicalAsOf=(setup_map.get(sym,{}) or {}).get("asOf"),reasons=reasons)

    age=None
    if market_date:
        try:
            age=(datetime.now(timezone.utc).date()-date.fromisoformat(market_date)).days
        except Exception:
            pass
        if age is not None and age>3:
            add(alerts,"data_stale","danger","Market data may be stale",
                f"Latest stored market session is {market_date}, {age} calendar days old. Weekend/holiday context should be checked before acting.",
                market_date=market_date,ageCalendarDays=age)

    prev_date=prev.get("marketAsOf") if prev else None
    for a in announcements.get("items",[]):
        pub=a.get("publishedAt")
        if not pub: continue
        is_new=(prev_date is not None and pub>prev_date) or (prev_date is None and market_date and pub>=market_date)
        if is_new:
            add(alerts,"announcement_new","info","New sourced market announcement",
                a.get("title","Sourced announcement"),market_date=market_date,
                publishedAt=pub,fetchedAt=a.get("fetchedAt"),source=a.get("source"),sourceUrl=a.get("sourceUrl"))

    severity_order={"danger":0,"warn":1,"info":2,"good":3,"none":4}
    alerts.sort(key=lambda a:(severity_order.get(a.get("severity"),9),a.get("symbol") or "",a["kind"]))

    actionable=[a for a in alerts if a.get("severity")!="none"]
    changes=[a for a in actionable if a.get("kind") in ("candidate_new","candidate_removed","announcement_new")]
    summary={
        "total":len(alerts),
        "actionable":len(actionable),
        "danger":sum(1 for a in alerts if a["severity"]=="danger"),
        "warn":sum(1 for a in alerts if a["severity"]=="warn"),
        "info":sum(1 for a in alerts if a["severity"]=="info"),
        "good":sum(1 for a in alerts if a["severity"]=="good"),
        "continuing":sum(1 for a in alerts if a["kind"]=="candidate_continues"),
        "changes":len(changes)
    }
    headline=f"{len(current_syms)} Daily Plan candidates · {summary['changes']} new/change alerts · {summary['warn']+summary['danger']} warnings"
    payload={
        "generatedAt":generated_at,
        "marketAsOf":market_date,
        "modelVersion":MODEL_VERSION,
        "previousMarketAsOf":prev_date,
        "dataAgeCalendarDays":age,
        "headline":headline,
        "summary":summary,
        "alerts":alerts
    }
    Path("data/after_market_alerts.json").write_text(json.dumps(payload,indent=2,ensure_ascii=False))
    print("After-market alerts:",len(alerts),"actionable:",len(actionable))

if __name__=="__main__":
    main()
