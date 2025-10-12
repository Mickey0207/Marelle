# 後台登入與認證 API（backend_auth）

本節描述後台使用的認證 API，部署於 Cloudflare Workers（參考 `Server/Config/wrangler.toml`）。所有端點皆使用 Cookie 搭配跨站授權，前端必須以 `credentials: 'include'` 發送請求。

共用規範

- 認證 Cookie：

  - `sb-access-token`（短期，Supabase access token）
  - `sb-refresh-token`（長期，Supabase refresh token）
  - `admin-session`（HMAC 簽發，僅用於 LINE 已綁定時的直接登入，非 Supabase session）

- 錯誤格式：`{ error: string }`

用途：優先以 `sb-access-token` 取得使用者；若不存在，且存在 `admin-session`，則以該 session 識別 admin 並回傳資料庫中的 email（需 `SUPABASE_SERVICE_ROLE_KEY`）

- 用途：Email/Password 登入並在回應中設定 Cookie
- 成功：`200 { user: { id: string, email: string } }`
- 失敗：`401 { error: 'Invalid credentials' }` 或 `400 { error: 'Missing email or password' }`
-- GET /backend/auth/line/callback
  
  - 用途：LINE 回呼端點，驗證 state，交換 access_token，抓取 profile
  - 成功（已綁定）：若該 `line_user_id` 已綁定 `backend_admins`，且設定 `ADMIN_SESSION_SECRET`，伺服端簽發 `admin-session` Cookie（有效期預設 12 小時），並 302 轉址至 `/`
  - 成功（未綁定）：302 轉址至 `/login?line_status=success&bound=0&name=...`
  - 失敗：302 轉址至 `/login?line_status=error&reason=...`
  - 環境變數：`LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `LINE_REDIRECT_URI`，以及（選用）`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`

1) GET /backend/auth/me

前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。

`admin-session` 僅用於識別已綁定 LINE 的管理員身分，不等同 Supabase 的 Auth Session，若需要呼叫 Supabase 需透過 service role 或另外建立 Supabase session。

- 用途：以 access token 驗證後，回傳使用者資訊
- 成功：`200 { id: string, email: string }`
- 未授權：`401 { error: 'Unauthorized' }`

1) POST /backend/auth/refresh

- 用途：使用 refresh token 交換新的 access token 並更新 Cookie
- 成功：`200 { ok: true }`
- 失敗：`401 { error: 'Refresh failed' }` 或 `500 { error: 'Refresh failed' }`

1) GET /backend/auth/modules

- 用途：取得目前登入使用者可用的後台模組清單。伺服端會以目前管理員的 `backend_admins.role`，查詢 `backend_role_modules` 的布林矩陣，並與啟用中的 `backend_modules` 交集後回傳。
- 成功：`200 [ 'dashboard', 'products', ... ]`
- 未授權：`401 { error: 'Unauthorized' }`

注意事項

- 前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。
- 本文件與程式碼同步維護；如有新增或調整端點，請先閱讀並更新此文件後再修改程式碼。

1) LINE OAuth 登入流程

-- GET /backend/auth/line/start

- 用途：導向 LINE 授權頁，於 Cookie 寫入 state
- 成功：302 轉址至 LINE 授權網址
- 參數（查詢字串，選填）：
  - `mode`：`login` 或 `bind`（預設 `login`）
  - `next`：綁定成功後回跳的相對路徑（預設 `/accountsetting/oauth`）

-- GET /backend/auth/line/callback

- 用途：LINE 回呼端點，驗證 state，交換 access_token，抓取 profile
- `mode=login`：
  - 已綁定：簽發 `admin-session` Cookie 並 302 導回 `/`
  - 未綁定：302 導回 `/login?line_status=success&bound=0&name=...`
- `mode=bind`：
  - 需為已登入管理員（sb-access-token 或 admin-session）
  - 若 `line_user_id` 已被其他帳號佔用：302 導回 `/accountsetting/oauth?bind=error&reason=line_id_taken`
  - 綁定成功：302 導回 `/accountsetting/oauth?bind=success`
- 失敗：302 轉址至 `/login?line_status=error&reason=...`
- 回傳/導向所需的環境變數：`LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `LINE_REDIRECT_URI`；選用 `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`

1) 帳號設定 · LINE 綁定/查詢 API

## 管理員與角色 API（backend_admin）

所有端點皆需攜帶 Cookie（`credentials: 'include'`）。未授權回應：`401 { error: 'Unauthorized' }`。

1) GET /backend/admins

- 用途：取得管理員清單
- 回傳：`200 Array<{ id, email, display_name, role, department, line_user_id, line_display_name, line_picture_url, is_active }>`

1) PATCH /backend/admins/:id
1) POST /backend/admins

- 用途：建立新的管理員帳號（會同時建立 Supabase Auth 使用者以及 backend_admins 資料列）
- 請求：`{ email: string, password: string, display_name?: string, role?: string, department?: string }`
- 回傳：`200 { id: string, email: string, display_name: string | null, role: string, department?: string }`

1) POST /backend/admins/:id/send-reset-email

- 用途：寄送 Supabase 的密碼重設信給該使用者
- 行為：信中的連結將導向 `SITE_URL` 下的 `/auth/reset-password`（請於 Workers 環境變數設定 SITE_URL，例如 <http://localhost:3001> 或正式網域）
- 回傳：`200 { ok: true }`


- 用途：更新管理員基本欄位
- 請求：`{ display_name?: string, role?: string, is_active?: boolean, department?: string }`（至少一欄）
- 回傳：`200 { ok: true }`

1) GET /backend/roles

- 用途：取得所有角色
- 回傳：`200 Array<{ id: string, name: string }>`（id 為前端使用的臨時識別，name 為實際角色名）

1) POST /backend/roles

- 用途：建立角色（對應 backend_role_modules 新增一列，所有模組布林預設為 false）
- 請求：`{ name: string }`
- 回傳：`200 { id: string, name: string }`

1) GET /backend/roles/:role/modules

- 用途：取得指定角色啟用中的後台模組鍵名列表
- 回傳：`200 string[]`（僅回傳在資料表 backend_modules 內且 is_active=true 的模組鍵）

1) PUT /backend/roles/:role/modules

1) GET /backend/modules

- 用途：取得目前啟用中的後台模組清單（供前端顯示與角色授權 UI 使用）
- 回傳：`200 Array<{ key: string, label: string }>`

- 用途：以傳入陣列覆蓋指定角色的模組啟用布林矩陣（只接受目前為啟用中的模組鍵名）
- 請求：`{ modules: string[] }`
- 回傳：`200 { ok: true }`

-- POST /backend/account/line/unbind

- 用途：解除目前管理員的 LINE 綁定
- 鑑權：需要登入（sb-access-token 或 admin-session）
- 成功：`200 { ok: true }`
- 未授權：`401 { error: 'Unauthorized' }`
- 失敗：`500 { error: 'Failed to unbind' }`

