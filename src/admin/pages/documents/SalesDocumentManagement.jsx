import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  ShoppingCart, 
  Package, 
  Receipt, 
  RotateCcw,
  FileText,
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { documentDataManager } from '../../data/documentDataManager';
import SearchableSelect from '../../../components/SearchableSelect';
import StandardTable from '../../../components/StandardTable';

const SalesDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const salesDocumentTypes = [
    'sales_order',
    'sales_return', 
    'delivery_order',
    'sales_invoice',
    'payment_receipt',
    'refund_receipt'
  ];

  useEffect(() => {
    loadSalesDocuments();
  }, []);

  useEffect(() => {
    // GSAP 動畫
    if (!loading) {
      gsap.fromTo(
        '.stat-card',
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [loading]);

  const loadSalesDocuments = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allDocuments = documentDataManager.getAllDocuments();
      const salesDocs = allDocuments.filter(doc => salesDocumentTypes.includes(doc.type));
      
      setDocuments(salesDocs);
    } catch (error) {
      console.error('載入銷售單據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    let matches = true;
    
    if (selectedType !== 'all' && doc.type !== selectedType) matches = false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) matches = false;
    
    if (dateRange !== 'all') {
      const today = new Date();
      const docDate = new Date(doc.documentDate);
      
      switch (dateRange) {
        case 'today':
          matches = matches && docDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matches = matches && docDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matches = matches && docDate >= monthAgo;
          break;
      }
    }
    
    return matches;
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      confirmed: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      partially_completed: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeDisplayName = (type) => {
    const names = {
      sales_order: '銷售訂單',
      sales_return: '銷售退貨',
      delivery_order: '出貨單',
      sales_invoice: '銷售發票',
      payment_receipt: '收款單',
      refund_receipt: '退款單'
    };
    return names[type] || type;
  };

  const getStatusDisplayName = (status) => {
    const names = {
      draft: '草稿',
      submitted: '已提交',
      pending_approval: '待審核',
      approved: '已審核',
      rejected: '已拒絕',
      confirmed: '已確認',
      in_progress: '執行中',
      partially_completed: '部分完成',
      completed: '已完成',
      cancelled: '已取消'
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-TW');
  };

  const getStatistics = () => {
    const stats = {
      total: filteredDocuments.length,
      byType: {},
      byStatus: {},
      totalAmount: 0
    };

    filteredDocuments.forEach(doc => {
      // 按類型統計
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      
      // 按狀態統計
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
      
      // 總金額
      stats.totalAmount += doc.totalAmount || 0;
    });

    return stats;
  };

  const statistics = getStatistics();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="glass p-6 rounded-2xl animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">銷售單據管理</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          管理銷售訂單、出貨、發票、收款等所有銷售相關單據
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">銷售單據總數</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-green-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">總金額</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">待處理</p>
              <p className="text-2xl font-bold text-gray-900">{(statistics.byStatus.pending_approval || 0) + (statistics.byStatus.submitted || 0)}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-purple-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.byStatus.completed || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={loadSalesDocuments}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese"
        >
          <RefreshCw className="w-4 h-4" />
          重新整理
        </button>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-apricot-500 text-white rounded-lg hover:bg-apricot-600 transition-colors flex items-center gap-2 font-chinese"
        >
          <Plus className="w-4 h-4" />
          新增銷售單據
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 單據類型分布 */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">單據類型分布</h3>
          <div className="space-y-3">
            {salesDocumentTypes.map(type => {
              const count = statistics.byType[type] || 0;
              const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-600 font-chinese">{getTypeDisplayName(type)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-apricot-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 處理狀態 */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">處理狀態</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">草稿</span>
              <span className="text-lg font-bold text-gray-900">{statistics.byStatus.draft || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">待審核</span>
              <span className="text-lg font-bold text-yellow-600">{statistics.byStatus.pending_approval || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">已審核</span>
              <span className="text-lg font-bold text-green-600">{statistics.byStatus.approved || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">已完成</span>
              <span className="text-lg font-bold text-blue-600">{statistics.byStatus.completed || 0}</span>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">快速操作</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedType('sales_order')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              檢視銷售訂單
            </button>
            <button 
              onClick={() => setSelectedType('sales_invoice')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <Receipt className="w-5 h-5 text-green-500" />
              檢視銷售發票
            </button>
            <button 
              onClick={() => setSelectedType('payment_receipt')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <CreditCard className="w-5 h-5 text-purple-500" />
              檢視收款單
            </button>
            <button 
              onClick={() => setStatusFilter('pending_approval')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              待審核單據
            </button>
          </div>
        </div>
      </div>

      {/* 篩選和搜尋 */}
      <div className="glass p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchableSelect
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'all', label: '所有類型' },
              { value: 'sales_order', label: '銷售訂單' },
              { value: 'sales_invoice', label: '銷售發票' },
              { value: 'delivery_order', label: '出貨單' },
              { value: 'payment_receipt', label: '收款單' },
              { value: 'sales_return', label: '銷售退貨' },
              { value: 'refund_receipt', label: '退款單' }
            ]}
            placeholder="選擇單據類型"
            searchPlaceholder="搜尋類型..."
            allowClear
          />

          <SearchableSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: '所有狀態' },
              { value: 'draft', label: '草稿' },
              { value: 'submitted', label: '已提交' },
              { value: 'pending_approval', label: '待審核' },
              { value: 'approved', label: '已審核' },
              { value: 'completed', label: '已完成' }
            ]}
            placeholder="選擇狀態"
            searchPlaceholder="搜尋狀態..."
            allowClear
          />

          <SearchableSelect
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: 'all', label: '所有時間' },
              { value: 'today', label: '今天' },
              { value: 'week', label: '本週' },
              { value: 'month', label: '本月' }
            ]}
            placeholder="選擇時間範圍"
            searchPlaceholder="搜尋時間..."
            allowClear
          />
        </div>
      </div>

      {/* 單據列表 */}
      <StandardTable
        data={filteredDocuments.slice(0, 20)}
        columns={[
          {
            key: 'documentNumber',
            label: '單據編號',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm font-medium text-gray-900 font-chinese">
                {doc.documentNumber}
              </span>
            )
          },
          {
            key: 'type',
            label: '類型',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-500 font-chinese">
                {getTypeDisplayName(doc.type)}
              </span>
            )
          },
          {
            key: 'partnerName',
            label: '客戶',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-900 font-chinese">
                {doc.partnerName}
              </span>
            )
          },
          {
            key: 'totalAmount',
            label: '金額',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-900 font-chinese">
                {formatCurrency(doc.totalAmount)}
              </span>
            )
          },
          {
            key: 'status',
            label: '狀態',
            sortable: true,
            render: (_, doc) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)} font-chinese`}>
                {getStatusDisplayName(doc.status)}
              </span>
            )
          },
          {
            key: 'documentDate',
            label: '日期',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-500 font-chinese">
                {formatDate(doc.documentDate)}
              </span>
            )
          },
          {
            key: 'actions',
            label: '操作',
            render: (_, doc) => (
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:text-blue-900 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          }
        ]}
        emptyMessage="沒有找到銷售單據，請調整搜尋條件或新增第一個銷售單據"
        exportFileName="sales_documents"
        customHeader={
          <h3 className="text-lg font-semibold text-gray-900 font-chinese mb-4">
            銷售單據列表 ({filteredDocuments.length})
          </h3>
        }
      />
    </div>
  );
};

export default SalesDocumentManagement;