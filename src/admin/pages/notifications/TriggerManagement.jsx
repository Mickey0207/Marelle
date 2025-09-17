import React, { useMemo } from 'react';
import StandardTable from '../../components/StandardTable';
import {
  BellIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PauseIcon,
  UserIcon,
  ShoppingBagIcon,
  CubeIcon,
  Cog6ToothIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const TriggerManagement = () => {
  // 觸發器數據
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
    },
    {
      id: 5,
      name: '系統維護通知',
      category: 'system',
      event: 'system_maintenance',
      description: '系統維護前24小時觸發',
      conditions: [
        { field: 'maintenance.scheduled', operator: 'equals', value: 'true' },
        { field: 'maintenance.hours_before', operator: 'equals', value: '24' }
      ],
      status: 'inactive',
      templates: ['維護預告通知'],
      lastTriggered: '2024-08-25 12:00',
      triggerCount: 2
    }
  ];

  // 格式化觸發條件的輔助函數
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

  // 獲取分類徽章
  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'user': { bg: 'bg-blue-100', text: 'text-blue-700', label: '用戶', icon: UserIcon },
      'order': { bg: 'bg-green-100', text: 'text-green-700', label: '訂單', icon: ShoppingBagIcon },
      'product': { bg: 'bg-purple-100', text: 'text-purple-700', label: '商品', icon: CubeIcon },
      'system': { bg: 'bg-gray-100', text: 'text-gray-700', label: '系統', icon: Cog6ToothIcon }
    };
    const config = categoryConfig[category] || categoryConfig['system'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
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

  // 觸發器管理欄位配置
  const triggerColumns = [
    {
      key: 'name',
      label: '觸發器名稱',
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
      label: '分類',
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
      label: '關聯範本',
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
        <div className="text-sm text-gray-900">
          {trigger.triggerCount}
        </div>
      )
    },
    {
      key: 'lastTriggered',
      label: '最後觸發',
      sortable: true,
      render: (_, trigger) => (
        <div className="text-sm text-gray-500">
          {trigger.lastTriggered}
        </div>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, trigger) => getStatusBadge(trigger.status)
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, trigger) => (
        <div className="flex items-center space-x-2">
          <button className="text-green-600 hover:text-green-900">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 統計數據
  const stats = useMemo(() => {
    return {
      total: triggers.length,
      active: triggers.filter(t => t.status === 'active').length,
      totalTriggers: triggers.reduce((sum, t) => sum + t.triggerCount, 0),
      totalTemplates: triggers.reduce((sum, t) => sum + t.templates.length, 0)
    };
  }, [triggers]);

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">觸發器管理</h3>
            <button className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8744a] transition-colors">
              <PlusIcon className="w-4 h-4 mr-2" />
              新增觸發器
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 font-chinese mb-2 flex items-center">
              <InformationCircleIcon className="w-5 h-5 mr-2" />
              觸發器說明
            </h4>
            <p className="text-sm text-blue-700 font-chinese">
              觸發器定義了何時自動發送通知。當系統事件發生且符合設定條件時，相關的通知範本會被自動執行。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-500 font-chinese">總觸發器數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-500 font-chinese">啟用中</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTriggers}</div>
              <div className="text-sm text-gray-500 font-chinese">今日觸發次數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{stats.totalTemplates}</div>
              <div className="text-sm text-gray-500 font-chinese">關聯範本數</div>
            </div>
          </div>
        </div>

        <StandardTable
          data={triggers}
          columns={triggerColumns}
          title="觸發器管理"
          emptyMessage="沒有找到觸發器"
          emptyDescription="請建立新的觸發器以自動發送通知"
          emptyIcon={BellIcon}
        />
      </div>
    </div>
  );
};

export default TriggerManagement;