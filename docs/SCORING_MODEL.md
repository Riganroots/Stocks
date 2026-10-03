# Scoring model design

The score is a **research-prioritisation** tool, not a buy/sell instruction.

Current model version: `v0.1.0`.

## Production gate

A company is scored only when all of these are available:

- supported equity sector profile
- sourced EPS
- sourced book value
- reported fiscal period
- latest market close
- RSI-14
- SMA-20
- SMA-50
- 20-session average volume
- at least 50 trading sessions of history

If any required input is missing, the result is `insufficient_data`; the application must not substitute a guessed score.

## Components

| Component | Max | V0.1 evidence |
| --- | ---: | --- |
| Fundamental | 35 | ROE proxy = EPS / book value, using sector-specific bands |
| Valuation | 25 | sector-specific P/E and P/B bands |
| Technical | 20 | close vs SMA20/SMA50, SMA20 vs SMA50, RSI-14 |
| Liquidity | 10 | 20-session average volume |
| Risk | 10 | deductions for loss-making, extreme valuation, very low liquidity or extreme RSI |

Commercial banks, hydropower, manufacturing, life insurance and the current 'Others' equity bucket have separate valuation/profitability thresholds.

Mutual funds deliberately return `insufficient_data` until a fund-specific model based on NAV/discount/premium/distributions is implemented.

## Labels

- 80–100: Research
- 70–79: Watch
- 55–69: Neutral
- below 55: Caution

These are research workflow labels, not trade recommendations.

## Important limitation

The current fundamental component uses an ROE proxy because the V1 data source does not yet provide enough high-quality, normalized historical metrics across all sectors. The model should be upgraded to sector-specific inputs such as bank asset quality/capital measures and project/operating metrics for hydropower before being treated as mature.

## Auditability

Every score stores:
- model version
- component points
- raw/derived evidence
- fundamental reporting period
- technical as-of date
- missing evidence

## Backtesting requirement

Before changing a model from prototype to trusted production status, evaluate forward returns at multiple horizons, maximum drawdown, score-bucket behavior, sector behavior, turnover, liquidity constraints, survivorship bias, corporate-action adjustment and realistic transaction costs.
