# 商品管理系統 - 前後端整合進度

## ✅ 已完成

### 1. 後端 API 完整實現

- **商品 API** (`Server/backend/API/products/index.ts`)
  - ✅ GET /backend/products（列表 + 篩選）
  - ✅ GET /backend/products/:id（單一商品含圖片和 SEO）
  - ✅ POST /backend/products（建立商品 + 自動 SEO 記錄）
  - ✅ PATCH /backend/products/:id（更新商品和 SEO）
  - ✅ DELETE /backend/products/:id（級聯刪除）
  - ✅ POST /backend/products/:id/photos（上傳商品圖片）
  - ✅ PATCH /backend/products/:productId/photos/:photoId（更新圖片）
  - ✅ DELETE /backend/products/:productId/photos/:photoId（刪除圖片含檔案）

### 2. 資料庫完整部署

- ✅ `backend_products`（商品主表）
- ✅ `backend_products_photo`（商品圖片）
- ✅ `backend_products_seo`（SEO 中繼資料）
- ✅ `backend_products_prices`（結構預留）
- ✅ `backend_products_inventory`（結構預留）
- ✅ products bucket + RLS 政策

### 3. 前端表單整合

- ✅ **AddProductAdvanced.jsx**
  - 6 步驟嚮導表單（基本資訊、定價、SKU 變體、分類、圖片、SEO）
  - handleSubmit 已連接 POST /backend/products API
  - 自動圖片上傳流程：建立產品 → 上傳圖片 → 設為主圖
  - FormData 支援多檔案上傳

- ✅ **Products.jsx**
  - 從後端 API 加載商品列表
  - 支援加載狀態與錯誤處理
  - 使用後端資料格式（base_sku, category_ids, photos, status, visibility）
  - 從 photos 陣列自動取得主圖顯示

### 4. 文件更新

- ✅ `doc/backend_API.md`（商品 API 完整說明）
- ✅ `doc/backend_database.md`（5 個商品表完整說明）
- ✅ `doc/SETUP_PRODUCTS_BUCKET.md`（bucket 手動設置指南）
- ✅ `backend/doc/folder_desc/pages_desc.md`（頁面說明）

## 🟡 進行中

### EditProduct.jsx 與 API 整合

需要實現：

- GET /backend/products/:id 加載商品資訊
- PATCH /backend/products/:id 更新商品
- 圖片管理（新增、刪除、重新排序、設為主圖）
- 分類重新選擇
- SEO 編輯

## ⛔ 待實現

### 1. 庫存與變體管理

- backend_products_inventory 的完整實現
- NestedSKUManager 與庫存 API 整合

### 2. 價格管理

- backend_products_prices 的完整實現
- 變體價格的後端支援

### 3. 列表頁功能

- 搜尋與篩選（按狀態、可見性、分類等）
- 商品刪除確認對話框
- 批量操作

### 4. 商品預覽

- ProductQuickViewModal 與後端 API 整合

## 技術細節

### 圖片上傳流程（AddProductAdvanced.jsx）

```javascript
1. 驗證表單
2. POST /backend/products → 建立商品，取得 product.id
3. 若有圖片：
   - 迴圈上傳每張圖片到 POST /backend/products/:id/photos
   - 第一張圖片自動設為主圖（PATCH is_primary: true）
4. 顯示成功訊息並導航到 /products
```

### 資料格式對應

| 前端欄位 | 後端欄位 | 備註 |
|---------|---------|------|
| `name` | `name` | 商品名稱 |
| `slug` | `slug` | URL 路由 |
| `shortDescription` | `short_description` | 簡短描述 |
| `description` | `description` | 詳細描述 |
| `tags` | `tags[]` | 標籤陣列 |
| `baseSKU` | `base_sku` | 基礎 SKU |
| `hasVariants` | `has_variants` | 是否有變體 |
| `status` | `status` | draft/active/archived |
| `visibility` | `visibility` | visible/hidden |
| `featured` | `is_featured` | 精選商品 |
| `categories` | `category_ids[]` | 分類 ID 陣列 |
| `images` | 透過 photos API | 圖片需分次上傳 |
| `metaTitle` | `meta_title` | SEO 標題 |
| `metaDescription` | `meta_description` | SEO 描述 |

### API 認證

所有端點需要：

- `credentials: 'include'`（攜帶 Cookie）
- 後端驗證 `backend_admins` 表中的管理員身份

## 編譯狀態

✅ npm run build 成功

- 4329 modules 轉換完畢
- 無編譯錯誤
- dist/ 已生成

## 部署檢查清單

- [ ] 在 Supabase Dashboard 建立 `products` bucket（用戶已完成）
- [ ] 設置 bucket RLS 政策（已部署）
- [ ] 測試 AddProductAdvanced 表單提交
- [ ] 驗證圖片上傳至 products bucket
- [ ] 確認 Products 列表正確顯示後端資料
- [ ] 實現 EditProduct 功能
- [ ] 添加列表頁篩選與搜尋
- [ ] 商品刪除功能與確認對話框

