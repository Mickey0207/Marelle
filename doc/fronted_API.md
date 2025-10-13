# 前台 API 文件補充：地址簿

## 地址簿 API（前台）

- GET /frontend/account/addresses?type=home|cvs
  - 說明：取得使用者的宅配或超商地址清單（未封存），預設在前、更新時間新者在前。
  - 回傳：陣列（地址物件）

- POST /frontend/account/addresses
  - 說明：新增一筆地址。首筆同類型自動為預設；若傳 is_default=true，伺服器會自動取消同類型其他預設。
  - 請求（home）：{ type:'home', alias?, receiver_name, receiver_phone, zip3, city, district, address_line, is_default? }
  - 請求（cvs）：{ type:'cvs', alias?, vendor(UNIMARTC2C|FAMIC2C|HILIFEC2C|OKMARTC2C), store_id, store_name, store_address, is_default? }

- PATCH /frontend/account/addresses/:id
  - 說明：更新一筆地址；可設定 is_default。
  - 請求欄位同 POST，各欄位可選。

- DELETE /frontend/account/addresses/:id
  - 說明：封存（軟刪除）地址。若刪除的是預設，伺服器會自動將同類型中「最近更新」的一筆設為新預設（若存在）。

- GET /frontend/account/zip/:zip3
  - 說明：以 3 碼郵遞區號查城市與行政區對照。
  - 回傳：{ zip3, city, district } 或 404。

- POST /frontend/account/ecpay/map/start?subType=FAMIC2C|UNIMARTC2C|HILIFEC2C|OKMARTC2C
  - 說明：回傳自動送出的表單 HTML，開啟綠界電子地圖。選取完成後會由 /frontend/account/ecpay/map/return 儲存至 localStorage 並 window.postMessage 通知 opener。

## 前台登入與註冊 API（frontend_auth）

本節描述前台使用者的認證 API，均以 Cookie 驗證（HttpOnly, SameSite=Lax），前端請求需帶 credentials: 'include'。

1) POST /frontend/auth/register

- 用途：以 Email/Password 註冊 Supabase Auth 使用者，並同步建立 `fronted_users` 資料列。
- 請求：{ email: string, password: string, display_name?: string }
- 流程：
  - 成功呼叫 Supabase signUp（設定 emailRedirectTo 為登入頁 /login）
  - 使用 service role upsert `fronted_users`（id 對應 auth.users.id）
  - 回傳 { ok: true, confirmation_sent: true }
- 特殊：若該 email 已存在於 Supabase Auth，則直接以 admin 取得該 user.id 並 upsert `fronted_users`，回傳 { ok: true, exists: true, confirmation_sent: false }
- 回應碼：
  - 200 成功
  - 400 參數錯誤或 Supabase 註冊失敗
  - 500 伺服器錯誤


1) POST /frontend/auth/login

- 用途：以 Email/Password 登入，設定 access/refresh Cookie
- 請求：{ email: string, password: string }
- 條件：`fronted_users` 必須存在且 `is_active=true`，否則回 403：{ error: 'Not a frontend user' }
- 回應：200 { user: { id, email, display_name|null } }
- 錯誤：
  - 400 缺少參數
  - 401 帳密錯誤
  - 403 非前台使用者或已停用

1) GET /frontend/auth/me

- 用途：以 Cookie 取得目前登入使用者
- 回應：
  - 200 { id, email, display_name|null }
  - 401 未登入或權限不足

1) POST /frontend/auth/logout

- 用途：清除登入 Cookie
- 回應：200 { ok: true }


-- LINE 綁定與登入（統一 Callback）

1) GET /frontend/account/line/status

- 回傳：{ is_bound: boolean, line_display_name|null, line_picture_url|null }

1) GET /frontend/account/line/start

- 用途：已登入使用者進行 LINE 綁定，導向 LINE 授權頁面
- 設定：
  - 僅使用 FRONTEND_LINE_CHANNEL_ID / FRONTEND_LINE_CHANNEL_SECRET / FRONTEND_LINE_REDIRECT_BASE
  - redirect_uri 統一為 `${FRONTEND_LINE_REDIRECT_BASE}/frontend/line/callback`
  - 請在 LINE Developers 前台（前台用的 Channel）註冊完全相同的 Callback URL
- Debug：支援 `?dryrun=1` 回傳 { authorizeUrl, redirect_uri, client_id, base, flow: 'bind' }

1) GET /frontend/auth/line/start

- 用途：登入頁的 LINE 一鍵登入，導向 LINE 授權頁面
- 設定與上方相同，redirect_uri 亦為 `${FRONTEND_LINE_REDIRECT_BASE}/frontend/line/callback`
- Debug：支援 `?dryrun=1` 回傳 { authorizeUrl, redirect_uri, client_id, base, flow: 'login' }

1) GET /frontend/line/callback（統一 Callback）

- 用途：LINE 綁定與登入共用的 Callback。透過 state 前綴判斷流程：
  - `state` 前綴為 `bind:` 時，視為綁定流程：
    - 需已有登入 Cookie
    - 交換 code → 取得 profile → 更新 `fronted_users` (line_user_id, line_display_name, line_picture_url)
    - 302 導回 `${FRONTEND_SITE_URL}/account?line_bound=1`
  - `state` 前綴為 `login:` 時，視為登入流程：
    - 交換 code → 取得 profile → 以 line_user_id 查找/建立使用者（若無對應 auth.users 會建立一個 line.local 的信箱帳號）
    - 設定前台的 front-session Cookie（HMAC）
    - 302 導回 `${FRONTEND_SITE_URL}/account?line_login=1`
- 注意：必須在 LINE Developers 設定的 Callback URL 完全等於 `${FRONTEND_LINE_REDIRECT_BASE}/frontend/line/callback`，否則會收到 400 Invalid redirect_uri。

注意

- 註冊成功後，Supabase 會寄出確認信，使用者點擊後將導回 /login。
- LINE 註冊暫不提供；僅登入後提供綁定（未來將新增 /frontend/account/line 綁定 API）。
