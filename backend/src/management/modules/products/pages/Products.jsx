import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import StandardTable from "../../../components/ui/StandardTable";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { mockProducts, formatPrice } from "../../../../shared/utils/data";
import { ADMIN_STYLES, GSAP_ANIMATIONS, getStatusColor } from "../../../styles";

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);

  const getStockStatus = (inStock) => {
    return inStock
      ? { text: '有庫存', color: 'bg-green-100 text-green-800' }
      : { text: '缺貨', color: 'bg-red-100 text-red-800' };
  };

  // 表格欄位定義
  const columns = [
    {
      key: 'name',
      label: '商品',
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center">
          <img
            src={product?.image || '/placeholder-image.jpg'}
            alt={product?.name || '產品圖片'}
            className="w-12 h-12 object-cover rounded-lg mr-4"
          />
          <div>
            <div className="font-medium text-gray-900 font-chinese">
              {product?.name || '未知商品'}
            </div>
            <div className="text-sm text-gray-500 font-chinese">
              ID: {product?.id || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: '類別',
      sortable: true,
      render: (_, product) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-apricot-100 text-apricot-800 rounded-full font-chinese">
          {product?.category || '未分類'}
        </span>
      )
    },
    {
      key: 'price',
      label: '價格',
      sortable: true,
      render: (_, product) => (
        <div>
          <div className="text-gray-900 font-bold">
            {product?.price ? formatPrice(product.price) : 'N/A'}
          </div>
          {product?.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'inStock',
      label: '庫存狀態',
      sortable: true,
      render: (_, product) => {
        const stockStatus = getStockStatus(product?.inStock);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} font-chinese`}>
            {stockStatus.text}
          </span>
        );
      }
    },
    {
      key: 'rating',
      label: '評分',
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center">
          <span className="text-sm text-gray-900">
            {product?.rating || 0}
          </span>
          <span className="text-yellow-400 ml-1">★</span>
          <span className="text-xs text-gray-500 ml-2">
            ({product?.reviews || 0})
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, product) => (
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <EyeIcon className="w-4 h-4" />
          </button>
          <Link
            to={`/admin/products/edit/${product?.id}`}
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
    <div className={ADMIN_STYLES.sectionSpacing}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={ADMIN_STYLES.pageTitle}>商品管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>
            管理商品資訊、庫存和雜貨
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Link 
            to="/admin/products/add"
            className={ADMIN_STYLES.btnPrimary}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            新增商品
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <StandardTable 
        title="商品清單"
        columns={columns}
        data={products}
        exportFileName="products"
        emptyMessage="沒有找到符合條件的商品"
      />
    </div>
  );
};

export default AdminProducts;
