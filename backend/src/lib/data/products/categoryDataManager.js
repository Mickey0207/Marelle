// 商品分類管理相關數據和工具函數

// 分類層級枚舉
export const CATEGORY_LEVELS = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5
};

// 分類狀態枚舉
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  HIDDEN: 'hidden'
};

// 完整的分類樹狀數據 - 最多五層巢狀結構
export const PRODUCT_CATEGORIES = [
  {
    id: 'electronics',
    name: '電子產品',
    slug: 'electronics',
    level: 1,
    status: CATEGORY_STATUS.ACTIVE,
    children: [
      {
        id: 'computers',
        name: '電腦及周邊',
        slug: 'computers',
        level: 2,
        status: CATEGORY_STATUS.ACTIVE,
        children: [
          {
            id: 'laptops',
            name: '筆記型電腦',
            slug: 'laptops',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              {
                id: 'gaming-laptops',
                name: '電競筆電',
                slug: 'gaming-laptops',
                level: 4,
                status: CATEGORY_STATUS.ACTIVE,
                children: [
                  { 
                    id: 'high-end-gaming', 
                    name: '高階電競', 
                    slug: 'high-end-gaming',
                    level: 5, 
                    status: CATEGORY_STATUS.ACTIVE 
                  },
                  { 
                    id: 'mid-range-gaming', 
                    name: '中階電競', 
                    slug: 'mid-range-gaming',
                    level: 5, 
                    status: CATEGORY_STATUS.ACTIVE 
                  }
                ]
              },
              {
                id: 'business-laptops',
                name: '商務筆電',
                slug: 'business-laptops',
                level: 4,
                status: CATEGORY_STATUS.ACTIVE,
                children: [
                  { 
                    id: 'ultrabooks', 
                    name: '輕薄筆電', 
                    slug: 'ultrabooks',
                    level: 5, 
                    status: CATEGORY_STATUS.ACTIVE 
                  },
                  { 
                    id: 'workstations', 
                    name: '工作站', 
                    slug: 'workstations',
                    level: 5, 
                    status: CATEGORY_STATUS.ACTIVE 
                  }
                ]
              }
            ]
          },
          {
            id: 'desktops',
            name: '桌上型電腦',
            slug: 'desktops',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'gaming-desktops', 
                name: '電競桌機', 
                slug: 'gaming-desktops',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'office-desktops', 
                name: '辦公桌機', 
                slug: 'office-desktops',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          },
          {
            id: 'accessories',
            name: '電腦配件',
            slug: 'accessories',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'keyboards', 
                name: '鍵盤', 
                slug: 'keyboards',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'mice', 
                name: '滑鼠', 
                slug: 'mice',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          }
        ]
      },
      {
        id: 'smartphones',
        name: '智慧型手機',
        slug: 'smartphones',
        level: 2,
        status: CATEGORY_STATUS.ACTIVE,
        children: [
          {
            id: 'android',
            name: 'Android 手機',
            slug: 'android',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'samsung', 
                name: 'Samsung', 
                slug: 'samsung',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'huawei', 
                name: 'Huawei', 
                slug: 'huawei',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          },
          {
            id: 'iphone',
            name: 'iPhone',
            slug: 'iphone',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'iphone-15', 
                name: 'iPhone 15 系列', 
                slug: 'iphone-15',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'iphone-14', 
                name: 'iPhone 14 系列', 
                slug: 'iphone-14',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'clothing',
    name: '服裝配件',
    slug: 'clothing',
    level: 1,
    status: CATEGORY_STATUS.ACTIVE,
    children: [
      {
        id: 'mens-clothing',
        name: '男裝',
        slug: 'mens-clothing',
        level: 2,
        status: CATEGORY_STATUS.ACTIVE,
        children: [
          {
            id: 'mens-tops',
            name: '上衣',
            slug: 'mens-tops',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              {
                id: 'mens-shirts',
                name: '襯衫',
                slug: 'mens-shirts',
                level: 4,
                status: CATEGORY_STATUS.ACTIVE,
                children: [
                  { 
                    id: 'dress-shirts', 
                    name: '正式襯衫', 
                    slug: 'dress-shirts',
                    level: 5, 
                    status: CATEGORY_STATUS.ACTIVE 
                  },
                  { 
                    id: 'casual-shirts', 
                    name: '休閒襯衫', 
                    slug: 'casual-shirts',
                    level: 5, 
                    status: CATEGORY_STATUS.ACTIVE 
                  }
                ]
              },
              { 
                id: 'mens-tshirts', 
                name: 'T恤', 
                slug: 'mens-tshirts',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          },
          {
            id: 'mens-bottoms',
            name: '下裝',
            slug: 'mens-bottoms',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'mens-pants', 
                name: '長褲', 
                slug: 'mens-pants',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'mens-shorts', 
                name: '短褲', 
                slug: 'mens-shorts',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          }
        ]
      },
      {
        id: 'womens-clothing',
        name: '女裝',
        slug: 'womens-clothing',
        level: 2,
        status: CATEGORY_STATUS.ACTIVE,
        children: [
          {
            id: 'womens-tops',
            name: '上衣',
            slug: 'womens-tops',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'womens-blouses', 
                name: '襯衫', 
                slug: 'womens-blouses',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'womens-tshirts', 
                name: 'T恤', 
                slug: 'womens-tshirts',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          },
          {
            id: 'womens-dresses',
            name: '洋裝',
            slug: 'womens-dresses',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'casual-dresses', 
                name: '休閒洋裝', 
                slug: 'casual-dresses',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'formal-dresses', 
                name: '正式洋裝', 
                slug: 'formal-dresses',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'home-garden',
    name: '居家園藝',
    slug: 'home-garden',
    level: 1,
    status: CATEGORY_STATUS.ACTIVE,
    children: [
      {
        id: 'furniture',
        name: '家具',
        slug: 'furniture',
        level: 2,
        status: CATEGORY_STATUS.ACTIVE,
        children: [
          {
            id: 'living-room',
            name: '客廳家具',
            slug: 'living-room',
            level: 3,
            status: CATEGORY_STATUS.ACTIVE,
            children: [
              { 
                id: 'sofas', 
                name: '沙發', 
                slug: 'sofas',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              },
              { 
                id: 'coffee-tables', 
                name: '茶几', 
                slug: 'coffee-tables',
                level: 4, 
                status: CATEGORY_STATUS.ACTIVE 
              }
            ]
          }
        ]
      }
    ]
  }
];

// 工具函數

// 生成分類路徑
export const generateCategoryPath = (categories, categoryId) => {
  const findPath = (cats, id, path = []) => {
    for (const cat of cats) {
      const currentPath = [...path, cat];
      if (cat.id === id) {
        return currentPath;
      }
      if (cat.children) {
        const result = findPath(cat.children, id, currentPath);
        if (result) return result;
      }
    }
    return null;
  };
  
  return findPath(categories, categoryId);
};

// 獲取分類階層路徑字串
export const getCategoryBreadcrumb = (categories, categoryId) => {
  const path = generateCategoryPath(categories, categoryId);
  return path ? path.map(cat => cat.name).join(' > ') : '';
};

// 扁平化分類樹
export const flattenCategories = (categories) => {
  const result = [];
  const flatten = (cats, level = 1) => {
    cats.forEach(cat => {
      result.push({ ...cat, level });
      if (cat.children) {
        flatten(cat.children, level + 1);
      }
    });
  };
  flatten(categories);
  return result;
};

// 根據層級篩選分類
export const getCategoriesByLevel = (categories, level) => {
  const flattened = flattenCategories(categories);
  return flattened.filter(cat => cat.level === level);
};

// 搜尋分類
export const searchCategories = (categories, searchTerm) => {
  if (!searchTerm) return categories;
  
  const filterCategories = (cats) => {
    return cats.filter(category => {
      const nameMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const childrenMatch = category.children ? 
        filterCategories(category.children).length > 0 : false;
      
      if (nameMatch || childrenMatch) {
        return {
          ...category,
          children: category.children ? filterCategories(category.children) : []
        };
      }
      return false;
    }).filter(Boolean);
  };
  
  return filterCategories(categories);
};

// 獲取分類的所有子分類ID
export const getAllChildCategoryIds = (categories, parentId) => {
  const findCategory = (cats, id) => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategory(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const parent = findCategory(categories, parentId);
  if (!parent || !parent.children) return [];
  
  const getAllIds = (cats) => {
    const ids = [];
    cats.forEach(cat => {
      ids.push(cat.id);
      if (cat.children) {
        ids.push(...getAllIds(cat.children));
      }
    });
    return ids;
  };
  
  return getAllIds(parent.children);
};

// 驗證分類數據
export const validateCategoryData = (category) => {
  const errors = {};
  
  if (!category.name?.trim()) {
    errors.name = '分類名稱為必填項目';
  }
  
  if (!category.slug?.trim()) {
    errors.slug = '分類代碼為必填項目';
  }
  
  if (!category.level || category.level < 1 || category.level > 5) {
    errors.level = '分類層級必須在1-5之間';
  }
  
  return errors;
};

// 生成分類代碼
export const generateCategorySlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-')     // 空格替換為連字符
    .replace(/-+/g, '-')      // 多個連字符合併為一個
    .trim();
};

// 分類樹操作工具
export const CategoryTreeUtils = {
  // 收集所有分類ID
  collectAllIds: (categories) => {
    const ids = [];
    const collect = (cats) => {
      cats.forEach(cat => {
        ids.push(cat.id);
        if (cat.children) {
          collect(cat.children);
        }
      });
    };
    collect(categories);
    return ids;
  },
  
  // 檢查是否有選中的子項目
  hasSelectedChildren: (category, selectedIds) => {
    if (!category.children) return false;
    return category.children.some(child => 
      selectedIds.includes(child.id) || 
      CategoryTreeUtils.hasSelectedChildren(child, selectedIds)
    );
  },
  
  // 檢查所有子項目是否都被選中
  allChildrenSelected: (category, selectedIds) => {
    if (!category.children) return false;
    return category.children.every(child => selectedIds.includes(child.id));
  }
};