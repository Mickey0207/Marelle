import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GiftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { giftDataManager, GiftStatus, GiftCategory } from '../data/giftDataManager';
import GlassModal from '../../components/GlassModal';
import CustomSelect from '../components/CustomSelect';
import StandardTable from '../../components/StandardTable';

const GiftManagement = () => {
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGift, setSelectedGift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [statistics, setStatistics] = useState({});

  // 表單資料
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: [],
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    inventory: {
      total: 0,
      available: 0,
      reserved: 0,
      alertThreshold: 10,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE
  });

  // 載入資料
  useEffect(() => {
    loadGifts();
    loadStatistics();
  }, []);

  // 篩選和搜尋
  useEffect(() => {
    let filtered = gifts;

    if (searchTerm) {
      filtered = giftDataManager.searchGifts(searchTerm);
    }

    if (selectedCategory) {
      filtered = filtered.filter(gift => gift.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(gift => gift.status === selectedStatus);
    }

    setFilteredGifts(filtered);
  }, [gifts, searchTerm, selectedCategory, selectedStatus]);

  const loadGifts = () => {
    const allGifts = giftDataManager.getAllGifts();
    setGifts(allGifts);
    setFilteredGifts(allGifts);
  };

  const loadStatistics = () => {
    const stats = giftDataManager.getGiftStatistics();
    setStatistics(stats);
  };

  const handleCreateGift = () => {
    setModalMode('create');
    setFormData({
      name: '',
      description: '',
      category: '',
      tags: [],
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      inventory: {
        total: 0,
        available: 0,
        reserved: 0,
        alertThreshold: 10,
        isUnlimited: false
      },
      status: GiftStatus.ACTIVE
    });
    setIsModalOpen(true);
  };

  const handleEditGift = (gift) => {
    setModalMode('edit');
    setSelectedGift(gift);
    setFormData({
      name: gift.name,
      description: gift.description,
      category: gift.category,
      tags: gift.tags || [],
      weight: gift.weight,
      dimensions: gift.dimensions,
      inventory: gift.inventory,
      status: gift.status
    });
    setIsModalOpen(true);
  };

  const handleViewGift = (gift) => {
    setModalMode('view');
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleDeleteGift = (gift) => {
    if (window.confirm(`確定要刪除贈品「${gift.name}」嗎？`)) {
      giftDataManager.deleteGift(gift.id);
      loadGifts();
      loadStatistics();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const giftData = {
      ...formData,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()) : formData.tags
    };

    if (modalMode === 'create') {
      giftDataManager.createGift(giftData);
    } else if (modalMode === 'edit') {
      giftDataManager.updateGift(selectedGift.id, giftData);
    }

    setIsModalOpen(false);
    loadGifts();
    loadStatistics();
  };

  const handleInventoryUpdate = (giftId, operation, quantity) => {
    const success = giftDataManager.updateInventory(giftId, operation, parseInt(quantity));
    if (success) {
      loadGifts();
      loadStatistics();
    } else {
      alert('庫存操作失敗！請檢查數量是否足夠。');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case GiftStatus.ACTIVE:
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case GiftStatus.OUT_OF_STOCK:
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case GiftStatus.INACTIVE:
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case GiftStatus.ACTIVE:
        return '啟用中';
      case GiftStatus.OUT_OF_STOCK:
        return '缺貨';
      case GiftStatus.INACTIVE:
        return '停用';
      default:
        return '未知';
    }
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      [GiftCategory.BEAUTY]: '美妝',
      [GiftCategory.SKINCARE]: '保養',
      [GiftCategory.FRAGRANCE]: '香氛',
      [GiftCategory.MAKEUP]: '彩妝',
      [GiftCategory.TOOLS]: '工具',
      [GiftCategory.SAMPLES]: '試用',
      [GiftCategory.LIMITED]: '限量',
      [GiftCategory.EXCLUSIVE]: '專屬'
    };
    return categoryMap[category] || category;
  };

  const categoryOptions = Object.entries(GiftCategory).map(([key, value]) => ({
    value,
    label: getCategoryText(value)
  }));

  const statusOptions = Object.entries(GiftStatus).map(([key, value]) => ({
    value,
    label: getStatusText(value)
  }));

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div>
        {/* 操作按鈕 */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleCreateGift}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-chinese"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新增贈品</span>
          </button>
        </div>

        {/* 快速導航 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/admin/gifts/tier-rules"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200 group"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-chinese text-gray-900 group-hover:text-[#cc824d] transition-colors">
                  階梯式贈品規則
                </h3>
                <p className="text-sm text-gray-600 font-chinese mt-1">
                  設定多層級的贈品觸發條件
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Cog6ToothIcon className="w-6 h-6 text-purple-600" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#cc824d] transition-colors" />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/gifts/member-benefits"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-chinese text-gray-900 group-hover:text-[#cc824d] transition-colors">
                  會員贈品福利
                </h3>
                <p className="text-sm text-gray-600 font-chinese mt-1">
                  管理不同會員等級的專屬福利
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#cc824d] transition-colors" />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/gifts/allocation-tracking"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-chinese text-gray-900 group-hover:text-[#cc824d] transition-colors">
                  贈品分配追蹤
                </h3>
                <p className="text-sm text-gray-600 font-chinese mt-1">
                  監控分配歷史和成本統計
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#cc824d] transition-colors" />
              </div>
            </div>
          </Link>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">總贈品數</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalGifts || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <GiftIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">啟用中</p>
                <p className="text-2xl font-bold text-green-600">{statistics.activeGifts || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">缺貨中</p>
                <p className="text-2xl font-bold text-red-600">{statistics.outOfStockGifts || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">本月分配</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.thisMonthAllocations || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 篩選 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[{ value: '', label: '所有分類' }, ...categoryOptions]}
              placeholder="選擇分類"
            />

            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[{ value: '', label: '所有狀態' }, ...statusOptions]}
              placeholder="選擇狀態"
            />
          </div>
        </div>

        {/* 贈品列表 */}
        <StandardTable
          data={filteredGifts}
          columns={[
            {
              key: 'name',
              label: '贈品資訊',
              sortable: true,
              render: (_, gift) => (
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-[#cc824d]/20 to-[#b3723f]/20 flex items-center justify-center">
                      <GiftIcon className="w-6 h-6 text-[#cc824d]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 font-chinese">
                      {gift?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 font-chinese max-w-xs truncate">
                      {gift?.description || 'N/A'}
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: 'category',
              label: '分類',
              sortable: true,
              render: (_, gift) => (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-800 font-chinese">
                  {getCategoryText(gift?.category)}
                </span>
              )
            },
            {
              key: 'inventory',
              label: '庫存狀態',
              sortable: true,
              render: (_, gift) => (
                <div className="text-sm font-chinese">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">可用:</span>
                    <span className={`font-medium ${(gift?.inventory?.available || 0) <= (gift?.inventory?.alertThreshold || 0) ? 'text-red-600' : 'text-green-600'}`}>
                      {gift?.inventory?.available || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">總計:</span>
                    <span className="font-medium">{gift?.inventory?.total || 0}</span>
                  </div>
                  {(gift?.inventory?.available || 0) <= (gift?.inventory?.alertThreshold || 0) && (
                    <div className="text-xs text-red-600 font-chinese">庫存不足警告</div>
                  )}
                </div>
              )
            },
            {
              key: 'status',
              label: '狀態',
              sortable: true,
              render: (_, gift) => (
                <div className="flex items-center space-x-2">
                  {getStatusIcon(gift?.status)}
                  <span className="text-sm font-chinese">{getStatusText(gift?.status)}</span>
                </div>
              )
            },
            {
              key: 'actions',
              label: '操作',
              render: (_, gift) => (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewGift(gift)}
                    className="p-2 text-[#cc824d] hover:bg-[#cc824d]/10 rounded-lg transition-colors"
                    title="查看詳情"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditGift(gift)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="編輯"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGift(gift)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="刪除"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
          emptyMessage={
            searchTerm || selectedCategory || selectedStatus 
              ? "沒有找到符合條件的贈品，請調整搜尋條件" 
              : "沒有找到贈品，開始創建您的第一個贈品"
          }
          exportFileName="gifts"
        />
      </div>

      {/* 贈品詳情/編輯模態框 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? '贈品詳情' : modalMode === 'create' ? '新增贈品' : '編輯贈品'}
        size="max-w-4xl"
      >
        {modalMode === 'view' ? (
          <div className="p-6 space-y-6">
            {selectedGift && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold font-chinese mb-4">基本資訊</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">贈品名稱</label>
                        <p className="text-gray-900 font-chinese">{selectedGift.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">描述</label>
                        <p className="text-gray-900 font-chinese">{selectedGift.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">分類</label>
                        <p className="text-gray-900 font-chinese">{getCategoryText(selectedGift.category)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">標籤</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedGift.tags?.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-chinese">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-chinese mb-4">庫存資訊</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">總庫存</label>
                          <p className="text-gray-900">{selectedGift.inventory.total}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">可用庫存</label>
                          <p className="text-gray-900">{selectedGift.inventory.available}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">預留庫存</label>
                          <p className="text-gray-900">{selectedGift.inventory.reserved}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">警告閾值</label>
                          <p className="text-gray-900">{selectedGift.inventory.alertThreshold}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 font-chinese">庫存操作</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const quantity = prompt('請輸入要增加的數量:');
                              if (quantity && !isNaN(quantity)) {
                                handleInventoryUpdate(selectedGift.id, 'add', quantity);
                                setSelectedGift({
                                  ...selectedGift,
                                  inventory: {
                                    ...selectedGift.inventory,
                                    total: selectedGift.inventory.total + parseInt(quantity),
                                    available: selectedGift.inventory.available + parseInt(quantity)
                                  }
                                });
                              }
                            }}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-chinese hover:bg-green-200"
                          >
                            增加庫存
                          </button>
                          <button
                            onClick={() => {
                              const quantity = prompt('請輸入要預留的數量:');
                              if (quantity && !isNaN(quantity)) {
                                handleInventoryUpdate(selectedGift.id, 'reserve', quantity);
                                setSelectedGift({
                                  ...selectedGift,
                                  inventory: {
                                    ...selectedGift.inventory,
                                    available: selectedGift.inventory.available - parseInt(quantity),
                                    reserved: selectedGift.inventory.reserved + parseInt(quantity)
                                  }
                                });
                              }
                            }}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-chinese hover:bg-yellow-200"
                          >
                            預留庫存
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-chinese mb-4">規格資訊</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese">重量 (kg)</label>
                      <p className="text-gray-900">{selectedGift.weight}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese">長 (cm)</label>
                      <p className="text-gray-900">{selectedGift.dimensions.length}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese">寬 (cm)</label>
                      <p className="text-gray-900">{selectedGift.dimensions.width}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese">高 (cm)</label>
                      <p className="text-gray-900">{selectedGift.dimensions.height}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  贈品名稱 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  placeholder="請輸入贈品名稱"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  分類 *
                </label>
                <CustomSelect
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  options={categoryOptions}
                  placeholder="選擇分類"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="請輸入贈品描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                標籤 (用逗號分隔)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="例如: 護膚, 滋潤, 香氛"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  重量 (kg)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  長度 (cm)
                </label>
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, length: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  寬度 (cm)
                </label>
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, width: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  高度 (cm)
                </label>
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dimensions: { ...prev.dimensions, height: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  總庫存
                </label>
                <input
                  type="number"
                  value={formData.inventory.total}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 0;
                    setFormData(prev => ({ 
                      ...prev, 
                      inventory: { 
                        ...prev.inventory, 
                        total,
                        available: modalMode === 'create' ? total : prev.inventory.available
                      }
                    }));
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  可用庫存
                </label>
                <input
                  type="number"
                  value={formData.inventory.available}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    inventory: { ...prev.inventory, available: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  警告閾值
                </label>
                <input
                  type="number"
                  value={formData.inventory.alertThreshold}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    inventory: { ...prev.inventory, alertThreshold: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                狀態
              </label>
              <CustomSelect
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                options={statusOptions}
                placeholder="選擇狀態"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-white/30 text-gray-700 rounded-xl hover:bg-white/20 transition-colors font-chinese bg-white/50 backdrop-blur-sm"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#cc824d]/90 text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese backdrop-blur-sm"
              >
                {modalMode === 'create' ? '創建贈品' : '更新贈品'}
              </button>
            </div>
          </form>
        )}
      </GlassModal>
    </div>
  );
};

export default GiftManagement;