-- backend catalog: products, categories, inventory
-- enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type public.product_status as enum ('draft','active','archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'product_visibility') then
    create type public.product_visibility as enum ('public','hidden');
  end if;
  if not exists (select 1 from pg_type where typname = 'inventory_status') then
    create type public.inventory_status as enum ('in_stock','low_stock','out_of_stock','backorder','preorder');
  end if;
end $$;

-- helper updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- categories
create table if not exists public.backend_product_categories (
  id bigserial primary key,
  parent_id bigint null references public.backend_product_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  image_url text null,
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_backend_product_categories_updated_at on public.backend_product_categories;
create trigger trg_backend_product_categories_updated_at
before update on public.backend_product_categories
for each row execute function public.set_updated_at();
create index if not exists idx_backend_product_categories_parent on public.backend_product_categories(parent_id);

-- products
create table if not exists public.backend_products (
  id bigserial primary key,
  category_id bigint null references public.backend_product_categories(id) on delete set null,
  route_slug text not null unique,
  base_sku text not null unique,
  title text not null,
  short_description text null,
  description_md text null,
  description_html text null,
  tags text[] null,
  sale_price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2) null,
  cost_price numeric(12,2) null,
  profit numeric(12,2) generated always as (coalesce(sale_price,0) - coalesce(cost_price,0)) stored,
  status public.product_status not null default 'draft',
  visibility public.product_visibility not null default 'public',
  is_featured boolean not null default false,
  image_url_1 text null,
  image_url_2 text null,
  image_url_3 text null,
  image_url_4 text null,
  image_url_5 text null,
  image_url_6 text null,
  image_url_7 text null,
  image_url_8 text null,
  image_url_9 text null,
  image_url_10 text null,
  title_tag text null,
  meta_description text null,
  sitemap_indexing boolean not null default true,
  page_canonical_url text null,
  open_graph_image_url text null,
  search_title text null,
  search_description text null,
  search_image_url text null,
  search_exclude boolean not null default false,
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_backend_products_updated_at on public.backend_products;
create trigger trg_backend_products_updated_at
before update on public.backend_products
for each row execute function public.set_updated_at();
create index if not exists idx_backend_products_status on public.backend_products(status);
create index if not exists idx_backend_products_visibility on public.backend_products(visibility);
create index if not exists idx_backend_products_tags on public.backend_products using gin(tags);

-- inventory
create table if not exists public.backend_product_inventory (
  id bigserial primary key,
  product_id bigint not null references public.backend_products(id) on delete cascade,
  enabled boolean not null default true,
  variant_name text null,
  variant_spec jsonb not null default '{}'::jsonb,
  sale_price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2) null,
  cost_price numeric(12,2) null,
  average_cost numeric(12,2) null default 0,
  sku1 text null,
  sku2 text null,
  sku3 text null,
  sku4 text null,
  sku5 text null,
  sku_key text generated always as (
    coalesce(sku1,'') || '::' ||
    coalesce(sku2,'') || '::' ||
    coalesce(sku3,'') || '::' ||
    coalesce(sku4,'') || '::' ||
    coalesce(sku5,'')
  ) stored,
  image_url_1 text null,
  image_url_2 text null,
  image_url_3 text null,
  qrcode_value text null,
  track_inventory boolean not null default true,
  allow_backorder boolean not null default false,
  allow_preorder boolean not null default false,
  warehouse text null,
  current_stock_qty integer not null default 0,
  safety_stock_qty integer not null default 0,
  derived_status public.inventory_status not null default 'in_stock',
  status_override public.inventory_status null,
  effective_status public.inventory_status generated always as (coalesce(status_override, derived_status)) stored,
  stock_value numeric(14,2) generated always as (coalesce(average_cost,0) * coalesce(current_stock_qty,0)) stored,
  last_sold_at timestamptz null,
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, sku_key)
);
drop trigger if exists trg_backend_product_inventory_updated_at on public.backend_product_inventory;
create trigger trg_backend_product_inventory_updated_at
before update on public.backend_product_inventory
for each row execute function public.set_updated_at();
create index if not exists idx_backend_product_inventory_product on public.backend_product_inventory(product_id);
create index if not exists idx_backend_product_inventory_enabled on public.backend_product_inventory(enabled);
create index if not exists idx_backend_product_inventory_status on public.backend_product_inventory(effective_status);

-- trigger to derive inventory status
create or replace function public.update_inventory_derived_status()
returns trigger language plpgsql as $$
begin
  if new.allow_preorder then
    new.derived_status := 'preorder';
  elsif coalesce(new.current_stock_qty,0) <= 0 then
    if new.allow_backorder then
      new.derived_status := 'backorder';
    else
      new.derived_status := 'out_of_stock';
    end if;
  elsif coalesce(new.current_stock_qty,0) < coalesce(new.safety_stock_qty,0) then
    new.derived_status := 'low_stock';
  else
    new.derived_status := 'in_stock';
  end if;
  return new;
end $$;

drop trigger if exists trg_backend_product_inventory_derive on public.backend_product_inventory;
create trigger trg_backend_product_inventory_derive
before insert or update of allow_preorder, allow_backorder, current_stock_qty, safety_stock_qty on public.backend_product_inventory
for each row execute function public.update_inventory_derived_status();

-- RLS enable
alter table public.backend_product_categories enable row level security;
alter table public.backend_products enable row level security;
alter table public.backend_product_inventory enable row level security;

-- Policies: allow backend admins (auth.uid in backend_admins)
do $$ begin
  -- categories
  execute 'drop policy if exists backend_cat_select on public.backend_product_categories';
  execute 'create policy backend_cat_select on public.backend_product_categories for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_cat_ins on public.backend_product_categories';
  execute 'create policy backend_cat_ins on public.backend_product_categories for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_cat_upd on public.backend_product_categories';
  execute 'create policy backend_cat_upd on public.backend_product_categories for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_cat_del on public.backend_product_categories';
  execute 'create policy backend_cat_del on public.backend_product_categories for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';

  -- products
  execute 'drop policy if exists backend_prod_select on public.backend_products';
  execute 'create policy backend_prod_select on public.backend_products for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_prod_ins on public.backend_products';
  execute 'create policy backend_prod_ins on public.backend_products for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_prod_upd on public.backend_products';
  execute 'create policy backend_prod_upd on public.backend_products for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_prod_del on public.backend_products';
  execute 'create policy backend_prod_del on public.backend_products for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';

  -- inventory
  execute 'drop policy if exists backend_inv_select on public.backend_product_inventory';
  execute 'create policy backend_inv_select on public.backend_product_inventory for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_inv_ins on public.backend_product_inventory';
  execute 'create policy backend_inv_ins on public.backend_product_inventory for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_inv_upd on public.backend_product_inventory';
  execute 'create policy backend_inv_upd on public.backend_product_inventory for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  execute 'drop policy if exists backend_inv_del on public.backend_product_inventory';
  execute 'create policy backend_inv_del on public.backend_product_inventory for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
end $$;

-- seed (best-effort; created_by/updated_by nullable)
insert into public.backend_product_categories (name, slug, image_url)
values ('上衣', 'tops', null), ('鞋款', 'shoes', null)
on conflict (slug) do nothing;

insert into public.backend_products (
  category_id, route_slug, base_sku, title, short_description,
  description_md, sale_price, compare_at_price, cost_price, status,
  visibility, is_featured, image_url_1, title_tag, meta_description,
  sitemap_indexing, page_canonical_url, open_graph_image_url,
  search_title, search_description, search_image_url, search_exclude
)
select c.id, 'basic-tee', 'SKU-TEE-BASE', 'Basic Tee', '柔軟棉質 T 恤',
  '# Basic Tee\n舒適好穿。', 399, 599, 150, 'active'::public.product_status,
  'public'::public.product_visibility, true, null, 'Basic Tee', '舒適棉質T',
  true, null, null, 'Basic Tee', '舒適棉質T', null, false
from public.backend_product_categories c where c.slug='tops'
on conflict (route_slug) do nothing;

-- create 2 variants for basic-tee if not exists
insert into public.backend_product_inventory (
  product_id, enabled, variant_name, variant_spec, sale_price, cost_price,
  sku1, sku2, track_inventory, allow_backorder, allow_preorder,
  warehouse, current_stock_qty, safety_stock_qty
)
select p.id, true, 'Basic Tee / 黑 / M', '{"顏色":"黑","尺寸":"M"}'::jsonb, 399, 150,
  'TEE-BLACK', 'M', true, false, false, '主倉', 20, 5
from public.backend_products p where p.route_slug='basic-tee'
on conflict do nothing;

insert into public.backend_product_inventory (
  product_id, enabled, variant_name, variant_spec, sale_price, cost_price,
  sku1, sku2, track_inventory, allow_backorder, allow_preorder,
  warehouse, current_stock_qty, safety_stock_qty
)
select p.id, true, 'Basic Tee / 白 / L', '{"顏色":"白","尺寸":"L"}'::jsonb, 399, 150,
  'TEE-WHITE', 'L', true, false, false, '主倉', 0, 3
from public.backend_products p where p.route_slug='basic-tee'
on conflict do nothing;
