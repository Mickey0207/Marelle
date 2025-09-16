import React, { useState, useEffect } from 'react';
import logisticsDataManager from '../../data/logisticsDataManager';

const LogisticsProviders = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'courier',
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    serviceAreas: [],
    pricing: {
      baseRate: 0,
      weightRate: 0,
      volumeRate: 0
    },
    performance: {
      rating: 0,
      onTimeRate: 0,
      damageRate: 0
    },
    isActive: true
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    // 從 logisticsDataManager 獲取物流商數據
    // 這裡先用模擬數據
    const mockProviders = [
      {
        id: 'provider_001',
        name: '順豐速運',
        type: 'express',
        contactInfo: {
          phone: '02-2345-6789',
          email: 'contact@sf-express.com',
          address: '台北市信義區松仁路123號'
        },
        serviceAreas: ['台北市', '新北市', '桃園市', '台中市'],
        pricing: {
          baseRate: 120,
          weightRate: 15,
          volumeRate: 8
        },
        performance: {
          rating: 4.8,
          onTimeRate: 0.95,
          damageRate: 0.02
        },
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'provider_002',
        name: '黑貓宅急便',
        type: 'courier',
        contactInfo: {
          phone: '02-3456-7890',
          email: 'service@blackcat.com',
          address: '台北市中山區民生東路456號'
        },
        serviceAreas: ['全台服務'],
        pricing: {
          baseRate: 100,
          weightRate: 12,
          volumeRate: 6
        },
        performance: {
          rating: 4.6,
          onTimeRate: 0.92,
          damageRate: 0.03
        },
        isActive: true,
        createdAt: '2024-02-01T14:30:00Z'
      }
    ];
    setProviders(mockProviders);
  };

  const handleCreateNew = () => {
    setFormData({
      name: '',
      type: 'courier',
      contactInfo: {
        phone: '',
        email: '',
        address: ''
      },
      serviceAreas: [],
      pricing: {
        baseRate: 0,
        weightRate: 0,
        volumeRate: 0
      },
      performance: {
        rating: 0,
        onTimeRate: 0,
        damageRate: 0
      },
      isActive: true
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (provider) => {
    setFormData({ ...provider });
    setSelectedProvider(provider);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('請輸入物流商名稱');
      return;
    }
    // 這裡應該調用 logisticsDataManager 的方法
    console.log('Submitting provider data:', formData);
    setShowForm(false);
    alert(isEditing ? '物流商更新成功' : '物流商創建成功');
  };

  const handleDelete = (provider) => {
    if (confirm(`確定要刪除物流商「${provider.name}」嗎？`)) {
      alert('刪除功能待實現');
    }
  };

  const getTypeDisplayName = (type) => {
    const names = {
      courier: '宅配服務',
      express: '快遞服務',
      post: '郵政服務',
      logistics: '物流公司'
    };
    return names[type] || type;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatRating = (rating) => {
    return `${rating.toFixed(1)}★`;
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">物流商管理</h1>
              <p className="text-gray-600">管理配送夥伴資訊、服務範圍、價格協商、績效評估</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              + 新增物流商
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 物流商列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">物流商列表</h2>
              
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProvider?.id === provider.id
                        ? 'border-[#cc824d] bg-[#cc824d]/5'
                        : 'border-gray-200 hover:border-[#cc824d]/50'
                    }`}
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{provider.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            provider.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {provider.isActive ? '啟用' : '停用'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">服務類型:</span> {getTypeDisplayName(provider.type)}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">基本費率:</span> {formatCurrency(provider.pricing.baseRate)}
                          <span className="ml-4">
                            <span className="font-medium">重量費率:</span> {formatCurrency(provider.pricing.weightRate)}/kg
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">評分:</span> {formatRating(provider.performance.rating)}
                          <span className="ml-4">
                            <span className="font-medium">準時率:</span> {formatPercentage(provider.performance.onTimeRate)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(provider);
                          }}
                          className="text-[#cc824d] hover:text-[#b3723f] text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(provider);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                    
                    {/* 服務範圍預覽 */}
                    {provider.serviceAreas && provider.serviceAreas.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">服務範圍:</div>
                        <div className="flex flex-wrap gap-1">
                          {provider.serviceAreas.slice(0, 3).map((area, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {area}
                            </span>
                          ))}
                          {provider.serviceAreas.length > 3 && (
                            <span className="text-xs text-gray-400">+{provider.serviceAreas.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {providers.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">尚無物流商</h3>
                  <p className="mt-1 text-sm text-gray-500">建立您的第一個物流合作夥伴</p>
                </div>
              )}
            </div>
          </div>

          {/* 物流商詳情 */}
          <div className="space-y-6">
            {selectedProvider && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">物流商詳情</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">基本資訊</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">名稱:</span>
                        <span className="ml-2 text-gray-900">{selectedProvider.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">類型:</span>
                        <span className="ml-2 text-gray-900">{getTypeDisplayName(selectedProvider.type)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">狀態:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          selectedProvider.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedProvider.isActive ? '啟用' : '停用'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">聯絡資訊</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">電話:</span>
                        <span className="ml-2 text-gray-900">{selectedProvider.contactInfo.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">信箱:</span>
                        <span className="ml-2 text-gray-900">{selectedProvider.contactInfo.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">地址:</span>
                        <span className="ml-2 text-gray-900">{selectedProvider.contactInfo.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">價格資訊</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">基本費率:</span>
                        <span className="ml-2 text-gray-900">{formatCurrency(selectedProvider.pricing.baseRate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">重量費率:</span>
                        <span className="ml-2 text-gray-900">{formatCurrency(selectedProvider.pricing.weightRate)}/kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500">體積費率:</span>
                        <span className="ml-2 text-gray-900">{formatCurrency(selectedProvider.pricing.volumeRate)}/m³</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">績效指標</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">服務評分</span>
                        <span className="text-sm font-medium text-gray-900">{formatRating(selectedProvider.performance.rating)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">準時送達率</span>
                        <span className="text-sm font-medium text-gray-900">{formatPercentage(selectedProvider.performance.onTimeRate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">貨損率</span>
                        <span className="text-sm font-medium text-gray-900">{formatPercentage(selectedProvider.performance.damageRate)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">服務範圍</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.serviceAreas.map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 新增/編輯表單 Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? '編輯物流商' : '新增物流商'}
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* 基本資訊 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">基本資訊</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">物流商名稱 *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">服務類型</label>
                        <select
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        >
                          <option value="courier">宅配服務</option>
                          <option value="express">快遞服務</option>
                          <option value="post">郵政服務</option>
                          <option value="logistics">物流公司</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 聯絡資訊 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">聯絡資訊</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">電話</label>
                        <input
                          type="text"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">信箱</label>
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
                        <input
                          type="text"
                          value={formData.contactInfo.address}
                          onChange={(e) => handleInputChange('contactInfo.address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 價格資訊 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">價格資訊</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">基本費率</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.pricing.baseRate}
                          onChange={(e) => handleInputChange('pricing.baseRate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">重量費率 (/kg)</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.pricing.weightRate}
                          onChange={(e) => handleInputChange('pricing.weightRate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">體積費率 (/m³)</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.pricing.volumeRate}
                          onChange={(e) => handleInputChange('pricing.volumeRate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 啟用狀態 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      啟用此物流商
                    </label>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    {isEditing ? '更新' : '創建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsProviders;