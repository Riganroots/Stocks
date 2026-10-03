# Data validation

NEPSE Copilot does not assume that two public market-data sources always agree.

## V1 policy

- OHLC/volume development source: socrateai-official/nepse-open-data
- Fundamental/corporate-action secondary source: MeroLagani public company-detail pages
- EPS and book value retain their reported fiscal period.
- P/E and P/B shown in the app are recalculated from the selected OHLC close, EPS and book value.
- Same-date source prices are cross-checked where available.
- If a same-date difference exceeds 0.25%, the UI reports a source mismatch rather than hiding it.
- When the secondary source is older than the price snapshot, the app labels the cross-check as not same-date.

## Production gate

Before any score becomes production-grade, the ingestion service should require source freshness, validation status and a minimum evidence set. Missing evidence should produce insufficient_data rather than a guessed score.
