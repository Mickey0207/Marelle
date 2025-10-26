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

## 資料表：public.fronted_carts（購物車主表）

- 用途：前台購物車容器。一位登入使用者（user_id）或一組訪客 token（guest_token）在同一時間僅能有一個 `active` 狀態的購物車。
- 關聯：
  - `user_id` → `public.fronted_users(id)`（登入者）
  - `merged_from_cart_id` → `public.fronted_carts(id)`（合併來源）

欄位

- id (uuid, PK)
- user_id (uuid, FK → fronted_users.id, on delete set null)
- guest_token (text, nullable)：訪客識別（由後端以 Cookie 維護）
- status (text, default 'active')：active | merged | abandoned | converted
- expires_at (timestamptz, nullable)：訪客車 TTL
- currency (text, default 'TWD')
- subtotal_amount (numeric(12,2), default 0)
- discount_amount (numeric(12,2), default 0)
- shipping_fee_amount (numeric(12,2), default 0)
- tax_amount (numeric(12,2), default 0)
- grand_total_amount (numeric(12,2), default 0)
- total_quantity (int, default 0)
- merged_from_cart_id (uuid, nullable)
- coupon_code (text, nullable)
- source_channel (text, nullable)
- schema_version (int, default 1)
- metadata (jsonb, default {})
- created_at/updated_at (timestamptz, UTC)

索引與約束

- Unique（partial）：同一使用者僅能有一個 active：`uq_fronted_carts_active_user (user_id) where status='active' and user_id is not null`
- Unique（partial）：同一 guest_token 僅能有一個 active：`uq_fronted_carts_active_guest (guest_token) where status='active' and guest_token is not null`
- 常用索引：`(user_id, status)`、`updated_at desc`

RLS 策略

- 啟用 RLS；僅 `auth.uid() = user_id` 的登入者可 select/insert/update/delete 自己的購物車。
- 訪客模式建議由後端（Service Role）代為操作。

## 資料表：public.fronted_cart_items（購物車明細）

- 用途：購物車內的商品變體行；每筆明細必須綁定到後端庫存資料列（變體）。
- 關聯：
  - `cart_id` → `public.fronted_carts(id)`（on delete cascade）
  - `product_id` → `public.backend_products(id)`（bigint, on delete restrict）
  - `inventory_id` → `public.backend_products_inventory(id)`（bigint, on delete restrict）

欄位

- id (uuid, PK)
- cart_id (uuid, FK → fronted_carts.id)
- product_id (bigint, FK → backend_products.id)
- inventory_id (bigint, FK → backend_products_inventory.id)
- sku_key (text, nullable)：SKU 文字快照（顯示/查詢方便）
- name_snapshot (text)：商品名稱快照
- image_url (text, nullable)
- selected_options (jsonb, default {})：選配/規格結構的摘要
- quantity (int > 0)
- unit_price (numeric(12,2), default 0)
- currency (text, default 'TWD')
- line_total_amount (numeric(12,2), default 0)
- is_gift (boolean, default false)
- added_at/updated_at (timestamptz, UTC)
- metadata (jsonb, default {})

索引與約束

- Unique：`(cart_id, inventory_id)`（同車同變體僅一行；如需同變體多行，後續可增 `personalization_hash` 調整唯一鍵）
- 常用索引：`cart_id`、`product_id`、`inventory_id`

RLS 策略

- 啟用 RLS；僅擁有該 `cart_id` 的登入者可 select/insert/update/delete 該購物車的明細：
  - 條件：存在 `fronted_carts c` 使得 `c.id = cart_id and c.user_id = auth.uid()`

彙總與觸發器

- `fronted_cart_recalc_totals(cart_id uuid)`：在 items 新增/更新/刪除後更新主表的 `total_quantity` 與金額（subtotal/grand_total）。
- 更新邏輯保守：折扣/運費/稅額由訂價引擎或 API 計算，觸發器不主動干涉。

