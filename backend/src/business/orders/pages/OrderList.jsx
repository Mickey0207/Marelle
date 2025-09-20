import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Table } from '../../../components/ui';

const OrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // 模擬訂單數據
  const orders = [
    {
      id: 'ORD-001',
      customer: '王小明',
      email: 'wang@example.com',
      phone: '0912-345-678',
      total: 2599,
      status: 'completed',
      paymentStatus: 'paid',
      shippingStatus: 'delivered',
      createdAt: '2024-01-15 10:30',
      items: 3
    },
    {
      id: 'ORD-002',
      customer: '李小華',
      email: 'li@example.com',
      phone: '0923-456-789',
      total: 1299,
      status: 'processing',
      paymentStatus: 'paid',
      shippingStatus: 'preparing',
      createdAt: '2024-01-15 09:15',
      items: 2
    },
    {
      id: 'ORD-003',
      customer: '張小美',
      email: 'zhang@example.com',
      phone: '0934-567-890',
      total: 3599,
      status: 'pending',
      paymentStatus: 'pending',
      shippingStatus: 'pending',
      createdAt: '2024-01-15 08:45',
      items: 4
    },
    {
      id: 'ORD-004',
      customer: '陳小強',
      email: 'chen@example.com',
      phone: '0945-678-901',
      total: 899,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingStatus: 'cancelled',
      createdAt: '2024-01-14 16:20',
      items: 1
    },
    {
      id: 'ORD-005',
      customer: '林小雨',
      email: 'lin@example.com',
      phone: '0956-789-012',
      total: 1999,
      status: 'processing',
      paymentStatus: 'paid',
      shippingStatus: 'shipped',
      createdAt: '2024-01-14 14:10',
      items: 2
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status, type = 'order') => {
    const statusConfig = {
      order: {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '待處理' },
        processing: { bg: 'bg-blue-100', text: 'text-blue-600', label: '處理中' },
        completed: { bg: 'bg-green-100', text: 'text-green-600', label: '已完成' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: '已取消' }
      },
      payment: {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '待付款' },
        paid: { bg: 'bg-green-100', text: 'text-green-600', label: '已付款' },
        refunded: { bg: 'bg-gray-100', text: 'text-gray-600', label: '已退款' }
      },
      shipping: {
        pending: { bg: 'bg-gray-100', text: 'text-gray-600', label: '待出貨' },
        preparing: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '準備中' },
        shipped: { bg: 'bg-blue-100', text: 'text-blue-600', label: '已出貨' },
        delivered: { bg: 'bg-green-100', text: 'text-green-600', label: '已送達' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: '已取消' }
      }
    };

    const config = statusConfig[type][status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'order',
      title: '訂單資訊',
      render: (order) => (
        <div>
          <p className="font-medium text-gray-900">{order.id}</p>
          <p className="text-sm text-gray-500">{order.createdAt}</p>
        </div>
      )
    },
    {
      key: 'customer',
      title: '客戶',
      render: (order) => (
        <div>
          <p className="font-medium text-gray-900">{order.customer}</p>
          <p className="text-sm text-gray-500">{order.email}</p>
          <p className="text-sm text-gray-500">{order.phone}</p>
        </div>
      )
    },
    {
      key: 'items',
      title: '商品數量',
      render: (order) => (
        <span className="font-medium text-gray-900">{order.items} 件</span>
      )
    },
    {
      key: 'total',
      title: '總金額',
      render: (order) => (
        <span className="font-medium text-gray-900">NT$ {order.total.toLocaleString()}</span>
      )
    },
    {
      key: 'status',
      title: '狀態',
      render: (order) => (
        <div className="space-y-1">
          <div>{getStatusBadge(order.status, 'order')}</div>
          <div>{getStatusBadge(order.paymentStatus, 'payment')}</div>
          <div>{getStatusBadge(order.shippingStatus, 'shipping')}</div>
        </div>
      )
    },
    {
      key: 'actions',
      title: '操作',
      render: (order) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            查看
          </button>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            處理
          </button>
        </div>
      )
    }
  ];

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
        <p className="text-gray-600 mt-1">管理和追蹤所有訂單狀態</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
            <p className="text-sm text-gray-600">總訂單</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
            <p className="text-sm text-gray-600">待處理</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{orderStats.processing}</p>
            <p className="text-sm text-gray-600">處理中</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
            <p className="text-sm text-gray-600">已完成</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
            <p className="text-sm text-gray-600">已取消</p>
          </div>
        </Card>
      </div>

      {/* 篩選和搜尋 */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜尋訂單編號、客戶姓名或信箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有狀態</option>
              <option value="pending">待處理</option>
              <option value="processing">處理中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有時間</option>
              <option value="today">今天</option>
              <option value="week">本週</option>
              <option value="month">本月</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 訂單列表 */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              訂單列表 ({filteredOrders.length})
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                匯出報表
              </Button>
              <Button variant="outline" size="sm">
                批量處理
              </Button>
            </div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredOrders}
          emptyMessage="沒有找到符合條件的訂單"
        />
      </Card>
    </div>
  );
};

export default OrderList;