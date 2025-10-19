# 後台登入與認證 API（backend_auth）# 後台登入與認證 API（backend_auth）



本節描述後台使用的認證 API，部署於 Cloudflare Workers（參考 `Server/Config/wrangler.toml`）。所有端點皆使用 Cookie 搭配跨站授權，前端必須以 `credentials: 'include'` 發送請求。本節描述後台使用的認證 API，部署於 Cloudflare Workers（參考 `Server/Config/wrangler.toml`）。所有端點皆使用 Cookie 搭配跨站授權，前端必須以 `credentials: 'include'` 發送請求。



共用規範共用規範



- 認證 Cookie：- 認證 Cookie：



  - `sb-access-token`（短期，Supabase access token）  - `sb-access-token`（短期，Supabase access token）

  - `sb-refresh-token`（長期，Supabase refresh token）  - `sb-refresh-token`（長期，Supabase refresh token）

  - `admin-session`（HMAC 簽發，僅用於 LINE 已綁定時的直接登入，非 Supabase session）  - `admin-session`（HMAC 簽發，僅用於 LINE 已綁定時的直接登入，非 Supabase session）



- 錯誤格式：`{ error: string }`- 錯誤格式：`{ error: string }`



用途：優先以 `sb-access-token` 取得使用者；若不存在，且存在 `admin-session`，則以該 session 識別 admin 並回傳資料庫中的 email（需 `SUPABASE_SERVICE_ROLE_KEY`）用途：優先以 `sb-access-token` 取得使用者；若不存在，且存在 `admin-session`，則以該 session 識別 admin 並回傳資料庫中的 email（需 `SUPABASE_SERVICE_ROLE_KEY`）

  

1) POST /backend/auth/login1) POST /backend/auth/login



- 用途：Email/Password 登入並在回應中設定 Cookie- 用途：Email/Password 登入並在回應中設定 Cookie

- 請求：`{ email: string, password: string }`- 請求：`{ email: string, password: string }`

- 成功：`200 { user: { id: string, email: string } }`- 成功：`200 { user: { id: string, email: string } }`

- 失敗：- 失敗：

  - `400 { error: 'Missing email or password' }`  - `400 { error: 'Missing email or password' }`

  - `401 { error: 'Invalid credentials' }`  - `401 { error: 'Invalid credentials' }`

  - `403 { error: 'Not a backend admin' }`（帳號雖存在於 Supabase Auth，但未在 `backend_admins` 建立或 `is_active=false`）  - `403 { error: 'Not a backend admin' }`（帳號雖存在於 Supabase Auth，但未在 `backend_admins` 建立或 `is_active=false`）



-- GET /backend/auth/line/callback-- GET /backend/auth/line/callback

    

- 用途：LINE 回呼端點，驗證 state，交換 access_token，抓取 profile- 用途：LINE 回呼端點，驗證 state，交換 access_token，抓取 profile

- 成功（已綁定）：若該 `line_user_id` 已綁定 `backend_admins`，且設定 `ADMIN_SESSION_SECRET`，伺服端簽發 `admin-session` Cookie（有效期預設 12 小時），並 302 轉址至 `/`- 成功（已綁定）：若該 `line_user_id` 已綁定 `backend_admins`，且設定 `ADMIN_SESSION_SECRET`，伺服端簽發 `admin-session` Cookie（有效期預設 12 小時），並 302 轉址至 `/`

- 成功（未綁定）：302 轉址至 `/login?line_status=success&bound=0&name=...`- 成功（未綁定）：302 轉址至 `/login?line_status=success&bound=0&name=...`

- 失敗：302 轉址至 `/login?line_status=error&reason=...`- 失敗：302 轉址至 `/login?line_status=error&reason=...`

- 環境變數：`LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `LINE_REDIRECT_URI`，以及（選用）`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`- 環境變數：`LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `LINE_REDIRECT_URI`，以及（選用）`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`



1) GET /backend/auth/me1) GET /backend/auth/me



前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。



`admin-session` 僅用於識別已綁定 LINE 的管理員身分，不等同 Supabase 的 Auth Session，若需要呼叫 Supabase 需透過 service role 或另外建立 Supabase session。`admin-session` 僅用於識別已綁定 LINE 的管理員身分，不等同 Supabase 的 Auth Session，若需要呼叫 Supabase 需透過 service role 或另外建立 Supabase session。



- 用途：以 access token 驗證後，回傳使用者資訊- 用途：以 access token 驗證後，回傳使用者資訊

- 成功：`200 { id: string, email: string }`- 成功：`200 { id: string, email: string }`

- 未授權：`401 { error: 'Unauthorized' }`- 未授權：`401 { error: 'Unauthorized' }`

- 禁止存取：`403 { error: 'Not a backend admin' }`（已驗證，但未在 `backend_admins` 建立或 `is_active=false`）- 禁止存取：`403 { error: 'Not a backend admin' }`（已驗證，但未在 `backend_admins` 建立或 `is_active=false`）



註：不論是以 `sb-access-token` 或 `admin-session` 身分識別，伺服端在回傳資料前都會確認該使用者存在於 `backend_admins` 且為啟用狀態。註：不論是以 `sb-access-token` 或 `admin-session` 身分識別，伺服端在回傳資料前都會確認該使用者存在於 `backend_admins` 且為啟用狀態。



1) POST /backend/auth/refresh1) POST /backend/auth/refresh



- 用途：使用 refresh token 交換新的 access token 並更新 Cookie- 用途：使用 refresh token 交換新的 access token 並更新 Cookie

- 成功：`200 { ok: true }`- 成功：`200 { ok: true }`

- 失敗：`401 { error: 'Refresh failed' }` 或 `500 { error: 'Refresh failed' }`- 失敗：`401 { error: 'Refresh failed' }` 或 `500 { error: 'Refresh failed' }`



1) GET /backend/auth/modules1) GET /backend/auth/modules



- 用途：取得目前登入使用者可用的後台模組清單。伺服端會以目前管理員的 `backend_admins.role`，查詢 `backend_role_modules` 的布林矩陣，並與啟用中的 `backend_modules` 交集後回傳。- 用途：取得目前登入使用者可用的後台模組清單。伺服端會以目前管理員的 `backend_admins.role`，查詢 `backend_role_modules` 的布林矩陣，並與啟用中的 `backend_modules` 交集後回傳。

- 成功：`200 [ 'dashboard', 'products', ... ]`- 成功：`200 [ 'dashboard', 'products', ... ]`

- 未授權：`401 { error: 'Unauthorized' }`- 未授權：`401 { error: 'Unauthorized' }`

- 禁止存取：`403 { error: 'Not a backend admin' }`- 禁止存取：`403 { error: 'Not a backend admin' }`



注意事項注意事項



- 前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。- 前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。

- 本文件與程式碼同步維護；如有新增或調整端點，請先閱讀並更新此文件後再修改程式碼。- 本文件與程式碼同步維護；如有新增或調整端點，請先閱讀並更新此文件後再修改程式碼。



1) LINE OAuth 登入流程1) LINE OAuth 登入流程



-- GET /backend/auth/line/start-- GET /backend/auth/line/start



- 用途：導向 LINE 授權頁，於 Cookie 寫入 state- 用途：導向 LINE 授權頁，於 Cookie 寫入 state

- 成功：302 轉址至 LINE 授權網址- 成功：302 轉址至 LINE 授權網址

- 參數（查詢字串，選填）：- 參數（查詢字串，選填）：

  - `mode`：`login` 或 `bind`（預設 `login`）  - `mode`：`login` 或 `bind`（預設 `login`）

  - `next`：綁定成功後回跳的相對路徑（預設 `/accountsetting/oauth`）  - `next`：綁定成功後回跳的相對路徑（預設 `/accountsetting/oauth`）



-- GET /backend/auth/line/callback-- GET /backend/auth/line/callback



- 用途：LINE 回呼端點，驗證 state，交換 access_token，抓取 profile- 用途：LINE 回呼端點，驗證 state，交換 access_token，抓取 profile

- `mode=login`：- `mode=login`：

  - 已綁定：簽發 `admin-session` Cookie 並 302 導回 `/`  - 已綁定：簽發 `admin-session` Cookie 並 302 導回 `/`

  - 未綁定：302 導回 `/login?line_status=success&bound=0&name=...`  - 未綁定：302 導回 `/login?line_status=success&bound=0&name=...`

- `mode=bind`：- `mode=bind`：

  - 需為已登入管理員（sb-access-token 或 admin-session）  - 需為已登入管理員（sb-access-token 或 admin-session）

  - 若 `line_user_id` 已被其他帳號佔用：302 導回 `/accountsetting/oauth?bind=error&reason=line_id_taken`  - 若 `line_user_id` 已被其他帳號佔用：302 導回 `/accountsetting/oauth?bind=error&reason=line_id_taken`

  - 綁定成功：302 導回 `/accountsetting/oauth?bind=success`  - 綁定成功：302 導回 `/accountsetting/oauth?bind=success`

- 失敗：302 轉址至 `/login?line_status=error&reason=...`- 失敗：302 轉址至 `/login?line_status=error&reason=...`

- 回傳/導向所需的環境變數：`LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `LINE_REDIRECT_URI`；選用 `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`- 回傳/導向所需的環境變數：`LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `LINE_REDIRECT_URI`；選用 `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`



1) 帳號設定 · LINE 綁定/查詢 API1) 帳號設定 · LINE 綁定/查詢 API



## 管理員與角色 API（backend_admin）## 管理員與角色 API（backend_admin）



所有端點皆需攜帶 Cookie（`credentials: 'include'`），且呼叫者必須為「存在於 `backend_admins` 並且 `is_active=true` 的後台管理員」。所有端點皆需攜帶 Cookie（`credentials: 'include'`），且呼叫者必須為「存在於 `backend_admins` 並且 `is_active=true` 的後台管理員」。



- 未登入/逾期：`401 { error: 'Unauthorized' }`- 未登入/逾期：`401 { error: 'Unauthorized' }`

- 非後台管理員或已停用：`403 { error: 'Not a backend admin' }`- 非後台管理員或已停用：`403 { error: 'Not a backend admin' }`



1) GET /backend/admins1) GET /backend/admins



- 用途：取得管理員清單- 用途：取得管理員清單

- 回傳：`200 Array<{ id, email, display_name, role, department, line_user_id, line_display_name, line_picture_url, is_active }>`- 回傳：`200 Array<{ id, email, display_name, role, department, line_user_id, line_display_name, line_picture_url, is_active }>`



1) PATCH /backend/admins/:id1) PATCH /backend/admins/:id

1) POST /backend/admins1) POST /backend/admins



- 用途：建立新的管理員帳號（會同時建立 Supabase Auth 使用者以及 backend_admins 資料列）- 用途：建立新的管理員帳號（會同時建立 Supabase Auth 使用者以及 backend_admins 資料列）

- 請求：`{ email: string, password: string, display_name?: string, role?: string, department?: string }`- 請求：`{ email: string, password: string, display_name?: string, role?: string, department?: string }`

- 回傳：`200 { id: string, email: string, display_name: string | null, role: string, department?: string }`- 回傳：`200 { id: string, email: string, display_name: string | null, role: string, department?: string }`



注意：此操作僅限具備相應管理權限之後台管理員執行（例如管理員管理模組）。前台使用者無法呼叫此 API。注意：此操作僅限具備相應管理權限之後台管理員執行（例如管理員管理模組）。前台使用者無法呼叫此 API。



1) POST /backend/admins/:id/send-reset-email1) POST /backend/admins/:id/send-reset-email



- 用途：寄送 Supabase 的密碼重設信給該使用者- 用途：寄送 Supabase 的密碼重設信給該使用者

- 行為：信中的連結將導向 `SITE_URL` 下的 `/auth/reset-password`（請於 Workers 環境變數設定 SITE_URL，例如 <http://localhost:3001> 或正式網域）- 行為：信中的連結將導向 `SITE_URL` 下的 `/auth/reset-password`（請於 Workers 環境變數設定 SITE_URL，例如 <http://localhost:3001> 或正式網域）

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`





- 用途：更新管理員基本欄位- 用途：更新管理員基本欄位

- 請求：`{ display_name?: string, role?: string, is_active?: boolean, department?: string }`（至少一欄）- 請求：`{ display_name?: string, role?: string, is_active?: boolean, department?: string }`（至少一欄）

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`



1) GET /backend/roles1) GET /backend/roles



- 用途：取得所有角色- 用途：取得所有角色

- 回傳：`200 Array<{ id: string, name: string }>`（id 為前端使用的臨時識別，name 為實際角色名）- 回傳：`200 Array<{ id: string, name: string }>`（id 為前端使用的臨時識別，name 為實際角色名）



1) POST /backend/roles1) POST /backend/roles



- 用途：建立角色（對應 backend_role_modules 新增一列，所有模組布林預設為 false）- 用途：建立角色（對應 backend_role_modules 新增一列，所有模組布林預設為 false）

- 請求：`{ name: string }`- 請求：`{ name: string }`

- 回傳：`200 { id: string, name: string }`- 回傳：`200 { id: string, name: string }`



1) GET /backend/roles/:role/modules1) GET /backend/roles/:role/modules



- 用途：取得指定角色啟用中的後台模組鍵名列表- 用途：取得指定角色啟用中的後台模組鍵名列表

- 回傳：`200 string[]`（僅回傳在資料表 backend_modules 內且 is_active=true 的模組鍵）- 回傳：`200 string[]`（僅回傳在資料表 backend_modules 內且 is_active=true 的模組鍵）



1) PUT /backend/roles/:role/modules1) PUT /backend/roles/:role/modules



1) GET /backend/modules1) GET /backend/modules



- 用途：取得目前啟用中的後台模組清單（供前端顯示與角色授權 UI 使用）- 用途：取得目前啟用中的後台模組清單（供前端顯示與角色授權 UI 使用）

- 回傳：`200 Array<{ key: string, label: string }>`- 回傳：`200 Array<{ key: string, label: string }>`



- 用途：以傳入陣列覆蓋指定角色的模組啟用布林矩陣（只接受目前為啟用中的模組鍵名）- 用途：以傳入陣列覆蓋指定角色的模組啟用布林矩陣（只接受目前為啟用中的模組鍵名）

- 請求：`{ modules: string[] }`- 請求：`{ modules: string[] }`

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`



-- POST /backend/account/line/unbind-- POST /backend/account/line/unbind



- 用途：解除目前管理員的 LINE 綁定- 用途：解除目前管理員的 LINE 綁定

- 鑑權：需要登入（sb-access-token 或 admin-session）- 鑑權：需要登入（sb-access-token 或 admin-session）

- 成功：`200 { ok: true }`- 成功：`200 { ok: true }`

- 未授權：`401 { error: 'Unauthorized' }`- 未授權：`401 { error: 'Unauthorized' }`

- 失敗：`500 { error: 'Failed to unbind' }`- 失敗：`500 { error: 'Failed to unbind' }`



## 產品分類 API（backend_categories）## 產品分類 API（backend_categories）



所有端點皆需攜帶 Cookie（`credentials: 'include'`），且呼叫者必須為「存在於 `backend_admins` 並且 `is_active=true` 的後台管理員」。所有端點皆需攜帶 Cookie（`credentials: 'include'`），且呼叫者必須為「存在於 `backend_admins` 並且 `is_active=true` 的後台管理員」。



- 未登入/逾期：`401 { error: 'Unauthorized' }`- 未登入/逾期：`401 { error: 'Unauthorized' }`

- 非後台管理員或已停用：`403 { error: 'Not a backend admin' }`- 非後台管理員或已停用：`403 { error: 'Not a backend admin' }`



1) GET /backend/categories1) GET /backend/categories



- 用途：取得所有分類（以樹狀結構排列）- 用途：取得所有分類（以樹狀結構排列）

- 回傳：`200 Array<Category>`，其中 `Category = { id: number, name: string, slug: string, image: string, children?: Category[] }`- 回傳：`200 Array<Category>`，其中 `Category = { id: number, name: string, slug: string, image: string, children?: Category[] }`

- 示例：- 示例：

  ```json  ```json

  [  [

    {    {

      "id": 1,      "id": 1,

      "name": "女裝",      "name": "女裝",

      "slug": "c-f",      "slug": "c-f",

      "image": "https://storage.example.com/...",      "image": "https://storage.example.com/...",

      "children": [      "children": [

        {        {

          "id": 2,          "id": 2,

          "name": "洋裝",          "name": "洋裝",

          "slug": "c-f-d",          "slug": "c-f-d",

          "image": "",          "image": "",

          "children": []          "children": []

        }        }

      ]      ]

    }    }

  ]  ]

  ```  ```



2) POST /backend/categories2) POST /backend/categories



- 用途：建立新分類- 用途：建立新分類

- 請求：`{ name: string, slug: string, parent_id?: number | null, image_url?: string }`- 請求：`{ name: string, slug: string, parent_id?: number | null, image_url?: string }`

- 回傳：`200 { id: number, name: string, slug: string, image: string, parent_id: number | null }`- 回傳：`200 { id: number, name: string, slug: string, image: string, parent_id: number | null }`

- 失敗：- 失敗：

  - `400 { error: 'Missing name or slug' }`  - `400 { error: 'Missing name or slug' }`

  - `500 { error: 'Create failed' }`  - `500 { error: 'Create failed' }`



3) PATCH /backend/categories/:id3) PATCH /backend/categories/:id



- 用途：編輯分類- 用途：編輯分類

- 請求：`{ name?: string, slug?: string, image_url?: string }`（至少一欄）- 請求：`{ name?: string, slug?: string, image_url?: string }`（至少一欄）

- 回傳：`200 { id: number, name: string, slug: string, image: string, parent_id: number | null }`- 回傳：`200 { id: number, name: string, slug: string, image: string, parent_id: number | null }`

- 失敗：- 失敗：

  - `400 { error: 'No fields to update' }`  - `400 { error: 'No fields to update' }`

  - `500 { error: 'Update failed' }`  - `500 { error: 'Update failed' }`



4) DELETE /backend/categories/:id4) DELETE /backend/categories/:id



- 用途：刪除分類及其所有子分類（CASCADE）- 用途：刪除分類及其所有子分類（CASCADE）

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`

- 失敗：`500 { error: 'Internal error' }`- 失敗：`500 { error: 'Internal error' }`



5) POST /backend/categories/:id/upload-image5) POST /backend/categories/:id/upload-image



- 用途：上傳分類圖片至 Supabase Storage（bucket: `product-categories`），並更新分類的 `image_url`- 用途：上傳分類圖片至 Supabase Storage（bucket: `product-categories`），並更新分類的 `image_url`

- 請求：multipart/form-data，含 `file` 欄位（File 物件）- 請求：multipart/form-data，含 `file` 欄位（File 物件）

- 回傳：`200 { id: number, image_url: string, public_url: string }`- 回傳：`200 { id: number, image_url: string, public_url: string }`

- 失敗：- 失敗：

  - `400 { error: 'No file provided' }`  - `400 { error: 'No file provided' }`

  - `500 { error: 'Upload failed' }` 或 `{ error: 'Update failed' }`  - `500 { error: 'Upload failed' }` 或 `{ error: 'Update failed' }`



備註：前端需使用 FormData API 並設定 Content-Type 為 multipart/form-data；後端會將圖片儲存於 `product-categories` bucket，命名格式為 `{category-id}-{timestamp}-{original-filename}`，並回傳公開 URL。備註：前端需使用 FormData API 並設定 Content-Type 為 multipart/form-data；後端會將圖片儲存於 `product-categories` bucket，命名格式為 `{category-id}-{timestamp}-{original-filename}`，並回傳公開 URL。



## 商品 API（backend_products）## 商品 API（backend_products）



所有端點皆需攜帶 Cookie（`credentials: 'include'`），且呼叫者必須為「存在於 `backend_admins` 並且 `is_active=true` 的後台管理員」。所有端點皆需攜帶 Cookie（`credentials: 'include'`），且呼叫者必須為「存在於 `backend_admins` 並且 `is_active=true` 的後台管理員」。



- 未登入/逾期：`401 { error: 'Unauthorized' }`- 未登入/逾期：`401 { error: 'Unauthorized' }`

- 非後台管理員或已停用：`403 { error: 'Not a backend admin' }`- 非後台管理員或已停用：`403 { error: 'Not a backend admin' }`



### 1) GET /backend/products### 1) GET /backend/products



- 用途：取得所有商品（支援篩選）- 用途：取得所有商品（支援篩選）

- 查詢參數：- 查詢參數：

  - `status`：`draft` | `active` | `archived`（選填）  - `status`：`draft` | `active` | `archived`（選填）

  - `visibility`：`visible` | `hidden`（選填）  - `visibility`：`visible` | `hidden`（選填）

  - `search`：搜尋商品名稱或 slug（選填）  - `search`：搜尋商品名稱或 slug（選填）

- 回傳：`200 Array<{ id, name, slug, short_description, status, visibility, is_featured, base_sku, has_variants, tags, created_at, updated_at }>`- 回傳：`200 Array<{ id, name, slug, short_description, status, visibility, is_featured, base_sku, has_variants, tags, created_at, updated_at }>`

- 失敗：`500 { error: 'Failed to list products' }`- 失敗：`500 { error: 'Failed to list products' }`



### 2) GET /backend/products/:id### 2) GET /backend/products/:id



- 用途：取得單一商品的完整資訊（含圖片和 SEO）- 用途：取得單一商品的完整資訊（含圖片和 SEO）

- 回傳：`200 { id, name, slug, ..., photos: [{ id, image_url, alt_text, display_order, is_primary }], seo: { id, meta_title, meta_description, ... } }`- 回傳：`200 { id, name, slug, ..., photos: [{ id, image_url, alt_text, display_order, is_primary }], seo: { id, meta_title, meta_description, ... } }`

- 失敗：`404 { error: 'Product not found' }`- 失敗：`404 { error: 'Product not found' }`



### 3) POST /backend/products### 3) POST /backend/products



- 用途：建立新商品- 用途：建立新商品

- 請求：- 請求：

  ```json  ```json

  {  {

    "name": "商品名稱",    "name": "商品名稱",

    "slug": "product-slug",    "slug": "product-slug",

    "description": "詳細描述",    "description": "詳細描述",

    "short_description": "簡短描述（可選）",    "short_description": "簡短描述（可選）",

    "tags": ["標籤1", "標籤2"],    "tags": ["標籤1", "標籤2"],

    "base_sku": "SKU-001",    "base_sku": "SKU-001",

    "has_variants": false,    "has_variants": false,

    "status": "draft",    "status": "draft",

    "visibility": "visible",    "visibility": "visible",

    "is_featured": false,    "is_featured": false,

    "category_ids": [1, 2],    "category_ids": [1, 2],

    "meta_title": "SEO 標題",    "meta_title": "SEO 標題",

    "meta_description": "SEO 描述"    "meta_description": "SEO 描述"

  }  }

  ```  ```

- 回傳：`200 { id, name, slug, ... }`（同時建立 SEO 記錄）- 回傳：`200 { id, name, slug, ... }`（同時建立 SEO 記錄）

- 失敗：- 失敗：

  - `400 { error: 'Missing required fields' }`  - `400 { error: 'Missing required fields' }`

  - `500 { error: 'Failed to create product' }`  - `500 { error: 'Failed to create product' }`



### 4) PATCH /backend/products/:id### 4) PATCH /backend/products/:id



- 用途：更新商品基本資訊及 SEO- 用途：更新商品基本資訊及 SEO

- 請求：部分欄位（name, slug, description, tags, status, visibility, is_featured, category_ids, meta_title, meta_description 等）- 請求：部分欄位（name, slug, description, tags, status, visibility, is_featured, category_ids, meta_title, meta_description 等）

- 回傳：`200 { id, name, ... }`- 回傳：`200 { id, name, ... }`

- 失敗：- 失敗：

  - `400 { error: 'No fields to update' }`  - `400 { error: 'No fields to update' }`

  - `500 { error: 'Update failed' }`  - `500 { error: 'Update failed' }`



### 5) DELETE /backend/products/:id### 5) DELETE /backend/products/:id



- 用途：刪除商品及其所有相關資料（圖片、SEO、價格、庫存）- 用途：刪除商品及其所有相關資料（圖片、SEO、價格、庫存）

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`

- 失敗：`500 { error: 'Delete failed' }`- 失敗：`500 { error: 'Delete failed' }`



### 6) PATCH /backend/products/:id/photos

- 用途：更新商品層級的圖片 URL（寬表設計，一列最多 10 欄 photo_url_1~10）；若該商品不存在照片列，則自動建立（upsert）。
- 請求（任意欄位擇一或多個）：
  - `{ "photo_url_1"?: string | null, ..., "photo_url_10"?: string | null }`
- 回傳：`200 { id, product_id, photo_url_1, ..., photo_url_10 }`
- 失敗：`400 { error: 'No photo URLs to update' }`、`500 { error: 'Update failed' | 'Insert failed' }`

備註：實際圖片檔案上傳請使用下方的 `POST /backend/products/:id/storage-upload` 取得公開 URL，再以本端點更新 URL 欄位。



### 7) POST /backend/products/:id/storage-upload

- 用途：將單一圖片檔案上傳到 Supabase Storage（bucket: `products`），並回傳公開 URL。
- 請求：`multipart/form-data`，欄位 `file` 為圖片檔案。
- 回傳：`200 { url: string }`
- 失敗：`400 { error: 'No file provided' }`、`500 { error: 'Upload failed' }`



### 8) POST /backend/products/:productId/variant-photos/:inventoryId/upload

- 用途：上傳指定變體（inventory_id）的一張圖片至 Storage 並回傳公開 URL。
- 請求：`multipart/form-data`，欄位 `file` 為圖片檔案。
- 回傳：`200 { url: string }`
- 失敗：`400 { error: 'No file provided' }`、`500 { error: 'Upload failed' }`



### 9) PATCH /backend/products/:productId/variant-photos/:inventoryId

- 用途：為指定變體 upsert 三個圖片 URL 欄位（`variant_photo_url_1~3`）。若前一版有 URL 被移除，伺服端會試圖刪除 Storage 內對應檔案。
- 請求：
  - `{ "variant_photo_url_1"?: string | null, "variant_photo_url_2"?: string | null, "variant_photo_url_3"?: string | null }`
- 回傳：`200 { id, product_id, inventory_id, variant_photo_url_1, variant_photo_url_2, variant_photo_url_3 }`
- 失敗：`500 { error: 'Update failed' | 'Insert failed' }`

備註：

- 寬表結構：商品層級圖片固定 10 欄；變體層級圖片固定 3 欄，分別存於 `backend_products_photo`，以 `inventory_id` 區分。
- 刪除變體（DELETE /backend/products/:productId/inventory/:inventoryId）時，伺服端會嘗試移除該變體圖片對應的 Storage 檔案後再刪除資料列。



### 9) GET /backend/products/:productId/inventory### 9) GET /backend/products/:productId/inventory



- 用途：取得商品的庫存記錄（支援多倉庫、多SKU變體）- 用途：取得商品的庫存記錄（支援多倉庫、多SKU變體）

- 查詢參數（可選）：- 查詢參數（可選）：

  - `sku_key`：特定SKU，若省略則回傳該商品的所有庫存記錄  - `sku_key`：特定SKU，若省略則回傳該商品的所有庫存記錄

  - `warehouse`：特定倉庫，預設為 `主倉`  - `warehouse`：特定倉庫，預設為 `主倉`

- 回傳：`200 [ { id, product_id, sku_key, warehouse, current_stock_qty, safety_stock_qty, low_stock_threshold, track_inventory, allow_backorder, allow_preorder, barcode, hs_code, origin, notes, weight, length_cm, width_cm, height_cm, created_at, updated_at }, ... ]`- 回傳：`200 [ { id, product_id, sku_key, warehouse, current_stock_qty, safety_stock_qty, low_stock_threshold, track_inventory, allow_backorder, allow_preorder, barcode, hs_code, origin, notes, weight, length_cm, width_cm, height_cm, created_at, updated_at }, ... ]`

- 失敗：`500 { error: 'Failed to fetch inventory' }`- 失敗：`500 { error: 'Failed to fetch inventory' }`



### 10) POST /backend/products/:productId/inventory### 10) POST /backend/products/:productId/inventory



- 用途：建立商品的庫存記錄- 用途：建立商品的庫存記錄

- 請求：- 請求：



```json```json

{{

  "sku_key": null,  "sku_key": null,

  "warehouse": "主倉",  "warehouse": "主倉",

  "current_stock_qty": 100,  "current_stock_qty": 100,

  "safety_stock_qty": 10,  "safety_stock_qty": 10,

  "low_stock_threshold": 5,  "low_stock_threshold": 5,

  "track_inventory": true,  "track_inventory": true,

  "allow_backorder": false,  "allow_backorder": false,

  "allow_preorder": false,  "allow_preorder": false,

  "barcode": "1234567890",  "barcode": "1234567890",

  "hs_code": "6109101000",  "hs_code": "6109101000",

  "origin": "Taiwan",  "origin": "Taiwan",

  "notes": "Optional notes",  "notes": "Optional notes",

  "weight": 0.5,  "weight": 0.5,

  "length_cm": 10,  "length_cm": 10,

  "width_cm": 20,  "width_cm": 20,

  "height_cm": 30  "height_cm": 30

}}

``````



- 說明：- 說明：

  - `sku_key` 為 `null` 時表示該商品無變體；設定值時表示該變體的SKU識別符  - `sku_key` 為 `null` 時表示該商品無變體；設定值時表示該變體的SKU識別符

  - 每個 `(product_id, warehouse, sku_key)` 的組合必須唯一  - 每個 `(product_id, warehouse, sku_key)` 的組合必須唯一

  - 所有欄位均為選填，未提供時使用預設值  - 所有欄位均為選填，未提供時使用預設值

- 回傳：`200 { id, product_id, sku_key, warehouse, ... }`- 回傳：`200 { id, product_id, sku_key, warehouse, ... }`

- 失敗：- 失敗：

  - `400 { error: 'Duplicate inventory record' }`  - `400 { error: 'Duplicate inventory record' }`

  - `500 { error: 'Failed to create inventory' }`  - `500 { error: 'Failed to create inventory' }`



### 11) PATCH /backend/products/:productId/inventory/:inventoryId### 11) PATCH /backend/products/:productId/inventory/:inventoryId



- 用途：更新庫存記錄的部分欄位- 用途：更新庫存記錄的部分欄位

- 請求：JSON，僅包含欲更新的欄位- 請求：JSON，僅包含欲更新的欄位



```json```json

{{

  "current_stock_qty": 150,  "current_stock_qty": 150,

  "safety_stock_qty": 20,  "safety_stock_qty": 20,

  "low_stock_threshold": 10  "low_stock_threshold": 10

}}

``````



- 回傳：`200 { id, product_id, sku_key, warehouse, ... }`- 回傳：`200 { id, product_id, sku_key, warehouse, ... }`

- 失敗：- 失敗：

  - `400 { error: 'No fields to update' }`  - `400 { error: 'No fields to update' }`

  - `500 { error: 'Update failed' }`  - `500 { error: 'Update failed' }`



### 12) DELETE /backend/products/:productId/inventory/:inventoryId### 12) DELETE /backend/products/:productId/inventory/:inventoryId



- 用途：刪除庫存記錄- 用途：刪除庫存記錄

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`

- 失敗：`500 { error: 'Delete failed' }`- 失敗：`500 { error: 'Delete failed' }`



### 13) GET /backend/products/:productId/prices### 13) GET /backend/products/:productId/prices



- 用途：取得商品的價格記錄（支援多SKU變體）- 用途：取得商品的價格記錄（支援多SKU變體）

- 查詢參數（可選）：- 查詢參數（可選）：

  - `sku_key`：特定SKU，若省略則回傳該商品的所有價格記錄  - `sku_key`：特定SKU，若省略則回傳該商品的所有價格記錄

- 回傳：`200 [ { id, product_id, sku_key, sale_price, compare_at_price, cost_price, created_at, updated_at }, ... ]`- 回傳：`200 [ { id, product_id, sku_key, sale_price, compare_at_price, cost_price, created_at, updated_at }, ... ]`

- 失敗：`500 { error: 'Failed to fetch prices' }`- 失敗：`500 { error: 'Failed to fetch prices' }`



### 14) POST /backend/products/:productId/prices### 14) POST /backend/products/:productId/prices



- 用途：建立商品的價格記錄- 用途：建立商品的價格記錄

- 請求：- 請求：



```json```json

{{

  "sku_key": null,  "sku_key": null,

  "sale_price": 1000.00,  "sale_price": 1000.00,

  "compare_at_price": 1500.00,  "compare_at_price": 1500.00,

  "cost_price": 600.00  "cost_price": 600.00

}}

``````



- 說明：- 說明：

  - `sku_key` 為 `null` 時表示該商品無變體；設定值時表示該變體的SKU識別符  - `sku_key` 為 `null` 時表示該商品無變體；設定值時表示該變體的SKU識別符

  - 每個 `(product_id, sku_key)` 的組合必須唯一  - 每個 `(product_id, sku_key)` 的組合必須唯一

  - 所有價格欄位均為選填，未提供時為 `null`  - 所有價格欄位均為選填，未提供時為 `null`

- 回傳：`200 { id, product_id, sku_key, sale_price, compare_at_price, cost_price, created_at, updated_at }`- 回傳：`200 { id, product_id, sku_key, sale_price, compare_at_price, cost_price, created_at, updated_at }`

- 失敗：- 失敗：

  - `400 { error: 'Duplicate price record' }`  - `400 { error: 'Duplicate price record' }`

  - `500 { error: 'Failed to create price' }`  - `500 { error: 'Failed to create price' }`



### 15) PATCH /backend/products/:productId/prices/:priceId### 15) PATCH /backend/products/:productId/prices/:priceId



- 用途：更新價格記錄的部分欄位- 用途：更新價格記錄的部分欄位

- 請求：JSON，僅包含欲更新的欄位- 請求：JSON，僅包含欲更新的欄位



```json```json

{{

  "sale_price": 1100.00,  "sale_price": 1100.00,

  "compare_at_price": 1600.00,  "compare_at_price": 1600.00,

  "cost_price": 650.00  "cost_price": 650.00

}}

``````



- 回傳：`200 { id, product_id, sku_key, sale_price, compare_at_price, cost_price, ... }`- 回傳：`200 { id, product_id, sku_key, sale_price, compare_at_price, cost_price, ... }`

- 失敗：- 失敗：

  - `400 { error: 'No fields to update' }`  - `400 { error: 'No fields to update' }`

  - `500 { error: 'Update failed' }`  - `500 { error: 'Update failed' }`



### 16) DELETE /backend/products/:productId/prices/:priceId### 16) DELETE /backend/products/:productId/prices/:priceId



- 用途：刪除價格記錄- 用途：刪除價格記錄

- 回傳：`200 { ok: true }`- 回傳：`200 { ok: true }`

- 失敗：`500 { error: 'Delete failed' }`- 失敗：`500 { error: 'Delete failed' }`



庫存與價格記錄說明：庫存與價格記錄說明：



- 庫存記錄儲存於 `backend_products_inventory` 表，支援多倉庫和多SKU變體追蹤- 庫存記錄儲存於 `backend_products_inventory` 表，支援多倉庫和多SKU變體追蹤

- 價格記錄儲存於 `backend_products_prices` 表，支援多SKU變體的個別定價- 價格記錄儲存於 `backend_products_prices` 表，支援多SKU變體的個別定價

- 當商品無變體時，`sku_key` 設為 `null`；有變體時，`sku_key` 為該變體的識別符（例如 `BK-PRO-256GB`）- 當商品無變體時，`sku_key` 設為 `null`；有變體時，`sku_key` 為該變體的識別符（例如 `BK-PRO-256GB`）

- 刪除商品時會自動級聯刪除相關的庫存與價格記錄- 刪除商品時會自動級聯刪除相關的庫存與價格記錄

````


