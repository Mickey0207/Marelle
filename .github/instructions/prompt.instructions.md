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

# 資料夾說明
## 前台前端資料夾
frontend
前台前端資料夾,包含所有前台頁面以及頁面組件,和暫時的模擬資料,資料夾架構參考
frontend\doc\folder_desc 的所有文件
## 後台前端資料夾
backend
後台前端資料夾,包含所有後台頁面以及頁面組件,和暫時的模擬資料,資料夾架構參考
backend\.github\instructions\prompt.instructions.md
