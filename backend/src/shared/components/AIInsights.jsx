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
    { value: 'all', label: '?®ÈÉ®Ê¥ûÂ?' },
    { value: 'sales', label: '?∑ÂîÆÊ¥ûÂ?' },
    { value: 'customer', label: 'ÂÆ¢Êà∂Ê¥ûÂ?' },
    { value: 'product', label: '?ÜÂ?Ê¥ûÂ?' },
    { value: 'operational', label: '?üÈ?Ê¥ûÂ?' },
    { value: 'risk', label: 'È¢®Èö™Ê¥ûÂ?' }
  ];

  const priorityOptions = [
    { value: 'all', label: '?®ÈÉ®?™Â?Á¥? },
    { value: 'critical', label: 'Á∑äÊÄ? },
    { value: 'high', label: 'È´? },
    { value: 'medium', label: '‰∏? },
    { value: 'low', label: '‰Ω? }
  ];

  const tabOptions = [
    { value: 'insights', label: '?∫ËÉΩÊ¥ûÂ?', icon: LightBulbIcon },
    { value: 'anomalies', label: '?∞Â∏∏Ê™¢Ê∏¨', icon: ExclamationTriangleIcon },
    { value: 'predictions', label: '?êÊ∏¨?ÜÊ?', icon: ArrowTrendingUpIcon },
    { value: 'recommendations', label: '?™Â?Âª∫Ë≠∞', icon: SparklesIcon },
    { value: 'risks', label: 'È¢®Èö™Ë©ï‰º∞', icon: ShieldCheckIcon }
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
      console.error('ËºâÂÖ•AIÊ¥ûÂ?Â§±Ê?:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Ê®°Êì¨AI?ÜÊ??ÇÈ?
    await loadInsightsData();
    setRefreshing(false);
  };

  // Ê®°Êì¨ AI Ê¥ûÂ??∏Ê?
  const mockAIInsights = [
    {
      id: 1,
      type: 'opportunity',
      category: 'sales',
      priority: 'high',
      title: '?±Êú´?∑ÂîÆÈªÉÈ??ÇÊÆµ?ºÁèæ',
      description: '?±ÂÖ≠‰∏ãÂ?2-5ÈªûÁ?ËΩâÊ??áÊ?Âπ≥Êó•È´òÂá∫32%ÔºåÂª∫Ë≠∞Â?Âº∑ÈÄ±Êú´‰øÉÈä∑Ê¥ªÂ?',
      impact: '?ê‰º∞?êÂ?15%?±Êú´?üÊî∂',
      confidence: 89,
      actionable: true,
      timestamp: '2Â∞èÊ???,
      insights: [
        '?±Êú´ÂÆ¢Êà∂?èË¶Ω?ÇÈ?ËºÉÈï∑ÔºåË≥ºË≤∑Ê±∫Á≠ñÊõ¥Ë¨πÊ?',
        '?†ÂØ∂È¶ñÈ£æÈ°ûÂà•?®ÈÄ±Êú´Ë°®ÁèæÂ∞§ÂÖ∂Á™ÅÂá∫',
        'Âª∫Ë≠∞?®Âá∫?±Êú´?êÂ??™Ê??êÂ?ËΩâÊ?'
      ]
    },
    {
      id: 2,
      type: 'warning',
      category: 'customer',
      priority: 'critical',
      title: 'È´òÂÉπ?ºÂÆ¢?∂Ê?Â§±È¢®?™Ë≠¶??,
      description: 'Ê™¢Ê∏¨??5‰ΩçVIPÂÆ¢Êà∂Ë≥ºË≤∑?ªÁ?‰∏ãÈ?Ë∂ÖÈ?60%ÔºåÊ?ÊµÅÂ§±È¢®Èö™',
      impact: 'ÊΩõÂú®?çÂ§±?üÊî∂280?¨Â?',
      confidence: 94,
      actionable: true,
      timestamp: '30?ÜÈ???,
      insights: [
        'ÊµÅÂ§±ÂÆ¢Êà∂‰∏ªË??Ü‰∏≠?®Á≤æ?ÅÊî∂?èÈ???,
        'ÂÆ¢Ê?ÊªøÊ?Â∫¶Ë??Ü‰???.0?ÑÂÆ¢?∂Ê?Â§±Á?È´???,
        'Âª∫Ë≠∞Á´ãÂç≥?üÂ?ÂÆ¢Êà∂?ΩÂ?Ë®àÁï´'
      ]
    },
    {
      id: 3,
      type: 'insight',
      category: 'product',
      priority: 'medium',
      title: '?ÜÂ?ÁµÑÂ??™Â?Ê©üÊ?',
      description: '?çÁ??ÖÈ??áÁé´?∞È??ãÈ??ÑÊê≠?çË≥ºË≤∑Á?È´òÈ?67%ÔºåÂª∫Ë≠∞Âª∫Á´ãÂ?Ë£ùÂ???,
      impact: '?ê‰º∞?êÂ?12%ÂÆ¢ÂñÆ??,
      confidence: 82,
      actionable: true,
      timestamp: '1Â∞èÊ???,
      insights: [
        'Â•óË?Ë≥ºË≤∑ÂÆ¢Êà∂?ÑÂæ©Ë≥ºÁ?È´òÊñº?ÆÂ?Ë≥ºË≤∑ÂÆ¢Êà∂18%',
        'Âª∫Ë≠∞?πÊ†º?òÊâ£?ßÂà∂??-12%‰πãÈ?',
        'Â•óË??ÜÂ??©Â?‰ΩúÁÇ∫ÁØÄ?•Á¶Æ?ÅÊé®Âª?
      ]
    },
    {
      id: 4,
      type: 'trend',
      category: 'operational',
      priority: 'low',
      title: '?©Ê??àÁ??πÂ?Ë∂®Âã¢',
      description: '?óÈÉ®?∞Â??çÈÄÅÊ??ìË?‰∏äÊ??πÂ?15%ÔºåÂ??®Âú∞?Ä‰ªçÊ??™Â?Á©∫È?',
      impact: '?¥È?ÂÆ¢Êà∂ÊªøÊ?Â∫¶Ê???,
      confidence: 76,
      actionable: false,
      timestamp: '4Â∞èÊ???,
      insights: [
        '?∞Áâ©ÊµÅÂ§•‰º¥Á??çÂ??ÅË≥™Á©©Â??êÂ?',
        '?óÈÉ®?çÈÄÅÂª∂?≤‰∏ªË¶ÅÂ??∫ÂÄâÂÑ≤‰ΩçÁΩÆ',
        'Âª∫Ë≠∞Ë©ï‰º∞?óÈÉ®Â¢ûË®≠?çÈÄÅÈ??ÑÂèØË°åÊÄ?
      ]
    }
  ];

  const mockAnomalies = [
    {
      id: 1,
      type: 'spike',
      metric: 'Á∂≤Á?ÊµÅÈ?',
      value: '+156%',
      description: '‰ªäÊó•‰∏ãÂ?3ÈªûÊ™¢Ê∏¨Âà∞?∞Â∏∏ÊµÅÈ?ÊøÄÂ¢?,
      severity: 'medium',
      status: 'investigating',
      timestamp: '1Â∞èÊ???
    },
    {
      id: 2,
      type: 'drop',
      metric: 'ËΩâÊ???,
      value: '-23%',
      description: '?ãÊ?Á´ØË??õÁ??∞Â∏∏‰∏ãÈ?',
      severity: 'high',
      status: 'confirmed',
      timestamp: '2Â∞èÊ???
    },
    {
      id: 3,
      type: 'unusual',
      metric: '?ÄË≤®Á?',
      value: '+45%',
      description: '?πÂ??ÜÂ?È°ûÂà•?ÄË≤®Á??∞Â∏∏‰∏äÂ?',
      severity: 'critical',
      status: 'action_required',
      timestamp: '45?ÜÈ???
    }
  ];

  const mockPredictions = [
    {
      category: '?∑ÂîÆ?êÊ∏¨',
      metric: '‰∏ãÊ??üÊî∂',
      prediction: '3,250,000',
      confidence: 88,
      trend: 'increasing',
      variance: '¬±8%'
    },
    {
      category: '?ÄÊ±ÇÈ?Ê∏?,
      metric: '?±È??ÜÂ?',
      prediction: '?çÁ?Á≥ªÂ?',
      confidence: 92,
      trend: 'stable',
      variance: '¬±5%'
    },
    {
      category: 'ÂÆ¢Êà∂?êÊ∏¨',
      metric: '?∞ÂÆ¢Â¢ûÈï∑',
      prediction: '1,580',
      confidence: 79,
      trend: 'increasing',
      variance: '¬±12%'
    },
    {
      category: 'Â∫´Â??êÊ∏¨',
      metric: 'Ë£úË≤®?ÄÊ±?,
      prediction: '15?ãSKU',
      confidence: 95,
      trend: 'urgent',
      variance: '¬±3%'
    }
  ];

  const mockRecommendations = [
    {
      category: 'marketing',
      title: '?ã‰∫∫?ñÊé®?¶Á≥ªÁµ?,
      description: '?∫ÊñºÂÆ¢Êà∂Ë≥ºË≤∑Ê≠∑Âè≤Âª∫Á??ã‰∫∫?ñÂ??ÅÊé®??,
      priority: 'high',
      effort: 'medium',
      impact: 'high',
      expectedROI: '285%'
    },
    {
      category: 'pricing',
      title: '?ïÊ?ÂÆöÂÉπÁ≠ñÁï•',
      description: '?πÊ??ÄÊ±ÇÂ?Â∫´Â??ÖÊ?Ë™øÊï¥?ÜÂ??πÊ†º',
      priority: 'medium',
      effort: 'high',
      impact: 'medium',
      expectedROI: '156%'
    },
    {
      category: 'inventory',
      title: '?∫ËÉΩË£úË≤®Á≥ªÁµ±',
      description: '‰ΩøÁî®AI?êÊ∏¨?Ä‰Ω≥Ë?Ë≤®Ê?Ê©üÂ??∏È?',
      priority: 'high',
      effort: 'low',
      impact: 'high',
      expectedROI: '234%'
    },
    {
      category: 'customer',
      title: 'ÂÆ¢Êà∂ÊµÅÂ§±?êË≠¶',
      description: 'Âª∫Á??©Ê?ÂÆ¢Êà∂ÊµÅÂ§±?êË≠¶?åÊåΩ?ûÊ???,
      priority: 'critical',
      effort: 'medium',
      impact: 'high',
      expectedROI: '412%'
    }
  ];

  const mockRisks = [
    {
      type: 'operational',
      title: '‰æõÊ??à‰∏≠?∑È¢®??,
      probability: 'medium',
      impact: 'high',
      riskScore: 75,
      description: '‰∏ªË?‰æõÊ??ÜÈ?‰∏≠Â∫¶?éÈ?ÔºåÂ??®‰??â‰∏≠?∑È¢®??,
      mitigation: 'Âª∫Ë≠∞Âª∫Á??ôÁî®‰æõÊ??ÜÁ∂≤Áµ?
    },
    {
      type: 'financial',
      title: 'Â∫´Â?Á©çÂ?È¢®Èö™',
      probability: 'low',
      impact: 'medium',
      riskScore: 35,
      description: 'Â≠???ßÂ??ÅÂ∫´Â≠òÂèØ?ΩÈù¢?®Á?Â£?,
      mitigation: '?êÂ?Ë¶èÂ?Ê∏ÖÂÄâ‰??∑Ê¥ª??
    },
    {
      type: 'market',
      title: 'Á´∂Áà≠?†Â?È¢®Èö™',
      probability: 'high',
      impact: 'medium',
      riskScore: 68,
      description: '?∞Á´∂?≠ËÄÖÈÄ≤ÂÖ•Â∏ÇÂ†¥ÔºåÂÉπ?ºÁ´∂?≠Ê???,
      mitigation: '?†Âº∑?ÅÁ?Â∑ÆÁï∞?ñÂ?ÂÆ¢Êà∂Âø†Ë?Â∫?
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
                    {insight.priority === 'critical' ? 'Á∑äÊÄ? :
                     insight.priority === 'high' ? 'È´? :
                     insight.priority === 'medium' ? '‰∏? : '‰Ω?}
                  </span>
                  <span className="text-xs text-gray-500">{insight.timestamp}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{insight.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">?êÊ?ÂΩ±Èüø</span>
                  <p className="font-medium text-gray-900">{insight.impact}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">‰ø°Â?Â∫?/span>
                  <p className="font-medium text-gray-900">{insight.confidence}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">?ØÂü∑Ë°åÊÄ?/span>
                  <p className="font-medium text-gray-900">{insight.actionable ? '?ØÂü∑Ë°? : 'ËßÄÂØü‰∏≠'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">?úÈçµÊ¥ûÂ?:</h4>
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
                    ?∑Ë?Âª∫Ë≠∞
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
          ?∞Â∏∏Ê™¢Ê∏¨?±Â?
        </h3>
        
        <div className="space-y-4">
          {mockAnomalies.map((anomaly) => (
            <div key={anomaly.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{anomaly.metric}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity === 'critical' ? '?¥È?' :
                     anomaly.severity === 'high' ? 'È´? : '‰∏?}
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
                  {anomaly.status === 'investigating' ? 'Ë™øÊü•‰∏? :
                   anomaly.status === 'confirmed' ? 'Â∑≤Á¢∫Ë™? : '?ÄË¶ÅË???}
                </span>
                
                <button className="text-sm text-[#cc824d] hover:text-[#b8753f]">
                  ?•Á?Ë©≥Á¥∞
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
                {prediction.trend === 'increasing' ? '‰∏äÂ?Ë∂®Âã¢' :
                 prediction.trend === 'urgent' ? 'Á∑äÊÄ? : 'Á©©Â?'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{prediction.metric}</span>
                <p className="text-2xl font-bold text-gray-900">{prediction.prediction}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">?êÊ∏¨‰ø°Â?Â∫?/span>
                <span className="font-medium text-gray-900">{prediction.confidence}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#cc824d] h-2 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ë™§Â∑ÆÁØÑÂ?</span>
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
                {rec.priority === 'critical' ? 'Á∑äÊÄ? :
                 rec.priority === 'high' ? 'È´? :
                 rec.priority === 'medium' ? '‰∏? : '‰Ω?}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{rec.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500">ÂØ¶ÊñΩ??∫¶</span>
                <p className="font-medium text-gray-900">{rec.effort === 'high' ? 'È´? : rec.effort === 'medium' ? '‰∏? : '‰Ω?}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">?êÊ?ÂΩ±Èüø</span>
                <p className="font-medium text-gray-900">{rec.impact === 'high' ? 'È´? : rec.impact === 'medium' ? '‰∏? : '‰Ω?}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <span className="text-xs text-gray-500">?êÊ?ROI</span>
                <p className="font-bold text-green-600">{rec.expectedROI}</p>
              </div>
              <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors text-sm">
                ?ãÂ?ÂØ¶ÊñΩ
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
                <div className="text-xs text-gray-500">È¢®Èö™?ÜÊï∏</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">?ºÁ?Ê©üÁ?</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.probability === 'high' ? 'bg-red-100 text-red-800' :
                  risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.probability === 'high' ? 'È´? : risk.probability === 'medium' ? '‰∏? : '‰Ω?}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ÂΩ±ÈüøÁ®ãÂ∫¶</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.impact === 'high' ? 'bg-red-100 text-red-800' :
                  risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.impact === 'high' ? 'È´? : risk.impact === 'medium' ? '‰∏? : '‰Ω?}
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
              <span className="text-xs text-gray-500">Âª∫Ë≠∞?™ÊñΩ</span>
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
        {/* ?ÅÈù¢Ê®ôÈ??åÊéß?∂È? */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <SparklesIcon className="h-8 w-8 mr-3 text-[#cc824d]" />
              AI ?∫ËÉΩÊ¥ûÂ?
            </h1>
            <p className="text-gray-600">?ãÁî®‰∫∫Â∑•?∫ËÉΩ?ÜÊ??ÜÊ•≠?∏Ê?ÔºåÊ?‰æõÊô∫?ΩÊ?ÂØüË??êÊ∏¨Âª∫Ë≠∞</p>
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
              {refreshing ? 'AI?ÜÊ?‰∏?..' : '?çÊñ∞?ÜÊ?'}
            </button>
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

        {/* AI ?ÜÊ??Ä?ãÊ?Á§?*/}
        {refreshing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <BeakerIcon className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
            <span className="text-blue-800">AI Ê≠?ú®?ÜÊ??Ä?∞Êï∏?öÔ?Ë´ãÁ???..</span>
          </div>
        )}

        {/* ?ÅÁ±§?ßÂÆπ */}
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
