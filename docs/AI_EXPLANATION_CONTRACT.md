# Grounded explanation contract

The static application currently renders a deterministic evidence explanation. A future LLM/API may rewrite that evidence into natural language, but it must obey this contract.

## Allowed inputs

- latest stored close, previous close and volume
- market-data `asOf` and pipeline `generatedAt`
- RSI14, SMA20/50/200, ATR14, 20-session support/resistance and average volume
- evidence-gated research score and component breakdown
- user-authored swing plan: entry range, stop and targets
- user-entered capital/risk inputs for position sizing
- sourced announcement title, publication date, fetch timestamp, source and URL
- sourced corporate-action snapshot and reporting period

## Required output behavior

- state the market-data date
- distinguish publication date from fetch date
- identify stale/missing evidence
- never invent a price, financial ratio, announcement or holding
- never claim an order was placed
- never infer current holdings from historical trades
- do not include transaction fees unless confirmed
- make clear that technical entry/stop/target levels are editable planning drafts

## Excluded inputs

Broker credentials, MeroShare credentials, OTPs, PINs and trade-execution secrets must never be sent to the explanation service.
