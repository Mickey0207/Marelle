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
    // GSAP ?•ç•«
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
      console.error('è¼‰å…¥?·å”®?®æ?å¤±æ?:', error);
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
      sales_order: '?·å”®è¨‚å–®',
      sales_return: '?·å”®?€è²?,
      delivery_order: '?ºè²¨??,
      sales_invoice: '?·å”®?¼ç¥¨',
      payment_receipt: '?¶æ¬¾??,
      refund_receipt: '?€æ¬¾å–®'
    };
    return names[type] || type;
  };

  const getStatusDisplayName = (status) => {
    const names = {
      draft: '?‰ç¨¿',
      submitted: 'å·²æ?äº?,
      pending_approval: 'å¾…å¯©??,
      approved: 'å·²å¯©??,
      rejected: 'å·²æ?çµ?,
      confirmed: 'å·²ç¢ºèª?,
      in_progress: '?·è?ä¸?,
      partially_completed: '?¨å?å®Œæ?',
      completed: 'å·²å???,
      cancelled: 'å·²å?æ¶?
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
      // ?‰é??‹çµ±è¨?
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      
      // ?‰ç??‹çµ±è¨?
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
      
      // ç¸½é?é¡?
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
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">?·å”®?®æ?ç®¡ç?</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          ç®¡ç??·å”®è¨‚å–®?å‡ºè²¨ã€ç™¼ç¥¨ã€æ”¶æ¬¾ç??€?‰éŠ·?®ç›¸?œå–®??
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={loadSalesDocuments}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese"
        >
          <RefreshCw className="w-4 h-4" />
          ?æ–°?´ç?
        </button>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-apricot-500 text-white rounded-lg hover:bg-apricot-600 transition-colors flex items-center gap-2 font-chinese"
        >
          <Plus className="w-4 h-4" />
          ?°å??·å”®?®æ?
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ?®æ?é¡å??†å? */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?®æ?é¡å??†å?</h3>
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

        {/* ?•ç??€??*/}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?•ç??€??/h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">?‰ç¨¿</span>
              <span className="text-lg font-bold text-gray-900">{statistics.byStatus.draft || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">å¾…å¯©??/span>
              <span className="text-lg font-bold text-yellow-600">{statistics.byStatus.pending_approval || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">å·²å¯©??/span>
              <span className="text-lg font-bold text-green-600">{statistics.byStatus.approved || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-chinese">å·²å???/span>
              <span className="text-lg font-bold text-blue-600">{statistics.byStatus.completed || 0}</span>
            </div>
          </div>
        </div>

        {/* å¿«é€Ÿæ?ä½?*/}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">å¿«é€Ÿæ?ä½?/h3>
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedType('sales_order')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              æª¢è??·å”®è¨‚å–®
            </button>
            <button 
              onClick={() => setSelectedType('sales_invoice')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <Receipt className="w-5 h-5 text-green-500" />
              æª¢è??·å”®?¼ç¥¨
            </button>
            <button 
              onClick={() => setSelectedType('payment_receipt')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <CreditCard className="w-5 h-5 text-purple-500" />
              æª¢è??¶æ¬¾??
            </button>
            <button 
              onClick={() => setStatusFilter('pending_approval')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              å¾…å¯©?¸å–®??
            </button>
          </div>
        </div>
      </div>

      {/* ç¯©é¸?Œæ?å°?*/}
      <div className="glass p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchableSelect
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'all', label: '?€?‰é??? },
              { value: 'sales_order', label: '?·å”®è¨‚å–®' },
              { value: 'sales_invoice', label: '?·å”®?¼ç¥¨' },
              { value: 'delivery_order', label: '?ºè²¨?? },
              { value: 'payment_receipt', label: '?¶æ¬¾?? },
              { value: 'sales_return', label: '?·å”®?€è²? },
              { value: 'refund_receipt', label: '?€æ¬¾å–®' }
            ]}
            placeholder="?¸æ??®æ?é¡å?"
            searchPlaceholder="?œå?é¡å?..."
            allowClear
          />

          <SearchableSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: '?€?‰ç??? },
              { value: 'draft', label: '?‰ç¨¿' },
              { value: 'submitted', label: 'å·²æ?äº? },
              { value: 'pending_approval', label: 'å¾…å¯©?? },
              { value: 'approved', label: 'å·²å¯©?? },
              { value: 'completed', label: 'å·²å??? }
            ]}
            placeholder="?¸æ??€??
            searchPlaceholder="?œå??€??.."
            allowClear
          />

          <SearchableSelect
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: 'all', label: '?€?‰æ??? },
              { value: 'today', label: 'ä»Šå¤©' },
              { value: 'week', label: '?¬é€? },
              { value: 'month', label: '?¬æ?' }
            ]}
            placeholder="?¸æ??‚é?ç¯„å?"
            searchPlaceholder="?œå??‚é?..."
            allowClear
          />
        </div>
      </div>

      {/* ?®æ??—è¡¨ */}
      <StandardTable
        data={filteredDocuments.slice(0, 20)}
        columns={[
          {
            key: 'documentNumber',
            label: '?®æ?ç·¨è?',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm font-medium text-gray-900 font-chinese">
                {doc.documentNumber}
              </span>
            )
          },
          {
            key: 'type',
            label: 'é¡å?',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-500 font-chinese">
                {getTypeDisplayName(doc.type)}
              </span>
            )
          },
          {
            key: 'partnerName',
            label: 'å®¢æˆ¶',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-900 font-chinese">
                {doc.partnerName}
              </span>
            )
          },
          {
            key: 'totalAmount',
            label: '?‘é?',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-900 font-chinese">
                {formatCurrency(doc.totalAmount)}
              </span>
            )
          },
          {
            key: 'status',
            label: '?€??,
            sortable: true,
            render: (_, doc) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)} font-chinese`}>
                {getStatusDisplayName(doc.status)}
              </span>
            )
          },
          {
            key: 'documentDate',
            label: '?¥æ?',
            sortable: true,
            render: (_, doc) => (
              <span className="text-sm text-gray-500 font-chinese">
                {formatDate(doc.documentDate)}
              </span>
            )
          },
          {
            key: 'actions',
            label: '?ä?',
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
        emptyMessage="æ²’æ??¾åˆ°?·å”®?®æ?ï¼Œè?èª¿æ•´?œå?æ¢ä»¶?–æ–°å¢ç¬¬ä¸€?‹éŠ·?®å–®??
        exportFileName="sales_documents"
        customHeader={
          <h3 className="text-lg font-semibold text-gray-900 font-chinese mb-4">
            ?·å”®?®æ??—è¡¨ ({filteredDocuments.length})
          </h3>
        }
      />
    </div>
  );
};

export default SalesDocumentManagement;
