import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  GiftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../styles";
// import { giftDataManager } from "../../../shared/data/giftDataManager";

const GiftStatus = {
  ACTIVE: 'active',
  OUT_OF_STOCK: 'out_of_stock',
  INACTIVE: 'inactive'
};

const GiftManagement = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [statistics, setStatistics] = useState({
    totalGifts: 0,
    activeGifts: 0,
    outOfStock: 0,
    totalValue: 0
  });

  useEffect(() => {
    loadGifts();
    loadStatistics();

    gsap.fromTo(
      '.gift-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadGifts = async () => {
    setLoading(true);
    try {
      const result = await giftDataManager.getGifts();
      if (result.success) {
        setGifts(result.data);
      }
    } catch (error) {
      console.error('Error loading gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const result = await giftDataManager.getGiftStatistics();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleDeleteGift = (id) => {
    if (window.confirm('確定要刪除這個禮品嗎？此操作無法復原。')) {
      const result = giftDataManager.deleteGift(id);
      if (result.success) {
        loadGifts();
        loadStatistics();
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: '啟用中', className: 'bg-green-100 text-green-800' },
      out_of_stock: { label: '缺貨', className: 'bg-red-100 text-red-800' },
      inactive: { label: '停用', className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case GiftStatus.ACTIVE:
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case GiftStatus.OUT_OF_STOCK:
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || gift.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入禮品數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">禮品管理</h1>
        <p className="text-gray-600 mt-2">管理會員禮品與兌換系統</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="gift-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GiftIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalGifts}</p>
              <p className="text-sm text-gray-600">總禮品數</p>
            </div>
          </div>
        </div>

        <div className="gift-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.activeGifts}</p>
              <p className="text-sm text-gray-600">啟用中</p>
            </div>
          </div>
        </div>

        <div className="gift-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.outOfStock}</p>
              <p className="text-sm text-gray-600">缺貨商品</p>
            </div>
          </div>
        </div>

        <div className="gift-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <GiftIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalValue?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">總價值</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和操作欄 */}
      <div className={`${ADMIN_STYLES.glassCard} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋禮品名稱或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有狀態</option>
              <option value="active">啟用中</option>
              <option value="out_of_stock">缺貨</option>
              <option value="inactive">停用</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            新增禮品
          </button>
        </div>
      </div>

      {/* 禮品列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => (
          <div key={gift.id} className={`gift-card ${ADMIN_STYLES.glassCard}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#cc824d] to-[#b8743d] rounded-lg flex items-center justify-center">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-chinese">{gift.name}</h3>
                    <p className="text-sm text-gray-500">需要 {gift.pointsRequired} 積分</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(gift.status)}
                  {getStatusBadge(gift.status)}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gift.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">庫存數量：</span>
                  <span className="font-medium">{gift.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">已兌換：</span>
                  <span className="font-medium">{gift.redeemedCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">價值：</span>
                  <span className="font-medium text-[#cc824d]">{gift.value}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedGift(gift)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" />
                  編輯
                </button>
                <button
                  onClick={() => handleDeleteGift(gift.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGifts.length === 0 && (
        <div className="text-center py-12">
          <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">沒有找到符合條件的禮品</div>
          <p className="text-gray-400 mt-2">嘗試調整搜尋條件或新增新的禮品</p>
        </div>
      )}

      {/* 新增/編輯模態框 */}
      {(showAddModal || selectedGift) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-chinese">
              {selectedGift ? '編輯禮品' : '新增禮品'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">禮品名稱</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="輸入禮品名稱"
                  defaultValue={selectedGift?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  rows="3"
                  placeholder="輸入禮品描述"
                  defaultValue={selectedGift?.description || ''}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所需積分</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="0"
                    defaultValue={selectedGift?.pointsRequired || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">庫存數量</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="0"
                    defaultValue={selectedGift?.stock || ''}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">禮品價值</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="0"
                  defaultValue={selectedGift?.value || ''}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedGift(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors">
                {selectedGift ? '更新' : '新增'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftManagement;
