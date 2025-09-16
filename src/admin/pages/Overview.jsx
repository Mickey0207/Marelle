import { useEffect } from 'react';
import { gsap } from 'gsap';
import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { mockProducts, formatPrice } from '../../utils/data';

const AdminOverview = () => {
  useEffect(() => {
    // Animate cards on load
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
  }, []);

  // Mock data for dashboard
  const stats = [
    {
      name: '總銷售額',
      value: '¥128,450',
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'text-green-600'
    },
    {
      name: '總訂單數',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600'
    },
    {
      name: '商品數量',
      value: mockProducts.length.toString(),
      change: '+2',
      trend: 'up',
      icon: ShoppingBagIcon,
      color: 'text-apricot-600'
    },
    {
      name: '註冊用戶',
      value: '1,234',
      change: '+5.8%',
      trend: 'up',
      icon: UsersIcon,
      color: 'text-purple-600'
    }
  ];

  const recentOrders = [
    { id: '#001', customer: '張小明', amount: 2880, status: '已完成', date: '2024-01-15' },
    { id: '#002', customer: '李小華', amount: 1680, status: '處理中', date: '2024-01-15' },
    { id: '#003', customer: '王小美', amount: 3200, status: '已發貨', date: '2024-01-14' },
    { id: '#004', customer: '陳小強', amount: 680, status: '已完成', date: '2024-01-14' },
    { id: '#005', customer: '林小雅', amount: 1280, status: '處理中', date: '2024-01-13' }
  ];

  const topProducts = mockProducts
    .filter(p => p.featured)
    .slice(0, 5)
    .map((product, index) => ({
      ...product,
      sales: Math.floor(Math.random() * 100) + 50 // Mock sales data
    }));

  const getStatusColor = (status) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '處理中':
        return 'bg-yellow-100 text-yellow-800';
      case '已發貨':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">儀表板總覽</h1>
        <p className="text-gray-600 mt-2 font-chinese">
          今天是 {new Date().toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.name} className="stat-card glass p-6 rounded-2xl">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 font-chinese">
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`ml-2 flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-chinese">最近訂單</h2>
            <button className="btn-ghost text-sm font-chinese">查看全部</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)} font-chinese`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-chinese">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-apricot-600">
                    {formatPrice(order.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-chinese">熱銷商品</h2>
            <button className="btn-ghost text-sm font-chinese">查看全部</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate font-chinese">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600 font-chinese">
                    銷量：{product.sales}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-apricot-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    #{index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">快速操作</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary p-4 text-left font-chinese">
            <ShoppingBagIcon className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">新增商品</div>
          </button>
          <button className="btn-secondary p-4 text-left font-chinese">
            <ClipboardDocumentListIcon className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">查看訂單</div>
          </button>
          <button className="btn-secondary p-4 text-left font-chinese" onClick={() => window.location.href='/admin/members'}>
            <UsersIcon className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">會員管理</div>
          </button>
          <button className="btn-secondary p-4 text-left font-chinese">
            <CurrencyDollarIcon className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">銷售報告</div>
          </button>
          <button className="btn-secondary p-4 text-left font-chinese" onClick={() => window.location.href='/admin/inventory'}>
            <ClipboardDocumentListIcon className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">庫存管理</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;