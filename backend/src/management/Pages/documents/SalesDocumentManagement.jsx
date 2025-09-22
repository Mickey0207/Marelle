import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, CreditCard } from 'lucide-react';

const SalesDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalesDocuments();
  }, []);

  const loadSalesDocuments = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockDocuments = [
        {
          id: 'SO-2024-001',
          type: 'sales_order',
          status: 'confirmed',
          customerName: '優雅生活股份有限公司',
          amount: 25800,
          documentDate: '2024-01-15',
          createdBy: '張小明'
        },
        {
          id: 'SI-2024-001',
          type: 'sales_invoice',
          status: 'completed',
          customerName: '美好時光有限公司',
          amount: 18900,
          documentDate: '2024-01-14',
          createdBy: '李小華'
        }
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('載入銷售文件失敗:', error);
    } finally {
      setLoading(false);
    }
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
      in_progress: '處理中',
      partially_completed: '部分完成',
      completed: '已完成',
      cancelled: '已取消'
    };
    return names[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-chinese">銷售文件管理</h1>
          <p className="text-gray-600 mt-2 font-chinese">
            管理銷售訂單、出貨、發票、收款等銷售相關單據
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">總文件數</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">待處理</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">已完成</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">總金額</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(44700)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">銷售文件列表</h3>
          <div className="" style={{overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">文件編號</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">類型</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">客戶</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">金額</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">狀態</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">日期</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">{doc.id}</td>
                    <td className="py-3 px-4">{getTypeDisplayName(doc.type)}</td>
                    <td className="py-3 px-4">{doc.customerName}</td>
                    <td className="py-3 px-4">{formatCurrency(doc.amount)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getStatusDisplayName(doc.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(doc.documentDate).toLocaleDateString('zh-TW')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDocumentManagement;