import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  TagIcon,
  GiftIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import festivalDataManager from '../../../lib/data/marketing/festivalDataManager';

const FestivalManagement = () => {
  const [festivals, setFestivals] = useState([]);
  const [filteredFestivals, setFilteredFestivals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  // 表單數據
  const [formData, setFormData] = useState({
    name: '',
    type: 'traditional',
    startDate: '',
    endDate: '',
    status: 'draft',
    description: '',
    bannerImage: '',
    themeColor: '#ff6b6b',
    targetProducts: [],
    promotionSettings: {
      discountType: 'percentage',
      discountValue: 0,
      freeShipping: false,
      giftThreshold: 0,
      giftItems: []
    }
  });

  const festivalTypes = [
    { value: 'traditional', label: '傳統節日' },
    { value: 'romantic', label: '浪漫節日' },
    { value: 'family', label: '家庭節日' },
    { value: 'seasonal', label: '季節活動' },
    { value: 'commercial', label: '商業促銷' }
  ];

  const statusOptions = [
    { value: 'draft', label: '草稿' },
    { value: 'scheduled', label: '已排程' },
    { value: 'active', label: '進行中' },
    { value: 'ended', label: '已結束' }
  ];

  const productCategories = [
    'skincare', 'makeup', 'fragrance', 'haircare', 'bodycare',
    'anti-aging', 'luxury', 'organic', 'gift-sets', 'tools'
  ];

  useEffect(() => {
    loadFestivals();
  }, []);

  useEffect(() => {
    filterFestivals();
  }, [festivals, searchQuery, statusFilter, typeFilter]);

  const loadFestivals = () => {
    try {
      const data = festivalDataManager.getAllFestivals();
      setFestivals(data);
      setLoading(false);
    } catch (error) {
      console.error('載入節慶數據失敗:', error);
      setLoading(false);
    }
  };

  const filterFestivals = () => {
    let filtered = [...festivals];

    // 搜尋篩選
    if (searchQuery) {
      filtered = filtered.filter(festival =>
        festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 狀態篩選
    if (statusFilter !== 'all') {
      filtered = filtered.filter(festival => festival.status === statusFilter);
    }

    // 類型篩選
    if (typeFilter !== 'all') {
      filtered = filtered.filter(festival => festival.type === typeFilter);
    }

    setFilteredFestivals(filtered);
  };

  const handleCreateFestival = () => {
    try {
      const newFestival = festivalDataManager.createFestival(formData);
      setFestivals([...festivals, newFestival]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('創建節慶失敗:', error);
    }
  };

  const handleUpdateFestival = () => {
    try {
      const updated = festivalDataManager.updateFestival(selectedFestival.id, formData);
      setFestivals(festivals.map(f => f.id === selectedFestival.id ? updated : f));
      setShowEditModal(false);
      setSelectedFestival(null);
      resetForm();
    } catch (error) {
      console.error('更新節慶失敗:', error);
    }
  };

  const handleDeleteFestival = () => {
    try {
      festivalDataManager.deleteFestival(selectedFestival.id);
      setFestivals(festivals.filter(f => f.id !== selectedFestival.id));
      setShowDeleteModal(false);
      setSelectedFestival(null);
    } catch (error) {
      console.error('刪除節慶失敗:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'traditional',
      startDate: '',
      endDate: '',
      status: 'draft',
      description: '',
      bannerImage: '',
      themeColor: '#ff6b6b',
      targetProducts: [],
      promotionSettings: {
        discountType: 'percentage',
        discountValue: 0,
        freeShipping: false,
        giftThreshold: 0,
        giftItems: []
      }
    });
  };

  const openEditModal = (festival) => {
    setSelectedFestival(festival);
    setFormData({
      name: festival.name,
      type: festival.type,
      startDate: festival.startDate,
      endDate: festival.endDate,
      status: festival.status,
      description: festival.description,
      bannerImage: festival.bannerImage || '',
      themeColor: festival.themeColor || '#ff6b6b',
      targetProducts: festival.targetProducts || [],
      promotionSettings: festival.promotionSettings || {
        discountType: 'percentage',
        discountValue: 0,
        freeShipping: false,
        giftThreshold: 0,
        giftItems: []
      }
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (festival) => {
    setSelectedFestival(festival);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: '進行中', color: 'bg-green-100 text-green-800' },
      scheduled: { text: '已排程', color: 'bg-blue-100 text-blue-800' },
      draft: { text: '草稿', color: 'bg-gray-100 text-gray-800' },
      ended: { text: '已結束', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const typeLabel = festivalTypes.find(t => t.value === type);
    return typeLabel ? typeLabel.label : type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* 頁面標題和操作 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">節慶管理</h1>
            <p className="text-gray-600">管理所有節慶活動的詳細設定</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新建節慶
          </button>
        </div>

        {/* 篩選 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">所有狀態</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <TagIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">所有類型</option>
                {festivalTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 節慶列表 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">節慶列表 ({filteredFestivals.length})</h2>
          </div>
          <div className="" style={{overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    節慶資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類型/狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間範圍
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    效果數據
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/30 divide-y divide-gray-200">
                {filteredFestivals.map((festival) => (
                  <tr key={festival.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: festival.themeColor + '20' }}
                        >
                          <CalendarDaysIcon 
                            className="h-6 w-6" 
                            style={{ color: festival.themeColor }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{festival.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{festival.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{getTypeLabel(festival.type)}</div>
                        {getStatusBadge(festival.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>開始: {formatDate(festival.startDate)}</div>
                        <div>結束: {formatDate(festival.endDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>瀏覽: {festival.analytics?.views?.toLocaleString() || 0}</div>
                        <div>參與: {festival.analytics?.participation?.toLocaleString() || 0}</div>
                        <div>收益: NT${festival.analytics?.revenue?.toLocaleString() || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditModal(festival)}
                          className="text-[#cc824d] hover:text-[#b8734a] p-1 rounded"
                          title="編輯"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="查看詳情"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(festival)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="刪除"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFestivals.length === 0 && (
              <div className="text-center py-12">
                <CalendarDaysIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">沒有找到符合條件的節慶活動</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 創建/編輯節慶 Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full z-50" style={{overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {showCreateModal ? '新建節慶' : '編輯節慶'}
              </h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">節慶名稱</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="輸入節慶名稱"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">節慶類型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  >
                    {festivalTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">開始日期</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">結束日期</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">主題顏色</label>
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({...formData, themeColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="輸入節慶描述"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">橫幅圖片 URL</label>
                  <input
                    type="url"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({...formData, bannerImage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="輸入圖片 URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目標商品類別</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 border border-gray-300 rounded-md p-2" style={{overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {productCategories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.targetProducts.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                targetProducts: [...formData.targetProducts, category]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                targetProducts: formData.targetProducts.filter(p => p !== category)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 促銷設定 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">促銷設定</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">折扣類型</label>
                      <select
                        value={formData.promotionSettings.discountType}
                        onChange={(e) => setFormData({
                          ...formData,
                          promotionSettings: {
                            ...formData.promotionSettings,
                            discountType: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                      >
                        <option value="percentage">百分比折扣</option>
                        <option value="fixed">固定金額</option>
                        <option value="buy-one-get-one">買一送一</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">折扣值</label>
                      <input
                        type="number"
                        value={formData.promotionSettings.discountValue}
                        onChange={(e) => setFormData({
                          ...formData,
                          promotionSettings: {
                            ...formData.promotionSettings,
                            discountValue: Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                        placeholder="輸入折扣值"
                      />
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.promotionSettings.freeShipping}
                          onChange={(e) => setFormData({
                            ...formData,
                            promotionSettings: {
                              ...formData.promotionSettings,
                              freeShipping: e.target.checked
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">免費運送</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={showCreateModal ? handleCreateFestival : handleUpdateFestival}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-md hover:bg-[#b8734a]"
              >
                {showCreateModal ? '創建' : '更新'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刪除確認 Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full z-50" style={{overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900">確認刪除</h3>
            </div>
            <p className="text-gray-600 mb-6">
              確定要刪除節慶「{selectedFestival?.name}」嗎？此操作將同時刪除相關的促銷活動和優惠券，且無法復原。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteFestival}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalManagement;