import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import StandardTable from '../components/StandardTable';
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

  const getStockStatus = (inStock) => {
    return inStock
      ? { text: '有庫存', color: 'bg-green-100 text-green-800' }
      : { text: '缺貨', color: 'bg-red-100 text-red-800' };
  };

  // 表格列配置
  const columns = [
    {
      label: '商品',
      sortable: true,
      render: (product) => (
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
      )
    },
    {
      label: '分類',
      sortable: true,
      render: (product) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-apricot-100 text-apricot-800 rounded-full font-chinese">
          {product.category}
        </span>
      )
    },
    {
      label: '價格',
      sortable: true,
      render: (product) => (
        <div>
          <div className="text-gray-900 font-bold">
            {formatPrice(product.price)}
          </div>
          {product.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>
      )
    },
    {
      label: '庫存狀態',
      sortable: true,
      render: (product) => {
        const stockStatus = getStockStatus(product.inStock);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} font-chinese`}>
            {stockStatus.text}
          </span>
        );
      }
    },
    {
      label: '評分',
      sortable: true,
      render: (product) => (
        <div className="flex items-center">
          <span className="text-sm text-gray-900">
            {product.rating}
          </span>
          <span className="text-yellow-400 ml-1">★</span>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviews})
          </span>
        </div>
      )
    },
    {
      label: '操作',
      render: (product) => (
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
      )
    }
  ];

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
      <StandardTable 
        title="商品管理"
        columns={columns}
        data={products}
        exportFileName="products"
        emptyMessage="沒有找到符合條件的商品"
      />
    </div>
  );
};

export default AdminProducts;