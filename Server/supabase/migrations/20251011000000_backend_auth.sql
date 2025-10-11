-- backend auth related tables and policies

-- 1) backend_admins: one row per authenticated admin (id aligns with auth.users.id)
create table if not exists public.backend_admins (
  id uuid primary key,
  email text not null,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) backend_modules: list of modules available in admin portal
create table if not exists public.backend_modules (
  key text primary key,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3) backend_admin_modules: mapping admin -> modules
create table if not exists public.backend_admin_modules (
  admin_id uuid not null references public.backend_admins(id) on delete cascade,
  module_key text not null references public.backend_modules(key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (admin_id, module_key)
);

-- trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_backend_admins_updated_at on public.backend_admins;
create trigger trg_backend_admins_updated_at
before update on public.backend_admins
for each row execute procedure public.set_updated_at();

-- enable RLS
alter table public.backend_admins enable row level security;
alter table public.backend_modules enable row level security;
alter table public.backend_admin_modules enable row level security;

-- policies: backend_admins
drop policy if exists "backend_admins_select_self" on public.backend_admins;
create policy "backend_admins_select_self" on public.backend_admins
  for select to authenticated
  using (id = auth.uid());

drop policy if exists "backend_admins_insert_self" on public.backend_admins;
create policy "backend_admins_insert_self" on public.backend_admins
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "backend_admins_update_self" on public.backend_admins;
create policy "backend_admins_update_self" on public.backend_admins
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- policies: backend_modules (read-only for authenticated)
drop policy if exists "backend_modules_select_active" on public.backend_modules;
create policy "backend_modules_select_active" on public.backend_modules
  for select to authenticated
  using (is_active = true);

-- policies: backend_admin_modules (only self)
drop policy if exists "backend_admin_modules_select_self" on public.backend_admin_modules;
create policy "backend_admin_modules_select_self" on public.backend_admin_modules
  for select to authenticated
  using (admin_id = auth.uid());

drop policy if exists "backend_admin_modules_insert_self" on public.backend_admin_modules;
create policy "backend_admin_modules_insert_self" on public.backend_admin_modules
  for insert to authenticated
  with check (admin_id = auth.uid());

drop policy if exists "backend_admin_modules_delete_self" on public.backend_admin_modules;
create policy "backend_admin_modules_delete_self" on public.backend_admin_modules
  for delete to authenticated
  using (admin_id = auth.uid());

-- seed default modules (idempotent)
insert into public.backend_modules (key, name)
values
  ('dashboard', '儀表板'),
  ('settings', '系統設定'),
  ('products', '商品管理')
on conflict (key) do nothing;
