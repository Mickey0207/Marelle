import React, { useState, useMemo } from 'react';
import { 
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  PauseIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  InboxIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import NotificationTestPanel from '../components/NotificationTestPanel';
import CustomSelect from '../components/CustomSelect';
import SearchableSelect from '../../components/SearchableSelect';

// 模擬通知範本數據
const mockTemplateData = [
  {
    id: 1,
    name: '訂單確認通知',
    description: '用戶下單後自動發送的確認通知',
    category: 'order',
    subcategory: 'order_created',
    trigger: '訂單建立',
    channels: ['email_html', 'sms'],
    priority: 'high',
    status: 'active',
    lastUsed: '2024-09-15',
    usageCount: 156,
    successRate: 98.5,
    createdAt: '2024-01-15',
    updatedAt: '2024-09-10'
  },
  {
    id: 2,
    name: '會員生日祝福',
    description: '會員生日當天發送的祝福訊息',
    category: 'user',
    subcategory: 'user_birthday',
    trigger: '會員生日',
    channels: ['email_html', 'line_text'],
    priority: 'normal',
    status: 'active',
    lastUsed: '2024-09-14',
    usageCount: 89,
    successRate: 95.2,
    createdAt: '2024-02-20',
    updatedAt: '2024-08-15'
  },
  {
    id: 3,
    name: '商品缺貨提醒',
    description: '商品庫存不足時發送給管理員的提醒',
    category: 'product',
    subcategory: 'product_low_stock',
    trigger: '庫存低於安全水位',
    channels: ['email_text', 'push_app'],
    priority: 'urgent',
    status: 'active',
    lastUsed: '2024-09-16',
    usageCount: 23,
    successRate: 100,
    createdAt: '2024-03-01',
    updatedAt: '2024-09-05'
  },
  {
    id: 4,
    name: '促銷活動通知',
    description: '新促銷活動開始時發送給會員',
    category: 'marketing',
    subcategory: 'campaign_started',
    trigger: '活動開始',
    channels: ['email_html', 'line_flex', 'push_web'],
    priority: 'normal',
    status: 'inactive',
    lastUsed: '2024-08-30',
    usageCount: 245,
    successRate: 92.8,
    createdAt: '2024-01-10',
    updatedAt: '2024-08-25'
  }
];

const NotificationManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('templates');
  const [showTestPanel, setShowTestPanel] = useState(false);
  
  // 歷史記錄篩選狀態
  const [historyTimeRange, setHistoryTimeRange] = useState('7d');
  const [historyChannel, setHistoryChannel] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');
  
  // 分析頁面狀態
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d');

  // 篩選和排序數據
  const filteredData = useMemo(() => {
    let filtered = mockTemplateData.filter(template => {
      const matchCategory = selectedCategory === '全部' || template.category === selectedCategory;
      const matchStatus = selectedStatus === '全部' || template.status === selectedStatus;
      
      return matchCategory && matchStatus;
    });

    // 排序
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [selectedCategory, selectedStatus, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'order': { bg: 'bg-blue-100', text: 'text-blue-700', label: '訂單', icon: '📦' },
      'user': { bg: 'bg-green-100', text: 'text-green-700', label: '用戶', icon: '👤' },
      'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '商品', icon: '🛍️' },
      'marketing': { bg: 'bg-pink-100', text: 'text-pink-700', label: '行銷', icon: '🎯' },
      'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: '系統', icon: '⚙️' }
    };
    const config = categoryConfig[category] || categoryConfig['system'];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'urgent': { bg: 'bg-red-100', text: 'text-red-700', label: '緊急' },
      'high': { bg: 'bg-orange-100', text: 'text-orange-700', label: '高' },
      'normal': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '普通' },
      'low': { bg: 'bg-gray-100', text: 'text-gray-700', label: '低' }
    };
    const config = priorityConfig[priority] || priorityConfig['normal'];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
        <CheckCircleIcon className="w-3 h-3 mr-1" />啟用
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
        <PauseIcon className="w-3 h-3 mr-1" />停用
      </span>
    );
  };

  const getChannelIcons = (channels) => {
    const channelConfig = {
      'email_html': { icon: '📧', name: 'Email' },
      'email_text': { icon: '📧', name: 'Email' },
      'sms': { icon: '💬', name: 'SMS' },
      'line_text': { icon: '💬', name: 'LINE' },
      'line_flex': { icon: '💬', name: 'LINE' },
      'push_app': { icon: '📱', name: 'App推播' },
      'push_web': { icon: '🌐', name: '網頁推播' }
    };
    
    return (
      <div className="flex space-x-1">
        {channels.map((channel, idx) => {
          const config = channelConfig[channel];
          return (
            <span key={idx} title={config?.name} className="text-sm">
              {config?.icon}
            </span>
          );
        })}
      </div>
    );
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="w-4 h-4 inline ml-1" /> : 
      <ArrowDownIcon className="w-4 h-4 inline ml-1" />;
  };

  const tabs = [
    { id: 'templates', name: '範本管理', icon: DocumentTextIcon },
    { id: 'variables', name: '變數管理', icon: CogIcon },
    { id: 'triggers', name: '觸發器', icon: PlayIcon },
    { id: 'channels', name: '渠道設定', icon: InboxIcon },
    { id: 'history', name: '通知歷史', icon: ClockIcon },
    { id: 'analytics', name: '效果分析', icon: ChartBarIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return renderTemplatesTab();
      case 'variables':
        return renderVariablesTab();
      case 'triggers':
        return renderTriggersTab();
      case 'channels':
        return renderChannelsTab();
      case 'history':
        return renderHistoryTab();
      case 'analytics':
        return renderAnalyticsTab();
      default:
        return renderTemplatesTab();
    }
  };

  const renderTemplatesTab = () => (
    <>
      {/* 篩選區域 */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '全部', label: '全部分類' },
                { value: 'order', label: '訂單' },
                { value: 'user', label: '用戶' },
                { value: 'product', label: '商品' },
                { value: 'marketing', label: '行銷' },
                { value: 'system', label: '系統' }
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="選擇分類"
              className="w-48"
            />
          </div>

          <div className="flex items-center space-x-2">
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: '全部', label: '全部狀態' },
                { value: 'active', label: '啟用', icon: '✅', description: '正在使用的範本' },
                { value: 'inactive', label: '停用', icon: '⏸️', description: '已停用的範本' }
              ]}
              className="w-32"
              placeholder="選擇狀態"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            共 {filteredData.length} 個範本
          </div>
        </div>
      </div>

      {/* 主要範本表格 */}
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('name')}>
                  範本名稱 <SortIcon field="name" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">分類</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">觸發條件</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">通知渠道</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">優先級</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('usageCount')}>
                  使用次數 <SortIcon field="usageCount" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('successRate')}>
                  成功率 <SortIcon field="successRate" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">狀態</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map(template => (
                <tr key={template.id} className="hover:bg-white/30">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium font-chinese">{template.name}</div>
                      <div className="text-sm text-gray-500 font-chinese">{template.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getCategoryBadge(template.category)}</td>
                  <td className="px-4 py-3 font-chinese">{template.trigger}</td>
                  <td className="px-4 py-3">{getChannelIcons(template.channels)}</td>
                  <td className="px-4 py-3">{getPriorityBadge(template.priority)}</td>
                  <td className="px-4 py-3 text-center">{template.usageCount}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-600">{template.successRate}%</td>
                  <td className="px-4 py-3">{getStatusBadge(template.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="查看詳情">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="編輯">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="測試發送">
                        <PlayIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded" title="刪除">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderVariablesTab = () => {
    const variableCategories = [
      {
        id: 'user',
        name: '用戶相關',
        icon: '👤',
        color: 'blue',
        variables: [
          { key: 'user.name', name: '用戶姓名', description: '用戶的真實姓名', example: '張小明' },
          { key: 'user.email', name: '電子郵件', description: '用戶的電子郵件地址', example: 'user@example.com' },
          { key: 'user.phone', name: '手機號碼', description: '用戶的手機號碼', example: '0912345678' },
          { key: 'user.birthday', name: '生日', description: '用戶的生日日期', example: '1990-01-01' },
          { key: 'user.level', name: '會員等級', description: '用戶的會員等級', example: 'VIP' },
          { key: 'user.points', name: '積分餘額', description: '用戶目前的積分數量', example: '1250' }
        ]
      },
      {
        id: 'order',
        name: '訂單相關',
        icon: '📦',
        color: 'green',
        variables: [
          { key: 'order.id', name: '訂單編號', description: '訂單的唯一識別碼', example: 'ORD-20240916-001' },
          { key: 'order.total', name: '訂單總額', description: '訂單的總金額', example: 'NT$ 1,580' },
          { key: 'order.status', name: '訂單狀態', description: '訂單目前的處理狀態', example: '已出貨' },
          { key: 'order.date', name: '下單日期', description: '訂單建立的日期時間', example: '2024-09-16 14:30' },
          { key: 'order.items', name: '商品列表', description: '訂單中的商品清單', example: '商品A x2, 商品B x1' },
          { key: 'order.shipping', name: '配送方式', description: '選擇的配送方式', example: '宅配到府' }
        ]
      },
      {
        id: 'product',
        name: '商品相關',
        icon: '🛍️',
        color: 'purple',
        variables: [
          { key: 'product.name', name: '商品名稱', description: '商品的完整名稱', example: '精緻杏仁蛋糕' },
          { key: 'product.price', name: '商品價格', description: '商品的售價', example: 'NT$ 480' },
          { key: 'product.sku', name: '商品編號', description: '商品的SKU編號', example: 'CAKE-ALM-001' },
          { key: 'product.category', name: '商品分類', description: '商品所屬分類', example: '蛋糕類' },
          { key: 'product.stock', name: '庫存數量', description: '商品目前庫存', example: '25' },
          { key: 'product.discount', name: '折扣資訊', description: '商品的折扣信息', example: '9折優惠' }
        ]
      },
      {
        id: 'system',
        name: '系統相關',
        icon: '⚙️',
        color: 'gray',
        variables: [
          { key: 'system.site_name', name: '網站名稱', description: '網站的名稱', example: 'Marelle' },
          { key: 'system.contact_email', name: '客服信箱', description: '客服聯絡信箱', example: 'support@marelle.com' },
          { key: 'system.current_date', name: '當前日期', description: '系統當前日期', example: '2024-09-16' },
          { key: 'system.current_time', name: '當前時間', description: '系統當前時間', example: '14:30:25' },
          { key: 'system.domain', name: '網站域名', description: '網站的域名地址', example: 'www.marelle.com' },
          { key: 'system.version', name: '系統版本', description: '當前系統版本號', example: 'v2.1.0' }
        ]
      }
    ];

    const getColorClasses = (color) => {
      const colorMap = {
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' },
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100' },
        gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100' }
      };
      return colorMap[color] || colorMap.gray;
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">變數管理</h3>
            <div className="text-sm text-gray-500 font-chinese">
              共 {variableCategories.reduce((sum, cat) => sum + cat.variables.length, 0)} 個變數
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 font-chinese mb-2">💡 使用說明</h4>
            <p className="text-sm text-amber-700 font-chinese">
              在通知範本中使用 <code className="bg-amber-100 px-1 rounded">{'{{變數名稱}}'}</code> 格式來插入動態內容。
              例如：<code className="bg-amber-100 px-1 rounded">{'{{user.name}}'}</code> 會被替換為實際的用戶姓名。
            </p>
          </div>
        </div>

        {variableCategories.map(category => {
          const colors = getColorClasses(category.color);
          return (
            <div key={category.id} className="glass rounded-2xl overflow-visible">{/* 允許垂直溢出以顯示下拉選單 */}
              <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h4 className={`text-lg font-bold font-chinese ${colors.text}`}>
                    {category.name}
                  </h4>
                  <span className={`ml-auto px-3 py-1 ${colors.badge} ${colors.text} text-sm font-medium rounded-full font-chinese`}>
                    {category.variables.length} 個變數
                  </span>
                </div>
              </div>
              
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          變數名稱
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          描述
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          範例值
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {category.variables.map((variable, index) => (
                        <tr key={variable.key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-purple-600">
                                {'{{' + variable.key + '}}'}
                              </code>
                            </div>
                            <div className="text-sm font-medium text-gray-900 font-chinese mt-1">
                              {variable.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 font-chinese">
                              {variable.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-chinese">
                              {variable.example}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              className="text-blue-600 hover:text-blue-900 text-sm font-chinese"
                              onClick={() => navigator.clipboard.writeText(`{{${variable.key}}}`)}
                              title="複製變數"
                            >
                              📋 複製
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTriggersTab = () => {
    const triggers = [
      {
        id: 1,
        name: '用戶註冊',
        category: 'user',
        event: 'user_registered',
        description: '新用戶完成註冊時觸發',
        conditions: [
          { field: 'user.email_verified', operator: 'equals', value: 'true' }
        ],
        status: 'active',
        templates: ['歡迎註冊通知', '新手指南'],
        lastTriggered: '2024-09-16 10:30',
        triggerCount: 23
      },
      {
        id: 2,
        name: '訂單建立',
        category: 'order',
        event: 'order_created',
        description: '用戶成功下單時觸發',
        conditions: [
          { field: 'order.status', operator: 'equals', value: 'confirmed' },
          { field: 'order.payment_status', operator: 'equals', value: 'paid' }
        ],
        status: 'active',
        templates: ['訂單確認通知'],
        lastTriggered: '2024-09-16 14:15',
        triggerCount: 89
      },
      {
        id: 3,
        name: '庫存警告',
        category: 'product',
        event: 'stock_low',
        description: '商品庫存低於安全水位時觸發',
        conditions: [
          { field: 'product.stock', operator: 'less_than', value: '10' }
        ],
        status: 'active',
        templates: ['庫存不足提醒'],
        lastTriggered: '2024-09-15 18:45',
        triggerCount: 5
      },
      {
        id: 4,
        name: '生日祝福',
        category: 'user',
        event: 'user_birthday',
        description: '用戶生日當天觸發',
        conditions: [
          { field: 'system.date', operator: 'equals', value: 'user.birthday' },
          { field: 'user.birthday_notifications', operator: 'equals', value: 'enabled' }
        ],
        status: 'active',
        templates: ['生日祝福訊息', '生日專屬優惠'],
        lastTriggered: '2024-09-14 09:00',
        triggerCount: 12
      }
    ];

    const getCategoryBadge = (category) => {
      const categoryConfig = {
        'user': { bg: 'bg-blue-100', text: 'text-blue-700', label: '用戶', icon: '👤' },
        'order': { bg: 'bg-green-100', text: 'text-green-700', label: '訂單', icon: '📦' },
        'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '商品', icon: '🛍️' },
        'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: '系統', icon: '⚙️' }
      };
      const config = categoryConfig[category] || categoryConfig['system'];
      return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
          {config.icon} {config.label}
        </span>
      );
    };

    const getStatusBadge = (status) => {
      return status === 'active' ? (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
          <CheckCircleIcon className="w-3 h-3 mr-1" />啟用
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
          <PauseIcon className="w-3 h-3 mr-1" />停用
        </span>
      );
    };

    const formatCondition = (condition) => {
      const operatorMap = {
        'equals': '等於',
        'not_equals': '不等於',
        'greater_than': '大於',
        'less_than': '小於',
        'contains': '包含',
        'not_contains': '不包含'
      };
      return `${condition.field} ${operatorMap[condition.operator] || condition.operator} ${condition.value}`;
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">觸發器管理</h3>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              新增觸發器
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 font-chinese mb-2">🎯 觸發器說明</h4>
            <p className="text-sm text-blue-700 font-chinese">
              觸發器定義了何時自動發送通知。當系統事件發生且符合設定條件時，相關的通知範本會被自動執行。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{triggers.length}</div>
              <div className="text-sm text-gray-500 font-chinese">總觸發器數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{triggers.filter(t => t.status === 'active').length}</div>
              <div className="text-sm text-gray-500 font-chinese">啟用中</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {triggers.reduce((sum, t) => sum + t.triggerCount, 0)}
              </div>
              <div className="text-sm text-gray-500 font-chinese">今日觸發次數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {triggers.reduce((sum, t) => sum + t.templates.length, 0)}
              </div>
              <div className="text-sm text-gray-500 font-chinese">關聯範本數</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">觸發器名稱</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">分類</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">觸發條件</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">關聯範本</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">觸發次數</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">狀態</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {triggers.map(trigger => (
                  <tr key={trigger.id} className="hover:bg-white/30">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium font-chinese">{trigger.name}</div>
                        <div className="text-sm text-gray-500 font-chinese">{trigger.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getCategoryBadge(trigger.category)}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {trigger.conditions.map((condition, idx) => (
                          <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {formatCondition(condition)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {trigger.templates.map((template, idx) => (
                          <span key={idx} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-chinese mr-1">
                            {template}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-bold">{trigger.triggerCount}</div>
                      <div className="text-xs text-gray-500">{trigger.lastTriggered}</div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(trigger.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="查看詳情">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="編輯">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="手動觸發">
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded" title="刪除">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderChannelsTab = () => {
    const channels = [
      {
        id: 'email_html',
        name: 'Email (HTML)',
        description: 'HTML格式的電子郵件',
        icon: '📧',
        status: 'active',
        config: {
          smtp_host: 'smtp.gmail.com',
          smtp_port: '587',
          smtp_user: 'notification@marelle.com',
          smtp_encryption: 'TLS'
        },
        stats: {
          sent: 1420,
          delivered: 1380,
          opened: 850,
          clicked: 320
        },
        lastTest: '2024-09-16 10:00',
        testStatus: 'success'
      },
      {
        id: 'email_text',
        name: 'Email (純文字)',
        description: '純文字格式的電子郵件',
        icon: '📧',
        status: 'active',
        config: {
          smtp_host: 'smtp.gmail.com',
          smtp_port: '587',
          smtp_user: 'notification@marelle.com',
          smtp_encryption: 'TLS'
        },
        stats: {
          sent: 340,
          delivered: 338,
          opened: 280,
          clicked: 45
        },
        lastTest: '2024-09-16 10:00',
        testStatus: 'success'
      },
      {
        id: 'sms',
        name: 'SMS 簡訊',
        description: '手機簡訊通知',
        icon: '💬',
        status: 'active',
        config: {
          provider: '中華電信',
          api_key: '****-****-****-1234',
          sender_id: 'Marelle'
        },
        stats: {
          sent: 890,
          delivered: 875,
          opened: 875,
          clicked: 0
        },
        lastTest: '2024-09-15 16:30',
        testStatus: 'success'
      },
      {
        id: 'line_text',
        name: 'LINE 文字訊息',
        description: 'LINE官方帳號文字訊息',
        icon: '💬',
        status: 'active',
        config: {
          channel_access_token: '****-****-****-5678',
          channel_secret: '****-****-****-9012'
        },
        stats: {
          sent: 560,
          delivered: 548,
          opened: 520,
          clicked: 180
        },
        lastTest: '2024-09-16 09:15',
        testStatus: 'success'
      },
      {
        id: 'line_flex',
        name: 'LINE Flex 訊息',
        description: 'LINE互動式Flex訊息',
        icon: '💬',
        status: 'active',
        config: {
          channel_access_token: '****-****-****-5678',
          channel_secret: '****-****-****-9012'
        },
        stats: {
          sent: 230,
          delivered: 228,
          opened: 215,
          clicked: 120
        },
        lastTest: '2024-09-16 09:15',
        testStatus: 'success'
      },
      {
        id: 'push_app',
        name: 'App 推播',
        description: '手機應用程式推播通知',
        icon: '📱',
        status: 'inactive',
        config: {
          fcm_server_key: '****-****-****-3456',
          apns_cert: 'production.p12'
        },
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0
        },
        lastTest: '2024-09-10 14:20',
        testStatus: 'failed'
      },
      {
        id: 'push_web',
        name: '網頁推播',
        description: '瀏覽器網頁推播通知',
        icon: '🌐',
        status: 'active',
        config: {
          vapid_public_key: '****-****-****-7890',
          vapid_private_key: '****-****-****-1357'
        },
        stats: {
          sent: 450,
          delivered: 420,
          opened: 350,
          clicked: 150
        },
        lastTest: '2024-09-16 11:45',
        testStatus: 'success'
      }
    ];

    const getStatusBadge = (status) => {
      return status === 'active' ? (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
          <CheckCircleIcon className="w-3 h-3 mr-1" />啟用
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
          <PauseIcon className="w-3 h-3 mr-1" />停用
        </span>
      );
    };

    const getTestStatusBadge = (testStatus) => {
      return testStatus === 'success' ? (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
          <CheckCircleIcon className="w-3 h-3 mr-1" />正常
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
          <XCircleIcon className="w-3 h-3 mr-1" />異常
        </span>
      );
    };

    const calculateDeliveryRate = (delivered, sent) => {
      return sent > 0 ? ((delivered / sent) * 100).toFixed(1) : '0.0';
    };

    const calculateOpenRate = (opened, delivered) => {
      return delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : '0.0';
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">渠道設定管理</h3>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              新增渠道
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 font-chinese mb-2">📡 渠道說明</h4>
            <p className="text-sm text-green-700 font-chinese">
              配置各種通知渠道的連接設定和參數，確保通知能正確發送到用戶。定期測試渠道狀態以維持最佳效果。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{channels.length}</div>
              <div className="text-sm text-gray-500 font-chinese">總渠道數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{channels.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-gray-500 font-chinese">啟用渠道</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {channels.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-chinese">總發送數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {channels.filter(c => c.testStatus === 'success').length}/{channels.length}
              </div>
              <div className="text-sm text-gray-500 font-chinese">正常渠道</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {channels.map(channel => (
            <div key={channel.id} className="glass rounded-2xl overflow-visible">{/* 允許垂直溢出以顯示下拉選單 */}
              <div className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{channel.icon}</span>
                    <div>
                      <h4 className="text-lg font-bold font-chinese">{channel.name}</h4>
                      <p className="text-sm opacity-90 font-chinese">{channel.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(channel.status)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{channel.stats.sent.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 font-chinese">發送數</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculateDeliveryRate(channel.stats.delivered, channel.stats.sent)}%
                    </div>
                    <div className="text-sm text-gray-500 font-chinese">送達率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculateOpenRate(channel.stats.opened, channel.stats.delivered)}%
                    </div>
                    <div className="text-sm text-gray-500 font-chinese">開啟率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{channel.stats.clicked}</div>
                    <div className="text-sm text-gray-500 font-chinese">點擊數</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 font-chinese">連接狀態</span>
                    {getTestStatusBadge(channel.testStatus)}
                  </div>
                  <div className="text-xs text-gray-500 font-chinese mb-4">
                    最後測試：{channel.lastTest}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 btn btn-secondary text-xs py-2">
                      <CogIcon className="w-4 h-4 mr-1" />
                      設定
                    </button>
                    <button className="flex-1 btn btn-primary text-xs py-2">
                      <PlayIcon className="w-4 h-4 mr-1" />
                      測試
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    const notificationHistory = [
      {
        id: 'N001',
        templateName: '訂單確認通知',
        recipient: 'user@example.com',
        channel: 'email_html',
        status: 'delivered',
        sentAt: '2024-09-16 14:15:30',
        deliveredAt: '2024-09-16 14:15:45',
        openedAt: '2024-09-16 14:20:12',
        clickedAt: '2024-09-16 14:22:08',
        subject: '您的訂單 #ORD-20240916-001 已確認',
        errorMessage: null
      },
      {
        id: 'N002',
        templateName: '會員生日祝福',
        recipient: '0912345678',
        channel: 'sms',
        status: 'delivered',
        sentAt: '2024-09-16 09:00:00',
        deliveredAt: '2024-09-16 09:00:15',
        openedAt: '2024-09-16 09:00:15',
        clickedAt: null,
        subject: '生日快樂！專屬優惠等您領取',
        errorMessage: null
      },
      {
        id: 'N003',
        templateName: '商品缺貨提醒',
        recipient: 'admin@marelle.com',
        channel: 'email_text',
        status: 'failed',
        sentAt: '2024-09-16 08:30:00',
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        subject: '商品庫存警告：精緻杏仁蛋糕',
        errorMessage: 'SMTP connection timeout'
      },
      {
        id: 'N004',
        templateName: '促銷活動通知',
        recipient: 'LINE-USER-123',
        channel: 'line_flex',
        status: 'delivered',
        sentAt: '2024-09-15 16:00:00',
        deliveredAt: '2024-09-15 16:00:05',
        openedAt: '2024-09-15 16:05:20',
        clickedAt: '2024-09-15 16:06:15',
        subject: '限時優惠：全館商品9折起',
        errorMessage: null
      },
      {
        id: 'N005',
        templateName: '密碼重設通知',
        recipient: 'member@example.com',
        channel: 'email_html',
        status: 'pending',
        sentAt: '2024-09-16 14:30:00',
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        subject: '密碼重設確認',
        errorMessage: null
      }
    ];

    const getStatusBadge = (status) => {
      const statusConfig = {
        'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '發送中', icon: ClockIcon },
        'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: '已送達', icon: CheckCircleIcon },
        'failed': { bg: 'bg-red-100', text: 'text-red-700', label: '失敗', icon: XCircleIcon },
        'bounced': { bg: 'bg-orange-100', text: 'text-orange-700', label: '退回', icon: XCircleIcon }
      };
      const config = statusConfig[status] || statusConfig['pending'];
      const Icon = config.icon;
      return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </span>
      );
    };

    const getChannelBadge = (channel) => {
      const channelConfig = {
        'email_html': { icon: '📧', name: 'Email' },
        'email_text': { icon: '📧', name: 'Email' },
        'sms': { icon: '💬', name: 'SMS' },
        'line_text': { icon: '💬', name: 'LINE' },
        'line_flex': { icon: '💬', name: 'LINE' },
        'push_app': { icon: '📱', name: 'App推播' },
        'push_web': { icon: '🌐', name: '網頁推播' }
      };
      const config = channelConfig[channel] || { icon: '📤', name: '未知' };
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded font-chinese">
          {config.icon} {config.name}
        </span>
      );
    };

    const filteredHistory = notificationHistory.filter(item => {
      const matchChannel = historyChannel === 'all' || item.channel === historyChannel;
      const matchStatus = historyStatus === 'all' || item.status === historyStatus;
      return matchChannel && matchStatus;
    });

    const historyStats = {
      total: notificationHistory.length,
      delivered: notificationHistory.filter(n => n.status === 'delivered').length,
      failed: notificationHistory.filter(n => n.status === 'failed').length,
      pending: notificationHistory.filter(n => n.status === 'pending').length,
      opened: notificationHistory.filter(n => n.openedAt).length,
      clicked: notificationHistory.filter(n => n.clickedAt).length
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">通知歷史記錄</h3>
            <div className="flex space-x-3">
              <CustomSelect
                value={historyTimeRange}
                onChange={setHistoryTimeRange}
                options={[
                  { value: '1d', label: '今天', icon: '📅' },
                  { value: '7d', label: '7天', icon: '📊' },
                  { value: '30d', label: '30天', icon: '📈' },
                  { value: '90d', label: '90天', icon: '📉' }
                ]}
                className="w-24"
              />
              <CustomSelect
                value={historyChannel}
                onChange={setHistoryChannel}
                options={[
                  { value: 'all', label: '全部渠道' },
                  { value: 'email_html', label: 'Email (HTML)', icon: '📧' },
                  { value: 'email_text', label: 'Email (文字)', icon: '📧' },
                  { value: 'sms', label: 'SMS', icon: '💬' },
                  { value: 'line_text', label: 'LINE (文字)', icon: '💬' },
                  { value: 'line_flex', label: 'LINE (Flex)', icon: '💬' },
                  { value: 'push_web', label: '網頁推播', icon: '🌐' }
                ]}
                className="w-48"
              />
              <CustomSelect
                value={historyStatus}
                onChange={setHistoryStatus}
                options={[
                  { value: 'all', label: '全部狀態' },
                  { value: 'delivered', label: '已送達', icon: '✅' },
                  { value: 'failed', label: '失敗', icon: '❌' },
                  { value: 'pending', label: '發送中', icon: '⏳' }
                ]}
                className="w-32"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{historyStats.total}</div>
              <div className="text-sm text-gray-500 font-chinese">總發送</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{historyStats.delivered}</div>
              <div className="text-sm text-gray-500 font-chinese">已送達</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600">{historyStats.failed}</div>
              <div className="text-sm text-gray-500 font-chinese">失敗</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">{historyStats.pending}</div>
              <div className="text-sm text-gray-500 font-chinese">發送中</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{historyStats.opened}</div>
              <div className="text-sm text-gray-500 font-chinese">已開啟</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{historyStats.clicked}</div>
              <div className="text-sm text-gray-500 font-chinese">已點擊</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">通知ID</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">範本</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">收件人</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">渠道</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">狀態</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">發送時間</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">互動</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map(item => (
                  <tr key={item.id} className="hover:bg-white/30">
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {item.id}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium font-chinese">{item.templateName}</div>
                        <div className="text-sm text-gray-500 font-chinese truncate max-w-xs">
                          {item.subject}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-mono">{item.recipient}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getChannelBadge(item.channel)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(item.status)}
                      {item.errorMessage && (
                        <div className="text-xs text-red-500 mt-1 font-chinese">
                          {item.errorMessage}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{item.sentAt}</div>
                      {item.deliveredAt && (
                        <div className="text-xs text-gray-500">送達: {item.deliveredAt}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {item.openedAt && (
                          <div className="text-xs text-blue-600">開啟: {item.openedAt}</div>
                        )}
                        {item.clickedAt && (
                          <div className="text-xs text-purple-600">點擊: {item.clickedAt}</div>
                        )}
                        {!item.openedAt && !item.clickedAt && item.status === 'delivered' && (
                          <div className="text-xs text-gray-400">無互動</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="查看詳情">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {item.status === 'failed' && (
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="重新發送">
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    const analyticsData = {
      overview: {
        totalSent: 3890,
        deliveryRate: 97.2,
        openRate: 68.5,
        clickRate: 12.8,
        unsubscribeRate: 0.3
      },
      channelPerformance: [
        { channel: 'email_html', name: 'Email (HTML)', sent: 1420, delivered: 1380, opened: 850, clicked: 320, deliveryRate: 97.2, openRate: 61.6, clickRate: 23.2 },
        { channel: 'sms', name: 'SMS', sent: 890, delivered: 875, opened: 875, clicked: 0, deliveryRate: 98.3, openRate: 100, clickRate: 0 },
        { channel: 'line_flex', name: 'LINE Flex', sent: 560, delivered: 548, opened: 520, clicked: 180, deliveryRate: 97.9, openRate: 94.9, clickRate: 34.6 },
        { channel: 'push_web', name: '網頁推播', sent: 450, delivered: 420, opened: 350, clicked: 150, deliveryRate: 93.3, openRate: 83.3, clickRate: 42.9 },
        { channel: 'email_text', name: 'Email (文字)', sent: 340, delivered: 338, opened: 280, clicked: 45, deliveryRate: 99.4, openRate: 82.8, clickRate: 16.1 },
        { channel: 'line_text', name: 'LINE 文字', sent: 230, delivered: 228, opened: 215, clicked: 120, deliveryRate: 99.1, openRate: 94.3, clickRate: 55.8 }
      ],
      templatePerformance: [
        { template: '訂單確認通知', sent: 890, delivered: 875, opened: 680, clicked: 120, deliveryRate: 98.3, openRate: 77.7, clickRate: 17.6 },
        { template: '會員生日祝福', sent: 560, delivered: 548, opened: 520, clicked: 180, deliveryRate: 97.9, openRate: 94.9, clickRate: 34.6 },
        { template: '商品缺貨提醒', sent: 450, delivered: 445, opened: 398, clicked: 45, deliveryRate: 98.9, openRate: 89.4, clickRate: 11.3 },
        { template: '促銷活動通知', sent: 890, delivered: 865, opened: 420, clicked: 350, deliveryRate: 97.2, openRate: 48.6, clickRate: 83.3 },
        { template: '密碼重設通知', sent: 340, delivered: 338, opened: 310, clicked: 28, deliveryRate: 99.4, openRate: 91.7, clickRate: 9.0 }
      ],
      timeSeriesData: [
        { date: '2024-09-10', sent: 450, delivered: 438, opened: 320, clicked: 65 },
        { date: '2024-09-11', sent: 520, delivered: 508, opened: 380, clicked: 78 },
        { date: '2024-09-12', sent: 480, delivered: 465, opened: 340, clicked: 72 },
        { date: '2024-09-13', sent: 610, delivered: 595, opened: 450, clicked: 89 },
        { date: '2024-09-14', sent: 580, delivered: 568, opened: 420, clicked: 85 },
        { date: '2024-09-15', sent: 640, delivered: 622, opened: 480, clicked: 95 },
        { date: '2024-09-16', sent: 610, delivered: 594, opened: 440, clicked: 88 }
      ]
    };

    const getPerformanceColor = (rate, type) => {
      if (type === 'delivery') {
        return rate >= 95 ? 'text-green-600' : rate >= 85 ? 'text-yellow-600' : 'text-red-600';
      } else if (type === 'open') {
        return rate >= 25 ? 'text-green-600' : rate >= 15 ? 'text-yellow-600' : 'text-red-600';
      } else if (type === 'click') {
        return rate >= 5 ? 'text-green-600' : rate >= 2 ? 'text-yellow-600' : 'text-red-600';
      }
      return 'text-gray-600';
    };

    const getChannelIcon = (channel) => {
      const channelConfig = {
        'email_html': '📧',
        'email_text': '📧',
        'sms': '💬',
        'line_text': '💬',
        'line_flex': '💬',
        'push_web': '🌐'
      };
      return channelConfig[channel] || '📤';
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">效果分析</h3>
            <CustomSelect
              value={analyticsTimeRange}
              onChange={setAnalyticsTimeRange}
              options={[
                { value: '1d', label: '今天', icon: '📅' },
                { value: '7d', label: '7天', icon: '📊' },
                { value: '30d', label: '30天', icon: '📈' },
                { value: '90d', label: '90天', icon: '📉' }
              ]}
              className="w-24"
            />
          </div>

          {/* 總覽指標 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-500 font-chinese">總發送數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.deliveryRate, 'delivery')}`}>
                {analyticsData.overview.deliveryRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">送達率</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.openRate, 'open')}`}>
                {analyticsData.overview.openRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">開啟率</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.clickRate, 'click')}`}>
                {analyticsData.overview.clickRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">點擊率</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-orange-600">{analyticsData.overview.unsubscribeRate}%</div>
              <div className="text-sm text-gray-500 font-chinese">取消訂閱率</div>
            </div>
          </div>
        </div>

        {/* 渠道效果分析 */}
        <div className="glass rounded-2xl overflow-visible">
          <div className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white px-6 py-4">
            <h4 className="text-lg font-bold font-chinese">渠道效果分析</h4>
          </div>
          <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">渠道</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">發送數</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">送達率</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">開啟率</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">點擊率</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">效果評級</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.channelPerformance.map(channel => {
                  const overallScore = (channel.deliveryRate * 0.3 + channel.openRate * 0.4 + channel.clickRate * 0.3);
                  const grade = overallScore >= 80 ? '優秀' : overallScore >= 60 ? '良好' : overallScore >= 40 ? '普通' : '需改善';
                  const gradeColor = overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-blue-600' : overallScore >= 40 ? 'text-yellow-600' : 'text-red-600';
                  
                  return (
                    <tr key={channel.channel} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getChannelIcon(channel.channel)}</span>
                          <span className="font-medium font-chinese">{channel.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{channel.sent.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold ${getPerformanceColor(channel.deliveryRate, 'delivery')}`}>
                          {channel.deliveryRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold ${getPerformanceColor(channel.openRate, 'open')}`}>
                          {channel.openRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold ${getPerformanceColor(channel.clickRate, 'click')}`}>
                          {channel.clickRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold font-chinese ${gradeColor}`}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 範本效果分析 */}
        <div className="glass rounded-2xl overflow-visible">
          <div className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white px-6 py-4">
            <h4 className="text-lg font-bold font-chinese">範本效果分析</h4>
          </div>
          <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">範本名稱</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">發送數</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">送達率</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">開啟率</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">點擊率</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">建議</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.templatePerformance.map(template => {
                  let suggestion = '';
                  if (template.deliveryRate < 95) suggestion = '優化發送設定';
                  else if (template.openRate < 20) suggestion = '改善主旨行';
                  else if (template.clickRate < 5) suggestion = '優化內容與CTA';
                  else suggestion = '表現良好';
                  
                  return (
                    <tr key={template.template} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium font-chinese">{template.template}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{template.sent.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold ${getPerformanceColor(template.deliveryRate, 'delivery')}`}>
                          {template.deliveryRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold ${getPerformanceColor(template.openRate, 'open')}`}>
                          {template.openRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold ${getPerformanceColor(template.clickRate, 'click')}`}>
                          {template.clickRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-600 font-chinese">{suggestion}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 趨勢圖表（簡化顯示） */}
        <div className="glass rounded-2xl p-6">
          <h4 className="text-lg font-bold font-chinese mb-4">發送趨勢</h4>
          <div className="grid grid-cols-7 gap-2">
            {analyticsData.timeSeriesData.map(day => (
              <div key={day.date} className="text-center">
                <div className="text-xs text-gray-500 font-chinese mb-2">
                  {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="text-sm font-bold text-blue-800">{day.sent}</div>
                  <div className="text-xs text-blue-600 font-chinese">發送</div>
                </div>
                <div className="bg-green-100 rounded-lg p-2 mt-1">
                  <div className="text-xs font-bold text-green-800">{day.opened}</div>
                  <div className="text-xs text-green-600 font-chinese">開啟</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BellIcon className="w-8 h-8 text-amber-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">通知管理系統</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTestPanel(true)}
            className="btn btn-secondary flex items-center"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            測試通知
          </button>
          <button className="btn btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            新增範本
          </button>
        </div>
      </div>

      {/* 分頁導航 */}
      <div className="mb-6 flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium font-chinese whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#cc824d] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 統計摘要 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{mockTemplateData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">總範本數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{mockTemplateData.filter(t => t.status === 'active').length}</div>
          <div className="text-sm text-gray-500 font-chinese">啟用範本</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockTemplateData.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總發送次數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(mockTemplateData.reduce((sum, t) => sum + t.successRate, 0) / mockTemplateData.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 font-chinese">平均成功率</div>
        </div>
      </div>

      {/* 分頁內容 */}
      {renderTabContent()}

      {/* 通知測試面板 */}
      <NotificationTestPanel 
        isOpen={showTestPanel}
        onClose={() => setShowTestPanel(false)}
      />
    </div>
    </div>
  );
};

export default NotificationManagement;