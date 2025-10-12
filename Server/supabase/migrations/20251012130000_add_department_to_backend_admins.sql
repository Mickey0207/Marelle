-- Add department column to backend_admins
alter table public.backend_admins
  add column if not exists department text;

comment on column public.backend_admins.department is '部門（純篩選用途）';