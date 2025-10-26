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

## 表：public.backend_products_cetegory（產品分類）

- id (bigserial, PK)：分類 ID
- parent_id (bigint, nullable, FK → backend_products_cetegory.id)：上層分類 ID（支援多層樹狀結構）
- name (text, not null)：分類名稱
- slug (text, not null, unique)：分類 Slug（URL 用）
- image_url (text, nullable)：分類圖片 URL（Supabase Storage `product-categories` bucket）
- created_at (timestamptz, default now())：建立時間
- updated_at (timestamptz, default now())：更新時間（由 trigger 維護）

用途與關聯：

- 儲存產品分類架構，支援無限層級樹狀結構（透過 parent_id 遞迴）。
- 前端透過 GET /backend/categories 取得完整樹狀資料；或透過 POST/PATCH/DELETE 進行新增/編輯/刪除。
- 圖片儲存於 Supabase Storage 的 `product-categories` bucket，前端上傳時呼叫 POST /backend/categories/:id/upload-image。
- RLS：僅後台管理員可讀/寫/刪。
- 刪除時使用 CASCADE，刪除父分類時子分類也會一併刪除。

遷移檔：`Server/supabase/migrations/20251019170000_create_backend_products_cetegory.sql`

## 表：public.backend_products（商品主表）

- id (bigserial, PK)：商品 ID
- name (text, not null)：商品名稱
- slug (text, not null, unique)：商品 Slug（URL 用）
- short_description (text, nullable)：簡短描述（列表頁用）
- description (text, not null)：詳細描述
- tags (text[], default '{}')：商品標籤陣列
- promotion_label (text, nullable)：優惠標籤文字（例如「限時」、「新品」、「HOT」）
- promotion_label_bg_color (text, nullable)：優惠標籤背景色（十六進位色碼，如 #CC824D）
- promotion_label_text_color (text, nullable)：優惠標籤文字色（十六進位色碼，如 #FFFFFF）
- product_tag_bg_color (text, nullable)：產品標籤（左上角）背景色（十六進位色碼）
- product_tag_text_color (text, nullable)：產品標籤文字色（十六進位色碼）
- auto_hide_when_oos (boolean, default false)：缺貨自動下架（當變體庫存低於或等於門檻時，店面自動隱藏該變體；所有變體皆缺貨時可配合將商品隱藏）
- enable_preorder (boolean, default false)：是否啟用預購
- preorder_start_at (timestamptz, nullable)：預購開始時間（留空則立即生效）
- preorder_end_at (timestamptz, nullable)：預購結束時間（留空則不自動結束）
- preorder_max_qty (integer, nullable)：預購最大數量（保留；實際扣減需依訂單流程實作）
- oos_status (text, nullable)：缺貨狀態（保留給營運標註用途；前端不依此欄位判斷顯示）
- base_sku (text, not null, unique)：基礎 SKU 編碼
- has_variants (boolean, default false)：是否有變體（用於後端決定庫存邏輯）
- status (text, default 'draft', check in ('draft','active','archived'))：狀態
- visibility (text, default 'visible', check in ('visible','hidden'))：可見性（店面顯示或隱藏）
- is_featured (boolean, default false)：是否精選商品
- category_ids (bigint[], nullable)：分類 ID 陣列（多對多，存儲至 backend_products_cetegory.id）
- created_by (uuid, nullable, FK → backend_admins.id)：建立者
- updated_by (uuid, nullable, FK → backend_admins.id)：最後編輯者
- created_at (timestamptz, default now())：建立時間
- updated_at (timestamptz, default now())：更新時間（由 trigger 維護）

索引：`(slug)`, `(status)`, `(visibility)`, `(base_sku)`, `(tags using GIN)`

用途與關聯：

- 儲存商品主資訊，支援多分類（透過陣列）及多狀態管理。
- 與 `backend_products_photo` 一對多（photos via product_id）。
- 與 `backend_products_seo` 一對一（unique product_id）。
- 與 `backend_products_prices` 一對多（prices via product_id，暫無實現）。
- 與 `backend_products_inventory` 一對多（inventory via product_id，暫無實現）。
- RLS：僅後台管理員可讀/寫/刪。

遷移檔：`Server/supabase/migrations/20251019170100_create_backend_products_tables.sql`

補充：

- 新增「優惠標籤與顏色」、「產品標籤顏色」欄位之遷移檔：`Server/supabase/migrations/20251026120000_backend_products_add_labels_and_colors.sql`
- 遷移中以 UPDATE 將空值初始化為預設色：
  - promotion_label_bg_color：#CC824D
  - promotion_label_text_color：#FFFFFF
  - product_tag_bg_color：#CC824D
  - product_tag_text_color：#FFFFFF
 （注意：此為一次性初始化，非欄位層級 DEFAULT 約束；後續可由後台頁面自由設定。）

  - 新增「缺貨/預購」欄位之遷移檔：`Server/supabase/migrations/20251026140000_backend_products_oos_preorder.sql`
    - 新增欄位：auto_hide_when_oos, enable_preorder, preorder_start_at, preorder_end_at, preorder_max_qty, oos_status
    - 建議搭配 `backend_products_inventory.low_stock_threshold` 判斷「缺貨」：當 `current_stock_qty <= low_stock_threshold` 視為缺貨/低庫存

## 表：public.backend_products_photo（商品圖片 / 變體圖片）

用途：

- 儲存商品主體的 10 張圖片（固定欄位設計）
- 儲存每個 SKU 變體最多 3 張圖片（透過 `inventory_id` 綁定到庫存記錄）

欄位說明：

- id (bigserial, PK)
- product_id (bigint, not null, FK → backend_products.id ON DELETE CASCADE)
- inventory_id (bigint, nullable, FK → backend_products_inventory.id ON DELETE CASCADE)：若為 NULL 代表商品層級圖片；有值則代表變體層級圖片
- photo_url_1 ~ photo_url_10 (text, nullable)：商品層級圖片 URL（僅 inventory_id 為 NULL 的列使用）
- variant_photo_url_1 ~ variant_photo_url_3 (text, nullable)：變體層級圖片 URL（僅 inventory_id 有值的列使用）
- created_by (uuid, nullable, FK → backend_admins.id)
- updated_by (uuid, nullable, FK → backend_admins.id)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

索引與唯一性：

- 索引：`(product_id)`、`(inventory_id)`
- 局部唯一索引：保證每個商品在 `inventory_id IS NULL` 的情況下最多一列（單一商品層級照片列）

關聯說明：

- 商品層級：一個商品最多 10 張圖片，存於同一列的 `photo_url_1~10`
- 變體層級：每個變體（對應 `backend_products_inventory.id`）最多 3 張圖片，存於同一列的 `variant_photo_url_1~3`

遷移檔：

- `Server/supabase/migrations/20251019180000_restructure_product_photos.sql` - 建立商品層級 10 欄寬表
- `Server/supabase/migrations/20251019190000_drop_backend_products_photo_old.sql` - 刪除舊備份表
- `Server/supabase/migrations/20251020103000_add_variant_photos.sql` - 新增 `inventory_id` 與 `variant_photo_url_1~3`，並建立相關索引與約束

## 表：public.backend_products_seo（商品 SEO 中繼資料）

- id (bigserial, PK)：SEO 記錄 ID
- product_id (bigint, not null, unique, FK → backend_products.id ON DELETE CASCADE)：商品 ID
- meta_title (text, nullable)：title 標籤內容
- meta_description (text, nullable)：meta name="description" 內容
- sitemap_indexing (boolean, default true)：是否列入 sitemap（robots.txt 獨立控制）
- custom_canonical_url (text, nullable)：自訂 canonical URL（不填則自動產生）
- og_title (text, nullable)：Open Graph 標題
- og_description (text, nullable)：Open Graph 描述
- og_image_url (text, nullable)：Open Graph 圖片 URL
- use_meta_title_for_og (boolean, default true)：OG 標題是否優先使用 meta_title
- use_meta_description_for_og (boolean, default true)：OG 描述是否優先使用 meta_description
- search_title (text, nullable)：搜尋引擎摘要標題
- search_description (text, nullable)：搜尋引擎摘要描述
- search_image_url (text, nullable)：搜尋引擎摘要圖片
- use_meta_title_for_search (boolean, default true)：搜尋摘要標題是否優先使用 meta_title
- use_meta_description_for_search (boolean, default true)：搜尋摘要描述是否優先使用 meta_description
- use_og_image_for_search (boolean, default true)：搜尋摘要圖片是否優先使用 og_image_url
- exclude_from_search (boolean, default false)：是否從搜尋引擎隱藏
- created_by (uuid, nullable, FK → backend_admins.id)：建立者
- updated_by (uuid, nullable, FK → backend_admins.id)：最後編輯者
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

用途與關聯：

- 儲存每商品的 SEO 設定及社群分享中繼資料。
- 建立商品時自動建立 SEO 記錄（皆為 null 初值）。
- 支援客製化 meta、OG、搜尋摘要的完全控制，以及回退邏輯（例 og_title 優先使用 meta_title）。
- RLS：僅後台管理員可讀/寫。

遷移檔：`Server/supabase/migrations/20251019170100_create_backend_products_tables.sql`

## 表：public.backend_products_prices（商品價格）

- id (bigserial, PK)：價格記錄 ID
- product_id (bigint, not null, FK → backend_products.id ON DELETE CASCADE)：商品 ID
- sku_key (text, nullable, unique with product_id)：SKU 識別符（NULL 表示無變體；指定值表示該變體的定價）
- sale_price (numeric(12,2), nullable)：銷售價格
- compare_at_price (numeric(12,2), nullable)：原價（用於顯示折扣）
- cost_price (numeric(12,2), nullable)：成本價（後台內部用）
- gold_member_price (numeric(12,2), nullable)：金卡會員價
- silver_member_price (numeric(12,2), nullable)：銀卡會員價
- vip_member_price (numeric(12,2), nullable)：VIP會員價
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

用途與關聯：

- 儲存商品價格資訊，支援單一SKU或多SKU變體定價，以及多層級會員價格設置。
- 與 `backend_products` 一對多（外鍵：product_id）。
- 唯一約束：`(product_id, sku_key)` - 每個商品的每個SKU最多一筆定價記錄。
- 支援5層級會員價（基礎價格 + 3級會員價）。
- 前端 AddProductAdvanced 的「定價」步驟及 NestedSKUManager 的變體定價將連動此表。
- 後台 Products.jsx 的SKU變體展開式子表格用於設定和管理各SKU的價格。
- RLS：僅後台管理員可讀/寫。

遷移檔：

- 初始：`Server/supabase/migrations/20251019170100_create_backend_products_tables.sql`
- 增強：`Server/supabase/migrations/20251019175000_enhance_products_inventory_and_prices.sql`
- 會員價：`Server/supabase/migrations/20251019220000_add_member_prices.sql`

## 表：public.backend_products_inventory（商品庫存）

- id (bigserial, PK)：庫存記錄 ID
- product_id (bigint, not null, FK → backend_products.id ON DELETE CASCADE)：商品 ID
- sku_key (text, nullable, unique with product_id & warehouse)：SKU 識別符（NULL 表示無變體；指定值表示該變體的庫存）
- warehouse (text, default '主倉')：倉庫名稱
- current_stock_qty (int, default 0)：目前庫存量
- safety_stock_qty (int, default 10)：安全庫存量（低於此值警告）
- low_stock_threshold (int, default 5)：低庫存警告門檻
- track_inventory (boolean, default true)：是否追蹤庫存
- allow_backorder (boolean, default false)：是否允許缺貨訂購
- allow_preorder (boolean, default false)：是否允許預購
- barcode (text, nullable)：條碼
- hs_code (text, nullable)：HS Code（海關商品分類碼）
- origin (text, nullable)：原產地
- notes (text, nullable)：備註
- weight (numeric, nullable)：重量（kg）
- length_cm (numeric, nullable)：長度（cm）
- width_cm (numeric, nullable)：寬度（cm）
- height_cm (numeric, nullable)：高度（cm）
- sku_level_1 (text, nullable)：第 1 層 SKU 代碼（例：顏色編碼）
- sku_level_2 (text, nullable)：第 2 層 SKU 代碼（例：尺寸編碼）
- sku_level_3 (text, nullable)：第 3 層 SKU 代碼（例：材質編碼）
- sku_level_4 (text, nullable)：第 4 層 SKU 代碼（例：版本編碼）
- sku_level_5 (text, nullable)：第 5 層 SKU 代碼（例：其他屬性編碼）
- sku_level_1_name (text, nullable)：第 1 層選項名稱（例：Red、Blue）
- sku_level_2_name (text, nullable)：第 2 層選項名稱（例：M、L、XL）
- sku_level_3_name (text, nullable)：第 3 層選項名稱（例：Cotton、Polyester）
- sku_level_4_name (text, nullable)：第 4 層選項名稱
- sku_level_5_name (text, nullable)：第 5 層選項名稱
- spec_level_1_name (text, nullable)：第 1 層規格類別名稱（例：Color）
- spec_level_2_name (text, nullable)：第 2 層規格類別名稱（例：Size）
- spec_level_3_name (text, nullable)：第 3 層規格類別名稱（例：Material）
- spec_level_4_name (text, nullable)：第 4 層規格類別名稱
- spec_level_5_name (text, nullable)：第 5 層規格類別名稱
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

用途與關聯：

- 儲存商品庫存、物流及預訂設定，支援多倉庫和多SKU變體追蹤。
- 每個 SKU 變體最多 3 張圖片，圖片紀錄存於 `backend_products_photo`（以 `inventory_id` 連結），不再直接存放於本表。
- 支援最多 5 層級的 SKU 嵌套結構（sku_level_1 到 sku_level_5），對應前端 NestedSKUManager 的 5 層級樹狀結構。
  - sku_level_1 到 sku_level_5：存儲各層級的 SKU 代碼
  - sku_level_1_name 到 sku_level_5_name：存儲各層級的選項名稱（例如：Red、M、Cotton）
  - spec_level_1_name 到 spec_level_5_name：存儲各層級的規格類別名稱（例如：Color、Size、Material）
- 與 `backend_products` 一對多（外鍵：product_id）。
- 唯一約束：`(product_id, warehouse, sku_key)` - 每個商品的每個倉庫的每個SKU最多一筆庫存記錄。
- 複合索引：(product_id, sku_level_1, sku_level_2, sku_level_3, sku_level_4, sku_level_5) - 用於高效的 SKU 層級查詢。
- 指標：product_id, sku_key, warehouse, barcode（用於快速查詢）。
- 前端 AddProductAdvanced 的 NestedSKUManager 變體資訊、Inventory.jsx 庫存清單將連動此表。
- RLS：僅後台管理員可讀/寫。

遷移檔：

- 初始：`Server/supabase/migrations/20251019170100_create_backend_products_tables.sql`
- 增強：`Server/supabase/migrations/20251019175000_enhance_products_inventory_and_prices.sql`
- 圖片重構：`Server/supabase/migrations/20251019180000_restructure_product_photos.sql`
- 5層級SKU擴展：`Server/supabase/migrations/20251019200000_extend_inventory_5level_sku.sql`




