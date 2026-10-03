create table companies (
  id bigserial primary key,
  symbol text unique not null,
  company_name text not null,
  sector text not null,
  instrument_type text not null default 'equity'
);

create table data_sources (
  id bigserial primary key,
  source_key text unique not null,
  source_name text not null,
  source_url text,
  source_type text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table daily_prices (
  company_id bigint not null references companies(id),
  market_date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric not null,
  volume numeric,
  source_id bigint references data_sources(id),
  ingested_at timestamptz not null default now(),
  is_adjusted boolean not null default false,
  primary key (company_id, market_date, is_adjusted)
);

create table fundamentals (
  id bigserial primary key,
  company_id bigint not null references companies(id),
  period_end date not null,
  period_type text not null,
  eps numeric,
  pe numeric,
  book_value numeric,
  pb numeric,
  roe numeric,
  revenue numeric,
  net_profit numeric,
  source_id bigint references data_sources(id),
  ingested_at timestamptz not null default now()
);

create table scores (
  company_id bigint not null references companies(id),
  score_date date not null,
  model_version text not null,
  fundamental_score numeric,
  valuation_score numeric,
  technical_score numeric,
  liquidity_score numeric,
  risk_score numeric,
  total_score numeric,
  evidence jsonb not null default '[]',
  primary key (company_id, score_date, model_version)
);

create table portfolio_transactions (
  id bigserial primary key,
  symbol text not null,
  trade_date date,
  side text not null check (side in ('BUY','SELL')),
  quantity numeric not null,
  price numeric not null,
  fees numeric not null default 0
);

create table alerts (
  id bigserial primary key,
  symbol text not null,
  alert_type text not null,
  rule jsonb not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);