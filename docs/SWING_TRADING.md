# Swing trading feature design

## Purpose

A short-term research/planning workspace. Trade execution remains manual.

## Technical draft

The current draft requires ATR14, SMA20 and 20-session support/resistance.

- entry zone: a volatility/pullback range around the latest close/SMA20, floored by 20-session support
- stop: below the entry zone and below/near 20-session support using ATR
- target 1: 1.5R from entry-zone midpoint
- target 2: 2.5R from entry-zone midpoint

These are mechanical starting points, not trade instructions. Every level is editable before a plan is saved.

## Position sizing

When capital and risk percentage are supplied:

`risk budget = capital × risk %`

`per-share risk = entry midpoint - stop`

`quantity = min(floor(risk budget / per-share risk), floor(capital / entry midpoint))`

Fees are excluded until confirmed.

## Sell-alert states

The latest stored close is compared with saved plan levels:

- close <= stop: stop level reached/breached
- close >= target 2: target 2 reached/exceeded
- close >= target 1: target 1 reached/exceeded
- otherwise close < SMA20: trend warning
- otherwise close inside entry range: entry-range alert

Alerts never send an order.

## Privacy

Swing plans, account sizing inputs and imported trade-journal records are stored in browser localStorage in the current static version and are not committed to Git.
