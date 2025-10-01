# 產品標籤系統 - 快速開始

## ✨ 新功能特色

### 1. 更顯眼的標籤設計
- 加粗字體 + 大寫字母
- 2px 實線邊框
- 陰影效果
- 背景模糊效果
- 95% 透明背景

### 2. 多種預設標籤
| 標籤 | 顏色 | 用途 |
|------|------|------|
| 缺貨 | 深灰 | 自動顯示(inStock=false) |
| 熱銷中 | 品牌橘 | 熱門商品 |
| 預購中 | 藍色 | 預購商品 |
| 新品 | 綠色 | 新到貨 |
| 限量 | 紅色 | 限量商品 |
| 特價 | 橘色 | 促銷商品 |

### 3. 優先級系統
當商品有多個標籤時,只顯示優先級最高的:
```
缺貨(100) > 限量(85) > 熱銷(90) > 預購(80) > 特價(75) > 新品(70)
```

## 🚀 快速使用

### 為商品添加標籤

編輯 `external_mock/data/products.mock.js`:

```javascript
import { TAG_TYPES } from './productTags.js';

const product = {
  id: 1,
  name: '質感商品',
  inStock: true,
  tags: [TAG_TYPES.HOT_SALE], // 添加「熱銷中」標籤
  // ... 其他欄位
};
```

### 新增自訂標籤

編輯 `external_mock/data/productTags.js`:

```javascript
export const TAG_TYPES = {
  // ... 現有類型
  SEASONAL: 'seasonal',
};

export const TAG_CONFIG = {
  // ... 現有配置
  [TAG_TYPES.SEASONAL]: {
    label: '季節限定',
    bgColor: 'rgba(236, 72, 153, 0.95)', // 粉紅色
    textColor: '#FFFFFF',
    borderColor: '#EC4899',
    priority: 88,
  },
};
```

## 📁 相關檔案

- **標籤系統**: `external_mock/data/productTags.js`
- **產品資料**: `external_mock/data/products.mock.js`
- **詳細文檔**: `external_mock/data/TAG_USAGE_GUIDE.md`
- **商品頁面**: `src/pages/Products.jsx`
- **首頁**: `src/pages/Home.jsx`

## 🎨 標籤預覽

目前示範資料中的標籤分布:
- 商品 1: 無標籤
- 商品 2: 無標籤
- 商品 3: 特價
- 商品 4: 無標籤
- 商品 5: **缺貨** (自動)
- 商品 6: 限量 + 特價 → 顯示「限量」
- 商品 7: 熱銷中
- 商品 8: 預購中
- 商品 9: 新品 + 特價 → 顯示「特價」
- 商品 10: **缺貨** (自動)

## 💡 提示

1. **缺貨優先**: 當商品缺貨時,會自動覆蓋其他標籤
2. **單一顯示**: 只顯示一個標籤,保持視覺簡潔
3. **顏色搭配**: 建議使用半透明背景色搭配實色邊框
4. **文字簡短**: 標籤文字建議 2-4 個中文字

## 🔧 進階功能

使用 `addCustomTag` 動態添加標籤:

```javascript
import { addCustomTag } from './productTags';

addCustomTag('exclusive', {
  label: '獨家',
  bgColor: 'rgba(124, 58, 237, 0.95)',
  textColor: '#FFFFFF',
  borderColor: '#7C3AED',
  priority: 92,
});
```

---

更多詳細說明請參考 `TAG_USAGE_GUIDE.md`
