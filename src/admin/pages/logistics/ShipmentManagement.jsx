import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logisticsDataManager, { LogisticsStatus, LogisticsType } from '../../data/logisticsDataManager';

const ShipmentManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShipments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shipments, searchTerm, statusFilter, typeFilter, dateFilter]);

  const loadShipments = () => {
    const allShipments = logisticsDataManager.getAllShipments();
    setShipments(allShipments);
  };

  const applyFilters = () => {
    let filtered = [...shipments];

    // 搜尋篩選
    if (searchTerm) {
      filtered = logisticsDataManager.searchShipments(searchTerm);
    }

    // 狀態篩選
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    // 類型篩選
    if (typeFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.logisticsType === typeFilter);
    }

    // 日期篩選
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(shipment => {
        const shipmentDate = new Date(shipment.createdAt);
        return shipmentDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredShipments(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectShipment = (shipmentId) => {
    setSelectedShipments(prev => {
      const newSelected = prev.includes(shipmentId)
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId];
      
      setShowBatchActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedShipments.length === filteredShipments.length) {
      setSelectedShipments([]);
      setShowBatchActions(false);
    } else {
      const allIds = filteredShipments.map(s => s.id);
      setSelectedShipments(allIds);
      setShowBatchActions(true);
    }
  };

  const handleBatchStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      for (const shipmentId of selectedShipments) {
        await logisticsDataManager.updateShipmentStatus(
          shipmentId, 
          newStatus, 
          '', 
          `批量更新為${getStatusDisplayName(newStatus)}`
        );
      }
      
      loadShipments();
      setSelectedShipments([]);
      setShowBatchActions(false);
      alert(`成功更新 ${selectedShipments.length} 筆配送狀態`);
    } catch (error) {
      alert('批量更新失敗：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    setLoading(true);
    try {
      const success = logisticsDataManager.updateShipmentStatus(
        shipmentId, 
        newStatus,
        '',
        `手動更新為${getStatusDisplayName(newStatus)}`
      );
      
      if (success) {
        loadShipments();
        alert('狀態更新成功');
      } else {
        alert('狀態更新失敗');
      }
    } catch (error) {
      alert('更新失敗：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintLabels = () => {
    if (selectedShipments.length === 0) {
      alert('請選擇要列印的配送單');
      return;
    }
    
    // 模擬列印標籤
    const selectedShipmentData = selectedShipments.map(id => 
      filteredShipments.find(s => s.id === id)
    );
    
    alert(`準備列印 ${selectedShipmentData.length} 張配送標籤:\n${selectedShipmentData.map(s => s.orderNumber).join(', ')}`);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      [LogisticsStatus.CREATED]: 'bg-gray-100 text-gray-800',
      [LogisticsStatus.PICKED_UP]: 'bg-blue-100 text-blue-800',
      [LogisticsStatus.IN_TRANSIT]: 'bg-yellow-100 text-yellow-800',
      [LogisticsStatus.OUT_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
      [LogisticsStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [LogisticsStatus.READY_FOR_PICKUP]: 'bg-purple-100 text-purple-800',
      [LogisticsStatus.PICKED_UP_BY_CUSTOMER]: 'bg-green-100 text-green-800',
      [LogisticsStatus.FAILED_DELIVERY]: 'bg-red-100 text-red-800',
      [LogisticsStatus.RETURNED]: 'bg-gray-100 text-gray-800',
      [LogisticsStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      [LogisticsStatus.CREATED]: '已建立',
      [LogisticsStatus.PICKED_UP]: '已取貨',
      [LogisticsStatus.IN_TRANSIT]: '運送中',
      [LogisticsStatus.OUT_FOR_DELIVERY]: '派送中',
      [LogisticsStatus.DELIVERED]: '已送達',
      [LogisticsStatus.READY_FOR_PICKUP]: '可取貨',
      [LogisticsStatus.PICKED_UP_BY_CUSTOMER]: '已取貨',
      [LogisticsStatus.FAILED_DELIVERY]: '派送失敗',
      [LogisticsStatus.RETURNED]: '已退回',
      [LogisticsStatus.CANCELLED]: '已取消'
    };
    return names[status] || status;
  };

  const getLogisticsTypeDisplayName = (type) => {
    const names = {
      [LogisticsType.CONVENIENCE_STORE]: '超商取貨',
      [LogisticsType.HOME_DELIVERY]: '宅配到府',
      [LogisticsType.POST_OFFICE]: '郵局配送',
      [LogisticsType.EXPRESS]: '快遞',
      [LogisticsType.PICKUP]: '自取'
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

  const getAvailableStatusTransitions = (currentStatus) => {
    const transitions = {
      [LogisticsStatus.CREATED]: [LogisticsStatus.PICKED_UP, LogisticsStatus.CANCELLED],
      [LogisticsStatus.PICKED_UP]: [LogisticsStatus.IN_TRANSIT, LogisticsStatus.RETURNED],
      [LogisticsStatus.IN_TRANSIT]: [LogisticsStatus.OUT_FOR_DELIVERY, LogisticsStatus.READY_FOR_PICKUP],
      [LogisticsStatus.OUT_FOR_DELIVERY]: [LogisticsStatus.DELIVERED, LogisticsStatus.FAILED_DELIVERY],
      [LogisticsStatus.READY_FOR_PICKUP]: [LogisticsStatus.PICKED_UP_BY_CUSTOMER, LogisticsStatus.RETURNED],
      [LogisticsStatus.FAILED_DELIVERY]: [LogisticsStatus.OUT_FOR_DELIVERY, LogisticsStatus.RETURNED]
    };
    return transitions[currentStatus] || [];
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">配送管理</h1>
              <p className="text-gray-600">管理所有配送單、批量操作和狀態追蹤</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/logistics/shipments/new"
                className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
              >
                + 新增配送單
              </Link>
              {showBatchActions && (
                <button
                  onClick={handlePrintLabels}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  列印標籤 ({selectedShipments.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 篩選器 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 搜尋 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">搜尋</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="搜尋訂單編號、追蹤編號、收件人..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 狀態篩選 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">全部狀態</option>
                {Object.values(LogisticsStatus).map(status => (
                  <option key={status} value={status}>
                    {getStatusDisplayName(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* 配送方式篩選 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">配送方式</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">全部方式</option>
                {Object.values(LogisticsType).map(type => (
                  <option key={type} value={type}>
                    {getLogisticsTypeDisplayName(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* 日期篩選 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">建立日期</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          {/* 篩選結果統計 */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>顯示 {filteredShipments.length} 筆配送單 (共 {shipments.length} 筆)</span>
            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setDateFilter('');
                }}
                className="text-[#cc824d] hover:text-[#b3723f] font-medium"
              >
                清除篩選
              </button>
            )}
          </div>
        </div>

        {/* 批量操作面板 */}
        {showBatchActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-blue-800">
                已選擇 {selectedShipments.length} 筆配送單
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBatchStatusUpdate(LogisticsStatus.PICKED_UP)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  標記為已取貨
                </button>
                <button
                  onClick={() => handleBatchStatusUpdate(LogisticsStatus.IN_TRANSIT)}
                  disabled={loading}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                  標記為運送中
                </button>
                <button
                  onClick={() => handleBatchStatusUpdate(LogisticsStatus.DELIVERED)}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  標記為已送達
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedShipments([]);
                  setShowBatchActions(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                取消選擇
              </button>
            </div>
          </div>
        )}

        {/* 配送單列表 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedShipments.length === filteredShipments.length && filteredShipments.length > 0}
                      onChange={handleSelectAll}
                      className="text-[#cc824d] focus:ring-[#cc824d]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    收件人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    配送方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預計送達
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    運費
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedShipments.includes(shipment.id)}
                        onChange={() => handleSelectShipment(shipment.id)}
                        className="text-[#cc824d] focus:ring-[#cc824d]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{shipment.orderNumber}</div>
                      <div className="text-sm text-gray-500">{shipment.trackingNumber}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(shipment.createdAt).toLocaleDateString('zh-TW')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{shipment.receiverInfo.name}</div>
                      <div className="text-sm text-gray-500">{shipment.receiverInfo.phone}</div>
                      {shipment.receiverInfo.address && (
                        <div className="text-xs text-gray-400 max-w-xs truncate">
                          {shipment.receiverInfo.address}
                        </div>
                      )}
                      {shipment.receiverInfo.storeInfo && (
                        <div className="text-xs text-gray-400">
                          {shipment.receiverInfo.storeInfo.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getLogisticsTypeDisplayName(shipment.logisticsType)}
                      </span>
                      <div className="text-xs text-gray-500">
                        {shipment.packageInfo.weight}kg / {shipment.packageInfo.volume}m³
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(shipment.status)}`}>
                        {getStatusDisplayName(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.estimatedDelivery ? 
                        new Date(shipment.estimatedDelivery).toLocaleDateString('zh-TW') : 
                        '-'
                      }
                      {shipment.actualDelivery && (
                        <div className="text-xs text-green-600">
                          已送達: {new Date(shipment.actualDelivery).toLocaleDateString('zh-TW')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(shipment.shippingFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* 狀態更新下拉選單 */}
                        <select
                          value={shipment.status}
                          onChange={(e) => handleUpdateStatus(shipment.id, e.target.value)}
                          disabled={loading}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        >
                          <option value={shipment.status}>{getStatusDisplayName(shipment.status)}</option>
                          {getAvailableStatusTransitions(shipment.status).map(status => (
                            <option key={status} value={status}>
                              更新為: {getStatusDisplayName(status)}
                            </option>
                          ))}
                        </select>
                        
                        {/* 查看詳情 */}
                        <Link
                          to={`/admin/logistics/shipments/${shipment.id}`}
                          className="text-[#cc824d] hover:text-[#b3723f]"
                        >
                          詳情
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">沒有找到配送單</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter
                  ? '請調整篩選條件或建立新的配送單'
                  : '開始建立您的第一筆配送單吧！'
                }
              </p>
            </div>
          )}
        </div>

        {/* 統計摘要 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-[#cc824d]">
              {filteredShipments.filter(s => s.status === LogisticsStatus.IN_TRANSIT).length}
            </div>
            <div className="text-sm text-gray-600">運送中</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredShipments.filter(s => s.status === LogisticsStatus.DELIVERED).length}
            </div>
            <div className="text-sm text-gray-600">已送達</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {filteredShipments.filter(s => s.status === LogisticsStatus.FAILED_DELIVERY).length}
            </div>
            <div className="text-sm text-gray-600">配送失敗</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredShipments.filter(s => s.status === LogisticsStatus.READY_FOR_PICKUP).length}
            </div>
            <div className="text-sm text-gray-600">可取貨</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentManagement;