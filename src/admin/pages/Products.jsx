import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { mockProducts, formatPrice } from '../../utils/data';

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sort products based on current sort settings
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle different data types
    if (sortField === 'price') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
  }, [sortedProducts]);

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
            管理商品資訊、變體和庫存
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Link 
            to="/admin/products/add"
            className="px-6 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-all duration-200 shadow-lg font-chinese text-lg font-semibold flex items-center"
          >
            <PlusIcon className="w-6 h-6 mr-3" />
            新增商品
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#a65c35] transition-colors font-chinese"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    商品
                    <span className="ml-2">
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 opacity-30" />
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#a65c35] transition-colors font-chinese"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    分類
                    <span className="ml-2">
                      {sortField === 'category' ? (
                        sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 opacity-30" />
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#a65c35] transition-colors font-chinese"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    價格
                    <span className="ml-2">
                      {sortField === 'price' ? (
                        sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 opacity-30" />
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#a65c35] transition-colors font-chinese"
                  onClick={() => handleSort('inStock')}
                >
                  <div className="flex items-center">
                    庫存狀態
                    <span className="ml-2">
                      {sortField === 'inStock' ? (
                        sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 opacity-30" />
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#a65c35] transition-colors font-chinese"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center">
                    評分
                    <span className="ml-2">
                      {sortField === 'rating' ? (
                        sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 opacity-30" />
                      )}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.map((product, index) => {
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
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
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
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-chinese">沒有找到符合條件的商品</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700 font-chinese">
          顯示 <span className="font-medium">1</span> 到 <span className="font-medium">{sortedProducts.length}</span> 項，
          共 <span className="font-medium">{sortedProducts.length}</span> 項商品
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