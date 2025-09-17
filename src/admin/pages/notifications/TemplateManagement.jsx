import React, { useState, useMemo } from 'react';
import StandardTable from '../../components/StandardTable';
import { 
  BellIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  CheckCircleIcon,
  PauseIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import CustomSelect from '../../components/CustomSelect';
import SearchableSelect from '../../../components/SearchableSelect';

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
    subcategory: 'marketing_promotion',
    trigger: '促銷活動開始',
    channels: ['email_html', 'push_web', 'line_flex'],
    priority: 'normal',
    status: 'inactive',
    lastUsed: '2024-09-10',
    usageCount: 245,
    successRate: 92.1,
    createdAt: '2024-01-30',
    updatedAt: '2024-09-08'
  },
  {
    id: 5,
    name: '系統維護通知',
    description: '系統維護前發送的預告通知',
    category: 'system',
    subcategory: 'system_maintenance',
    trigger: '維護前24小時',
    channels: ['email_text', 'push_app'],
    priority: 'high',
    status: 'active',
    lastUsed: '2024-08-25',
    usageCount: 5,
    successRate: 98.8,
    createdAt: '2024-04-15',
    updatedAt: '2024-08-20'
  }
];

const TemplateManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // 獲取渠道圖標
  const getChannelIcons = (channels) => {
    const channelConfig = {
      'email_html': { icon: EnvelopeIcon, name: 'Email' },
      'email_text': { icon: EnvelopeIcon, name: 'Email' },
      'sms': { icon: DevicePhoneMobileIcon, name: 'SMS' },
      'line_text': { icon: ChatBubbleLeftIcon, name: 'LINE' },
      'line_flex': { icon: ChatBubbleLeftIcon, name: 'LINE' },
      'push_app': { icon: DevicePhoneMobileIcon, name: 'App推播' },
      'push_web': { icon: GlobeAltIcon, name: '網頁推播' }
    };
    
    return (
      <div className="flex items-center space-x-1">
        {channels.slice(0, 3).map((channel, idx) => {
          const config = channelConfig[channel];
          if (!config) return null;
          
          const IconComponent = config.icon;
          return (
            <div key={idx} className="flex items-center">
              <IconComponent className="w-4 h-4 text-gray-500" />
            </div>
          );
        })}
        {channels.length > 3 && (
          <span className="text-xs text-gray-500">+{channels.length - 3}</span>
        )}
      </div>
    );
  };

  // 獲取分類徽章
  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'order': { bg: 'bg-blue-100', text: 'text-blue-700', label: '訂單' },
      'user': { bg: 'bg-green-100', text: 'text-green-700', label: '用戶' },
      'product': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '商品' },
      'marketing': { bg: 'bg-purple-100', text: 'text-purple-700', label: '行銷' },
      'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: '系統' }
    };
    const config = categoryConfig[category] || categoryConfig['system'];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // 獲取狀態徽章
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
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [selectedCategory, selectedStatus, sortField, sortDirection]);

  // 範本管理欄位配置
  const templateColumns = [
    {
      key: 'name',
      label: '範本名稱',
      sortable: true,
      render: (_, template) => (
        <div>
          <div className="font-medium text-gray-900">{template.name}</div>
          <div className="text-sm text-gray-500">{template.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: '分類',
      sortable: true,
      render: (_, template) => getCategoryBadge(template.category)
    },
    {
      key: 'trigger',
      label: '觸發條件',
      sortable: false,
      render: (_, template) => (
        <span className="text-sm text-gray-600">{template.trigger}</span>
      )
    },
    {
      key: 'channels',
      label: '發送渠道',
      sortable: false,
      render: (_, template) => getChannelIcons(template.channels)
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
      label: '成功率',
      sortable: true,
      render: (_, template) => (
        <div className="text-sm text-gray-900">
          {(template.successRate * 100).toFixed(1)}%
        </div>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, template) => getStatusBadge(template.status)
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, template) => (
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

  return (
    <div className="p-6">
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
                { value: 'active', label: '啟用', description: '正在使用的範本' },
                { value: 'inactive', label: '停用', description: '已停用的範本' }
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
      <StandardTable
        data={filteredData}
        columns={templateColumns}
        title="通知範本"
        emptyMessage="沒有找到通知範本"
        emptyDescription="請調整篩選條件或建立新的通知範本"
        emptyIcon={BellIcon}
      />
    </div>
  );
};

export default TemplateManagement;