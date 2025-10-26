# Marelle API (Cloudflare Workers)

Runtime: Cloudflare Workers + Hono
Auth: Supabase Auth (email/password now; LINE login planned)

## 開發

1. 設定環境變數（本機）
   - 建立 `Server/Config/.dev.vars` 檔案（不進版控）。範本已隨專案提供，重點變數：
     - ECPAY_ENV：`stage`=測試端點；留空=正式端點。
     - 金流：ECPAY_PAYMENT_*（測試與正式各一組）。
     - 物流：測試環境分 C2C 與 Home 兩組（ECPAY_LOGISTICS_C2C_*、ECPAY_LOGISTICS_HOME_*），正式環境統一（ECPAY_LOGISTICS_*）。
   - LOGISTICS_SENDER_*：通用預設寄件人（前端未提供時由後端補值）。
   - LOGISTICS_SENDER_HOME_* / LOGISTICS_SENDER_C2C_*：依物流型別的預設寄件人；若未設定則回退到通用 LOGISTICS_SENDER_*。
   - 其他必要變數：

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
