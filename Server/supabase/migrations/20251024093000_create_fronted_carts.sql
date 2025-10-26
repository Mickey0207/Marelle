-- Migration: Create fronted_carts and fronted_cart_items (frontend carts)
-- Date: 2025-10-24
-- Notes:
-- - Aligns with naming rules (fronted_ prefix for frontend tables)
-- - Cart items reference backend_products(id) and backend_products_inventory(id)
-- - RLS restricts access to the owning user (via fronted_carts.user_id)

begin;

-- Ensure pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Helper updated_at trigger function (reused if already exists)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end $$;

-- =============================
-- Table: public.fronted_carts
-- =============================
create table if not exists public.fronted_carts (
  id uuid primary key default gen_random_uuid(),

  -- Owner (nullable for guest carts)
  user_id uuid null references public.fronted_users(id) on delete set null,

  -- Guest token for anonymous carts (server issues and reads from HttpOnly cookie)
  guest_token text null,

  -- Lifecycle
  status text not null default 'active', -- active | merged | abandoned | converted
  expires_at timestamptz null,

  -- Currency & totals (snapshot-style)
  currency text not null default 'TWD',
  subtotal_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  shipping_fee_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  grand_total_amount numeric(12,2) not null default 0,
  total_quantity integer not null default 0,

  -- Merge lineage and misc
  merged_from_cart_id uuid null references public.fronted_carts(id) on delete set null,
  coupon_code text null,
  source_channel text null,
  schema_version int not null default 1,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.fronted_carts is 'Frontend shopping carts. One active cart per user or per guest_token.';

-- updated_at trigger
drop trigger if exists trg_fronted_carts_updated_at on public.fronted_carts;
create trigger trg_fronted_carts_updated_at
before update on public.fronted_carts
for each row execute function public.set_updated_at();

-- Partial unique indexes to ensure at most one active cart per user/guest
create unique index if not exists uq_fronted_carts_active_user
  on public.fronted_carts(user_id)
  where status = 'active' and user_id is not null;

create unique index if not exists uq_fronted_carts_active_guest
  on public.fronted_carts(guest_token)
  where status = 'active' and guest_token is not null;

create index if not exists idx_fronted_carts_user_status on public.fronted_carts(user_id, status);
create index if not exists idx_fronted_carts_updated_at on public.fronted_carts(updated_at desc);

-- Enable RLS and policies (only owner can access)
alter table public.fronted_carts enable row level security;

drop policy if exists fronted_carts_select_own on public.fronted_carts;
create policy fronted_carts_select_own on public.fronted_carts
for select using (
  user_id is not null and auth.uid() = user_id
);

drop policy if exists fronted_carts_insert_own on public.fronted_carts;
create policy fronted_carts_insert_own on public.fronted_carts
for insert with check (
  user_id is not null and auth.uid() = user_id
);

drop policy if exists fronted_carts_update_own on public.fronted_carts;
create policy fronted_carts_update_own on public.fronted_carts
for update using (
  user_id is not null and auth.uid() = user_id
)
with check (
  user_id is not null and auth.uid() = user_id
);

drop policy if exists fronted_carts_delete_own on public.fronted_carts;
create policy fronted_carts_delete_own on public.fronted_carts
for delete using (
  user_id is not null and auth.uid() = user_id
);

-- ==================================
-- Table: public.fronted_cart_items
-- ==================================
create table if not exists public.fronted_cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.fronted_carts(id) on delete cascade,

  -- Product and variant bindings
  product_id bigint not null references public.backend_products(id) on delete restrict,
  inventory_id bigint not null references public.backend_products_inventory(id) on delete restrict,
  sku_key text null,

  -- Snapshot and quantity
  name_snapshot text not null,
  image_url text null,
  selected_options jsonb not null default '{}'::jsonb,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null default 0,
  currency text not null default 'TWD',
  line_total_amount numeric(12,2) not null default 0,
  is_gift boolean not null default false,

  added_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb
);

comment on table public.fronted_cart_items is 'Items in a frontend cart. Each row binds to a concrete inventory (variant).';

-- Prevent duplicate same-variant rows
create unique index if not exists uq_fronted_cart_items_cart_inventory
  on public.fronted_cart_items(cart_id, inventory_id);

create index if not exists idx_fronted_cart_items_cart on public.fronted_cart_items(cart_id);
create index if not exists idx_fronted_cart_items_product on public.fronted_cart_items(product_id);
create index if not exists idx_fronted_cart_items_inventory on public.fronted_cart_items(inventory_id);

-- updated_at trigger
drop trigger if exists trg_fronted_cart_items_updated_at on public.fronted_cart_items;
create trigger trg_fronted_cart_items_updated_at
before update on public.fronted_cart_items
for each row execute function public.set_updated_at();

-- Recalculate cart totals after item changes
create or replace function public.fronted_cart_recalc_totals(p_cart_id uuid)
returns void language plpgsql as $$
begin
  update public.fronted_carts c
  set total_quantity = coalesce(s.sum_qty, 0),
      subtotal_amount = coalesce(s.sum_amount, 0),
      -- discount/shipping/tax are managed by pricing engine; keep as-is here
      grand_total_amount = coalesce(s.sum_amount, 0) - discount_amount + shipping_fee_amount + tax_amount,
      updated_at = timezone('utc', now())
  from (
    select i.cart_id,
           sum(i.quantity) as sum_qty,
           sum(i.unit_price * i.quantity) as sum_amount
    from public.fronted_cart_items i
    where i.cart_id = p_cart_id
    group by i.cart_id
  ) s
  where c.id = p_cart_id;
end $$;

-- Triggers: after change on items, recalc the owning cart
-- Create a single trigger function to handle insert/update/delete
create or replace function public.fronted_cart_items_recalc_aiud()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'DELETE' then
    perform public.fronted_cart_recalc_totals(OLD.cart_id);
  else
    perform public.fronted_cart_recalc_totals(NEW.cart_id);
  end if;
  return null;
end $$;

drop trigger if exists trg_fronted_cart_items_recalc_aiud on public.fronted_cart_items;
create trigger trg_fronted_cart_items_recalc_aiud
after insert or update or delete on public.fronted_cart_items
for each row execute function public.fronted_cart_items_recalc_aiud();

-- RLS: only owner of the parent cart can access items
alter table public.fronted_cart_items enable row level security;

drop policy if exists fronted_cart_items_select_own on public.fronted_cart_items;
create policy fronted_cart_items_select_own on public.fronted_cart_items
for select using (
  exists (
    select 1 from public.fronted_carts c
    where c.id = cart_id and c.user_id is not null and c.user_id = auth.uid()
  )
);

drop policy if exists fronted_cart_items_insert_own on public.fronted_cart_items;
create policy fronted_cart_items_insert_own on public.fronted_cart_items
for insert with check (
  exists (
    select 1 from public.fronted_carts c
    where c.id = cart_id and c.user_id is not null and c.user_id = auth.uid()
  )
);

drop policy if exists fronted_cart_items_update_own on public.fronted_cart_items;
create policy fronted_cart_items_update_own on public.fronted_cart_items
for update using (
  exists (
    select 1 from public.fronted_carts c
    where c.id = cart_id and c.user_id is not null and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.fronted_carts c
    where c.id = cart_id and c.user_id is not null and c.user_id = auth.uid()
  )
);

drop policy if exists fronted_cart_items_delete_own on public.fronted_cart_items;
create policy fronted_cart_items_delete_own on public.fronted_cart_items
for delete using (
  exists (
    select 1 from public.fronted_carts c
    where c.id = cart_id and c.user_id is not null and c.user_id = auth.uid()
  )
);

commit;
