-- Create backend product tables
-- Tables: backend_products, backend_products_photo, backend_products_seo

-- Helper function for updated_at trigger (if not exists)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Products main table
create table if not exists public.backend_products (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  short_description text null,
  description text not null,
  tags text[] null default '{}',
  base_sku text not null unique,
  has_variants boolean not null default false,
  status text not null default 'draft', -- draft, active, archived
  visibility text not null default 'visible', -- visible, hidden
  is_featured boolean not null default false,
  category_ids bigint[] null default '{}', -- Array of category IDs (many-to-many)
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for updated_at
drop trigger if exists trg_backend_products_updated_at on public.backend_products;
create trigger trg_backend_products_updated_at
before update on public.backend_products
for each row execute function public.set_updated_at();

create index if not exists idx_backend_products_slug on public.backend_products(slug);
create index if not exists idx_backend_products_status on public.backend_products(status);
create index if not exists idx_backend_products_visibility on public.backend_products(visibility);
create index if not exists idx_backend_products_base_sku on public.backend_products(base_sku);
create index if not exists idx_backend_products_tags on public.backend_products using gin(tags);

-- Product photos table (main images for product listing/detail)
create table if not exists public.backend_products_photo (
  id bigserial primary key,
  product_id bigint not null references public.backend_products(id) on delete cascade,
  image_url text not null,
  alt_text text null,
  display_order integer not null default 0,
  is_primary boolean not null default false, -- One primary image per product
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_backend_products_photo_product on public.backend_products_photo(product_id);
create index if not exists idx_backend_products_photo_order on public.backend_products_photo(product_id, display_order);

-- Product SEO table
create table if not exists public.backend_products_seo (
  id bigserial primary key,
  product_id bigint not null unique references public.backend_products(id) on delete cascade,
  
  -- Meta tags
  meta_title text null,
  meta_description text null,
  sitemap_indexing boolean not null default true,
  custom_canonical_url text null,
  
  -- Open Graph (social media)
  og_title text null,
  og_description text null,
  og_image_url text null,
  use_meta_title_for_og boolean not null default true,
  use_meta_description_for_og boolean not null default true,
  
  -- Search/Shopping
  search_title text null,
  search_description text null,
  search_image_url text null,
  use_meta_title_for_search boolean not null default true,
  use_meta_description_for_search boolean not null default true,
  use_og_image_for_search boolean not null default true,
  exclude_from_search boolean not null default false,
  
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_backend_products_seo_product on public.backend_products_seo(product_id);

-- Product prices table (for future use)
-- Will store pricing per product or per variant
create table if not exists public.backend_products_prices (
  id bigserial primary key,
  product_id bigint not null references public.backend_products(id) on delete cascade,
  
  -- Price info (for products without variants)
  sale_price numeric(12,2) null,
  compare_at_price numeric(12,2) null,
  cost_price numeric(12,2) null,
  
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_backend_products_prices_product on public.backend_products_prices(product_id);

-- Product inventory table (for future use)
-- Will store inventory per product or per variant
create table if not exists public.backend_products_inventory (
  id bigserial primary key,
  product_id bigint not null references public.backend_products(id) on delete cascade,
  
  -- Inventory tracking
  sku_key text null, -- For variants: combination of variant SKUs
  current_stock_qty integer not null default 0,
  safety_stock_qty integer not null default 0,
  warehouse text null,
  
  -- Status
  track_inventory boolean not null default true,
  allow_backorder boolean not null default false,
  allow_preorder boolean not null default false,
  
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_backend_products_inventory_product on public.backend_products_inventory(product_id);
create index if not exists idx_backend_products_inventory_sku on public.backend_products_inventory(sku_key);

-- Enable RLS
alter table public.backend_products enable row level security;
alter table public.backend_products_photo enable row level security;
alter table public.backend_products_seo enable row level security;
alter table public.backend_products_prices enable row level security;
alter table public.backend_products_inventory enable row level security;

-- RLS Policies for backend admins
do $$ begin
  -- Products
  execute 'drop policy if exists backend_products_select on public.backend_products';
  execute 'create policy backend_products_select on public.backend_products for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_insert on public.backend_products';
  execute 'create policy backend_products_insert on public.backend_products for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_update on public.backend_products';
  execute 'create policy backend_products_update on public.backend_products for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_delete on public.backend_products';
  execute 'create policy backend_products_delete on public.backend_products for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  -- Product photos
  execute 'drop policy if exists backend_products_photo_select on public.backend_products_photo';
  execute 'create policy backend_products_photo_select on public.backend_products_photo for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_photo_insert on public.backend_products_photo';
  execute 'create policy backend_products_photo_insert on public.backend_products_photo for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_photo_update on public.backend_products_photo';
  execute 'create policy backend_products_photo_update on public.backend_products_photo for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_photo_delete on public.backend_products_photo';
  execute 'create policy backend_products_photo_delete on public.backend_products_photo for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  -- Product SEO
  execute 'drop policy if exists backend_products_seo_select on public.backend_products_seo';
  execute 'create policy backend_products_seo_select on public.backend_products_seo for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_seo_insert on public.backend_products_seo';
  execute 'create policy backend_products_seo_insert on public.backend_products_seo for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_seo_update on public.backend_products_seo';
  execute 'create policy backend_products_seo_update on public.backend_products_seo for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_seo_delete on public.backend_products_seo';
  execute 'create policy backend_products_seo_delete on public.backend_products_seo for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  -- Product prices
  execute 'drop policy if exists backend_products_prices_select on public.backend_products_prices';
  execute 'create policy backend_products_prices_select on public.backend_products_prices for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_prices_insert on public.backend_products_prices';
  execute 'create policy backend_products_prices_insert on public.backend_products_prices for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_prices_update on public.backend_products_prices';
  execute 'create policy backend_products_prices_update on public.backend_products_prices for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_prices_delete on public.backend_products_prices';
  execute 'create policy backend_products_prices_delete on public.backend_products_prices for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  -- Product inventory
  execute 'drop policy if exists backend_products_inventory_select on public.backend_products_inventory';
  execute 'create policy backend_products_inventory_select on public.backend_products_inventory for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_inventory_insert on public.backend_products_inventory';
  execute 'create policy backend_products_inventory_insert on public.backend_products_inventory for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_inventory_update on public.backend_products_inventory';
  execute 'create policy backend_products_inventory_update on public.backend_products_inventory for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
  
  execute 'drop policy if exists backend_products_inventory_delete on public.backend_products_inventory';
  execute 'create policy backend_products_inventory_delete on public.backend_products_inventory for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
end $$;
