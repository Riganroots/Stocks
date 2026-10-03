# NEPSE Copilot

Private NEPSE research and portfolio decision-support project.

## Current V1

The repository now contains a working static prototype with dashboard, company browser, stock detail view, portfolio tracking and P/L, screener, watchlist, alert-rule storage, responsive mobile layout, data-source documentation, scoring design and a database draft.

## Data status

Price and volume values for the eight V1 symbols are a dated development snapshot for 2 October 2026, with day-over-day movement compared with 1 October 2026.

The current EPS, P/E, ROE, P/B, RSI and 0–100 scores are still demo values. The interface explicitly labels this distinction.

The development price snapshot was sourced from the public socrateai-official/nepse-open-data repository. Production data must be reviewed for licensing, reliability, completeness and update frequency before live use.

## Principle

NEPSE Copilot is designed for research prioritisation and portfolio decision support, not automatic trade execution. A production score should become unavailable when required verified evidence is missing.

## Historical data progress

Seven-session historical OHLC and volume data is now wired into the eight V1 stock pages. Each page calculates a recent close return, close range and average volume from the dated source rows.

The current history window is deliberately small while the ingestion/provider layer is being built; it is not yet sufficient for indicators such as RSI-14 or 20/50/200-day moving averages.

## Next

1. Historical OHLC provider
2. Company master and instrument classification
3. Verified fundamentals and corporate actions
4. Sector-specific scoring
5. Backtesting by model version
6. Secure portfolio storage
7. Evidence-grounded AI explanations
8. Alert delivery

## Portfolio privacy

Personal holdings are not committed to this repository. The static app stores imported holdings in browser localStorage. Users can import/export a JSON portfolio file. Missing average purchase prices remain unknown, so the app does not fabricate invested amount or P/L.
