# Marelle 前端（Vite + React）— 本地開發與建置（Windows PowerShell）

此專案現已精簡為「前端-only」。以下是最小可行的指令與說明。

> 你使用的是 Windows PowerShell（v5.1）。同一行串接指令請用分號 `;`。

---

## 安裝

```powershell
npm install
```

## 開發（啟動 Vite）

```powershell
npm run dev
# 預設埠：3001
```

開啟瀏覽器：<http://localhost:3001>

## 建置與預覽

```powershell
npm run build
npm run preview
```

## Lint（可選）

```powershell
npm run lint
```

---

備註：

- 已移除所有後端/資料庫/Workers 相關腳本與設定。
- 若有頁面仍引用後端 API，請以 mocks 或日後實作的 API 取代；我可協助逐步清點並補上最小 mocks。


---
applyTo: '**'
---
# 架構

## 前端使用 React + TypeScript + Vite
前端使用 React + TypeScript + Vite,並且使用 Tailwind CSS 作為樣式工具
## 後端使用 Node.js + TypeScript + Express
後端使用 Node.js + TypeScript + Express
## 前端部署使用 Cloudflare Pages
前端部署使用 Cloudflare Pages,並且使用 Cloudflare 的 CDN 服務,使用自有網域 marelle.com.tw
## 後端部署使用 Cloudflare Workers
後端部署使用 Cloudflare Workers,並且使用 Cloudflare 的 CDN 服務,使用自有網域 api.marelle.com.tw
## 資料庫使用 Supabase
資料庫使用 Supabase,並且使用 Supabase 提供的 Postgres 資料庫服務
## 身份驗證使用 Supabase Auth
身份驗證使用 Supabase Auth,並且使用 Supabase 提供的身份驗證服務,但要另外支援 Line Login
## E-mail 使用 Google App script
E-mail 使用 Google App script,並且使用 Gmail 作為發信服務
## Line 訊息發送使用 Line messaging API
Line 訊息發送使用 Line messaging API,並且使用 Line 官方帳號作為發信服務
## 站內通知使用資料庫
站內通知使用資料庫,並且使用 Supabase 提供的資料庫服務
## 網頁追蹤服務使用 Google Analytics
網頁追蹤服務使用 Google Analytics,並且使用 Google 提供的網頁追蹤服務
## 網路推銷工具使用 Meta Pixel
網路推銷工具使用 Meta Pixel,並且使用 Meta 提供的網路推銷服務
## 網路安全服務使用 Cloudflare
網路安全服務使用 Cloudflare,並且使用 Cloudflare 提供的網路安全服務,並且所有的前端頁面的程式碼僅允許出現頁面以及頁面組件相關程式碼,任何後端API請求都必須透過後端API來進行,不可直接在前端頁面中呼叫第三方API