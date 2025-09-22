/**
 * 導航結構配置文件
 * 支援最多五層的分類結構
 * 路由格式：/products/主分類/子分類/子子分類/子子子分類/子子子子分類
 */

/**
 * 生成路由路徑的工具函數
 * @param {string} basePath - 基礎路徑 (通常是 /products)
 * @param {Array} pathSegments - 路徑片段陣列
 * @returns {string} - 完整的路由路徑
 */
export const generateRoutePath = (basePath, pathSegments) => {
  const validSegments = pathSegments.filter(segment => segment && segment.trim() !== '');
  return validSegments.length > 0 ? `${basePath}/${validSegments.join('/')}` : basePath;
};

/**
 * 扁平化導航結構，提取所有可點擊的項目
 * @param {Array} navigationItems - 導航項目陣列
 * @param {string} basePath - 基礎路徑
 * @param {Array} parentPath - 父級路徑陣列
 * @returns {Array} - 扁平化的導航項目
 */
export const flattenNavigationItems = (navigationItems, basePath = '/products', parentPath = []) => {
  const flattened = [];
  
  navigationItems.forEach(item => {
    const currentPath = [...parentPath, item.slug];
    const fullPath = generateRoutePath(basePath, currentPath);
    
    // 添加當前項目
    flattened.push({
      ...item,
      fullPath,
      pathSegments: currentPath,
      level: currentPath.length
    });
    
    // 遞歸處理子項目
    if (item.children && item.children.length > 0) {
      flattened.push(...flattenNavigationItems(item.children, basePath, currentPath));
    }
  });
  
  return flattened;
};

/**
 * 根據路由路徑查找對應的導航項目
 * @param {string} pathname - 當前路由路徑
 * @param {Array} navigationItems - 導航項目陣列
 * @returns {Object|null} - 匹配的導航項目
 */
export const findNavigationItemByPath = (pathname, navigationItems) => {
  const flattened = flattenNavigationItems(navigationItems);
  return flattened.find(item => item.fullPath === pathname) || null;
};

/**
 * 主導航配置
 * 每個項目結構：
 * {
 *   name: '顯示名稱',
 *   slug: 'url-slug',
 *   description: '描述',
 *   isMega: boolean, // 是否顯示大型下拉選單
 *   children: [...] // 子項目陣列，最多支援五層
 * }
 */
export const navigationConfig = [
  {
    name: '油漆',
    slug: 'paint',
    description: '各種油漆產品',
    isMega: true,
    children: [
      {
        name: '單色',
        slug: 'color',
        description: '單色油漆',
        children: [
          {
            name: '灰白色系',
            slug: 'gray-white',
            description: '灰白色系列',
            children: [
              {
                name: '純白',
                slug: 'pure-white',
                description: '純白色油漆'
              },
              {
                name: '暖白',
                slug: 'warm-white',
                description: '暖白色油漆'
              },
              {
                name: '冷灰',
                slug: 'cool-gray',
                description: '冷灰色油漆'
              }
            ]
          },
          {
            name: '大地色系',
            slug: 'earth-tone',
            description: '大地色系列',
            children: [
              {
                name: '土棕',
                slug: 'earth-brown',
                description: '土棕色油漆'
              },
              {
                name: '沙米',
                slug: 'sand-beige',
                description: '沙米色油漆'
              }
            ]
          },
          {
            name: '綠色系',
            slug: 'green',
            description: '綠色系列'
          },
          {
            name: '藍色系',
            slug: 'blue',
            description: '藍色系列'
          },
          {
            name: '奶茶色系',
            slug: 'milk-tea',
            description: '奶茶色系列'
          }
        ]
      },
      {
        name: '套組',
        slug: 'set',
        description: '油漆套組',
        children: [
          {
            name: '小套組',
            slug: 'small',
            description: '小型套組'
          },
          {
            name: '大套組',
            slug: 'large',
            description: '大型套組'
          },
          {
            name: '專業套組',
            slug: 'professional',
            description: '專業級套組'
          }
        ]
      },
      {
        name: '保護漆',
        slug: 'protective',
        description: '保護漆'
      },
      {
        name: '試色罐',
        slug: 'sample',
        description: '試色罐'
      },
      {
        name: '工具組',
        slug: 'tools',
        description: '油漆工具組'
      }
    ]
  },
  {
    name: '家具茶',
    slug: 'furniture',
    description: '家具類產品',
    isMega: true,
    children: [
      {
        name: '椅子',
        slug: 'chair',
        description: '各式椅子',
        children: [
          {
            name: '辦公椅',
            slug: 'office',
            description: '辦公室椅子'
          },
          {
            name: '餐椅',
            slug: 'dining',
            description: '餐廳椅子'
          },
          {
            name: '休閒椅',
            slug: 'leisure',
            description: '休閒椅子'
          }
        ]
      },
      {
        name: '桌子',
        slug: 'table',
        description: '各式桌子',
        children: [
          {
            name: '辦公桌',
            slug: 'office',
            description: '辦公室桌子'
          },
          {
            name: '餐桌',
            slug: 'dining',
            description: '餐廳桌子'
          },
          {
            name: '咖啡桌',
            slug: 'coffee',
            description: '咖啡桌'
          }
        ]
      },
      {
        name: '收納',
        slug: 'storage',
        description: '收納用品'
      }
    ]
  },
  {
    name: '地毯',
    slug: 'rug',
    description: '各式地毯',
    isMega: true,
    children: [
      {
        name: '客廳地毯',
        slug: 'living-room',
        description: '客廳用地毯'
      },
      {
        name: '臥室地毯',
        slug: 'bedroom',
        description: '臥室用地毯'
      },
      {
        name: '戶外地毯',
        slug: 'outdoor',
        description: '戶外用地毯'
      }
    ]
  },
  {
    name: '窗簾',
    slug: 'curtain',
    description: '各式窗簾',
    isMega: true,
    children: [
      {
        name: '遮光窗簾',
        slug: 'blackout',
        description: '遮光功能窗簾'
      },
      {
        name: '薄紗窗簾',
        slug: 'sheer',
        description: '薄紗材質窗簾'
      },
      {
        name: '百葉窗',
        slug: 'blinds',
        description: '百葉窗簾'
      }
    ]
  },
  {
    name: '居家商品',
    slug: 'home',
    description: '居家生活用品',
    isMega: true,
    children: [
      {
        name: '照明',
        slug: 'lighting',
        description: '燈具照明',
        children: [
          {
            name: '吊燈',
            slug: 'pendant',
            description: '吊燈'
          },
          {
            name: '檯燈',
            slug: 'table',
            description: '檯燈'
          },
          {
            name: '落地燈',
            slug: 'floor',
            description: '落地燈'
          }
        ]
      },
      {
        name: '裝飾',
        slug: 'decoration',
        description: '裝飾用品',
        children: [
          {
            name: '畫作',
            slug: 'artwork',
            description: '藝術畫作'
          },
          {
            name: '花瓶',
            slug: 'vase',
            description: '裝飾花瓶'
          },
          {
            name: '擺飾',
            slug: 'ornament',
            description: '擺飾用品'
          }
        ]
      },
      {
        name: '香氛',
        slug: 'fragrance',
        description: '香氛產品'
      }
    ]
  }
];

/**
 * 非商品類別的導航項目
 */
export const nonProductNavigation = [
  {
    name: '改造指南',
    slug: 'guide',
    href: '/guide',
    description: '居家改造指南'
  },
  {
    name: '生活風格',
    slug: 'style',
    href: '/style',
    description: '生活風格文章'
  }
];

/**
 * 組合完整的主導航配置
 */
export const primaryNavigation = [
  {
    name: '全部商品',
    slug: 'all-products',
    href: '/products',
    description: '所有商品',
    isMega: false
  },
  ...navigationConfig.map(item => ({
    ...item,
    href: generateRoutePath('/products', [item.slug])
  })),
  ...nonProductNavigation
];

/**
 * 為 Navbar 組件格式化導航數據
 * 支援完整的五層分類結構，每層在獨立欄位中顯示
 */
export const formatNavigationForNavbar = () => {
  return primaryNavigation.map(item => {
    if (item.isMega && item.children) {
      // 創建欄位結構，最多支援五欄
      const columns = [];
      
      // 第一欄：主要分類的直接子項目
      if (item.children && item.children.length > 0) {
        columns.push({
          title: item.name,
          items: item.children.map(child => ({
            name: child.name,
            href: generateRoutePath('/products', [item.slug, child.slug]),
            hasChildren: !!(child.children && child.children.length > 0),
            fullPath: [item.slug, child.slug],
            parentPath: [item.slug]
          }))
        });
        
        // 第二欄：找出所有第二層的子項目
        const level2Items = [];
        item.children.forEach(child => {
          if (child.children && child.children.length > 0) {
            child.children.forEach(grandChild => {
              level2Items.push({
                name: grandChild.name,
                href: generateRoutePath('/products', [item.slug, child.slug, grandChild.slug]),
                parent: child.name,
                hasChildren: !!(grandChild.children && grandChild.children.length > 0),
                fullPath: [item.slug, child.slug, grandChild.slug],
                parentPath: [item.slug, child.slug]
              });
            });
          }
        });
        
        if (level2Items.length > 0) {
          columns.push({
            title: '類型',
            items: level2Items
          });
        }
        
        // 第三欄：找出所有第三層的子項目
        const level3Items = [];
        item.children.forEach(child => {
          if (child.children) {
            child.children.forEach(grandChild => {
              if (grandChild.children && grandChild.children.length > 0) {
                grandChild.children.forEach(greatGrandChild => {
                  level3Items.push({
                    name: greatGrandChild.name,
                    href: generateRoutePath('/products', [item.slug, child.slug, grandChild.slug, greatGrandChild.slug]),
                    parent: grandChild.name,
                    hasChildren: !!(greatGrandChild.children && greatGrandChild.children.length > 0),
                    fullPath: [item.slug, child.slug, grandChild.slug, greatGrandChild.slug],
                    parentPath: [item.slug, child.slug, grandChild.slug]
                  });
                });
              }
            });
          }
        });
        
        if (level3Items.length > 0) {
          columns.push({
            title: '系列',
            items: level3Items
          });
        }
        
        // 第四欄：找出所有第四層的子項目
        const level4Items = [];
        item.children.forEach(child => {
          if (child.children) {
            child.children.forEach(grandChild => {
              if (grandChild.children) {
                grandChild.children.forEach(greatGrandChild => {
                  if (greatGrandChild.children && greatGrandChild.children.length > 0) {
                    greatGrandChild.children.forEach(greatGreatGrandChild => {
                      level4Items.push({
                        name: greatGreatGrandChild.name,
                        href: generateRoutePath('/products', [item.slug, child.slug, grandChild.slug, greatGrandChild.slug, greatGreatGrandChild.slug]),
                        parent: greatGrandChild.name,
                        hasChildren: false,
                        fullPath: [item.slug, child.slug, grandChild.slug, greatGrandChild.slug, greatGreatGrandChild.slug],
                        parentPath: [item.slug, child.slug, grandChild.slug, greatGrandChild.slug]
                      });
                    });
                  }
                });
              }
            });
          }
        });
        
        if (level4Items.length > 0) {
          columns.push({
            title: '細分',
            items: level4Items
          });
        }
      }
      
      return {
        name: item.name,
        href: item.href,
        mega: true,
        columns: columns
      };
    }
    
    return {
      name: item.name,
      href: item.href,
      mega: false
    };
  });
};

export default {
  navigationConfig,
  nonProductNavigation,
  primaryNavigation,
  generateRoutePath,
  flattenNavigationItems,
  findNavigationItemByPath,
  formatNavigationForNavbar
};