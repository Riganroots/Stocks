# API plan

Core endpoints:
- GET /api/market/overview
- GET /api/companies
- GET /api/companies/{symbol}
- GET /api/companies/{symbol}/prices
- GET /api/companies/{symbol}/fundamentals
- GET /api/companies/{symbol}/score
- GET /api/companies/{symbol}/score/history
- POST /api/screener
- GET /api/portfolio
- POST /api/portfolio/transactions
- GET /api/watchlist
- POST /api/watchlist/{symbol}
- DELETE /api/watchlist/{symbol}
- GET /api/alerts
- POST /api/alerts

Every score response should include the score, model version, evidence, risks and data freshness. The AI layer should only explain returned evidence.