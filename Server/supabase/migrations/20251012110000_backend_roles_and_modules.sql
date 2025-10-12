-- Seed all sidebar modules into backend_modules and create role->modules mapping table

-- 1) Seed modules (idempotent)
insert into public.backend_modules (key, name, is_active)
values
  ('dashboard', '總覽', true),
  ('products', '商品管理', true),
  ('inventory', '庫存管理', true),
  ('orders', '訂單管理', true),
  ('logistics', '物流管理', true),
  ('notifications', '通知管理', true),
  ('marketing', '行銷管理', true),
  ('members', '會員管理', true),
  ('procurement', '採購管理', true),
  ('accounting', '會計管理', true),
  ('reviews', '評價管理', true),
  ('fromsigning', '表單審批', true),
  ('admin', '管理員管理', true),
  ('user-tracking', '用戶追蹤', true),
  ('analytics', '數據分析', true),
  ('settings', '系統設定', true)
on conflict (key) do nothing;

-- 2) Role -> modules matrix table (wide, boolean columns per module)
-- Column names must be valid identifiers; use snake_case for modules
create table if not exists public.backend_role_modules (
  role text primary key,
  dashboard boolean not null default false,
  products boolean not null default false,
  inventory boolean not null default false,
  orders boolean not null default false,
  logistics boolean not null default false,
  notifications boolean not null default false,
  marketing boolean not null default false,
  members boolean not null default false,
  procurement boolean not null default false,
  accounting boolean not null default false,
  reviews boolean not null default false,
  fromsigning boolean not null default false,
  admin boolean not null default false,
  user_tracking boolean not null default false,
  analytics boolean not null default false,
  settings boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint backend_role_modules_role_check check (role in ('Admin','Manager','Staff'))
);

-- trigger to keep updated_at fresh
create or replace function public.set_updated_at_role_modules()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_backend_role_modules_updated_at on public.backend_role_modules;
create trigger trg_backend_role_modules_updated_at
before update on public.backend_role_modules
for each row execute procedure public.set_updated_at_role_modules();

-- 3) RLS policies
alter table public.backend_role_modules enable row level security;

-- allow select to authenticated users
drop policy if exists "backend_role_modules_select_all" on public.backend_role_modules;
create policy "backend_role_modules_select_all" on public.backend_role_modules
  for select to authenticated
  using (true);

-- NOTE: No insert/update/delete policies for regular authenticated users (managed by service role or migrations)

-- 4) Seed default role permissions (idempotent)
-- Admin: all modules
insert into public.backend_role_modules (role, dashboard, products, inventory, orders, logistics, notifications, marketing, members, procurement, accounting, reviews, fromsigning, admin, user_tracking, analytics, settings)
values ('Admin', true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true)
on conflict (role) do update set
  dashboard=excluded.dashboard,
  products=excluded.products,
  inventory=excluded.inventory,
  orders=excluded.orders,
  logistics=excluded.logistics,
  notifications=excluded.notifications,
  marketing=excluded.marketing,
  members=excluded.members,
  procurement=excluded.procurement,
  accounting=excluded.accounting,
  reviews=excluded.reviews,
  fromsigning=excluded.fromsigning,
  admin=excluded.admin,
  user_tracking=excluded.user_tracking,
  analytics=excluded.analytics,
  settings=excluded.settings;

-- Manager: 常用模組（不含 admin、部分設定/會計可依需求調整）
insert into public.backend_role_modules (role, dashboard, products, inventory, orders, logistics, notifications, marketing, members, procurement, accounting, reviews, fromsigning, admin, user_tracking, analytics, settings)
values ('Manager', true,true,true,true,true,true,true,true,true,false,true,true,false,true,true,false)
on conflict (role) do update set
  dashboard=excluded.dashboard,
  products=excluded.products,
  inventory=excluded.inventory,
  orders=excluded.orders,
  logistics=excluded.logistics,
  notifications=excluded.notifications,
  marketing=excluded.marketing,
  members=excluded.members,
  procurement=excluded.procurement,
  accounting=excluded.accounting,
  reviews=excluded.reviews,
  fromsigning=excluded.fromsigning,
  admin=excluded.admin,
  user_tracking=excluded.user_tracking,
  analytics=excluded.analytics,
  settings=excluded.settings;

-- Staff: 基礎模組（只讀或有限操作；細節到動作層再分）
insert into public.backend_role_modules (role, dashboard, products, inventory, orders, logistics, notifications, marketing, members, procurement, accounting, reviews, fromsigning, admin, user_tracking, analytics, settings)
values ('Staff', true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false)
on conflict (role) do update set
  dashboard=excluded.dashboard,
  products=excluded.products,
  inventory=excluded.inventory,
  orders=excluded.orders,
  logistics=excluded.logistics,
  notifications=excluded.notifications,
  marketing=excluded.marketing,
  members=excluded.members,
  procurement=excluded.procurement,
  accounting=excluded.accounting,
  reviews=excluded.reviews,
  fromsigning=excluded.fromsigning,
  admin=excluded.admin,
  user_tracking=excluded.user_tracking,
  analytics=excluded.analytics,
  settings=excluded.settings;
