# Marelle API (Cloudflare Workers)

Runtime: Cloudflare Workers + Hono
Auth: Supabase Auth (email/password now; LINE login planned)

## 開發

1. 設定環境變數（本機）
   - 建立 `Server/.dev.vars` 檔案（不進版控）：

```bash
SUPABASE_URL=你的 supabase url
SUPABASE_ANON_KEY=你的 anon key
```

2. 安裝相依（在 `Server/` 目錄）
   - npm install

3. 開發啟動（需已安裝 Wrangler）
   - npm run dev

預設會啟動本地 Workers（預期 <http://localhost:8787> 或 Wrangler 顯示的 port）。

## 端點

- 見 `doc/backend_API.md` 中的 backend_auth 區段。

## 前端串接

- 前端已改為呼叫 `/backend/auth/*` 並以 Cookie 管理會話，確保 `fetch` 帶入 `credentials: 'include'`。
