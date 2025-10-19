import React, { useEffect, useMemo, useState } from 'react';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  CheckIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

// 改為從後端 API 載入分類樹

// 本地搜尋與樹工具，避免外部匯出差異造成建置失敗
const searchCategories = (tree, term) => {
  const kw = String(term || '').trim().toLowerCase();
  if (!kw) return Array.isArray(tree) ? tree : [];
  const filterNode = (node) => {
    const selfHit = String(node.name || '').toLowerCase().includes(kw);
    const children = (node.children || []).map(filterNode).filter(Boolean);
    if (selfHit || children.length) return { ...node, children };
    return null;
  };
  return (Array.isArray(tree) ? tree : []).map(filterNode).filter(Boolean);
};

const CategoryTreeUtils = {
  hasSelectedChildren(category, selected) {
    const set = new Set(selected || []);
    let found = false;
    (function dfs(n){
      for (const c of n.children || []) {
        if (set.has(c.id)) { found = true; return; }
        dfs(c);
        if (found) return;
      }
    })(category);
    return found;
  },
  allChildrenSelected(category, selected) {
    const set = new Set(selected || []);
    let all = true;
    (function dfs(n){
      for (const c of n.children || []) {
        if (!set.has(c.id)) all = false;
        dfs(c);
      }
    })(category);
    return all && (category.children || []).length > 0;
  },
  collectAllIds(tree) {
    const ids = [];
    (function dfs(nodes){
      for (const n of nodes || []) {
        ids.push(n.id);
        if (n.children) dfs(n.children);
      }
    })(Array.isArray(tree) ? tree : []);
    return ids;
  }
};

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
  const hasSelectedChildren = CategoryTreeUtils.hasSelectedChildren(category, selectedCategories);
  
  // 檢查是否所有子項目都被選中
  const allChildrenSelected = CategoryTreeUtils.allChildrenSelected(category, selectedCategories);

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
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoriesTree, setCategoriesTree] = useState([]);

  // 載入分類樹
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/backend/categories', { credentials: 'include' });
        if (!res.ok) throw new Error('分類載入失敗');
        const data = await res.json();
        if (!mounted) return;
        setCategoriesTree(Array.isArray(data) ? data : []);
        // 預設展開第一層
        const rootIds = (Array.isArray(data) ? data : []).map(c => c.id);
        setExpandedItems(rootIds);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || '載入分類發生錯誤');
        setCategoriesTree([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

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
    const allIds = CategoryTreeUtils.collectAllIds(categoriesTree);
    setExpandedItems(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedItems([]);
  };

  const handleClearSelection = () => {
    onChange([]);
  };

  // 搜尋功能
  const filteredCategories = useMemo(() => searchCategories(categoriesTree, searchTerm), [categoriesTree, searchTerm]);

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
    findNames(categoriesTree);
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
        {loading ? (
          <div className="text-center py-8 text-gray-500">載入中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : filteredCategories.length > 0 ? (
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