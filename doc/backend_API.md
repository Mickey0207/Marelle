# 後台登入與認證 API（backend_auth）

本節描述後台使用的認證 API，部署於 Cloudflare Workers（參考 `Server/Config/wrangler.toml`）。所有端點皆使用 Cookie 搭配跨站授權，前端必須以 `credentials: 'include'` 發送請求。

共用規範

- Base path：`/backend/auth`
- Content-Type：`application/json`
- 認證 Cookie：`sb-access-token`（短期）、`sb-refresh-token`（長期）
- 錯誤格式：`{ error: string }`

1) POST /backend/auth/login

- 用途：Email/Password 登入並在回應中設定 Cookie
- Body：`{ email: string, password: string }`
- 成功：`200 { user: { id: string, email: string } }`
- 失敗：`401 { error: 'Invalid credentials' }` 或 `400 { error: 'Missing email or password' }`

1) POST /backend/auth/logout

- 用途：登出並清除 Cookie
- 成功：`200 { ok: true }`

1) GET /backend/auth/me

- 用途：以 access token 驗證後，回傳使用者資訊
- 成功：`200 { id: string, email: string }`
- 未授權：`401 { error: 'Unauthorized' }`

1) POST /backend/auth/refresh

- 用途：使用 refresh token 交換新的 access token 並更新 Cookie
- 成功：`200 { ok: true }`
- 失敗：`401 { error: 'Refresh failed' }` 或 `500 { error: 'Refresh failed' }`

1) GET /backend/auth/modules

- 用途：取得目前登入使用者可用的後台模組清單（暫為靜態，後續將以資料庫控管）
- 成功：`200 [ 'dashboard', 'settings', 'products' ]`
- 未授權：`401 { error: 'Unauthorized' }`

注意事項

- 前端請求務必加上 `credentials: 'include'` 以便攜帶 Cookie。
- 本文件與程式碼同步維護；如有新增或調整端點，請先閱讀並更新此文件後再修改程式碼。

