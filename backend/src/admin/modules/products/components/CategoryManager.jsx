import { useState, useEffect } from 'react';
import {
  FolderIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// 模擬?��??��?
const mockCategories = [
  {
    id: 1,
    name: { 'zh-TW': '?�件', 'en': 'Accessories' },
    slug: { 'zh-TW': 'accessories', 'en': 'accessories' },
    description: { 'zh-TW': '?�種精�??�件', 'en': 'Various accessories' },
    parentId: null,
    level: 0,
    sortOrder: 1,
    isActive: true,
    productCount: 15,
    children: [
      {
        id: 11,
        name: { 'zh-TW': '首飾', 'en': 'Jewelry' },
        slug: { 'zh-TW': 'jewelry', 'en': 'jewelry' },
        description: { 'zh-TW': '?��??�耳環等�?�?, 'en': 'Necklaces, earrings and more' },
        parentId: 1,
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 8,
        children: []
      },
      {
        id: 12,
        name: { 'zh-TW': '?��?', 'en': 'Bags' },
        slug: { 'zh-TW': 'bags', 'en': 'bags' },
        description: { 'zh-TW': '?��??��??��?', 'en': 'Handbags, backpacks and more' },
        parentId: 1,
        level: 1,
        sortOrder: 2,
        isActive: true,
        productCount: 7,
        children: []
      }
    ]
  },
  {
    id: 2,
    name: { 'zh-TW': '家�?', 'en': 'Home' },
    slug: { 'zh-TW': 'home', 'en': 'home' },
    description: { 'zh-TW': '家�??��??��?�?, 'en': 'Home goods and decorations' },
    parentId: null,
    level: 0,
    sortOrder: 2,
    isActive: true,
    productCount: 23,
    children: [
      {
        id: 21,
        name: { 'zh-TW': '裝飾??, 'en': 'Decorations' },
        slug: { 'zh-TW': 'decorations', 'en': 'decorations' },
        description: { 'zh-TW': '?�種家�?裝飾??, 'en': 'Various home decorations' },
        parentId: 2,
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 12,
        children: []
      },
      {
        id: 22,
        name: { 'zh-TW': '?��??��?', 'en': 'Storage' },
        slug: { 'zh-TW': 'storage', 'en': 'storage' },
        description: { 'zh-TW': '?��??�、整?�用??, 'en': 'Storage boxes and organizers' },
        parentId: 2,
        level: 1,
        sortOrder: 2,
        isActive: true,
        productCount: 11,
        children: []
      }
    ]
  },
  {
    id: 3,
    name: { 'zh-TW': '香�?', 'en': 'Fragrance' },
    slug: { 'zh-TW': 'fragrance', 'en': 'fragrance' },
    description: { 'zh-TW': '香水?��?氛用??, 'en': 'Perfumes and fragrance products' },
    parentId: null,
    level: 0,
    sortOrder: 3,
    isActive: true,
    productCount: 18,
    children: []
  }
];

const CategoryManager = ({ selectedCategories = [], onCategoriesChange, multiple = true }) => {
  const [categories, setCategories] = useState(mockCategories);
  const [expandedCategories, setExpandedCategories] = useState(new Set([1, 2]));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: { 'zh-TW': '', 'en': '' },
    slug: { 'zh-TW': '', 'en': '' },
    description: { 'zh-TW': '', 'en': '' },
    parentId: null,
    isActive: true
  });

  // ?��??��?展�?/?�起
  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // ?��??��??��?
  const handleCategorySelect = (categoryId) => {
    if (!onCategoriesChange) return;

    if (multiple) {
      const newSelected = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      onCategoriesChange(newSelected);
    } else {
      onCategoriesChange([categoryId]);
    }
  };

  // ?��??�平?��??��??�表
  const getFlatCategories = (cats = categories) => {
    let flatList = [];
    cats.forEach(cat => {
      flatList.push(cat);
      if (cat.children && cat.children.length > 0) {
        flatList = flatList.concat(getFlatCategories(cat.children));
      }
    });
    return flatList;
  };

  // ?��? slug
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[\u4e00-\u9fff]/g, (char) => encodeURIComponent(char))
      .replace(/[^a-z0-9%]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // ?��??��? slug
  useEffect(() => {
    if (newCategory.name['zh-TW'] && !newCategory.slug['zh-TW']) {
      setNewCategory(prev => ({
        ...prev,
        slug: {
          ...prev.slug,
          'zh-TW': generateSlug(prev.name['zh-TW'])
        }
      }));
    }
    if (newCategory.name['en'] && !newCategory.slug['en']) {
      setNewCategory(prev => ({
        ...prev,
        slug: {
          ...prev.slug,
          'en': generateSlug(prev.name['en'])
        }
      }));
    }
  }, [newCategory.name]);

  // 保�??��?�?
  const handleSaveCategory = () => {
    if (!newCategory.name['zh-TW'] || !newCategory.name['en']) {
      alert('請填寫�??��??��??�稱');
      return;
    }

    const categoryData = {
      ...newCategory,
      id: Date.now(),
      level: newCategory.parentId ? 1 : 0,
      sortOrder: categories.length + 1,
      productCount: 0,
      children: []
    };

    if (newCategory.parentId) {
      // 添�??��??��?
      setCategories(prev => prev.map(cat => {
        if (cat.id === newCategory.parentId) {
          return {
            ...cat,
            children: [...cat.children, categoryData]
          };
        }
        return cat;
      }));
    } else {
      // 添�??��?級�?�?
      setCategories(prev => [...prev, categoryData]);
    }

    setShowAddModal(false);
    setNewCategory({
      name: { 'zh-TW': '', 'en': '' },
      slug: { 'zh-TW': '', 'en': '' },
      description: { 'zh-TW': '', 'en': '' },
      parentId: null,
      isActive: true
    });
  };

  // 渲�??��?�?
  const renderCategoryTree = (cats, level = 0) => {
    return cats.map(category => (
      <div key={category.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${
          selectedCategories.includes(category.id) ? 'bg-[#cc824d]/10 border border-[#cc824d]' : 'border border-transparent'
        }`}>
          {/* 展�?/?�起?��? */}
          {category.children && category.children.length > 0 && (
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className="p-1 text-gray-400 hover:text-gray-600 mr-2"
            >
              {expandedCategories.has(category.id) ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}

          {/* ?��??��? */}
          <FolderIcon className={`w-5 h-5 mr-3 ${
            selectedCategories.includes(category.id) ? 'text-[#cc824d]' : 'text-gray-400'
          }`} />

          {/* ?��?�?*/}
          <input
            type={multiple ? 'checkbox' : 'radio'}
            name="category"
            checked={selectedCategories.includes(category.id)}
            onChange={() => handleCategorySelect(category.id)}
            className="mr-3 rounded"
          />

          {/* ?��?資�? */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 font-chinese">
                  {category.name['zh-TW']} / {category.name['en']}
                </h4>
                <p className="text-sm text-gray-600 font-chinese">
                  {category.description['zh-TW']}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-chinese">
                  {category.productCount} 件�???
                </span>
                <button
                  type="button"
                  onClick={() => setEditingCategory(category)}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 子�?�?*/}
        {category.children && 
         category.children.length > 0 && 
         expandedCategories.has(category.id) && (
          <div className="mt-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // ?�除?��?
  const handleDeleteCategory = (categoryId) => {
    if (confirm('確�?要刪?�這個�?類�?？這�??�影?�相?��??��???)) {
      // ?�歸?�除?��??�其子�?�?
      const deleteCategoryRecursive = (cats) => {
        return cats
          .filter(cat => cat.id !== categoryId)
          .map(cat => ({
            ...cat,
            children: cat.children ? deleteCategoryRecursive(cat.children) : []
          }));
      };

      setCategories(deleteCategoryRecursive(categories));
    }
  };

  return (
    <div className="category-manager space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">?��?管�?</h3>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          ?��??��?
        </button>
      </div>

      {/* ?��?�?*/}
      <div className="glass rounded-lg p-4 max-h-96 overflow-y-auto">
        {categories.length > 0 ? (
          renderCategoryTree(categories)
        ) : (
          <div className="text-center py-8 text-gray-500 font-chinese">
            尚未建�?任�??��?
          </div>
        )}
      </div>

      {/* 已選?��?顯示 */}
      {selectedCategories.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 font-chinese">已選?��?�?/h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(categoryId => {
              const category = getFlatCategories().find(cat => cat.id === categoryId);
              return category ? (
                <span
                  key={categoryId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-200 text-blue-800 font-chinese"
                >
                  <TagIcon className="w-4 h-4 mr-1" />
                  {category.name['zh-TW']}
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(categoryId)}
                    className="ml-2 hover:text-blue-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* ?��??��?模�?�?*/}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 font-chinese">?��??��?</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* ?��?類選??*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  ?��?類�??�選�?
                </label>
                <select
                  value={newCategory.parentId || ''}
                  onChange={(e) => setNewCategory(prev => ({
                    ...prev,
                    parentId: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
                >
                  <option value="">?��??��?</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name['zh-TW']}
                    </option>
                  ))}
                </select>
              </div>

              {/* ?��??�稱 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?��??�稱 (中�?) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCategory.name['zh-TW']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      name: { ...prev.name, 'zh-TW': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
                    placeholder="例�?：�?�?
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?��??�稱 (?��?) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCategory.name['en']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      name: { ...prev.name, 'en': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="e.g., Accessories"
                  />
                </div>
              </div>

              {/* ?��??��? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    URL?��? (中�?)
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug['zh-TW']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      slug: { ...prev.slug, 'zh-TW': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="accessories"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    URL?��? (?��?)
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug['en']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      slug: { ...prev.slug, 'en': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="accessories"
                  />
                </div>
              </div>

              {/* ?��??�述 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?��??�述 (中�?)
                  </label>
                  <textarea
                    value={newCategory.description['zh-TW']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      description: { ...prev.description, 'zh-TW': e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese resize-none"
                    placeholder="?��??�述"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?��??�述 (?��?)
                  </label>
                  <textarea
                    value={newCategory.description['en']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      description: { ...prev.description, 'en': e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent resize-none"
                    placeholder="Category description"
                  />
                </div>
              </div>
            </div>

            {/* ?��??��? */}
            <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-chinese"
              >
                ?��?
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese"
              >
                保�??��?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
