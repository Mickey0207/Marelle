# Pages 頁面描述

> 依目錄分組：每頁一行簡述用途。

## 根目錄

apps/web/src/Pages/products/CategoryManagement.jsx: 分類管理主頁，支援樹狀分類新增/編輯/刪除與圖片上傳，已連接後端 API。

apps/web/src/Pages/products/Products.jsx: 商品列表與管理主頁，從後端 API 加載商品清單，支援預覽/編輯/刪除操作。包含展開式子表格顯示每個商品的所有 SKU 變體及其價格資訊（售價、原價、會員價、成本），子表格的編輯按鈕可編輯所有價格欄位（售價、原價、金卡價、銀卡價、VIP價、成本）並更新到 Supabase。

apps/web/src/Pages/products/AddProductAdvanced.jsx: 商品新增 6 步驟嚮導表單（基本資訊、定價、SKU 變體、分類、圖片、SEO），已連接後端 API 進行建立，支援 5 層級嵌套 SKU 變體結構與庫存欄位保存。

apps/web/src/Pages/products/EditProduct.jsx: 商品編輯頁，5 個步驟嚮導表單（基本資訊、SKU 變體管理、商品分類、圖片媒體、SEO 設定），從後端 API 加載商品完整信息（基本資訊、庫存、定價、照片、SEO），支援編輯所有商品屬性及 5 層級嵌套 SKU 變體和庫存定價，已連接後端 API 進行更新。

## 其他管理頁面

apps/web/src/Pages/accounting/: 會計模組相關頁面。

apps/web/src/Pages/admin/: 管理員與角色管理頁面。

apps/web/src/Pages/analytics/: 分析與報表頁面。

apps/web/src/Pages/inventory/: 庫存管理頁面，支援 5 層級 SKU 庫存欄位的顯示與查詢，包含可展開的子表格顯示每個 SKU 變體的庫存資訊（庫存量、安全庫存、庫存價值、狀態），及編輯按鈕可修改所有 SKU 欄位（條碼、庫存量、安全庫存、倉庫、原產地、重量、5 層級 SKU 規格）。

apps/web/src/Pages/logistics/: 物流管理頁面。

apps/web/src/Pages/marketing/: 行銷管理頁面。

apps/web/src/Pages/members/: 會員管理頁面。

apps/web/src/Pages/notifications/: 通知與公告頁面。

apps/web/src/Pages/orders/: 訂單管理頁面。

apps/web/src/Pages/procurement/: 採購管理頁面。

apps/web/src/Pages/reviews/: 評論管理頁面。

apps/web/src/Pages/settings/: 系統設定頁面。

apps/web/src/Pages/user-tracking/: 使用者追蹤頁面。

