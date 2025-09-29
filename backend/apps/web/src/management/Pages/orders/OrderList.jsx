import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { FunnelIcon, EyeIcon, PencilIcon, TrashIcon, PrinterIcon, ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../adminStyles";
import SearchableSelect from "../../components/ui/SearchableSelect";
import orderDataManager from "../../../lib/mocks/orders/orderDataManager";
import IconActionButton from "../../components/ui/IconActionButton";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // 狀態選項配置
  const statusOptions = [
    { value: 'all', label: '全部狀態' },
    { value: 'pending', label: '待處理' },
    { value: 'processing', label: '處理中' },
    { value: 'shipped', label: '已發貨' },
    { value: 'delivered', label: '已送達' },
    { value: 'cancelled', label: '已取消' }
  ];
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    loadOrders();
    loadStatistics();

    gsap.fromTo(
      '.order-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // orderDataManager 不提供 getOrders，使用 getAllOrders 直接取得陣列
      const data = await orderDataManager.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // getOrderStatistics 回傳為物件而非 { success, data }
      const stats = await orderDataManager.getOrderStatistics();
      const sd = stats?.statusDistribution || {};
      setStatistics({
        total: stats?.totalOrders || 0,
        pending: sd.pending || 0,
        processing: sd.processing || 0,
        shipped: sd.shipped || 0,
        delivered: sd.delivered || 0,
        cancelled: sd.cancelled || 0
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('確定要刪除這個訂單嗎？此操作無法復原。')) {
      const result = orderDataManager.deleteOrder(id);
      if (result.success) {
        loadOrders();
        loadStatistics();
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const handleBatchDelete = () => {
    if (selectedOrders.length === 0) {
      alert('請先選擇要刪除的訂單');
      return;
    }
    
    if (window.confirm(`確定要刪除選中的 ${selectedOrders.length} 個訂單嗎？`)) {
      selectedOrders.forEach(id => {
        orderDataManager.deleteOrder(id);
      });
      setSelectedOrders([]);
      loadOrders();
      loadStatistics();
    }
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev => {
      if (prev.includes(id)) {
        return prev.filter(orderId => orderId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: '待處理', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: '處理中', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: '已發貨', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: '已送達', className: 'bg-green-100 text-green-800' },
      cancelled: { label: '已取消', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入訂單數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">訂單管理</h1>
        <p className="text-gray-600 mt-2">管理所有訂單信息與狀態</p>
      </div>

      {/* 統計卡片 */}
      {/* 已移除統計卡片 */}

      {/* 篩選 */}
      <div className={`${ADMIN_STYLES.glassCard} p-6 mb-6`}>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="選擇狀態"
              className="w-36"
            />
          </div>
          </div>
          
          <div className="flex gap-2">
            {selectedOrders.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                刪除選中 ({selectedOrders.length})
              </button>
            )}
            <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              匯出
            </button>
          </div>
        </div>
      </div>

      {/* 訂單表格 */}
      <div className={`${ADMIN_STYLES.glassCard} overflow-hidden`}>
        <div className="" style={{overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200/60">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  訂單編號
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客戶信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品數量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  總金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  下單時間
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.itemCount} 項商品</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.totalAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-1">
                      <IconActionButton Icon={EyeIcon} label="檢視詳情" variant="blue" />
                      <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" />
                      <IconActionButton Icon={PrinterIcon} label="列印" variant="green" />
                      <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => handleDeleteOrder(order.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分頁 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200/60">
            <div className="flex items-center text-sm text-gray-700">
              顯示 {indexOfFirstOrder + 1} 到 {Math.min(indexOfLastOrder, filteredOrders.length)} 項，
              共 {filteredOrders.length} 項結果
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? 'bg-[#cc824d] text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">沒有找到符合條件的訂單</div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
