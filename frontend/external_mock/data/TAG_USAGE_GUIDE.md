# 產品標籤系統使用說明

## 概述
產品標籤系統提供了一個靈活的方式來為產品添加視覺化的狀態標籤,如「缺貨」、「熱銷中」、「預購中」等。

## 檔案位置
- 標籤配置: `external_mock/data/productTags.js`
- 產品資料: `external_mock/data/products.mock.js`

## 已內建的標籤類型

### 1. 缺貨 (OUT_OF_STOCK)
- **顯示文字**: 缺貨
- **背景顏色**: 深灰色 `rgba(102, 102, 102, 0.95)`
- **文字顏色**: 白色 `#FFFFFF`
- **優先級**: 100 (最高)
- **說明**: 當產品的 `inStock` 為 `false` 時自動顯示

### 2. 熱銷中 (HOT_SALE)
- **顯示文字**: 熱銷中
- **背景顏色**: 品牌主色 `rgba(204, 130, 77, 0.95)`
- **文字顏色**: 白色 `#FFFFFF`
- **優先級**: 90

### 3. 預購中 (PRE_ORDER)
- **顯示文字**: 預購中
- **背景顏色**: 藍色 `rgba(59, 130, 246, 0.95)`
- **文字顏色**: 白色 `#FFFFFF`
- **優先級**: 80

### 4. 新品 (NEW_ARRIVAL)
- **顯示文字**: 新品
- **背景顏色**: 綠色 `rgba(16, 185, 129, 0.95)`
- **文字顏色**: 白色 `#FFFFFF`
- **優先級**: 70

### 5. 限量 (LIMITED)
- **顯示文字**: 限量
- **背景顏色**: 紅色 `rgba(239, 68, 68, 0.95)`
- **文字顏色**: 白色 `#FFFFFF`
- **優先級**: 85

### 6. 特價 (SALE)
- **顯示文字**: 特價
- **背景顏色**: 橘色 `rgba(245, 158, 11, 0.95)`
- **文字顏色**: 白色 `#FFFFFF`
- **優先級**: 75

## 使用方式

### 在產品資料中添加標籤

```javascript
import { TAG_TYPES } from './productTags.js';

const product = {
  id: 1,
  name: '質感商品',
  price: 1000,
  inStock: true,
  tags: [TAG_TYPES.HOT_SALE, TAG_TYPES.NEW_ARRIVAL], // 添加標籤
  // ... 其他欄位
};
```

### 在頁面中使用標籤

```javascript
import { getProductTags, getTagConfig } from "../../external_mock/data/productTags";

// 獲取產品的所有標籤(已排序)
const tags = getProductTags(product);

// 獲取主要標籤(優先級最高的)
const primaryTag = tags[0] ? getTagConfig(tags[0]) : null;

// 顯示標籤
{primaryTag && (
  <div 
    style={{
      background: primaryTag.bgColor,
      color: primaryTag.textColor,
      border: `2px solid ${primaryTag.borderColor}`,
    }}
  >
    {primaryTag.label}
  </div>
)}
```

## 新增自訂標籤

### 方法一: 直接修改配置檔案

編輯 `external_mock/data/productTags.js`:

```javascript
// 在 TAG_TYPES 中添加新類型
export const TAG_TYPES = {
  // ... 現有類型
  CUSTOM_TAG: 'customTag', // 新增
};

// 在 TAG_CONFIG 中添加配置
export const TAG_CONFIG = {
  // ... 現有配置
  [TAG_TYPES.CUSTOM_TAG]: {
    label: '自訂標籤',
    bgColor: 'rgba(100, 100, 255, 0.95)',
    textColor: '#FFFFFF',
    borderColor: '#6464FF',
    priority: 60,
  },
};
```

### 方法二: 使用 addCustomTag 函數

```javascript
import { addCustomTag } from '../../external_mock/data/productTags';

// 動態添加自訂標籤
addCustomTag('vipOnly', {
  label: 'VIP專屬',
  bgColor: 'rgba(147, 51, 234, 0.95)',
  textColor: '#FFFFFF',
  borderColor: '#9333EA',
  priority: 95,
});

// 使用新標籤
const product = {
  tags: ['vipOnly'],
  // ...
};
```

## 優先級說明

當產品有多個標籤時,只會顯示優先級最高的標籤:
- **100**: 缺貨 (最高優先級,會覆蓋其他標籤)
- **95**: 自訂高優先級標籤
- **90**: 熱銷中
- **85**: 限量
- **80**: 預購中
- **75**: 特價
- **70**: 新品
- **< 70**: 自訂低優先級標籤

## 標籤樣式說明

所有標籤使用統一的視覺設計:
- **字體**: 粗體、小寫轉大寫、寬字距
- **圓角**: 4px
- **陰影**: shadow-lg
- **邊框**: 2px 實線邊框
- **背景模糊**: backdrop-filter blur(8px)
- **透明度**: 95% 背景透明度

## 範例場景

### 1. 新品上市且限量
```javascript
{
  tags: [TAG_TYPES.LIMITED, TAG_TYPES.NEW_ARRIVAL]
  // 顯示: 限量 (優先級 85 > 70)
}
```

### 2. 熱銷商品缺貨
```javascript
{
  inStock: false,
  tags: [TAG_TYPES.HOT_SALE]
  // 顯示: 缺貨 (優先級 100,自動添加)
}
```

### 3. 預購中的新品
```javascript
{
  tags: [TAG_TYPES.PRE_ORDER, TAG_TYPES.NEW_ARRIVAL]
  // 顯示: 預購中 (優先級 80 > 70)
}
```

## 注意事項

1. **缺貨標籤**: 當 `inStock: false` 時會自動添加,無需手動設置
2. **優先級**: 只顯示一個標籤,確保視覺簡潔
3. **顏色一致性**: 建議新標籤顏色與品牌色系保持一致
4. **文字長度**: 建議標籤文字不超過 4 個中文字元,以確保美觀
5. **響應式**: 標籤會自動適應不同螢幕尺寸

## 未來擴展建議

- 支援多標籤同時顯示(在產品詳情頁)
- 標籤點擊篩選功能
- 標籤動畫效果
- 標籤倒數計時(如限時特賣)
