-- Recreate backend_products_cetegory table (note: user's spelling with 'cetegory')
-- This is for product category management

create table if not exists public.backend_products_cetegory (
  id bigserial primary key,
  parent_id bigint null references public.backend_products_cetegory(id) on delete cascade,
  name text not null,
  slug text not null unique,
  image_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.backend_products_cetegory enable row level security;

-- Policies for backend admins (auth.uid in backend_admins)
do $$ begin
  execute 'drop policy if exists backend_cetegory_select on public.backend_products_cetegory';
  execute 'create policy backend_cetegory_select on public.backend_products_cetegory for select using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';

  execute 'drop policy if exists backend_cetegory_insert on public.backend_products_cetegory';
  execute 'create policy backend_cetegory_insert on public.backend_products_cetegory for insert with check (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';

  execute 'drop policy if exists backend_cetegory_update on public.backend_products_cetegory';
  execute 'create policy backend_cetegory_update on public.backend_products_cetegory for update using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';

  execute 'drop policy if exists backend_cetegory_delete on public.backend_products_cetegory';
  execute 'create policy backend_cetegory_delete on public.backend_products_cetegory for delete using (exists (select 1 from public.backend_admins a where a.id = auth.uid()))';
end $$;

-- Seed sample categories
insert into public.backend_products_cetegory (name, slug, image_url)
values
  ('女裝', 'c-f', null),
  ('男裝', 'c-m', null),
  ('通用', 'c-u', null)
on conflict (slug) do nothing;

-- Add child categories
insert into public.backend_products_cetegory (name, slug, parent_id, image_url)
select '洋裝', 'c-f-d', p.id, null
from public.backend_products_cetegory p
where p.slug = 'c-f' and not exists (select 1 from public.backend_products_cetegory where slug = 'c-f-d')
on conflict (slug) do nothing;

insert into public.backend_products_cetegory (name, slug, parent_id, image_url)
select '上衣', 'c-f-t', p.id, null
from public.backend_products_cetegory p
where p.slug = 'c-f' and not exists (select 1 from public.backend_products_cetegory where slug = 'c-f-t')
on conflict (slug) do nothing;

insert into public.backend_products_cetegory (name, slug, parent_id, image_url)
select '外套', 'c-m-t', p.id, null
from public.backend_products_cetegory p
where p.slug = 'c-m' and not exists (select 1 from public.backend_products_cetegory where slug = 'c-m-t')
on conflict (slug) do nothing;

insert into public.backend_products_cetegory (name, slug, parent_id, image_url)
select '褲裝', 'c-u-b-1', p.id, null
from public.backend_products_cetegory p
where p.slug = 'c-u' and not exists (select 1 from public.backend_products_cetegory where slug = 'c-u-b-1')
on conflict (slug) do nothing;
