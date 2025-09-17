import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  PauseCircle,
  RotateCcw,
  UserCheck,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import { documentDataManager } from '../../data/documentDataManager';
import SearchableSelect from '../../../components/SearchableSelect';

const ApprovalWorkflowSystem = () => {
  const [approvals, setApprovals] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadApprovalData();
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

  const loadApprovalData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allDocuments = documentDataManager.getAllDocuments();
      
      // 需要審批的單據
      const pendingApprovals = allDocuments.filter(doc => 
        ['submitted', 'pending_approval'].includes(doc.status)
      );
      
      // 模擬工作流數據
      const mockWorkflows = [
        { id: 1, name: '採購審批流程', type: 'purchase', steps: 3 },
        { id: 2, name: '銷售審批流程', type: 'sales', steps: 2 },
        { id: 3, name: '庫存調整流程', type: 'inventory', steps: 2 },
        { id: 4, name: '財務審批流程', type: 'finance', steps: 4 }
      ];
      
      setApprovals(pendingApprovals);
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('載入審批資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    let matches = true;
    
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'pending':
          matches = matches && ['submitted', 'pending_approval'].includes(approval.status);
          break;
        case 'approved':
          matches = matches && approval.status === 'approved';
          break;
        case 'rejected':
          matches = matches && approval.status === 'rejected';
          break;
        case 'overdue':
          // 模擬過期邏輯 - 超過3天未處理
          const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
          matches = matches && new Date(approval.documentDate) < threeDaysAgo && 
                   ['submitted', 'pending_approval'].includes(approval.status);
          break;
      }
    }
    
    if (selectedWorkflow !== 'all') {
      // 根據單據類型匹配工作流
      const typeMapping = {
        'purchase': ['purchase_request', 'purchase_order', 'purchase_invoice'],
        'sales': ['sales_order', 'sales_invoice'],
        'inventory': ['stock_in', 'stock_out', 'stock_adjustment'],
        'finance': ['payment_voucher', 'payment_receipt']
      };
      
      for (const [workflowType, documentTypes] of Object.entries(typeMapping)) {
        if (selectedWorkflow === workflowType) {
          matches = matches && documentTypes.includes(approval.type);
          break;
        }
      }
    }
    
    return matches;
  });

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      submitted: '已提交',
      pending_approval: '待審核',
      approved: '已審核',
      rejected: '已拒絕'
    };
    return names[status] || status;
  };

  const getTypeDisplayName = (type) => {
    const names = {
      purchase_request: '採購申請',
      purchase_order: '採購訂單',
      purchase_invoice: '採購發票',
      sales_order: '銷售訂單',
      sales_invoice: '銷售發票',
      stock_in: '入庫單',
      stock_out: '出庫單',
      stock_adjustment: '庫存調整',
      payment_voucher: '付款憑證',
      payment_receipt: '收款單'
    };
    return names[type] || type;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-TW');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatistics = () => {
    const stats = {
      total: approvals.length,
      pending: approvals.filter(a => ['submitted', 'pending_approval'].includes(a.status)).length,
      approved: approvals.filter(a => a.status === 'approved').length,
      rejected: approvals.filter(a => a.status === 'rejected').length,
      overdue: 0
    };
    
    // 計算過期審批
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    stats.overdue = approvals.filter(a => 
      new Date(a.documentDate) < threeDaysAgo && 
      ['submitted', 'pending_approval'].includes(a.status)
    ).length;
    
    return stats;
  };

  const statistics = getStatistics();

  const handleApprove = (approvalId) => {
    console.log('Approve approval:', approvalId);
    // 實際實現會更新審批狀態
  };

  const handleReject = (approvalId) => {
    console.log('Reject approval:', approvalId);
    // 實際實現會更新審批狀態
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
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">審批工作流</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          管理和處理所有需要審批的單據，設定審批工作流程
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
              <p className="text-sm font-medium text-gray-600 font-chinese">待審批總數</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">已審核</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.approved}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">已拒絕</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.rejected}</p>
            </div>
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-orange-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 font-chinese">逾期審批</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={loadApprovalData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese"
        >
          <RefreshCw className="w-4 h-4" />
          重新整理
        </button>
        <button className="px-4 py-2 bg-apricot-500 text-white rounded-lg hover:bg-apricot-600 transition-colors flex items-center gap-2 font-chinese">
          <Plus className="w-4 h-4" />
          新增工作流
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="glass p-2 rounded-2xl">
        <div className="flex space-x-1">
          {[
            { id: 'pending', name: '待審批', count: statistics.pending },
            { id: 'approved', name: '已審核', count: statistics.approved },
            { id: 'rejected', name: '已拒絕', count: statistics.rejected },
            { id: 'overdue', name: '逾期', count: statistics.overdue }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 font-chinese ${
                activeTab === tab.id
                  ? 'bg-apricot-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.name}
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-white text-apricot-500' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 篩選和搜尋 */}
      <div className="glass p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableSelect
            value={selectedWorkflow}
            onChange={setSelectedWorkflow}
            options={[
              { value: 'all', label: '所有工作流' },
              { value: 'purchase', label: '採購審批流程' },
              { value: 'sales', label: '銷售審批流程' },
              { value: 'inventory', label: '庫存審批流程' },
              { value: 'finance', label: '財務審批流程' }
            ]}
            placeholder="選擇工作流"
            searchPlaceholder="搜尋工作流..."
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

      {/* 審批列表 */}
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">
              審批列表 ({filteredApprovals.length})
            </h3>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese">
              <Download className="w-4 h-4" />
              匯出
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  單據資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  類型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  提交人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  提交日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApprovals.slice(0, 20).map((approval) => (
                <tr key={approval.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-chinese">
                        {approval.documentNumber}
                      </div>
                      <div className="text-sm text-gray-500 font-chinese">
                        {approval.title || '無標題'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-chinese">
                    {getTypeDisplayName(approval.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-chinese">
                    {formatCurrency(approval.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-chinese">
                    {approval.createdBy || '系統'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(approval.status)} font-chinese`}>
                      {getStatusDisplayName(approval.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-chinese">
                    {formatDate(approval.documentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {['submitted', 'pending_approval'].includes(approval.status) && (
                        <>
                          <button 
                            onClick={() => handleApprove(approval.id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(approval.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-chinese">沒有找到審批項目</h3>
            <p className="text-gray-500 font-chinese">當前篩選條件下沒有需要處理的審批</p>
          </div>
        )}
      </div>

      {/* 工作流配置 */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 font-chinese">工作流配置</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.map(workflow => (
            <div key={workflow.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 font-chinese">{workflow.name}</h4>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-3 font-chinese">{workflow.steps} 個審批步驟</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-chinese">
                  編輯
                </button>
                <button className="flex-1 px-3 py-1 text-xs bg-apricot-100 text-apricot-700 rounded hover:bg-apricot-200 transition-colors font-chinese">
                  設定
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflowSystem;