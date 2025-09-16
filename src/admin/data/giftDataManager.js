// 贈品管理資料模型和服務

// 簡單的 ID 生成器
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 贈品狀態枚舉
export const GiftStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock'
};

// 贈品選擇類型
export const GiftSelectionType = {
  SINGLE: 'single',           // 單選
  MULTIPLE: 'multiple',       // 多選
  FIXED_COMBO: 'fixed_combo', // 固定組合
  WEIGHTED: 'weighted'        // 權重選擇
};

// 階梯條件類型
export const TierConditionType = {
  QUANTITY: 'quantity',
  AMOUNT: 'amount'
};

// 會員等級
export const MemberLevel = {
  REGULAR: 'regular',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  VIP: 'vip'
};

// 贈品基本資訊類別
export const GiftCategory = {
  BEAUTY: 'beauty',
  SKINCARE: 'skincare',
  FRAGRANCE: 'fragrance',
  MAKEUP: 'makeup',
  TOOLS: 'tools',
  SAMPLES: 'samples',
  LIMITED: 'limited',
  EXCLUSIVE: 'exclusive'
};

// 創建預設贈品資料
const createDefaultGifts = () => [
  {
    id: 'gift_001',
    name: '香氛護手霜',
    description: '滋潤護手霜，淡雅花香，容量30ml',
    images: [
      {
        id: 'img_001',
        url: '/images/gifts/hand-cream.jpg',
        alt: '香氛護手霜',
        sort: 1,
        isMain: true
      }
    ],
    category: GiftCategory.SKINCARE,
    tags: ['護手霜', '香氛', '滋潤'],
    weight: 0.05,
    dimensions: {
      length: 10,
      width: 3,
      height: 15
    },
    inventory: {
      total: 500,
      available: 420,
      reserved: 30,
      alertThreshold: 50,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'gift_002',
    name: '玫瑰花瓣面膜',
    description: '天然玫瑰精華面膜，深層保濕，單片裝',
    images: [
      {
        id: 'img_002',
        url: '/images/gifts/rose-mask.jpg',
        alt: '玫瑰花瓣面膜',
        sort: 1,
        isMain: true
      }
    ],
    category: GiftCategory.SKINCARE,
    tags: ['面膜', '玫瑰', '保濕'],
    weight: 0.02,
    dimensions: {
      length: 15,
      width: 12,
      height: 0.3
    },
    inventory: {
      total: 1000,
      available: 850,
      reserved: 50,
      alertThreshold: 100,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'gift_003',
    name: '迷你香水',
    description: '經典香調迷你香水，容量5ml，方便攜帶',
    images: [
      {
        id: 'img_003',
        url: '/images/gifts/mini-perfume.jpg',
        alt: '迷你香水',
        sort: 1,
        isMain: true
      }
    ],
    category: GiftCategory.FRAGRANCE,
    tags: ['香水', '迷你', '經典'],
    weight: 0.03,
    dimensions: {
      length: 5,
      width: 2,
      height: 8
    },
    inventory: {
      total: 300,
      available: 280,
      reserved: 15,
      alertThreshold: 30,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: 'gift_004',
    name: '化妝刷組合',
    description: '專業化妝刷3件組，包含粉底刷、腮紅刷、眼影刷',
    images: [
      {
        id: 'img_004',
        url: '/images/gifts/brush-set.jpg',
        alt: '化妝刷組合',
        sort: 1,
        isMain: true
      }
    ],
    category: GiftCategory.TOOLS,
    tags: ['化妝刷', '專業', '組合'],
    weight: 0.15,
    dimensions: {
      length: 18,
      width: 8,
      height: 2
    },
    inventory: {
      total: 200,
      available: 180,
      reserved: 10,
      alertThreshold: 20,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 'gift_005',
    name: 'VIP專屬精華',
    description: 'VIP會員專屬抗老精華，珍珠萃取，容量15ml',
    images: [
      {
        id: 'img_005',
        url: '/images/gifts/vip-serum.jpg',
        alt: 'VIP專屬精華',
        sort: 1,
        isMain: true
      }
    ],
    category: GiftCategory.EXCLUSIVE,
    tags: ['精華', 'VIP', '抗老', '珍珠'],
    weight: 0.08,
    dimensions: {
      length: 8,
      width: 3,
      height: 12
    },
    inventory: {
      total: 100,
      available: 95,
      reserved: 3,
      alertThreshold: 10,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'gift_006',
    name: '限量唇膏',
    description: '限量版絲絨唇膏，玫瑰色調，滋潤不乾燥',
    images: [
      {
        id: 'img_006',
        url: '/images/gifts/limited-lipstick.jpg',
        alt: '限量唇膏',
        sort: 1,
        isMain: true
      }
    ],
    category: GiftCategory.MAKEUP,
    tags: ['唇膏', '限量', '絲絨', '玫瑰'],
    weight: 0.04,
    dimensions: {
      length: 7,
      width: 2,
      height: 2
    },
    inventory: {
      total: 150,
      available: 45,
      reserved: 5,
      alertThreshold: 25,
      isUnlimited: false
    },
    status: GiftStatus.ACTIVE,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-20')
  }
];

// 創建預設階梯規則
const createDefaultTierRules = () => [
  {
    id: 'tier_rule_001',
    name: '美妝階梯贈品',
    campaignId: 'campaign_001',
    targetProduct: {
      type: 'category',
      categoryIds: ['makeup', 'skincare']
    },
    tiers: [
      {
        level: 1,
        condition: { 
          type: TierConditionType.QUANTITY, 
          value: 1, 
          operator: '>=' 
        },
        giftOptions: [
          { giftId: 'gift_001', quantity: 1, priority: 1 }
        ],
        selectionType: GiftSelectionType.FIXED_COMBO
      },
      {
        level: 2,
        condition: { 
          type: TierConditionType.QUANTITY, 
          value: 2, 
          operator: '>=' 
        },
        giftOptions: [
          { giftId: 'gift_002', quantity: 1, priority: 1 },
          { giftId: 'gift_003', quantity: 1, priority: 2 }
        ],
        selectionType: GiftSelectionType.SINGLE
      },
      {
        level: 3,
        condition: { 
          type: TierConditionType.AMOUNT, 
          value: 3000, 
          operator: '>=' 
        },
        giftOptions: [
          { giftId: 'gift_004', quantity: 1, priority: 1 },
          { giftId: 'gift_006', quantity: 1, priority: 1 }
        ],
        selectionType: GiftSelectionType.MULTIPLE,
        maxSelections: 2
      }
    ],
    memberRestrictions: [
      {
        memberLevel: MemberLevel.REGULAR,
        maxTierLevel: 2
      },
      {
        memberLevel: MemberLevel.SILVER,
        maxTierLevel: 3
      }
    ],
    dateRange: {
      start: new Date('2024-03-01'),
      end: new Date('2024-06-30')
    },
    status: 'active'
  }
];

// 創建預設會員贈品規則
const createDefaultMemberGiftRules = () => [
  {
    id: 'member_rule_001',
    name: '會員等級贈品權益',
    memberLevels: Object.values(MemberLevel),
    giftPool: {
      regularGifts: ['gift_001', 'gift_002'],
      silverGifts: ['gift_001', 'gift_002', 'gift_003'],
      goldGifts: ['gift_001', 'gift_002', 'gift_003', 'gift_004'],
      platinumGifts: ['gift_001', 'gift_002', 'gift_003', 'gift_004', 'gift_006'],
      vipGifts: ['gift_001', 'gift_002', 'gift_003', 'gift_004', 'gift_005', 'gift_006']
    },
    restrictions: {
      dailyLimit: {
        [MemberLevel.REGULAR]: 1,
        [MemberLevel.SILVER]: 2,
        [MemberLevel.GOLD]: 3,
        [MemberLevel.PLATINUM]: 4,
        [MemberLevel.VIP]: 5
      },
      monthlyLimit: {
        [MemberLevel.REGULAR]: 5,
        [MemberLevel.SILVER]: 10,
        [MemberLevel.GOLD]: 15,
        [MemberLevel.PLATINUM]: 20,
        [MemberLevel.VIP]: 30
      },
      requiresMinSpend: {
        [MemberLevel.REGULAR]: 500,
        [MemberLevel.SILVER]: 400,
        [MemberLevel.GOLD]: 300,
        [MemberLevel.PLATINUM]: 200,
        [MemberLevel.VIP]: 100
      },
      newMemberWelcomeGifts: ['gift_001']
    },
    exclusiveGifts: ['gift_005']
  }
];

// 創建預設贈品分配記錄
const createDefaultGiftAllocations = () => [
  {
    id: 'allocation_001',
    orderId: 'order_001',
    giftId: 'gift_001',
    quantity: 1,
    allocationTime: new Date('2024-03-15T10:30:00'),
    status: 'delivered',
    ruleId: 'tier_rule_001',
    ruleType: 'tier'
  },
  {
    id: 'allocation_002',
    orderId: 'order_002',
    giftId: 'gift_002',
    quantity: 1,
    allocationTime: new Date('2024-03-18T14:20:00'),
    status: 'sent',
    ruleId: 'tier_rule_001',
    ruleType: 'tier'
  },
  {
    id: 'allocation_003',
    orderId: 'order_003',
    giftId: 'gift_003',
    quantity: 1,
    allocationTime: new Date('2024-03-20T09:15:00'),
    status: 'allocated',
    ruleId: 'member_rule_001',
    ruleType: 'member'
  }
];

// 贈品管理資料管理器
class GiftDataManager {
  constructor() {
    this.gifts = this.loadData('gifts', createDefaultGifts);
    this.tierRules = this.loadData('tierRules', createDefaultTierRules);
    this.memberGiftRules = this.loadData('memberGiftRules', createDefaultMemberGiftRules);
    this.giftAllocations = this.loadData('giftAllocations', createDefaultGiftAllocations);
  }

  loadData(key, defaultFactory) {
    const stored = localStorage.getItem(`marelle_gift_${key}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // 轉換日期字串回 Date 物件
        return data.map(item => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          ...(item.dateRange && {
            dateRange: {
              start: new Date(item.dateRange.start),
              end: new Date(item.dateRange.end)
            }
          }),
          ...(item.allocationTime && {
            allocationTime: new Date(item.allocationTime)
          })
        }));
      } catch (e) {
        console.warn(`Failed to load ${key}, using defaults:`, e);
      }
    }
    return defaultFactory();
  }

  saveData(key, data) {
    localStorage.setItem(`marelle_gift_${key}`, JSON.stringify(data));
  }

  // 贈品管理方法
  getAllGifts() {
    return this.gifts;
  }

  getGiftById(id) {
    return this.gifts.find(gift => gift.id === id);
  }

  createGift(giftData) {
    const newGift = {
      id: generateId(),
      ...giftData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.gifts.push(newGift);
    this.saveData('gifts', this.gifts);
    return newGift;
  }

  updateGift(id, updates) {
    const index = this.gifts.findIndex(gift => gift.id === id);
    if (index !== -1) {
      this.gifts[index] = {
        ...this.gifts[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveData('gifts', this.gifts);
      return this.gifts[index];
    }
    return null;
  }

  deleteGift(id) {
    const index = this.gifts.findIndex(gift => gift.id === id);
    if (index !== -1) {
      this.gifts.splice(index, 1);
      this.saveData('gifts', this.gifts);
      return true;
    }
    return false;
  }

  // 庫存管理方法
  updateInventory(giftId, operation, quantity) {
    const gift = this.getGiftById(giftId);
    if (!gift) return false;

    switch (operation) {
      case 'reserve':
        if (gift.inventory.available >= quantity) {
          gift.inventory.available -= quantity;
          gift.inventory.reserved += quantity;
        } else {
          return false;
        }
        break;
      case 'release':
        gift.inventory.reserved -= quantity;
        gift.inventory.available += quantity;
        break;
      case 'consume':
        gift.inventory.reserved -= quantity;
        gift.inventory.total -= quantity;
        break;
      case 'add':
        gift.inventory.total += quantity;
        gift.inventory.available += quantity;
        break;
    }

    // 自動更新狀態
    this.updateGiftStatus(giftId);
    this.saveData('gifts', this.gifts);
    return true;
  }

  updateGiftStatus(giftId) {
    const gift = this.getGiftById(giftId);
    if (!gift) return;

    if (gift.inventory.available <= 0) {
      gift.status = GiftStatus.OUT_OF_STOCK;
    } else if (gift.status === GiftStatus.OUT_OF_STOCK) {
      gift.status = GiftStatus.ACTIVE;
    }

    gift.updatedAt = new Date();
  }

  // 階梯規則管理
  getAllTierRules() {
    return this.tierRules;
  }

  createTierRule(ruleData) {
    const newRule = {
      id: generateId(),
      ...ruleData,
      createdAt: new Date()
    };
    this.tierRules.push(newRule);
    this.saveData('tierRules', this.tierRules);
    return newRule;
  }

  updateTierRule(id, updates) {
    const index = this.tierRules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.tierRules[index] = { ...this.tierRules[index], ...updates };
      this.saveData('tierRules', this.tierRules);
      return this.tierRules[index];
    }
    return null;
  }

  // 會員贈品規則管理
  getAllMemberGiftRules() {
    return this.memberGiftRules;
  }

  // 贈品分配記錄管理
  getAllAllocations() {
    return this.giftAllocations;
  }

  createAllocation(allocationData) {
    const newAllocation = {
      id: generateId(),
      ...allocationData,
      allocationTime: new Date()
    };
    this.giftAllocations.push(newAllocation);
    this.saveData('giftAllocations', this.giftAllocations);
    return newAllocation;
  }

  // 統計方法
  getGiftStatistics() {
    const totalGifts = this.gifts.length;
    const activeGifts = this.gifts.filter(g => g.status === GiftStatus.ACTIVE).length;
    const outOfStockGifts = this.gifts.filter(g => g.status === GiftStatus.OUT_OF_STOCK).length;
    const lowStockGifts = this.gifts.filter(g => 
      g.inventory.available > 0 && g.inventory.available <= g.inventory.alertThreshold
    ).length;

    const totalAllocations = this.giftAllocations.length;
    const thisMonthAllocations = this.giftAllocations.filter(a => {
      const allocationMonth = new Date(a.allocationTime).getMonth();
      const currentMonth = new Date().getMonth();
      return allocationMonth === currentMonth;
    }).length;

    return {
      totalGifts,
      activeGifts,
      outOfStockGifts,
      lowStockGifts,
      totalAllocations,
      thisMonthAllocations
    };
  }

  // 搜尋和篩選
  searchGifts(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.gifts.filter(gift =>
      gift.name.toLowerCase().includes(lowercaseQuery) ||
      gift.description.toLowerCase().includes(lowercaseQuery) ||
      gift.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      gift.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterGiftsByStatus(status) {
    return this.gifts.filter(gift => gift.status === status);
  }

  filterGiftsByCategory(category) {
    return this.gifts.filter(gift => gift.category === category);
  }
}

// 創建全域實例
export const giftDataManager = new GiftDataManager();
export default giftDataManager;