import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Table } from '../../../components/ui';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 模擬商品數據
  const products = [
    {
      id: 1,
      name: '經典白T恤',
      sku: 'WT-001',
      category: '上衣',
      price: 899,
      stock: 156,
      status: 'active',
      image: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: '牛仔褲',
      sku: 'JP-002',
      category: '褲子',
      price: 1399,
      stock: 89,
      status: 'active',
      image: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: '運動鞋',
      sku: 'SH-003',
      category: '鞋子',
      price: 2899,
      stock: 67,
      status: 'active',
      image: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: '連帽外套',
      sku: 'HO-004',
      category: '外套',
      price: 2199,
      stock: 0,
      status: 'out_of_stock',
      image: '/api/placeholder/60/60'
    },
    {
      id: 5,
      name: '短褲',
      sku: 'SP-005',
      category: '褲子',
      price: 699,
      stock: 234,
      status: 'active',
      image: '/api/placeholder/60/60'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">缺貨</span>;
    }
    if (stock < 20) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-600 rounded-full">庫存不足</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">正常</span>;
  };

  const columns = [
    {
      key: 'product',
      title: '商品',
      render: (product) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">📦</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: '分類',
      render: (product) => (
        <span className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded">
          {product.category}
        </span>
      )
    },
    {
      key: 'price',
      title: '價格',
      render: (product) => (
        <span className="font-medium text-gray-900">NT$ {product.price.toLocaleString()}</span>
      )
    },
    {
      key: 'stock',
      title: '庫存',
      render: (product) => (
        <div className="text-center">
          <p className="font-medium text-gray-900">{product.stock}</p>
          {getStatusBadge(product.status, product.stock)}
        </div>
      )
    },
    {
      key: 'actions',
      title: '操作',
      render: (product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            編輯
          </button>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            刪除
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600 mt-1">管理您的商品庫存和詳細資訊</p>
        </div>
        <Button onClick={() => navigate('/products/new')}>
          新增商品
        </Button>
      </div>

      {/* 篩選和搜尋 */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜尋商品名稱或 SKU..."
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
              <option value="active">正常</option>
              <option value="out_of_stock">缺貨</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 商品列表 */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              商品列表 ({filteredProducts.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                匯出
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                匯入
              </button>
            </div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredProducts}
          emptyMessage="沒有找到符合條件的商品"
        />
      </Card>

      {/* 統計資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-sm text-gray-600 mt-1">總商品數</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.stock > 0).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">有庫存商品</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {products.filter(p => p.stock === 0).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">缺貨商品</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductList;