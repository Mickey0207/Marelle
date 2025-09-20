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

  const loadInventoryDocuments = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allDocuments = documentDataManager.getAllDocuments();
      const inventoryDocs = allDocuments.filter(doc => inventoryDocumentTypes.includes(doc.type));
      
      setDocuments(inventoryDocs);
    } catch (error) {
      console.error('è¼‰å…¥åº«å??®æ?å¤±æ?:', error);
    } finally {
      setLoading(false);
    }
  };

  // å®šç¾©è¡¨æ ¼?—é?ç½?
  const columns = [
    {
      key: 'documentNumber',
      label: '?®æ?ç·¨è?',
      sortable: true,
      render: (_, doc) => (
        <span className="font-medium text-gray-900 font-chinese">
          {doc.documentNumber}
        </span>
      )
    },
    {
      key: 'type',
      label: 'é¡å?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-500 font-chinese">
          {getTypeDisplayName(doc.type)}
        </span>
      )
    },
    {
      key: 'description',
      label: 'èªªæ?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-900 font-chinese">
          {doc.title || doc.description || '?¡èªª??}
        </span>
      )
    },
    {
      key: 'totalAmount',
      label: '?‘é?',
      sortable: true,
      render: (_, doc) => (
        <span className="text-gray-900 font-chinese">
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
        <span className="text-gray-500 font-chinese">
          {formatDate(doc.documentDate)}
        </span>
      )
    },
    {
      key: 'actions',
      label: '?ä?',
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
      stock_in: '?¥åº«??,
      stock_out: '?ºåº«??,
      stock_transfer: 'èª¿æ’¥??,
      stock_adjustment: 'åº«å?èª¿æ•´',
      stock_count: '?¤é???
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
      totalValue: 0,
      monthlyMovement: {
        in: 0,
        out: 0
      }
    };

    filteredDocuments.forEach(doc => {
      // ?‰é??‹çµ±è¨?
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      
      // ?‰ç??‹çµ±è¨?
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
      
      // ç¸½åƒ¹??
      stats.totalValue += doc.totalAmount || 0;
      
      // ?¬æ??²å‡ºçµ±è?
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
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">åº«å??®æ?ç®¡ç?</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          ç®¡ç??¥åº«?å‡ºåº«ã€èª¿?¥ã€ç›¤é»ç??€?‰åº«å­˜ç›¸?œå–®??
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={loadInventoryDocuments}
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
          ?°å?åº«å??®æ?
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ?®æ?é¡å??†å? */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?®æ?é¡å??†å?</h3>
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
              onClick={() => setSelectedType('stock_in')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <PackageCheck className="w-5 h-5 text-green-500" />
              æª¢è??¥åº«??
            </button>
            <button 
              onClick={() => setSelectedType('stock_out')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <PackageX className="w-5 h-5 text-red-500" />
              æª¢è??ºåº«??
            </button>
            <button 
              onClick={() => setSelectedType('stock_transfer')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <ArrowRightLeft className="w-5 h-5 text-blue-500" />
              æª¢è?èª¿æ’¥??
            </button>
            <button 
              onClick={() => setSelectedType('stock_count')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 font-chinese"
            >
              <Clipboard className="w-5 h-5 text-purple-500" />
              æª¢è??¤é???
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
              { value: 'stock_in', label: '?¥åº«?? },
              { value: 'stock_out', label: '?ºåº«?? },
              { value: 'stock_transfer', label: 'èª¿æ’¥?? },
              { value: 'stock_adjustment', label: 'åº«å?èª¿æ•´' },
              { value: 'stock_count', label: '?¤é??? }
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
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">
              åº«å??®æ??—è¡¨ ({filteredDocuments.length})
            </h3>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese">
              <Download className="w-4 h-4" />
              ?¯å‡º
            </button>
          </div>
        </div>

        <StandardTable
          data={filteredDocuments.slice(0, 20)}
          columns={columns}
          emptyMessage="æ²’æ??¾åˆ°åº«å??®æ?"
          emptyDescription="è«‹èª¿?´æ?å°‹æ?ä»¶æ??°å?ç¬¬ä??‹åº«å­˜å–®??
          emptyIcon={Clipboard}
        />
        </div>
      </div>
    </div>
  );
};

export default InventoryDocumentManagement;
