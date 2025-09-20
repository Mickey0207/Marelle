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
import SearchableSelect from "@shared/components/SearchableSelect";

const ProductAnalytics = () => {
  const [productData, setProductData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [activeTab, setActiveTab] = useState('performance');
  const [sortBy, setSortBy] = useState('revenue');
  const [loading, setLoading] = useState(true);

  const categoryOptions = [
    { value: 'all', label: '?�部?��?' },
    { value: 'jewelry', label: '?�寶首飾' },
    { value: 'accessories', label: '?�件飾�?' },
    { value: 'luxury', label: '精�??��?' },
    { value: 'gift', label: '禮�?套�?' }
  ];

  const tabOptions = [
    { value: 'performance', label: '?��?表現', icon: ChartBarIcon },
    { value: 'inventory', label: '庫�??��?', icon: CubeIcon },
    { value: 'forecast', label: '?�求�?�?, icon: ArrowTrendingUpIcon },
    { value: 'optimization', label: '組�??��?', icon: SparklesIcon },
    { value: 'competitor', label: '競�??��?', icon: BuildingStorefrontIcon }
  ];

  const sortOptions = [
    { value: 'revenue', label: '?��??��?�? },
    { value: 'quantity', label: '?�銷?��?�? },
    { value: 'growth', label: '?��??��??��?' },
    { value: 'margin', label: '?�利潤�??��?' },
    { value: 'rating', label: '?��??��?�? }
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
      console.error('載入?��??��?失�?:', error);
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

  // 模擬?��??��?
  const mockProductMetrics = {
    totalProducts: { value: 1250, trend: 5.2, label: '總�??�數' },
    activeProducts: { value: 980, trend: 3.8, label: '?�售?��?' },
    topPerformers: { value: 125, trend: 15.6, label: '?�銷?��?' },
    lowStock: { value: 45, trend: -8.3, label: '低庫存�?�? },
    avgRating: { value: 4.3, trend: 2.1, label: '平�?評�?' },
    avgMargin: { value: 35.8, trend: 1.2, label: '平�??�潤?? },
    conversionRate: { value: 12.5, trend: 4.7, label: '?��?轉�??? },
    returnRate: { value: 2.1, trend: -15.3, label: '?�貨�?' }
  };

  const mockTopProducts = [
    {
      id: 1,
      name: '經典?��??��?',
      category: '?�寶首飾',
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
      name: '?�瑰?��???,
      category: '?�寶首飾',
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
      name: '?�石?�環套�?',
      category: '?�寶首飾',
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
      name: '翡�??�鐲',
      category: '精�??��?',
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
      name: '?�飾�???,
      category: '?�件飾�?',
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
    { category: '?�寶首飾', total: 450, inStock: 380, lowStock: 45, outOfStock: 25 },
    { category: '?�件飾�?', total: 320, inStock: 285, lowStock: 25, outOfStock: 10 },
    { category: '精�??��?', total: 180, inStock: 156, lowStock: 15, outOfStock: 9 },
    { category: '禮�?套�?', total: 300, inStock: 267, lowStock: 23, outOfStock: 10 }
  ];

  const mockForecastData = [
    { product: '經典?��??��?', currentSales: 125, predictedSales: 145, confidence: 85, trend: 'increasing' },
    { product: '?�瑰?��???, currentSales: 98, predictedSales: 112, confidence: 78, trend: 'increasing' },
    { product: '?�石?�環套�?', currentSales: 87, predictedSales: 95, confidence: 82, trend: 'stable' },
    { product: '翡�??�鐲', currentSales: 65, predictedSales: 85, confidence: 90, trend: 'increasing' },
    { product: '?�飾�???, currentSales: 156, predictedSales: 148, confidence: 75, trend: 'decreasing' }
  ];

  const mockOptimizationSuggestions = [
    {
      type: 'cross-sell',
      title: '交�??�售機�?',
      description: '?��??��??�玫?��??��??��??�售',
      impact: '?�估?��? 15% ?�收',
      confidence: 82
    },
    {
      type: 'pricing',
      title: '?�格?��?建議',
      description: '?�飾�??�價?��?�?5% ?��??�銷??,
      impact: '?�估?��? 23% ?��?',
      confidence: 76
    },
    {
      type: 'inventory',
      title: '庫�?調整建議',
      description: '翡�??�鐲?�要�?貨�?建議增�?庫�?',
      impact: '?��?缺貨?�失',
      confidence: 95
    },
    {
      type: 'promotion',
      title: '促銷策略建議',
      description: '?�件飾�?類別?��??��?促銷',
      impact: '?�估?��? 18% 轉�???,
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
      case 'critical': return '緊急�?�?;
      case 'low': return '庫�??��?';
      case 'normal': return '庫�?�?��';
      default: return '?�?�未??;
    }
  };

  const renderPerformanceTab = () => (
    <>
      {/* ?��??��? */}
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
                <span className="text-xs text-gray-500">vs 上�?</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ?�銷?��??��? */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            ?��?表現?��?
          </h3>
          
          <div className="flex items-center space-x-4">
            <SearchableSelect
              options={sortOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={sortBy}
              onChange={setSortBy}
              placeholder="?��??��??��?"
              className="min-w-[140px] text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">?��??�稱</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?�收</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?��?</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?�長??/th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?�潤??/th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">評�?</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">庫�??�??/th>
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
          庫�??�況�???
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInventoryData.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">{category.category}</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">總�??�數</span>
                  <span className="font-bold text-gray-900">{formatNumber(category.total)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">�?��庫�?</span>
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
                    <span className="text-sm text-orange-700">低庫�?/span>
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
          ?�求�?測�???
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
                    {item.trend === 'increasing' ? '上�?趨勢' :
                     item.trend === 'decreasing' ? '下�?趨勢' : '穩�?趨勢'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">?��??��?</span>
                  <p className="font-bold text-gray-900">{formatNumber(item.currentSales)}</p>
                </div>
                <div>
                  <span className="text-gray-600">?�測?��?</span>
                  <p className="font-bold text-gray-900">{formatNumber(item.predictedSales)}</p>
                </div>
                <div>
                  <span className="text-gray-600">?�測信�?�?/span>
                  <p className="font-bold text-gray-900">{formatPercentage(item.confidence)}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>?�測準確�?/span>
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
          ?�能?��?建議
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
                      <span className="text-xs text-gray-500">信�?�?</span>
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
          競�??��?
        </h3>
        
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">競�??��??�能?�發�?/h4>
          <p className="text-gray-600">?��??�出完整?�競?�價?�監?��?市場?��??�能</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* ?�面標�??�控?��? */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">?��??��?</h1>
            <p className="text-gray-600">深度?��??��?表現，優?��??��??��?庫�?策略</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchableSelect
              options={categoryOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="?��??��??��?"
              className="min-w-[160px]"
            />
            
            <SearchableSelect
              options={[
                { value: '7days', label: '?��?�? },
                { value: '30days', label: '?��?0�? },
                { value: '90days', label: '?��?0�? },
                { value: '1year', label: '?��?�? }
              ]}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="?��??��?範�?"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* ?�籤導航 */}
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

        {/* ?�籤?�容 */}
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
