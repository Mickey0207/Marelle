# Marelle Backend — 快速指令（Windows PowerShell）

最常用的一小撮命令，直接複製就能跑。更多腳本請看 `package.json` 的 `scripts`。

> 備註：你的 Shell 是 Windows PowerShell（v5.1）。同一行串接指令請用分號 `;`。

---

## 1) 安裝與啟動（Vite）

```powershell
npm install
npm run dev
# 指定埠號（可選）
npm run dev -- --port 3001
```

建置與預覽：

```powershell
npm run build
npm run preview
```

Admin 模式：

```powershell
npm run dev:admin
npm run build:admin
npm run preview:admin
```

---

## 2) Cloudflare Workers（Wrangler）

```powershell
# 首次登入（必要時）
npx wrangler login

# 本機開發 / 部署
npm run workers:dev
npm run workers:deploy

# 觀察日誌
npx wrangler tail
```

---

## 3) 資料庫（Drizzle）

```powershell
# Studio（GUI）
npm run db:studio

# 變更與遷移
npm run db:generate
npm run db:migrate
npm run db:push

# 初始化 / 灌資料（若有需要）
npm run db:setup
npm run db:seed
```

（如需指定 SQLite 位置）

```powershell
$env:DATABASE_URL = "sqlite:./CloudflareWorkers/database/marelle-local.db"; npx drizzle-kit studio
```

---

## 4) 其他常用

```powershell
# Lint
npm run lint

# 物流腳本
npm run logistics:status
npm run logistics:history

# 清除建置輸出
Remove-Item -Recurse -Force dist
```

---

更多請見 `package.json` 的完整 `scripts` 清單。

## 8) npm scripts 速查表（完整）

以下所有腳本都可用 `npm run <script>` 執行：

- dev：啟動 Vite 開發伺服器
- dev:admin：以 admin 模式啟動 Vite
- build：建置專案（一般模式）
- build:admin：建置專案（admin 模式）
- lint：以 ESLint 檢查（`.js,.jsx`），阻擋警告上限為 0
- preview：預覽建置輸出（一般模式）
- preview:admin：預覽建置輸出（admin 模式）
- workers:dev：Cloudflare Workers 本機開發（wrangler dev）
- workers:deploy：部署 Cloudflare Workers（wrangler deploy）
- db:studio：開啟 Drizzle Studio GUI
- db:generate：依 schema 產生 migration 檔
- db:migrate：套用 migration 至資料庫
- db:push：推送 schema（視驅動而定）
- db:setup：執行資料庫初始化腳本
- db:seed：執行資料庫灌資料腳本
- logistics:status：產生物流狀態定義（`scripts/generateLogisticsStatus.js`）
- logistics:history：產生物流歷史（`scripts/generateLogisticsHistory.js`）

> 範例：

```powershell
npm run lint
npm run logistics:status
npm run logistics:history
```

---

若需要，我可以再依你的 `package.json` 實際 scripts 幫你加上專屬的一鍵指令區塊。


全部

npm run dev:all:studio
