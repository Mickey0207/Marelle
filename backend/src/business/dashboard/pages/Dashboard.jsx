import React from 'react';
import { Card } from '../../../components/ui';

const Dashboard = () => {
  const stats = [
    {
      title: '今日訂單',
      value: '125',
      change: '+12%',
      changeType: 'positive',
      icon: '📋'
    },
    {
      title: '今日營收',
      value: 'NT$ 45,600',
      change: '+8%',
      changeType: 'positive',
      icon: '💰'
    },
    {
      title: '商品數量',
      value: '1,234',
      change: '+3%',
      changeType: 'positive',
      icon: '📦'
    },
    {
      title: '活躍客戶',
      value: '5,678',
      change: '+15%',
      changeType: 'positive',
      icon: '👥'
    }
  ];

  const recentOrders = [
    { id: '001', customer: '王小明', amount: 'NT$ 1,200', status: '已完成', time: '10:30' },
    { id: '002', customer: '李小華', amount: 'NT$ 850', status: '處理中', time: '10:15' },
    { id: '003', customer: '張小美', amount: 'NT$ 2,100', status: '待確認', time: '09:45' },
    { id: '004', customer: '陳小強', amount: 'NT$ 650', status: '已完成', time: '09:20' },
  ];

  const topProducts = [
    { name: '經典白T恤', sales: 156, revenue: 'NT$ 15,600' },
    { name: '牛仔褲', sales: 89, revenue: 'NT$ 12,400' },
    { name: '運動鞋', sales: 67, revenue: 'NT$ 18,900' },
    { name: '連帽外套', sales: 45, revenue: 'NT$ 9,800' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case '已完成':
        return 'text-green-600 bg-green-100';
      case '處理中':
        return 'text-blue-600 bg-blue-100';
      case '待確認':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">儀表板</h1>
        <p className="text-gray-600">歡迎回來！以下是您的業務概況。</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} 與昨日相比
                </p>
              </div>
              <div className="text-3xl opacity-80">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 近期訂單 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">近期訂單</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                    <span className="text-sm text-gray-600">{order.customer}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-medium text-gray-900">{order.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{order.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 熱銷商品 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">熱銷商品</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600 mt-1">銷售 {product.sales} 件</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                  <p className="text-xs text-gray-500">收入</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <span className="text-2xl mb-2">➕</span>
            <span className="text-sm font-medium text-gray-700">新增商品</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">處理訂單</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-gray-700">客戶管理</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <span className="text-2xl mb-2">📊</span>
            <span className="text-sm font-medium text-gray-700">查看報表</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;