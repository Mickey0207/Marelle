import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "@shared/adminStyles";

const TemplateStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
};

const TemplateType = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push'
};

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [statistics, setStatistics] = useState({
    totalTemplates: 0,
    activeTemplates: 0,
    draftTemplates: 0,
    emailTemplates: 0
  });

  useEffect(() => {
    loadTemplates();
    loadStatistics();

    gsap.fromTo(
      '.template-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // 模擬載入模板數據
      const mockTemplates = [
        {
          id: 'tpl-1',
          name: '歡迎新會員',
          type: 'email',
          status: 'active',
          subject: '歡迎加入 Marelle 會員！',
          content: '親愛的 {{user.name}}，歡迎您加入我們的會員大家庭...',
          channels: ['email'],
          variables: ['user.name', 'user.email'],
          lastModified: new Date('2024-01-15'),
          usageCount: 245
        },
        {
          id: 'tpl-2',
          name: '訂單確認通知',
          type: 'email',
          status: 'active',
          subject: '您的訂單 {{order.id}} 已確認',
          content: '感謝您的訂購！您的訂單詳情如下：訂單編號：{{order.id}}...',
          channels: ['email', 'sms'],
          variables: ['order.id', 'order.total', 'user.name'],
          lastModified: new Date('2024-01-14'),
          usageCount: 1580
        },
        {
          id: 'tpl-3',
          name: '發貨通知',
          type: 'sms',
          status: 'active',
          subject: '',
          content: '您的訂單 {{order.id}} 已發貨，追蹤號碼：{{shipping.tracking}}',
          channels: ['sms', 'push'],
          variables: ['order.id', 'shipping.tracking'],
          lastModified: new Date('2024-01-13'),
          usageCount: 892
        },
        {
          id: 'tpl-4',
          name: '生日祝福',
          type: 'email',
          status: 'draft',
          subject: '生日快樂！特別優惠送給您',
          content: '親愛的 {{user.name}}，生日快樂！為您準備了專屬優惠...',
          channels: ['email'],
          variables: ['user.name', 'user.birthday'],
          lastModified: new Date('2024-01-12'),
          usageCount: 0
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const mockStats = {
        totalTemplates: 24,
        activeTemplates: 18,
        draftTemplates: 6,
        emailTemplates: 15
      };
      setStatistics(mockStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('確定要刪除這個模板嗎？此操作無法復原。')) {
      setTemplates(prev => prev.filter(template => template.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [TemplateStatus.ACTIVE]: { label: '啟用中', className: 'bg-green-100 text-green-800' },
      [TemplateStatus.INACTIVE]: { label: '已停用', className: 'bg-red-100 text-red-800' },
      [TemplateStatus.DRAFT]: { label: '草稿', className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      email: EnvelopeIcon,
      sms: DevicePhoneMobileIcon,
      push: BellIcon
    };
    const IconComponent = iconMap[type] || DocumentTextIcon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getChannelIcons = (channels) => {
    return (
      <div className="flex space-x-1">
        {channels.map((channel, index) => (
          <div key={index} className="p-1 bg-gray-100 rounded">
            {getTypeIcon(channel)}
          </div>
        ))}
      </div>
    );
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入模板數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">模板管理</h1>
        <p className="text-gray-600 mt-2">管理各種通知模板與內容</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="template-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalTemplates}</p>
              <p className="text-sm text-gray-600">總模板數</p>
            </div>
          </div>
        </div>

        <div className="template-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.activeTemplates}</p>
              <p className="text-sm text-gray-600">啟用模板</p>
            </div>
          </div>
        </div>

        <div className="template-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.draftTemplates}</p>
              <p className="text-sm text-gray-600">草稿模板</p>
            </div>
          </div>
        </div>

        <div className="template-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.emailTemplates}</p>
              <p className="text-sm text-gray-600">郵件模板</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className={`${ADMIN_STYLES.glassCard} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋模板名稱、主旨或內容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">所有類型</option>
                <option value="email">電子郵件</option>
                <option value="sms">簡訊</option>
                <option value="push">推播</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有狀態</option>
              <option value="active">啟用中</option>
              <option value="inactive">已停用</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            新建模板
          </button>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className={`template-card ${ADMIN_STYLES.glassCard}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#cc824d] to-[#b8743d] rounded-lg flex items-center justify-center text-white">
                    {getTypeIcon(template.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-chinese">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.subject || '無主旨'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getChannelIcons(template.channels)}
                  {getStatusBadge(template.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 內容預覽 */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="font-medium text-gray-900">內容預覽</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {template.content}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 使用統計 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">使用統計</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">使用次數：</span>
                      <span className="font-medium">{template.usageCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">最後修改：</span>
                      <span className="font-medium">{template.lastModified.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">模板類型：</span>
                      <span className="font-medium capitalize">{template.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      預覽
                    </button>
                    <button className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">沒有找到符合條件的模板</div>
          <p className="text-gray-400 mt-2">嘗試調整搜尋條件或創建新的模板</p>
        </div>
      )}

      {/* 創建模板模態框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-chinese">新建通知模板</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模板名稱</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="輸入模板名稱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模板類型</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent">
                    <option value="email">電子郵件</option>
                    <option value="sms">簡訊</option>
                    <option value="push">推播通知</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">主旨 (電子郵件)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="輸入郵件主旨"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模板內容</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  rows="6"
                  placeholder="輸入模板內容，可使用變量如 {{user.name}}"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">發送渠道</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]" />
                    <span className="ml-2 text-sm">電子郵件</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]" />
                    <span className="ml-2 text-sm">簡訊</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]" />
                    <span className="ml-2 text-sm">推播通知</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors">
                創建模板
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 預覽模態框 */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-chinese">模板預覽</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模板名稱</label>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedTemplate.name}</div>
              </div>
              
              {selectedTemplate.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">主旨</label>
                  <div className="p-3 bg-gray-50 rounded-lg">{selectedTemplate.subject}</div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">內容</label>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedTemplate.content}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">使用的變量</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;
