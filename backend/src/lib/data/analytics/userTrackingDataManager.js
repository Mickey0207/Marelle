// 用戶追蹤數據管理器
// 模擬用戶行為事件追蹤、會話管理、設備識別等功能

// 生成隨機 ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 用戶行為事件類型
export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  CATEGORY_INTERACTION: 'category_interaction',
  PRODUCT_INTERACTION: 'product_interaction',
  SHOPPING_BEHAVIOR: 'shopping_behavior',
  SEARCH_BEHAVIOR: 'search_behavior',
  SOCIAL_BEHAVIOR: 'social_behavior',
  CUSTOMER_SERVICE: 'customer_service'
};

// 設備類型
export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet'
};

// 用戶分群類型
export const USER_SEGMENTS = {
  NEW_USERS: 'new_users',
  RETURNING_USERS: 'returning_users',
  VIP_USERS: 'vip_users',
  PRICE_CONSCIOUS: 'price_conscious',
  BRAND_LOYAL: 'brand_loyal',
  FREQUENT_BUYERS: 'frequent_buyers'
};

// 模擬用戶行為事件數據
const generateMockUserBehaviorEvents = () => {
  const events = [];
  const categories = [
    { id: 'cat-1', name: '臉部保養', path: ['美妝', '臉部保養'] },
    { id: 'cat-2', name: '彩妝', path: ['美妝', '彩妝'] },
    { id: 'cat-3', name: '身體護理', path: ['美妝', '身體護理'] },
    { id: 'cat-4', name: '香水', path: ['美妝', '香水'] },
    { id: 'cat-5', name: '工具配件', path: ['美妝', '工具配件'] }
  ];

  const actions = ['click', 'view', 'hover', 'filter', 'sort'];
  const devices = Object.values(DEVICE_TYPES);
  const userIds = Array.from({ length: 50 }, () => `user-${generateId()}`);

  // 生成過去7天的事件
  for (let i = 0; i < 1000; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const deviceType = devices[Math.floor(Math.random() * devices.length)];
    const sessionId = `session-${generateId()}`;

    events.push({
      eventId: generateId(),
      eventType: EVENT_TYPES.CATEGORY_INTERACTION,
      timestamp,
      sessionId,
      userId,
      deviceInfo: {
        deviceType,
        browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][Math.floor(Math.random() * 4)],
        operatingSystem: deviceType === 'mobile' ? 'iOS' : 'Windows',
        screenResolution: deviceType === 'mobile' ? '375x812' : '1920x1080'
      },
      eventData: {
        categoryId: category.id,
        categoryName: category.name,
        categoryPath: category.path,
        action: actions[Math.floor(Math.random() * actions.length)],
        clickData: {
          clickCount: Math.floor(Math.random() * 10) + 1,
          totalClickCount: Math.floor(Math.random() * 100) + 1,
          clickPosition: { 
            x: Math.floor(Math.random() * 1200), 
            y: Math.floor(Math.random() * 800) 
          }
        },
        dwellTimeData: {
          currentDwellTime: Math.floor(Math.random() * 300) + 10, // 10-310秒
          averageDwellTime: Math.floor(Math.random() * 120) + 30,
          totalDwellTime: Math.floor(Math.random() * 3600) + 300
        },
        fromSource: ['menu', 'banner', 'search', 'recommendation'][Math.floor(Math.random() * 4)]
      },
      trackingMetadata: {
        dataSource: 'js_tracker',
        consentLevel: 'analytics',
        privacyMode: false
      }
    });
  }

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// 模擬實時活動數據
const generateRealTimeData = () => ({
  currentActiveUsers: Math.floor(Math.random() * 200) + 50,
  activeUsersByDevice: {
    desktop: Math.floor(Math.random() * 80) + 20,
    mobile: Math.floor(Math.random() * 100) + 25,
    tablet: Math.floor(Math.random() * 30) + 5
  },
  topCategories: [
    { categoryId: 'cat-1', categoryName: '臉部保養', activeUsers: 45, clicksPerMinute: 23 },
    { categoryId: 'cat-2', categoryName: '彩妝', activeUsers: 38, clicksPerMinute: 19 },
    { categoryId: 'cat-3', categoryName: '身體護理', activeUsers: 28, clicksPerMinute: 15 },
    { categoryId: 'cat-4', categoryName: '香水', activeUsers: 22, clicksPerMinute: 12 },
    { categoryId: 'cat-5', categoryName: '工具配件', activeUsers: 18, clicksPerMinute: 8 }
  ],
  recentEvents: generateMockUserBehaviorEvents().slice(0, 10)
});

// 模擬類別分析數據
const generateCategoryAnalytics = () => {
  const categories = [
    { id: 'cat-1', name: '臉部保養', path: ['美妝', '臉部保養'] },
    { id: 'cat-2', name: '彩妝', path: ['美妝', '彩妝'] },
    { id: 'cat-3', name: '身體護理', path: ['美妝', '身體護理'] },
    { id: 'cat-4', name: '香水', path: ['美妝', '香水'] },
    { id: 'cat-5', name: '工具配件', path: ['美妝', '工具配件'] }
  ];

  return categories.map(category => ({
    categoryId: category.id,
    categoryName: category.name,
    categoryPath: category.path,
    realTimeMetrics: {
      currentActiveUsers: Math.floor(Math.random() * 50) + 5,
      clicksPerMinute: Math.floor(Math.random() * 30) + 2,
      averageDwellTime: Math.floor(Math.random() * 180) + 20,
      bounceRate: Math.random() * 0.4 + 0.1, // 10%-50%
      conversionRate: Math.random() * 0.1 + 0.02 // 2%-12%
    },
    historicalStats: {
      clickStats: {
        totalClicks: Math.floor(Math.random() * 10000) + 1000,
        uniqueClickers: Math.floor(Math.random() * 500) + 100,
        averageClicksPerUser: Math.random() * 10 + 2,
        clickGrowthRate: Math.random() * 0.2 - 0.1, // -10% to +10%
        clicksByDevice: {
          desktop: Math.floor(Math.random() * 4000) + 500,
          mobile: Math.floor(Math.random() * 5000) + 600,
          tablet: Math.floor(Math.random() * 1000) + 100
        }
      },
      dwellTimeStats: {
        totalDwellTime: Math.floor(Math.random() * 100000) + 10000,
        averageDwellTime: Math.floor(Math.random() * 120) + 30,
        medianDwellTime: Math.floor(Math.random() * 90) + 25,
        dwellTimeByDevice: {
          desktop: Math.floor(Math.random() * 150) + 40,
          mobile: Math.floor(Math.random() * 80) + 20,
          tablet: Math.floor(Math.random() * 100) + 35
        }
      },
      conversionStats: {
        viewToCartRate: Math.random() * 0.15 + 0.02,
        viewToPurchaseRate: Math.random() * 0.08 + 0.01,
        cartToPurchaseRate: Math.random() * 0.3 + 0.4,
        averageOrderValue: Math.floor(Math.random() * 3000) + 500,
        revenueGenerated: Math.floor(Math.random() * 100000) + 10000
      }
    },
    temporalAnalysis: {
      hourlyPattern: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.random() * 100,
        clicks: Math.floor(Math.random() * 50)
      })),
      weeklyPattern: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'].map(day => ({
        day,
        activity: Math.random() * 100,
        clicks: Math.floor(Math.random() * 200) + 50
      }))
    }
  }));
};

// 模擬用戶分群數據
const generateUserSegmentData = () => {
  const segments = Object.values(USER_SEGMENTS);
  
  return segments.map(segment => ({
    segmentId: segment,
    segmentName: {
      new_users: '新用戶',
      returning_users: '回訪用戶',
      vip_users: 'VIP用戶',
      price_conscious: '價格敏感用戶',
      brand_loyal: '品牌忠誠用戶',
      frequent_buyers: '高頻購買用戶'
    }[segment],
    userCount: Math.floor(Math.random() * 1000) + 100,
    behaviorMetrics: {
      averageSessionDuration: Math.floor(Math.random() * 600) + 120,
      averagePageViews: Math.floor(Math.random() * 10) + 2,
      bounceRate: Math.random() * 0.5 + 0.1,
      conversionRate: Math.random() * 0.15 + 0.02,
      averageOrderValue: Math.floor(Math.random() * 2000) + 300
    },
    categoryPreferences: [
      { categoryId: 'cat-1', preferenceScore: Math.random() },
      { categoryId: 'cat-2', preferenceScore: Math.random() },
      { categoryId: 'cat-3', preferenceScore: Math.random() },
      { categoryId: 'cat-4', preferenceScore: Math.random() },
      { categoryId: 'cat-5', preferenceScore: Math.random() }
    ].sort((a, b) => b.preferenceScore - a.preferenceScore)
  }));
};

// 模擬隱私權設定數據
const generatePrivacySettings = () => ({
  cookieConsent: {
    totalConsents: Math.floor(Math.random() * 5000) + 1000,
    consentRate: Math.random() * 0.3 + 0.6, // 60%-90%
    categoryConsents: {
      necessary: 1.0, // 100% (必需)
      analytics: Math.random() * 0.4 + 0.5, // 50%-90%
      marketing: Math.random() * 0.3 + 0.3, // 30%-60%
      personalization: Math.random() * 0.4 + 0.4 // 40%-80%
    },
    recentConsents: Array.from({ length: 10 }, () => ({
      userId: `user-${generateId()}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      consents: {
        necessary: true,
        analytics: Math.random() > 0.3,
        marketing: Math.random() > 0.5,
        personalization: Math.random() > 0.4
      },
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.xxx.xxx`
    }))
  },
  dataRequests: {
    totalRequests: Math.floor(Math.random() * 50) + 10,
    requestTypes: {
      dataExport: Math.floor(Math.random() * 20) + 5,
      dataDeletion: Math.floor(Math.random() * 15) + 3,
      consentWithdrawal: Math.floor(Math.random() * 10) + 2
    },
    recentRequests: Array.from({ length: 5 }, () => ({
      requestId: generateId(),
      userId: `user-${generateId()}`,
      requestType: ['dataExport', 'dataDeletion', 'consentWithdrawal'][Math.floor(Math.random() * 3)],
      status: ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }))
  },
  complianceStatus: {
    gdprCompliant: true,
    ccpaCompliant: true,
    lastAuditDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dataRetentionPolicy: '2年',
    automatedDeletion: true
  }
});

// 模擬異常檢測數據
const generateAnomalyData = () => ({
  realtimeAnomalies: [
    {
      id: generateId(),
      type: 'traffic_spike',
      severity: 'medium',
      description: '來自特定IP的異常高流量',
      timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      affectedMetric: 'page_views',
      threshold: 1000,
      currentValue: 1547
    },
    {
      id: generateId(),
      type: 'unusual_behavior',
      severity: 'low',
      description: '用戶停留時間異常短',
      timestamp: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
      affectedMetric: 'avg_session_duration',
      threshold: 30,
      currentValue: 12
    }
  ],
  suspiciousActivities: [
    {
      id: generateId(),
      userId: `user-${generateId()}`,
      activityType: 'rapid_clicking',
      description: '短時間內大量點擊行為',
      riskScore: 0.7,
      timestamp: new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000)
    }
  ]
});

// 用戶追蹤數據管理器
export const userTrackingDataManager = {
  // 獲取實時活動數據
  getRealTimeActivity: () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateRealTimeData()), 300);
    });
  },

  // 獲取用戶行為事件
  getUserBehaviorEvents: (filters = {}) => {
    return new Promise(resolve => {
      const events = generateMockUserBehaviorEvents();
      let filteredEvents = events;

      if (filters.eventType) {
        filteredEvents = filteredEvents.filter(event => event.eventType === filters.eventType);
      }
      if (filters.deviceType) {
        filteredEvents = filteredEvents.filter(event => event.deviceInfo.deviceType === filters.deviceType);
      }
      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.timestamp);
          return eventDate >= startDate && eventDate <= endDate;
        });
      }

      setTimeout(() => resolve(filteredEvents), 500);
    });
  },

  // 獲取類別分析數據
  getCategoryAnalytics: () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateCategoryAnalytics()), 400);
    });
  },

  // 獲取用戶分群數據
  getUserSegmentData: () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateUserSegmentData()), 350);
    });
  },

  // 獲取隱私權設定數據
  getPrivacySettings: () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generatePrivacySettings()), 300);
    });
  },

  // 獲取異常檢測數據
  getAnomalyData: () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateAnomalyData()), 250);
    });
  },

  // 追蹤用戶行為事件
  trackEvent: (eventData) => {
    return new Promise(resolve => {
      const event = {
        ...eventData,
        eventId: generateId(),
        timestamp: new Date()
      };
      console.log('追蹤事件:', event);
      setTimeout(() => resolve({ success: true, eventId: event.eventId }), 100);
    });
  },

  // 更新隱私權同意
  updatePrivacyConsent: (userId, consents) => {
    return new Promise(resolve => {
      console.log('更新隱私權同意:', { userId, consents });
      setTimeout(() => resolve({ success: true }), 200);
    });
  },

  // 處理數據請求
  processDataRequest: (requestType, userId) => {
    return new Promise(resolve => {
      const requestId = generateId();
      console.log('處理數據請求:', { requestType, userId, requestId });
      setTimeout(() => resolve({ 
        success: true, 
        requestId,
        estimatedCompletionTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }), 300);
    });
  },

  // 獲取用戶路徑分析
  getUserJourneyAnalysis: (userId) => {
    return new Promise(resolve => {
      const journey = {
        userId,
        totalSessions: Math.floor(Math.random() * 20) + 5,
        averageSessionDuration: Math.floor(Math.random() * 600) + 180,
        commonPaths: [
          ['首頁', '臉部保養', '精華液', '商品詳情'],
          ['首頁', '彩妝', '口紅', '購物車'],
          ['搜尋', '香水', '商品詳情', '結帳']
        ],
        conversionFunnel: {
          steps: ['瀏覽', '加入購物車', '結帳', '完成購買'],
          values: [100, 45, 32, 28]
        }
      };
      setTimeout(() => resolve(journey), 400);
    });
  },

  // 生成報告
  generateReport: (reportType, dateRange) => {
    return new Promise(resolve => {
      const report = {
        reportId: generateId(),
        reportType,
        dateRange,
        generatedAt: new Date(),
        summary: {
          totalEvents: Math.floor(Math.random() * 50000) + 10000,
          uniqueUsers: Math.floor(Math.random() * 5000) + 1000,
          topCategory: '臉部保養',
          conversionRate: (Math.random() * 0.1 + 0.02).toFixed(3)
        },
        downloadUrl: `/api/reports/${generateId()}.pdf`
      };
      setTimeout(() => resolve(report), 800);
    });
  }
};

export default userTrackingDataManager;