# 客戶管理模組 (Customers Module)

## 功能描述
負責處理所有與客戶相關的業務邏輯，包括：
- 客戶列表查詢
- 客戶詳情獲取
- 客戶資訊更新
- 客戶備註管理

## 檔案結構
- `service.js` - 客戶管理服務類
- `index.js` - 模組統一匯出

## API 端點
- `GET /customers` - 獲取客戶列表
- `GET /customers/:id` - 獲取單個客戶
- `PUT /customers/:id` - 更新客戶資訊
- `POST /customers/:id/notes` - 添加客戶備註