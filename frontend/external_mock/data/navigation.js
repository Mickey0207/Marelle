import { categories } from './categories';

// 將分類數據轉換為導航欄格式
const convertCategoriesToColumns = (cats) => {
  return cats.map(cat => ({
    title: cat.name,
    items: cat.children ? cat.children.map(child => ({
      name: child.name,
      href: child.href,
      hasChildren: !!(child.children && child.children.length > 0),
      children: child.children || []
    })) : []
  }));
};

// 格式化為導航欄使用的結構
export function formatNavigationForNavbar() {
  return [
    { 
      name: '首頁', 
      href: '/' 
    },
    { 
      name: '商品', 
      href: '/products', 
      mega: true, 
      columns: convertCategoriesToColumns(categories)
    }
  ];
}

// 保留舊的函數名稱以保持向後兼容
export const navigationConfig = categories;
