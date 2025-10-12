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
- line_picture_url (text, nullable)：LINE 頭像 URL（第三方登入 OAuth 頁面）
- is_active (boolean, default true)：是否啟用
- created_at (timestamptz, default now())：建立時間
- updated_at (timestamptz, default now())：更新時間（由 trigger 維護）
- department (text, nullable)：部門（僅做後台清單顯示與篩選用）

用途與關聯：

- 儲存後台管理員基本資料。
- 與 `backend_role_modules` 透過 `role` 欄位關聯（外鍵：`backend_admins.role -> backend_role_modules(role)`），用以決定該管理員可存取的模組。
- RLS：僅本人可選取/寫入自身資料。

## 表：public.backend_modules

- key (text, PK)：模組鍵，例：dashboard/settings/products
- name (text, not null)：模組名稱
- is_active (boolean, default true)：是否啟用
- created_at (timestamptz, default now())

用途與關聯：

- 定義後台模組清單。
- 權限決策由 `backend_role_modules` 的角色矩陣決定；本表僅提供模組清單與啟用狀態。
- RLS：所有 authenticated 可讀取啟用中的模組。

（移除）原 per-admin 對應表 `backend_admin_modules` 已刪除，現改以角色矩陣統一控管。

## 表：public.backend_role_modules（角色 → 模組矩陣）

- role (text, PK)：角色名稱（限定 'Admin' | 'Manager' | 'Staff'）
- dashboard/products/inventory/...（boolean, not null, default false）：每個模組對應一個布林欄位
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

用途與關聯：

- 儲存各角色能使用哪些後台模組，採寬表（每模組一欄位）矩陣配置，便於直觀查詢與管理。
- 與 `backend_admins.role` 形成一對多關係（同名欄位關聯）；已建立外鍵以確保一致性。
- RLS：authenticated 具查詢權；新增/更新建議由 service role 或 migration/後台管理頁面執行。

## 初始化資料

- `backend_modules` 已插入完整側邊欄模組鍵：
  - dashboard, products, inventory, orders, logistics, notifications, marketing, members, procurement, accounting, reviews, fromsigning, admin, user-tracking, analytics, settings。
- `backend_role_modules` 已插入預設角色權限：
  - Admin：全開
  - Manager：常用模組
  - Staff：基礎模組

## 作業說明

- 登入成功後，後端會以 access token 權限 upsert 一筆 `backend_admins`（id = auth.user.id）。
- 取得模組端點會根據 `backend_admins.role` 讀取 `backend_role_modules` 的對應行，並過濾 `backend_modules` 中啟用的模組，回傳該角色允許的模組鍵清單。

如有結構調整，請先閱讀本文件再修改遷移檔，並於修改後回寫此文件。
