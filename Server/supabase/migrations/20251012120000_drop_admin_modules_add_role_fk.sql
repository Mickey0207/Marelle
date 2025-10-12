-- Remove per-admin module mapping and link admin role to role matrix

-- 1) Drop backend_admin_modules (policies/triggers will be dropped with table)
drop table if exists public.backend_admin_modules cascade;

-- 2) Ensure FK from backend_admins.role -> backend_role_modules(role)
-- backend_role_modules.role is already PRIMARY KEY per earlier migration
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'backend_admins_role_fkey'
  ) then
    alter table public.backend_admins
      add constraint backend_admins_role_fkey
      foreign key (role)
      references public.backend_role_modules(role)
      on update cascade
      on delete restrict;
  end if;
end $$;
