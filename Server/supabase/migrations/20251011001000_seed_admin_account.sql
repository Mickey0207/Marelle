-- Seed admin account into backend_admins and bind active modules
-- Target: admin@marelle.com.tw

insert into public.backend_admins (id, email, display_name, is_active)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
       true
from auth.users u
where lower(u.email) = lower('admin@marelle.com.tw')
on conflict (id) do update
  set email = excluded.email,
      display_name = excluded.display_name,
      is_active = true;

insert into public.backend_admin_modules (admin_id, module_key)
select u.id, m.key
from auth.users u
join public.backend_modules m on m.is_active = true
where lower(u.email) = lower('admin@marelle.com.tw')
on conflict do nothing;
