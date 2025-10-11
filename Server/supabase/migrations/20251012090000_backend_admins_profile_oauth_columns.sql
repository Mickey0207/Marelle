-- Add columns required by Profile and OAuth pages to backend_admins

alter table if exists public.backend_admins
  add column if not exists phone text,
  add column if not exists line_user_id text,
  add column if not exists line_display_name text,
  add column if not exists line_bound_at timestamptz;

-- Notes:
-- - phone: 後台管理員電話（Profile 頁面使用）
-- - line_user_id: 綁定的 LINE User ID（OAuth 頁面使用）
-- - line_display_name: LINE 暱稱（OAuth 頁面使用）
-- - line_bound_at: 綁定時間（OAuth 頁面使用）
