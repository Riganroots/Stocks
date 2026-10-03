# Scoring model design

The score is a research-prioritisation tool, not a buy/sell command.

V1 target weights:
- Fundamental 35
- Valuation 25
- Technical 20
- Liquidity 10
- Risk 10

Production activation requires a minimum evidence set for the relevant sector.

Each score should store raw inputs, data freshness, transformation rules, awarded points and model version.

Commercial banks, insurance, hydropower, manufacturing, finance/microfinance and other sectors should use sector-appropriate evidence where their economics differ.

Backtests should evaluate forward returns at several horizons, drawdown, score-bucket hit rate, sector performance, turnover, liquidity constraints, survivorship bias, corporate-action adjustment and transaction costs.