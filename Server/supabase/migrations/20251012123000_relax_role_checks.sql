-- Allow dynamic role names by dropping strict CHECK constraints

alter table if exists public.backend_admins
  drop constraint if exists backend_admins_role_check;

alter table if exists public.backend_role_modules
  drop constraint if exists backend_role_modules_role_check;
