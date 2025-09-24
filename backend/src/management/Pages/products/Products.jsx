import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import StandardTable from "../../components/ui/StandardTable";
import ProductQuickViewModal from "../../components/products/ProductQuickViewModal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
// 改用擴充後的模擬商品資料（包含新增/編輯頁完整欄位）
import { mockProducts, formatPrice } from "../../../lib/data/products/mockProductData";
import { ADMIN_STYLES, GSAP_ANIMATIONS, getStatusColor } from "../../../lib/ui/adminStyles";
// withPageTabs HOC 已移除，子頁籤導航統一在頂部管理

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };
  const closeQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProduct(null);
  };

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
      render: (_, product) => {
        const cover = product?.image || product?.images?.[0]?.url || '/placeholder-image.jpg';
        return (
          <div className="flex items-center">
            <img
              src={cover}
              alt={product?.name || '產品圖片'}
              className="w-12 h-12 object-cover rounded-lg mr-4"
            />
            <div>
              <div className="font-medium text-gray-900 font-chinese">
                {product?.name || '未知商品'}
              </div>
              <div className="text-sm text-gray-500 font-chinese">
                SKU: {product?.baseSKU || 'N/A'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: '類別',
      sortable: true,
      render: (_, product) => {
        const categoryName = product?.category || product?.categories?.[0]?.name || '未分類';
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-apricot-100 text-apricot-800 rounded-full font-chinese">
            {categoryName}
          </span>
        );
      }
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (_, product) => (
        <span className="font-mono text-sm text-gray-800">{product?.baseSKU || '-'}</span>
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
      key: 'slug',
      label: 'Slug',
      sortable: true,
      render: (_, product) => (
        <span className="text-xs text-gray-600">{product?.slug || '-'}</span>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, product) => {
        const raw = (product?.status || 'draft');
        const map = {
          active: { text: '上架', color: 'bg-green-100 text-green-800' },
          draft: { text: '草稿', color: 'bg-yellow-100 text-yellow-800' },
          archived: { text: '封存', color: 'bg-gray-100 text-gray-800' }
        };
        const { text, color } = map[raw] || map.draft;
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'visibility',
      label: '可見性',
      sortable: true,
      render: (_, product) => {
        const raw = (product?.visibility || 'visible');
        const map = {
          visible: { text: '可見', color: 'bg-blue-100 text-blue-800' },
          hidden: { text: '隱藏', color: 'bg-gray-100 text-gray-800' }
        };
        const { text, color } = map[raw] || map.visible;
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'variants',
      label: '多變體',
      sortable: true,
      render: (_, product) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product?.hasVariants ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
          {product?.hasVariants ? '是' : '否'}
        </span>
      )
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
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" onClick={() => openQuickView(product)}>
            <EyeIcon className="w-4 h-4" />
          </button>
          <Link
            to={`/products/edit/${product?.baseSKU}`}
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
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerStandard}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>商品管理</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>
              管理商品資訊、庫存和雜貨
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Link 
              to="/products/add"
              className="inline-flex items-center px-6 py-3 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-md hover:shadow-lg font-chinese"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              新增商品
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
          <StandardTable 
            title="商品清單"
            columns={columns}
            data={products}
            exportFileName="products"
            emptyMessage="沒有找到符合條件的商品"
          />
        </div>

        {/* 快速檢視彈窗 */}
        <ProductQuickViewModal 
          open={quickViewOpen}
          onClose={closeQuickView}
          product={quickViewProduct}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
