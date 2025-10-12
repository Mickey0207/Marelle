# 系統架構（摘要）

- 前端：React + Vite（backend/apps/web）
- 後端：Cloudflare Workers（Server/），框架 Hono
- 認證：Supabase Auth（Email/Password）；Cookie 模式（HttpOnly, Secure, SameSite=Lax）

登入流程：

1. 前端呼叫 POST /backend/auth/login（帶 email/password）
2. Workers 透過 Supabase Auth 核發 session，設定 access/refresh Cookie
3. 後續以 GET /backend/auth/me 取得使用者資訊，並定期 POST /backend/auth/refresh
4. 登出呼叫 POST /backend/auth/logout 清除 Cookie

注意：

- 前端所有請求需帶 credentials: 'include'
- 之後將擴充 LINE Login 與權限模組的資料表與 API

- 嚴格規範（後台登入）

- 後台成功登入的前提：使用者必須同時
  1) 存在於 Supabase Auth（Email/Password 驗證通過），以及
  2) 存在於資料表 `backend_admins`，且 `is_active=true`
- 若不符合第 2 點，後端將回應 403：`{ error: 'Not a backend admin' }`，以區分於 401 的帳密錯誤。
- 權限載入：登入後伺服端依 `backend_admins.role` 與 `backend_role_modules` 交集啟用中的 `backend_modules` 回傳可用模組清單，前端依此隱藏側邊欄按鈕並做路由守門。

