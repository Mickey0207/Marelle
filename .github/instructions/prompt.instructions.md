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

# Supabase 資料表說明
## users
使用者資料表,包含使用者的基本資料,另外要注意,使用者的密碼以及身份驗證相關資料,都不會存在這個資料表中,而是存在 Supabase Auth 中,但是還有儲存用戶的LINE ID,以便於發送 LINE 訊息資訊
## 各資料表命名規則
如果是專屬於後台使用的資料表請以 backend_ 開頭,如果是專屬於前台使用的資料表請以 fronted_ 開頭,如果是兩者共用的資料表請以 common_ 開頭
## 各資料表說明文件
請將所有建立的資料表按照欄位(中英文說明),以及此資料表的用途、資料表的關聯說明,簡短說明,後台的撰寫於 doc\backend_database.md ,前台的撰寫於 doc\frontend_database.md ,共用的撰寫於 doc\common_database.md ,並且每一次只要有更動資料表就需要更新這些文件,然後每一次要更新資料表的時候,都需要先讀一次這些文件確認修改的地方,然後再修改資料表

# API 說明
## API 命名規則
如果是專屬於後台使用的 API 文件請以 backend_ 開頭,如果是專屬於前台使用的 API 文件請以 frontend_ 開頭,如果是兩者共用的 API 文件請以 common_ 開頭
## API 文件說明
後台 API 文件更新於 doc\backend_api.md ,前台 API 文件更新於 doc\frontend_api.md ,共用 API 文件更新於 doc\common_api.md ,並且每一個 API 都要有詳細的說明,包含 API 的用途、API 的路徑、API 的請求方式、API 的請求參數、API 的回傳參數、API 的錯誤代碼說明,並且每一次只要有更動 API 就需要更新這些文件,然後每一次要更新 API 的時候,都需要先讀一次這些文件確認修改的地方,然後再修改 API

# 系統整體架構說明
系統整體架構說明文件更新於 doc\system.md ,並且每一次只要有更動系統架構就需要更新這個文件,然後每一次要更新系統架構的時候,都需要先讀一次這個文件確認修改的地方,然後再修改系統架構,需要包含系統的整體架構圖,以及各個服務的說明,包含前端、後端、資料庫、第三方服務等