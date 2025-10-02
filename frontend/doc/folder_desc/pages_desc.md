# Pages 頁面描述

> 依目錄分組：每頁一行簡述用途（僅前端示意 / mock 資料來源皆為 external_mock）。

## 根目錄
src/pages/Home.jsx: 首頁組合多個區塊（Hero / 精選 / 特色 / 訂閱）之入口頁。
src/pages/favorites.jsx: 收藏清單頁，讀取 localStorage 顯示已收藏商品。

## products
src/pages/products/Products.jsx: 商品列表與篩選/排序主頁，組合各商品列表子組件。
src/pages/products/ProductDetail.jsx: 單一商品詳情頁，整合麵包屑、圖庫、購買面板、分頁、推薦。

## auth
src/pages/auth/FrontLogin.jsx: 前台登入頁，提供帳密登入與社群登入按鈕示意。
src/pages/auth/FrontRegister.jsx: 前台註冊頁，含基本欄位與條款勾選及送出流程。

## check
src/pages/check/Cart.jsx: 購物車頁面，顯示商品、數量調整、移除與金額統計。
src/pages/check/Checkout.jsx: 結帳流程頁（配送/付款/確認步驟與提交訂單示意）。

## member/account
src/pages/member/account/Profile.jsx: 會員個人資料頁（顯示帳號資訊與假資料說明與快速連結）。

## member/order
src/pages/member/order/OrdersCenter.jsx: 訂單中心頁，顯示訂單清單（目前為空狀態示意）。

## member/vip
src/pages/member/vip/VipArea.jsx: 會員 VIP 專區示意頁，展示優惠券與活動占位區塊。
