# Marelle 電商平台

一個現代化的電商平台，採用微服務架構設計，前後台分離，使用 Cloudflare Workers 作為統一 API 服務。

## 🏗️ 專案架構

```
Marelle/
├── frontend/          # 前台客戶網站 (Port 3000)
├── backend/           # 後台管理系統 (Port 3001)
├── Cloudflare_Workers/ # API 服務 (Port 8787)
├── docs/              # 文件
├── package.json       # Workspace 管理
└── README.md          # 專案說明
```

## 🚀 快速開始

### 一鍵啟動所有服務
```bash
npm run dev:all
```

### 分別啟動服務
```bash
# 啟動 API 服務
npm run dev:workers

# 啟動前台
npm run dev:frontend

# 啟動後台
npm run dev:backend
```

### 安裝所有依賴
```bash
npm run install:all
```

## 📁 各專案說明

### 🛍️ 前台 (Frontend)
- **地址**: http://localhost:3000
- **技術**: React + Vite + Tailwind CSS
- **功能**: 商品瀏覽、購物車、結帳、會員系統

### 🎛️ 後台 (Backend)
- **地址**: http://localhost:3001
- **技術**: React + Vite + Tailwind CSS
- **功能**: 商品管理、訂單管理、會員管理、數據分析
- **登入**: 
  - 帳號: `admin`
  - 密碼: `password`

### 🔌 API 服務 (Workers)
- **地址**: http://localhost:8787
- **技術**: Cloudflare Workers + D1 Database + R2 Storage
- **功能**: 認證系統、資料 API、檔案管理

## 🔐 認證系統

### 前台 API 端點
- `POST /api/front/register` - 用戶註冊
- `POST /api/front/login` - 用戶登入
- `GET /api/front/profile` - 用戶資料
- `GET /api/front/orders` - 用戶訂單

### 後台 API 端點
- `POST /api/admin/login` - 管理員登入
- `POST /api/admin/create-admin` - 創建管理員
- `GET /api/admin/users` - 用戶列表
- `GET /api/admin/orders` - 訂單列表

### 商品 API 端點
- `GET /api/products` - 獲取商品列表
- `POST /api/admin/products` - 創建商品 (僅管理員)

## 🛠️ 開發指令

```bash
# 建置前台
npm run build:frontend

# 建置後台
npm run build:backend

# 部署 Workers (需要 Cloudflare 帳號)
cd Cloudflare_Workers/my-worker
npm run deploy
```

## 🌟 特色功能

- ✅ 前後台完全分離
- ✅ 統一 API 服務
- ✅ JWT 認證系統
- ✅ 玻璃態 UI 設計
- ✅ 響應式布局
- ✅ 動畫效果 (GSAP)
- ✅ 現代化技術棧

## 📄 License

MIT License