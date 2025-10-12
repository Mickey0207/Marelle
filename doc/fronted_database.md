# 前台資料庫結構（frontend）

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

