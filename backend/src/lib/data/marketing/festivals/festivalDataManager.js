// 由 marketing/festivalDataManager.js 移動至 festivals/festivalDataManager.js
// 節慶管理數據管理器
class FestivalDataManager {
  constructor() {
    // 初始化節慶數據
    this.festivals = this.loadFestivals();
    this.promotions = this.loadPromotions();
    this.coupons = this.loadCoupons();
  }
  
  // ---- Mock configuration lists (moved from UI components) ----
  getFestivalTypes() {
    return [
      { value: 'traditional', label: '傳統節日' },
      { value: 'romantic', label: '浪漫節日' },
      { value: 'family', label: '家庭節日' },
      { value: 'seasonal', label: '季節活動' },
      { value: 'commercial', label: '商業促銷' }
    ];
  }

  getStatusOptions() {
    return [
      { value: 'draft', label: '草稿' },
      { value: 'scheduled', label: '已排程' },
      { value: 'active', label: '進行中' },
      { value: 'ended', label: '已結束' }
    ];
  }

  getProductCategories() {
    return [
      'skincare', 'makeup', 'fragrance', 'haircare', 'bodycare',
      'anti-aging', 'luxury', 'organic', 'gift-sets', 'tools'
    ];
  }

  getPromotionTypes() {
    return [
      { value: 'discount', label: '折扣優惠' },
      { value: 'gift', label: '滿額贈禮' },
      { value: 'shipping', label: '免運優惠' },
      { value: 'bundle', label: '組合優惠' }
    ];
  }

  getCouponTypes() {
    return [
      { value: 'percentage', label: '百分比折扣' },
      { value: 'fixed', label: '固定金額' }
    ];
  }

  getTargetCustomerOptions() {
    return [
      { value: 'all', label: '所有客戶' },
      { value: 'members', label: '會員限定' },
      { value: 'vip', label: 'VIP 會員' },
      { value: 'new', label: '新客戶' }
    ];
  }

  // 最近活動（模擬資料）
  getRecentActivity() {
    return [
      {
        id: 1,
        type: 'festival_created',
        message: '新建節慶活動：情人節限定',
        timestamp: '2025-01-20T14:00:00Z'
      },
      {
        id: 2,
        type: 'promotion_activated',
        message: '春節限時折扣已啟用',
        timestamp: '2025-01-20T08:00:00Z'
      },
      {
        id: 3,
        type: 'coupon_issued',
        message: '發放500張春節專屬優惠券',
        timestamp: '2025-01-19T16:30:00Z'
      }
    ];
  }

  // 獲取初始節慶數據
  loadFestivals() {
    const stored = localStorage.getItem('festivals');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return [
      {
        id: 'f001',
        name: '春節年貨節',
        type: 'traditional',
        startDate: '2025-01-20',
        endDate: '2025-02-10',
        status: 'active',
        description: '春節年貨大優惠，全館商品享優惠價格',
        bannerImage: '/images/festivals/spring-festival.jpg',
        themeColor: '#ff6b6b',
        targetProducts: ['skincare', 'makeup'],
        promotionSettings: {
          discountType: 'percentage',
          discountValue: 15,
          freeShipping: true,
          giftThreshold: 2000,
          giftItems: ['紅包袋', '春節禮盒']
        },
        analytics: {
          views: 12500,
          participation: 850,
          revenue: 458000,
          conversionRate: 6.8
        },
        createdAt: '2024-12-15T08:00:00Z',
        updatedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: 'f002',
        name: '情人節限定',
        type: 'romantic',
        startDate: '2025-02-10',
        endDate: '2025-02-15',
        status: 'scheduled',
        description: '情人節專屬美妝禮盒，傳遞愛意的最佳選擇',
        bannerImage: '/images/festivals/valentine.jpg',
        themeColor: '#ff69b4',
        targetProducts: ['gift-sets', 'perfume'],
        promotionSettings: {
          discountType: 'buy-one-get-one',
          discountValue: 50,
          freeShipping: false,
          giftThreshold: 1500,
          giftItems: ['情人節包裝', '玫瑰花瓣']
        },
        analytics: {
          views: 0,
          participation: 0,
          revenue: 0,
          conversionRate: 0
        },
        createdAt: '2025-01-20T14:00:00Z',
        updatedAt: '2025-01-20T14:00:00Z'
      },
      {
        id: 'f003',
        name: '母親節感恩',
        type: 'family',
        startDate: '2025-05-01',
        endDate: '2025-05-12',
        status: 'draft',
        description: '感謝母親的愛，精選美妝保養品限時優惠',
        bannerImage: '/images/festivals/mothers-day.jpg',
        themeColor: '#ffa8cc',
        targetProducts: ['anti-aging', 'luxury'],
        promotionSettings: {
          discountType: 'fixed',
          discountValue: 200,
          freeShipping: true,
          giftThreshold: 3000,
          giftItems: ['康乃馨', '感謝卡片']
        },
        analytics: {
          views: 0,
          participation: 0,
          revenue: 0,
          conversionRate: 0
        },
        createdAt: '2025-02-01T09:00:00Z',
        updatedAt: '2025-02-01T09:00:00Z'
      }
    ];
  }

  // 獲取促銷活動數據
  loadPromotions() {
    const stored = localStorage.getItem('festival_promotions');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return [
      {
        id: 'p001',
        festivalId: 'f001',
        name: '春節限時折扣',
        type: 'discount',
        rules: {
          minAmount: 1000,
          discountRate: 0.15,
          maxDiscount: 500
        },
        startTime: '2025-01-20T00:00:00Z',
        endTime: '2025-02-10T23:59:59Z',
        isActive: true,
        usageCount: 245,
        usageLimit: 1000
      },
      {
        id: 'p002',
        festivalId: 'f001',
        name: '滿額贈禮',
        type: 'gift',
        rules: {
          minAmount: 2000,
          giftItems: ['春節禮盒', '紅包袋']
        },
        startTime: '2025-01-20T00:00:00Z',
        endTime: '2025-02-10T23:59:59Z',
        isActive: true,
        usageCount: 128,
        usageLimit: 500
      }
    ];
  }

  // 獲取優惠券數據
  loadCoupons() {
    const stored = localStorage.getItem('festival_coupons');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return [
      {
        id: 'c001',
        festivalId: 'f001',
        code: 'SPRING2025',
        name: '春節專屬優惠券',
        type: 'percentage',
        value: 20,
        minAmount: 1500,
        maxDiscount: 300,
        validFrom: '2025-01-20T00:00:00Z',
        validTo: '2025-02-10T23:59:59Z',
        isActive: true,
        totalQuantity: 500,
        usedQuantity: 156,
        targetCustomers: 'all'
      },
      {
        id: 'c002',
        festivalId: 'f002',
        code: 'VALENTINE2025',
        name: '情人節甜蜜券',
        type: 'fixed',
        value: 150,
        minAmount: 1000,
        maxDiscount: 150,
        validFrom: '2025-02-10T00:00:00Z',
        validTo: '2025-02-15T23:59:59Z',
        isActive: false,
        totalQuantity: 300,
        usedQuantity: 0,
        targetCustomers: 'members'
      }
    ];
  }

  // 保存數據到 localStorage
  saveFestivals() {
    localStorage.setItem('festivals', JSON.stringify(this.festivals));
  }

  savePromotions() {
    localStorage.setItem('festival_promotions', JSON.stringify(this.promotions));
  }

  saveCoupons() {
    localStorage.setItem('festival_coupons', JSON.stringify(this.coupons));
  }

  // 節慶 CRUD 操作
  getAllFestivals() {
    return [...this.festivals];
  }

  getFestivalById(id) {
    return this.festivals.find(festival => festival.id === id);
  }

  getFestivalsByStatus(status) {
    return this.festivals.filter(festival => festival.status === status);
  }

  getActiveFestivals() {
    const now = new Date();
    return this.festivals.filter(festival => {
      const startDate = new Date(festival.startDate);
      const endDate = new Date(festival.endDate);
      return festival.status === 'active' && now >= startDate && now <= endDate;
    });
  }

  getUpcomingFestivals() {
    const now = new Date();
    return this.festivals.filter(festival => {
      const startDate = new Date(festival.startDate);
      return (festival.status === 'scheduled' || festival.status === 'active') && startDate > now;
    });
  }

  createFestival(festivalData) {
    const newFestival = {
      id: 'f' + Date.now().toString().slice(-6),
      ...festivalData,
      analytics: {
        views: 0,
        participation: 0,
        revenue: 0,
        conversionRate: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.festivals.push(newFestival);
    this.saveFestivals();
    return newFestival;
  }

  updateFestival(id, updateData) {
    const index = this.festivals.findIndex(festival => festival.id === id);
    if (index !== -1) {
      this.festivals[index] = {
        ...this.festivals[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveFestivals();
      return this.festivals[index];
    }
    return null;
  }

  deleteFestival(id) {
    const index = this.festivals.findIndex(festival => festival.id === id);
    if (index !== -1) {
      const deleted = this.festivals.splice(index, 1)[0];
      // 同時刪除相關的促銷活動和優惠券
      this.promotions = this.promotions.filter(p => p.festivalId !== id);
      this.coupons = this.coupons.filter(c => c.festivalId !== id);
      
      this.saveFestivals();
      this.savePromotions();
      this.saveCoupons();
      return deleted;
    }
    return null;
  }

  // 促銷活動管理
  getPromotionsByFestival(festivalId) {
    return this.promotions.filter(promotion => promotion.festivalId === festivalId);
  }

  createPromotion(promotionData) {
    const newPromotion = {
      id: 'p' + Date.now().toString().slice(-6),
      ...promotionData,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    
    this.promotions.push(newPromotion);
    this.savePromotions();
    return newPromotion;
  }

  updatePromotion(id, updateData) {
    const index = this.promotions.findIndex(promotion => promotion.id === id);
    if (index !== -1) {
      this.promotions[index] = {
        ...this.promotions[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.savePromotions();
      return this.promotions[index];
    }
    return null;
  }

  deletePromotion(id) {
    const index = this.promotions.findIndex(promotion => promotion.id === id);
    if (index !== -1) {
      const deleted = this.promotions.splice(index, 1)[0];
      this.savePromotions();
      return deleted;
    }
    return null;
  }

  // 優惠券管理
  getCouponsByFestival(festivalId) {
    return this.coupons.filter(coupon => coupon.festivalId === festivalId);
  }

  createCoupon(couponData) {
    const newCoupon = {
      id: 'c' + Date.now().toString().slice(-6),
      ...couponData,
      usedQuantity: 0,
      createdAt: new Date().toISOString()
    };
    
    this.coupons.push(newCoupon);
    this.saveCoupons();
    return newCoupon;
  }

  updateCoupon(id, updateData) {
    const index = this.coupons.findIndex(coupon => coupon.id === id);
    if (index !== -1) {
      this.coupons[index] = {
        ...this.coupons[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveCoupons();
      return this.coupons[index];
    }
    return null;
  }

  deleteCoupon(id) {
    const index = this.coupons.findIndex(coupon => coupon.id === id);
    if (index !== -1) {
      const deleted = this.coupons.splice(index, 1)[0];
      this.saveCoupons();
      return deleted;
    }
    return null;
  }

  // 分析數據
  getFestivalAnalytics(festivalId) {
    const festival = this.getFestivalById(festivalId);
    const promotions = this.getPromotionsByFestival(festivalId);
    const coupons = this.getCouponsByFestival(festivalId);
    
    return {
      festival: festival?.analytics || {},
      promotions: {
        total: promotions.length,
        active: promotions.filter(p => p.isActive).length,
        totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0)
      },
      coupons: {
        total: coupons.length,
        active: coupons.filter(c => c.isActive).length,
        totalIssued: coupons.reduce((sum, c) => sum + c.totalQuantity, 0),
        totalUsed: coupons.reduce((sum, c) => sum + c.usedQuantity, 0)
      }
    };
  }

  updateFestivalAnalytics(festivalId, analyticsData) {
    const festival = this.getFestivalById(festivalId);
    if (festival) {
      festival.analytics = {
        ...festival.analytics,
        ...analyticsData
      };
      this.updateFestival(festivalId, { analytics: festival.analytics });
    }
  }

  // 獲取總體統計
  getOverallStats() {
    const totalFestivals = this.festivals.length;
    const activeFestivals = this.getActiveFestivals().length;
    const upcomingFestivals = this.getUpcomingFestivals().length;
    const totalRevenue = this.festivals.reduce((sum, f) => sum + (f.analytics?.revenue || 0), 0);
    const totalParticipation = this.festivals.reduce((sum, f) => sum + (f.analytics?.participation || 0), 0);
    const avgConversionRate = this.festivals.length > 0 
      ? this.festivals.reduce((sum, f) => sum + (f.analytics?.conversionRate || 0), 0) / this.festivals.length 
      : 0;

    return {
      totalFestivals,
      activeFestivals,
      upcomingFestivals,
      totalRevenue,
      totalParticipation,
      avgConversionRate,
      activePromotions: this.promotions.filter(p => p.isActive).length,
      activeCoupons: this.coupons.filter(c => c.isActive).length
    };
  }

  // 搜索和篩選
  searchFestivals(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.festivals.filter(festival =>
      festival.name.toLowerCase().includes(lowercaseQuery) ||
      festival.description.toLowerCase().includes(lowercaseQuery) ||
      festival.type.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterFestivalsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.festivals.filter(festival => {
      const festivalStart = new Date(festival.startDate);
      const festivalEnd = new Date(festival.endDate);
      
      return (festivalStart >= start && festivalStart <= end) ||
             (festivalEnd >= start && festivalEnd <= end) ||
             (festivalStart <= start && festivalEnd >= end);
    });
  }

  filterFestivalsByType(type) {
    return this.festivals.filter(festival => festival.type === type);
  }
}

// 創建全局實例
const festivalDataManager = new FestivalDataManager();

export default festivalDataManager;
