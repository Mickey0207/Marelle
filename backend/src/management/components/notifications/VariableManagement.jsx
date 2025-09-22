import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  VariableIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";

const VariableManagement = () => {
  const [variableCategories, setVariableCategories] = useState([
    {
      id: 'user',
      name: '用戶信息',
      description: '用戶相關的動態變量',
      variables: [
        { key: 'user.name', name: '用戶姓名', description: '用戶的真實姓名', example: '張小明' },
        { key: 'user.email', name: '電子郵件', description: '用戶的電子郵件地址', example: 'user@example.com' },
        { key: 'user.phone', name: '電話號碼', description: '用戶的手機號碼', example: '0912345678' },
        { key: 'user.birthday', name: '生日', description: '用戶的生日日期', example: '1990-01-01' }
      ]
    },
    {
      id: 'order',
      name: '訂單信息',
      description: '訂單相關的動態變量',
      variables: [
        { key: 'order.id', name: '訂單編號', description: '訂單的唯一識別碼', example: 'ORD20240101001' },
        { key: 'order.total', name: '訂單總額', description: '訂單的總金額', example: '1,580' },
        { key: 'order.date', name: '下單日期', description: '訂單的創建日期', example: '2024-01-01' },
        { key: 'order.status', name: '訂單狀態', description: '訂單當前的處理狀態', example: '已發貨' }
      ]
    },
    {
      id: 'product',
      name: '商品信息',
      description: '商品相關的動態變量',
      variables: [
        { key: 'product.name', name: '商品名稱', description: '商品的名稱', example: '優雅連衣裙' },
        { key: 'product.price', name: '商品價格', description: '商品的售價', example: '890' },
        { key: 'product.category', name: '商品分類', description: '商品所屬的分類', example: '連衣裙' },
        { key: 'product.brand', name: '商品品牌', description: '商品的品牌名稱', example: 'Marelle' }
      ]
    },
    {
      id: 'system',
      name: '系統信息',
      description: '系統相關的動態變量',
      variables: [
        { key: 'system.date', name: '當前日期', description: '系統當前日期', example: '2024-01-15' },
        { key: 'system.time', name: '當前時間', description: '系統當前時間', example: '14:30:00' },
        { key: 'system.website', name: '網站名稱', description: '網站的名稱', example: 'Marelle' },
        { key: 'system.url', name: '網站網址', description: '網站的主網址', example: 'https://marelle.com' }
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('user');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      '.variable-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, [selectedCategory]);

  const currentCategory = variableCategories.find(cat => cat.id === selectedCategory);
  const filteredVariables = currentCategory?.variables.filter(variable =>
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteVariable = (variableKey) => {
    if (window.confirm('確定要刪除這個變量嗎？')) {
      setVariableCategories(prev => 
        prev.map(category => 
          category.id === selectedCategory
            ? {
                ...category,
                variables: category.variables.filter(v => v.key !== variableKey)
              }
            : category
        )
      );
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // 這裡可以加入提示訊息
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">變量管理</h1>
        <p className="text-gray-600 mt-2">管理通知模板中的動態變量</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 類別選擇器 */}
        <div className="lg:col-span-1">
          <div className={ADMIN_STYLES.glassCard}>
            <div className="p-4 border-b border-gray-200/60">
              <h2 className="text-lg font-semibold text-gray-900 font-chinese">變量分類</h2>
            </div>
            <div className="p-4 space-y-2">
              {variableCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#cc824d] text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium font-chinese">{category.name}</div>
                  <div className={`text-sm mt-1 ${
                    selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {category.variables.length} 個變量
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 變量列表 */}
        <div className="lg:col-span-3">
          <div className={ADMIN_STYLES.glassCard}>
            {/* 標題和操作欄 */}
            <div className="p-6 border-b border-gray-200/60">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 font-chinese">
                    {currentCategory?.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{currentCategory?.description}</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜尋變量..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                    <DocumentTextIcon className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    新增變量
                  </button>
                </div>
              </div>
            </div>

            {/* 變量列表 */}
            <div className="p-6">
              <div className="space-y-4">
                {filteredVariables.map((variable, index) => (
                  <div key={variable.key} className="variable-card bg-gray-50/80 rounded-lg p-4 border border-gray-200/60">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-[#cc824d]/10 rounded-lg">
                            <VariableIcon className="w-5 h-5 text-[#cc824d]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 font-chinese">{variable.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <code
                                className="text-sm bg-gray-800 text-green-400 px-2 py-1 rounded cursor-pointer hover:bg-gray-700 transition-colors"
                                onClick={() => copyToClipboard(`{{${variable.key}}}`)}
                                title="點擊複製"
                              >
                                {`{{${variable.key}}}`}
                              </code>
                              <span className="text-xs text-gray-500">點擊複製</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{variable.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">範例：</span>
                            <span className="font-medium text-gray-900">{variable.example}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedVariable(variable)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編輯變量"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVariable(variable.key)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="刪除變量"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredVariables.length === 0 && (
                <div className="text-center py-12">
                  <VariableIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500 text-lg">沒有找到符合條件的變量</div>
                  <p className="text-gray-400 mt-2">嘗試調整搜尋條件或新增新的變量</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 新增/編輯變量模態框 */}
      {(showAddModal || selectedVariable) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-chinese">
              {selectedVariable ? '編輯變量' : '新增變量'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">變量鍵名</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="例如：user.name"
                  defaultValue={selectedVariable?.key || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">變量名稱</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="例如：用戶姓名"
                  defaultValue={selectedVariable?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  rows="3"
                  placeholder="變量的詳細描述"
                  defaultValue={selectedVariable?.description || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">範例值</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="例如：張小明"
                  defaultValue={selectedVariable?.example || ''}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedVariable(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors">
                {selectedVariable ? '更新' : '新增'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableManagement;
