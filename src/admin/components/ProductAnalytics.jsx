import React, { useState, useEffect } from 'react';
import {
  ShoppingBagIcon,
  ChartBarIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  HeartIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  ArrowPathIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import analyticsDataManager from '../utils/analyticsDataManager';
import SearchableSelect from '../../components/SearchableSelect';

const ProductAnalytics = () => {
  const [productData, setProductData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [activeTab, setActiveTab] = useState('performance');
  const [sortBy, setSortBy] = useState('revenue');
  const [loading, setLoading] = useState(true);

  const categoryOptions = [
    { value: 'all', label: '全部分類' },
    { value: 'jewelry', label: '珠寶首飾' },
    { value: 'accessories', label: '配件飾品' },
    { value: 'luxury', label: '精品收藏' },
    { value: 'gift', label: '禮品套組' }
  ];

  const tabOptions = [
    { value: 'performance', label: '商品表現', icon: ChartBarIcon },
    { value: 'inventory', label: '庫存分析', icon: CubeIcon },
    { value: 'forecast', label: '需求預測', icon: ArrowTrendingUpIcon },
    { value: 'optimization', label: '組合優化', icon: SparklesIcon },
    { value: 'competitor', label: '競品分析', icon: BuildingStorefrontIcon }
  ];

  const sortOptions = [
    { value: 'revenue', label: '按營收排序' },
    { value: 'quantity', label: '按銷量排序' },
    { value: 'growth', label: '按成長率排序' },
    { value: 'margin', label: '按利潤率排序' },
    { value: 'rating', label: '按評分排序' }
  ];

  useEffect(() => {
    loadProductData();
  }, [selectedCategory, selectedPeriod, activeTab, sortBy]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      const data = analyticsDataManager.getProductAnalytics(selectedCategory, selectedPeriod, activeTab);
      setProductData(data);
    } catch (error) {
      console.error('載入商品數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('zh-TW').format(num || 0);
  };

  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`;
  };

  // 模擬商品數據
  const mockProductMetrics = {
    totalProducts: { value: 1250, trend: 5.2, label: '總商品數' },
    activeProducts: { value: 980, trend: 3.8, label: '在售商品' },
    topPerformers: { value: 125, trend: 15.6, label: '熱銷商品' },
    lowStock: { value: 45, trend: -8.3, label: '低庫存預警' },
    avgRating: { value: 4.3, trend: 2.1, label: '平均評分' },
    avgMargin: { value: 35.8, trend: 1.2, label: '平均利潤率' },
    conversionRate: { value: 12.5, trend: 4.7, label: '商品轉換率' },
    returnRate: { value: 2.1, trend: -15.3, label: '退貨率' }
  };

  const mockTopProducts = [
    {
      id: 1,
      name: '經典珍珠項鍊',
      category: '珠寶首飾',
      revenue: 356250,
      quantity: 125,
      growth: 18.5,
      margin: 42.3,
      rating: 4.8,
      reviews: 89,
      stock: 45,
      stockStatus: 'normal',
      trend: 'up'
    },
    {
      id: 2,
      name: '玫瑰金手鍊',
      category: '珠寶首飾',
      revenue: 298000,
      quantity: 98,
      growth: 12.3,
      margin: 38.7,
      rating: 4.6,
      reviews: 72,
      stock: 23,
      stockStatus: 'low',
      trend: 'up'
    },
    {
      id: 3,
      name: '鑽石耳環套組',
      category: '珠寶首飾',
      revenue: 517500,
      quantity: 87,
      growth: 8.7,
      margin: 52.1,
      rating: 4.9,
      reviews: 156,
      stock: 78,
      stockStatus: 'normal',
      trend: 'up'
    },
    {
      id: 4,
      name: '翡翠玉鐲',
      category: '精品收藏',
      revenue: 195000,
      quantity: 65,
      growth: 25.6,
      margin: 35.2,
      rating: 4.4,
      reviews: 43,
      stock: 12,
      stockStatus: 'critical',
      trend: 'up'
    },
    {
      id: 5,
      name: '銀飾戒指',
      category: '配件飾品',
      revenue: 62400,
      quantity: 156,
      growth: -3.2,
      margin: 28.9,
      rating: 4.2,
      reviews: 98,
      stock: 89,
      stockStatus: 'normal',
      trend: 'down'
    }
  ];

  const mockInventoryData = [
    { category: '珠寶首飾', total: 450, inStock: 380, lowStock: 45, outOfStock: 25 },
    { category: '配件飾品', total: 320, inStock: 285, lowStock: 25, outOfStock: 10 },
    { category: '精品收藏', total: 180, inStock: 156, lowStock: 15, outOfStock: 9 },
    { category: '禮品套組', total: 300, inStock: 267, lowStock: 23, outOfStock: 10 }
  ];

  const mockForecastData = [
    { product: '經典珍珠項鍊', currentSales: 125, predictedSales: 145, confidence: 85, trend: 'increasing' },
    { product: '玫瑰金手鍊', currentSales: 98, predictedSales: 112, confidence: 78, trend: 'increasing' },
    { product: '鑽石耳環套組', currentSales: 87, predictedSales: 95, confidence: 82, trend: 'stable' },
    { product: '翡翠玉鐲', currentSales: 65, predictedSales: 85, confidence: 90, trend: 'increasing' },
    { product: '銀飾戒指', currentSales: 156, predictedSales: 148, confidence: 75, trend: 'decreasing' }
  ];

  const mockOptimizationSuggestions = [
    {
      type: 'cross-sell',
      title: '交叉銷售機會',
      description: '珍珠項鍊與玫瑰金手鍊搭配銷售',
      impact: '預估提升 15% 營收',
      confidence: 82
    },
    {
      type: 'pricing',
      title: '價格優化建議',
      description: '銀飾戒指價格下調 5% 可提升銷量',
      impact: '預估提升 23% 銷量',
      confidence: 76
    },
    {
      type: 'inventory',
      title: '庫存調整建議',
      description: '翡翠玉鐲需要補貨，建議增加庫存',
      impact: '避免缺貨損失',
      confidence: 95
    },
    {
      type: 'promotion',
      title: '促銷策略建議',
      description: '配件飾品類別適合打包促銷',
      impact: '預估提升 18% 轉換率',
      confidence: 71
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up' || trend > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
    if (trend === 'down' || trend < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up' || trend > 0) return 'text-green-600';
    if (trend === 'down' || trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'low': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'critical': return '緊急補貨';
      case 'low': return '庫存偏低';
      case 'normal': return '庫存正常';
      default: return '狀態未知';
    }
  };

  const renderPerformanceTab = () => (
    <>
      {/* 核心指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(mockProductMetrics).map(([key, metric]) => (
          <div key={key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {key === 'avgRating' ? 
                  `${metric.value}/5.0` :
                  key.includes('Rate') || key === 'avgMargin' ? 
                  formatPercentage(metric.value) :
                  formatNumber(metric.value)
                }
              </p>
              
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {Math.abs(metric.trend).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs 上期</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 熱銷商品排行 */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            商品表現排行
          </h3>
          
          <div className="flex items-center space-x-4">
            <SearchableSelect
              options={sortOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={sortBy}
              onChange={setSortBy}
              placeholder="選擇排序方式"
              className="min-w-[140px] text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">商品名稱</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">營收</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">銷量</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">成長率</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">利潤率</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">評分</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">庫存狀態</th>
              </tr>
            </thead>
            <tbody>
              {mockTopProducts.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {formatNumber(product.quantity)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${getTrendColor(product.growth)}`}>
                      {getTrendIcon(product.growth)}
                      <span className="font-medium">
                        {Math.abs(product.growth).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {formatPercentage(product.margin)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStockStatusColor(product.stockStatus)}`}>
                      {getStockStatusText(product.stockStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <CubeIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          庫存狀況分析
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInventoryData.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">{category.category}</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">總商品數</span>
                  <span className="font-bold text-gray-900">{formatNumber(category.total)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">正常庫存</span>
                    <span className="font-medium text-green-700">{formatNumber(category.inStock)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(category.inStock / category.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700">低庫存</span>
                    <span className="font-medium text-orange-700">{formatNumber(category.lowStock)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(category.lowStock / category.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">缺貨</span>
                    <span className="font-medium text-red-700">{formatNumber(category.outOfStock)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(category.outOfStock / category.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderForecastTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          需求預測分析
        </h3>
        
        <div className="space-y-4">
          {mockForecastData.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{item.product}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                    item.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.trend === 'increasing' ? '上升趨勢' :
                     item.trend === 'decreasing' ? '下降趨勢' : '穩定趨勢'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">當期銷量</span>
                  <p className="font-bold text-gray-900">{formatNumber(item.currentSales)}</p>
                </div>
                <div>
                  <span className="text-gray-600">預測銷量</span>
                  <p className="font-bold text-gray-900">{formatNumber(item.predictedSales)}</p>
                </div>
                <div>
                  <span className="text-gray-600">預測信心度</span>
                  <p className="font-bold text-gray-900">{formatPercentage(item.confidence)}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>預測準確度</span>
                  <span>{formatPercentage(item.confidence)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#cc824d] h-2 rounded-full"
                    style={{ width: `${item.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOptimizationTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          智能優化建議
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockOptimizationSuggestions.map((suggestion, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  suggestion.type === 'cross-sell' ? 'bg-blue-100' :
                  suggestion.type === 'pricing' ? 'bg-green-100' :
                  suggestion.type === 'inventory' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  {suggestion.type === 'cross-sell' && <ShoppingCartIcon className="h-5 w-5 text-blue-600" />}
                  {suggestion.type === 'pricing' && <TagIcon className="h-5 w-5 text-green-600" />}
                  {suggestion.type === 'inventory' && <CubeIcon className="h-5 w-5 text-orange-600" />}
                  {suggestion.type === 'promotion' && <SparklesIcon className="h-5 w-5 text-purple-600" />}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">{suggestion.impact}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">信心度:</span>
                      <span className="text-xs font-medium text-gray-700">{suggestion.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${suggestion.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetitorTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          競品分析
        </h3>
        
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">競品分析功能開發中</h4>
          <p className="text-gray-600">即將推出完整的競品價格監控和市場分析功能</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* 頁面標題和控制項 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">商品分析</h1>
            <p className="text-gray-600">深度分析商品表現，優化商品組合與庫存策略</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchableSelect
              options={categoryOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="選擇商品分類"
              className="min-w-[160px]"
            />
            
            <SearchableSelect
              options={[
                { value: '7days', label: '最近7天' },
                { value: '30days', label: '最近30天' },
                { value: '90days', label: '最近90天' },
                { value: '1year', label: '最近1年' }
              ]}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="選擇時間範圍"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* 頁籤導航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabOptions.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;
              
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-[#cc824d] text-[#cc824d]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 頁籤內容 */}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'inventory' && renderInventoryTab()}
        {activeTab === 'forecast' && renderForecastTab()}
        {activeTab === 'optimization' && renderOptimizationTab()}
        {activeTab === 'competitor' && renderCompetitorTab()}
      </div>
    </div>
  );
};

export default ProductAnalytics;