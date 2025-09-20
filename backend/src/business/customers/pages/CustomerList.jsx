import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Table } from '../../../components/ui';

const CustomerList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 模擬客戶數據
  const customers = [
    {
      id: 1,
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912-345-678',
      totalOrders: 15,
      totalSpent: 25890,
      lastOrderDate: '2024-01-15',
      status: 'active',
      registeredAt: '2023-06-15'
    },
    {
      id: 2,
      name: '李小華',
      email: 'li@example.com',
      phone: '0923-456-789',
      totalOrders: 8,
      totalSpent: 12350,
      lastOrderDate: '2024-01-10',
      status: 'active',
      registeredAt: '2023-08-22'
    },
    {
      id: 3,
      name: '張小美',
      email: 'zhang@example.com',
      phone: '0934-567-890',
      totalOrders: 22,
      totalSpent: 45670,
      lastOrderDate: '2024-01-12',
      status: 'vip',
      registeredAt: '2023-03-10'
    },
    {
      id: 4,
      name: '陳小強',
      email: 'chen@example.com',
      phone: '0945-678-901',
      totalOrders: 3,
      totalSpent: 2890,
      lastOrderDate: '2023-12-20',
      status: 'inactive',
      registeredAt: '2023-11-05'
    },
    {
      id: 5,
      name: '林小雨',
      email: 'lin@example.com',
      phone: '0956-789-012',
      totalOrders: 12,
      totalSpent: 18990,
      lastOrderDate: '2024-01-08',
      status: 'active',
      registeredAt: '2023-07-18'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-600', label: '活躍' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: '非活躍' },
      vip: { bg: 'bg-purple-100', text: 'text-purple-600', label: 'VIP' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'customer',
      title: '客戶資訊',
      render: (customer) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.email}</p>
            <p className="text-sm text-gray-500">{customer.phone}</p>
          </div>
        </div>
      )
    },
    {
      key: 'orders',
      title: '訂單統計',
      render: (customer) => (
        <div className="text-center">
          <p className="font-medium text-gray-900">{customer.totalOrders} 筆</p>
          <p className="text-sm text-gray-500">總訂單</p>
        </div>
      )
    },
    {
      key: 'spent',
      title: '消費金額',
      render: (customer) => (
        <div className="text-center">
          <p className="font-medium text-gray-900">NT$ {customer.totalSpent.toLocaleString()}</p>
          <p className="text-sm text-gray-500">總消費</p>
        </div>
      )
    },
    {
      key: 'lastOrder',
      title: '最後訂單',
      render: (customer) => (
        <span className="text-sm text-gray-600">{customer.lastOrderDate}</span>
      )
    },
    {
      key: 'status',
      title: '狀態',
      render: (customer) => getStatusBadge(customer.status)
    },
    {
      key: 'actions',
      title: '操作',
      render: (customer) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/customers/${customer.id}`)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            查看
          </button>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            聯繫
          </button>
        </div>
      )
    }
  ];

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">客戶管理</h1>
        <p className="text-gray-600 mt-1">管理客戶資訊和關係</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
            <p className="text-sm text-gray-600">總客戶數</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{customerStats.active}</p>
            <p className="text-sm text-gray-600">活躍客戶</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{customerStats.vip}</p>
            <p className="text-sm text-gray-600">VIP 客戶</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{customerStats.inactive}</p>
            <p className="text-sm text-gray-600">非活躍客戶</p>
          </div>
        </Card>
      </div>

      {/* 篩選和搜尋 */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜尋客戶姓名、信箱或電話..."
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
              <option value="active">活躍</option>
              <option value="vip">VIP</option>
              <option value="inactive">非活躍</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 客戶列表 */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              客戶列表 ({filteredCustomers.length})
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                匯出客戶資料
              </Button>
              <Button variant="outline" size="sm">
                發送通知
              </Button>
            </div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredCustomers}
          emptyMessage="沒有找到符合條件的客戶"
        />
      </Card>
    </div>
  );
};

export default CustomerList;