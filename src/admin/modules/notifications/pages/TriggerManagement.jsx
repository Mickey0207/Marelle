import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  BoltIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "@shared/adminStyles";

const TriggerStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PAUSED: 'paused'
};

const TriggerManagement = () => {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [statistics, setStatistics] = useState({
    totalTriggers: 0,
    activeTriggers: 0,
    triggeredToday: 0,
    successRate: 0
  });

  useEffect(() => {
    loadTriggers();
    loadStatistics();

    gsap.fromTo(
      '.trigger-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadTriggers = async () => {
    setLoading(true);
    try {
      // 模擬載入觸發器數據
      const mockTriggers = [
        {
          id: 'trigger-1',
          name: '新訂單確認',
          event: 'order_created',
          description: '當用戶完成下單時觸發',
          conditions: [
            { field: 'order.status', operator: 'equals', value: 'confirmed' },
            { field: 'order.payment_status', operator: 'equals', value: 'paid' }
          ],
          actions: [
            { type: 'send_template', template_id: 'tpl-2', delay: 0 },
            { type: 'update_customer_status', status: 'purchased', delay: 300 }
          ],
          status: 'active',
          triggeredCount: 1580,
          successRate: 98.5,
          lastTriggered: new Date('2024-01-15T10:30:00'),
          createdAt: new Date('2024-01-01')
        },
        {
          id: 'trigger-2',
          name: '會員生日祝福',
          event: 'member_birthday',
          description: '會員生日當天發送祝福',
          conditions: [
            { field: 'member.status', operator: 'equals', value: 'active' },
            { field: 'member.birthday', operator: 'equals_today', value: null }
          ],
          actions: [
            { type: 'send_template', template_id: 'tpl-4', delay: 600 }
          ],
          status: 'active',
          triggeredCount: 45,
          successRate: 96.8,
          lastTriggered: new Date('2024-01-14T09:00:00'),
          createdAt: new Date('2024-01-05')
        },
        {
          id: 'trigger-3',
          name: '發貨通知',
          event: 'order_shipped',
          description: '訂單發貨時通知客戶',
          conditions: [
            { field: 'order.shipping_status', operator: 'equals', value: 'shipped' }
          ],
          actions: [
            { type: 'send_template', template_id: 'tpl-3', delay: 0 }
          ],
          status: 'active',
          triggeredCount: 892,
          successRate: 99.2,
          lastTriggered: new Date('2024-01-15T14:45:00'),
          createdAt: new Date('2024-01-02')
        },
        {
          id: 'trigger-4',
          name: '購物車遺棄提醒',
          event: 'cart_abandoned',
          description: '購物車超過24小時未結帳',
          conditions: [
            { field: 'cart.last_activity', operator: 'older_than', value: '24h' },
            { field: 'cart.items_count', operator: 'greater_than', value: 0 }
          ],
          actions: [
            { type: 'send_template', template_id: 'tpl-5', delay: 0 }
          ],
          status: 'paused',
          triggeredCount: 234,
          successRate: 15.6,
          lastTriggered: new Date('2024-01-10T16:20:00'),
          createdAt: new Date('2024-01-08')
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTriggers(mockTriggers);
    } catch (error) {
      console.error('Error loading triggers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const mockStats = {
        totalTriggers: 8,
        activeTriggers: 6,
        triggeredToday: 156,
        successRate: 94.2
      };
      setStatistics(mockStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleToggleTrigger = (triggerId) => {
    setTriggers(prev => 
      prev.map(trigger => 
        trigger.id === triggerId
          ? { 
              ...trigger, 
              status: trigger.status === 'active' ? 'paused' : 'active' 
            }
          : trigger
      )
    );
  };

  const handleDeleteTrigger = (id) => {
    if (window.confirm('確定要刪除這個觸發器嗎？此操作無法復原。')) {
      setTriggers(prev => prev.filter(trigger => trigger.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [TriggerStatus.ACTIVE]: { label: '啟用中', className: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      [TriggerStatus.INACTIVE]: { label: '已停用', className: 'bg-red-100 text-red-800', icon: XCircleIcon },
      [TriggerStatus.PAUSED]: { label: '已暫停', className: 'bg-yellow-100 text-yellow-800', icon: PauseIcon }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800', icon: ClockIcon };
    const IconComponent = config.icon;
    
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="w-4 h-4" />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
          {config.label}
        </span>
      </div>
    );
  };

  const getEventBadge = (event) => {
    const eventConfig = {
      order_created: { label: '訂單建立', className: 'bg-blue-100 text-blue-800' },
      order_shipped: { label: '訂單發貨', className: 'bg-purple-100 text-purple-800' },
      member_birthday: { label: '會員生日', className: 'bg-pink-100 text-pink-800' },
      cart_abandoned: { label: '購物車遺棄', className: 'bg-orange-100 text-orange-800' }
    };

    const config = eventConfig[event] || { label: event, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredTriggers = triggers.filter(trigger => {
    const matchesSearch = trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trigger.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || trigger.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入觸發器數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">觸發器管理</h1>
        <p className="text-gray-600 mt-2">管理自動化通知觸發條件與規則</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="trigger-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BoltIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalTriggers}</p>
              <p className="text-sm text-gray-600">總觸發器</p>
            </div>
          </div>
        </div>

        <div className="trigger-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.activeTriggers}</p>
              <p className="text-sm text-gray-600">啟用中</p>
            </div>
          </div>
        </div>

        <div className="trigger-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.triggeredToday}</p>
              <p className="text-sm text-gray-600">今日觸發</p>
            </div>
          </div>
        </div>

        <div className="trigger-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BoltIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.successRate}%</p>
              <p className="text-sm text-gray-600">成功率</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和操作欄 */}
      <div className={`${ADMIN_STYLES.glassCard} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="搜尋觸發器名稱或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有狀態</option>
              <option value="active">啟用中</option>
              <option value="paused">已暫停</option>
              <option value="inactive">已停用</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            新建觸發器
          </button>
        </div>
      </div>

      {/* 觸發器列表 */}
      <div className="space-y-4">
        {filteredTriggers.map((trigger) => (
          <div key={trigger.id} className={`trigger-card ${ADMIN_STYLES.glassCard}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#cc824d] to-[#b8743d] rounded-lg flex items-center justify-center">
                    <BoltIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-chinese">{trigger.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{trigger.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getEventBadge(trigger.event)}
                      {getStatusBadge(trigger.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleTrigger(trigger.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      trigger.status === 'active'
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={trigger.status === 'active' ? '暫停觸發器' : '啟用觸發器'}
                  >
                    {trigger.status === 'active' ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 觸發條件 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">觸發條件</h4>
                  <div className="space-y-2">
                    {trigger.conditions.map((condition, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="font-medium text-gray-900">{condition.field}</div>
                        <div className="text-gray-600 mt-1">
                          {condition.operator} {condition.value || '今天'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 執行動作 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">執行動作</h4>
                  <div className="space-y-2">
                    {trigger.actions.map((action, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {action.type === 'send_template' ? '發送模板' : '更新狀態'}
                        </div>
                        <div className="text-gray-600 mt-1">
                          {action.delay > 0 && `延遲 ${action.delay}秒`}
                          {action.template_id && ` (${action.template_id})`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 執行統計 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">執行統計</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">觸發次數：</span>
                      <span className="font-medium">{trigger.triggeredCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">成功率：</span>
                      <span className="font-medium text-green-600">{trigger.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">最後觸發：</span>
                      <span className="font-medium">{trigger.lastTriggered.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={() => setSelectedTrigger(trigger)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      詳情
                    </button>
                    <button className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTrigger(trigger.id)}
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

      {filteredTriggers.length === 0 && (
        <div className="text-center py-12">
          <BoltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">沒有找到符合條件的觸發器</div>
          <p className="text-gray-400 mt-2">嘗試調整搜尋條件或創建新的觸發器</p>
        </div>
      )}

      {/* 創建觸發器模態框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-chinese">新建觸發器</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">觸發器名稱</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="輸入觸發器名稱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">觸發事件</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent">
                    <option value="order_created">訂單建立</option>
                    <option value="order_shipped">訂單發貨</option>
                    <option value="member_birthday">會員生日</option>
                    <option value="cart_abandoned">購物車遺棄</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  rows="3"
                  placeholder="描述這個觸發器的用途"
                />
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
                創建觸發器
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerManagement;
