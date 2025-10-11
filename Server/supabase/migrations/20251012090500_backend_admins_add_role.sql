-- Add role column to backend_admins

-- Create a check constraint to emulate enum: Admin/Manager/Staff
alter table if exists public.backend_admins
  add column if not exists role text default 'Staff';

alter table if exists public.backend_admins
  add constraint backend_admins_role_check
  check (role in ('Admin','Manager','Staff'));

-- Optional: seed existing nulls to default
update public.backend_admins set role = coalesce(role, 'Staff');
