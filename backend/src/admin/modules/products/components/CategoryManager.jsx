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

// Ê®°Êì¨?ÜÈ??∏Ê?
const mockCategories = [
  {
    id: 1,
    name: { 'zh-TW': '?ç‰ª∂', 'en': 'Accessories' },
    slug: { 'zh-TW': 'accessories', 'en': 'accessories' },
    description: { 'zh-TW': '?ÑÁ®ÆÁ≤æÁ??ç‰ª∂', 'en': 'Various accessories' },
    parentId: null,
    level: 0,
    sortOrder: 1,
    isActive: true,
    productCount: 15,
    children: [
      {
        id: 11,
        name: { 'zh-TW': 'È¶ñÈ£æ', 'en': 'Jewelry' },
        slug: { 'zh-TW': 'jewelry', 'en': 'jewelry' },
        description: { 'zh-TW': '?ÖÈ??ÅËÄ≥Áí∞Á≠âÈ?È£?, 'en': 'Necklaces, earrings and more' },
        parentId: 1,
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 8,
        children: []
      },
      {
        id: 12,
        name: { 'zh-TW': '?ÖÂ?', 'en': 'Bags' },
        slug: { 'zh-TW': 'bags', 'en': 'bags' },
        description: { 'zh-TW': '?ãË??ÅË??ÖÁ?', 'en': 'Handbags, backpacks and more' },
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
    name: { 'zh-TW': 'ÂÆ∂Â?', 'en': 'Home' },
    slug: { 'zh-TW': 'home', 'en': 'home' },
    description: { 'zh-TW': 'ÂÆ∂Â??®Â??áË?È£?, 'en': 'Home goods and decorations' },
    parentId: null,
    level: 0,
    sortOrder: 2,
    isActive: true,
    productCount: 23,
    children: [
      {
        id: 21,
        name: { 'zh-TW': 'Ë£ùÈ£æ??, 'en': 'Decorations' },
        slug: { 'zh-TW': 'decorations', 'en': 'decorations' },
        description: { 'zh-TW': '?ÑÁ®ÆÂÆ∂Â?Ë£ùÈ£æ??, 'en': 'Various home decorations' },
        parentId: 2,
        level: 1,
        sortOrder: 1,
        isActive: true,
        productCount: 12,
        children: []
      },
      {
        id: 22,
        name: { 'zh-TW': '?∂Á??®Â?', 'en': 'Storage' },
        slug: { 'zh-TW': 'storage', 'en': 'storage' },
        description: { 'zh-TW': '?∂Á??í„ÄÅÊï¥?ÜÁî®??, 'en': 'Storage boxes and organizers' },
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
    name: { 'zh-TW': 'È¶ôÊ?', 'en': 'Fragrance' },
    slug: { 'zh-TW': 'fragrance', 'en': 'fragrance' },
    description: { 'zh-TW': 'È¶ôÊ∞¥?ÅÈ?Ê∞õÁî®??, 'en': 'Perfumes and fragrance products' },
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

  // ?áÊ??ÜÈ?Â±ïÈ?/?∂Ëµ∑
  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // ?ïÁ??ÜÈ??∏Ê?
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

  // ?≤Â??ÅÂπ≥?ñÁ??ÜÈ??óË°®
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

  // ?üÊ? slug
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[\u4e00-\u9fff]/g, (char) => encodeURIComponent(char))
      .replace(/[^a-z0-9%]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // ?™Â??üÊ? slug
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

  // ‰øùÂ??∞Â?È°?
  const handleSaveCategory = () => {
    if (!newCategory.name['zh-TW'] || !newCategory.name['en']) {
      alert('Ë´ãÂ°´ÂØ´Â??¥Á??ÜÈ??çÁ®±');
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
      // Ê∑ªÂ??∞Â??ÜÈ?
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
      // Ê∑ªÂ??∞È?Á¥öÂ?È°?
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

  // Ê∏≤Ê??ÜÈ?Ê®?
  const renderCategoryTree = (cats, level = 0) => {
    return cats.map(category => (
      <div key={category.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${
          selectedCategories.includes(category.id) ? 'bg-[#cc824d]/10 border border-[#cc824d]' : 'border border-transparent'
        }`}>
          {/* Â±ïÈ?/?∂Ëµ∑?âÈ? */}
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

          {/* ?ÜÈ??ñÊ? */}
          <FolderIcon className={`w-5 h-5 mr-3 ${
            selectedCategories.includes(category.id) ? 'text-[#cc824d]' : 'text-gray-400'
          }`} />

          {/* ?∏Ê?Ê°?*/}
          <input
            type={multiple ? 'checkbox' : 'radio'}
            name="category"
            checked={selectedCategories.includes(category.id)}
            onChange={() => handleCategorySelect(category.id)}
            className="mr-3 rounded"
          />

          {/* ?ÜÈ?Ë≥áË? */}
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
                  {category.productCount} ‰ª∂Â???
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

        {/* Â≠êÂ?È°?*/}
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

  // ?™Èô§?ÜÈ?
  const handleDeleteCategory = (categoryId) => {
    if (confirm('Á¢∫Â?Ë¶ÅÂà™?§ÈÄôÂÄãÂ?È°ûÂ?ÔºüÈÄôÂ??ÉÂΩ±?øÁõ∏?úÁ??ÜÂ???)) {
      // ?ûÊ≠∏?™Èô§?ÜÈ??äÂÖ∂Â≠êÂ?È°?
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
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">?ÜÈ?ÁÆ°Á?</h3>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          ?∞Â??ÜÈ?
        </button>
      </div>

      {/* ?ÜÈ?Ê®?*/}
      <div className="glass rounded-lg p-4 max-h-96 overflow-y-auto">
        {categories.length > 0 ? (
          renderCategoryTree(categories)
        ) : (
          <div className="text-center py-8 text-gray-500 font-chinese">
            Â∞öÊú™Âª∫Á?‰ªª‰??ÜÈ?
          </div>
        )}
      </div>

      {/* Â∑≤ÈÅ∏?ÜÈ?È°ØÁ§∫ */}
      {selectedCategories.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 font-chinese">Â∑≤ÈÅ∏?ÜÈ?Ôº?/h4>
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

      {/* ?∞Â??ÜÈ?Ê®°Ê?Ê°?*/}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 font-chinese">?∞Â??ÜÈ?</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* ?∂Â?È°ûÈÅ∏??*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  ?∂Â?È°ûÔ??ØÈÅ∏Ôº?
                </label>
                <select
                  value={newCategory.parentId || ''}
                  onChange={(e) => setNewCategory(prev => ({
                    ...prev,
                    parentId: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
                >
                  <option value="">?ÇÁ??ÜÈ?</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name['zh-TW']}
                    </option>
                  ))}
                </select>
              </div>

              {/* ?ÜÈ??çÁ®± */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?ÜÈ??çÁ®± (‰∏≠Ê?) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCategory.name['zh-TW']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      name: { ...prev.name, 'zh-TW': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
                    placeholder="‰æãÂ?ÔºöÈ?‰ª?
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?ÜÈ??çÁ®± (?±Ê?) <span className="text-red-500">*</span>
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

              {/* ?ÜÈ??•Â? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    URL?•Â? (‰∏≠Ê?)
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
                    URL?•Â? (?±Ê?)
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

              {/* ?ÜÈ??èËø∞ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?ÜÈ??èËø∞ (‰∏≠Ê?)
                  </label>
                  <textarea
                    value={newCategory.description['zh-TW']}
                    onChange={(e) => setNewCategory(prev => ({
                      ...prev,
                      description: { ...prev.description, 'zh-TW': e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese resize-none"
                    placeholder="?ÜÈ??èËø∞"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    ?ÜÈ??èËø∞ (?±Ê?)
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

            {/* ?ç‰??âÈ? */}
            <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-chinese"
              >
                ?ñÊ?
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese"
              >
                ‰øùÂ??ÜÈ?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
