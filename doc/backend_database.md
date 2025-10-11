# 後台資料庫結構（Supabase / Postgres）

本文件說明後台登入相關資料表；建表 SQL 位於 `Server/supabase/migrations/20251011000000_backend_auth.sql`。

## 表：public.backend_admins

- id (uuid, PK)：對應 Supabase Auth 的 user.id
- email (text, not null)：管理員 Email
- display_name (text, nullable)：顯示名稱
- role (text, default 'Staff')：角色，限定為 'Admin' | 'Manager' | 'Staff'
- phone (text, nullable)：電話（個人資料 Profile 頁面）
- line_user_id (text, nullable)：LINE 使用者 ID（第三方登入 OAuth 頁面）
- line_display_name (text, nullable)：LINE 暱稱（第三方登入 OAuth 頁面）
- line_bound_at (timestamptz, nullable)：LINE 綁定時間（第三方登入 OAuth 頁面）
- is_active (boolean, default true)：是否啟用
- created_at (timestamptz, default now())：建立時間
- updated_at (timestamptz, default now())：更新時間（由 trigger 維護）

用途與關聯：

- 儲存後台管理員基本資料。
- 與 `backend_admin_modules.admin_id` 關聯。
- RLS：僅本人可選取/寫入自身資料。

## 表：public.backend_modules

- key (text, PK)：模組鍵，例：dashboard/settings/products
- name (text, not null)：模組名稱
- is_active (boolean, default true)：是否啟用
- created_at (timestamptz, default now())

用途與關聯：

- 定義後台模組清單。
- 與 `backend_admin_modules.module_key` 關聯。
- RLS：所有 authenticated 可讀取啟用中的模組。

## 表：public.backend_admin_modules

- admin_id (uuid, FK -> backend_admins.id, PK part)：管理員 ID
- module_key (text, FK -> backend_modules.key, PK part)：模組鍵
- created_at (timestamptz, default now())

用途與關聯：

- 定義管理員與可用模組之對應關係。
- 複合主鍵 (admin_id, module_key)。
- RLS：僅本人可查詢/新增/刪除自身對應關係。

## 初始化資料

- `backend_modules` 預先插入：dashboard、settings、products。

## 作業說明

- 登入成功後，後端會以 access token 權限 upsert 一筆 `backend_admins`（id = auth.user.id）。
- 取得模組端點會讀取 `backend_admin_modules` 取回自身模組鍵，再過濾 `backend_modules` 中 `is_active = true` 的項目。

如有結構調整，請先閱讀本文件再修改遷移檔，並於修改後回寫此文件。
