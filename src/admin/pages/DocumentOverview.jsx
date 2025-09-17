import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  FileText, 
  ShoppingCart, 
  Package, 
  Receipt, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { documentDataManager } from '../data/documentDataManager';
import SearchableSelect from '../../components/SearchableSelect';
import StandardTable from '../../components/StandardTable';

const DocumentOverview = () => {
  const [documents, setDocuments] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 模擬API延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allDocuments = documentDataManager.getAllDocuments();
      const stats = documentDataManager.getDocumentStatistics();
      
      setDocuments(allDocuments);
      setStatistics(stats);
    } catch (error) {
      console.error('載入單據數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    let matches = true;
    
    if (selectedType !== 'all') {
      matches = matches && doc.type === selectedType;
    }
    
    if (selectedStatus !== 'all') {
      matches = matches && doc.status === selectedStatus;
    }
    
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
      cancelled: 'bg-gray-100 text-gray-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      closed: 'bg-slate-100 text-slate-800',
      archived: 'bg-gray-100 text-gray-800'
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
      refund_receipt: '退款單',
      purchase_request: '採購申請',
      purchase_order: '採購訂單',
      purchase_return: '採購退貨',
      goods_receipt: '收貨單',
      purchase_invoice: '採購發票',
      payment_voucher: '付款單',
      stock_in: '入庫單',
      stock_out: '出庫單',
      stock_transfer: '調撥單',
      stock_count: '盤點單',
      stock_adjustment: '庫存調整',
      journal_entry: '日記帳分錄',
      cash_receipt: '現金收據',
      cash_payment: '現金支付',
      expense_claim: '費用申請',
      expense_reimbursement: '費用報銷'
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
      cancelled: '已取消',
      suspended: '已暫停',
      error: '錯誤',
      expired: '已過期',
      closed: '已結案',
      archived: '已歸檔'
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
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">單據管理總覽</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          統一管理所有業務單據的生命週期與工作流程
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">總單據數</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">待審核</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.pendingItems?.approvals || 0}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">本月增長</p>
              <p className="text-2xl font-bold text-gray-900">+{statistics.monthlyGrowth || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese"
        >
          <RefreshCw className="w-4 h-4" />
          重新整理
        </button>
        <button className="px-4 py-2 bg-apricot-500 text-white rounded-lg hover:bg-apricot-600 transition-colors flex items-center gap-2 font-chinese">
          <Plus className="w-4 h-4" />
          新增單據
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 單據類型分布 */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">單據類型分布</h3>
          <div className="space-y-3">
            {Object.entries(statistics.byType || {}).slice(0, 8).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600 font-chinese">{getTypeDisplayName(type)}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-apricot-500 h-2 rounded-full"
                      style={{ width: `${(count / statistics.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 狀態分布 */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">狀態分布</h3>
          <div className="space-y-3">
            {Object.entries(statistics.byStatus || {}).slice(0, 8).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                    {getStatusDisplayName(status)}
                  </span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 篩選 */}
      <div className="glass p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <SearchableSelect
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'all', label: '所有類型' },
              { value: 'sales_order', label: '銷售訂單' },
              { value: 'purchase_order', label: '採購訂單' },
              { value: 'stock_in', label: '入庫單' },
              { value: 'stock_out', label: '出庫單' },
              { value: 'sales_invoice', label: '銷售發票' },
              { value: 'purchase_invoice', label: '採購發票' }
            ]}
            placeholder="選擇單據類型"
            searchPlaceholder="搜尋類型..."
            allowClear
          />

          <SearchableSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
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
              <span className="font-medium text-gray-900 font-chinese">
                {doc.documentNumber}
              </span>
            )
          },
          {
            key: 'type',
            label: '類型',
            sortable: true,
            render: (_, doc) => (
              <span className="text-gray-500 font-chinese">
                {getTypeDisplayName(doc.type)}
              </span>
            )
          },
          {
            key: 'title',
            label: '標題',
            sortable: true,
            render: (_, doc) => (
              <span className="text-gray-900 font-chinese">
                {doc.title}
              </span>
            )
          },
          {
            key: 'partnerName',
            label: '合作夥伴',
            sortable: true,
            render: (_, doc) => (
              <span className="text-gray-500 font-chinese">
                {doc.partnerName}
              </span>
            )
          },
          {
            key: 'totalAmount',
            label: '金額',
            sortable: true,
            render: (_, doc) => (
              <span className="text-gray-900 font-chinese">
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
              <span className="text-gray-500 text-sm font-chinese">
                {formatDate(doc.documentDate)}
              </span>
            )
          }
        ]}
        emptyMessage="沒有找到符合條件的單據"
        exportFileName="documents"
      />
    </div>
  );
};

export default DocumentOverview;