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
    { value: 'all', label: '?®ÈÉ®?ÜÈ?' },
    { value: 'jewelry', label: '?†ÂØ∂È¶ñÈ£æ' },
    { value: 'accessories', label: '?ç‰ª∂È£æÂ?' },
    { value: 'luxury', label: 'Á≤æÂ??∂Ë?' },
    { value: 'gift', label: 'Á¶ÆÂ?Â•óÁ?' }
  ];

  const tabOptions = [
    { value: 'performance', label: '?ÜÂ?Ë°®Áèæ', icon: ChartBarIcon },
    { value: 'inventory', label: 'Â∫´Â??ÜÊ?', icon: CubeIcon },
    { value: 'forecast', label: '?ÄÊ±ÇÈ?Ê∏?, icon: ArrowTrendingUpIcon },
    { value: 'optimization', label: 'ÁµÑÂ??™Â?', icon: SparklesIcon },
    { value: 'competitor', label: 'Á´∂Â??ÜÊ?', icon: BuildingStorefrontIcon }
  ];

  const sortOptions = [
    { value: 'revenue', label: '?âÁ??∂Ê?Â∫? },
    { value: 'quantity', label: '?âÈä∑?èÊ?Â∫? },
    { value: 'growth', label: '?âÊ??∑Á??íÂ?' },
    { value: 'margin', label: '?âÂà©ÊΩ§Á??íÂ?' },
    { value: 'rating', label: '?âË??ÜÊ?Â∫? }
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
      console.error('ËºâÂÖ•?ÜÂ??∏Ê?Â§±Ê?:', error);
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

  // Ê®°Êì¨?ÜÂ??∏Ê?
  const mockProductMetrics = {
    totalProducts: { value: 1250, trend: 5.2, label: 'Á∏ΩÂ??ÅÊï∏' },
    activeProducts: { value: 980, trend: 3.8, label: '?®ÂîÆ?ÜÂ?' },
    topPerformers: { value: 125, trend: 15.6, label: '?±Èä∑?ÜÂ?' },
    lowStock: { value: 45, trend: -8.3, label: '‰ΩéÂ∫´Â≠òÈ?Ë≠? },
    avgRating: { value: 4.3, trend: 2.1, label: 'Âπ≥Â?Ë©ïÂ?' },
    avgMargin: { value: 35.8, trend: 1.2, label: 'Âπ≥Â??©ÊΩ§?? },
    conversionRate: { value: 12.5, trend: 4.7, label: '?ÜÂ?ËΩâÊ??? },
    returnRate: { value: 2.1, trend: -15.3, label: '?ÄË≤®Á?' }
  };

  const mockTopProducts = [
    {
      id: 1,
      name: 'Á∂ìÂÖ∏?çÁ??ÖÈ?',
      category: '?†ÂØ∂È¶ñÈ£æ',
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
      name: '?´Áë∞?ëÊ???,
      category: '?†ÂØ∂È¶ñÈ£æ',
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
      name: '?ΩÁü≥?≥Áí∞Â•óÁ?',
      category: '?†ÂØ∂È¶ñÈ£æ',
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
      name: 'Áø°Á??âÈê≤',
      category: 'Á≤æÂ??∂Ë?',
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
      name: '?ÄÈ£æÊ???,
      category: '?ç‰ª∂È£æÂ?',
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
    { category: '?†ÂØ∂È¶ñÈ£æ', total: 450, inStock: 380, lowStock: 45, outOfStock: 25 },
    { category: '?ç‰ª∂È£æÂ?', total: 320, inStock: 285, lowStock: 25, outOfStock: 10 },
    { category: 'Á≤æÂ??∂Ë?', total: 180, inStock: 156, lowStock: 15, outOfStock: 9 },
    { category: 'Á¶ÆÂ?Â•óÁ?', total: 300, inStock: 267, lowStock: 23, outOfStock: 10 }
  ];

  const mockForecastData = [
    { product: 'Á∂ìÂÖ∏?çÁ??ÖÈ?', currentSales: 125, predictedSales: 145, confidence: 85, trend: 'increasing' },
    { product: '?´Áë∞?ëÊ???, currentSales: 98, predictedSales: 112, confidence: 78, trend: 'increasing' },
    { product: '?ΩÁü≥?≥Áí∞Â•óÁ?', currentSales: 87, predictedSales: 95, confidence: 82, trend: 'stable' },
    { product: 'Áø°Á??âÈê≤', currentSales: 65, predictedSales: 85, confidence: 90, trend: 'increasing' },
    { product: '?ÄÈ£æÊ???, currentSales: 156, predictedSales: 148, confidence: 75, trend: 'decreasing' }
  ];

  const mockOptimizationSuggestions = [
    {
      type: 'cross-sell',
      title: '‰∫§Â??∑ÂîÆÊ©üÊ?',
      description: '?çÁ??ÖÈ??áÁé´?∞È??ãÈ??≠È??∑ÂîÆ',
      impact: '?ê‰º∞?êÂ? 15% ?üÊî∂',
      confidence: 82
    },
    {
      type: 'pricing',
      title: '?πÊ†º?™Â?Âª∫Ë≠∞',
      description: '?ÄÈ£æÊ??áÂÉπ?º‰?Ë™?5% ?ØÊ??áÈä∑??,
      impact: '?ê‰º∞?êÂ? 23% ?∑È?',
      confidence: 76
    },
    {
      type: 'inventory',
      title: 'Â∫´Â?Ë™øÊï¥Âª∫Ë≠∞',
      description: 'Áø°Á??âÈê≤?ÄË¶ÅË?Ë≤®Ô?Âª∫Ë≠∞Â¢ûÂ?Â∫´Â?',
      impact: '?øÂ?Áº∫Ë≤®?çÂ§±',
      confidence: 95
    },
    {
      type: 'promotion',
      title: '‰øÉÈä∑Á≠ñÁï•Âª∫Ë≠∞',
      description: '?ç‰ª∂È£æÂ?È°ûÂà•?©Â??ìÂ?‰øÉÈä∑',
      impact: '?ê‰º∞?êÂ? 18% ËΩâÊ???,
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
      case 'critical': return 'Á∑äÊÄ•Ë?Ë≤?;
      case 'low': return 'Â∫´Â??è‰?';
      case 'normal': return 'Â∫´Â?Ê≠?∏∏';
      default: return '?Ä?ãÊú™??;
    }
  };

  const renderPerformanceTab = () => (
    <>
      {/* ?∏Â??áÊ? */}
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
                <span className="text-xs text-gray-500">vs ‰∏äÊ?</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ?±Èä∑?ÜÂ??íË? */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            ?ÜÂ?Ë°®Áèæ?íË?
          </h3>
          
          <div className="flex items-center space-x-4">
            <SearchableSelect
              options={sortOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={sortBy}
              onChange={setSortBy}
              placeholder="?∏Ê??íÂ??πÂ?"
              className="min-w-[140px] text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">?ÜÂ??çÁ®±</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?üÊî∂</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?∑È?</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?êÈï∑??/th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?©ÊΩ§??/th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Ë©ïÂ?</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Â∫´Â??Ä??/th>
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
          Â∫´Â??ÄÊ≥ÅÂ???
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInventoryData.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">{category.category}</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Á∏ΩÂ??ÅÊï∏</span>
                  <span className="font-bold text-gray-900">{formatNumber(category.total)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Ê≠?∏∏Â∫´Â?</span>
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
                    <span className="text-sm text-orange-700">‰ΩéÂ∫´Â≠?/span>
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
                    <span className="text-sm text-red-700">Áº∫Ë≤®</span>
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
          ?ÄÊ±ÇÈ?Ê∏¨Â???
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
                    {item.trend === 'increasing' ? '‰∏äÂ?Ë∂®Âã¢' :
                     item.trend === 'decreasing' ? '‰∏ãÈ?Ë∂®Âã¢' : 'Á©©Â?Ë∂®Âã¢'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">?∂Ê??∑È?</span>
                  <p className="font-bold text-gray-900">{formatNumber(item.currentSales)}</p>
                </div>
                <div>
                  <span className="text-gray-600">?êÊ∏¨?∑È?</span>
                  <p className="font-bold text-gray-900">{formatNumber(item.predictedSales)}</p>
                </div>
                <div>
                  <span className="text-gray-600">?êÊ∏¨‰ø°Â?Â∫?/span>
                  <p className="font-bold text-gray-900">{formatPercentage(item.confidence)}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>?êÊ∏¨Ê∫ñÁ¢∫Â∫?/span>
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
          ?∫ËÉΩ?™Â?Âª∫Ë≠∞
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
                      <span className="text-xs text-gray-500">‰ø°Â?Â∫?</span>
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
          Á´∂Â??ÜÊ?
        </h3>
        
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Á´∂Â??ÜÊ??üËÉΩ?ãÁôº‰∏?/h4>
          <p className="text-gray-600">?≥Â??®Âá∫ÂÆåÊï¥?ÑÁ´∂?ÅÂÉπ?ºÁõ£?ßÂ?Â∏ÇÂ†¥?ÜÊ??üËÉΩ</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* ?ÅÈù¢Ê®ôÈ??åÊéß?∂È? */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">?ÜÂ??ÜÊ?</h1>
            <p className="text-gray-600">Ê∑±Â∫¶?ÜÊ??ÜÂ?Ë°®ÁèæÔºåÂÑ™?ñÂ??ÅÁ??àË?Â∫´Â?Á≠ñÁï•</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchableSelect
              options={categoryOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="?∏Ê??ÜÂ??ÜÈ?"
              className="min-w-[160px]"
            />
            
            <SearchableSelect
              options={[
                { value: '7days', label: '?ÄËø?Â§? },
                { value: '30days', label: '?ÄËø?0Â§? },
                { value: '90days', label: '?ÄËø?0Â§? },
                { value: '1year', label: '?ÄËø?Âπ? }
              ]}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="?∏Ê??ÇÈ?ÁØÑÂ?"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* ?ÅÁ±§Â∞éËà™ */}
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

        {/* ?ÅÁ±§?ßÂÆπ */}
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
