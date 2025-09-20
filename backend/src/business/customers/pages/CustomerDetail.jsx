import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from '../../../components/ui';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 模擬客戶詳細數據
  const customer = {
    id: 1,
    name: '王小明',
    email: 'wang@example.com',
    phone: '0912-345-678',
    address: '台北市信義區信義路五段7號',
    registeredAt: '2023-06-15',
    lastLoginAt: '2024-01-15 14:30',
    status: 'vip',
    totalOrders: 15,
    totalSpent: 25890,
    averageOrderValue: 1726,
    favoriteCategories: ['上衣', '褲子', '配件'],
    notes: '優質客戶，經常購買，對品質要求高'
  };

  const recentOrders = [
    { id: 'ORD-001', date: '2024-01-15', total: 2599, status: 'completed' },
    { id: 'ORD-002', date: '2024-01-10', total: 1299, status: 'completed' },
    { id: 'ORD-003', date: '2024-01-05', total: 3599, status: 'completed' },
    { id: 'ORD-004', date: '2023-12-28', total: 899, status: 'completed' },
    { id: 'ORD-005', date: '2023-12-20', total: 1999, status: 'completed' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-600', label: '活躍' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: '非活躍' },
      vip: { bg: 'bg-purple-100', text: 'text-purple-600', label: 'VIP' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    
    return (
      <span className={`px-3 py-1 text-sm font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客戶詳情</h1>
          <p className="text-gray-600 mt-1">客戶 ID：{customer.id}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/customers')}
        >
          返回列表
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：客戶詳情 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本資訊 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">姓名</p>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">信箱</p>
                  <p className="font-medium text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">電話</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">地址</p>
                  <p className="font-medium text-gray-900">{customer.address}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">狀態</p>
                  <div className="mt-1">{getStatusBadge(customer.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">註冊時間</p>
                  <p className="font-medium text-gray-900">{customer.registeredAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">最後登入</p>
                  <p className="font-medium text-gray-900">{customer.lastLoginAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">偏好分類</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {customer.favoriteCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 近期訂單 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">近期訂單</h2>
              <Button variant="outline" size="sm">
                查看全部訂單
              </Button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">NT$ {order.total.toLocaleString()}</p>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                      已完成
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 客戶備註 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">客戶備註</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{customer.notes}</p>
                <p className="text-xs text-gray-500 mt-2">2024-01-10 由系統管理員添加</p>
              </div>
              <div>
                <textarea
                  placeholder="添加新備註..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button size="sm" className="mt-2">
                  添加備註
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 右側：統計和操作 */}
        <div className="space-y-6">
          {/* 消費統計 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">消費統計</h2>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                <p className="text-sm text-gray-600">總訂單數</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  NT$ {customer.totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">總消費金額</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  NT$ {customer.averageOrderValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">平均訂單金額</p>
              </div>
            </div>
          </Card>

          {/* 快速操作 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                發送信息
              </Button>
              <Button className="w-full" variant="outline">
                查看訂單歷史
              </Button>
              <Button className="w-full" variant="outline">
                生成客戶報告
              </Button>
              <Button className="w-full" variant="outline">
                編輯客戶資訊
              </Button>
            </div>
          </Card>

          {/* 客戶標籤 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">客戶標籤</h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded">
                  高價值客戶
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                  忠實客戶
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                  頻繁購買
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                管理標籤
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;