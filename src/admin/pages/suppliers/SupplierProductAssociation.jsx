import React, { useState, useEffect } from 'react';
import supplierDataManager from '../../data/supplierDataManager';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const SupplierProductAssociation = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statistics, setStatistics] = useState({});

  const [formData, setFormData] = useState({
    supplierId: '',
    productId: '',
    supplierProductCode: '',
    supplierProductName: '',
    supplierPrice: '',
    currency: 'TWD',
    minOrderQuantity: '',
    maxOrderQuantity: '',
    leadTimeDays: '',
    availability: 'in_stock',
    supplierStock: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedSupplier, searchQuery]);

  const loadData = () => {
    // 載入供應商列表
    const allSuppliers = supplierDataManager.getAllSuppliers();
    setSuppliers(allSuppliers);

    // 載入供應商商品關聯
    let products = [];
    if (selectedSupplier) {
      products = supplierDataManager.getSupplierProducts(selectedSupplier);
    } else {
      // 載入所有供應商商品關聯
      allSuppliers.forEach(supplier => {
        const supplierProducts = supplierDataManager.getSupplierProducts(supplier.id);
        products = [...products, ...supplierProducts];
      });
    }

    // 搜尋篩選
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.supplierProductName.toLowerCase().includes(searchTerm) ||
        product.supplierProductCode.toLowerCase().includes(searchTerm)
      );
    }

    setSupplierProducts(products);

    // 計算統計資料
    calculateStatistics(products, allSuppliers);
  };

  const calculateStatistics = (products, allSuppliers) => {
    const stats = {
      totalSuppliers: allSuppliers.length,
      totalAssociations: products.length,
      activeSuppliers: allSuppliers.filter(s => s.status === 'active').length,
      averagePrice: products.length > 0 ? 
        products.reduce((sum, p) => sum + p.supplierPrice, 0) / products.length : 0,
      availabilityDistribution: {
        in_stock: products.filter(p => p.availability === 'in_stock').length,
        limited_stock: products.filter(p => p.availability === 'limited_stock').length,
        out_of_stock: products.filter(p => p.availability === 'out_of_stock').length
      }
    };
    setStatistics(stats);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      supplierPrice: parseFloat(formData.supplierPrice),
      minOrderQuantity: parseInt(formData.minOrderQuantity),
      maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity) : null,
      leadTimeDays: parseInt(formData.leadTimeDays),
      supplierStock: formData.supplierStock ? parseInt(formData.supplierStock) : null
    };

    if (editingProduct) {
      // 更新邏輯（這裡需要在 supplierDataManager 中添加更新方法）
      console.log('Update product association:', submitData);
    } else {
      const result = supplierDataManager.createSupplierProduct(submitData);
      if (result.success) {
        loadData();
        resetForm();
      } else {
        alert('新增失敗：' + result.error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      productId: '',
      supplierProductCode: '',
      supplierProductName: '',
      supplierPrice: '',
      currency: 'TWD',
      minOrderQuantity: '',
      maxOrderQuantity: '',
      leadTimeDays: '',
      availability: 'in_stock',
      supplierStock: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData({
      supplierId: product.supplierId,
      productId: product.productId,
      supplierProductCode: product.supplierProductCode,
      supplierProductName: product.supplierProductName,
      supplierPrice: product.supplierPrice.toString(),
      currency: product.currency,
      minOrderQuantity: product.minOrderQuantity.toString(),
      maxOrderQuantity: product.maxOrderQuantity?.toString() || '',
      leadTimeDays: product.leadTimeDays.toString(),
      availability: product.availability,
      supplierStock: product.supplierStock?.toString() || '',
      notes: product.notes || ''
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const getAvailabilityBadge = (availability) => {
    const config = {
      in_stock: { 
        label: '有庫存', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      limited_stock: { 
        label: '庫存不足', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: ExclamationTriangleIcon
      },
      out_of_stock: { 
        label: '缺貨', 
        className: 'bg-red-100 text-red-800',
        icon: XCircleIcon
      },
      discontinued: { 
        label: '停產', 
        className: 'bg-gray-100 text-gray-800',
        icon: XCircleIcon
      }
    };

    const item = config[availability];
    const IconComponent = item.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.className}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {item.label}
      </span>
    );
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.companyName : '未知供應商';
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">總供應商</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalSuppliers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">關聯總數</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalAssociations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">平均價格</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics.averagePrice ? statistics.averagePrice.toFixed(0) : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">庫存不足</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.availabilityDistribution?.limited_stock || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 篩選工具列 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">

            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="">全部供應商</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.companyName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新增關聯</span>
          </button>
        </div>
      </div>

      {/* 新增/編輯表單 */}
      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProduct ? '編輯' : '新增'}商品關聯
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    供應商 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value="">請選擇供應商</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    placeholder="請輸入商品ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    供應商商品代碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="supplierProductCode"
                    value={formData.supplierProductCode}
                    onChange={handleInputChange}
                    required
                    placeholder="請輸入供應商商品代碼"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    供應商商品名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="supplierProductName"
                    value={formData.supplierProductName}
                    onChange={handleInputChange}
                    required
                    placeholder="請輸入供應商商品名稱"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    供貨價格 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="supplierPrice"
                      value={formData.supplierPrice}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent bg-gray-50"
                    >
                      <option value="TWD">TWD</option>
                      <option value="USD">USD</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最小訂購量 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="minOrderQuantity"
                    value={formData.minOrderQuantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">交期（天）</label>
                  <input
                    type="number"
                    name="leadTimeDays"
                    value={formData.leadTimeDays}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="7"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">庫存狀態</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="glass-select w-full font-chinese"
                  >
                    <option value="in_stock">有庫存</option>
                    <option value="limited_stock">庫存不足</option>
                    <option value="out_of_stock">缺貨</option>
                    <option value="discontinued">停產</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="輸入備註資訊..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  {editingProduct ? '更新' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 商品關聯表格 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  供應商
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  價格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  訂購量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  交期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  庫存狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {supplierProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getSupplierName(product.supplierId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.supplierProductName}
                      </div>
                      <div className="text-sm text-gray-500">
                        代碼: {product.supplierProductCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.supplierPrice.toLocaleString()} {product.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      最小: {product.minOrderQuantity.toLocaleString()}
                      {product.maxOrderQuantity && (
                        <div className="text-xs text-gray-500">
                          最大: {product.maxOrderQuantity.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
                      {product.leadTimeDays} 天
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getAvailabilityBadge(product.availability)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="編輯"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('確定要刪除這個關聯嗎？')) {
                            // 刪除邏輯
                            console.log('Delete product association:', product.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="刪除"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {supplierProducts.length === 0 && (
          <div className="text-center py-12">
            <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">沒有找到商品關聯</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedSupplier
                ? '嘗試調整搜尋條件'
                : '開始新增商品關聯'
              }
            </p>
            {!searchQuery && !selectedSupplier && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#cc824d] hover:bg-[#b3723f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc824d]"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  新增商品關聯
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierProductAssociation;