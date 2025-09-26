import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CubeIcon,
  BoltIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  BeakerIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import analyticsDataManager from '../../../lib/data/analytics/analyticsDataManager';

const AIInsights = () => {
  const [insightsData, setInsightsData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categoryOptions = [
    { value: 'all', label: '全部洞察' },
    { value: 'sales', label: '銷售洞察' },
    { value: 'customer', label: '客戶洞察' },
    { value: 'product', label: '商品洞察' },
    { value: 'operational', label: '營運洞察' },
    { value: 'risk', label: '風險洞察' }
  ];

  const priorityOptions = [
    { value: 'all', label: '全部優先級' },
    { value: 'critical', label: '緊急' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' }
  ];

  const tabOptions = [
    { value: 'insights', label: '智能洞察', icon: LightBulbIcon },
    { value: 'anomalies', label: '異常檢測', icon: ExclamationTriangleIcon },
    { value: 'predictions', label: '預測分析', icon: ArrowTrendingUpIcon },
    { value: 'recommendations', label: '優化建議', icon: SparklesIcon },
    { value: 'risks', label: '風險評估', icon: ShieldCheckIcon }
  ];

  useEffect(() => {
    loadInsightsData();
  }, [selectedCategory, selectedPriority, activeTab]);

  const loadInsightsData = async () => {
    setLoading(true);
    try {
      const data = analyticsDataManager.getAIInsights(selectedCategory, selectedPriority, activeTab);
      setInsightsData(data);
    } catch (error) {
      console.error('載入AI洞察失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模擬AI分析時間
    await loadInsightsData();
    setRefreshing(false);
  };

  // 模擬 AI 洞察數據
  const mockAIInsights = [
    {
      id: 1,
      type: 'opportunity',
      category: 'sales',
      priority: 'high',
      title: '週末銷售黃金時段發現',
      description: '週六下午2-5點的轉換率比平日高出32%，建議加強週末促銷活動',
      impact: '預估提升15%週末營收',
      confidence: 89,
      actionable: true,
      timestamp: '2小時前',
      insights: [
        '週末客戶瀏覽時間較長，購買決策更謹慎',
        '珠寶首飾類別在週末表現尤其突出',
        '建議推出週末限定優惠提升轉換'
      ]
    },
    {
      id: 2,
      type: 'warning',
      category: 'customer',
      priority: 'critical',
      title: '高價值客戶流失風險警報',
      description: '檢測到25位VIP客戶購買頻率下降超過60%，有流失風險',
      impact: '潛在損失營收280萬元',
      confidence: 94,
      actionable: true,
      timestamp: '30分鐘前',
      insights: [
        '流失客戶主要集中在精品收藏類別',
        '客服滿意度評分低於4.0的客戶流失率高3倍',
        '建議立即啟動客戶挽回計畫'
      ]
    },
    {
      id: 3,
      type: 'insight',
      category: 'product',
      priority: 'medium',
      title: '商品組合優化機會',
      description: '珍珠項鍊與玫瑰金手鍊的搭配購買率高達67%，建議建立套裝商品',
      impact: '預估提升12%客單價',
      confidence: 82,
      actionable: true,
      timestamp: '1小時前',
      insights: [
        '套裝購買客戶的復購率高於單品購買客戶18%',
        '建議價格折扣控制在8-12%之間',
        '套裝商品適合作為節日禮品推廣'
      ]
    },
    {
      id: 4,
      type: 'trend',
      category: 'operational',
      priority: 'low',
      title: '物流效率改善趨勢',
      description: '北部地區配送時間較上月改善15%，南部地區仍有優化空間',
      impact: '整體客戶滿意度提升',
      confidence: 76,
      actionable: false,
      timestamp: '4小時前',
      insights: [
        '新物流夥伴的服務品質穩定提升',
        '南部配送延遲主要因為倉儲位置',
        '建議評估南部增設配送點的可行性'
      ]
    }
  ];

  const mockAnomalies = [
    {
      id: 1,
      type: 'spike',
      metric: '網站流量',
      value: '+156%',
      description: '今日下午3點檢測到異常流量激增',
      severity: 'medium',
      status: 'investigating',
      timestamp: '1小時前'
    },
    {
      id: 2,
      type: 'drop',
      metric: '轉換率',
      value: '-23%',
      description: '手機端轉換率異常下降',
      severity: 'high',
      status: 'confirmed',
      timestamp: '2小時前'
    },
    {
      id: 3,
      type: 'unusual',
      metric: '退貨率',
      value: '+45%',
      description: '特定商品類別退貨率異常上升',
      severity: 'critical',
      status: 'action_required',
      timestamp: '45分鐘前'
    }
  ];

  const mockPredictions = [
    {
      category: '銷售預測',
      metric: '下月營收',
      prediction: '3,250,000',
      confidence: 88,
      trend: 'increasing',
      variance: '±8%'
    },
    {
      category: '需求預測',
      metric: '熱門商品',
      prediction: '珍珠系列',
      confidence: 92,
      trend: 'stable',
      variance: '±5%'
    },
    {
      category: '客戶預測',
      metric: '新客增長',
      prediction: '1,580',
      confidence: 79,
      trend: 'increasing',
      variance: '±12%'
    },
    {
      category: '庫存預測',
      metric: '補貨需求',
      prediction: '15個SKU',
      confidence: 95,
      trend: 'urgent',
      variance: '±3%'
    }
  ];

  const mockRecommendations = [
    {
      category: 'marketing',
      title: '個人化推薦系統',
      description: '基於客戶購買歷史建立個人化商品推薦',
      priority: 'high',
      effort: 'medium',
      impact: 'high',
      expectedROI: '285%'
    },
    {
      category: 'pricing',
      title: '動態定價策略',
      description: '根據需求和庫存情況調整商品價格',
      priority: 'medium',
      effort: 'high',
      impact: 'medium',
      expectedROI: '156%'
    },
    {
      category: 'inventory',
      title: '智能補貨系統',
      description: '使用AI預測最佳補貨時機和數量',
      priority: 'high',
      effort: 'low',
      impact: 'high',
      expectedROI: '234%'
    },
    {
      category: 'customer',
      title: '客戶流失預警',
      description: '建立早期客戶流失預警和挽回機制',
      priority: 'critical',
      effort: 'medium',
      impact: 'high',
      expectedROI: '412%'
    }
  ];

  const mockRisks = [
    {
      type: 'operational',
      title: '供應鏈中斷風險',
      probability: 'medium',
      impact: 'high',
      riskScore: 75,
      description: '主要供應商集中度過高，存在供應中斷風險',
      mitigation: '建議建立備用供應商網絡'
    },
    {
      type: 'financial',
      title: '庫存積壓風險',
      probability: 'low',
      impact: 'medium',
      riskScore: 35,
      description: '季節性商品庫存可能面臨積壓',
      mitigation: '提前規劃清倉促銷活動'
    },
    {
      type: 'market',
      title: '競爭加劇風險',
      probability: 'high',
      impact: 'medium',
      riskScore: 68,
      description: '新競爭者進入市場，價格競爭激烈',
      mitigation: '加強品牌差異化和客戶忠誠度'
    }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'opportunity': return <RocketLaunchIcon className="h-5 w-5 text-green-600" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'insight': return <LightBulbIcon className="h-5 w-5 text-blue-600" />;
      case 'trend': return <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />;
      default: return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {mockAIInsights.map((insight) => (
        <div key={insight.id} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getInsightIcon(insight.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                    {insight.priority === 'critical' ? '緊急' :
                     insight.priority === 'high' ? '高' :
                     insight.priority === 'medium' ? '中' : '低'}
                  </span>
                  <span className="text-xs text-gray-500">{insight.timestamp}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{insight.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">預期影響</span>
                  <p className="font-medium text-gray-900">{insight.impact}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">信心度</span>
                  <p className="font-medium text-gray-900">{insight.confidence}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">可執行性</span>
                  <p className="font-medium text-gray-900">{insight.actionable ? '可執行' : '觀察中'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">關鍵洞察:</h4>
                <ul className="space-y-1">
                  {insight.insights.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 rounded-full bg-[#cc824d] mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {insight.actionable && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors text-sm">
                    執行建議
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnomaliesTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          異常檢測報告
        </h3>
        
        <div className="space-y-4">
          {mockAnomalies.map((anomaly) => (
            <div key={anomaly.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{anomaly.metric}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity === 'critical' ? '嚴重' :
                     anomaly.severity === 'high' ? '高' : '中'}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    anomaly.type === 'spike' ? 'text-green-600' :
                    anomaly.type === 'drop' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {anomaly.value}
                  </span>
                  <p className="text-xs text-gray-500">{anomaly.timestamp}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{anomaly.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  anomaly.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                  anomaly.status === 'confirmed' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {anomaly.status === 'investigating' ? '調查中' :
                   anomaly.status === 'confirmed' ? '已確認' : '需要處理'}
                </span>
                
                <button className="text-sm text-[#cc824d] hover:text-[#b8753f]">
                  查看詳細
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPredictionsTab = () => (
    <div className="space-y-6">
  <div className="grid grid-cols-2 gap-6">
        {mockPredictions.map((prediction, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{prediction.category}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                prediction.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                prediction.trend === 'urgent' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {prediction.trend === 'increasing' ? '上升趨勢' :
                 prediction.trend === 'urgent' ? '緊急' : '穩定'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{prediction.metric}</span>
                <p className="text-2xl font-bold text-gray-900">{prediction.prediction}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">預測信心度</span>
                <span className="font-medium text-gray-900">{prediction.confidence}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#cc824d] h-2 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">誤差範圍</span>
                <span className="font-medium text-gray-900">{prediction.variance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
  <div className="grid grid-cols-2 gap-6">
        {mockRecommendations.map((rec, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                {rec.priority === 'critical' ? '緊急' :
                 rec.priority === 'high' ? '高' :
                 rec.priority === 'medium' ? '中' : '低'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{rec.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500">實施難度</span>
                <p className="font-medium text-gray-900">{rec.effort === 'high' ? '高' : rec.effort === 'medium' ? '中' : '低'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">預期影響</span>
                <p className="font-medium text-gray-900">{rec.impact === 'high' ? '高' : rec.impact === 'medium' ? '中' : '低'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <span className="text-xs text-gray-500">預期ROI</span>
                <p className="font-bold text-green-600">{rec.expectedROI}</p>
              </div>
              <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors text-sm">
                開始實施
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRisksTab = () => (
    <div className="space-y-6">
  <div className="grid grid-cols-3 gap-6">
        {mockRisks.map((risk, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{risk.riskScore}</div>
                <div className="text-xs text-gray-500">風險分數</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">發生機率</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.probability === 'high' ? 'bg-red-100 text-red-800' :
                  risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.probability === 'high' ? '高' : risk.probability === 'medium' ? '中' : '低'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">影響程度</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.impact === 'high' ? 'bg-red-100 text-red-800' :
                  risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.impact === 'high' ? '高' : risk.impact === 'medium' ? '中' : '低'}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full ${
                  risk.riskScore >= 70 ? 'bg-red-500' :
                  risk.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${risk.riskScore}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
            
            <div className="pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">建議措施</span>
              <p className="text-sm text-gray-700">{risk.mitigation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* 頁面標題和控制項 */}
  <div className="flex flex-row items-center justify-between mb-8">
          <div className="mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <SparklesIcon className="h-8 w-8 mr-3 text-[#cc824d]" />
              AI 智能洞察
            </h1>
            <p className="text-gray-600">運用人工智能分析商業數據，提供智能洞察與預測建議</p>
          </div>
          
          <div className="flex flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors flex items-center ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'AI分析中...' : '重新分析'}
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

        {/* AI 分析狀態提示 */}
        {refreshing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <BeakerIcon className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
            <span className="text-blue-800">AI 正在分析最新數據，請稍候...</span>
          </div>
        )}

        {/* 頁籤內容 */}
        {activeTab === 'insights' && renderInsightsTab()}
        {activeTab === 'anomalies' && renderAnomaliesTab()}
        {activeTab === 'predictions' && renderPredictionsTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}
        {activeTab === 'risks' && renderRisksTab()}
      </div>
    </div>
  );
};

export default AIInsights;