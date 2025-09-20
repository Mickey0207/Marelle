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
import analyticsDataManager from '../utils/analyticsDataManager';

const AIInsights = () => {
  const [insightsData, setInsightsData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categoryOptions = [
    { value: 'all', label: '?�部洞�?' },
    { value: 'sales', label: '?�售洞�?' },
    { value: 'customer', label: '客戶洞�?' },
    { value: 'product', label: '?��?洞�?' },
    { value: 'operational', label: '?��?洞�?' },
    { value: 'risk', label: '風險洞�?' }
  ];

  const priorityOptions = [
    { value: 'all', label: '?�部?��?�? },
    { value: 'critical', label: '緊�? },
    { value: 'high', label: '�? },
    { value: 'medium', label: '�? },
    { value: 'low', label: '�? }
  ];

  const tabOptions = [
    { value: 'insights', label: '?�能洞�?', icon: LightBulbIcon },
    { value: 'anomalies', label: '?�常檢測', icon: ExclamationTriangleIcon },
    { value: 'predictions', label: '?�測?��?', icon: ArrowTrendingUpIcon },
    { value: 'recommendations', label: '?��?建議', icon: SparklesIcon },
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
      console.error('載入AI洞�?失�?:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模擬AI?��??��?
    await loadInsightsData();
    setRefreshing(false);
  };

  // 模擬 AI 洞�??��?
  const mockAIInsights = [
    {
      id: 1,
      type: 'opportunity',
      category: 'sales',
      priority: 'high',
      title: '?�末?�售黃�??�段?�現',
      description: '?�六下�?2-5點�?轉�??��?平日高出32%，建議�?強週末促銷活�?',
      impact: '?�估?��?15%?�末?�收',
      confidence: 89,
      actionable: true,
      timestamp: '2小�???,
      insights: [
        '?�末客戶?�覽?��?較長，購買決策更謹�?',
        '?�寶首飾類別?�週末表現尤其突出',
        '建議?�出?�末?��??��??��?轉�?'
      ]
    },
    {
      id: 2,
      type: 'warning',
      category: 'customer',
      priority: 'critical',
      title: '高價?�客?��?失風?�警??,
      description: '檢測??5位VIP客戶購買?��?下�?超�?60%，�?流失風險',
      impact: '潛在?�失?�收280?��?',
      confidence: 94,
      actionable: true,
      timestamp: '30?��???,
      insights: [
        '流失客戶主�??�中?�精?�收?��???,
        '客�?滿�?度�??��???.0?�客?��?失�?�???,
        '建議立即?��?客戶?��?計畫'
      ]
    },
    {
      id: 3,
      type: 'insight',
      category: 'product',
      priority: 'medium',
      title: '?��?組�??��?機�?',
      description: '?��??��??�玫?��??��??�搭?�購買�?高�?67%，建議建立�?裝�???,
      impact: '?�估?��?12%客單??,
      confidence: 82,
      actionable: true,
      timestamp: '1小�???,
      insights: [
        '套�?購買客戶?�復購�?高於?��?購買客戶18%',
        '建議?�格?�扣?�制??-12%之�?',
        '套�??��??��?作為節?�禮?�推�?
      ]
    },
    {
      id: 4,
      type: 'trend',
      category: 'operational',
      priority: 'low',
      title: '?��??��??��?趨勢',
      description: '?�部?��??�送�??��?上�??��?15%，�??�地?�仍�??��?空�?',
      impact: '?��?客戶滿�?度�???,
      confidence: 76,
      actionable: false,
      timestamp: '4小�???,
      insights: [
        '?�物流夥伴�??��??�質穩�??��?',
        '?�部?�送延?�主要�??�倉儲位置',
        '建議評估?�部增設?�送�??�可行�?
      ]
    }
  ];

  const mockAnomalies = [
    {
      id: 1,
      type: 'spike',
      metric: '網�?流�?',
      value: '+156%',
      description: '今日下�?3點檢測到?�常流�?激�?,
      severity: 'medium',
      status: 'investigating',
      timestamp: '1小�???
    },
    {
      id: 2,
      type: 'drop',
      metric: '轉�???,
      value: '-23%',
      description: '?��?端�??��??�常下�?',
      severity: 'high',
      status: 'confirmed',
      timestamp: '2小�???
    },
    {
      id: 3,
      type: 'unusual',
      metric: '?�貨�?',
      value: '+45%',
      description: '?��??��?類別?�貨�??�常上�?',
      severity: 'critical',
      status: 'action_required',
      timestamp: '45?��???
    }
  ];

  const mockPredictions = [
    {
      category: '?�售?�測',
      metric: '下�??�收',
      prediction: '3,250,000',
      confidence: 88,
      trend: 'increasing',
      variance: '±8%'
    },
    {
      category: '?�求�?�?,
      metric: '?��??��?',
      prediction: '?��?系�?',
      confidence: 92,
      trend: 'stable',
      variance: '±5%'
    },
    {
      category: '客戶?�測',
      metric: '?�客增長',
      prediction: '1,580',
      confidence: 79,
      trend: 'increasing',
      variance: '±12%'
    },
    {
      category: '庫�??�測',
      metric: '補貨?��?,
      prediction: '15?�SKU',
      confidence: 95,
      trend: 'urgent',
      variance: '±3%'
    }
  ];

  const mockRecommendations = [
    {
      category: 'marketing',
      title: '?�人?�推?�系�?,
      description: '?�於客戶購買歷史建�??�人?��??�推??,
      priority: 'high',
      effort: 'medium',
      impact: 'high',
      expectedROI: '285%'
    },
    {
      category: 'pricing',
      title: '?��?定價策略',
      description: '?��??�求�?庫�??��?調整?��??�格',
      priority: 'medium',
      effort: 'high',
      impact: 'medium',
      expectedROI: '156%'
    },
    {
      category: 'inventory',
      title: '?�能補貨系統',
      description: '使用AI?�測?�佳�?貨�?機�??��?',
      priority: 'high',
      effort: 'low',
      impact: 'high',
      expectedROI: '234%'
    },
    {
      category: 'customer',
      title: '客戶流失?�警',
      description: '建�??��?客戶流失?�警?�挽?��???,
      priority: 'critical',
      effort: 'medium',
      impact: 'high',
      expectedROI: '412%'
    }
  ];

  const mockRisks = [
    {
      type: 'operational',
      title: '供�??�中?�風??,
      probability: 'medium',
      impact: 'high',
      riskScore: 75,
      description: '主�?供�??��?中度?��?，�??��??�中?�風??,
      mitigation: '建議建�??�用供�??�網�?
    },
    {
      type: 'financial',
      title: '庫�?積�?風險',
      probability: 'low',
      impact: 'medium',
      riskScore: 35,
      description: '�???��??�庫存可?�面?��?�?,
      mitigation: '?��?規�?清倉�??�活??
    },
    {
      type: 'market',
      title: '競爭?��?風險',
      probability: 'high',
      impact: 'medium',
      riskScore: 68,
      description: '?�競?�者進入市場，價?�競?��???,
      mitigation: '?�強?��?差異?��?客戶忠�?�?
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
                    {insight.priority === 'critical' ? '緊�? :
                     insight.priority === 'high' ? '�? :
                     insight.priority === 'medium' ? '�? : '�?}
                  </span>
                  <span className="text-xs text-gray-500">{insight.timestamp}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{insight.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">?��?影響</span>
                  <p className="font-medium text-gray-900">{insight.impact}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">信�?�?/span>
                  <p className="font-medium text-gray-900">{insight.confidence}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">?�執行�?/span>
                  <p className="font-medium text-gray-900">{insight.actionable ? '?�執�? : '觀察中'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">?�鍵洞�?:</h4>
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
                    ?��?建議
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
          ?�常檢測?��?
        </h3>
        
        <div className="space-y-4">
          {mockAnomalies.map((anomaly) => (
            <div key={anomaly.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{anomaly.metric}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity === 'critical' ? '?��?' :
                     anomaly.severity === 'high' ? '�? : '�?}
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
                  {anomaly.status === 'investigating' ? '調查�? :
                   anomaly.status === 'confirmed' ? '已確�? : '?�要�???}
                </span>
                
                <button className="text-sm text-[#cc824d] hover:text-[#b8753f]">
                  ?��?詳細
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPredictions.map((prediction, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{prediction.category}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                prediction.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                prediction.trend === 'urgent' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {prediction.trend === 'increasing' ? '上�?趨勢' :
                 prediction.trend === 'urgent' ? '緊�? : '穩�?'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{prediction.metric}</span>
                <p className="text-2xl font-bold text-gray-900">{prediction.prediction}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">?�測信�?�?/span>
                <span className="font-medium text-gray-900">{prediction.confidence}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#cc824d] h-2 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">誤差範�?</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockRecommendations.map((rec, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                {rec.priority === 'critical' ? '緊�? :
                 rec.priority === 'high' ? '�? :
                 rec.priority === 'medium' ? '�? : '�?}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{rec.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500">實施??��</span>
                <p className="font-medium text-gray-900">{rec.effort === 'high' ? '�? : rec.effort === 'medium' ? '�? : '�?}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">?��?影響</span>
                <p className="font-medium text-gray-900">{rec.impact === 'high' ? '�? : rec.impact === 'medium' ? '�? : '�?}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <span className="text-xs text-gray-500">?��?ROI</span>
                <p className="font-bold text-green-600">{rec.expectedROI}</p>
              </div>
              <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors text-sm">
                ?��?實施
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRisksTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockRisks.map((risk, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{risk.riskScore}</div>
                <div className="text-xs text-gray-500">風險?�數</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">?��?機�?</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.probability === 'high' ? 'bg-red-100 text-red-800' :
                  risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.probability === 'high' ? '�? : risk.probability === 'medium' ? '�? : '�?}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">影響程度</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.impact === 'high' ? 'bg-red-100 text-red-800' :
                  risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.impact === 'high' ? '�? : risk.impact === 'medium' ? '�? : '�?}
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
              <span className="text-xs text-gray-500">建議?�施</span>
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
        {/* ?�面標�??�控?��? */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <SparklesIcon className="h-8 w-8 mr-3 text-[#cc824d]" />
              AI ?�能洞�?
            </h1>
            <p className="text-gray-600">?�用人工?�能?��??�業?��?，�?供智?��?察�??�測建議</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
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
              {refreshing ? 'AI?��?�?..' : '?�新?��?'}
            </button>
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

        {/* AI ?��??�?��?�?*/}
        {refreshing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <BeakerIcon className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
            <span className="text-blue-800">AI �?��?��??�?�數?��?請�???..</span>
          </div>
        )}

        {/* ?�籤?�容 */}
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
