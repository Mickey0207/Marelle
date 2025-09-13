import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { mockProducts, formatPrice } from '../../utils/data';

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    // Filter products based on search
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    // Animate products table
    gsap.fromTo(
      '.product-row',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );
  }, [filteredProducts]);

  const getStockStatus = (inStock) => {
    return inStock
      ? { text: '有庫存', color: 'bg-green-100 text-green-800' }
      : { text: '缺貨', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-chinese">商品管理</h1>
          <p className="text-gray-600 mt-2 font-chinese">
            管理您的商品庫存和資訊
          </p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0 font-chinese">
          <PlusIcon className="w-5 h-5 mr-2" />
          新增商品
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋商品名稱或分類..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass pl-10 w-full font-chinese"
            />
          </div>
          <select className="input-glass font-chinese">
            <option value="">全部分類</option>
            <option value="accessories">配件</option>
            <option value="home">家居</option>
            <option value="fragrance">香氛</option>
            <option value="clothing">服飾</option>
            <option value="tea">茶品</option>
            <option value="lifestyle">生活用品</option>
          </select>
          <select className="input-glass font-chinese">
            <option value="">庫存狀態</option>
            <option value="in-stock">有庫存</option>
            <option value="out-of-stock">缺貨</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 font-chinese">
                  商品
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 font-chinese">
                  分類
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 font-chinese">
                  價格
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 font-chinese">
                  庫存狀態
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 font-chinese">
                  評分
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 font-chinese">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.inStock);
                return (
                  <tr key={product.id} className="product-row hover:bg-white/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900 font-chinese">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 font-chinese">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-apricot-100 text-apricot-800 rounded-full font-chinese">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-bold">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} font-chinese`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {product.rating}
                        </span>
                        <span className="text-yellow-400 ml-1">★</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({product.reviews})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-chinese">沒有找到符合條件的商品</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700 font-chinese">
          顯示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredProducts.length}</span> 項，
          共 <span className="font-medium">{filteredProducts.length}</span> 項商品
        </p>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm font-chinese">上一頁</button>
          <button className="btn-secondary text-sm font-chinese">下一頁</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;