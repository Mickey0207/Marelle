-- fronted_checkout_request: 暫存結帳時的物流建立需求，待付款成功後使用
create table if not exists public.fronted_checkout_request (
  merchant_trade_no text primary key,
  create_logistics boolean not null default false,
  logistics jsonb,
  order_json jsonb,
  payment_method text,
  logistics_created_at timestamptz,
  logistics_last_result jsonb,
  created_at timestamptz not null default now()
);

-- 僅後端服務可讀寫（使用 service-role），啟用 RLS
alter table public.fronted_checkout_request enable row level security;
-- 嚴格：不建立 anon / authenticated policy，僅 service-role 可操作
