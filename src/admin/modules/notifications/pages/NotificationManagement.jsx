import React, { useState, useMemo } from 'react';
import StandardTable from "@shared/components/StandardTable";
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
import CustomSelect from "@shared/components/CustomSelect";
import SearchableSelect from "@shared/components/SearchableSelect";

// 模擬?�知範本?��?
const mockTemplateData = [
  {
    id: 1,
    name: '訂單確�??�知',
    description: '?�戶下單後自?�發?��?確�??�知',
    category: 'order',
    subcategory: 'order_created',
    trigger: '訂單建�?',
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
    name: '?�員?�日祝�?',
    description: '?�員?�日?�天?�送�?祝�?訊息',
    category: 'user',
    subcategory: 'user_birthday',
    trigger: '?�員?�日',
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
    name: '?��?缺貨?��?',
    description: '?��?庫�?不足?�發?�給管�??��??��?',
    category: 'product',
    subcategory: 'product_low_stock',
    trigger: '庫�?低於安全水�?',
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
    name: '促銷活�??�知',
    description: '?��??�活?��?始�??�送給?�員',
    category: 'marketing',
    subcategory: 'campaign_started',
    trigger: '活�??��?',
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
  const [selectedCategory, setSelectedCategory] = useState('?�部');
  const [selectedStatus, setSelectedStatus] = useState('?�部');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('templates');
  const [showTestPanel, setShowTestPanel] = useState(false);
  
  // 歷史記�?篩選?�??
  const [historyTimeRange, setHistoryTimeRange] = useState('7d');
  const [historyChannel, setHistoryChannel] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');
  
  // ?��??�面?�??
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d');

  // ?��??�觸?��?件�?輔助?�數
  const formatCondition = (condition) => {
    const operatorMap = {
      'equals': '等於',
      'not_equals': '不�???,
      'greater_than': '大於',
      'less_than': '小於',
      'contains': '?�含',
      'not_contains': '不�???
    };
    return `${condition.field} ${operatorMap[condition.operator] || condition.operator} ${condition.value}`;
  };

  // ?��?渠�??��??��??�函??
  const getChannelIcon = (channel) => {
    const channelConfig = {
      'email_html': '?��',
      'email_text': '?��',
      'sms': '?��',
      'line_text': '?��',
      'line_flex': '?��',
      'push_web': '??'
    };
    return channelConfig[channel] || '?��';
  };

  // 篩選?��?序數??
  const filteredData = useMemo(() => {
    let filtered = mockTemplateData.filter(template => {
      const matchCategory = selectedCategory === '?�部' || template.category === selectedCategory;
      const matchStatus = selectedStatus === '?�部' || template.status === selectedStatus;
      
      return matchCategory && matchStatus;
    });

    // ?��?
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
      'order': { bg: 'bg-blue-100', text: 'text-blue-700', label: '訂單', icon: '?��' },
      'user': { bg: 'bg-green-100', text: 'text-green-700', label: '?�戶', icon: '?��' },
      'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '?��?', icon: '??�? },
      'marketing': { bg: 'bg-pink-100', text: 'text-pink-700', label: '行銷', icon: '?��' },
      'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: '系統', icon: '?��?' }
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
      'urgent': { bg: 'bg-red-100', text: 'text-red-700', label: '緊�? },
      'high': { bg: 'bg-orange-100', text: 'text-orange-700', label: '�? },
      'normal': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '?��? },
      'low': { bg: 'bg-gray-100', text: 'text-gray-700', label: '�? }
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
        <CheckCircleIcon className="w-3 h-3 mr-1" />?�用
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
        <PauseIcon className="w-3 h-3 mr-1" />?�用
      </span>
    );
  };

  const getChannelIcons = (channels) => {
    const channelConfig = {
      'email_html': { icon: '?��', name: 'Email' },
      'email_text': { icon: '?��', name: 'Email' },
      'sms': { icon: '?��', name: 'SMS' },
      'line_text': { icon: '?��', name: 'LINE' },
      'line_flex': { icon: '?��', name: 'LINE' },
      'push_app': { icon: '?��', name: 'App?�播' },
      'push_web': { icon: '??', name: '網�??�播' }
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
    { id: 'templates', name: '範本管�?', icon: DocumentTextIcon },
    { id: 'variables', name: '變數管�?', icon: CogIcon },
    { id: 'triggers', name: '觸發??, icon: PlayIcon },
    { id: 'channels', name: '渠�?設�?', icon: InboxIcon },
    { id: 'history', name: '?�知歷史', icon: ClockIcon },
    { id: 'analytics', name: '?��??��?', icon: ChartBarIcon }
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

  // 定義?�知範本表格??
  const templateColumns = [
    {
      key: 'name',
      label: '範本?�稱',
      sortable: true,
      render: (_, template) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{template.name}</div>
          <div className="text-xs text-gray-500">{template.subject}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: '?��?',
      sortable: true,
      render: (_, template) => getCategoryBadge(template.category)
    },
    {
      key: 'trigger',
      label: '觸發條件',
      sortable: false,
      render: (_, template) => (
        <div className="text-sm text-gray-700">
          {template.trigger}
        </div>
      )
    },
    {
      key: 'channels',
      label: '?�知渠�?',
      sortable: false,
      render: (_, template) => (
        <div className="flex flex-wrap gap-1">
          {getChannelIcons(template.channels)}
        </div>
      )
    },
    {
      key: 'priority',
      label: '?��?�?,
      sortable: true,
      render: (_, template) => getPriorityBadge(template.priority)
    },
    {
      key: 'usageCount',
      label: '使用次數',
      sortable: true,
      render: (_, template) => (
        <div className="text-sm text-gray-900">
          {template.usageCount?.toLocaleString() || 0}
        </div>
      )
    },
    {
      key: 'successRate',
      label: '?��???,
      sortable: true,
      render: (_, template) => (
        <div className="text-sm text-gray-900">
          {(template.successRate * 100).toFixed(1)}%
        </div>
      )
    },
    {
      key: 'status',
      label: '?�??,
      sortable: true,
      render: (_, template) => getStatusBadge(template.status)
    },
    {
      key: 'actions',
      label: '?��?',
      sortable: false,
      render: (_, template) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <EyeIcon className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-900">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTestingTemplate(template)}
            className="text-purple-600 hover:text-purple-900"
          >
            <PlayIcon className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 觸發?�管?��?位�?�?
  const triggerColumns = [
    {
      key: 'name',
      label: '觸發?��?�?,
      sortable: true,
      render: (_, trigger) => (
        <div>
          <div className="font-medium text-gray-900">{trigger.name}</div>
          <div className="text-sm text-gray-500">{trigger.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: '?��?',
      sortable: true,
      render: (_, trigger) => getCategoryBadge(trigger.category)
    },
    {
      key: 'conditions',
      label: '觸發條件',
      sortable: false,
      render: (_, trigger) => (
        <div className="space-y-1">
          {trigger.conditions.map((condition, idx) => (
            <div key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {formatCondition(condition)}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'templates',
      label: '?�聯範本',
      sortable: false,
      render: (_, trigger) => (
        <div className="space-y-1">
          {trigger.templates.map((template, idx) => (
            <span key={idx} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mr-1">
              {template}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'triggerCount',
      label: '觸發次數',
      sortable: true,
      render: (_, trigger) => (
        <div className="text-center">
          <div className="font-bold text-gray-900">{trigger.triggerCount}</div>
          <div className="text-xs text-gray-500">{trigger.lastTriggered}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: '?�??,
      sortable: true,
      render: (_, trigger) => getStatusBadge(trigger.status)
    },
    {
      key: 'actions',
      label: '?��?',
      sortable: false,
      render: (_, trigger) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <EyeIcon className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-900">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="text-purple-600 hover:text-purple-900">
            <PlayIcon className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ?�知歷史欄�??�置
  const historyColumns = [
    {
      key: 'id',
      label: '?�知ID',
      sortable: true,
      render: (_, item) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
          {item.id}
        </code>
      )
    },
    {
      key: 'templateName',
      label: '範本',
      sortable: true,
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.templateName}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {item.subject}
          </div>
        </div>
      )
    },
    {
      key: 'recipient',
      label: '?�件�?,
      sortable: false,
      render: (_, item) => (
        <div className="text-sm font-mono text-gray-900">{item.recipient}</div>
      )
    },
    {
      key: 'channel',
      label: '渠�?',
      sortable: true,
      render: (_, item) => {
        const channelConfig = {
          'email_html': { icon: '?��', name: 'Email' },
          'email_text': { icon: '?��', name: 'Email' },
          'sms': { icon: '?��', name: 'SMS' },
          'line_text': { icon: '?��', name: 'LINE' },
          'line_flex': { icon: '?��', name: 'LINE' },
          'push_app': { icon: '?��', name: 'App?�播' },
          'push_web': { icon: '??', name: '網�??�播' }
        };
        const config = channelConfig[item.channel] || { icon: '?��', name: '?�知' };
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            {config.icon} {config.name}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: '?�??,
      sortable: true,
      render: (_, item) => {
        const statusConfig = {
          'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '?�送中' },
          'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: '已送�?' },
          'failed': { bg: 'bg-red-100', text: 'text-red-700', label: '失�?' },
          'bounced': { bg: 'bg-orange-100', text: 'text-orange-700', label: '?�?? }
        };
        const config = statusConfig[item.status] || statusConfig['pending'];
        return (
          <div>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            {item.errorMessage && (
              <div className="text-xs text-red-500 mt-1">
                {item.errorMessage}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'sentAt',
      label: '?�送�???,
      sortable: true,
      render: (_, item) => (
        <div>
          <div className="text-sm text-gray-900">{item.sentAt}</div>
          {item.deliveredAt && (
            <div className="text-xs text-gray-500">?��?: {item.deliveredAt}</div>
          )}
        </div>
      )
    },
    {
      key: 'interaction',
      label: '互�?',
      sortable: false,
      render: (_, item) => (
        <div className="space-y-1">
          {item.openedAt && (
            <div className="text-xs text-blue-600">?��?: {item.openedAt}</div>
          )}
          {item.clickedAt && (
            <div className="text-xs text-purple-600">點�?: {item.clickedAt}</div>
          )}
          {!item.openedAt && !item.clickedAt && (
            <div className="text-xs text-gray-400">?��???/div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: '?��?',
      sortable: false,
      render: (_, item) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 渠�??��??��?欄�??�置
  const channelAnalyticsColumns = [
    {
      key: 'channel',
      label: '渠�?',
      sortable: true,
      render: (_, channel) => (
        <div className="flex items-center">
          <span className="text-lg mr-2">{getChannelIcon(channel.channel)}</span>
          <span className="font-medium text-gray-900">{channel.name}</span>
        </div>
      )
    },
    {
      key: 'sent',
      label: '?�送數',
      sortable: true,
      render: (_, channel) => (
        <div className="text-center text-gray-900">{channel.sent.toLocaleString()}</div>
      )
    },
    {
      key: 'deliveryRate',
      label: '?��???,
      sortable: true,
      render: (_, channel) => (
        <div className="text-center">
          <span className={`font-bold ${getPerformanceColor(channel.deliveryRate, 'delivery')}`}>
            {channel.deliveryRate}%
          </span>
        </div>
      )
    },
    {
      key: 'openRate',
      label: '?��???,
      sortable: true,
      render: (_, channel) => (
        <div className="text-center">
          <span className={`font-bold ${getPerformanceColor(channel.openRate, 'open')}`}>
            {channel.openRate}%
          </span>
        </div>
      )
    },
    {
      key: 'clickRate',
      label: '點�???,
      sortable: true,
      render: (_, channel) => (
        <div className="text-center">
          <span className={`font-bold ${getPerformanceColor(channel.clickRate, 'click')}`}>
            {channel.clickRate}%
          </span>
        </div>
      )
    },
    {
      key: 'performance',
      label: '?��?評�?',
      sortable: true,
      render: (_, channel) => {
        const overallScore = (channel.deliveryRate * 0.3 + channel.openRate * 0.4 + channel.clickRate * 0.3);
        const grade = overallScore >= 80 ? '?��?' : overallScore >= 60 ? '?�好' : overallScore >= 40 ? '?��? : '?�?��?';
        const gradeColor = overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-blue-600' : overallScore >= 40 ? 'text-yellow-600' : 'text-red-600';
        return (
          <div className="text-center">
            <span className={`font-bold ${gradeColor}`}>{grade}</span>
          </div>
        );
      }
    }
  ];

  // 範本?��??��?欄�??�置
  const templateAnalyticsColumns = [
    {
      key: 'template',
      label: '範本?�稱',
      sortable: true,
      render: (_, template) => (
        <span className="font-medium text-gray-900">{template.template}</span>
      )
    },
    {
      key: 'sent',
      label: '?�送數',
      sortable: true,
      render: (_, template) => (
        <div className="text-center text-gray-900">{template.sent.toLocaleString()}</div>
      )
    },
    {
      key: 'deliveryRate',
      label: '?��???,
      sortable: true,
      render: (_, template) => (
        <div className="text-center">
          <span className={`font-bold ${getPerformanceColor(template.deliveryRate, 'delivery')}`}>
            {template.deliveryRate}%
          </span>
        </div>
      )
    },
    {
      key: 'openRate',
      label: '?��???,
      sortable: true,
      render: (_, template) => (
        <div className="text-center">
          <span className={`font-bold ${getPerformanceColor(template.openRate, 'open')}`}>
            {template.openRate}%
          </span>
        </div>
      )
    },
    {
      key: 'clickRate',
      label: '點�???,
      sortable: true,
      render: (_, template) => (
        <div className="text-center">
          <span className={`font-bold ${getPerformanceColor(template.clickRate, 'click')}`}>
            {template.clickRate}%
          </span>
        </div>
      )
    },
    {
      key: 'suggestion',
      label: '建議',
      sortable: false,
      render: (_, template) => {
        let suggestion = '';
        if (template.deliveryRate < 95) suggestion = '?��??�送設�?;
        else if (template.openRate < 20) suggestion = '?��?主旨�?;
        else if (template.clickRate < 5) suggestion = '?��??�容?�CTA';
        else suggestion = '表現?�好';
        
        return (
          <div className="text-center">
            <span className="text-sm text-gray-600">{suggestion}</span>
          </div>
        );
      }
    }
  ];

  const renderTemplatesTab = () => (
    <>
      {/* 篩選?�??*/}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?�部', label: '?�部?��?' },
                { value: 'order', label: '訂單' },
                { value: 'user', label: '?�戶' },
                { value: 'product', label: '?��?' },
                { value: 'marketing', label: '行銷' },
                { value: 'system', label: '系統' }
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="?��??��?"
              className="w-48"
            />
          </div>

          <div className="flex items-center space-x-2">
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: '?�部', label: '?�部?�?? },
                { value: 'active', label: '?�用', icon: '??, description: '�?��使用?��??? },
                { value: 'inactive', label: '?�用', icon: '?��?', description: '已�??��?範本' }
              ]}
              className="w-32"
              placeholder="?��??�??
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            ??{filteredData.length} ?��???
          </div>
        </div>
      </div>

      {/* 主�?範本表格 */}
      <StandardTable
        data={filteredData}
        columns={templateColumns}
        title="?�知範本"
        emptyMessage="沒�??�到?�知範本"
        emptyDescription="請調?�篩?��?件�?建�??��??�知範本"
        emptyIcon={BellIcon}
      />
    </>
  );

  const renderVariablesTab = () => {
    const variableCategories = [
      {
        id: 'user',
        name: '?�戶?��?',
        icon: '?��',
        color: 'blue',
        variables: [
          { key: 'user.name', name: '?�戶姓�?', description: '?�戶?��?實�???, example: '張�??? },
          { key: 'user.email', name: '?��??�件', description: '?�戶?�電子郵件地?�', example: 'user@example.com' },
          { key: 'user.phone', name: '?��??�碼', description: '?�戶?��?機�?�?, example: '0912345678' },
          { key: 'user.birthday', name: '?�日', description: '?�戶?��??�日??, example: '1990-01-01' },
          { key: 'user.level', name: '?�員等�?', description: '?�戶?��??��?�?, example: 'VIP' },
          { key: 'user.points', name: '積�?餘�?', description: '?�戶?��??��??�數??, example: '1250' }
        ]
      },
      {
        id: 'order',
        name: '訂單?��?',
        icon: '?��',
        color: 'green',
        variables: [
          { key: 'order.id', name: '訂單編�?', description: '訂單?�唯一識別�?, example: 'ORD-20240916-001' },
          { key: 'order.total', name: '訂單總�?', description: '訂單?�總?��?', example: 'NT$ 1,580' },
          { key: 'order.status', name: '訂單?�??, description: '訂單?��??��??��???, example: '已出�? },
          { key: 'order.date', name: '下單?��?', description: '訂單建�??�日?��???, example: '2024-09-16 14:30' },
          { key: 'order.items', name: '?��??�表', description: '訂單中�??��?清單', example: '?��?A x2, ?��?B x1' },
          { key: 'order.shipping', name: '?�送方�?, description: '?��??��??�方�?, example: '宅�??��?' }
        ]
      },
      {
        id: 'product',
        name: '?��??��?',
        icon: '??�?,
        color: 'purple',
        variables: [
          { key: 'product.name', name: '?��??�稱', description: '?��??��??��?�?, example: '精緻?��??��?' },
          { key: 'product.price', name: '?��??�格', description: '?��??�售??, example: 'NT$ 480' },
          { key: 'product.sku', name: '?��?編�?', description: '?��??�SKU編�?', example: 'CAKE-ALM-001' },
          { key: 'product.category', name: '?��??��?', description: '?��??�屬�?�?, example: '?��?�? },
          { key: 'product.stock', name: '庫�??��?', description: '?��??��?庫�?', example: '25' },
          { key: 'product.discount', name: '?�扣資�?', description: '?��??��???��??, example: '9?�優?? }
        ]
      },
      {
        id: 'system',
        name: '系統?��?',
        icon: '?��?',
        color: 'gray',
        variables: [
          { key: 'system.site_name', name: '網�??�稱', description: '網�??��?�?, example: 'Marelle' },
          { key: 'system.contact_email', name: '客�?信箱', description: '客�??�絡信箱', example: 'support@marelle.com' },
          { key: 'system.current_date', name: '?��??��?', description: '系統?��??��?', example: '2024-09-16' },
          { key: 'system.current_time', name: '?��??��?', description: '系統?��??��?', example: '14:30:25' },
          { key: 'system.domain', name: '網�??��?', description: '網�??��??�地?�', example: 'www.marelle.com' },
          { key: 'system.version', name: '系統?�本', description: '?��?系統?�本??, example: 'v2.1.0' }
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
            <h3 className="text-lg font-bold font-chinese">變數管�?</h3>
            <div className="text-sm text-gray-500 font-chinese">
              ??{variableCategories.reduce((sum, cat) => sum + cat.variables.length, 0)} ?��???
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 font-chinese mb-2">?�� 使用說�?</h4>
            <p className="text-sm text-amber-700 font-chinese">
              ?�通知範本中使??<code className="bg-amber-100 px-1 rounded">{'{{變數?�稱}}'}</code> ?��?來�??��??�內容�?
              例�?�?code className="bg-amber-100 px-1 rounded">{'{{user.name}}'}</code> ?�被?��??�實?��??�戶姓�???
            </p>
          </div>
        </div>

        {variableCategories.map(category => {
          const colors = getColorClasses(category.color);
          return (
            <div key={category.id} className="glass rounded-2xl overflow-visible">{/* ?�許?�直溢出以顯示�??�選??*/}
              <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h4 className={`text-lg font-bold font-chinese ${colors.text}`}>
                    {category.name}
                  </h4>
                  <span className={`ml-auto px-3 py-1 ${colors.badge} ${colors.text} text-sm font-medium rounded-full font-chinese`}>
                    {category.variables.length} ?��???
                  </span>
                </div>
              </div>
              
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          變數?�稱
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          ?�述
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          範�???
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          ?��?
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
                              ?? 複製
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
        name: '?�戶註�?',
        category: 'user',
        event: 'user_registered',
        description: '?�用?��??�註?��?觸發',
        conditions: [
          { field: 'user.email_verified', operator: 'equals', value: 'true' }
        ],
        status: 'active',
        templates: ['歡�?註�??�知', '?��??��?'],
        lastTriggered: '2024-09-16 10:30',
        triggerCount: 23
      },
      {
        id: 2,
        name: '訂單建�?',
        category: 'order',
        event: 'order_created',
        description: '?�戶?��?下單?�觸??,
        conditions: [
          { field: 'order.status', operator: 'equals', value: 'confirmed' },
          { field: 'order.payment_status', operator: 'equals', value: 'paid' }
        ],
        status: 'active',
        templates: ['訂單確�??�知'],
        lastTriggered: '2024-09-16 14:15',
        triggerCount: 89
      },
      {
        id: 3,
        name: '庫�?警�?',
        category: 'product',
        event: 'stock_low',
        description: '?��?庫�?低於安全水�??�觸??,
        conditions: [
          { field: 'product.stock', operator: 'less_than', value: '10' }
        ],
        status: 'active',
        templates: ['庫�?不足?��?'],
        lastTriggered: '2024-09-15 18:45',
        triggerCount: 5
      },
      {
        id: 4,
        name: '?�日祝�?',
        category: 'user',
        event: 'user_birthday',
        description: '?�戶?�日?�天觸發',
        conditions: [
          { field: 'system.date', operator: 'equals', value: 'user.birthday' },
          { field: 'user.birthday_notifications', operator: 'equals', value: 'enabled' }
        ],
        status: 'active',
        templates: ['?�日祝�?訊息', '?�日專屬?��?'],
        lastTriggered: '2024-09-14 09:00',
        triggerCount: 12
      }
    ];

    const getCategoryBadge = (category) => {
      const categoryConfig = {
        'user': { bg: 'bg-blue-100', text: 'text-blue-700', label: '?�戶', icon: '?��' },
        'order': { bg: 'bg-green-100', text: 'text-green-700', label: '訂單', icon: '?��' },
        'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '?��?', icon: '??�? },
        'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: '系統', icon: '?��?' }
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
          <CheckCircleIcon className="w-3 h-3 mr-1" />?�用
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
          <PauseIcon className="w-3 h-3 mr-1" />?�用
        </span>
      );
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">觸發?�管??/h3>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              ?��?觸發??
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 font-chinese mb-2">?�� 觸發?�說??/h4>
            <p className="text-sm text-blue-700 font-chinese">
              觸發?��?義�?何�??��??�送通知?�當系統事件?��?且符?�設定�?件�?，相?��??�知範本?�被?��??��???
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{triggers.length}</div>
              <div className="text-sm text-gray-500 font-chinese">總觸?�器??/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{triggers.filter(t => t.status === 'active').length}</div>
              <div className="text-sm text-gray-500 font-chinese">?�用�?/div>
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
              <div className="text-sm text-gray-500 font-chinese">?�聯範本??/div>
            </div>
          </div>
        </div>

        <StandardTable
          data={triggers}
          columns={triggerColumns}
          title="觸發?�管??
          emptyMessage="沒�??�到觸發??
          emptyDescription="請建立新?�觸?�器以自?�發?�通知"
          emptyIcon={BellIcon}
        />
      </div>
    );
  };

  const renderChannelsTab = () => {
    const channels = [
      {
        id: 'email_html',
        name: 'Email (HTML)',
        description: 'HTML?��??�電子郵�?,
        icon: '?��',
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
        name: 'Email (純�?�?',
        description: '純�?字格式�??��??�件',
        icon: '?��',
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
        name: 'SMS 簡�?',
        description: '?��?簡�??�知',
        icon: '?��',
        status: 'active',
        config: {
          provider: '中華?�信',
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
        name: 'LINE ?��?訊息',
        description: 'LINE官方帳�??��?訊息',
        icon: '?��',
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
        description: 'LINE互�?式Flex訊息',
        icon: '?��',
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
        name: 'App ?�播',
        description: '?��??�用程�??�播?�知',
        icon: '?��',
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
        name: '網�??�播',
        description: '?�覽?�網?�推?�通知',
        icon: '??',
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
          <CheckCircleIcon className="w-3 h-3 mr-1" />?�用
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
          <PauseIcon className="w-3 h-3 mr-1" />?�用
        </span>
      );
    };

    const getTestStatusBadge = (testStatus) => {
      return testStatus === 'success' ? (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
          <CheckCircleIcon className="w-3 h-3 mr-1" />�?��
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
          <XCircleIcon className="w-3 h-3 mr-1" />?�常
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
            <h3 className="text-lg font-bold font-chinese">渠�?設�?管�?</h3>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              ?��?渠�?
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 font-chinese mb-2">?�� 渠�?說�?</h4>
            <p className="text-sm text-green-700 font-chinese">
              ?�置?�種?�知渠�??��?��設�??��??��?確�??�知?�正確發?�到?�戶?��??�測試�??��??�以維�??�佳�??��?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{channels.length}</div>
              <div className="text-sm text-gray-500 font-chinese">總�??�數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{channels.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-gray-500 font-chinese">?�用渠�?</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {channels.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-chinese">總發?�數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {channels.filter(c => c.testStatus === 'success').length}/{channels.length}
              </div>
              <div className="text-sm text-gray-500 font-chinese">�?��渠�?</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {channels.map(channel => (
            <div key={channel.id} className="glass rounded-2xl overflow-visible">{/* ?�許?�直溢出以顯示�??�選??*/}
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
                    <div className="text-sm text-gray-500 font-chinese">?�送數</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculateDeliveryRate(channel.stats.delivered, channel.stats.sent)}%
                    </div>
                    <div className="text-sm text-gray-500 font-chinese">?��???/div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculateOpenRate(channel.stats.opened, channel.stats.delivered)}%
                    </div>
                    <div className="text-sm text-gray-500 font-chinese">?��???/div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{channel.stats.clicked}</div>
                    <div className="text-sm text-gray-500 font-chinese">點�???/div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 font-chinese">??��?�??/span>
                    {getTestStatusBadge(channel.testStatus)}
                  </div>
                  <div className="text-xs text-gray-500 font-chinese mb-4">
                    ?�後測試�?{channel.lastTest}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 btn btn-secondary text-xs py-2">
                      <CogIcon className="w-4 h-4 mr-1" />
                      設�?
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
        templateName: '訂單確�??�知',
        recipient: 'user@example.com',
        channel: 'email_html',
        status: 'delivered',
        sentAt: '2024-09-16 14:15:30',
        deliveredAt: '2024-09-16 14:15:45',
        openedAt: '2024-09-16 14:20:12',
        clickedAt: '2024-09-16 14:22:08',
        subject: '?��?訂單 #ORD-20240916-001 已確�?,
        errorMessage: null
      },
      {
        id: 'N002',
        templateName: '?�員?�日祝�?',
        recipient: '0912345678',
        channel: 'sms',
        status: 'delivered',
        sentAt: '2024-09-16 09:00:00',
        deliveredAt: '2024-09-16 09:00:15',
        openedAt: '2024-09-16 09:00:15',
        clickedAt: null,
        subject: '?�日快�?！�?屬優?��??��???,
        errorMessage: null
      },
      {
        id: 'N003',
        templateName: '?��?缺貨?��?',
        recipient: 'admin@marelle.com',
        channel: 'email_text',
        status: 'failed',
        sentAt: '2024-09-16 08:30:00',
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        subject: '?��?庫�?警�?：精緻�?仁�?�?,
        errorMessage: 'SMTP connection timeout'
      },
      {
        id: 'N004',
        templateName: '促銷活�??�知',
        recipient: 'LINE-USER-123',
        channel: 'line_flex',
        status: 'delivered',
        sentAt: '2024-09-15 16:00:00',
        deliveredAt: '2024-09-15 16:00:05',
        openedAt: '2024-09-15 16:05:20',
        clickedAt: '2024-09-15 16:06:15',
        subject: '?��??��?：全館�????�起',
        errorMessage: null
      },
      {
        id: 'N005',
        templateName: '密碼?�設?�知',
        recipient: 'member@example.com',
        channel: 'email_html',
        status: 'pending',
        sentAt: '2024-09-16 14:30:00',
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        subject: '密碼?�設確�?',
        errorMessage: null
      }
    ];

    const getStatusBadge = (status) => {
      const statusConfig = {
        'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '?�送中', icon: ClockIcon },
        'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: '已送�?', icon: CheckCircleIcon },
        'failed': { bg: 'bg-red-100', text: 'text-red-700', label: '失�?', icon: XCircleIcon },
        'bounced': { bg: 'bg-orange-100', text: 'text-orange-700', label: '?�??, icon: XCircleIcon }
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
        'email_html': { icon: '?��', name: 'Email' },
        'email_text': { icon: '?��', name: 'Email' },
        'sms': { icon: '?��', name: 'SMS' },
        'line_text': { icon: '?��', name: 'LINE' },
        'line_flex': { icon: '?��', name: 'LINE' },
        'push_app': { icon: '?��', name: 'App?�播' },
        'push_web': { icon: '??', name: '網�??�播' }
      };
      const config = channelConfig[channel] || { icon: '?��', name: '?�知' };
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
            <h3 className="text-lg font-bold font-chinese">?�知歷史記�?</h3>
            <div className="flex space-x-3">
              <CustomSelect
                value={historyTimeRange}
                onChange={setHistoryTimeRange}
                options={[
                  { value: '1d', label: '今天', icon: '??' },
                  { value: '7d', label: '7�?, icon: '??' },
                  { value: '30d', label: '30�?, icon: '??' },
                  { value: '90d', label: '90�?, icon: '??' }
                ]}
                className="w-24"
              />
              <CustomSelect
                value={historyChannel}
                onChange={setHistoryChannel}
                options={[
                  { value: 'all', label: '?�部渠�?' },
                  { value: 'email_html', label: 'Email (HTML)', icon: '?��' },
                  { value: 'email_text', label: 'Email (?��?)', icon: '?��' },
                  { value: 'sms', label: 'SMS', icon: '?��' },
                  { value: 'line_text', label: 'LINE (?��?)', icon: '?��' },
                  { value: 'line_flex', label: 'LINE (Flex)', icon: '?��' },
                  { value: 'push_web', label: '網�??�播', icon: '??' }
                ]}
                className="w-48"
              />
              <CustomSelect
                value={historyStatus}
                onChange={setHistoryStatus}
                options={[
                  { value: 'all', label: '?�部?�?? },
                  { value: 'delivered', label: '已送�?', icon: '?? },
                  { value: 'failed', label: '失�?', icon: '?? },
                  { value: 'pending', label: '?�送中', icon: '?? }
                ]}
                className="w-32"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{historyStats.total}</div>
              <div className="text-sm text-gray-500 font-chinese">總發??/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{historyStats.delivered}</div>
              <div className="text-sm text-gray-500 font-chinese">已送�?</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600">{historyStats.failed}</div>
              <div className="text-sm text-gray-500 font-chinese">失�?</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">{historyStats.pending}</div>
              <div className="text-sm text-gray-500 font-chinese">?�送中</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{historyStats.opened}</div>
              <div className="text-sm text-gray-500 font-chinese">已�???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{historyStats.clicked}</div>
              <div className="text-sm text-gray-500 font-chinese">已�???/div>
            </div>
          </div>
        </div>

        <StandardTable
          data={filteredHistory}
          columns={historyColumns}
          title="?�知歷史記�?"
          emptyMessage="沒�??�到?�知記�?"
          emptyDescription="調整篩選條件以查?�相?��???
          emptyIcon={BellIcon}
        />
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
        { channel: 'push_web', name: '網�??�播', sent: 450, delivered: 420, opened: 350, clicked: 150, deliveryRate: 93.3, openRate: 83.3, clickRate: 42.9 },
        { channel: 'email_text', name: 'Email (?��?)', sent: 340, delivered: 338, opened: 280, clicked: 45, deliveryRate: 99.4, openRate: 82.8, clickRate: 16.1 },
        { channel: 'line_text', name: 'LINE ?��?', sent: 230, delivered: 228, opened: 215, clicked: 120, deliveryRate: 99.1, openRate: 94.3, clickRate: 55.8 }
      ],
      templatePerformance: [
        { template: '訂單確�??�知', sent: 890, delivered: 875, opened: 680, clicked: 120, deliveryRate: 98.3, openRate: 77.7, clickRate: 17.6 },
        { template: '?�員?�日祝�?', sent: 560, delivered: 548, opened: 520, clicked: 180, deliveryRate: 97.9, openRate: 94.9, clickRate: 34.6 },
        { template: '?��?缺貨?��?', sent: 450, delivered: 445, opened: 398, clicked: 45, deliveryRate: 98.9, openRate: 89.4, clickRate: 11.3 },
        { template: '促銷活�??�知', sent: 890, delivered: 865, opened: 420, clicked: 350, deliveryRate: 97.2, openRate: 48.6, clickRate: 83.3 },
        { template: '密碼?�設?�知', sent: 340, delivered: 338, opened: 310, clicked: 28, deliveryRate: 99.4, openRate: 91.7, clickRate: 9.0 }
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

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">?��??��?</h3>
            <CustomSelect
              value={analyticsTimeRange}
              onChange={setAnalyticsTimeRange}
              options={[
                { value: '1d', label: '今天', icon: '??' },
                { value: '7d', label: '7�?, icon: '??' },
                { value: '30d', label: '30�?, icon: '??' },
                { value: '90d', label: '90�?, icon: '??' }
              ]}
              className="w-24"
            />
          </div>

          {/* 總覽?��? */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-500 font-chinese">總發?�數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.deliveryRate, 'delivery')}`}>
                {analyticsData.overview.deliveryRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">?��???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.openRate, 'open')}`}>
                {analyticsData.overview.openRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">?��???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.clickRate, 'click')}`}>
                {analyticsData.overview.clickRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">點�???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-orange-600">{analyticsData.overview.unsubscribeRate}%</div>
              <div className="text-sm text-gray-500 font-chinese">?��?訂閱??/div>
            </div>
          </div>
        </div>

        {/* 渠�??��??��? */}
        <StandardTable
          data={analyticsData.channelPerformance}
          columns={channelAnalyticsColumns}
          title="渠�??��??��?"
          emptyMessage="沒�?渠�??��??��?"
          emptyDescription="請�??�置並使?�通知渠�?"
          emptyIcon={BellIcon}
        />

        {/* 範本?��??��? */}
        <StandardTable
          data={analyticsData.templatePerformance}
          columns={templateAnalyticsColumns}
          title="範本?��??��?"
          emptyMessage="沒�?範本?��??��?"
          emptyDescription="請�?使用?�知範本?�送通知"
          emptyIcon={BellIcon}
        />

        {/* 趨勢?�表（簡?�顯示�? */}
        <div className="glass rounded-2xl p-6">
          <h4 className="text-lg font-bold font-chinese mb-4">?�送趨??/h4>
          <div className="grid grid-cols-7 gap-2">
            {analyticsData.timeSeriesData.map(day => (
              <div key={day.date} className="text-center">
                <div className="text-xs text-gray-500 font-chinese mb-2">
                  {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="text-sm font-bold text-blue-800">{day.sent}</div>
                  <div className="text-xs text-blue-600 font-chinese">?��?/div>
                </div>
                <div className="bg-green-100 rounded-lg p-2 mt-1">
                  <div className="text-xs font-bold text-green-800">{day.opened}</div>
                  <div className="text-xs text-green-600 font-chinese">?��?</div>
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
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">?�知管�?系統</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTestPanel(true)}
            className="btn btn-secondary flex items-center"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            測試?�知
          </button>
          <button className="btn btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            ?��?範本
          </button>
        </div>
      </div>

      {/* ?��?導航 */}
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

      {/* 統�??��? */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{mockTemplateData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">總�??�數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{mockTemplateData.filter(t => t.status === 'active').length}</div>
          <div className="text-sm text-gray-500 font-chinese">?�用範本</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockTemplateData.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總發?�次??/div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(mockTemplateData.reduce((sum, t) => sum + t.successRate, 0) / mockTemplateData.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 font-chinese">平�??��???/div>
        </div>
      </div>

      {/* ?��??�容 */}
      {renderTabContent()}

      {/* ?�知測試?�板 */}
      <NotificationTestPanel 
        isOpen={showTestPanel}
        onClose={() => setShowTestPanel(false)}
      />
    </div>
    </div>
  );
};

export default NotificationManagement;
