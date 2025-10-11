-- Upsert admin into backend_admins and bind active modules
-- Target email
\set target_email 'admin@marelle.com.tw'

-- Ensure admin exists in backend_admins
insert into public.backend_admins (id, email, display_name, is_active)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
       true
from auth.users u
where lower(u.email) = lower(:'target_email')
on conflict (id) do update
  set email = excluded.email,
      display_name = excluded.display_name,
      is_active = true;

-- Bind all active modules to this admin (idempotent)
insert into public.backend_admin_modules (admin_id, module_key)
select u.id, m.key
from auth.users u
join public.backend_modules m on m.is_active = true
where lower(u.email) = lower(:'target_email')
on conflict do nothing;
