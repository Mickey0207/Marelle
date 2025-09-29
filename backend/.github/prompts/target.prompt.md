---
mode: agent
---

# Marelle 全面重構計劃（Workers + OpenAPI + Typed Client）

本文件定義重構任務、具體步驟、約束條件與成功準則。策略依你的要求：先刪舊（CloudflareWorkers、src/lib）、再建新（Workers 本地開發 + 前端 typed client）、最後依 `src/management/Pages` 逐頁對接。

## 架構與設計選擇（採用）
- 專案結構：apps/web（Vite 前端）、apps/worker（Cloudflare Worker 後端）、packages/shared（共用型別/Zod）、packages/api-client（由 OpenAPI 產生的 typed client）。
- 後端框架：Hono + Zod + @hono/zod-openapi，生成 OpenAPI 3.1；Swagger UI 掛載 /docs，規格輸出 /openapi.json。
- 資料庫：Cloudflare D1 + Drizzle ORM（嚴格外鍵、migration、seed）。
- 認證：Access Token（短時效，存在記憶體）+ Refresh Token（HttpOnly Cookie，SameSite=Lax，專用 /auth/refresh），RBAC（部門/角色/模組）。
- 部署：前端 Cloudflare Pages；後端獨立 Workers 子網域（api.*），避免耦合、便於流量與版本控管；前端以 Proxy 或 CORS 安全對接；支援「自有網域」綁定（Pages 自有網域與 Workers Route 綁定同一網域或子網域）。
- 開發：wrangler dev 啟動本地 Worker（含 D1 模擬），Vite 透過 proxy 指向本地 Worker；單一指令並行啟動。
- Mock：少量尚未落地的頁面以 MSW 過渡，逐步收斂至真實 API。

## 實驗/臨時方案管理（新增）
- 目的：所有「非正式的替代方案（例如暫時替代 KV/DO 的簡易令牌桶）」集中在 `experiments/` 目錄下，不與正式專案混用。
- 原則：
	- `experiments/` 內的程式碼不被正式打包或部署，不可被 `apps/web`、`apps/worker` 直接 import。
	- 提供 README 與使用說明，僅作為臨時參考或 PoC。
	- 待正式替代物（KV 或 Durable Objects）上線後，移除相關實驗內容。

## 約束條件
- Workers Runtime 不支援 Node 原生模組（移除 better-sqlite3/sqlite3 等）。
- Windows PowerShell 環境；命令與路徑以此為準。
- 不保留舊檔備份（以 git 回退）。

## 成功準則（驗收）
- 本地一鍵開發：一條指令同時啟動 Vite 與 wrangler，/docs 可互動調用 API。
- OpenAPI：/openapi.json 正確且被用於自動產生前端 typed client；型別檢查通過。
- 功能：Auth、Admin（含 LINE 顯示名）、部門/角色/模組設定全面走新 API 並可正常操作與權限控管。
- 資安：密碼 >= 12 碼、PBKDF2-SHA256、短時效 Access、Refresh Cookie、嚴格 CORS、基本速率限制與審計。
- 效能：主要清單/查詢具分頁與索引；適當快取（ETag/Cache-Control）；路由分包、關鍵頁骨架屏。
- 清理：完全刪除 /CloudflareWorkers 與 src/lib，package.json 無殘留無效依賴與腳本。
- 部署：Pages + Workers 正常運行，前端可登入並操作核心頁面；自有網域綁定完成（例如 admin.example.com 與 api.example.com）。

---

## 階段 0：刪除舊目錄與依賴（破壞性清理）
- [x] 刪除整個 `CloudflareWorkers/`
- [x] 刪除整個 `src/lib/`
- [x] 移除不再需要的依賴：better-sqlite3、sqlite3 等 Workers 不支援的原生模組
- [x] 移除舊腳本：`db:setup`、`db:seed` 等指向 `CloudflareWorkers` 的腳本
- [x] 開發輔助：`concurrently` 已安裝（保留）

## 階段 1：基礎骨架（目錄與配置）
- [x] 建立目錄：`apps/web`、`apps/worker`、`packages/shared`、`packages/api-client`
 - [x] 建立目錄：`experiments/` 並加入 README（說明臨時方案管理原則）
- [ ] 共同 ESLint/TS 設定與 EditorConfig（若後續導入 TS）
 - [x] Vite 專案遷移到 `apps/web`（維持現有 UI 與路由）
- [x] wrangler 設定遷移到 `apps/worker`（bindings：D1、KV、JWT_SECRET 等）
- [x] Vite dev server 設定 proxy：`/api` → `http://127.0.0.1:8787`
- [x] 單一啟動腳本：並行啟動 Vite 與 wrangler dev（與 Drizzle Studio 視需要）

## 階段 2：資料庫與模型（D1 + Drizzle）
- [ ] 定義資料表（部門/角色/模組、admins、line profile 等）與嚴格外鍵
- [ ] 撰寫 migration 並執行（本地 D1）
- [x] 建立 seed（預設 admin、部門/角色/模組、最小運作資料）
- [ ] 建立 repository/service 層：隔離 ORM 與業務邏輯

## 階段 3：安全基線（Auth/RBAC/中介層）
- [ ] PBKDF2-SHA256 密碼流（註冊/變更/驗證，>=12 碼）
- [ ] JWT Access（短 TTL）/ Refresh（HttpOnly Cookie，/auth/refresh）
- [ ] CORS 僅允許本地與 Pages 網域；預設禁止通配
- [ ] RBAC：部門/角色/模組權限中介層；路由宣告最低權限
- [ ] 速率限制（正式：KV 或 Durable Objects）
- [ ] 實驗：簡易令牌桶（in-memory）僅放於 `experiments/rate-limit/` 內做 PoC，不進正式路徑

## 階段 4：API 與 OpenAPI（Contract-first）
- [ ] 使用 Zod 定義所有請求/回應 schema
- [ ] 以 @hono/zod-openapi 產生 OpenAPI 3.1（版本化：/api/v1）
- [x] 提供 `/openapi.json` 與 `/docs`（Swagger UI）（暫以手寫最小規格，待解決 zod v3/v4 相依問題後改為自動產生）
- [ ] 統一回應包裝：`{ success, data, error? }`；分頁/排序/篩選標準參數

## 階段 5：前端 typed client 與基礎整合
- [ ] 由 OpenAPI 自動產生 `packages/api-client`（型別安全的 fetch 包裝）
- [ ] `apps/web` 接入 typed client；提供統一 http 客戶端（附帶 Authorization、重試、錯誤處理）
- [ ] 選配 MSW：替代尚未完成的 API，平滑過渡

## 階段 6：優先功能模組落地（依 Pages 優先級）
1) Auth
- [ ] /auth/login、/auth/refresh、/auth/me、/auth/change-password、/auth/bind-line
- [ ] 前端登入流程、Token 管理（記憶體）與刷新

2) Admin + 系統設定
- [ ] /admin/list、/admin/create、/admin/update（含 line_display_name）
- [ ] 部門/角色/模組 CRUD 與選項 API
- [ ] 前端管理頁（Admin + Settings）改接新 API

3) 其餘模組（逐頁）
- [ ] notifications 與 notification-center
- [ ] members / orders / products
- [ ] inventory / logistics / procurement
- [ ] marketing（coupons/festivals/gifts）/ analytics / user-tracking
- [ ] products / fromsigning

## 階段 7：效能與體驗
- [ ] 主要列表索引與查詢優化；N+1 規避
- [ ] ETag/If-None-Match 與 Cache-Control（對列表與靜態選項）
- [ ] 路由分包、骨架屏、關鍵渲染優先

## 階段 8：CI/CD 與品質管控
- [ ] 自動產生並發佈 OpenAPI；以 Spectral 等規則做破壞性變更 lint
- [ ] 基本單元測試與 smoke 測試（Auth/Admin 端到端最小閉環）
- [ ] 部署到 Cloudflare Pages（web）與 Workers（api.*）
- [ ] 版本與環境變數管理（生產/預備/開發）
- [ ] 禁止正式程式碼 import `experiments/`（以 lint/檢查避免混入）

## 階段 9：最終清理與驗收
- [ ] 確認前端不再引用 mocks；移除 MSW（如仍存在）
- [ ] package.json 腳本與依賴最終精簡
- [ ] 安全掃描（依賴、頭部、CORS、rate limit）
- [ ] 成功準則逐項驗收並歸檔

---

## 目前進度（動態更新區）
- [x] 已安裝 concurrently（供一鍵並行啟動使用）
- [x] 已完成階段 0 破壞性清理
- [x] 建立 apps/worker 骨架並更新 wrangler/main 指向
- [x] Vite 代理 /api → 8787
- [x] 解決 @hono/zod-openapi 與 zod 版本相依問題（目前 wrangler/miniflare 內建 zod@3 與 zod-openapi@^1 需 zod@^4 衝突）

補充：
- 已在 Worker 啟動路徑上接線 ensureSchema 與 seed（lazy 初始化，首次請求時建立/插入預設資料）。
- 已新增最小化 API：/api/health、/api/admin/list、/api/settings/{departments|roles|modules}，並以 Zod 定義回應 schema，掛載於自動產生的 OpenAPI 與 /docs。

## 備註
- 若未來確定同域部署（Pages Functions），可將認證全面切換為純 Cookie 流程（HttpOnly/SameSite/短時效）以簡化前端；目前採「Access in memory + Refresh Cookie」兼顧跨域開發與資安。
- 如需最小化變更路徑，也可先維持單倉單層，待核心模組穩定後再拆 apps/* 與 packages/*；本計劃直接落地最終形態以免重工。