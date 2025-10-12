-- Upsert admin into backend_admins and ensure role
-- Target email
\set target_email 'admin@marelle.com.tw'

-- Ensure admin exists in backend_admins
insert into public.backend_admins (id, email, display_name, is_active, role)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
   true,
   'Admin'
from auth.users u
where lower(u.email) = lower(:'target_email')
on conflict (id) do update
  set email = excluded.email,
      display_name = excluded.display_name,
  is_active = true,
  role = 'Admin';

-- No per-admin module binding; permissions now derive from backend_role_modules
