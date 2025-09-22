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
import analyticsDataManager from '../../../lib/data/analytics/analyticsDataManager';
import SearchableSelect from "../../components/ui/SearchableSelect";

const ProductAnalytics = () => {
  const [productData, setProductData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('sales');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState('sales');
  const [isLoading, setIsLoading] = useState(false);

  // 模擬商品預測數據
  const forecastData = [
    { product: '玉石系列', currentSales: 98, predictedSales: 112, confidence: 78, trend: 'increasing' },
    { product: '寶石戒套系列', currentSales: 87, predictedSales: 95, confidence: 82, trend: 'stable' },
    { product: '翡翠手鍊', currentSales: 65, predictedSales: 85, confidence: 90, trend: 'increasing' },
    { product: '首飾系列', currentSales: 156, predictedSales: 148, confidence: 75, trend: 'decreasing' }
  ];

  // 獲取商品分析數據
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const data = analyticsDataManager.getProductAnalytics({
          category: selectedCategory,
          period: selectedPeriod,
          priceRange,
          searchTerm
        });
        setProductData(data);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedCategory, selectedPeriod, priceRange, searchTerm]);

  // 計算總覽數據
  const calculateOverviewStats = () => {
    if (!productData.products) return {};
    
    const products = productData.products;
    const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.soldUnits), 0);
    const totalUnits = products.reduce((sum, product) => sum + product.soldUnits, 0);
    const avgPrice = products.length > 0 ? totalRevenue / totalUnits : 0;
    const topPerformer = products.sort((a, b) => (b.price * b.soldUnits) - (a.price * a.soldUnits))[0];

    return {
      totalRevenue,
      totalUnits,
      avgPrice,
      topPerformer,
      productsCount: products.length
    };
  };

  const overviewStats = calculateOverviewStats();

  // 商品表現統計
  const getPerformanceMetrics = () => {
    if (!productData.products) return [];
    
    return productData.products.map(product => ({
      ...product,
      revenue: product.price * product.soldUnits,
      conversionRate: ((product.soldUnits / product.views) * 100).toFixed(1),
      avgRating: product.ratings || 4.2
    }));
  };

  const performanceMetrics = getPerformanceMetrics();

  // 分類篩選選項
  const categoryOptions = [
    { value: 'all', label: '全部分類' },
    { value: 'jewelry', label: '珠寶首飾' },
    { value: 'accessories', label: '配件' },
    { value: 'luxury', label: '奢侈品' },
    { value: 'traditional', label: '傳統工藝' }
  ];

  // 時間篩選選項
  const periodOptions = [
    { value: '7days', label: '近7天' },
    { value: '30days', label: '近30天' },
    { value: '90days', label: '近90天' },
    { value: '1year', label: '近1年' }
  ];

  // 渲染預測卡片
  const renderForecastCard = (forecast) => (
    <div key={forecast.product} className="bg-white/20 backdrop-blur-md rounded-lg p-4 border border-white/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-amber-800">{forecast.product}</h4>
        <div className={`flex items-center space-x-1 ${
          forecast.trend === 'increasing' ? 'text-green-600' : 
          forecast.trend === 'decreasing' ? 'text-red-600' : 'text-amber-600'
        }`}>
          {forecast.trend === 'increasing' && <ArrowTrendingUpIcon className="w-4 h-4" />}
          {forecast.trend === 'decreasing' && <ArrowTrendingDownIcon className="w-4 h-4" />}
          {forecast.trend === 'stable' && <ArrowPathIcon className="w-4 h-4" />}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-amber-600">目前銷量</p>
          <p className="font-semibold text-amber-800">{forecast.currentSales}</p>
        </div>
        <div>
          <p className="text-amber-600">預測銷量</p>
          <p className="font-semibold text-amber-800">{forecast.predictedSales}</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-amber-600 text-xs">預測信心度</span>
          <span className="text-amber-800 font-medium text-xs">{forecast.confidence}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${forecast.confidence}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // 渲染商品效能表格
  const renderPerformanceTable = () => (
    <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-lg font-semibold text-amber-800 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          商品效能分析
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">商品</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">銷量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">營收</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">轉換率</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">評分</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {performanceMetrics.slice(0, 10).map((product, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.image || '/api/placeholder/40/40'} alt={product.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-amber-800">{product.name}</div>
                      <div className="text-sm text-amber-600">NT$ {product.price?.toLocaleString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{product.soldUnits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">NT$ {product.revenue?.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{product.conversionRate}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-amber-800">{product.avgRating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 10 ? '充足' : product.stock > 0 ? '偏低' : '缺貨'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 智能建議組件
  const SmartRecommendations = () => {
    const recommendations = [
      {
        type: 'pricing',
        title: '價格分析建議',
        description: '首飾系列建議降價 5% 以提升銷量',
        impact: '預估提升 23% 銷量',
        priority: 'high',
        icon: CurrencyDollarIcon
      },
      {
        type: 'inventory',
        title: '庫存優化建議',
        description: '翡翠手鍊需要補貨，預測需求將上升',
        impact: '避免缺貨損失 15%',
        priority: 'medium',
        icon: CubeIcon
      },
      {
        type: 'marketing',
        title: '行銷策略建議',
        description: '玉石系列適合推廣，轉換率較高',
        impact: '潛在收益增加 18%',
        priority: 'medium',
        icon: SparklesIcon
      }
    ];

    return (
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`bg-white/20 backdrop-blur-md rounded-lg p-4 border-l-4 ${
            rec.priority === 'high' ? 'border-red-400' :
            rec.priority === 'medium' ? 'border-yellow-400' : 'border-green-400'
          } border-r border-t border-b border-white/30`}>
            <div className="flex items-start space-x-3">
              <rec.icon className={`w-6 h-6 mt-1 ${
                rec.priority === 'high' ? 'text-red-500' :
                rec.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-1">{rec.title}</h4>
                <p className="text-amber-600 text-sm mb-2">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-700 text-xs font-medium">{rec.impact}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {rec.priority === 'high' ? '高優先級' : rec.priority === 'medium' ? '中優先級' : '低優先級'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題與篩選器 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-800 mb-2">商品分析</h1>
          <p className="text-amber-600">深入了解商品效能與銷售趨勢</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <SearchableSelect
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="選擇分類"
            className="min-w-[150px]"
          />
          <SearchableSelect
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="選擇時間"
            className="min-w-[150px]"
          />
        </div>
      </div>

      {/* 總覽統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">總營收</p>
              <p className="text-2xl font-bold text-amber-800">NT$ {overviewStats.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">總銷量</p>
              <p className="text-2xl font-bold text-amber-800">{overviewStats.totalUnits?.toLocaleString() || '0'}</p>
            </div>
            <ShoppingCartIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">平均單價</p>
              <p className="text-2xl font-bold text-amber-800">NT$ {Math.round(overviewStats.avgPrice || 0).toLocaleString()}</p>
            </div>
            <TagIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">商品數量</p>
              <p className="text-2xl font-bold text-amber-800">{overviewStats.productsCount || 0}</p>
            </div>
            <CubeIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 商品效能表格 - 占2列 */}
        <div className="lg:col-span-2">
          {renderPerformanceTable()}
        </div>

        {/* 右側面板 */}
        <div className="space-y-6">
          {/* 銷售預測 */}
          <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                銷售預測
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {forecastData.map(renderForecastCard)}
            </div>
          </div>

          {/* 智能建議 */}
          <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                智能建議
              </h3>
            </div>
            <div className="p-6">
              <SmartRecommendations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;