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

// Ê®°Êì¨?öÁü•ÁØÑÊú¨?∏Ê?
const mockTemplateData = [
  {
    id: 1,
    name: 'Ë®ÇÂñÆÁ¢∫Ë??öÁü•',
    description: '?®Êà∂‰∏ãÂñÆÂæåËá™?ïÁôº?ÅÁ?Á¢∫Ë??öÁü•',
    category: 'order',
    subcategory: 'order_created',
    trigger: 'Ë®ÇÂñÆÂª∫Á?',
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
    name: '?ÉÂì°?üÊó•Á•ùÁ?',
    description: '?ÉÂì°?üÊó•?∂Â§©?ºÈÄÅÁ?Á•ùÁ?Ë®äÊÅØ',
    category: 'user',
    subcategory: 'user_birthday',
    trigger: '?ÉÂì°?üÊó•',
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
    name: '?ÜÂ?Áº∫Ë≤®?êÈ?',
    description: '?ÜÂ?Â∫´Â?‰∏çË∂≥?ÇÁôº?ÅÁµ¶ÁÆ°Á??°Á??êÈ?',
    category: 'product',
    subcategory: 'product_low_stock',
    trigger: 'Â∫´Â?‰ΩéÊñºÂÆâÂÖ®Ê∞¥‰?',
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
    name: '‰øÉÈä∑Ê¥ªÂ??öÁü•',
    description: '?∞‰??∑Ê¥ª?ïÈ?ÂßãÊ??ºÈÄÅÁµ¶?ÉÂì°',
    category: 'marketing',
    subcategory: 'campaign_started',
    trigger: 'Ê¥ªÂ??ãÂ?',
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
  const [selectedCategory, setSelectedCategory] = useState('?®ÈÉ®');
  const [selectedStatus, setSelectedStatus] = useState('?®ÈÉ®');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('templates');
  const [showTestPanel, setShowTestPanel] = useState(false);
  
  // Ê≠∑Âè≤Ë®òÈ?ÁØ©ÈÅ∏?Ä??
  const [historyTimeRange, setHistoryTimeRange] = useState('7d');
  const [historyChannel, setHistoryChannel] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');
  
  // ?ÜÊ??ÅÈù¢?Ä??
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d');

  // ?ºÂ??ñËß∏?ºÊ?‰ª∂Á?ËºîÂä©?ΩÊï∏
  const formatCondition = (condition) => {
    const operatorMap = {
      'equals': 'Á≠âÊñº',
      'not_equals': '‰∏çÁ???,
      'greater_than': 'Â§ßÊñº',
      'less_than': 'Â∞èÊñº',
      'contains': '?ÖÂê´',
      'not_contains': '‰∏çÂ???
    };
    return `${condition.field} ${operatorMap[condition.operator] || condition.operator} ${condition.value}`;
  };

  // ?≤Â?Ê∏†È??ñÊ??ÑË??©ÂáΩ??
  const getChannelIcon = (channel) => {
    const channelConfig = {
      'email_html': '?ìß',
      'email_text': '?ìß',
      'sms': '?í¨',
      'line_text': '?í¨',
      'line_flex': '?í¨',
      'push_web': '??'
    };
    return channelConfig[channel] || '?ì§';
  };

  // ÁØ©ÈÅ∏?åÊ?Â∫èÊï∏??
  const filteredData = useMemo(() => {
    let filtered = mockTemplateData.filter(template => {
      const matchCategory = selectedCategory === '?®ÈÉ®' || template.category === selectedCategory;
      const matchStatus = selectedStatus === '?®ÈÉ®' || template.status === selectedStatus;
      
      return matchCategory && matchStatus;
    });

    // ?íÂ?
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
      'order': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Ë®ÇÂñÆ', icon: '?ì¶' },
      'user': { bg: 'bg-green-100', text: 'text-green-700', label: '?®Êà∂', icon: '?ë§' },
      'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '?ÜÂ?', icon: '??Ô∏? },
      'marketing': { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Ë°åÈä∑', icon: '?éØ' },
      'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Á≥ªÁµ±', icon: '?ôÔ?' }
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
      'urgent': { bg: 'bg-red-100', text: 'text-red-700', label: 'Á∑äÊÄ? },
      'high': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'È´? },
      'normal': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '?ÆÈÄ? },
      'low': { bg: 'bg-gray-100', text: 'text-gray-700', label: '‰Ω? }
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
        <CheckCircleIcon className="w-3 h-3 mr-1" />?üÁî®
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
        <PauseIcon className="w-3 h-3 mr-1" />?úÁî®
      </span>
    );
  };

  const getChannelIcons = (channels) => {
    const channelConfig = {
      'email_html': { icon: '?ìß', name: 'Email' },
      'email_text': { icon: '?ìß', name: 'Email' },
      'sms': { icon: '?í¨', name: 'SMS' },
      'line_text': { icon: '?í¨', name: 'LINE' },
      'line_flex': { icon: '?í¨', name: 'LINE' },
      'push_app': { icon: '?ì±', name: 'App?®Êí≠' },
      'push_web': { icon: '??', name: 'Á∂≤È??®Êí≠' }
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
    { id: 'templates', name: 'ÁØÑÊú¨ÁÆ°Á?', icon: DocumentTextIcon },
    { id: 'variables', name: 'ËÆäÊï∏ÁÆ°Á?', icon: CogIcon },
    { id: 'triggers', name: 'Ëß∏Áôº??, icon: PlayIcon },
    { id: 'channels', name: 'Ê∏†È?Ë®≠Â?', icon: InboxIcon },
    { id: 'history', name: '?öÁü•Ê≠∑Âè≤', icon: ClockIcon },
    { id: 'analytics', name: '?àÊ??ÜÊ?', icon: ChartBarIcon }
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

  // ÂÆöÁæ©?öÁü•ÁØÑÊú¨Ë°®Ê†º??
  const templateColumns = [
    {
      key: 'name',
      label: 'ÁØÑÊú¨?çÁ®±',
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
      label: '?ÜÈ?',
      sortable: true,
      render: (_, template) => getCategoryBadge(template.category)
    },
    {
      key: 'trigger',
      label: 'Ëß∏ÁôºÊ¢ù‰ª∂',
      sortable: false,
      render: (_, template) => (
        <div className="text-sm text-gray-700">
          {template.trigger}
        </div>
      )
    },
    {
      key: 'channels',
      label: '?öÁü•Ê∏†È?',
      sortable: false,
      render: (_, template) => (
        <div className="flex flex-wrap gap-1">
          {getChannelIcons(template.channels)}
        </div>
      )
    },
    {
      key: 'priority',
      label: '?™Â?Á¥?,
      sortable: true,
      render: (_, template) => getPriorityBadge(template.priority)
    },
    {
      key: 'usageCount',
      label: '‰ΩøÁî®Ê¨°Êï∏',
      sortable: true,
      render: (_, template) => (
        <div className="text-sm text-gray-900">
          {template.usageCount?.toLocaleString() || 0}
        </div>
      )
    },
    {
      key: 'successRate',
      label: '?êÂ???,
      sortable: true,
      render: (_, template) => (
        <div className="text-sm text-gray-900">
          {(template.successRate * 100).toFixed(1)}%
        </div>
      )
    },
    {
      key: 'status',
      label: '?Ä??,
      sortable: true,
      render: (_, template) => getStatusBadge(template.status)
    },
    {
      key: 'actions',
      label: '?ç‰?',
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

  // Ëß∏Áôº?®ÁÆ°?ÜÊ?‰ΩçÈ?ÁΩ?
  const triggerColumns = [
    {
      key: 'name',
      label: 'Ëß∏Áôº?®Â?Á®?,
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
      label: '?ÜÈ?',
      sortable: true,
      render: (_, trigger) => getCategoryBadge(trigger.category)
    },
    {
      key: 'conditions',
      label: 'Ëß∏ÁôºÊ¢ù‰ª∂',
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
      label: '?úËÅØÁØÑÊú¨',
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
      label: 'Ëß∏ÁôºÊ¨°Êï∏',
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
      label: '?Ä??,
      sortable: true,
      render: (_, trigger) => getStatusBadge(trigger.status)
    },
    {
      key: 'actions',
      label: '?ç‰?',
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

  // ?öÁü•Ê≠∑Âè≤Ê¨Ñ‰??çÁΩÆ
  const historyColumns = [
    {
      key: 'id',
      label: '?öÁü•ID',
      sortable: true,
      render: (_, item) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
          {item.id}
        </code>
      )
    },
    {
      key: 'templateName',
      label: 'ÁØÑÊú¨',
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
      label: '?∂‰ª∂‰∫?,
      sortable: false,
      render: (_, item) => (
        <div className="text-sm font-mono text-gray-900">{item.recipient}</div>
      )
    },
    {
      key: 'channel',
      label: 'Ê∏†È?',
      sortable: true,
      render: (_, item) => {
        const channelConfig = {
          'email_html': { icon: '?ìß', name: 'Email' },
          'email_text': { icon: '?ìß', name: 'Email' },
          'sms': { icon: '?í¨', name: 'SMS' },
          'line_text': { icon: '?í¨', name: 'LINE' },
          'line_flex': { icon: '?í¨', name: 'LINE' },
          'push_app': { icon: '?ì±', name: 'App?®Êí≠' },
          'push_web': { icon: '??', name: 'Á∂≤È??®Êí≠' }
        };
        const config = channelConfig[item.channel] || { icon: '?ì§', name: '?™Áü•' };
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            {config.icon} {config.name}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: '?Ä??,
      sortable: true,
      render: (_, item) => {
        const statusConfig = {
          'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '?ºÈÄÅ‰∏≠' },
          'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: 'Â∑≤ÈÄÅÈ?' },
          'failed': { bg: 'bg-red-100', text: 'text-red-700', label: 'Â§±Ê?' },
          'bounced': { bg: 'bg-orange-100', text: 'text-orange-700', label: '?Ä?? }
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
      label: '?ºÈÄÅÊ???,
      sortable: true,
      render: (_, item) => (
        <div>
          <div className="text-sm text-gray-900">{item.sentAt}</div>
          {item.deliveredAt && (
            <div className="text-xs text-gray-500">?ÅÈ?: {item.deliveredAt}</div>
          )}
        </div>
      )
    },
    {
      key: 'interaction',
      label: '‰∫íÂ?',
      sortable: false,
      render: (_, item) => (
        <div className="space-y-1">
          {item.openedAt && (
            <div className="text-xs text-blue-600">?ãÂ?: {item.openedAt}</div>
          )}
          {item.clickedAt && (
            <div className="text-xs text-purple-600">ÈªûÊ?: {item.clickedAt}</div>
          )}
          {!item.openedAt && !item.clickedAt && (
            <div className="text-xs text-gray-400">?°‰???/div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: '?ç‰?',
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

  // Ê∏†È??àÊ??ÜÊ?Ê¨Ñ‰??çÁΩÆ
  const channelAnalyticsColumns = [
    {
      key: 'channel',
      label: 'Ê∏†È?',
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
      label: '?ºÈÄÅÊï∏',
      sortable: true,
      render: (_, channel) => (
        <div className="text-center text-gray-900">{channel.sent.toLocaleString()}</div>
      )
    },
    {
      key: 'deliveryRate',
      label: '?ÅÈ???,
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
      label: '?ãÂ???,
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
      label: 'ÈªûÊ???,
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
      label: '?àÊ?Ë©ïÁ?',
      sortable: true,
      render: (_, channel) => {
        const overallScore = (channel.deliveryRate * 0.3 + channel.openRate * 0.4 + channel.clickRate * 0.3);
        const grade = overallScore >= 80 ? '?™Á?' : overallScore >= 60 ? '?ØÂ•Ω' : overallScore >= 40 ? '?ÆÈÄ? : '?Ä?πÂ?';
        const gradeColor = overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-blue-600' : overallScore >= 40 ? 'text-yellow-600' : 'text-red-600';
        return (
          <div className="text-center">
            <span className={`font-bold ${gradeColor}`}>{grade}</span>
          </div>
        );
      }
    }
  ];

  // ÁØÑÊú¨?àÊ??ÜÊ?Ê¨Ñ‰??çÁΩÆ
  const templateAnalyticsColumns = [
    {
      key: 'template',
      label: 'ÁØÑÊú¨?çÁ®±',
      sortable: true,
      render: (_, template) => (
        <span className="font-medium text-gray-900">{template.template}</span>
      )
    },
    {
      key: 'sent',
      label: '?ºÈÄÅÊï∏',
      sortable: true,
      render: (_, template) => (
        <div className="text-center text-gray-900">{template.sent.toLocaleString()}</div>
      )
    },
    {
      key: 'deliveryRate',
      label: '?ÅÈ???,
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
      label: '?ãÂ???,
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
      label: 'ÈªûÊ???,
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
      label: 'Âª∫Ë≠∞',
      sortable: false,
      render: (_, template) => {
        let suggestion = '';
        if (template.deliveryRate < 95) suggestion = '?™Â??ºÈÄÅË®≠ÂÆ?;
        else if (template.openRate < 20) suggestion = '?πÂ?‰∏ªÊó®Ë°?;
        else if (template.clickRate < 5) suggestion = '?™Â??ßÂÆπ?áCTA';
        else suggestion = 'Ë°®Áèæ?ØÂ•Ω';
        
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
      {/* ÁØ©ÈÅ∏?Ä??*/}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?®ÈÉ®', label: '?®ÈÉ®?ÜÈ?' },
                { value: 'order', label: 'Ë®ÇÂñÆ' },
                { value: 'user', label: '?®Êà∂' },
                { value: 'product', label: '?ÜÂ?' },
                { value: 'marketing', label: 'Ë°åÈä∑' },
                { value: 'system', label: 'Á≥ªÁµ±' }
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="?∏Ê??ÜÈ?"
              className="w-48"
            />
          </div>

          <div className="flex items-center space-x-2">
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: '?®ÈÉ®', label: '?®ÈÉ®?Ä?? },
                { value: 'active', label: '?üÁî®', icon: '??, description: 'Ê≠?ú®‰ΩøÁî®?ÑÁ??? },
                { value: 'inactive', label: '?úÁî®', icon: '?∏Ô?', description: 'Â∑≤Â??®Á?ÁØÑÊú¨' }
              ]}
              className="w-32"
              placeholder="?∏Ê??Ä??
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            ??{filteredData.length} ?ãÁ???
          </div>
        </div>
      </div>

      {/* ‰∏ªË?ÁØÑÊú¨Ë°®Ê†º */}
      <StandardTable
        data={filteredData}
        columns={templateColumns}
        title="?öÁü•ÁØÑÊú¨"
        emptyMessage="Ê≤íÊ??æÂà∞?öÁü•ÁØÑÊú¨"
        emptyDescription="Ë´ãË™ø?¥ÁØ©?∏Ê?‰ª∂Ê?Âª∫Á??∞Á??öÁü•ÁØÑÊú¨"
        emptyIcon={BellIcon}
      />
    </>
  );

  const renderVariablesTab = () => {
    const variableCategories = [
      {
        id: 'user',
        name: '?®Êà∂?∏È?',
        icon: '?ë§',
        color: 'blue',
        variables: [
          { key: 'user.name', name: '?®Êà∂ÂßìÂ?', description: '?®Êà∂?ÑÁ?ÂØ¶Â???, example: 'ÂºµÂ??? },
          { key: 'user.email', name: '?ªÂ??µ‰ª∂', description: '?®Êà∂?ÑÈõªÂ≠êÈÉµ‰ª∂Âú∞?Ä', example: 'user@example.com' },
          { key: 'user.phone', name: '?ãÊ??üÁ¢º', description: '?®Êà∂?ÑÊ?Ê©üË?Á¢?, example: '0912345678' },
          { key: 'user.birthday', name: '?üÊó•', description: '?®Êà∂?ÑÁ??•Êó•??, example: '1990-01-01' },
          { key: 'user.level', name: '?ÉÂì°Á≠âÁ?', description: '?®Êà∂?ÑÊ??°Á?Á¥?, example: 'VIP' },
          { key: 'user.points', name: 'Á©çÂ?È§òÈ?', description: '?®Êà∂?ÆÂ??ÑÁ??ÜÊï∏??, example: '1250' }
        ]
      },
      {
        id: 'order',
        name: 'Ë®ÇÂñÆ?∏È?',
        icon: '?ì¶',
        color: 'green',
        variables: [
          { key: 'order.id', name: 'Ë®ÇÂñÆÁ∑®Ë?', description: 'Ë®ÇÂñÆ?ÑÂîØ‰∏ÄË≠òÂà•Á¢?, example: 'ORD-20240916-001' },
          { key: 'order.total', name: 'Ë®ÇÂñÆÁ∏ΩÈ?', description: 'Ë®ÇÂñÆ?ÑÁ∏Ω?ëÈ?', example: 'NT$ 1,580' },
          { key: 'order.status', name: 'Ë®ÇÂñÆ?Ä??, description: 'Ë®ÇÂñÆ?ÆÂ??ÑË??ÜÁ???, example: 'Â∑≤Âá∫Ë≤? },
          { key: 'order.date', name: '‰∏ãÂñÆ?•Ê?', description: 'Ë®ÇÂñÆÂª∫Á??ÑÊó•?üÊ???, example: '2024-09-16 14:30' },
          { key: 'order.items', name: '?ÜÂ??óË°®', description: 'Ë®ÇÂñÆ‰∏≠Á??ÜÂ?Ê∏ÖÂñÆ', example: '?ÜÂ?A x2, ?ÜÂ?B x1' },
          { key: 'order.shipping', name: '?çÈÄÅÊñπÂº?, description: '?∏Ê??ÑÈ??ÅÊñπÂº?, example: 'ÂÆÖÈ??∞Â?' }
        ]
      },
      {
        id: 'product',
        name: '?ÜÂ??∏È?',
        icon: '??Ô∏?,
        color: 'purple',
        variables: [
          { key: 'product.name', name: '?ÜÂ??çÁ®±', description: '?ÜÂ??ÑÂ??¥Â?Á®?, example: 'Á≤æÁ∑ª?è‰??ãÁ?' },
          { key: 'product.price', name: '?ÜÂ??πÊ†º', description: '?ÜÂ??ÑÂîÆ??, example: 'NT$ 480' },
          { key: 'product.sku', name: '?ÜÂ?Á∑®Ë?', description: '?ÜÂ??ÑSKUÁ∑®Ë?', example: 'CAKE-ALM-001' },
          { key: 'product.category', name: '?ÜÂ??ÜÈ?', description: '?ÜÂ??ÄÂ±¨Â?È°?, example: '?ãÁ?È°? },
          { key: 'product.stock', name: 'Â∫´Â??∏È?', description: '?ÜÂ??ÆÂ?Â∫´Â?', example: '25' },
          { key: 'product.discount', name: '?òÊâ£Ë≥áË?', description: '?ÜÂ??ÑÊ???ø°??, example: '9?òÂÑ™?? }
        ]
      },
      {
        id: 'system',
        name: 'Á≥ªÁµ±?∏È?',
        icon: '?ôÔ?',
        color: 'gray',
        variables: [
          { key: 'system.site_name', name: 'Á∂≤Á??çÁ®±', description: 'Á∂≤Á??ÑÂ?Á®?, example: 'Marelle' },
          { key: 'system.contact_email', name: 'ÂÆ¢Ê?‰ø°ÁÆ±', description: 'ÂÆ¢Ê??ØÁµ°‰ø°ÁÆ±', example: 'support@marelle.com' },
          { key: 'system.current_date', name: '?∂Â??•Ê?', description: 'Á≥ªÁµ±?∂Â??•Ê?', example: '2024-09-16' },
          { key: 'system.current_time', name: '?∂Â??ÇÈ?', description: 'Á≥ªÁµ±?∂Â??ÇÈ?', example: '14:30:25' },
          { key: 'system.domain', name: 'Á∂≤Á??üÂ?', description: 'Á∂≤Á??ÑÂ??çÂú∞?Ä', example: 'www.marelle.com' },
          { key: 'system.version', name: 'Á≥ªÁµ±?àÊú¨', description: '?∂Â?Á≥ªÁµ±?àÊú¨??, example: 'v2.1.0' }
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
            <h3 className="text-lg font-bold font-chinese">ËÆäÊï∏ÁÆ°Á?</h3>
            <div className="text-sm text-gray-500 font-chinese">
              ??{variableCategories.reduce((sum, cat) => sum + cat.variables.length, 0)} ?ãË???
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 font-chinese mb-2">?í° ‰ΩøÁî®Ë™™Ê?</h4>
            <p className="text-sm text-amber-700 font-chinese">
              ?®ÈÄöÁü•ÁØÑÊú¨‰∏≠‰Ωø??<code className="bg-amber-100 px-1 rounded">{'{{ËÆäÊï∏?çÁ®±}}'}</code> ?ºÂ?‰æÜÊ??•Â??ãÂÖßÂÆπ„Ä?
              ‰æãÂ?Ôº?code className="bg-amber-100 px-1 rounded">{'{{user.name}}'}</code> ?ÉË¢´?øÊ??∫ÂØ¶?õÁ??®Êà∂ÂßìÂ???
            </p>
          </div>
        </div>

        {variableCategories.map(category => {
          const colors = getColorClasses(category.color);
          return (
            <div key={category.id} className="glass rounded-2xl overflow-visible">{/* ?ÅË®±?ÇÁõ¥Ê∫¢Âá∫‰ª•È°ØÁ§∫‰??âÈÅ∏??*/}
              <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h4 className={`text-lg font-bold font-chinese ${colors.text}`}>
                    {category.name}
                  </h4>
                  <span className={`ml-auto px-3 py-1 ${colors.badge} ${colors.text} text-sm font-medium rounded-full font-chinese`}>
                    {category.variables.length} ?ãË???
                  </span>
                </div>
              </div>
              
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          ËÆäÊï∏?çÁ®±
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          ?èËø∞
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          ÁØÑ‰???
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          ?ç‰?
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
                              title="Ë§áË£ΩËÆäÊï∏"
                            >
                              ?? Ë§áË£Ω
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
        name: '?®Êà∂Ë®ªÂ?',
        category: 'user',
        event: 'user_registered',
        description: '?∞Áî®?∂Â??êË®ª?äÊ?Ëß∏Áôº',
        conditions: [
          { field: 'user.email_verified', operator: 'equals', value: 'true' }
        ],
        status: 'active',
        templates: ['Ê≠°Ë?Ë®ªÂ??öÁü•', '?∞Ê??áÂ?'],
        lastTriggered: '2024-09-16 10:30',
        triggerCount: 23
      },
      {
        id: 2,
        name: 'Ë®ÇÂñÆÂª∫Á?',
        category: 'order',
        event: 'order_created',
        description: '?®Êà∂?êÂ?‰∏ãÂñÆ?ÇËß∏??,
        conditions: [
          { field: 'order.status', operator: 'equals', value: 'confirmed' },
          { field: 'order.payment_status', operator: 'equals', value: 'paid' }
        ],
        status: 'active',
        templates: ['Ë®ÇÂñÆÁ¢∫Ë??öÁü•'],
        lastTriggered: '2024-09-16 14:15',
        triggerCount: 89
      },
      {
        id: 3,
        name: 'Â∫´Â?Ë≠¶Â?',
        category: 'product',
        event: 'stock_low',
        description: '?ÜÂ?Â∫´Â?‰ΩéÊñºÂÆâÂÖ®Ê∞¥‰??ÇËß∏??,
        conditions: [
          { field: 'product.stock', operator: 'less_than', value: '10' }
        ],
        status: 'active',
        templates: ['Â∫´Â?‰∏çË∂≥?êÈ?'],
        lastTriggered: '2024-09-15 18:45',
        triggerCount: 5
      },
      {
        id: 4,
        name: '?üÊó•Á•ùÁ?',
        category: 'user',
        event: 'user_birthday',
        description: '?®Êà∂?üÊó•?∂Â§©Ëß∏Áôº',
        conditions: [
          { field: 'system.date', operator: 'equals', value: 'user.birthday' },
          { field: 'user.birthday_notifications', operator: 'equals', value: 'enabled' }
        ],
        status: 'active',
        templates: ['?üÊó•Á•ùÁ?Ë®äÊÅØ', '?üÊó•Â∞àÂ±¨?™Ê?'],
        lastTriggered: '2024-09-14 09:00',
        triggerCount: 12
      }
    ];

    const getCategoryBadge = (category) => {
      const categoryConfig = {
        'user': { bg: 'bg-blue-100', text: 'text-blue-700', label: '?®Êà∂', icon: '?ë§' },
        'order': { bg: 'bg-green-100', text: 'text-green-700', label: 'Ë®ÇÂñÆ', icon: '?ì¶' },
        'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '?ÜÂ?', icon: '??Ô∏? },
        'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Á≥ªÁµ±', icon: '?ôÔ?' }
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
          <CheckCircleIcon className="w-3 h-3 mr-1" />?üÁî®
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
          <PauseIcon className="w-3 h-3 mr-1" />?úÁî®
        </span>
      );
    };

    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">Ëß∏Áôº?®ÁÆ°??/h3>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              ?∞Â?Ëß∏Áôº??
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 font-chinese mb-2">?éØ Ëß∏Áôº?®Ë™™??/h4>
            <p className="text-sm text-blue-700 font-chinese">
              Ëß∏Áôº?®Â?Áæ©‰?‰ΩïÊ??™Â??ºÈÄÅÈÄöÁü•?ÇÁï∂Á≥ªÁµ±‰∫ã‰ª∂?ºÁ?‰∏îÁ¨¶?àË®≠ÂÆöÊ?‰ª∂Ê?ÔºåÁõ∏?úÁ??öÁü•ÁØÑÊú¨?ÉË¢´?™Â??∑Ë???
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{triggers.length}</div>
              <div className="text-sm text-gray-500 font-chinese">Á∏ΩËß∏?ºÂô®??/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{triggers.filter(t => t.status === 'active').length}</div>
              <div className="text-sm text-gray-500 font-chinese">?üÁî®‰∏?/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {triggers.reduce((sum, t) => sum + t.triggerCount, 0)}
              </div>
              <div className="text-sm text-gray-500 font-chinese">‰ªäÊó•Ëß∏ÁôºÊ¨°Êï∏</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {triggers.reduce((sum, t) => sum + t.templates.length, 0)}
              </div>
              <div className="text-sm text-gray-500 font-chinese">?úËÅØÁØÑÊú¨??/div>
            </div>
          </div>
        </div>

        <StandardTable
          data={triggers}
          columns={triggerColumns}
          title="Ëß∏Áôº?®ÁÆ°??
          emptyMessage="Ê≤íÊ??æÂà∞Ëß∏Áôº??
          emptyDescription="Ë´ãÂª∫Á´ãÊñ∞?ÑËß∏?ºÂô®‰ª•Ëá™?ïÁôº?ÅÈÄöÁü•"
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
        description: 'HTML?ºÂ??ÑÈõªÂ≠êÈÉµ‰ª?,
        icon: '?ìß',
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
        name: 'Email (Á¥îÊ?Â≠?',
        description: 'Á¥îÊ?Â≠óÊ†ºÂºèÁ??ªÂ??µ‰ª∂',
        icon: '?ìß',
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
        name: 'SMS Á∞°Ë?',
        description: '?ãÊ?Á∞°Ë??öÁü•',
        icon: '?í¨',
        status: 'active',
        config: {
          provider: '‰∏≠ËèØ?ª‰ø°',
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
        name: 'LINE ?áÂ?Ë®äÊÅØ',
        description: 'LINEÂÆòÊñπÂ∏≥Ë??áÂ?Ë®äÊÅØ',
        icon: '?í¨',
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
        name: 'LINE Flex Ë®äÊÅØ',
        description: 'LINE‰∫íÂ?ÂºèFlexË®äÊÅØ',
        icon: '?í¨',
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
        name: 'App ?®Êí≠',
        description: '?ãÊ??âÁî®Á®ãÂ??®Êí≠?öÁü•',
        icon: '?ì±',
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
        name: 'Á∂≤È??®Êí≠',
        description: '?èË¶Ω?®Á∂≤?ÅÊé®?≠ÈÄöÁü•',
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
          <CheckCircleIcon className="w-3 h-3 mr-1" />?üÁî®
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
          <PauseIcon className="w-3 h-3 mr-1" />?úÁî®
        </span>
      );
    };

    const getTestStatusBadge = (testStatus) => {
      return testStatus === 'success' ? (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
          <CheckCircleIcon className="w-3 h-3 mr-1" />Ê≠?∏∏
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
          <XCircleIcon className="w-3 h-3 mr-1" />?∞Â∏∏
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
            <h3 className="text-lg font-bold font-chinese">Ê∏†È?Ë®≠Â?ÁÆ°Á?</h3>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              ?∞Â?Ê∏†È?
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 font-chinese mb-2">?ì° Ê∏†È?Ë™™Ê?</h4>
            <p className="text-sm text-green-700 font-chinese">
              ?çÁΩÆ?ÑÁ®Æ?öÁü•Ê∏†È??ÑÈÄ?é•Ë®≠Â??åÂ??∏Ô?Á¢∫‰??öÁü•?ΩÊ≠£Á¢∫Áôº?ÅÂà∞?®Êà∂?ÇÂ??üÊ∏¨Ë©¶Ê??ìÁ??ã‰ª•Á∂≠Ê??Ä‰Ω≥Ê??ú„Ä?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{channels.length}</div>
              <div className="text-sm text-gray-500 font-chinese">Á∏ΩÊ??ìÊï∏</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{channels.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-gray-500 font-chinese">?üÁî®Ê∏†È?</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {channels.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-chinese">Á∏ΩÁôº?ÅÊï∏</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {channels.filter(c => c.testStatus === 'success').length}/{channels.length}
              </div>
              <div className="text-sm text-gray-500 font-chinese">Ê≠?∏∏Ê∏†È?</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {channels.map(channel => (
            <div key={channel.id} className="glass rounded-2xl overflow-visible">{/* ?ÅË®±?ÇÁõ¥Ê∫¢Âá∫‰ª•È°ØÁ§∫‰??âÈÅ∏??*/}
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
                    <div className="text-sm text-gray-500 font-chinese">?ºÈÄÅÊï∏</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculateDeliveryRate(channel.stats.delivered, channel.stats.sent)}%
                    </div>
                    <div className="text-sm text-gray-500 font-chinese">?ÅÈ???/div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculateOpenRate(channel.stats.opened, channel.stats.delivered)}%
                    </div>
                    <div className="text-sm text-gray-500 font-chinese">?ãÂ???/div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{channel.stats.clicked}</div>
                    <div className="text-sm text-gray-500 font-chinese">ÈªûÊ???/div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 font-chinese">??é•?Ä??/span>
                    {getTestStatusBadge(channel.testStatus)}
                  </div>
                  <div className="text-xs text-gray-500 font-chinese mb-4">
                    ?ÄÂæåÊ∏¨Ë©¶Ô?{channel.lastTest}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 btn btn-secondary text-xs py-2">
                      <CogIcon className="w-4 h-4 mr-1" />
                      Ë®≠Â?
                    </button>
                    <button className="flex-1 btn btn-primary text-xs py-2">
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Ê∏¨Ë©¶
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
        templateName: 'Ë®ÇÂñÆÁ¢∫Ë??öÁü•',
        recipient: 'user@example.com',
        channel: 'email_html',
        status: 'delivered',
        sentAt: '2024-09-16 14:15:30',
        deliveredAt: '2024-09-16 14:15:45',
        openedAt: '2024-09-16 14:20:12',
        clickedAt: '2024-09-16 14:22:08',
        subject: '?®Á?Ë®ÇÂñÆ #ORD-20240916-001 Â∑≤Á¢∫Ë™?,
        errorMessage: null
      },
      {
        id: 'N002',
        templateName: '?ÉÂì°?üÊó•Á•ùÁ?',
        recipient: '0912345678',
        channel: 'sms',
        status: 'delivered',
        sentAt: '2024-09-16 09:00:00',
        deliveredAt: '2024-09-16 09:00:15',
        openedAt: '2024-09-16 09:00:15',
        clickedAt: null,
        subject: '?üÊó•Âø´Ê?ÔºÅÂ?Â±¨ÂÑ™?†Á??®È???,
        errorMessage: null
      },
      {
        id: 'N003',
        templateName: '?ÜÂ?Áº∫Ë≤®?êÈ?',
        recipient: 'admin@marelle.com',
        channel: 'email_text',
        status: 'failed',
        sentAt: '2024-09-16 08:30:00',
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        subject: '?ÜÂ?Â∫´Â?Ë≠¶Â?ÔºöÁ≤æÁ∑ªÊ?‰ªÅË?Á≥?,
        errorMessage: 'SMTP connection timeout'
      },
      {
        id: 'N004',
        templateName: '‰øÉÈä∑Ê¥ªÂ??öÁü•',
        recipient: 'LINE-USER-123',
        channel: 'line_flex',
        status: 'delivered',
        sentAt: '2024-09-15 16:00:00',
        deliveredAt: '2024-09-15 16:00:05',
        openedAt: '2024-09-15 16:05:20',
        clickedAt: '2024-09-15 16:06:15',
        subject: '?êÊ??™Ê?ÔºöÂÖ®È§®Â????òËµ∑',
        errorMessage: null
      },
      {
        id: 'N005',
        templateName: 'ÂØÜÁ¢º?çË®≠?öÁü•',
        recipient: 'member@example.com',
        channel: 'email_html',
        status: 'pending',
        sentAt: '2024-09-16 14:30:00',
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        subject: 'ÂØÜÁ¢º?çË®≠Á¢∫Ë?',
        errorMessage: null
      }
    ];

    const getStatusBadge = (status) => {
      const statusConfig = {
        'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '?ºÈÄÅ‰∏≠', icon: ClockIcon },
        'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: 'Â∑≤ÈÄÅÈ?', icon: CheckCircleIcon },
        'failed': { bg: 'bg-red-100', text: 'text-red-700', label: 'Â§±Ê?', icon: XCircleIcon },
        'bounced': { bg: 'bg-orange-100', text: 'text-orange-700', label: '?Ä??, icon: XCircleIcon }
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
        'email_html': { icon: '?ìß', name: 'Email' },
        'email_text': { icon: '?ìß', name: 'Email' },
        'sms': { icon: '?í¨', name: 'SMS' },
        'line_text': { icon: '?í¨', name: 'LINE' },
        'line_flex': { icon: '?í¨', name: 'LINE' },
        'push_app': { icon: '?ì±', name: 'App?®Êí≠' },
        'push_web': { icon: '??', name: 'Á∂≤È??®Êí≠' }
      };
      const config = channelConfig[channel] || { icon: '?ì§', name: '?™Áü•' };
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
            <h3 className="text-lg font-bold font-chinese">?öÁü•Ê≠∑Âè≤Ë®òÈ?</h3>
            <div className="flex space-x-3">
              <CustomSelect
                value={historyTimeRange}
                onChange={setHistoryTimeRange}
                options={[
                  { value: '1d', label: '‰ªäÂ§©', icon: '??' },
                  { value: '7d', label: '7Â§?, icon: '??' },
                  { value: '30d', label: '30Â§?, icon: '??' },
                  { value: '90d', label: '90Â§?, icon: '??' }
                ]}
                className="w-24"
              />
              <CustomSelect
                value={historyChannel}
                onChange={setHistoryChannel}
                options={[
                  { value: 'all', label: '?®ÈÉ®Ê∏†È?' },
                  { value: 'email_html', label: 'Email (HTML)', icon: '?ìß' },
                  { value: 'email_text', label: 'Email (?áÂ?)', icon: '?ìß' },
                  { value: 'sms', label: 'SMS', icon: '?í¨' },
                  { value: 'line_text', label: 'LINE (?áÂ?)', icon: '?í¨' },
                  { value: 'line_flex', label: 'LINE (Flex)', icon: '?í¨' },
                  { value: 'push_web', label: 'Á∂≤È??®Êí≠', icon: '??' }
                ]}
                className="w-48"
              />
              <CustomSelect
                value={historyStatus}
                onChange={setHistoryStatus}
                options={[
                  { value: 'all', label: '?®ÈÉ®?Ä?? },
                  { value: 'delivered', label: 'Â∑≤ÈÄÅÈ?', icon: '?? },
                  { value: 'failed', label: 'Â§±Ê?', icon: '?? },
                  { value: 'pending', label: '?ºÈÄÅ‰∏≠', icon: '?? }
                ]}
                className="w-32"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{historyStats.total}</div>
              <div className="text-sm text-gray-500 font-chinese">Á∏ΩÁôº??/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{historyStats.delivered}</div>
              <div className="text-sm text-gray-500 font-chinese">Â∑≤ÈÄÅÈ?</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600">{historyStats.failed}</div>
              <div className="text-sm text-gray-500 font-chinese">Â§±Ê?</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">{historyStats.pending}</div>
              <div className="text-sm text-gray-500 font-chinese">?ºÈÄÅ‰∏≠</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{historyStats.opened}</div>
              <div className="text-sm text-gray-500 font-chinese">Â∑≤È???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{historyStats.clicked}</div>
              <div className="text-sm text-gray-500 font-chinese">Â∑≤È???/div>
            </div>
          </div>
        </div>

        <StandardTable
          data={filteredHistory}
          columns={historyColumns}
          title="?öÁü•Ê≠∑Âè≤Ë®òÈ?"
          emptyMessage="Ê≤íÊ??æÂà∞?öÁü•Ë®òÈ?"
          emptyDescription="Ë™øÊï¥ÁØ©ÈÅ∏Ê¢ù‰ª∂‰ª•Êü•?ãÁõ∏?úË???
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
        { channel: 'push_web', name: 'Á∂≤È??®Êí≠', sent: 450, delivered: 420, opened: 350, clicked: 150, deliveryRate: 93.3, openRate: 83.3, clickRate: 42.9 },
        { channel: 'email_text', name: 'Email (?áÂ?)', sent: 340, delivered: 338, opened: 280, clicked: 45, deliveryRate: 99.4, openRate: 82.8, clickRate: 16.1 },
        { channel: 'line_text', name: 'LINE ?áÂ?', sent: 230, delivered: 228, opened: 215, clicked: 120, deliveryRate: 99.1, openRate: 94.3, clickRate: 55.8 }
      ],
      templatePerformance: [
        { template: 'Ë®ÇÂñÆÁ¢∫Ë??öÁü•', sent: 890, delivered: 875, opened: 680, clicked: 120, deliveryRate: 98.3, openRate: 77.7, clickRate: 17.6 },
        { template: '?ÉÂì°?üÊó•Á•ùÁ?', sent: 560, delivered: 548, opened: 520, clicked: 180, deliveryRate: 97.9, openRate: 94.9, clickRate: 34.6 },
        { template: '?ÜÂ?Áº∫Ë≤®?êÈ?', sent: 450, delivered: 445, opened: 398, clicked: 45, deliveryRate: 98.9, openRate: 89.4, clickRate: 11.3 },
        { template: '‰øÉÈä∑Ê¥ªÂ??öÁü•', sent: 890, delivered: 865, opened: 420, clicked: 350, deliveryRate: 97.2, openRate: 48.6, clickRate: 83.3 },
        { template: 'ÂØÜÁ¢º?çË®≠?öÁü•', sent: 340, delivered: 338, opened: 310, clicked: 28, deliveryRate: 99.4, openRate: 91.7, clickRate: 9.0 }
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
            <h3 className="text-lg font-bold font-chinese">?àÊ??ÜÊ?</h3>
            <CustomSelect
              value={analyticsTimeRange}
              onChange={setAnalyticsTimeRange}
              options={[
                { value: '1d', label: '‰ªäÂ§©', icon: '??' },
                { value: '7d', label: '7Â§?, icon: '??' },
                { value: '30d', label: '30Â§?, icon: '??' },
                { value: '90d', label: '90Â§?, icon: '??' }
              ]}
              className="w-24"
            />
          </div>

          {/* Á∏ΩË¶Ω?áÊ? */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-500 font-chinese">Á∏ΩÁôº?ÅÊï∏</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.deliveryRate, 'delivery')}`}>
                {analyticsData.overview.deliveryRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">?ÅÈ???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.openRate, 'open')}`}>
                {analyticsData.overview.openRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">?ãÂ???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className={`text-2xl font-bold ${getPerformanceColor(analyticsData.overview.clickRate, 'click')}`}>
                {analyticsData.overview.clickRate}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">ÈªûÊ???/div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-orange-600">{analyticsData.overview.unsubscribeRate}%</div>
              <div className="text-sm text-gray-500 font-chinese">?ñÊ?Ë®ÇÈñ±??/div>
            </div>
          </div>
        </div>

        {/* Ê∏†È??àÊ??ÜÊ? */}
        <StandardTable
          data={analyticsData.channelPerformance}
          columns={channelAnalyticsColumns}
          title="Ê∏†È??àÊ??ÜÊ?"
          emptyMessage="Ê≤íÊ?Ê∏†È??àÊ??∏Ê?"
          emptyDescription="Ë´ãÂ??çÁΩÆ‰∏¶‰Ωø?®ÈÄöÁü•Ê∏†È?"
          emptyIcon={BellIcon}
        />

        {/* ÁØÑÊú¨?àÊ??ÜÊ? */}
        <StandardTable
          data={analyticsData.templatePerformance}
          columns={templateAnalyticsColumns}
          title="ÁØÑÊú¨?àÊ??ÜÊ?"
          emptyMessage="Ê≤íÊ?ÁØÑÊú¨?àÊ??∏Ê?"
          emptyDescription="Ë´ãÂ?‰ΩøÁî®?öÁü•ÁØÑÊú¨?ºÈÄÅÈÄöÁü•"
          emptyIcon={BellIcon}
        />

        {/* Ë∂®Âã¢?ñË°®ÔºàÁ∞°?ñÈ°ØÁ§∫Ô? */}
        <div className="glass rounded-2xl p-6">
          <h4 className="text-lg font-bold font-chinese mb-4">?ºÈÄÅË∂®??/h4>
          <div className="grid grid-cols-7 gap-2">
            {analyticsData.timeSeriesData.map(day => (
              <div key={day.date} className="text-center">
                <div className="text-xs text-gray-500 font-chinese mb-2">
                  {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="text-sm font-bold text-blue-800">{day.sent}</div>
                  <div className="text-xs text-blue-600 font-chinese">?ºÈÄ?/div>
                </div>
                <div className="bg-green-100 rounded-lg p-2 mt-1">
                  <div className="text-xs font-bold text-green-800">{day.opened}</div>
                  <div className="text-xs text-green-600 font-chinese">?ãÂ?</div>
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
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">?öÁü•ÁÆ°Á?Á≥ªÁµ±</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTestPanel(true)}
            className="btn btn-secondary flex items-center"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            Ê∏¨Ë©¶?öÁü•
          </button>
          <button className="btn btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            ?∞Â?ÁØÑÊú¨
          </button>
        </div>
      </div>

      {/* ?ÜÈ?Â∞éËà™ */}
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

      {/* Áµ±Ë??òË? */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{mockTemplateData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÁ??¨Êï∏</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{mockTemplateData.filter(t => t.status === 'active').length}</div>
          <div className="text-sm text-gray-500 font-chinese">?üÁî®ÁØÑÊú¨</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockTemplateData.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÁôº?ÅÊ¨°??/div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(mockTemplateData.reduce((sum, t) => sum + t.successRate, 0) / mockTemplateData.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 font-chinese">Âπ≥Â??êÂ???/div>
        </div>
      </div>

      {/* ?ÜÈ??ßÂÆπ */}
      {renderTabContent()}

      {/* ?öÁü•Ê∏¨Ë©¶?¢Êùø */}
      <NotificationTestPanel 
        isOpen={showTestPanel}
        onClose={() => setShowTestPanel(false)}
      />
    </div>
    </div>
  );
};

export default NotificationManagement;
