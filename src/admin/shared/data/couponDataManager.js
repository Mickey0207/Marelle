// 優惠券管理系統數據層
// 基於 Marelle 電商平台的優惠券功能實現

// 優惠券類型定義
export const CouponType = {
  FIXED_AMOUNT: 'fixed_amount',           // 固定金額折扣
  PERCENTAGE: 'percentage',               // 百分比折扣
  FREE_SHIPPING: 'free_shipping',         // 免運券
  BUY_ONE_GET_ONE: 'bogo',               // 買一送一
  BUNDLE_DISCOUNT: 'bundle_discount',     // 組合優惠
  MEMBER_EXCLUSIVE: 'member_exclusive',   // 會員專屬
  NEW_USER_BONUS: 'new_user_bonus',      // 新會員優惠
  BIRTHDAY_GIFT: 'birthday_gift',        // 生日禮券
  CASHBACK: 'cashback'                   // 現金回饋
};

// 優惠券狀態
export const CouponStatus = {
  DRAFT: 'draft',                         // 草稿
  ACTIVE: 'active',                       // 啟用中
  PAUSED: 'paused',                       // 暫停
  EXPIRED: 'expired',                     // 已過期
  DEPLETED: 'depleted',                   // 已用完
  CANCELLED: 'cancelled'                  // 已取消
};

// 用戶優惠券狀態
export const UserCouponStatus = {
  AVAILABLE: 'available',                 // 可使用
  USED: 'used',                          // 已使用
  EXPIRED: 'expired',                    // 已過期
  RESERVED: 'reserved',                  // 預留中
  CANCELLED: 'cancelled'                 // 已取消
};

// 條件類型
export const ConditionType = {
  MIN_ORDER_AMOUNT: 'min_order_amount',   // 最低訂單金額
  MIN_QUANTITY: 'min_quantity',           // 最低購買數量
  MEMBER_LEVEL: 'member_level',           // 會員等級
  FIRST_ORDER: 'first_order',             // 首次購買
  PRODUCT_CATEGORY: 'product_category',   // 商品分類
  BRAND: 'brand',                         // 指定品牌
  DAY_OF_WEEK: 'day_of_week',            // 星期限制
  TIME_RANGE: 'time_range',              // 時間範圍
  LOCATION: 'location',                   // 地區限制
  PAYMENT_METHOD: 'payment_method'        // 付款方式
};

// 疊加規則類型
export const StackingType = {
  ALLOW_ALL: 'allow_all',                 // 允許所有疊加
  SELECTIVE: 'selective',                 // 選擇性疊加
  EXCLUSIVE: 'exclusive',                 // 互斥使用
  HIERARCHICAL: 'hierarchical'            // 階層式疊加
};

// 分享類型
export const ShareType = {
  DIRECT_LINK: 'direct_link',             // 直接連結分享
  QR_CODE: 'qr_code',                     // QR碼分享
  SOCIAL_MEDIA: 'social_media',           // 社群媒體分享
  REFERRAL_CODE: 'referral_code',         // 推薦碼分享
  GROUP_PURCHASE: 'group_purchase'        // 團購分享
};

class CouponDataManager {
  constructor() {
    this.coupons = [];
    this.userCoupons = [];
    this.stackingRules = [];
    this.shareEvents = [];
    this.usageHistory = [];
    
    this.initializeData();
  }

  // 初始化範例數據
  initializeData() {
    const savedCoupons = localStorage.getItem('marelle-coupons');
    const savedUserCoupons = localStorage.getItem('marelle-user-coupons');
    const savedStackingRules = localStorage.getItem('marelle-stacking-rules');
    
    if (savedCoupons) {
      this.coupons = JSON.parse(savedCoupons);
    } else {
      this.generateSampleCoupons();
    }
    
    if (savedUserCoupons) {
      this.userCoupons = JSON.parse(savedUserCoupons);
    } else {
      this.generateSampleUserCoupons();
    }
    
    if (savedStackingRules) {
      this.stackingRules = JSON.parse(savedStackingRules);
    } else {
      this.generateSampleStackingRules();
    }
  }

  // 生成範例優惠券
  generateSampleCoupons() {
    const sampleCoupons = [
      {
        id: 1,
        code: 'WELCOME2024',
        name: '新會員歡迎禮',
        description: '新會員專享首單優惠',
        type: CouponType.PERCENTAGE,
        discountConfig: {
          value: 20,
          maxDiscount: 500,
          minOrderAmount: 1000,
          calculation: 'before_tax'
        },
        conditions: [
          {
            type: ConditionType.FIRST_ORDER,
            operator: 'equals',
            value: true,
            description: '僅限首次購買'
          },
          {
            type: ConditionType.MIN_ORDER_AMOUNT,
            operator: 'gte',
            value: 1000,
            description: '最低消費1000元'
          }
        ],
        limitations: {
          totalUsageLimit: 1000,
          perUserLimit: 1,
          dailyLimit: 50
        },
        validity: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          validityType: 'fixed_period',
          expiryWarningDays: 7
        },
        distribution: {
          autoIssue: true,
          targetAudience: 'new_users',
          issueConditions: ['registration']
        },
        stackingRules: {
          priority: 1,
          stackingType: StackingType.SELECTIVE,
          compatibleTypes: [CouponType.FREE_SHIPPING]
        },
        sharingConfig: {
          isShareable: true,
          shareTypes: [ShareType.SOCIAL_MEDIA, ShareType.DIRECT_LINK],
          shareRewards: {
            sharerReward: { type: 'points', value: 100 },
            shareeCReward: { type: 'coupon', value: 50 }
          }
        },
        status: CouponStatus.ACTIVE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        code: 'SPRING20',
        name: '春季大促',
        description: '春季商品8折優惠',
        type: CouponType.PERCENTAGE,
        discountConfig: {
          value: 20,
          minOrderAmount: 500,
          applicableCategories: ['skincare', 'makeup'],
          calculation: 'on_subtotal'
        },
        conditions: [
          {
            type: ConditionType.PRODUCT_CATEGORY,
            operator: 'in',
            value: ['skincare', 'makeup'],
            description: '適用於保養和彩妝商品'
          }
        ],
        limitations: {
          totalUsageLimit: 5000,
          perUserLimit: 3,
          dailyLimit: 200
        },
        validity: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-05-31'),
          validityType: 'fixed_period',
          expiryWarningDays: 7
        },
        stackingRules: {
          priority: 2,
          stackingType: StackingType.ALLOW_ALL,
          compatibleTypes: [CouponType.FREE_SHIPPING, CouponType.CASHBACK]
        },
        sharingConfig: {
          isShareable: true,
          shareTypes: [ShareType.SOCIAL_MEDIA, ShareType.QR_CODE]
        },
        status: CouponStatus.ACTIVE,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: 3,
        code: 'FREESHIP99',
        name: '滿千免運',
        description: '訂單滿1000元免運費',
        type: CouponType.FREE_SHIPPING,
        discountConfig: {
          value: 0,
          minOrderAmount: 1000,
          calculation: 'on_shipping'
        },
        conditions: [
          {
            type: ConditionType.MIN_ORDER_AMOUNT,
            operator: 'gte',
            value: 1000,
            description: '訂單金額滿1000元'
          }
        ],
        limitations: {
          perUserLimit: 10,
          dailyLimit: 1000
        },
        validity: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          validityType: 'fixed_period'
        },
        stackingRules: {
          priority: 3,
          stackingType: StackingType.ALLOW_ALL,
          compatibleTypes: Object.values(CouponType)
        },
        status: CouponStatus.ACTIVE,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 4,
        code: 'BOGO2024',
        name: '買一送一特惠',
        description: '指定商品買一送一',
        type: CouponType.BUY_ONE_GET_ONE,
        discountConfig: {
          value: 50,
          applicableProducts: ['prod_001', 'prod_002', 'prod_003'],
          calculation: 'on_cheapest'
        },
        conditions: [
          {
            type: ConditionType.MIN_QUANTITY,
            operator: 'gte',
            value: 2,
            description: '至少購買2件指定商品'
          }
        ],
        limitations: {
          totalUsageLimit: 500,
          perUserLimit: 2
        },
        validity: {
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-30'),
          validityType: 'fixed_period'
        },
        stackingRules: {
          priority: 4,
          stackingType: StackingType.EXCLUSIVE
        },
        status: CouponStatus.ACTIVE,
        createdAt: new Date('2024-05-15')
      },
      {
        id: 5,
        code: 'VIP100',
        name: 'VIP會員專享',
        description: 'VIP會員100元折扣券',
        type: CouponType.FIXED_AMOUNT,
        discountConfig: {
          value: 100,
          minOrderAmount: 800,
          calculation: 'on_total'
        },
        conditions: [
          {
            type: ConditionType.MEMBER_LEVEL,
            operator: 'gte',
            value: 'vip',
            description: '僅限VIP會員使用'
          }
        ],
        limitations: {
          perUserLimit: 5,
          dailyLimit: 100
        },
        validity: {
          validityType: 'permanent'
        },
        stackingRules: {
          priority: 5,
          stackingType: StackingType.SELECTIVE,
          compatibleTypes: [CouponType.FREE_SHIPPING]
        },
        status: CouponStatus.ACTIVE,
        createdAt: new Date('2024-01-01')
      }
    ];

    this.coupons = sampleCoupons;
    this.saveToStorage();
  }

  // 生成範例用戶優惠券
  generateSampleUserCoupons() {
    const sampleUserCoupons = [];
    const userIds = ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'];
    
    userIds.forEach((userId, userIndex) => {
      this.coupons.forEach((coupon, couponIndex) => {
        // 為每個用戶隨機分配一些優惠券
        if (Math.random() > 0.3) {
          const userCoupon = {
            id: `uc_${userIndex}_${couponIndex}`,
            userId: userId,
            couponId: coupon.id,
            couponCode: coupon.code,
            status: this.getRandomStatus(),
            obtainedAt: this.getRandomDate(new Date('2024-01-01'), new Date()),
            expiresAt: this.getRandomExpiryDate(),
            source: this.getRandomSource(),
            shareToken: Math.random() > 0.7 ? this.generateShareToken() : null
          };

          // 如果是已使用的券，添加使用信息
          if (userCoupon.status === UserCouponStatus.USED) {
            userCoupon.usedAt = this.getRandomDate(userCoupon.obtainedAt, new Date());
            userCoupon.orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            userCoupon.discountAmount = this.calculateRandomDiscount(coupon);
          }

          sampleUserCoupons.push(userCoupon);
        }
      });
    });

    this.userCoupons = sampleUserCoupons;
  }

  // 生成範例疊加規則
  generateSampleStackingRules() {
    const sampleRules = [
      {
        id: 1,
        name: '新用戶專屬疊加',
        priority: 1,
        stackingType: StackingType.SELECTIVE,
        compatibleTypes: [CouponType.PERCENTAGE, CouponType.FREE_SHIPPING],
        incompatibleTypes: [CouponType.BUY_ONE_GET_ONE],
        maxStackCount: 2,
        conditions: [
          {
            field: 'user.isNew',
            operator: 'equals',
            value: true
          }
        ],
        calculationOrder: 'percentage_first',
        isActive: true
      },
      {
        id: 2,
        name: '一般疊加規則',
        priority: 2,
        stackingType: StackingType.ALLOW_ALL,
        compatibleTypes: Object.values(CouponType),
        incompatibleTypes: [],
        maxStackCount: 3,
        calculationOrder: 'best_for_customer',
        isActive: true
      },
      {
        id: 3,
        name: '互斥規則',
        priority: 3,
        stackingType: StackingType.EXCLUSIVE,
        compatibleTypes: [CouponType.BUY_ONE_GET_ONE],
        incompatibleTypes: Object.values(CouponType).filter(type => type !== CouponType.BUY_ONE_GET_ONE),
        maxStackCount: 1,
        isActive: true
      }
    ];

    this.stackingRules = sampleRules;
  }

  // === 優惠券 CRUD 操作 ===

  // 創建優惠券
  createCoupon(couponData) {
    try {
      const newCoupon = {
        id: Date.now(),
        ...couponData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.coupons.push(newCoupon);
      this.saveToStorage();

      return { success: true, coupon: newCoupon };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 取得所有優惠券
  getAllCoupons(filters = {}) {
    let filteredCoupons = [...this.coupons];

    // 狀態篩選
    if (filters.status) {
      filteredCoupons = filteredCoupons.filter(coupon => coupon.status === filters.status);
    }

    // 類型篩選
    if (filters.type) {
      filteredCoupons = filteredCoupons.filter(coupon => coupon.type === filters.type);
    }

    // 搜尋
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCoupons = filteredCoupons.filter(coupon =>
        coupon.name.toLowerCase().includes(searchTerm) ||
        coupon.code.toLowerCase().includes(searchTerm) ||
        coupon.description.toLowerCase().includes(searchTerm)
      );
    }

    // 日期範圍篩選
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      filteredCoupons = filteredCoupons.filter(coupon => {
        const couponStart = new Date(coupon.validity.startDate);
        return couponStart >= start && couponStart <= end;
      });
    }

    // 排序
    if (filters.sortBy) {
      filteredCoupons.sort((a, b) => {
        const aValue = this.getNestedValue(a, filters.sortBy);
        const bValue = this.getNestedValue(b, filters.sortBy);
        
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filteredCoupons;
  }

  // 取得單一優惠券
  getCouponById(id) {
    return this.coupons.find(coupon => coupon.id === parseInt(id));
  }

  // 更新優惠券
  updateCoupon(id, updateData) {
    try {
      const index = this.coupons.findIndex(coupon => coupon.id === parseInt(id));
      
      if (index === -1) {
        return { success: false, error: '優惠券不存在' };
      }

      this.coupons[index] = {
        ...this.coupons[index],
        ...updateData,
        updatedAt: new Date()
      };

      this.saveToStorage();
      return { success: true, coupon: this.coupons[index] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 刪除優惠券
  deleteCoupon(id) {
    try {
      const index = this.coupons.findIndex(coupon => coupon.id === parseInt(id));
      
      if (index === -1) {
        return { success: false, error: '優惠券不存在' };
      }

      this.coupons.splice(index, 1);
      this.saveToStorage();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 用戶優惠券管理 ===

  // 取得用戶優惠券
  getUserCoupons(userId, filters = {}) {
    let userCoupons = this.userCoupons.filter(uc => uc.userId === userId);

    if (filters.status) {
      userCoupons = userCoupons.filter(uc => uc.status === filters.status);
    }

    // 添加優惠券詳細資訊
    return userCoupons.map(uc => ({
      ...uc,
      coupon: this.getCouponById(uc.couponId)
    }));
  }

  // 發放優惠券給用戶
  issueCouponToUser(userId, couponId, source = 'manual') {
    try {
      const coupon = this.getCouponById(couponId);
      if (!coupon) {
        return { success: false, error: '優惠券不存在' };
      }

      if (coupon.status !== CouponStatus.ACTIVE) {
        return { success: false, error: '優惠券未啟用' };
      }

      // 檢查用戶限制
      const userCouponCount = this.userCoupons.filter(
        uc => uc.userId === userId && uc.couponId === couponId
      ).length;

      if (coupon.limitations.perUserLimit && userCouponCount >= coupon.limitations.perUserLimit) {
        return { success: false, error: '已達到個人使用上限' };
      }

      const userCoupon = {
        id: `uc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        couponId: couponId,
        couponCode: coupon.code,
        status: UserCouponStatus.AVAILABLE,
        obtainedAt: new Date(),
        expiresAt: this.calculateExpiryDate(coupon),
        source: source
      };

      this.userCoupons.push(userCoupon);
      this.saveToStorage();

      return { success: true, userCoupon: userCoupon };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 疊加規則引擎 ===

  // 計算疊加折扣
  async calculateStackedDiscount(userCoupons, cartData) {
    try {
      // 1. 驗證優惠券有效性
      const validCoupons = this.validateCoupons(userCoupons, cartData);
      
      // 2. 檢查疊加相容性
      const compatibleGroups = this.groupCompatibleCoupons(validCoupons);
      
      // 3. 計算所有可能的疊加組合
      const stackingCombinations = this.generateStackingCombinations(compatibleGroups);
      
      // 4. 為每個組合計算折扣
      const calculatedCombinations = stackingCombinations.map(combination =>
        this.calculateCombinationDiscount(combination, cartData)
      );
      
      // 5. 選擇最優組合
      const bestCombination = this.selectBestCombination(calculatedCombinations);
      
      return {
        appliedCoupons: bestCombination.coupons,
        totalDiscount: bestCombination.totalDiscount,
        discountBreakdown: bestCombination.breakdown,
        savingsComparison: this.compareSavings(calculatedCombinations),
        warnings: bestCombination.warnings || []
      };
    } catch (error) {
      return {
        appliedCoupons: [],
        totalDiscount: 0,
        discountBreakdown: [],
        warnings: [error.message]
      };
    }
  }

  // 驗證優惠券
  validateCoupons(userCoupons, cartData) {
    return userCoupons.filter(uc => {
      const coupon = this.getCouponById(uc.couponId);
      
      if (!coupon || coupon.status !== CouponStatus.ACTIVE) return false;
      if (uc.status !== UserCouponStatus.AVAILABLE) return false;
      if (new Date(uc.expiresAt) < new Date()) return false;
      
      return this.checkConditions(coupon.conditions, cartData);
    });
  }

  // 檢查使用條件
  checkConditions(conditions, cartData) {
    if (!conditions || conditions.length === 0) return true;
    
    return conditions.every(condition => {
      switch (condition.type) {
        case ConditionType.MIN_ORDER_AMOUNT:
          return cartData.subtotal >= condition.value;
        case ConditionType.MIN_QUANTITY:
          return cartData.totalQuantity >= condition.value;
        case ConditionType.PRODUCT_CATEGORY:
          return cartData.items.some(item => 
            condition.value.includes(item.category)
          );
        // 可以添加更多條件檢查
        default:
          return true;
      }
    });
  }

  // === 分享系統 ===

  // 生成分享連結
  generateShareLink(userId, couponId, shareType) {
    try {
      const coupon = this.getCouponById(couponId);
      if (!coupon || !coupon.sharingConfig?.isShareable) {
        throw new Error('此優惠券不支援分享');
      }

      const shareToken = this.generateShareToken();
      const shareEvent = {
        id: `share_${Date.now()}`,
        userId: userId,
        couponId: couponId,
        shareType: shareType,
        shareToken: shareToken,
        shareLink: `${window.location.origin}/coupon/shared/${shareToken}`,
        clicksCount: 0,
        conversionsCount: 0,
        status: 'active',
        expiresAt: this.calculateShareExpiry(30), // 30天有效
        createdAt: new Date()
      };

      this.shareEvents.push(shareEvent);
      this.saveToStorage();

      return {
        success: true,
        shareLink: shareEvent.shareLink,
        qrCode: this.generateQRCodeData(shareEvent.shareLink),
        expiresAt: shareEvent.expiresAt
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 統計分析 ===

  // 取得優惠券統計
  getCouponStatistics(dateRange = {}) {
    const stats = {
      total: this.coupons.length,
      active: this.coupons.filter(c => c.status === CouponStatus.ACTIVE).length,
      expired: this.coupons.filter(c => c.status === CouponStatus.EXPIRED).length,
      paused: this.coupons.filter(c => c.status === CouponStatus.PAUSED).length,
      totalIssued: this.userCoupons.length,
      totalUsed: this.userCoupons.filter(uc => uc.status === UserCouponStatus.USED).length,
      totalExpired: this.userCoupons.filter(uc => uc.status === UserCouponStatus.EXPIRED).length,
      usageRate: 0,
      totalDiscount: 0,
      totalShares: this.shareEvents.length,
      totalClicks: this.shareEvents.reduce((sum, se) => sum + se.clicksCount, 0)
    };

    stats.usageRate = stats.totalIssued > 0 ? (stats.totalUsed / stats.totalIssued) * 100 : 0;
    stats.totalDiscount = this.userCoupons
      .filter(uc => uc.status === UserCouponStatus.USED && uc.discountAmount)
      .reduce((sum, uc) => sum + uc.discountAmount, 0);

    return stats;
  }

  // === 輔助方法 ===

  getRandomStatus() {
    const statuses = Object.values(UserCouponStatus);
    const weights = [0.6, 0.2, 0.1, 0.05, 0.05]; // available, used, expired, reserved, cancelled
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return statuses[i];
      }
    }
    return UserCouponStatus.AVAILABLE;
  }

  getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  getRandomExpiryDate() {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + Math.floor(Math.random() * 90) + 30); // 30-120天後到期
    return futureDate;
  }

  getRandomSource() {
    const sources = ['manual', 'auto_issue', 'shared', 'redeemed', 'promotion'];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  generateShareToken() {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculateRandomDiscount(coupon) {
    if (coupon.type === CouponType.PERCENTAGE) {
      return Math.floor(Math.random() * 200) + 50; // 50-250元
    } else if (coupon.type === CouponType.FIXED_AMOUNT) {
      return coupon.discountConfig.value;
    }
    return 0;
  }

  calculateExpiryDate(coupon) {
    if (coupon.validity.validityType === 'relative_days') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (coupon.validity.validityDays || 30));
      return expiryDate;
    } else if (coupon.validity.endDate) {
      return new Date(coupon.validity.endDate);
    }
    // 預設30天後到期
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    return defaultExpiry;
  }

  calculateShareExpiry(days) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    return expiry;
  }

  generateQRCodeData(url) {
    // 這裡應該整合實際的QR碼生成庫
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAA...`;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  saveToStorage() {
    localStorage.setItem('marelle-coupons', JSON.stringify(this.coupons));
    localStorage.setItem('marelle-user-coupons', JSON.stringify(this.userCoupons));
    localStorage.setItem('marelle-stacking-rules', JSON.stringify(this.stackingRules));
    localStorage.setItem('marelle-share-events', JSON.stringify(this.shareEvents));
  }

  // 批量操作
  batchUpdateCoupons(couponIds, updateData) {
    try {
      const updatedCoupons = [];
      
      couponIds.forEach(id => {
        const index = this.coupons.findIndex(coupon => coupon.id === parseInt(id));
        if (index !== -1) {
          this.coupons[index] = {
            ...this.coupons[index],
            ...updateData,
            updatedAt: new Date()
          };
          updatedCoupons.push(this.coupons[index]);
        }
      });

      this.saveToStorage();
      return { success: true, updatedCoupons };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  batchDeleteCoupons(couponIds) {
    try {
      this.coupons = this.coupons.filter(coupon => !couponIds.includes(coupon.id));
      this.saveToStorage();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

const couponDataManager = new CouponDataManager();
export default couponDataManager;