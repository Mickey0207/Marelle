begin;

-- Types
do $$ begin
  if not exists (select 1 from pg_type where typname = 'fronted_address_type') then
    create type fronted_address_type as enum ('home','cvs');
  end if;
end $$;

-- Zip map (3-digit)
create table if not exists public.fronted_address_zip_map (
  zip3 text primary key,
  city text not null,
  district text not null
);
comment on table public.fronted_address_zip_map is '3-digit ZIP to city/district mapping for Taiwan.';

-- Home addresses
create table if not exists public.fronted_users_home_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type fronted_address_type not null default 'home',
  alias text check (alias is null or char_length(alias) <= 50),
  is_default boolean not null default false,
  is_archived boolean not null default false,
  receiver_name text not null,
  receiver_phone text not null,
  zip3 text not null,
  city text not null,
  district text not null,
  address_line text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint fk_zip3_exists foreign key (zip3) references public.fronted_address_zip_map(zip3) on update cascade on delete restrict,
  constraint chk_phone_tw_mobile check (receiver_phone ~ '^09[0-9]{8}$'),
  constraint chk_addr_single_line check (address_line !~ '[\r\n]'),
  constraint chk_home_type_fixed check (type = 'home')
);
comment on table public.fronted_users_home_addresses is 'User address book for home delivery.';

-- CVS addresses
create table if not exists public.fronted_users_cvs_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type fronted_address_type not null default 'cvs',
  alias text check (alias is null or char_length(alias) <= 50),
  is_default boolean not null default false,
  is_archived boolean not null default false,
  vendor text not null check (vendor in ('UNIMARTC2C','FAMIC2C','HILIFEC2C','OKMARTC2C')),
  store_id text not null,
  store_name text not null,
  store_address text not null,
  receiver_name text,
  receiver_phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint chk_store_addr_single_line check (store_address !~ '[\r\n]'),
  constraint chk_cvs_type_fixed check (type = 'cvs'),
  constraint chk_cvs_phone_format check (receiver_phone is null or receiver_phone ~ '^09[0-9]{8}$')
);
comment on table public.fronted_users_cvs_addresses is 'User address book for convenience store pickup.';

-- Indexes
create index if not exists idx_home_user on public.fronted_users_home_addresses(user_id);
create index if not exists idx_home_user_default on public.fronted_users_home_addresses(user_id) where is_default = true and is_archived = false;
create unique index if not exists uq_home_only_one_default on public.fronted_users_home_addresses(user_id) where is_default = true and is_archived = false;
create unique index if not exists uq_home_alias_per_user on public.fronted_users_home_addresses(user_id, alias) where alias is not null and is_archived = false;

create index if not exists idx_cvs_user on public.fronted_users_cvs_addresses(user_id);
create index if not exists idx_cvs_user_default on public.fronted_users_cvs_addresses(user_id) where is_default = true and is_archived = false;
create unique index if not exists uq_cvs_only_one_default on public.fronted_users_cvs_addresses(user_id) where is_default = true and is_archived = false;
create unique index if not exists uq_cvs_alias_per_user on public.fronted_users_cvs_addresses(user_id, alias) where alias is not null and is_archived = false;

-- RLS
alter table public.fronted_users_home_addresses enable row level security;
alter table public.fronted_users_cvs_addresses enable row level security;

-- Policies for home
drop policy if exists fua_home_select on public.fronted_users_home_addresses;
create policy fua_home_select on public.fronted_users_home_addresses for select using (auth.uid() = user_id);

drop policy if exists fua_home_insert on public.fronted_users_home_addresses;
create policy fua_home_insert on public.fronted_users_home_addresses for insert with check (auth.uid() = user_id);

drop policy if exists fua_home_update on public.fronted_users_home_addresses;
create policy fua_home_update on public.fronted_users_home_addresses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists fua_home_delete on public.fronted_users_home_addresses;
create policy fua_home_delete on public.fronted_users_home_addresses for delete using (auth.uid() = user_id);

-- Policies for cvs
drop policy if exists fua_cvs_select on public.fronted_users_cvs_addresses;
create policy fua_cvs_select on public.fronted_users_cvs_addresses for select using (auth.uid() = user_id);

drop policy if exists fua_cvs_insert on public.fronted_users_cvs_addresses;
create policy fua_cvs_insert on public.fronted_users_cvs_addresses for insert with check (auth.uid() = user_id);

drop policy if exists fua_cvs_update on public.fronted_users_cvs_addresses;
create policy fua_cvs_update on public.fronted_users_cvs_addresses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists fua_cvs_delete on public.fronted_users_cvs_addresses;
create policy fua_cvs_delete on public.fronted_users_cvs_addresses for delete using (auth.uid() = user_id);

-- updated_at trigger shared
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end $$;

drop trigger if exists trg_home_updated on public.fronted_users_home_addresses;
create trigger trg_home_updated before update on public.fronted_users_home_addresses for each row execute function public.set_updated_at();

drop trigger if exists trg_cvs_updated on public.fronted_users_cvs_addresses;
create trigger trg_cvs_updated before update on public.fronted_users_cvs_addresses for each row execute function public.set_updated_at();

commit;
