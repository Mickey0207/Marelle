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

