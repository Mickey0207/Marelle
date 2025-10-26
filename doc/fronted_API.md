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

---

## 前台 API 文件補充：購物車（fronted_carts）

命名說明

- 本節所有路徑以 `/frontend/cart` 為基底，僅供前台使用。
- 認證：已登入操作需帶 Cookie（HttpOnly, SameSite=Lax），伺服器以 RLS 保護；訪客模式由後端以 Service Role 操作（不開放直接給前端 Cookie 讀寫）。

資料模型對應

- 主表：`public.fronted_carts`
- 明細：`public.fronted_cart_items`
- 關聯：`product_id` → `public.backend_products(id)`；`inventory_id` → `public.backend_products_inventory(id)`

共用物件（回傳）

```ts
Cart {
  id: string,
  status: 'active' | 'merged' | 'abandoned' | 'converted',
  currency: 'TWD',
  totals: { subtotal: number, discount: number, shipping_fee: number, tax: number, grand_total: number, quantity: number },
  items: CartItem[]
}

CartItem {
  id: string,
  product_id: number,
  inventory_id: number,
  sku_key?: string,
  name: string,
  image_url?: string,
  quantity: number,
  unit_price: number,
  currency: 'TWD',
  line_total: number,
  selected_options?: object
}
```

## GET /frontend/cart

- 用途：取得目前使用者（或訪客）的一個 active 購物車。
- 行為：
  - 已登入：根據 `auth.uid()` 取 `user_id` 對應之 active cart；無則建立空車返回。
  - 未登入（訪客）：若存在 `guest_token` Cookie，取其 active cart；無則建立新訪客車並回 Set-Cookie。
- 回應：200 Cart

## POST /frontend/cart/items

- 用途：新增或合併一筆商品變體到購物車。
- 請求：{ product_id: number, inventory_id: number, quantity: number, selected_options?: object }
- 行為：
  - 若明細已存在（以 inventory_id 判斷），則加總數量（套限購與庫存上限）
  - `unit_price` 由伺服器依目前定價規則計算，回寫明細與更新主表 totals
- 回應：200 Cart（更新後）
- 錯誤：
  - 400 參數錯誤
  - 404 product/inventory 不存在或不可售
  - 409 超過可購買數量

## PATCH /frontend/cart/items/:itemId

- 用途：更新明細數量或選項。
- 請求：{ quantity?: number, selected_options?: object }
- 行為：
  - 若 quantity=0 視同刪除
  - 更新後重算 totals
- 回應：200 Cart（更新後）

## DELETE /frontend/cart/items/:itemId

- 用途：移除一筆明細。
- 回應：200 Cart（更新後）

## POST /frontend/cart/merge

- 用途：登入瞬間，將前端 localStorage（或訪客車）提交給後端進行合併。
- 請求：{ draft_items: Array<{ product_id: number, inventory_id: number, quantity: number, selected_options?: object }> }
- 行為：
  - 以 inventory_id 為唯一鍵進行合併：加總數量、套用庫存/限購、過濾不可售品項
  - 回傳合併後 Cart 與摘要（新增/合併/移除清單）
- 回應：200 { cart: Cart, summary: { added: number, merged: number, removed: number } }

## POST /frontend/cart/checkout/validate

- 用途：結帳前最後檢核價格與庫存。
- 行為：
  - 針對每筆明細重新讀取最新價格、促銷與庫存，必要時調整數量或標記不可購買
  - 返回可結帳狀態或需要使用者確認的差異
- 回應：
  - 200 { ok: true, cart: Cart }
  - 409 { ok: false, issues: Issue[] , cart: Cart }
    - Issue：缺貨/限購/價格變動/下架等

備註

- 所有需要登入的操作，後端以 RLS 保證 `auth.uid() = cart.user_id`。
- 訪客模式的新增/查詢/合併由後端（Service Role）代為執行，不直接暴露 guest_token 給前端 JS。

---

## 產品瀏覽 API（fronted_products）

所有端點允許跨來源 GET，供前台商城頁面讀取商品資料與顯示標籤樣式。

### GET /frontend/products

- 用途：取得商品清單（支援分類與關鍵字查詢），同時回傳顯示所需之標籤與顏色欄位。
- 查詢參數：
  - `category`：可選，分類路徑如 `c-f/dress`（以最後節點 slug 匹配）
  - `q`：可選，關鍵字（name/slug ilike）
  - `limit`、`offset`：分頁參數
- 回傳：`200 { items: Array<Item> }`
  - `Item` 欄位：
    - `id: number`
    - `name: string`
    - `slug: string`
    - `href: string`（商品頁連結）
    - `image: string`（主圖，若無則透明 1x1 PNG）
    - `price: number`（有效售價；若無明確 base 定價取所有變體最小售價）
    - `originalPrice: number|null`（原價）
    - `inStock: boolean`
    - `tags: string[]`（商品標籤，左上角取第一個顯示）
    - `promotionLabel: string|null`（右上角優惠標籤文案）
    - `promotionLabelBgColor: string|null`（右上角優惠標籤背景色，HEX）
    - `promotionLabelTextColor: string|null`（右上角優惠標籤文字色，HEX）
    - `productTagBgColor: string|null`（左上角產品標籤背景色，HEX）
    - `productTagTextColor: string|null`（左上角產品標籤文字色，HEX）

### GET /frontend/products/:slugOrId

- 用途：取得商品詳情，含圖片、（最多 5 層）規格變體樹與定價概要，以及新標籤/色彩欄位。
- 參數：`slugOrId` 可為數字 ID 或 slug 字串。
- 回傳：
  - `200 {
      id: number,
      name: string,
      slug: string,
      description: string,
      tags: string[],
      promotionLabel: string|null,
      promotionLabelBgColor: string|null,
      promotionLabelTextColor: string|null,
      productTagBgColor: string|null,
      productTagTextColor: string|null,
      images: string[],
      variants: VariantNode[],
      specsLabels: string[],
      price: number,
      originalPrice: number|null,
      inStock: boolean
    }`
  - `VariantNode`：巢狀結構（最多五層），葉節點包含 `{ payload: { sku, stock, price|null, compare|null, image } }`
  - `404 { error: 'Not found' }` 當找不到商品

備註：

- 標籤/顏色欄位皆為可空；若 `promotionLabel` 為空，前端可自行以折扣（若存在）顯示 fallback 徽章。
- 左上角產品標籤取 `tags` 的第一個字串作為文案，並使用 `productTagBgColor`/`productTagTextColor` 上色。
