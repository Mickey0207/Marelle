import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import {
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ProcurementOverview = () => {
  const [procurementOrders, setProcurementOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    supplier: 'all',
    dateRange: '30days',
    searchQuery: ''
  });

  // 模擬採購訂單數據
  const mockProcurementOrders = [
    {
      id: 'PO-2024-001',
      title: '春季商品採購計劃',
      supplierId: 'SUP-001',
      supplierName: '優質材料有限公司',
      status: 'approved',
      priority: 'high',
      totalAmount: 1250000,
      currency: 'TWD',
      itemCount: 15,
      createdDate: '2024-01-15',
      expectedDelivery: '2024-02-15',
      approvedBy: '張經理',
      description: '春季新品原材料採購，包含高品質皮革和金屬配件',
      department: '採購部',
      category: '原材料'
    },
    {
      id: 'PO-2024-002',
      title: '包裝材料補貨訂單',
      supplierId: 'SUP-002',
      supplierName: '包裝專家股份有限公司',
      status: 'pending',
      priority: 'medium',
      totalAmount: 350000,
      currency: 'TWD',
      itemCount: 8,
      createdDate: '2024-01-20',
      expectedDelivery: '2024-02-05',
      approvedBy: null,
      description: '環保包裝盒、手提袋及防護材料採購',
      department: '倉儲部',
      category: '包裝材料'
    },
    {
      id: 'PO-2024-003',
      title: '辦公設備採購',
      supplierId: 'SUP-003',
      supplierName: '科技辦公設備公司',
      status: 'production',
      priority: 'low',
      totalAmount: 180000,
      currency: 'TWD',
      itemCount: 5,
      createdDate: '2024-01-10',
      expectedDelivery: '2024-01-30',
      approvedBy: '王主任',
      description: '辦公室電腦、印表機及相關設備更新',
      department: 'IT部',
      category: '辦公設備'
    },
    {
      id: 'PO-2024-004',
      title: '夏季預購商品訂單',
      supplierId: 'SUP-001',
      supplierName: '優質材料有限公司',
      status: 'draft',
      priority: 'high',
      totalAmount: 2100000,
      currency: 'TWD',
      itemCount: 25,
      createdDate: '2024-01-22',
      expectedDelivery: '2024-03-15',
      approvedBy: null,
      description: '夏季新品預購，預計大量採購輕質材料',
      department: '商品部',
      category: '原材料'
    },
    {
      id: 'PO-2024-005',
      title: '緊急維修材料採購',
      supplierId: 'SUP-004',
      supplierName: '工業維修供應商',
      status: 'shipped',
      priority: 'urgent',
      totalAmount: 45000,
      currency: 'TWD',
      itemCount: 3,
      createdDate: '2024-01-18',
      expectedDelivery: '2024-01-25',
      approvedBy: '李技師',
      description: '生產線設備緊急維修所需零件和工具',
      department: '維修部',
      category: '維修材料'
    }
  ];

  useEffect(() => {
    loadProcurementData();
    
    // 動畫效果
    gsap.fromTo(
      '.procurement-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, [filters]);

  const loadProcurementData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredOrders = [...mockProcurementOrders];
      
      // 應用篩選器
      if (filters.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }
      
      if (filters.priority !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.priority === filters.priority);
      }
      
      if (filters.supplier !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.supplierId === filters.supplier);
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.title.toLowerCase().includes(query) ||
          order.supplierName.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
        );
      }
      
      setProcurementOrders(filteredOrders);
    } catch (error) {
      console.error('Error loading procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'production': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': '草稿',
      'pending': '待審核',
      'approved': '已核准',
      'confirmed': '已確認',
      'production': '生產中',
      'shipped': '已出貨',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || '未知';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'text-gray-600',
      'medium': 'text-blue-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': '低',
      'medium': '中',
      'high': '高',
      'urgent': '緊急'
    };
    return priorityMap[priority] || '普通';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'production':
        return <ChartBarIcon className="w-5 h-5 text-purple-500" />;
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const calculateTotalValue = () => {
    return procurementOrders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const getStatusCounts = () => {
    const counts = {};
    procurementOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入採購數據中...</span>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-chinese">採購管理</h1>
          <p className="text-gray-600 mt-2">管理所有採購訂單和供應商關係</p>
        </div>
        <Link
          to="/admin/procurement/create"
          className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>新增採購訂單</span>
        </Link>
      </div>

      {/* 統計概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="procurement-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{procurementOrders.length}</p>
              <p className="text-gray-500 text-sm">總訂單數</p>
            </div>
          </div>
        </div>

        <div className="procurement-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {calculateTotalValue().toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">總採購金額</p>
            </div>
          </div>
        </div>

        <div className="procurement-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statusCounts.pending || 0}</p>
              <p className="text-gray-500 text-sm">待審核</p>
            </div>
          </div>
        </div>

        <div className="procurement-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {procurementOrders.filter(o => o.priority === 'urgent').length}
              </p>
              <p className="text-gray-500 text-sm">緊急訂單</p>
            </div>
          </div>
        </div>
      </div>

      {/* 篩選器 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 搜尋 */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜尋訂單號、標題、供應商..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          {/* 狀態篩選 */}
          <div>
            <SearchableSelect
              placeholder="篩選狀態"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              options={[
                { value: 'all', label: '所有狀態' },
                { value: 'draft', label: '草稿' },
                { value: 'pending', label: '待審核' },
                { value: 'approved', label: '已核准' },
                { value: 'production', label: '生產中' },
                { value: 'shipped', label: '已出貨' },
                { value: 'completed', label: '已完成' }
              ]}
              size="sm"
            />
          </div>

          {/* 優先級篩選 */}
          <div>
            <SearchableSelect
              placeholder="優先級"
              value={filters.priority}
              onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              options={[
                { value: 'all', label: '所有優先級' },
                { value: 'low', label: '低' },
                { value: 'medium', label: '中' },
                { value: 'high', label: '高' },
                { value: 'urgent', label: '緊急' }
              ]}
            />
          </div>

          {/* 日期範圍 */}
          <div>
            <SearchableSelect
              placeholder="日期範圍"
              value={filters.dateRange}
              onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              options={[
                { value: '7days', label: '最近7天' },
                { value: '30days', label: '最近30天' },
                { value: '90days', label: '最近90天' },
                { value: 'all', label: '所有時間' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 採購訂單列表 */}
      <div className="space-y-6">
        {procurementOrders.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-12 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到採購訂單</h3>
            <p className="text-gray-500 mb-6">請調整篩選條件或創建新的採購訂單</p>
            <Link
              to="/admin/procurement/create"
              className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              新增採購訂單
            </Link>
          </div>
        ) : (
          procurementOrders.map((order) => (
            <div
              key={order.id}
              className="procurement-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 訂單標題和狀態 */}
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(order.status)}
                    <h3 className="text-xl font-semibold text-gray-900 font-chinese">
                      {order.title}
                    </h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(order.priority)}`}>
                      {getPriorityText(order.priority)}
                    </span>
                  </div>

                  {/* 訂單詳情 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">訂單編號</p>
                      <p className="font-medium">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">供應商</p>
                      <p className="font-medium">{order.supplierName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">採購金額</p>
                      <p className="font-medium text-[#cc824d]">
                        {order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">商品數量</p>
                      <p className="font-medium">{order.itemCount} 項</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">預計交期</p>
                      <p className="font-medium">{order.expectedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">負責部門</p>
                      <p className="font-medium">{order.department}</p>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {order.description}
                  </p>

                  {/* 審批資訊 */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>建立日期：{order.createdDate}</span>
                    {order.approvedBy && (
                      <span>審批人：{order.approvedBy}</span>
                    )}
                    <span>類別：{order.category}</span>
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex space-x-2 ml-6">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 進度條 */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>訂單進度</span>
                  <span>
                    {order.status === 'completed' ? '100%' : 
                     order.status === 'shipped' ? '80%' :
                     order.status === 'production' ? '60%' :
                     order.status === 'approved' ? '40%' :
                     order.status === 'pending' ? '20%' : '10%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#cc824d] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: 
                        order.status === 'completed' ? '100%' : 
                        order.status === 'shipped' ? '80%' :
                        order.status === 'production' ? '60%' :
                        order.status === 'approved' ? '40%' :
                        order.status === 'pending' ? '20%' : '10%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分頁 */}
      {procurementOrders.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              上一頁
            </button>
            <span className="px-3 py-2 bg-[#cc824d] text-white rounded-lg">1</span>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              下一頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementOverview;
