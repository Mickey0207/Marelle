# 前台資料庫文件補充

## 資料表：public.fronted_address_zip_map

- 欄位：
  - zip3 (text, PK)：三碼郵遞區號
  - city (text)：縣市名
  - district (text)：行政區名

- 用途：提供郵遞區號對應城市/行政區之查找。

## 資料表：public.fronted_users_home_addresses

- 欄位（重點）：
  - id (uuid, PK)
  - user_id (uuid, FK -> auth.users)
  - alias (text, nullable)：使用者自訂別稱；同用戶同表唯一
  - is_default (boolean)：同用戶同表僅能存在一筆 true（透過部分唯一索引）
  - receiver_name (text)、receiver_phone (text)
  - zip3 (text, FK -> fronted_address_zip_map.zip3)、city、district、address_line (text)
  - is_archived (boolean)：軟刪除
  - created_at/updated_at：更新觸發器維護

- 關聯：user_id -> auth.users；zip3 -> fronted_address_zip_map

## 資料表：public.fronted_users_cvs_addresses

- 欄位（重點）：
  - id (uuid, PK)
  - user_id (uuid, FK -> auth.users)
  - alias (text, nullable)：使用者自訂別稱；同用戶同表唯一
  - is_default (boolean)：同用戶同表僅能存在一筆 true
  - vendor (text enum)：UNIMARTC2C|FAMIC2C|HILIFEC2C|OKMARTC2C
  - store_id (text)、store_name (text)、store_address (text)
  - receiver_name/receiver_phone (optional)
  - is_archived (boolean)、created_at/updated_at

- 關聯：user_id -> auth.users

## 備註

- RLS 已啟用，僅本人可存取與操作。
- 刪除預設地址時，後端會自動選擇同類型中最近更新的一筆作為新預設（若存在）。

## 資料表：fronted_users

- 用途：前台使用者的公開/一般資料，以及 LINE 綁定資訊。
- 關聯：`id` 對應 `auth.users.id`（Supabase Auth 使用者），on delete cascade。

欄位

- id (uuid)
  - 說明：對應 Supabase Auth 使用者 ID
- email (text)
  - 說明：電子郵件（便於查詢）
- display_name (text)
  - 說明：顯示名稱/暱稱
- phone (text)
  - 說明：電話
- line_user_id (text, unique)
  - 說明：LINE 使用者 ID（綁定）
- line_display_name (text)
  - 說明：LINE 顯示名稱
- line_picture_url (text)
  - 說明：LINE 大頭貼 URL
- is_active (boolean, default true)
  - 說明：帳號是否啟用
- created_at (timestamptz)
  - 說明：建立時間（UTC）
- updated_at (timestamptz)
  - 說明：更新時間（UTC）

RLS 策略

- 啟用 RLS；使用者可讀/新增/更新自己的資料列（`auth.uid() = id`）

索引

- email 索引：`fronted_users_email_idx`

