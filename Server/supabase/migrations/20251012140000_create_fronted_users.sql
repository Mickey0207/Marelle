begin;

-- Frontend users profile table (public schema)
create table if not exists public.fronted_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  phone text,
  -- LINE linking
  line_user_id text unique,
  line_display_name text,
  line_picture_url text,
  -- lifecycle
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.fronted_users is 'Frontend users profile table; stores public profile fields and LINE linking info.';

create index if not exists fronted_users_email_idx on public.fronted_users (email);

-- Enable Row Level Security
alter table public.fronted_users enable row level security;

-- RLS policies: users can read/insert/update their own row
drop policy if exists "Users can read own fronted profile" on public.fronted_users;
create policy "Users can read own fronted profile"
  on public.fronted_users
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own fronted profile" on public.fronted_users;
create policy "Users can insert own fronted profile"
  on public.fronted_users
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own fronted profile" on public.fronted_users;
create policy "Users can update own fronted profile"
  on public.fronted_users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_fronted_users_updated_at on public.fronted_users;
create trigger set_fronted_users_updated_at
before update on public.fronted_users
for each row
execute function public.set_updated_at();

commit;
