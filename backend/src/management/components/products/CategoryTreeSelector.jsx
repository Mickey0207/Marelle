import React, { useState } from 'react';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  CheckIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

// 模擬分類數據 - 最多五層巢狀結構
const mockCategories = [
  {
    id: 'electronics',
    name: '電子產品',
    level: 1,
    children: [
      {
        id: 'computers',
        name: '電腦及周邊',
        level: 2,
        children: [
          {
            id: 'laptops',
            name: '筆記型電腦',
            level: 3,
            children: [
              {
                id: 'gaming-laptops',
                name: '電競筆電',
                level: 4,
                children: [
                  { id: 'high-end-gaming', name: '高階電競', level: 5 },
                  { id: 'mid-range-gaming', name: '中階電競', level: 5 }
                ]
              },
              {
                id: 'business-laptops',
                name: '商務筆電',
                level: 4,
                children: [
                  { id: 'ultrabooks', name: '輕薄筆電', level: 5 },
                  { id: 'workstations', name: '工作站', level: 5 }
                ]
              }
            ]
          },
          {
            id: 'desktops',
            name: '桌上型電腦',
            level: 3,
            children: [
              { id: 'gaming-desktops', name: '電競桌機', level: 4 },
              { id: 'office-desktops', name: '辦公桌機', level: 4 }
            ]
          },
          {
            id: 'accessories',
            name: '電腦配件',
            level: 3,
            children: [
              { id: 'keyboards', name: '鍵盤', level: 4 },
              { id: 'mice', name: '滑鼠', level: 4 }
            ]
          }
        ]
      },
      {
        id: 'smartphones',
        name: '智慧型手機',
        level: 2,
        children: [
          {
            id: 'android',
            name: 'Android 手機',
            level: 3,
            children: [
              { id: 'samsung', name: 'Samsung', level: 4 },
              { id: 'huawei', name: 'Huawei', level: 4 }
            ]
          },
          {
            id: 'iphone',
            name: 'iPhone',
            level: 3,
            children: [
              { id: 'iphone-15', name: 'iPhone 15 系列', level: 4 },
              { id: 'iphone-14', name: 'iPhone 14 系列', level: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'clothing',
    name: '服裝配件',
    level: 1,
    children: [
      {
        id: 'mens-clothing',
        name: '男裝',
        level: 2,
        children: [
          {
            id: 'mens-tops',
            name: '上衣',
            level: 3,
            children: [
              {
                id: 'mens-shirts',
                name: '襯衫',
                level: 4,
                children: [
                  { id: 'dress-shirts', name: '正式襯衫', level: 5 },
                  { id: 'casual-shirts', name: '休閒襯衫', level: 5 }
                ]
              },
              { id: 'mens-tshirts', name: 'T恤', level: 4 }
            ]
          },
          {
            id: 'mens-bottoms',
            name: '下裝',
            level: 3,
            children: [
              { id: 'mens-pants', name: '長褲', level: 4 },
              { id: 'mens-shorts', name: '短褲', level: 4 }
            ]
          }
        ]
      },
      {
        id: 'womens-clothing',
        name: '女裝',
        level: 2,
        children: [
          {
            id: 'womens-tops',
            name: '上衣',
            level: 3,
            children: [
              { id: 'womens-blouses', name: '襯衫', level: 4 },
              { id: 'womens-tshirts', name: 'T恤', level: 4 }
            ]
          },
          {
            id: 'womens-dresses',
            name: '洋裝',
            level: 3,
            children: [
              { id: 'casual-dresses', name: '休閒洋裝', level: 4 },
              { id: 'formal-dresses', name: '正式洋裝', level: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'home-garden',
    name: '居家園藝',
    level: 1,
    children: [
      {
        id: 'furniture',
        name: '家具',
        level: 2,
        children: [
          {
            id: 'living-room',
            name: '客廳家具',
            level: 3,
            children: [
              { id: 'sofas', name: '沙發', level: 4 },
              { id: 'coffee-tables', name: '茶几', level: 4 }
            ]
          }
        ]
      }
    ]
  }
];

const CategoryTreeItem = ({ 
  category, 
  selectedCategories, 
  onToggle, 
  expandedItems, 
  onExpandToggle,
  level = 1 
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedItems.includes(category.id);
  const isSelected = selectedCategories.includes(category.id);
  
  // 檢查是否有子項目被選中
  const hasSelectedChildren = hasChildren && category.children.some(child => 
    selectedCategories.includes(child.id) || 
    (child.children && child.children.some(grandChild => selectedCategories.includes(grandChild.id)))
  );
  
  // 檢查是否所有子項目都被選中
  const allChildrenSelected = hasChildren && category.children.every(child => 
    selectedCategories.includes(child.id)
  );

  const getCheckboxState = () => {
    if (isSelected) return 'checked';
    if (hasSelectedChildren && !allChildrenSelected) return 'indeterminate';
    return 'unchecked';
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggle(category.id);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      onExpandToggle(category.id);
    }
  };

  const getIndentClass = () => {
    switch (level) {
      case 1: return 'pl-0';
      case 2: return 'pl-6';
      case 3: return 'pl-12';
      case 4: return 'pl-18';
      case 5: return 'pl-24';
      default: return 'pl-0';
    }
  };

  const getLevelStyles = () => {
    switch (level) {
      case 1: return 'font-semibold text-gray-900 text-base';
      case 2: return 'font-medium text-gray-800 text-sm';
      case 3: return 'font-medium text-gray-700 text-sm';
      case 4: return 'text-gray-600 text-sm';
      case 5: return 'text-gray-500 text-xs';
      default: return 'text-gray-600 text-sm';
    }
  };

  const checkboxState = getCheckboxState();

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${getIndentClass()}`}
        onClick={() => hasChildren && onExpandToggle(category.id)}
      >
        {/* 展開/收合圖示 */}
        <div className="flex items-center justify-center w-6 h-6 mr-2">
          {hasChildren ? (
            <button
              onClick={handleExpandClick}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        {/* 複選框 */}
        <div className="relative mr-3">
          <input
            type="checkbox"
            checked={checkboxState === 'checked'}
            onChange={handleCheckboxClick}
            className="sr-only"
          />
          <div 
            onClick={handleCheckboxClick}
            className={`w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
              checkboxState === 'checked' 
                ? 'bg-[#cc824d] border-[#cc824d] text-white' 
                : checkboxState === 'indeterminate'
                ? 'bg-[#cc824d]/20 border-[#cc824d] text-[#cc824d]'
                : 'border-gray-300 hover:border-[#cc824d]'
            }`}
          >
            {checkboxState === 'checked' && (
              <CheckIcon className="w-3 h-3" />
            )}
            {checkboxState === 'indeterminate' && (
              <MinusIcon className="w-3 h-3" />
            )}
          </div>
        </div>

        {/* 分類名稱 */}
        <span className={`flex-1 ${getLevelStyles()}`}>
          {category.name}
        </span>

        {/* 層級標示 */}
        <span className="text-xs text-gray-400 ml-2">
          L{level}
        </span>
      </div>

      {/* 子分類 */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {category.children.map(child => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              selectedCategories={selectedCategories}
              onToggle={onToggle}
              expandedItems={expandedItems}
              onExpandToggle={onExpandToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTreeSelector = ({ selectedCategories = [], onChange }) => {
  const [expandedItems, setExpandedItems] = useState(['electronics', 'clothing']);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (categoryId) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onChange(newSelected);
  };

  const handleExpandToggle = (categoryId) => {
    setExpandedItems(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExpandAll = () => {
    const allIds = [];
    const collectIds = (categories) => {
      categories.forEach(cat => {
        allIds.push(cat.id);
        if (cat.children) {
          collectIds(cat.children);
        }
      });
    };
    collectIds(mockCategories);
    setExpandedItems(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedItems([]);
  };

  const handleClearSelection = () => {
    onChange([]);
  };

  // 搜尋功能
  const filterCategories = (categories, term) => {
    if (!term) return categories;
    
    return categories.filter(category => {
      const nameMatch = category.name.toLowerCase().includes(term.toLowerCase());
      const childrenMatch = category.children ? 
        filterCategories(category.children, term).length > 0 : false;
      
      if (nameMatch || childrenMatch) {
        return {
          ...category,
          children: category.children ? filterCategories(category.children, term) : []
        };
      }
      return false;
    }).filter(Boolean);
  };

  const filteredCategories = filterCategories(mockCategories, searchTerm);

  // 獲取選中分類的名稱
  const getSelectedCategoryNames = () => {
    const names = [];
    const findNames = (categories) => {
      categories.forEach(cat => {
        if (selectedCategories.includes(cat.id)) {
          names.push(cat.name);
        }
        if (cat.children) {
          findNames(cat.children);
        }
      });
    };
    findNames(mockCategories);
    return names;
  };

  const selectedNames = getSelectedCategoryNames();

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* 頭部操作區 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">分類選擇器</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExpandAll}
              className="text-xs text-[#cc824d] hover:text-[#b86c37] font-medium"
            >
              展開全部
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleCollapseAll}
              className="text-xs text-[#cc824d] hover:text-[#b86c37] font-medium"
            >
              收合全部
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleClearSelection}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              清除選擇
            </button>
          </div>
        </div>

        {/* 搜尋框 */}
        <input
          type="text"
          placeholder="搜尋分類..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
        />

        {/* 已選擇的分類 */}
        {selectedNames.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-600 mb-2">已選擇 {selectedNames.length} 個分類：</div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {selectedNames.map(name => (
                <span 
                  key={name}
                  className="inline-block px-2 py-1 bg-[#cc824d] text-white text-xs rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 分類樹狀列表 */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredCategories.length > 0 ? (
          <div className="space-y-1">
            {filteredCategories.map(category => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                selectedCategories={selectedCategories}
                onToggle={handleToggle}
                expandedItems={expandedItems}
                onExpandToggle={handleExpandToggle}
                level={1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? '找不到符合的分類' : '沒有可用的分類'}
          </div>
        )}
      </div>

      {/* 底部統計 */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        已選擇 {selectedCategories.length} 個分類
      </div>
    </div>
  );
};

export default CategoryTreeSelector;