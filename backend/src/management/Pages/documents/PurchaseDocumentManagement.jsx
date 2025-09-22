import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  FileText,
  ShoppingBag,
  Package2,
  Receipt,
  CreditCard,
  CheckSquare,
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
  Calendar,
  DollarSign,
  FileDown,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Copy
} from 'lucide-react';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
// import { useToast } from '@/hooks/useToast'; // 暫時註解，避免導入錯誤
// import procurementDataManager from '../../../shared/data/procurementDataManager.js';

const PurchaseDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // const { showToast } = useToast(); // 暫時移除

  useEffect(() => {
    // GSAP 動畫
    gsap.fromTo(
      '.purchase-section',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }
    );
  }, []);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await procurementDataManager.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('載入採購文件失敗:', error);
      console.error('載入文件失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 定義表格欄位
  const columns = [
    {
      key: 'documentNumber',
      label: '文件編號',
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
          {getTypeDisplayName(doc.type)}
        </span>
      )
    },
    {
      key: 'supplier',
      label: '供應商',
      sortable: true,
      render: (_, doc) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900 font-chinese">{doc.supplier?.name}</div>
          <div className="text-gray-500">{doc.supplier?.code}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: '金額',
      sortable: true,
      render: (_, doc) => (
        <span className="font-medium text-gray-900">
          {doc.amount?.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, doc) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
          {getStatusIcon(doc.status)}
          {getStatusDisplayName(doc.status)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: '建立時間',
      sortable: true,
      render: (_, doc) => (
        <div className="text-sm text-gray-500">
          <div>{new Date(doc.createdAt).toLocaleDateString()}</div>
          <div className="text-xs">{new Date(doc.createdAt).toLocaleTimeString()}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      render: (_, doc) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handlePreview(doc)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="預覽"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(doc)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="編輯"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(doc.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="刪除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDownload(doc)}
            className="text-purple-600 hover:text-purple-800 transition-colors"
            title="下載"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const getTypeDisplayName = (type) => {
    const names = {
      purchase_request: '採購申請',
      purchase_order: '採購訂單',
      purchase_return: '採購退貨',
      goods_receipt: '收貨單',
      purchase_invoice: '採購發票',
      payment_voucher: '付款憑證'
    };
    return names[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      purchase_request: 'bg-blue-100 text-blue-800',
      purchase_order: 'bg-green-100 text-green-800',
      purchase_return: 'bg-red-100 text-red-800',
      goods_receipt: 'bg-purple-100 text-purple-800',
      purchase_invoice: 'bg-orange-100 text-orange-800',
      payment_voucher: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      draft: '草稿',
      pending: '待審核',
      approved: '已核准',
      rejected: '已拒絕',
      completed: '已完成',
      cancelled: '已取消'
    };
    return names[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'approved':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'rejected':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'completed':
        return <CheckSquare className="w-3 h-3 mr-1" />;
      case 'cancelled':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setIsEditing(true);
    setShowNewDocumentForm(true);
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('確定要刪除這個文件嗎？')) {
      try {
        await procurementDataManager.deleteDocument(documentId);
        await loadDocuments();
        console.log('文件刪除成功');
      } catch (error) {
        console.error('刪除文件失敗:', error);
        console.error('刪除文件失敗:', error);
      }
    }
  };

  const handleDownload = async (document) => {
    try {
      // 這裡實現文件下載邏輯
      console.log('文件下載中...');
    } catch (error) {
      console.error('下載文件失敗:', error);
      console.error('下載文件失敗:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-[#cc824d]" />
          <span className="ml-2 text-gray-600 font-chinese">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="purchase-section mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-chinese">採購文件管理</h1>
            <p className="text-gray-600 mt-2">管理所有採購相關文件和審核流程</p>
          </div>
          <button
            onClick={() => {
              setSelectedDocument(null);
              setIsEditing(false);
              setShowNewDocumentForm(true);
            }}
            className={`${ADMIN_STYLES.primaryButton} flex items-center space-x-2`}
          >
            <Plus className="w-5 h-5" />
            <span>新增文件</span>
          </button>
        </div>
      </div>

      {/* 篩選和搜尋 */}
      <div className="purchase-section mb-6">
        <div className={ADMIN_STYLES.glassCard}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-chinese">搜尋</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="搜尋文件編號或供應商..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-chinese">文件類型</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">全部類型</option>
                <option value="purchase_request">採購申請</option>
                <option value="purchase_order">採購訂單</option>
                <option value="purchase_return">採購退貨</option>
                <option value="goods_receipt">收貨單</option>
                <option value="purchase_invoice">採購發票</option>
                <option value="payment_voucher">付款憑證</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-chinese">狀態</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">全部狀態</option>
                <option value="draft">草稿</option>
                <option value="pending">待審核</option>
                <option value="approved">已核准</option>
                <option value="rejected">已拒絕</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={loadDocuments}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-chinese">重新整理</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 文件列表 */}
      <div className="purchase-section">
        <div className={ADMIN_STYLES.glassCard}>
          <div className="" style={{overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`text-left py-3 px-4 font-medium text-gray-900 font-chinese ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={() => {
                        if (column.sortable) {
                          if (sortField === column.key) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(column.key);
                            setSortDirection('asc');
                          }
                        }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && sortField === column.key && (
                          <span className="text-[#cc824d]">
                            {sortDirection === 'asc' ? '' : ''}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedDocuments.map((document) => (
                  <tr key={document.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4">
                        {column.render ? column.render(document[column.key], document) : document[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-chinese">沒有找到符合條件的文件</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDocumentManagement;
