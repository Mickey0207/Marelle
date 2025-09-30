import React, { useState, useEffect } from 'react';
import {
  CogIcon,
  TruckIcon,
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  ScaleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ChartPieIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import analyticsDataManager from '../../../../external_mock/analytics/analyticsDataManager';

const OperationalAnalytics = () => {
  const [operationalData, setOperationalData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('efficiency');
  const [loading, setLoading] = useState(true);

  const tabOptions = [
    { value: 'overview', label: '營運總覽', icon: ChartBarIcon },
    { value: 'supply-chain', label: '供應鏈', icon: TruckIcon },
    { value: 'logistics', label: '物流分析', icon: MapPinIcon },
    { value: 'inventory', label: '庫存管理', icon: CubeIcon },
    { value: 'cost', label: '成本分析', icon: CurrencyDollarIcon },
    { value: 'performance', label: '績效監控', icon: BoltIcon }
  ];

  const periodOptions = [
    { value: '7days', label: '最近7天' },
    { value: '30days', label: '最近30天' },
    { value: '90days', label: '最近90天' },
    { value: '1year', label: '最近1年' }
  ];

  useEffect(() => {
    loadOperationalData();
  }, [selectedPeriod, activeTab, selectedMetric]);

  const loadOperationalData = async () => {
    setLoading(true);
    try {
      const data = analyticsDataManager.getOperationalAnalytics(selectedPeriod, activeTab);
      setOperationalData(data);
    } catch (error) {
      console.error('載入營運數據失敗:', error);
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

  // 模擬營運數據
  const mockOperationalMetrics = {
    orderFulfillment: { value: 96.8, trend: 2.1, label: '訂單履行率', unit: '%' },
    avgProcessingTime: { value: 1.2, trend: -8.5, label: '平均處理時間', unit: '天' },
    inventoryTurnover: { value: 8.5, trend: 12.3, label: '庫存周轉率', unit: '次/年' },
    supplierReliability: { value: 94.2, trend: 1.8, label: '供應商可靠性', unit: '%' },
    shippingAccuracy: { value: 98.5, trend: 0.7, label: '配送準確率', unit: '%' },
    returnRate: { value: 2.3, trend: -15.2, label: '退貨率', unit: '%' },
    costEfficiency: { value: 87.6, trend: 5.4, label: '成本效率', unit: '%' },
    customerSatisfaction: { value: 4.4, trend: 3.2, label: '客戶滿意度', unit: '/5.0' }
  };

  const mockSupplyChainData = [
    {
      supplier: '珠寶供應商A',
      category: '珠寶首飾',
      reliability: 96.5,
      quality: 4.8,
      leadTime: 7,
      cost: 'A',
      status: 'excellent'
    },
    {
      supplier: '配件供應商B',
      category: '配件飾品',
      reliability: 92.3,
      quality: 4.5,
      leadTime: 5,
      cost: 'B',
      status: 'good'
    },
    {
      supplier: '精品供應商C',
      category: '精品收藏',
      reliability: 89.7,
      quality: 4.9,
      leadTime: 14,
      cost: 'A',
      status: 'good'
    },
    {
      supplier: '包裝供應商D',
      category: '包裝材料',
      reliability: 95.1,
      quality: 4.2,
      leadTime: 3,
      cost: 'C',
      status: 'excellent'
    }
  ];

  const mockLogisticsData = [
    { region: '台北市', orders: 1250, avgDeliveryTime: 1.2, onTimeRate: 98.5, cost: 85000 },
    { region: '新北市', orders: 980, avgDeliveryTime: 1.5, onTimeRate: 96.8, cost: 72000 },
    { region: '台中市', orders: 650, avgDeliveryTime: 2.1, onTimeRate: 94.2, cost: 58000 },
    { region: '高雄市', orders: 520, avgDeliveryTime: 2.3, onTimeRate: 92.6, cost: 48000 },
    { region: '其他地區', orders: 800, avgDeliveryTime: 3.2, onTimeRate: 89.4, cost: 85000 }
  ];

  const mockInventoryAlerts = [
    { product: '經典珍珠項鍊', category: '珠寶首飾', stock: 15, minStock: 20, status: 'low', action: '建議補貨' },
    { product: '翡翠玉鐲', category: '精品收藏', stock: 5, minStock: 15, status: 'critical', action: '緊急補貨' },
    { product: '銀飾戒指', category: '配件飾品', stock: 89, minStock: 30, status: 'normal', action: '庫存正常' },
    { product: '鑽石耳環套組', category: '珠寶首飾', stock: 78, minStock: 25, status: 'normal', action: '庫存正常' }
  ];

  const mockCostBreakdown = [
    { category: '商品採購', amount: 1850000, percentage: 45.2, trend: 2.3 },
    { category: '物流配送', amount: 348000, percentage: 8.5, trend: -1.8 },
    { category: '包裝材料', amount: 164000, percentage: 4.0, trend: 5.2 },
    { category: '倉儲費用', amount: 246000, percentage: 6.0, trend: -3.1 },
    { category: '人事成本', amount: 820000, percentage: 20.0, trend: 4.7 },
    { category: '營運費用', amount: 656000, percentage: 16.0, trend: -2.5 }
  ];

  const mockPerformanceKPIs = [
    { kpi: '訂單處理效率', current: 95.8, target: 95.0, status: 'exceed' },
    { kpi: '庫存準確性', current: 98.2, target: 98.0, status: 'exceed' },
    { kpi: '配送及時率', current: 96.5, target: 97.0, status: 'below' },
    { kpi: '成本控制率', current: 87.6, target: 85.0, status: 'exceed' },
    { kpi: '客戶滿意度', current: 88.0, target: 90.0, status: 'below' },
    { kpi: '供應商績效', current: 94.2, target: 93.0, status: 'exceed' }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'normal': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'low': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'exceed': return 'text-green-600 bg-green-50 border-green-200';
      case 'below': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'excellent': return '優秀';
      case 'good': return '良好';
      case 'normal': return '正常';
      case 'low': return '偏低';
      case 'critical': return '緊急';
      case 'exceed': return '達標';
      case 'below': return '未達標';
      default: return '未知';
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* 核心指標 */}
  <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.entries(mockOperationalMetrics).map(([key, metric]) => (
          <div key={key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {metric.value}{metric.unit}
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

      {/* 關鍵警示和洞察 */}
  <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            庫存預警
          </h3>
          
          <div className="space-y-4">
            {mockInventoryAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(alert.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{alert.product}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                    {getStatusText(alert.status)}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p>分類：{alert.category}</p>
                  <p>當前庫存：{alert.stock} / 最低庫存：{alert.minStock}</p>
                  <p className="font-medium">{alert.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ChartPieIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            成本結構分析
          </h3>
          
          <div className="space-y-4">
            {mockCostBreakdown.map((cost, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{cost.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(cost.amount)}</span>
                    <span className={`text-xs ${getTrendColor(cost.trend)}`}>
                      {cost.trend > 0 ? '+' : ''}{cost.trend.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#cc824d] h-2 rounded-full"
                      style={{ width: `${cost.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 min-w-0">
                    {cost.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderSupplyChainTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TruckIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          供應商績效分析
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">供應商</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">類別</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">可靠性</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">品質評分</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">交付時間</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">成本等級</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">整體評價</th>
              </tr>
            </thead>
            <tbody>
              {mockSupplyChainData.map((supplier, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{supplier.supplier}</td>
                  <td className="py-4 px-4 text-gray-600">{supplier.category}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{formatPercentage(supplier.reliability)}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{supplier.quality}/5.0</td>
                  <td className="py-4 px-4 text-right text-gray-900">{supplier.leadTime}天</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      supplier.cost === 'A' ? 'bg-green-100 text-green-800' :
                      supplier.cost === 'B' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {supplier.cost}級
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(supplier.status)}`}>
                      {getStatusText(supplier.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLogisticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          物流配送分析
        </h3>
        
  <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {mockLogisticsData.map((region, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{region.region}</h4>
                  <span className="text-sm text-gray-600">{formatNumber(region.orders)} 訂單</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">平均配送</span>
                    <p className="font-bold text-gray-900">{region.avgDeliveryTime}天</p>
                  </div>
                  <div>
                    <span className="text-gray-600">準時率</span>
                    <p className="font-bold text-gray-900">{formatPercentage(region.onTimeRate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">配送成本</span>
                    <p className="font-bold text-gray-900">{formatCurrency(region.cost)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">物流配送地圖</p>
              <p className="text-gray-400 text-xs">地圖組件整合中...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <CubeIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          庫存管理總覽
        </h3>
        
        <div className="text-center py-12">
          <CubeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">詳細庫存分析</h4>
          <p className="text-gray-600">請參考商品分析模組的庫存功能</p>
        </div>
      </div>
    </div>
  );

  const renderCostTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          詳細成本分析
        </h3>
        
  <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">成本趨勢分析</h4>
            <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">成本趨勢圖表</p>
                <p className="text-gray-400 text-xs">圖表組件整合中...</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">成本優化建議</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">物流成本優化</p>
                <p className="text-xs text-green-700">建議整合配送路線，預估節省8%物流成本</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">採購成本優化</p>
                <p className="text-xs text-blue-700">建議批量採購熱銷商品，預估節省5%採購成本</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-900">倉儲成本優化</p>
                <p className="text-xs text-orange-700">建議優化庫存結構，預估節省12%倉儲成本</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BoltIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          關鍵績效指標 (KPI)
        </h3>
        
  <div className="grid grid-cols-3 gap-6">
          {mockPerformanceKPIs.map((kpi, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{kpi.kpi}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(kpi.status)}`}>
                  {getStatusText(kpi.status)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">當前值</span>
                  <span className="font-bold text-gray-900">{kpi.current}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">目標值</span>
                  <span className="font-bold text-gray-900">{kpi.target}%</span>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.status === 'exceed' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* 頁面標題和控制項 */}
  <div className="flex flex-row items-center justify-between mb-8">
          <div className="mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">營運分析</h1>
            <p className="text-gray-600">監控營運效率，優化供應鏈與物流管理</p>
          </div>
          
          <div className="flex flex-row gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors flex items-center">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              刷新數據
            </button>
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
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'supply-chain' && renderSupplyChainTab()}
        {activeTab === 'logistics' && renderLogisticsTab()}
        {activeTab === 'inventory' && renderInventoryTab()}
        {activeTab === 'cost' && renderCostTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
};

export default OperationalAnalytics;