-- Frontend payment order tables for ECPay methods (Credit, ATM, CVS Code, WebATM)
-- Tables collect all commonly returned fields from ECPay, plus method-specific fields.
-- All original values are kept as text to preserve exact formatting from ECPay; numeric columns are used where safe.
-- Each table also stores raw_result (jsonb) for forward compatibility.

create extension if not exists pgcrypto;

-- helper: updated_at auto update
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

-- ======================= Credit =======================
create table if not exists public.fronted_credit_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Common
  merchant_id text,
  merchant_trade_no text unique,
  rtn_code int,
  rtn_msg text,
  trade_no text,
  trade_amt int,
  payment_date text,
  payment_type text,
  payment_type_charge_fee numeric(12,2),
  trade_date text,
  simulate_paid int,
  check_mac_value text,

  -- Credit-specific (subset per ECPay spec)
  gwsr text,
  process_date text,
  auth_code text,
  amount int,
  eci text,
  card4no text,
  card6no text,
  red_dan text,
  red_de_amt int,
  red_ok_amt int,
  stage text,
  stast text,

  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_credit_order_trade_no on public.fronted_credit_order(trade_no);
create trigger t_fronted_credit_order_updated before update on public.fronted_credit_order for each row execute function set_updated_at();

-- ======================= ATM =======================
create table if not exists public.fronted_atm_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Common (notify)
  merchant_id text,
  merchant_trade_no text unique,
  rtn_code int,
  rtn_msg text,
  trade_no text,
  trade_amt int,
  payment_date text,
  payment_type text,
  payment_type_charge_fee numeric(12,2),
  trade_date text,
  simulate_paid int,
  check_mac_value text,

  -- ATM code assignment (result)
  bank_code text,
  v_account text,
  expire_date text,

  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_atm_order_trade_no on public.fronted_atm_order(trade_no);
create trigger t_fronted_atm_order_updated before update on public.fronted_atm_order for each row execute function set_updated_at();

-- ======================= CVS Code =======================
create table if not exists public.fronted_cvscode_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Common (notify)
  merchant_id text,
  merchant_trade_no text unique,
  rtn_code int,
  rtn_msg text,
  trade_no text,
  trade_amt int,
  payment_date text,
  payment_type text,
  payment_type_charge_fee numeric(12,2),
  trade_date text,
  simulate_paid int,
  check_mac_value text,

  -- CVS code assignment (result)
  payment_no text,
  expire_date text,

  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_cvscode_order_trade_no on public.fronted_cvscode_order(trade_no);
create trigger t_fronted_cvscode_order_updated before update on public.fronted_cvscode_order for each row execute function set_updated_at();

-- ======================= WebATM =======================
create table if not exists public.fronted_webatm_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Common (notify)
  merchant_id text,
  merchant_trade_no text unique,
  rtn_code int,
  rtn_msg text,
  trade_no text,
  trade_amt int,
  payment_date text,
  payment_type text,
  payment_type_charge_fee numeric(12,2),
  trade_date text,
  simulate_paid int,
  check_mac_value text,

  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_webatm_order_trade_no on public.fronted_webatm_order(trade_no);
create trigger t_fronted_webatm_order_updated before update on public.fronted_webatm_order for each row execute function set_updated_at();
