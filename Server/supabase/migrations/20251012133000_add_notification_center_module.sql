-- Add notification-center module and role flag

-- 1) backend_role_modules: add boolean column for notification-center
alter table public.backend_role_modules
  add column if not exists notification_center boolean not null default false;

comment on column public.backend_role_modules.notification_center is 'Notification Center module flag';

-- 2) backend_modules: upsert notification-center as active
insert into public.backend_modules(key, name, is_active)
values ('notification-center', '通知中心', true)
on conflict (key) do update set name = excluded.name, is_active = true;