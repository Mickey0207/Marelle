# 開發環境說明

## 本地開發服務器

### 前台（電商網站）
```bash
npm run dev
```
- URL: http://localhost:3000
- 應用: FrontApp.jsx
- 功能: 商品展示、購物車、結帳等電商功能

### 後台（管理系統）
```bash
npm run dev:admin
```
- URL: http://localhost:3001
- 應用: App.jsx
- 功能: 商品管理、訂單管理、數據分析等後台功能

## 生產環境部署

### 前台部署
- 域名: marelle.com.tw
- 指令: `npm run build`
- 服務: FrontApp.jsx

### 後台部署
- 域名: admin.marelle.com.tw
- 指令: `npm run build:admin`
- 服務: App.jsx

## 備用開發方式

如果需要在同一端口切換前後台（不推薦，但作為備用）：
- 前台: http://localhost:3000
- 後台: http://localhost:3000/?mode=admin

## 建議的工作流程

1. **前台開發**: 使用 `npm run dev` 在 3000 端口開發
2. **後台開發**: 使用 `npm run dev:admin` 在 3001 端口開發
3. **同時開發**: 可以同時運行兩個服務器，在不同瀏覽器標籤頁測試