# 商品管理模組 (Products Module)

## 功能描述
負責處理所有與商品相關的業務邏輯，包括：
- 商品列表查詢
- 商品詳情獲取
- 商品新增、更新、刪除
- 商品圖片上傳

## 檔案結構
- `service.js` - 商品管理服務類
- `index.js` - 模組統一匯出

## API 端點
- `GET /products` - 獲取商品列表
- `GET /products/:id` - 獲取單個商品
- `POST /products` - 創建新商品
- `PUT /products/:id` - 更新商品
- `DELETE /products/:id` - 刪除商品
- `POST /products/:id/image` - 上傳商品圖片