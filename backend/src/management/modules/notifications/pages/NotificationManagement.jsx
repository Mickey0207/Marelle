import React, { useState, useEffect } from 'react';
import StandardTable from "../../../components/ui/StandardTable";
import {SearchableSelect} from "../../../shared/components/SearchableSelect";
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// 模擬通知範本數據
const mockNotificationTemplates = [
  {
    id: 1,
    name: '會員生日祝福',
    description: '會員生日當天自動發送祝福訊息',
    category: 'marketing',
    status: 'active',
    trigger: '會員生日',
    channels: ['email', 'sms'],
    sentCount: 1250,
    openRate: 85.2,
    clickRate: 23.5,
    lastSent: '2024-09-15',
    createdAt: '2024-08-01',
    createdBy: '張小美'
  },
  {
    id: 2,
    name: '庫存不足警報',
    description: '當庫存不足時發送給管理員',
    category: 'system',
    status: 'active',
    trigger: '庫存<安全量',
    channels: ['email', 'push'],
    sentCount: 45,
    openRate: 100,
    clickRate: 88.9,
    lastSent: '2024-09-16',
    createdAt: '2024-07-15',
    createdBy: '系統自動'
  },
  {
    id: 3,
    name: '特別活動通知',
    description: '特別活動開始時發送給會員',
    category: 'marketing',
    status: 'draft',
    trigger: '活動開始',
    channels: ['email', 'push', 'sms'],
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    lastSent: null,
    createdAt: '2024-09-10',
    createdBy: '李行銷'
  }
];

// 模擬通知歷史數據
const mockNotificationHistory = [
  {
    id: 1,
    templateName: '會員生日祝福',
    recipient: 'user@example.com',
    channel: 'email',
    status: 'delivered',
    sentAt: '2024-09-16 10:30',
    deliveredAt: '2024-09-16 10:32',
    openedAt: '2024-09-16 11:15',
    clickedAt: null
  }
];

const NotificationManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('templates');

  // 篩選數據
  const filteredTemplates = mockNotificationTemplates.filter(template => {
      const matchSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === '全部' || template.category === selectedCategory;
      const matchStatus = selectedStatus === '全部' || template.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
  });

  // 渲染通道圖標
  const renderChannelIcon = (channel) => {
    const iconMap = {
      email: <EnvelopeIcon className="w-4 h-4" />,
      sms: <DevicePhoneMobileIcon className="w-4 h-4" />,
      push: <BellIcon className="w-4 h-4" />,
      line: <ChatBubbleLeftRightIcon className="w-4 h-4" />
    };
    return iconMap[channel] || <BellIcon className="w-4 h-4" />;
  };

  // 渲染狀態徽章
  const renderStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: '啟用' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: '草稿' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '暫停' },
      archived: { bg: 'bg-red-100', text: 'text-red-700', label: '封存' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // 計算統計數據
  const getStats = () => {
    const total = mockNotificationTemplates.length;
    const active = mockNotificationTemplates.filter(t => t.status === 'active').length;
    const totalSent = mockNotificationTemplates.reduce((sum, t) => sum + t.sentCount, 0);
    const avgOpenRate = mockNotificationTemplates.reduce((sum, t) => sum + t.openRate, 0) / total;
    
    return { total, active, totalSent, avgOpenRate };
  };

  const stats = getStats();

  // 通知範本表格欄位配置
  const templateColumns = [
    {
      key: 'name',
      label: '範本名稱',
      render: (template) => (
        <div>
          <div className="font-medium text-amber-800">{template.name}</div>
          <div className="text-sm text-amber-600">{template.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: '分類',
      render: (template) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          template.category === 'marketing' ? 'bg-blue-100 text-blue-700' :
          template.category === 'system' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {template.category === 'marketing' ? '行銷' : 
           template.category === 'system' ? '系統' : '其他'}
        </span>
      )
    },
    {
      key: 'channels',
      label: '發送管道',
      render: (template) => (
        <div className="flex space-x-2">
          {template.channels.map((channel, index) => (
            <div key={index} className="flex items-center text-amber-600" title={channel}>
              {renderChannelIcon(channel)}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'trigger',
      label: '觸發條件',
      render: (template) => (
        <div className="text-sm text-amber-700">{template.trigger}</div>
      )
    },
    {
      key: 'performance',
      label: '成效',
      render: (template) => (
        <div className="text-sm">
          <div>發送: {template.sentCount.toLocaleString()}</div>
          <div>開啟率: {template.openRate}%</div>
          <div>點擊率: {template.clickRate}%</div>
        </div>
      )
    },
    {
      key: 'status',
      label: '狀態',
      render: (template) => renderStatusBadge(template.status)
    },
    {
      key: 'actions',
      label: '操作',
      render: (template) => (
        <div className="flex space-x-2">
          <button
            className="text-amber-600 hover:text-amber-800 transition-colors"
            title="檢視"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="編輯"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            title="刪除"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 觸發條件管理位置
  const TriggerManagement = () => (
    <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
      <h3 className="text-lg font-semibold text-amber-800 mb-4">觸發條件設定</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-amber-700">會員相關</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-white/10 rounded">
              <span>新會員註冊</span>
              <span className="text-green-600">啟用</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/10 rounded">
              <span>會員生日</span>
              <span className="text-green-600">啟用</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-amber-700">系統相關</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-white/10 rounded">
              <span>庫存不足</span>
              <span className="text-green-600">啟用</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/10 rounded">
              <span>訂單異常</span>
              <span className="text-yellow-600">暫停</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 設定範本模板
  const TemplateSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
        <h3 className="text-lg font-semibold text-amber-800 mb-4">範本編輯器</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">範本名稱</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/50"
              placeholder="輸入範本名稱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">範本內容</label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/50"
              placeholder="輸入範本內容，可使用變數如 {{user.name}}, {{order.total}} 等"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-1">關聯範本</label>
            <SearchableSelect
              options={[
                { value: '', label: '選擇關聯範本' },
                { value: 'welcome', label: '歡迎訊息' },
                { value: 'birthday', label: '生日祝福' }
              ]}
              value=""
              onChange={() => {}}
              placeholder="選擇關聯範本"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 通知歷史欄位配置
  const historyColumns = [
    {
      key: 'template',
      label: '範本',
      render: (item) => item.templateName
    },
    {
      key: 'recipient',
      label: '收件人',
      render: (item) => item.recipient
    },
    {
      key: 'channel',
      label: '管道',
      render: (item) => (
        <div className="flex items-center space-x-1">
          {renderChannelIcon(item.channel)}
          <span className="capitalize">{item.channel}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: '狀態',
      render: (item) => {
        const statusMap = {
          'sent': { bg: 'bg-blue-100', text: 'text-blue-700', label: '已發送' },
          'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: '已送達' },
          'opened': { bg: 'bg-purple-100', text: 'text-purple-700', label: '已開啟' },
          'clicked': { bg: 'bg-amber-100', text: 'text-amber-700', label: '已點擊' },
          'failed': { bg: 'bg-red-100', text: 'text-red-700', label: '發送失敗' },
          'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待發送' },
        };
        
        const config = statusMap[item.status] || statusMap.sent;
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'sentAt',
      label: '發送時間',
      render: (item) => item.sentAt
    }
  ];

  // 渠道統計欄位配置
  const channelColumns = [
    {
      key: 'channel',
      label: '管道',
      render: (item) => (
        <div className="flex items-center space-x-2">
          {renderChannelIcon(item.channel)}
          <span className="capitalize">{item.channel}</span>
        </div>
      )
    },
    {
      key: 'sent',
      label: '發送數',
      render: (item) => item.sent.toLocaleString()
    },
    {
      key: 'delivered',
      label: '送達數',
      render: (item) => item.delivered.toLocaleString()
    },
    {
      key: 'opened',
      label: '開啟數',
      render: (item) => item.opened.toLocaleString()
    },
    {
      key: 'clicked',
      label: '點擊數',
      render: (item) => item.clicked.toLocaleString()
    },
    {
      key: 'rates',
      label: '成效',
      render: (item) => {
        const openRate = ((item.opened / item.delivered) * 100).toFixed(1);
        const clickRate = ((item.clicked / item.opened) * 100).toFixed(1);
        const overallScore = (parseFloat(openRate) + parseFloat(clickRate)) / 2;
        const grade = overallScore >= 80 ? '優秀' : overallScore >= 60 ? '良好' : overallScore >= 40 ? '一般' : '需改進';
        
        return (
          <div className="text-sm">
            <div>開啟率: {openRate}%</div>
            <div>點擊率: {clickRate}%</div>
            <div className="font-medium">{grade}</div>
          </div>
        );
      }
    }
  ];

  // 範本效能欄位配置
  const performanceColumns = [
    {
      key: 'name',
      label: '範本名稱',
      render: (template) => template.name
    },
    {
      key: 'category',
      label: '分類',
      render: (template) => template.category === 'marketing' ? '行銷' : '系統'
    },
    {
      key: 'sent',
      label: '發送數',
      render: (template) => template.sentCount.toLocaleString()
    },
    {
      key: 'openRate',
      label: '開啟率',
      render: (template) => `${template.openRate}%`
    },
    {
      key: 'clickRate',
      label: '點擊率',
      render: (template) => `${template.clickRate}%`
    },
    {
      key: 'suggestion',
      label: '建議',
      render: (template) => {
        let suggestion = '';
        if (template.openRate < 20) suggestion = '優化主旨';
        else if (template.clickRate < 5) suggestion = '優化內容和CTA';
        else suggestion = '表現良好';
        
        return (
          <span className={`text-xs px-2 py-1 rounded-full ${
            suggestion === '表現良好' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {suggestion}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* 標題與統計 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-800 mb-2">通知管理</h1>
          <p className="text-amber-600">管理通知範本、發送記錄與成效分析</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
            <PlusIcon className="w-4 h-4 mr-2" />
            新增範本
          </button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">總範本數</p>
              <p className="text-2xl font-bold text-amber-800">{stats.total}</p>
            </div>
            <BellIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">啟用範本</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">總發送數</p>
              <p className="text-2xl font-bold text-amber-800">{stats.totalSent.toLocaleString()}</p>
            </div>
            <EnvelopeIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">平均開啟率</p>
              <p className="text-2xl font-bold text-amber-800">{stats.avgOpenRate.toFixed(1)}%</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* 分頁標籤 */}
      <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 overflow-hidden">
        <div className="border-b border-white/20">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'templates', label: '通知範本', icon: BellIcon },
              { key: 'triggers', label: '觸發設定', icon: CogIcon },
              { key: 'history', label: '發送記錄', icon: ClockIcon },
              { key: 'analytics', label: '成效分析', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-amber-500 hover:text-amber-600 hover:border-amber-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* 篩選器 */}
              <div className="flex flex-wrap gap-3">
                <SearchableSelect
                  options={[
                    { value: '全部', label: '全部分類' },
                    { value: 'marketing', label: '行銷' },
                    { value: 'system', label: '系統' },
                    { value: 'transactional', label: '交易' }
                  ]}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="選擇分類"
                  className="min-w-[150px]"
                />

                <SearchableSelect
                  options={[
                    { value: '全部', label: '全部狀態' },
                    { value: 'active', label: '啟用' },
                    { value: 'draft', label: '草稿' },
                    { value: 'paused', label: '暫停' }
                  ]}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="選擇狀態"
                  className="min-w-[150px]"
                />
              </div>

              {/* 範本表格 */}
              <StandardTable
                data={filteredTemplates}
                columns={templateColumns}
                emptyMessage="沒有找到通知範本"
                emptyDescription="請調整篩選條件或建立新通知範本"
              />
            </div>
          )}

          {activeTab === 'triggers' && <TriggerManagement />}
          
          {activeTab === 'history' && (
            <StandardTable
              data={mockNotificationHistory}
              columns={historyColumns}
              emptyMessage="沒有發送記錄"
              emptyDescription="還沒有任何通知發送記錄"
            />
          )}
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-4">範本成效分析</h3>
                <StandardTable
                  data={mockNotificationTemplates}
                  columns={performanceColumns}
                  emptyMessage="沒有成效數據"
                  emptyDescription="還沒有足夠的數據進行分析"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 可用變數參考 */}
      <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
        <h3 className="text-lg font-semibold text-amber-800 mb-4">可用變數參考</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-amber-700 mb-2">用戶變數</h4>
            <div className="space-y-1 text-sm">
              {[
                { key: 'user.name', name: '用戶姓名', description: '用戶的顯示名稱', example: '張小明' },
                { key: 'user.email', name: '電子郵件', description: '用戶的電子郵件地址', example: 'user@example.com' },
                { key: 'user.phone', name: '電話號碼', description: '用戶的聯絡電話', example: '0912-345-678' },
                { key: 'user.birthday', name: '生日', description: '用戶生日日期', example: '1990-01-01' },
                { key: 'user.level', name: '會員等級', description: '用戶會員等級', example: 'VIP' },
                { key: 'user.points', name: '點數餘額', description: '用戶目前點數', example: '1,500' }
              ].map((variable, index) => (
                <div key={index} className="p-2 bg-white/10 rounded text-xs">
                  <span className="font-mono text-amber-600">{variable.key}</span>
                  <div className="text-amber-700">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-amber-700 mb-2">訂單變數</h4>
            <div className="space-y-1 text-sm">
              {[
                { key: 'order.id', name: '訂單編號', description: '訂單的唯一識別碼', example: 'ORD-20240916-001' },
                { key: 'order.total', name: '訂單總額', description: '訂單的總金額', example: 'NT$ 1,580' },
                { key: 'order.status', name: '訂單狀態', description: '訂單目前狀態', example: '已出貨' },
                { key: 'order.date', name: '下單時間', description: '訂單建立的日期時間', example: '2024-09-16 14:30' },
                { key: 'order.items', name: '商品清單', description: '訂單中的商品列表', example: '商品A, 商品B' },
                { key: 'order.shipping', name: '配送方式', description: '選擇的配送方式', example: '宅配到府' }
              ].map((variable, index) => (
                <div key={index} className="p-2 bg-white/10 rounded text-xs">
                  <span className="font-mono text-amber-600">{variable.key}</span>
                  <div className="text-amber-700">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-amber-700 mb-2">商品變數</h4>
            <div className="space-y-1 text-sm">
              {[
                { key: 'product.name', name: '商品名稱', description: '商品的完整名稱', example: '經典珍珠項鍊' },
                { key: 'product.price', name: '商品價格', description: '商品的售價', example: 'NT$ 2,980' },
                { key: 'product.category', name: '商品分類', description: '商品所屬分類', example: '珠寶首飾' },
                { key: 'product.discount', name: '折扣資訊', description: '商品優惠資訊', example: '9折優惠' }
              ].map((variable, index) => (
                <div key={index} className="p-2 bg-white/10 rounded text-xs">
                  <span className="font-mono text-amber-600">{variable.key}</span>
                  <div className="text-amber-700">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-amber-700 mb-2">系統變數</h4>
            <div className="space-y-1 text-sm">
              {[
                { key: 'system.site_name', name: '網站名稱', description: '網站名稱', example: 'Marelle' },
                { key: 'system.contact_email', name: '客服信箱', description: '客服聯絡信箱', example: 'support@marelle.com' },
                { key: 'system.phone', name: '客服電話', description: '客服聯絡電話', example: '02-1234-5678' },
                { key: 'system.address', name: '公司地址', description: '公司地址', example: '台北市信義區' },
                { key: 'system.domain', name: '網站域名', description: '網站完整地址', example: 'www.marelle.com' },
                { key: 'system.version', name: '系統版本', description: '目前系統版本號', example: 'v2.1.0' }
              ].map((variable, index) => (
                <div key={index} className="p-2 bg-white/10 rounded text-xs">
                  <span className="font-mono text-amber-600">{variable.key}</span>
                  <div className="text-amber-700">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;