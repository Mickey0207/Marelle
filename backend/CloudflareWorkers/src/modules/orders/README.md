# 訂單管理模組 (Orders Module)

## 功能描述

負責處理所有與訂單相關的業務邏輯，包括：

- 訂單列表查詢
- 訂單詳情獲取  
- 訂單狀態更新
- 物流資訊更新

## 檔案結構

- `service.js` - 訂單管理服務類
- `index.js` - 模組統一匯出

## API 端點

- `GET /orders` - 獲取訂單列表
- `GET /orders/:id` - 獲取單個訂單
- `PATCH /orders/:id/status` - 更新訂單狀態
- `PATCH /orders/:id/shipping` - 更新物流資訊