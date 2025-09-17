import React, { useState, useEffect } from 'react';
import logisticsDataManager, { LogisticsStatus } from '../../data/logisticsDataManager';

const LogisticsTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [customerTrackingNumber, setCustomerTrackingNumber] = useState('');

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = () => {
    const allShipments = logisticsDataManager.getAllShipments();
    // 只顯示已發貨和運送中的訂單
    const trackableShipments = allShipments.filter(shipment => 
      shipment.status === LogisticsStatus.PICKED_UP || 
      shipment.status === LogisticsStatus.IN_TRANSIT ||
      shipment.status === LogisticsStatus.OUT_FOR_DELIVERY ||
      shipment.status === LogisticsStatus.DELIVERED ||
      shipment.status === LogisticsStatus.READY_FOR_PICKUP
    );
    setShipments(trackableShipments);
  };

  const handleTrackingSearch = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      alert('請輸入追蹤號碼');
      return;
    }

    const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
    if (shipment) {
      setTrackingResult(shipment);
      setSelectedShipment(shipment);
    } else {
      alert('找不到對應的追蹤號碼');
      setTrackingResult(null);
    }
  };

  const handleCustomerSearch = (e) => {
    e.preventDefault();
    if (!customerTrackingNumber.trim()) {
      alert('請輸入追蹤號碼');
      return;
    }

    const shipment = shipments.find(s => s.trackingNumber === customerTrackingNumber);
    if (shipment) {
      setSelectedShipment(shipment);
    } else {
      alert('找不到對應的追蹤號碼');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [LogisticsStatus.CREATED]: 'bg-yellow-100 text-yellow-800',
      [LogisticsStatus.PICKED_UP]: 'bg-blue-100 text-blue-800',
      [LogisticsStatus.IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
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
      [LogisticsStatus.OUT_FOR_DELIVERY]: '配送中',
      [LogisticsStatus.DELIVERED]: '已送達',
      [LogisticsStatus.READY_FOR_PICKUP]: '可取貨',
      [LogisticsStatus.PICKED_UP_BY_CUSTOMER]: '客戶已取貨',
      [LogisticsStatus.FAILED_DELIVERY]: '配送失敗',
      [LogisticsStatus.RETURNED]: '已退回',
      [LogisticsStatus.CANCELLED]: '已取消'
    };
    return names[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW');
  };

  const getTrackingSteps = (shipment) => {
    const steps = [
      { 
        name: '訂單處理', 
        status: 'completed', 
        time: shipment.createdAt 
      },
      { 
        name: '已取貨', 
        status: shipment.status === LogisticsStatus.CREATED ? 'pending' : 'completed', 
        time: shipment.status !== LogisticsStatus.CREATED ? shipment.createdAt : null 
      },
      { 
        name: '運送中', 
        status: shipment.status === LogisticsStatus.IN_TRANSIT || 
                shipment.status === LogisticsStatus.OUT_FOR_DELIVERY || 
                shipment.status === LogisticsStatus.DELIVERED ||
                shipment.status === LogisticsStatus.READY_FOR_PICKUP ||
                shipment.status === LogisticsStatus.PICKED_UP_BY_CUSTOMER ? 'completed' : 
                shipment.status === LogisticsStatus.PICKED_UP ? 'current' : 'pending', 
        time: shipment.status === LogisticsStatus.IN_TRANSIT ? shipment.updatedAt : null 
      },
      { 
        name: shipment.logisticsType === 'convenience_store' ? '到店待取' : '配送中', 
        status: shipment.status === LogisticsStatus.OUT_FOR_DELIVERY || 
                shipment.status === LogisticsStatus.DELIVERED ||
                shipment.status === LogisticsStatus.READY_FOR_PICKUP ||
                shipment.status === LogisticsStatus.PICKED_UP_BY_CUSTOMER ? 'completed' : 
                shipment.status === LogisticsStatus.IN_TRANSIT ? 'current' : 'pending', 
        time: shipment.status === LogisticsStatus.READY_FOR_PICKUP || shipment.status === LogisticsStatus.OUT_FOR_DELIVERY ? shipment.updatedAt : null 
      },
      { 
        name: shipment.logisticsType === 'convenience_store' ? '客戶已取貨' : '已送達', 
        status: shipment.status === LogisticsStatus.DELIVERED || shipment.status === LogisticsStatus.PICKED_UP_BY_CUSTOMER ? 'completed' : 
                shipment.status === LogisticsStatus.OUT_FOR_DELIVERY || shipment.status === LogisticsStatus.READY_FOR_PICKUP ? 'current' : 'pending', 
        time: shipment.actualDelivery || (shipment.status === LogisticsStatus.DELIVERED || shipment.status === LogisticsStatus.PICKED_UP_BY_CUSTOMER ? shipment.updatedAt : null)
      }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">物流追蹤系統</h1>
              <p className="text-gray-600">即時物流狀態追蹤、客戶查詢介面</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 管理員追蹤區域 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">管理員追蹤查詢</h2>
              
              <form onSubmit={handleTrackingSearch} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="請輸入追蹤號碼"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    查詢
                  </button>
                </div>
              </form>

              {/* 追蹤結果 */}
              {trackingResult && (
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">追蹤號碼: {trackingResult.trackingNumber}</h3>
                      <p className="text-sm text-gray-600">訂單編號: {trackingResult.orderId}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(trackingResult.status)}`}>
                      {getStatusDisplayName(trackingResult.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">收件人:</span>
                      <span className="ml-2 text-gray-900">{trackingResult.receiverInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">配送地址:</span>
                      <span className="ml-2 text-gray-900">
                        {trackingResult.receiverInfo.address || trackingResult.receiverInfo.storeInfo?.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">預計送達:</span>
                      <span className="ml-2 text-gray-900">
                        {trackingResult.estimatedDelivery ? formatDate(trackingResult.estimatedDelivery) : '計算中'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">總重量:</span>
                      <span className="ml-2 text-gray-900">{trackingResult.packageInfo.weight} kg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 可追蹤訂單列表 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">可追蹤訂單列表</h2>
              
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedShipment?.id === shipment.id
                        ? 'border-[#cc824d] bg-[#cc824d]/5'
                        : 'border-gray-200 hover:border-[#cc824d]/50'
                    }`}
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{shipment.trackingNumber}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(shipment.status)}`}>
                            {getStatusDisplayName(shipment.status)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">訂單:</span> {shipment.orderNumber}
                          </div>
                          <div>
                            <span className="font-medium">收件人:</span> {shipment.receiverInfo.name}
                          </div>
                          <div>
                            <span className="font-medium">建立時間:</span> {formatDate(shipment.createdAt)}
                          </div>
                          <div>
                            <span className="font-medium">預計送達:</span> {formatDate(shipment.estimatedDelivery)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {shipments.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">暫無可追蹤訂單</h3>
                  <p className="mt-1 text-sm text-gray-500">已發貨的訂單將在此顯示</p>
                </div>
              )}
            </div>
          </div>

          {/* 客戶查詢區域 & 追蹤詳情 */}
          <div className="space-y-6">
            {/* 客戶查詢介面 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">客戶查詢介面</h2>
              
              <form onSubmit={handleCustomerSearch} className="mb-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customerTrackingNumber}
                    onChange={(e) => setCustomerTrackingNumber(e.target.value)}
                    placeholder="請輸入追蹤號碼"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#cc824d] text-white py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    查詢物流狀態
                  </button>
                </div>
              </form>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• 請輸入商家提供的追蹤號碼</p>
                <p>• 物流資訊每 30 分鐘更新一次</p>
                <p>• 如有疑問請聯繫客服</p>
              </div>
            </div>

            {/* 選中訂單的詳細追蹤資訊 */}
            {selectedShipment && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">配送進度</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">追蹤號碼:</span>
                    <span className="ml-2 text-gray-900">{selectedShipment.trackingNumber}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">當前狀態:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedShipment.status)}`}>
                      {getStatusDisplayName(selectedShipment.status)}
                    </span>
                  </div>
                </div>

                {/* 配送進度時間軸 */}
                <div className="space-y-4">
                  {getTrackingSteps(selectedShipment).map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          step.status === 'completed' ? 'bg-green-500 border-green-500' :
                          step.status === 'current' ? 'bg-[#cc824d] border-[#cc824d]' :
                          'bg-gray-200 border-gray-300'
                        }`}></div>
                        {index < getTrackingSteps(selectedShipment).length - 1 && (
                          <div className={`w-0.5 h-8 ${
                            step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          step.status === 'completed' ? 'text-green-700' :
                          step.status === 'current' ? 'text-[#cc824d]' :
                          'text-gray-500'
                        }`}>
                          {step.name}
                        </div>
                        {step.time && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(step.time)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">收件人:</span>
                      <span className="ml-2 text-gray-900">{selectedShipment.receiverInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">配送地址:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedShipment.receiverInfo.address || selectedShipment.receiverInfo.storeInfo?.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">聯絡電話:</span>
                      <span className="ml-2 text-gray-900">{selectedShipment.receiverInfo.phone}</span>
                    </div>
                    {selectedShipment.estimatedDelivery && (
                      <div>
                        <span className="text-gray-500">預計送達:</span>
                        <span className="ml-2 text-gray-900">{formatDate(selectedShipment.estimatedDelivery)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsTracking;