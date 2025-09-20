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
import analyticsDataManager from '../utils/analyticsDataManager';

const OperationalAnalytics = () => {
  const [operationalData, setOperationalData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('efficiency');
  const [loading, setLoading] = useState(true);

  const tabOptions = [
    { value: 'overview', label: '?Ÿé?ç¸½è¦½', icon: ChartBarIcon },
    { value: 'supply-chain', label: 'ä¾›æ???, icon: TruckIcon },
    { value: 'logistics', label: '?©æ??†æ?', icon: MapPinIcon },
    { value: 'inventory', label: 'åº«å?ç®¡ç?', icon: CubeIcon },
    { value: 'cost', label: '?æœ¬?†æ?', icon: CurrencyDollarIcon },
    { value: 'performance', label: 'ç¸¾æ???§', icon: BoltIcon }
  ];

  const periodOptions = [
    { value: '7days', label: '?€è¿?å¤? },
    { value: '30days', label: '?€è¿?0å¤? },
    { value: '90days', label: '?€è¿?0å¤? },
    { value: '1year', label: '?€è¿?å¹? }
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
      console.error('è¼‰å…¥?Ÿé??¸æ?å¤±æ?:', error);
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

  // æ¨¡æ“¬?Ÿé??¸æ?
  const mockOperationalMetrics = {
    orderFulfillment: { value: 96.8, trend: 2.1, label: 'è¨‚å–®å±¥è???, unit: '%' },
    avgProcessingTime: { value: 1.2, trend: -8.5, label: 'å¹³å??•ç??‚é?', unit: 'å¤? },
    inventoryTurnover: { value: 8.5, trend: 12.3, label: 'åº«å??¨è???, unit: 'æ¬?å¹? },
    supplierReliability: { value: 94.2, trend: 1.8, label: 'ä¾›æ??†å¯? æ€?, unit: '%' },
    shippingAccuracy: { value: 98.5, trend: 0.7, label: '?é€æ?ç¢ºç?', unit: '%' },
    returnRate: { value: 2.3, trend: -15.2, label: '?€è²¨ç?', unit: '%' },
    costEfficiency: { value: 87.6, trend: 5.4, label: '?æœ¬?ˆç?', unit: '%' },
    customerSatisfaction: { value: 4.4, trend: 3.2, label: 'å®¢æˆ¶æ»¿æ?åº?, unit: '/5.0' }
  };

  const mockSupplyChainData = [
    {
      supplier: '? å¯¶ä¾›æ??†A',
      category: '? å¯¶é¦–é£¾',
      reliability: 96.5,
      quality: 4.8,
      leadTime: 7,
      cost: 'A',
      status: 'excellent'
    },
    {
      supplier: '?ä»¶ä¾›æ??†B',
      category: '?ä»¶é£¾å?',
      reliability: 92.3,
      quality: 4.5,
      leadTime: 5,
      cost: 'B',
      status: 'good'
    },
    {
      supplier: 'ç²¾å?ä¾›æ??†C',
      category: 'ç²¾å??¶è?',
      reliability: 89.7,
      quality: 4.9,
      leadTime: 14,
      cost: 'A',
      status: 'good'
    },
    {
      supplier: '?…è?ä¾›æ??†D',
      category: '?…è??æ?',
      reliability: 95.1,
      quality: 4.2,
      leadTime: 3,
      cost: 'C',
      status: 'excellent'
    }
  ];

  const mockLogisticsData = [
    { region: '?°å?å¸?, orders: 1250, avgDeliveryTime: 1.2, onTimeRate: 98.5, cost: 85000 },
    { region: '?°å?å¸?, orders: 980, avgDeliveryTime: 1.5, onTimeRate: 96.8, cost: 72000 },
    { region: '?°ä¸­å¸?, orders: 650, avgDeliveryTime: 2.1, onTimeRate: 94.2, cost: 58000 },
    { region: 'é«˜é?å¸?, orders: 520, avgDeliveryTime: 2.3, onTimeRate: 92.6, cost: 48000 },
    { region: '?¶ä??°å?', orders: 800, avgDeliveryTime: 3.2, onTimeRate: 89.4, cost: 85000 }
  ];

  const mockInventoryAlerts = [
    { product: 'ç¶“å…¸?ç??…é?', category: '? å¯¶é¦–é£¾', stock: 15, minStock: 20, status: 'low', action: 'å»ºè­°è£œè²¨' },
    { product: 'ç¿¡ç??‰é²', category: 'ç²¾å??¶è?', stock: 5, minStock: 15, status: 'critical', action: 'ç·Šæ€¥è?è²? },
    { product: '?€é£¾æ???, category: '?ä»¶é£¾å?', stock: 89, minStock: 30, status: 'normal', action: 'åº«å?æ­?¸¸' },
    { product: '?½çŸ³?³ç’°å¥—ç?', category: '? å¯¶é¦–é£¾', stock: 78, minStock: 25, status: 'normal', action: 'åº«å?æ­?¸¸' }
  ];

  const mockCostBreakdown = [
    { category: '?†å??¡è³¼', amount: 1850000, percentage: 45.2, trend: 2.3 },
    { category: '?©æ??é€?, amount: 348000, percentage: 8.5, trend: -1.8 },
    { category: '?…è??æ?', amount: 164000, percentage: 4.0, trend: 5.2 },
    { category: '?‰å„²è²»ç”¨', amount: 246000, percentage: 6.0, trend: -3.1 },
    { category: 'äººä??æœ¬', amount: 820000, percentage: 20.0, trend: 4.7 },
    { category: '?Ÿé?è²»ç”¨', amount: 656000, percentage: 16.0, trend: -2.5 }
  ];

  const mockPerformanceKPIs = [
    { kpi: 'è¨‚å–®?•ç??ˆç?', current: 95.8, target: 95.0, status: 'exceed' },
    { kpi: 'åº«å?æº–ç¢º??, current: 98.2, target: 98.0, status: 'exceed' },
    { kpi: '?é€å??‚ç?', current: 96.5, target: 97.0, status: 'below' },
    { kpi: '?æœ¬?§åˆ¶??, current: 87.6, target: 85.0, status: 'exceed' },
    { kpi: 'å®¢æˆ¶æ»¿æ?åº?, current: 88.0, target: 90.0, status: 'below' },
    { kpi: 'ä¾›æ??†ç¸¾??, current: 94.2, target: 93.0, status: 'exceed' }
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
      case 'excellent': return '?ªç?';
      case 'good': return '?¯å¥½';
      case 'normal': return 'æ­?¸¸';
      case 'low': return '?ä?';
      case 'critical': return 'ç·Šæ€?;
      case 'exceed': return '?”æ?';
      case 'below': return '?ªé?æ¨?;
      default: return '?ªçŸ¥';
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* ?¸å??‡æ? */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <span className="text-xs text-gray-500">vs ä¸Šæ?</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ?œéµè­¦ç¤º?Œæ?å¯?*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            åº«å??è­¦
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
                  <p>?†é?ï¼š{alert.category}</p>
                  <p>?¶å?åº«å?ï¼š{alert.stock} / ?€ä½åº«å­˜ï?{alert.minStock}</p>
                  <p className="font-medium">{alert.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ChartPieIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            ?æœ¬çµæ??†æ?
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
          ä¾›æ??†ç¸¾?ˆå???
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">ä¾›æ???/th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">é¡åˆ¥</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?¯é???/th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">?è³ªè©•å?</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">äº¤ä??‚é?</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">?æœ¬ç­‰ç?</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">?´é?è©•åƒ¹</th>
              </tr>
            </thead>
            <tbody>
              {mockSupplyChainData.map((supplier, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{supplier.supplier}</td>
                  <td className="py-4 px-4 text-gray-600">{supplier.category}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{formatPercentage(supplier.reliability)}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{supplier.quality}/5.0</td>
                  <td className="py-4 px-4 text-right text-gray-900">{supplier.leadTime}å¤?/td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      supplier.cost === 'A' ? 'bg-green-100 text-green-800' :
                      supplier.cost === 'B' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {supplier.cost}ç´?
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
          ?©æ??é€å???
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {mockLogisticsData.map((region, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{region.region}</h4>
                  <span className="text-sm text-gray-600">{formatNumber(region.orders)} è¨‚å–®</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">å¹³å??é€?/span>
                    <p className="font-bold text-gray-900">{region.avgDeliveryTime}å¤?/p>
                  </div>
                  <div>
                    <span className="text-gray-600">æº–æ???/span>
                    <p className="font-bold text-gray-900">{formatPercentage(region.onTimeRate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">?é€æ???/span>
                    <p className="font-bold text-gray-900">{formatCurrency(region.cost)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">?©æ??é€åœ°??/p>
              <p className="text-gray-400 text-xs">?°å?çµ„ä»¶?´å?ä¸?..</p>
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
          åº«å?ç®¡ç?ç¸½è¦½
        </h3>
        
        <div className="text-center py-12">
          <CubeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">è©³ç´°åº«å??†æ?</h4>
          <p className="text-gray-600">è«‹å??ƒå??å??æ¨¡çµ„ç?åº«å??Ÿèƒ½</p>
        </div>
      </div>
    </div>
  );

  const renderCostTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          è©³ç´°?æœ¬?†æ?
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">?æœ¬è¶¨å‹¢?†æ?</h4>
            <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">?æœ¬è¶¨å‹¢?–è¡¨</p>
                <p className="text-gray-400 text-xs">?–è¡¨çµ„ä»¶?´å?ä¸?..</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">?æœ¬?ªå?å»ºè­°</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">?©æ??æœ¬?ªå?</p>
                <p className="text-xs text-green-700">å»ºè­°?´å??é€è·¯ç·šï??ä¼°ç¯€??%?©æ??æœ¬</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">?¡è³¼?æœ¬?ªå?</p>
                <p className="text-xs text-blue-700">å»ºè­°?¹é??¡è³¼?±éŠ·?†å?ï¼Œé?ä¼°ç???%?¡è³¼?æœ¬</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-900">?‰å„²?æœ¬?ªå?</p>
                <p className="text-xs text-orange-700">å»ºè­°?ªå?åº«å?çµæ?ï¼Œé?ä¼°ç???2%?‰å„²?æœ¬</p>
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
          ?œéµç¸¾æ??‡æ? (KPI)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <span className="text-gray-600">?¶å???/span>
                  <span className="font-bold text-gray-900">{kpi.current}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">?®æ???/span>
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
        {/* ?é¢æ¨™é??Œæ§?¶é? */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">?Ÿé??†æ?</h1>
            <p className="text-gray-600">??§?Ÿé??ˆç?ï¼Œå„ª?–ä??‰é??‡ç‰©æµç®¡??/p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
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
              ?·æ–°?¸æ?
            </button>
          </div>
        </div>

        {/* ?ç±¤å°èˆª */}
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

        {/* ?ç±¤?§å®¹ */}
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
