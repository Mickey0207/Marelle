-- ECPay Logistics: five tables for C2C, B2C, Home, and reverse flows
-- All official params are preserved as text where appropriate; numeric when safe.
-- Store raw_result (jsonb) for forward compatibility.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

-- Common columns template (duplicated per table for simplicity):
-- id uuid, created_at, updated_at
-- merchant_id, merchant_trade_no (unique), logistics_type, logistics_sub_type
-- goods_amount, is_collection, collection_amount
-- sender_xxx, receiver_xxx, receiver_store_id, return_store_id (for reverse)
-- server_reply_url, client_reply_url
-- logistics_id, booking_note, trade_desc
-- temperature, distance, specification
-- scheduled_pickup_time, scheduled_delivery_time, scheduled_delivery_date
-- remark, platform_id
-- check_mac_value, raw_result

-- 1) C2C convenience store (店到店)
create table if not exists public.fronted_c2c_logistics_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  merchant_id text,
  merchant_trade_no text unique,
  logistics_type text,          -- CVS
  logistics_sub_type text,      -- FAMIC2C/UNIMARTC2C/HILIFEC2C/OKMARTC2C

  goods_amount int,
  is_collection text,           -- Y/N
  collection_amount int,

  goods_name text,
  quantity int,

  sender_name text,
  sender_phone text,
  sender_cellphone text,
  sender_zip_code text,
  sender_address text,

  receiver_name text,
  receiver_phone text,
  receiver_cellphone text,
  receiver_email text,
  receiver_zip_code text,
  receiver_address text,

  receiver_store_id text,
  receiver_store_name text,
  receiver_store_address text,

  server_reply_url text,
  client_reply_url text,

  logistics_id text,
  booking_note text,
  trade_desc text,

  temperature text,
  distance text,
  specification text,

  scheduled_pickup_time text,
  scheduled_delivery_time text,
  scheduled_delivery_date text,

  remark text,
  platform_id text,

  check_mac_value text,
  status text,                  -- pending/created/printed/delivered/returned/failed
  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_c2c_logistics_order_trade_no on public.fronted_c2c_logistics_order(merchant_trade_no);
create index if not exists idx_fronted_c2c_logistics_order_logistics_id on public.fronted_c2c_logistics_order(logistics_id);
create trigger t_fronted_c2c_logistics_order_updated before update on public.fronted_c2c_logistics_order for each row execute function set_updated_at();

-- 2) B2C convenience store (大宗寄倉)
create table if not exists public.fronted_b2c_logistics_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  merchant_id text,
  merchant_trade_no text unique,
  logistics_type text,          -- CVS
  logistics_sub_type text,      -- FAMI/B2C UNIMART/B2C ...（依實際代碼填）

  goods_amount int,
  is_collection text,
  collection_amount int,

  goods_name text,
  quantity int,

  sender_name text,
  sender_phone text,
  sender_cellphone text,
  sender_zip_code text,
  sender_address text,

  receiver_name text,
  receiver_phone text,
  receiver_cellphone text,
  receiver_email text,
  receiver_zip_code text,
  receiver_address text,

  receiver_store_id text,
  receiver_store_name text,
  receiver_store_address text,

  server_reply_url text,
  client_reply_url text,

  logistics_id text,
  booking_note text,
  trade_desc text,

  temperature text,
  distance text,
  specification text,

  scheduled_pickup_time text,
  scheduled_delivery_time text,
  scheduled_delivery_date text,

  remark text,
  platform_id text,

  check_mac_value text,
  status text,
  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_b2c_logistics_order_trade_no on public.fronted_b2c_logistics_order(merchant_trade_no);
create index if not exists idx_fronted_b2c_logistics_order_logistics_id on public.fronted_b2c_logistics_order(logistics_id);
create trigger t_fronted_b2c_logistics_order_updated before update on public.fronted_b2c_logistics_order for each row execute function set_updated_at();

-- 3) Home delivery (宅配到府)
create table if not exists public.fronted_home_logistics_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  merchant_id text,
  merchant_trade_no text unique,
  logistics_type text,          -- Home
  logistics_sub_type text,      -- TCat/ECAN ...（依實際代碼填）

  goods_amount int,
  is_collection text,
  collection_amount int,

  goods_name text,
  quantity int,

  sender_name text,
  sender_phone text,
  sender_cellphone text,
  sender_zip_code text,
  sender_address text,

  receiver_name text,
  receiver_phone text,
  receiver_cellphone text,
  receiver_email text,
  receiver_zip_code text,
  receiver_address text,

  server_reply_url text,
  client_reply_url text,

  logistics_id text,
  booking_note text,
  trade_desc text,

  temperature text,
  distance text,
  specification text,

  scheduled_pickup_time text,
  scheduled_delivery_time text,
  scheduled_delivery_date text,

  remark text,
  platform_id text,

  check_mac_value text,
  status text,
  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_home_logistics_order_trade_no on public.fronted_home_logistics_order(merchant_trade_no);
create index if not exists idx_fronted_home_logistics_order_logistics_id on public.fronted_home_logistics_order(logistics_id);
create trigger t_fronted_home_logistics_order_updated before update on public.fronted_home_logistics_order for each row execute function set_updated_at();

-- 4) B2C reverse logistics (超商逆物流)
create table if not exists public.fronted_b2c_reverse_logistics_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  merchant_id text,
  merchant_trade_no text unique,
  logistics_type text,          -- CVS
  logistics_sub_type text,

  goods_amount int,
  is_collection text,
  collection_amount int,

  goods_name text,
  quantity int,

  sender_name text,
  sender_phone text,
  sender_cellphone text,
  sender_zip_code text,
  sender_address text,

  receiver_name text,
  receiver_phone text,
  receiver_cellphone text,
  receiver_email text,
  receiver_zip_code text,
  receiver_address text,

  receiver_store_id text,
  return_store_id text,

  server_reply_url text,
  client_reply_url text,

  logistics_id text,
  booking_note text,
  trade_desc text,

  temperature text,
  distance text,
  specification text,

  scheduled_pickup_time text,
  scheduled_delivery_time text,
  scheduled_delivery_date text,

  remark text,
  platform_id text,

  check_mac_value text,
  status text,
  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_b2c_reverse_logistics_order_trade_no on public.fronted_b2c_reverse_logistics_order(merchant_trade_no);
create index if not exists idx_fronted_b2c_reverse_logistics_order_logistics_id on public.fronted_b2c_reverse_logistics_order(logistics_id);
create trigger t_fronted_b2c_reverse_logistics_order_updated before update on public.fronted_b2c_reverse_logistics_order for each row execute function set_updated_at();

-- 5) Home reverse logistics (宅配逆物流)
create table if not exists public.fronted_home_reverse_logistics_order (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  merchant_id text,
  merchant_trade_no text unique,
  logistics_type text,          -- Home
  logistics_sub_type text,

  goods_amount int,
  is_collection text,
  collection_amount int,

  goods_name text,
  quantity int,

  sender_name text,
  sender_phone text,
  sender_cellphone text,
  sender_zip_code text,
  sender_address text,

  receiver_name text,
  receiver_phone text,
  receiver_cellphone text,
  receiver_email text,
  receiver_zip_code text,
  receiver_address text,

  server_reply_url text,
  client_reply_url text,

  logistics_id text,
  booking_note text,
  trade_desc text,

  temperature text,
  distance text,
  specification text,

  scheduled_pickup_time text,
  scheduled_delivery_time text,
  scheduled_delivery_date text,

  remark text,
  platform_id text,

  check_mac_value text,
  status text,
  raw_result jsonb default '{}'::jsonb
);
create index if not exists idx_fronted_home_reverse_logistics_order_trade_no on public.fronted_home_reverse_logistics_order(merchant_trade_no);
create index if not exists idx_fronted_home_reverse_logistics_order_logistics_id on public.fronted_home_reverse_logistics_order(logistics_id);
create trigger t_fronted_home_reverse_logistics_order_updated before update on public.fronted_home_reverse_logistics_order for each row execute function set_updated_at();
