// 前台頁面使用簡化的配置，不依賴後台的 Hook
// 直接定義配置結構

/**
 * 創建頁籤配置的工廠函數
 */
const createTabConfig = ({
  label,
  path,
  key,
  icon = null,
  count = undefined,
  description = ''
}) => ({
  label,
  path,
  key: key || label.toLowerCase().replace(/\s+/g, '-'),
  icon,
  count,
  description
});

/**
 * 批量創建頁籤配置
 */
const createTabsConfig = (configs) => {
  return configs.map(config => createTabConfig(config));
};

/**
 * 前台商品頁面子導航配置
 */
export const frontProductsTabsConfig = createTabsConfig([
  {
    label: '全部商品',
    path: '/products',
    key: 'all',
    description: '瀏覽所有商品'
  },
  {
    label: '熱門商品',
    path: '/products/popular',
    key: 'popular',
    description: '熱門商品推薦'
  },
  {
    label: '新品上市',
    path: '/products/new',
    key: 'new',
    description: '最新上架商品'
  },
  {
    label: '特價商品',
    path: '/products/sale',
    key: 'sale',
    description: '特價優惠商品'
  }
]);

/**
 * 前台用戶頁面子導航配置
 */
export const frontUserTabsConfig = createTabsConfig([
  {
    label: '個人資料',
    path: '/user/profile',
    key: 'profile',
    description: '編輯個人資料'
  },
  {
    label: '訂單記錄',
    path: '/user/orders',
    key: 'orders',
    description: '查看訂單記錄'
  },
  {
    label: '收藏清單',
    path: '/user/favorites',
    key: 'favorites',
    description: '我的收藏商品'
  },
  {
    label: '地址管理',
    path: '/user/addresses',
    key: 'addresses',
    description: '配送地址管理'
  },
  {
    label: '優惠券',
    path: '/user/coupons',
    key: 'coupons',
    description: '我的優惠券'
  }
]);

/**
 * 前台購物車頁面子導航配置
 */
export const frontCartTabsConfig = createTabsConfig([
  {
    label: '購物車',
    path: '/cart',
    key: 'cart',
    description: '購物車商品'
  },
  {
    label: '配送資訊',
    path: '/cart/shipping',
    key: 'shipping',
    description: '配送方式與地址'
  },
  {
    label: '付款方式',
    path: '/cart/payment',
    key: 'payment',
    description: '選擇付款方式'
  },
  {
    label: '訂單確認',
    path: '/cart/confirm',
    key: 'confirm',
    description: '確認訂單內容'
  }
]);