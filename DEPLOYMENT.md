# 部署說明

## 前台部署 (marelle.com.tw)
1. 修改 `src/main.jsx` 導入 `FrontApp` 而不是 `App`
2. 建置專案: `npm run build`
3. 部署到 marelle.com.tw

## 後台部署 (admin.marelle.com.tw)
1. 保持 `src/main.jsx` 導入 `App` (已更新為後台版本)
2. 建置專案: `npm run build`
3. 部署到 admin.marelle.com.tw

## 路由對應表

### 前台路由 (marelle.com.tw)
- `/` - 首頁
- `/products` - 商品列表
- `/products/:id` - 商品詳情
- `/cart` - 購物車
- `/checkout` - 結帳
- `/login` - 前台登入
- `/register` - 前台註冊

### 後台路由 (admin.marelle.com.tw)
- `/` - 管理總覽
- `/products` - 商品管理
- `/orders` - 訂單管理
- `/logistics` - 物流管理
- `/coupons` - 優惠管理
- `/festivals` - 節慶管理
- `/marketing` - 行銷管理
- `/members` - 會員管理
- `/gifts` - 贈品管理
- `/suppliers` - 供應商管理
- `/procurement` - 採購管理
- `/accounting` - 會計管理
- `/user-tracking` - 用戶追蹤
- `/notifications` - 通知管理
- `/analytics` - 數據分析
- `/settings` - 系統設定
- `/login` - 後台登入
- `/register` - 後台註冊