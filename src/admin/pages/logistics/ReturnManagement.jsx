import React, { useState, useEffect } from 'react';
import logisticsDataManager, { ReturnMethod, ReturnFeePolicy, LogisticsStatus } from '../../data/logisticsDataManager';

const ReturnManagement = () => {
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    trackingNumber: '',
    method: ReturnMethod.CONVENIENCE_STORE,
    reason: '',
    feePolicy: ReturnFeePolicy.CUSTOMER_PAYS,
    status: 'pending',
    refundAmount: 0,
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = () => {
    const data = logisticsDataManager.getAllReturns();
    setReturns(data);
  };

  const handleCreateNew = () => {
    setFormData({
      orderId: '',
      trackingNumber: '',
      method: ReturnMethod.CONVENIENCE_STORE,
      reason: '',
      feePolicy: ReturnFeePolicy.CUSTOMER_PAYS,
      status: 'pending',
      refundAmount: 0,
      notes: ''
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (ret) => {
    setFormData({ ...ret });
    setSelectedReturn(ret);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.orderId.trim() || !formData.trackingNumber.trim()) {
      alert('請填寫訂單編號和追蹤號碼');
      return;
    }
    let success;
    if (isEditing) {
      success = logisticsDataManager.updateReturn(formData.id, formData);
    } else {
      success = logisticsDataManager.createReturn(formData);
    }
    if (success) {
      loadReturns();
      setShowForm(false);
      setSelectedReturn(null);
      alert(isEditing ? '退貨申請更新成功' : '退貨申請創建成功');
    } else {
      alert('操作失敗，請重試');
    }
  };

  const handleDelete = (ret) => {
    if (confirm(`確定要刪除退貨申請「${ret.orderId}」嗎？`)) {
      // 這裡應該實現刪除功能
      alert('刪除功能待實現');
    }
  };

  const getMethodDisplayName = (method) => {
    const names = {
      [ReturnMethod.CONVENIENCE_STORE]: '超商退貨',
      [ReturnMethod.HOME_PICKUP]: '宅配收件',
      [ReturnMethod.POST_OFFICE]: '郵局寄回'
    };
    return names[method] || method;
  };

  const getFeePolicyDisplayName = (policy) => {
    const names = {
      [ReturnFeePolicy.CUSTOMER_PAYS]: '買家負擔',
      [ReturnFeePolicy.MERCHANT_PAYS]: '賣家負擔',
      [ReturnFeePolicy.CONDITIONAL]: '條件式負擔'
    };
    return names[policy] || policy;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">退貨管理系統</h1>
              <p className="text-gray-600">處理退貨申請、逆物流、費用計算、退款流程、庫存回收</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              + 新增退貨申請
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 退貨申請列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">退貨申請列表</h2>
              <div className="space-y-4">
                {returns.map((ret) => (
                  <div
                    key={ret.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedReturn?.id === ret.id
                        ? 'border-[#cc824d] bg-[#cc824d]/5'
                        : 'border-gray-200 hover:border-[#cc824d]/50'
                    }`}
                    onClick={() => setSelectedReturn(ret)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">訂單編號: {ret.orderId}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ret.status)}`}>
                            {ret.status === 'pending' ? '待處理' : ret.status === 'processing' ? '處理中' : ret.status === 'completed' ? '已完成' : '已拒絕'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">退貨方式:</span> {getMethodDisplayName(ret.method)}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">費用政策:</span> {getFeePolicyDisplayName(ret.feePolicy)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">退款金額:</span> {formatCurrency(ret.refundAmount)}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(ret);
                          }}
                          className="text-[#cc824d] hover:text-[#b3723f] text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(ret);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                    {ret.reason && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <span className="font-medium">退貨原因:</span> {ret.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {returns.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">尚無退貨申請</h3>
                  <p className="mt-1 text-sm text-gray-500">建立您的第一個退貨申請</p>
                </div>
              )}
            </div>
          </div>

          {/* 退貨詳情與表單 */}
          <div className="space-y-6">
            {selectedReturn && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">退貨詳情</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">訂單編號:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedReturn.orderId}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">追蹤號碼:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedReturn.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">退貨方式:</span>
                    <span className="ml-2 text-sm text-gray-900">{getMethodDisplayName(selectedReturn.method)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">費用政策:</span>
                    <span className="ml-2 text-sm text-gray-900">{getFeePolicyDisplayName(selectedReturn.feePolicy)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">退款金額:</span>
                    <span className="ml-2 text-sm text-gray-900">{formatCurrency(selectedReturn.refundAmount)}</span>
                  </div>
                  {selectedReturn.reason && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">退貨原因:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedReturn.reason}</span>
                    </div>
                  )}
                  {selectedReturn.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">備註:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedReturn.notes}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-700">狀態:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReturn.status)}`}>
                      {selectedReturn.status === 'pending' ? '待處理' : selectedReturn.status === 'processing' ? '處理中' : selectedReturn.status === 'completed' ? '已完成' : '已拒絕'}
                    </span>
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
                    {isEditing ? '編輯退貨申請' : '新增退貨申請'}
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">訂單編號 *</label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => handleInputChange('orderId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">追蹤號碼 *</label>
                    <input
                      type="text"
                      value={formData.trackingNumber}
                      onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">退貨方式</label>
                    <select
                      value={formData.method}
                      onChange={(e) => handleInputChange('method', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      {Object.values(ReturnMethod).map(method => (
                        <option key={method} value={method}>{getMethodDisplayName(method)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">費用政策</label>
                    <select
                      value={formData.feePolicy}
                      onChange={(e) => handleInputChange('feePolicy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      {Object.values(ReturnFeePolicy).map(policy => (
                        <option key={policy} value={policy}>{getFeePolicyDisplayName(policy)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">退款金額</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.refundAmount}
                      onChange={(e) => handleInputChange('refundAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">退貨原因</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">備註</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="pending">待處理</option>
                      <option value="processing">處理中</option>
                      <option value="completed">已完成</option>
                      <option value="rejected">已拒絕</option>
                    </select>
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

export default ReturnManagement;