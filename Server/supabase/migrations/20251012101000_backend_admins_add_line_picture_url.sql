-- Add line_picture_url to backend_admins for displaying LINE avatar
alter table public.backend_admins
add column if not exists line_picture_url text;
