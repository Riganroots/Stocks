# Data source policy

Every market-sensitive value should carry provenance.

## Development snapshot

Source: socrateai-official/nepse-open-data
Dataset: ohlc_unadjusted_stock
Market date: 2026-10-02
Previous comparison date: 2026-10-01

This source is being used for development and backtesting exploration. It is not represented as guaranteed real-time or official exchange data.

## Production requirements

Store source name, market date, ingestion timestamp, raw checksum, adjusted/unadjusted status and validation status.

Never silently mix data from different sources.

When verified fundamental evidence is missing, return insufficient_data instead of calculating a production score.

The AI explanation layer may explain structured evidence returned by the analysis service but must not invent a metric.

## Announcements

Regulatory/market-structure announcements are sourced from the official Securities Board of Nepal (SEBON) news and activities pages. Each record stores publication date, fetch timestamp, source name and source URL.

Company corporate-action context is derived from the sourced company-detail snapshots in `data/fundamentals.json`; it is not treated as a substitute for a formal book-close/approval notice.

Swing explanations must display market-data and announcement timestamps separately.
