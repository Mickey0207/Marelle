import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import IconActionButton from '../../../components/ui/IconActionButton.jsx';
import festivalDataManager from '../../../../lib/data/marketing/festivals/festivalDataManager.js';
import GlassModal from '../../../components/ui/GlassModal.jsx';
import StandardTable from '../../../components/ui/StandardTable.jsx';
import SearchableSelect from '../../../components/ui/SearchableSelect.jsx';

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

  const festivalTypes = festivalDataManager.getFestivalTypes();
  const statusOptions = festivalDataManager.getStatusOptions();
  const productCategories = festivalDataManager.getProductCategories();
  const discountTypeOptions = [
    { value: 'percentage', label: '百分比折扣' },
    { value: 'fixed', label: '固定金額' },
    { value: 'buy-one-get-one', label: '買一送一' }
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

  // status 由 FestivalStatusBadge 呈現
  const getTypeLabel = (type) => {
    const typeLabel = festivalTypes.find(t => t.value === type);
    return typeLabel ? typeLabel.label : type;
  };

  const getStatusLabel = (status) => {
    const s = statusOptions.find(opt => opt.value === status);
    return s ? s.label : status;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
      case 'inactive':
      case 'completed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
  <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">節慶管理</h1>
            <p className="text-gray-600">管理所有節慶活動的詳細設定</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              新建節慶
            </button>
          </div>
        </div>

        {/* 篩選 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <SearchableSelect
                className="w-full"
                options={[{ value: 'all', label: '所有狀態' }, ...statusOptions]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="選擇狀態"
              />
            </div>
            <div>
              <SearchableSelect
                className="w-full"
                options={[{ value: 'all', label: '所有類型' }, ...festivalTypes]}
                value={typeFilter}
                onChange={(val) => setTypeFilter(val)}
                placeholder="選擇類型"
              />
            </div>
          </div>
        </div>

        {/* 節慶列表 - 使用 StandardTable */}
        <StandardTable
          title="節慶列表"
          data={filteredFestivals}
          columns={[
            {
              key: 'name',
              label: '節慶資訊',
              sortable: true,
              render: (_, festival) => (
                <div className="flex items-center">
                  <div
                    className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: (festival.themeColor || '#999') + '20' }}
                  >
                    <CalendarDaysIcon
                      className="h-6 w-6"
                      style={{ color: festival.themeColor || '#999' }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{festival.name}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{festival.description}</div>
                  </div>
                </div>
              )
            },
            {
              key: 'type',
              label: '類型',
              sortable: true,
              render: (_, festival) => (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getTypeLabel(festival.type)}
                </span>
              )
            },
            {
              key: 'status',
              label: '狀態',
              sortable: true,
              render: (_, festival) => (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(festival.status)}`}>
                  {getStatusLabel(festival.status)}
                </span>
              )
            },
            {
              key: 'startDate',
              label: '開始時間',
              sortable: true,
              render: (_, festival) => (
                <span className="text-sm text-gray-900">{formatDate(festival.startDate)}</span>
              )
            },
            {
              key: 'endDate',
              label: '結束時間',
              sortable: true,
              render: (_, festival) => (
                <span className="text-sm text-gray-900">{formatDate(festival.endDate)}</span>
              )
            },
            {
              key: 'metrics',
              label: '效果數據',
              sortable: false,
              render: (_, festival) => (
                <div className="space-y-1 text-sm text-gray-900">
                  <div>瀏覽: {festival.analytics?.views?.toLocaleString() || 0}</div>
                  <div>參與: {festival.analytics?.participation?.toLocaleString() || 0}</div>
                  <div>收益: NT${festival.analytics?.revenue?.toLocaleString() || 0}</div>
                </div>
              )
            },
            {
              key: 'actions',
              label: '操作',
              sortable: false,
              render: (_, festival) => (
                <div className="flex space-x-2 text-sm font-medium">
                  <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => openEditModal(festival)} />
                  <IconActionButton Icon={EyeIcon} label="查看詳情" variant="blue" />
                  <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => openDeleteModal(festival)} />
                </div>
              )
            }
          ]}
          showExport={true}
          exportFileName="節慶列表"
          className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm"
        />
      </div>

      {/* 創建/編輯節慶 Modal */}
  <GlassModal
        isOpen={showCreateModal || showEditModal}
        title={showCreateModal ? '新建節慶' : '編輯節慶'}
        onClose={() => { setShowCreateModal(false); setShowEditModal(false); resetForm(); }}
        footer={null}
        actions={[
          { label: '取消', variant: 'secondary', onClick: () => { setShowCreateModal(false); setShowEditModal(false); resetForm(); } },
          { label: showCreateModal ? '創建' : '更新', onClick: showCreateModal ? handleCreateFestival : handleUpdateFestival }
        ]}
      >
  <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">節慶名稱</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="輸入節慶名稱"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">節慶類型</label>
                  <SearchableSelect
                    className="w-full"
                    options={festivalTypes}
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                    placeholder="選擇節慶類型"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">狀態</label>
                  <SearchableSelect
                    className="w-full"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    placeholder="選擇狀態"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">開始日期</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">結束日期</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">主題顏色</label>
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({...formData, themeColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="輸入節慶描述"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">橫幅圖片 URL</label>
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
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">折扣類型</label>
                        <SearchableSelect
                          className="w-full"
                          options={discountTypeOptions}
                          value={formData.promotionSettings.discountType}
                          onChange={(val) => setFormData({
                            ...formData,
                            promotionSettings: {
                              ...formData.promotionSettings,
                              discountType: val
                            }
                          })}
                          placeholder="選擇折扣類型"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">折扣值</label>
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
  </GlassModal>

      {/* 刪除確認 Modal */}
      <GlassModal
        isOpen={showDeleteModal}
        title="確認刪除"
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-6">
          <p className="text-gray-700">
            {`確定要刪除節慶「${selectedFestival?.name ?? ''}」嗎？此操作將同時刪除相關的促銷活動和優惠券，且無法復原。`}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleDeleteFestival}
              className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              確認刪除
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export default FestivalManagement;
