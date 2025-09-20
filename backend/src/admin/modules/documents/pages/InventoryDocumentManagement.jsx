import React, { useState, useEffect } from 'react';
import StandardTable from "@shared/components/StandardTable";
import { gsap } from 'gsap';
import { 
  Package, 
  PackageOpen, 
  PackageCheck, 
  PackageX, 
  ArrowRightLeft, 
  Clipboard,
  Settings,
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
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { documentDataManager } from '../../data/documentDataManager';
import SearchableSelect from '../../../components/SearchableSelect';

const InventoryDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const inventoryDocumentTypes = [
    'stock_in',
    'stock_out',
    'stock_transfer',
    'stock_adjustment',
    'stock_count'
  ];

  useEffect(() => {
    loadInventoryDocuments();
  }, []);

  useEffect(() => {
    // GSAP ?�畫
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

  const loadInventoryDocuments = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allDocuments = documentDataManager.getAllDocuments();
      const inventoryDocs = allDocuments.filter(doc => inventoryDocumentTypes.includes(doc.type));
      
      setDocuments(inventoryDocs);
    } catch (error) {
      console.error('載入庫�??��?失�?:', error);
    } finally {
      setLoading(false);
    }
  };

  // 定義表格?��?�?
  const columns = [
    {
      key: 'documentNumber',
      label: '?��?編�?',
      sortable: true,
      render: (_, doc) => (
        <span className="font-medium text-gray-900 font-chinese">
          {doc.documentNumber}
        </span>
      )
    },
    {
      key: 'type',
      label: '類�?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-500 font-chinese">
          {getTypeDisplayName(doc.type)}
        </span>
      )
    },
    {
      key: 'description',
      label: '說�?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-900 font-chinese">
          {doc.title || doc.description || '?�說??}
        </span>
      )
    },
    {
      key: 'totalAmount',
      label: '?��?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-900 font-chinese">
          {formatCurrency(doc.totalAmount)}
        </span>
      )
    },
    {
      key: 'status',
      label: '?�??,
      sortable: true,
      render: (_, doc) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)} font-chinese`}>
          {getStatusDisplayName(doc.status)}
        </span>
      )
    },
    {
      key: 'documentDate',
      label: '?��?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-500 font-chinese">
          {formatDate(doc.documentDate)}
        </span>
      )
    },
    {
      key: 'actions',
      label: '?��?',
      sortable: false,
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
  ];

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
      stock_in: '?�庫??,
      stock_out: '?�庫??,
      stock_transfer: '調撥??,
      stock_adjustment: '庫�?調整',
      stock_count: '?��???
    };
    return names[type] || type;
  };

  const getStatusDisplayName = (status) => {
    const names = {
      draft: '?�稿',
      submitted: '已�?�?,
      pending_approval: '待審??,
      approved: '已審??,
      rejected: '已�?�?,
      confirmed: '已確�?,
      in_progress: '?��?�?,
      partially_completed: '?��?完�?',
      completed: '已�???,
      cancelled: '已�?�?
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
      totalValue: 0,
      monthlyMovement: {
        in: 0,
        out: 0
      }
    };

    filteredDocuments.forEach(doc => {
      // ?��??�統�?
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      
      // ?��??�統�?
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
      
      // 總價??
      stats.totalValue += doc.totalAmount || 0;
      
      // ?��??�出統�?
      const today = new Date();
      const docDate = new Date(doc.documentDate);
      if (docDate.getMonth() === today.getMonth() && docDate.getFullYear() === today.getFullYear()) {
        if (doc.type === 'stock_in') {
          stats.monthlyMovement.in += doc.totalAmount || 0;
        } else if (doc.type === 'stock_out') {
          stats.monthlyMovement.out += doc.totalAmount || 0;
        }
      }
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
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">庫�??��?管�?</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          管�??�庫?�出庫、調?�、盤點�??�?�庫存相?�單??
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={loadInventoryDocuments}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese"
        >
          <RefreshCw className="w-4 h-4" />
          ?�新?��?
        </button>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-apricot-500 text-white rounded-lg hover:bg-apricot-600 transition-colors flex items-center gap-2 font-chinese"
        >
          <Plus className="w-4 h-4" />
          ?��?庫�??��?
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ?��?類�??��? */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?��?類�??��?</h3>
          <div className="space-y-3">
            {inventoryDocumentTypes.map(type => {
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

        {/* ?��??�??*/}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?��??�??/h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">?�稿</span>
              <span className="text-lg font-bold text-gray-900">{statistics.byStatus.draft || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">待審??/span>
              <span className="text-lg font-bold text-yellow-600">{statistics.byStatus.pending_approval || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">已審??/span>
              <span className="text-lg font-bold text-green-600">{statistics.byStatus.approved || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">已�???/span>
              <span className="text-lg font-bold text-blue-600">{statistics.byStatus.completed || 0}</span>
            </div>
          </div>
        </div>

        {/* 快速�?�?*/}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">快速�?�?/h3>
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedType('stock_in')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <PackageCheck className="w-5 h-5 text-green-500" />
              檢�??�庫??
            </button>
            <button 
              onClick={() => setSelectedType('stock_out')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <PackageX className="w-5 h-5 text-red-500" />
              檢�??�庫??
            </button>
            <button 
              onClick={() => setSelectedType('stock_transfer')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <ArrowRightLeft className="w-5 h-5 text-blue-500" />
              檢�?調撥??
            </button>
            <button 
              onClick={() => setSelectedType('stock_count')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <Clipboard className="w-5 h-5 text-purple-500" />
              檢�??��???
            </button>
          </div>
        </div>
      </div>

      {/* 篩選?��?�?*/}
      <div className="glass p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchableSelect
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'all', label: '?�?��??? },
              { value: 'stock_in', label: '?�庫?? },
              { value: 'stock_out', label: '?�庫?? },
              { value: 'stock_transfer', label: '調撥?? },
              { value: 'stock_adjustment', label: '庫�?調整' },
              { value: 'stock_count', label: '?��??? }
            ]}
            placeholder="?��??��?類�?"
            searchPlaceholder="?��?類�?..."
            allowClear
          />

          <SearchableSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: '?�?��??? },
              { value: 'draft', label: '?�稿' },
              { value: 'submitted', label: '已�?�? },
              { value: 'pending_approval', label: '待審?? },
              { value: 'approved', label: '已審?? },
              { value: 'completed', label: '已�??? }
            ]}
            placeholder="?��??�??
            searchPlaceholder="?��??�??.."
            allowClear
          />

          <SearchableSelect
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: 'all', label: '?�?��??? },
              { value: 'today', label: '今天' },
              { value: 'week', label: '?��? },
              { value: 'month', label: '?��?' }
            ]}
            placeholder="?��??��?範�?"
            searchPlaceholder="?��??��?..."
            allowClear
          />
        </div>
      </div>

      {/* ?��??�表 */}
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">
              庫�??��??�表 ({filteredDocuments.length})
            </h3>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese">
              <Download className="w-4 h-4" />
              ?�出
            </button>
          </div>
        </div>

        <StandardTable
          data={filteredDocuments.slice(0, 20)}
          columns={columns}
          emptyMessage="沒�??�到庫�??��?"
          emptyDescription="請調?��?尋�?件�??��?第�??�庫存單??
          emptyIcon={Clipboard}
        />
        </div>
      </div>
    </div>
  );
};

export default InventoryDocumentManagement;
