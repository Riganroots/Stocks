#!/usr/bin/env python3
import copy, json
from pathlib import Path
from backtest_swing_scanner import trade_costs

SCENARIOS=[0,10,25]

def load(path):
    return json.loads(Path(path).read_text())

def summarize(values):
    if not values:
        return {"trades":0,"netWinRatePct":None,"netAvgR":None,"netProfitFactorR":None}
    wins=[x for x in values if x>0]; losses=[x for x in values if x<0]
    return {
        "trades":len(values),
        "netWinRatePct":round(len(wins)/len(values)*100,2),
        "netAvgR":round(sum(values)/len(values),3),
        "netProfitFactorR":round(sum(wins)/abs(sum(losses)),3) if losses and sum(losses)!=0 else None
    }

def is_daily_gate(t):
    m=t.get("signalMetrics") or {}
    return (
        m.get("supportDistancePct") is not None and float(m["supportDistancePct"])<=6
        and m.get("rsi14") is not None and 30<=float(m["rsi14"])<50
        and m.get("avgVolume20") is not None and float(m["avgVolume20"])>=20000
        and m.get("atrPct14") is not None and float(m["atrPct14"])<5
    )

def scenario_r(t,base_costs,bps):
    costs=copy.deepcopy(base_costs)
    costs["referenceBacktest"]["slippageBpsPerSide"]=bps
    qty=int((t.get("referencePosition") or {}).get("quantity") or 0)
    risk=float((t.get("referencePosition") or {}).get("plannedRiskNpr") or 0)
    holding=int((t.get("costs") or {}).get("holdingDays") or 0)
    if qty<=0 or risk<=0:return None
    c=trade_costs(float(t["entry"]),float(t["exitPrice"]),qty,costs,holding)
    return c["netProfit"]/risk

def main():
    bt=load("data/swing_backtest.json")
    costs=load("data/trading_costs.json")
    trades=bt.get("trades",[])
    daily=[t for t in trades if is_daily_gate(t)]
    payload={
        "modelVersion":"swing-cost-sensitivity-v0.1.0",
        "sourceBacktestModel":bt.get("modelVersion"),
        "costConfigAsOf":costs.get("asOf"),
        "scenarios":[]
    }
    for bps in SCENARIOS:
        all_rs=[r for t in trades if (r:=scenario_r(t,costs,bps)) is not None]
        daily_rs=[r for t in daily if (r:=scenario_r(t,costs,bps)) is not None]
        dev_rs=[r for t in daily if t.get("signalDate","")<="2026-06-30" if (r:=scenario_r(t,costs,bps)) is not None]
        hold_rs=[r for t in daily if t.get("signalDate","")>"2026-06-30" if (r:=scenario_r(t,costs,bps)) is not None]
        payload["scenarios"].append({
            "slippageBpsPerSide":bps,
            "allScanner":summarize(all_rs),
            "dailyGateAll":summarize(daily_rs),
            "dailyGateDevelopment":summarize(dev_rs),
            "dailyGateLaterPeriod":summarize(hold_rs)
        })
    Path("data/swing_cost_sensitivity.json").write_text(json.dumps(payload,indent=2))
    print("Cost sensitivity scenarios:",len(payload["scenarios"]))

if __name__=="__main__":
    main()
