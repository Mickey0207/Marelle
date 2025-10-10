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