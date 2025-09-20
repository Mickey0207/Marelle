// 物流管理系統數據層
// 基於 Marelle 電商平台的物流功能實現

// 物流配送類型定義
export const LogisticsType = {
  CONVENIENCE_STORE: 'convenience_store',     // 超商取貨
  HOME_DELIVERY: 'home_delivery',             // 宅配到府
  POST_OFFICE: 'post_office',                 // 郵局配送
  EXPRESS: 'express',                         // 快遞
  PICKUP: 'pickup'                            // 自取
};

// 物流狀態
export const LogisticsStatus = {
  CREATED: 'created',                         // 物流單已建立
  PICKED_UP: 'picked_up',                     // 商品已取貨
  IN_TRANSIT: 'in_transit',                   // 運送中
  OUT_FOR_DELIVERY: 'out_for_delivery',       // 派送中
  DELIVERED: 'delivered',                     // 已送達
  READY_FOR_PICKUP: 'ready_for_pickup',       // 可取貨（超商）
  PICKED_UP_BY_CUSTOMER: 'picked_up_by_customer', // 客戶已取貨
  FAILED_DELIVERY: 'failed_delivery',         // 派送失敗
  RETURNED: 'returned',                       // 已退回
  CANCELLED: 'cancelled'                      // 已取消
};

// 運費計算方式
export const CalculationMethod = {
  WEIGHT: 'weight',                           // 重量計費
  VOLUME: 'volume',                           // 體積計費
  AMOUNT: 'amount',                           // 金額計費
  QUANTITY: 'quantity',                       // 數量計費
  FIXED: 'fixed'                              // 固定費用
};

// 退貨方式
export const ReturnMethod = {
  CONVENIENCE_STORE: 'convenience_store',     // 超商退貨
  HOME_PICKUP: 'home_pickup',                 // 宅配到府收件
  POST_OFFICE: 'post_office'                  // 郵局寄回
};

// 退貨費用政策
export const ReturnFeePolicy = {
  CUSTOMER_PAYS: 'customer_pays',             // 買家負擔
  MERCHANT_PAYS: 'merchant_pays',             // 賣家負擔
  CONDITIONAL: 'conditional'                  // 條件式負擔
};

class LogisticsDataManager {
  constructor() {
    this.shipments = [];
    this.shippingRates = [];
    this.returns = [];
    this.trackingHistory = [];
    this.analytics = {};
    
    this.initializeData();
  }

  // 初始化範例數據
  initializeData() {
    const savedShipments = localStorage.getItem('marelle-shipments');
    const savedRates = localStorage.getItem('marelle-shipping-rates');
    const savedReturns = localStorage.getItem('marelle-returns');
    
    if (savedShipments) {
      this.shipments = JSON.parse(savedShipments);
    } else {
      this.generateSampleShipments();
    }
    
    if (savedRates) {
      this.shippingRates = JSON.parse(savedRates);
    } else {
      this.generateSampleShippingRates();
    }
    
    if (savedReturns) {
      this.returns = JSON.parse(savedReturns);
    } else {
      this.generateSampleReturns();
    }
    
    this.generateAnalytics();
  }

  // 生成範例配送數據
  generateSampleShipments() {
    const sampleShipments = [
      {
        id: 'ship_001',
        orderId: 'order_001',
        orderNumber: 'M2024091601',
        logisticsType: LogisticsType.HOME_DELIVERY,
        status: LogisticsStatus.IN_TRANSIT,
        trackingNumber: 'TW240916001',
        senderInfo: {
          name: 'Marelle Beauty',
          phone: '02-2345-6789',
          address: '台北市信義區松高路123號'
        },
        receiverInfo: {
          name: '陳小美',
          phone: '0912-345-678',
          email: 'chen@example.com',
          address: '台北市大安區復興南路456號'
        },
        packageInfo: {
          weight: 1.2,
          volume: 0.015,
          items: [
            { name: '玫瑰精華面膜', quantity: 2 },
            { name: '薰衣草舒緩霜', quantity: 1 }
          ]
        },
        shippingFee: 120,
        estimatedDelivery: new Date('2024-09-18').toISOString(),
        actualDelivery: null,
        createdAt: new Date('2024-09-16T10:30:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:20:00').toISOString()
      },
      {
        id: 'ship_002',
        orderId: 'order_002',
        orderNumber: 'M2024091602',
        logisticsType: LogisticsType.CONVENIENCE_STORE,
        status: LogisticsStatus.READY_FOR_PICKUP,
        trackingNumber: 'CV240916002',
        senderInfo: {
          name: 'Marelle Beauty',
          phone: '02-2345-6789',
          address: '台北市信義區松高路123號'
        },
        receiverInfo: {
          name: '王小雅',
          phone: '0987-654-321',
          email: 'wang@example.com',
          storeInfo: {
            id: '7-11_001',
            name: '統一超商復興門市',
            address: '台北市大安區復興南路789號',
            phone: '02-2708-1234'
          }
        },
        packageInfo: {
          weight: 0.8,
          volume: 0.01,
          items: [
            { name: '維他命C精華液', quantity: 1 },
            { name: '蜂蜜修護乳霜', quantity: 1 }
          ]
        },
        shippingFee: 60,
        estimatedDelivery: new Date('2024-09-17').toISOString(),
        actualDelivery: null,
        createdAt: new Date('2024-09-16T09:15:00').toISOString(),
        updatedAt: new Date('2024-09-16T16:45:00').toISOString()
      },
      {
        id: 'ship_003',
        orderId: 'order_003',
        orderNumber: 'M2024091603',
        logisticsType: LogisticsType.EXPRESS,
        status: LogisticsStatus.DELIVERED,
        trackingNumber: 'EX240915001',
        senderInfo: {
          name: 'Marelle Beauty',
          phone: '02-2345-6789',
          address: '台北市信義區松高路123號'
        },
        receiverInfo: {
          name: '李小花',
          phone: '0956-789-012',
          email: 'lee@example.com',
          address: '新北市板橋區文化路321號'
        },
        packageInfo: {
          weight: 2.1,
          volume: 0.025,
          items: [
            { name: '綠茶潔面慕斯', quantity: 3 },
            { name: '玫瑰精華面膜', quantity: 2 }
          ]
        },
        shippingFee: 150,
        estimatedDelivery: new Date('2024-09-16').toISOString(),
        actualDelivery: new Date('2024-09-16T11:30:00').toISOString(),
        createdAt: new Date('2024-09-15T14:20:00').toISOString(),
        updatedAt: new Date('2024-09-16T11:30:00').toISOString()
      }
    ];

    this.shipments = sampleShipments;
    this.saveToStorage();
  }

  // 生成範例運費設定
  generateSampleShippingRates() {
    const sampleRates = [
      {
        id: 'rate_001',
        name: '一般宅配',
        logisticsTypes: [LogisticsType.HOME_DELIVERY],
        calculationMethod: CalculationMethod.WEIGHT,
        baseRate: 80,
        tiers: [
          { min: 0, max: 1, rate: 80 },
          { min: 1, max: 3, rate: 120 },
          { min: 3, max: 5, rate: 160 },
          { min: 5, max: 999, rate: 200 }
        ],
        freeShippingThreshold: 1000,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'rate_002',
        name: '超商取貨',
        logisticsTypes: [LogisticsType.CONVENIENCE_STORE],
        calculationMethod: CalculationMethod.FIXED,
        baseRate: 60,
        tiers: [
          { min: 0, max: 999, rate: 60 }
        ],
        freeShippingThreshold: 800,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'rate_003',
        name: '快遞配送',
        logisticsTypes: [LogisticsType.EXPRESS],
        calculationMethod: CalculationMethod.WEIGHT,
        baseRate: 150,
        tiers: [
          { min: 0, max: 1, rate: 150 },
          { min: 1, max: 3, rate: 180 },
          { min: 3, max: 5, rate: 220 },
          { min: 5, max: 999, rate: 280 }
        ],
        freeShippingThreshold: 1500,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    this.shippingRates = sampleRates;
    this.saveToStorage();
  }

  // 生成範例退貨數據
  generateSampleReturns() {
    const sampleReturns = [
      {
        id: 'return_001',
        orderId: 'order_001',
        shipmentId: 'ship_001',
        returnMethod: ReturnMethod.HOME_PICKUP,
        reason: '商品瑕疵',
        status: 'processing',
        returnTrackingNumber: 'RT240916001',
        shippingFee: 120,
        feeResponsibility: ReturnFeePolicy.MERCHANT_PAYS,
        items: [
          { name: '玫瑰精華面膜', quantity: 1, reason: '包裝破損' }
        ],
        customerInfo: {
          name: '陳小美',
          phone: '0912-345-678',
          address: '台北市大安區復興南路456號'
        },
        expectedReturnDate: new Date('2024-09-18').toISOString(),
        actualReturnDate: null,
        refundAmount: 850,
        createdAt: new Date('2024-09-16T15:30:00').toISOString(),
        updatedAt: new Date('2024-09-16T15:30:00').toISOString()
      },
      {
        id: 'return_002',
        orderId: 'order_004',
        shipmentId: 'ship_004',
        returnMethod: ReturnMethod.CONVENIENCE_STORE,
        reason: '不符合期待',
        status: 'completed',
        returnTrackingNumber: 'RT240915001',
        shippingFee: 60,
        feeResponsibility: ReturnFeePolicy.CUSTOMER_PAYS,
        items: [
          { name: '維他命C精華液', quantity: 1, reason: '不適合膚質' }
        ],
        customerInfo: {
          name: '張小華',
          phone: '0923-456-789'
        },
        expectedReturnDate: new Date('2024-09-16').toISOString(),
        actualReturnDate: new Date('2024-09-16T09:20:00').toISOString(),
        refundAmount: 1140, // 1200 - 60 運費
        createdAt: new Date('2024-09-15T11:15:00').toISOString(),
        updatedAt: new Date('2024-09-16T10:30:00').toISOString()
      }
    ];

    this.returns = sampleReturns;
    this.saveToStorage();
  }

  // 生成分析數據
  generateAnalytics() {
    this.analytics = {
      deliveryPerformance: {
        averageDeliveryTime: 1.8, // 天
        onTimeDeliveryRate: 92.5, // %
        failedDeliveryRate: 2.1, // %
        customerSatisfactionScore: 4.6 // 1-5分
      },
      costAnalysis: {
        totalShippingCosts: 156420,
        averageCostPerOrder: 118,
        freeShippingImpact: 23.5, // %
        returnShippingCosts: 8940
      },
      methodPreferences: {
        convenienceStorePickup: 45, // %
        homeDelivery: 38, // %
        expressDelivery: 12, // %
        postOfficeDelivery: 5 // %
      },
      regionalAnalysis: [
        {
          region: '台北市',
          orderVolume: 856,
          averageDeliveryTime: 1.2,
          shippingCostPerOrder: 95
        },
        {
          region: '新北市',
          orderVolume: 623,
          averageDeliveryTime: 1.5,
          shippingCostPerOrder: 108
        },
        {
          region: '桃園市',
          orderVolume: 412,
          averageDeliveryTime: 1.8,
          shippingCostPerOrder: 125
        },
        {
          region: '台中市',
          orderVolume: 387,
          averageDeliveryTime: 2.1,
          shippingCostPerOrder: 135
        }
      ]
    };
  }

  // 保存到本地存儲
  saveToStorage() {
    localStorage.setItem('marelle-shipments', JSON.stringify(this.shipments));
    localStorage.setItem('marelle-shipping-rates', JSON.stringify(this.shippingRates));
    localStorage.setItem('marelle-returns', JSON.stringify(this.returns));
  }

  // =============================================================================
  // 配送管理 CRUD 操作
  // =============================================================================

  // 獲取所有配送單
  getAllShipments() {
    return this.shipments;
  }

  // 根據ID獲取配送單
  getShipmentById(id) {
    return this.shipments.find(shipment => shipment.id === id);
  }

  // 根據訂單ID獲取配送單
  getShipmentByOrderId(orderId) {
    return this.shipments.find(shipment => shipment.orderId === orderId);
  }

  // 創建新配送單
  createShipment(shipmentData) {
    try {
      const newShipment = {
        id: `ship_${Date.now()}`,
        ...shipmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.shipments.unshift(newShipment);
      this.saveToStorage();
      return newShipment;
    } catch (error) {
      console.error('Error creating shipment:', error);
      return null;
    }
  }

  // 更新配送單
  updateShipment(id, updateData) {
    try {
      const index = this.shipments.findIndex(shipment => shipment.id === id);
      if (index === -1) return false;

      this.shipments[index] = {
        ...this.shipments[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.shipments[index];
    } catch (error) {
      console.error('Error updating shipment:', error);
      return false;
    }
  }

  // 更新配送狀態
  updateShipmentStatus(id, newStatus, location = '', description = '') {
    try {
      const shipment = this.getShipmentById(id);
      if (!shipment) return false;

      // 更新配送單狀態
      const updated = this.updateShipment(id, { status: newStatus });
      
      // 記錄狀態歷史
      this.addTrackingHistory(id, newStatus, location, description);
      
      return updated;
    } catch (error) {
      console.error('Error updating shipment status:', error);
      return false;
    }
  }

  // 刪除配送單
  deleteShipment(id) {
    try {
      const index = this.shipments.findIndex(shipment => shipment.id === id);
      if (index === -1) return false;

      this.shipments.splice(index, 1);
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error deleting shipment:', error);
      return false;
    }
  }

  // =============================================================================
  // 運費設定管理
  // =============================================================================

  // 獲取所有運費設定
  getAllShippingRates() {
    return this.shippingRates;
  }

  // 根據ID獲取運費設定
  getShippingRateById(id) {
    return this.shippingRates.find(rate => rate.id === id);
  }

  // 創建運費設定
  createShippingRate(rateData) {
    try {
      const newRate = {
        id: `rate_${Date.now()}`,
        ...rateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.shippingRates.unshift(newRate);
      this.saveToStorage();
      return newRate;
    } catch (error) {
      console.error('Error creating shipping rate:', error);
      return null;
    }
  }

  // 更新運費設定
  updateShippingRate(id, updateData) {
    try {
      const index = this.shippingRates.findIndex(rate => rate.id === id);
      if (index === -1) return false;

      this.shippingRates[index] = {
        ...this.shippingRates[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.shippingRates[index];
    } catch (error) {
      console.error('Error updating shipping rate:', error);
      return false;
    }
  }

  // 計算運費
  calculateShippingFee(logisticsType, weight, orderAmount = 0) {
    const applicableRates = this.shippingRates.filter(rate => 
      rate.isActive && rate.logisticsTypes.includes(logisticsType)
    );

    if (applicableRates.length === 0) {
      return { fee: 0, reason: '無適用運費設定' };
    }

    const rate = applicableRates[0]; // 取第一個適用的設定

    // 檢查免運門檻
    if (rate.freeShippingThreshold && orderAmount >= rate.freeShippingThreshold) {
      return { fee: 0, reason: '滿額免運' };
    }

    // 根據計算方式計算運費
    if (rate.calculationMethod === CalculationMethod.FIXED) {
      return { fee: rate.baseRate, reason: '固定費用' };
    }

    if (rate.calculationMethod === CalculationMethod.WEIGHT) {
      const tier = rate.tiers.find(t => weight >= t.min && weight < t.max);
      if (tier) {
        return { fee: tier.rate, reason: `重量 ${weight}kg` };
      }
    }

    return { fee: rate.baseRate, reason: '基本費率' };
  }

  // =============================================================================
  // 退貨管理
  // =============================================================================

  // 獲取所有退貨記錄
  getAllReturns() {
    return this.returns;
  }

  // 根據ID獲取退貨記錄
  getReturnById(id) {
    return this.returns.find(returnItem => returnItem.id === id);
  }

  // 創建退貨記錄
  createReturn(returnData) {
    try {
      const newReturn = {
        id: `return_${Date.now()}`,
        ...returnData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.returns.unshift(newReturn);
      this.saveToStorage();
      return newReturn;
    } catch (error) {
      console.error('Error creating return:', error);
      return null;
    }
  }

  // 更新退貨記錄
  updateReturn(id, updateData) {
    try {
      const index = this.returns.findIndex(returnItem => returnItem.id === id);
      if (index === -1) return false;

      this.returns[index] = {
        ...this.returns[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.returns[index];
    } catch (error) {
      console.error('Error updating return:', error);
      return false;
    }
  }

  // =============================================================================
  // 物流追蹤
  // =============================================================================

  // 添加追蹤歷史記錄
  addTrackingHistory(shipmentId, status, location = '', description = '') {
    if (!this.trackingHistory) {
      this.trackingHistory = [];
    }

    const historyEntry = {
      id: `track_${Date.now()}`,
      shipmentId,
      status,
      location,
      description,
      timestamp: new Date().toISOString()
    };

    this.trackingHistory.unshift(historyEntry);
    return historyEntry;
  }

  // 獲取配送追蹤歷史
  getTrackingHistory(shipmentId) {
    if (!this.trackingHistory) return [];
    return this.trackingHistory.filter(entry => entry.shipmentId === shipmentId);
  }

  // =============================================================================
  // 統計分析
  // =============================================================================

  // 獲取物流分析數據
  getLogisticsAnalytics() {
    return this.analytics;
  }

  // 獲取配送狀態統計
  getShipmentStatusStats() {
    const stats = {};
    Object.values(LogisticsStatus).forEach(status => {
      stats[status] = this.shipments.filter(s => s.status === status).length;
    });
    return stats;
  }

  // 獲取運費收入統計
  getShippingRevenueStats() {
    const totalRevenue = this.shipments.reduce((sum, shipment) => sum + shipment.shippingFee, 0);
    const avgRevenuePerOrder = this.shipments.length > 0 ? totalRevenue / this.shipments.length : 0;
    
    return {
      totalRevenue,
      avgRevenuePerOrder,
      totalOrders: this.shipments.length
    };
  }

  // 獲取物流方式統計
  getLogisticsTypeStats() {
    const stats = {};
    Object.values(LogisticsType).forEach(type => {
      stats[type] = this.shipments.filter(s => s.logisticsType === type).length;
    });
    return stats;
  }

  // =============================================================================
  // 篩選和搜尋
  // =============================================================================

  // 搜尋配送單
  searchShipments(keyword) {
    if (!keyword) return this.shipments;
    
    const searchTerm = keyword.toLowerCase();
    return this.shipments.filter(shipment => 
      shipment.orderNumber.toLowerCase().includes(searchTerm) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm) ||
      shipment.receiverInfo.name.toLowerCase().includes(searchTerm) ||
      shipment.receiverInfo.phone.includes(searchTerm)
    );
  }

  // 根據狀態篩選配送單
  filterShipmentsByStatus(status) {
    if (!status || status === 'all') return this.shipments;
    return this.shipments.filter(shipment => shipment.status === status);
  }

  // 根據物流類型篩選配送單
  filterShipmentsByType(logisticsType) {
    if (!logisticsType || logisticsType === 'all') return this.shipments;
    return this.shipments.filter(shipment => shipment.logisticsType === logisticsType);
  }

  // 根據日期範圍篩選配送單
  filterShipmentsByDateRange(startDate, endDate) {
    return this.shipments.filter(shipment => {
      const shipmentDate = new Date(shipment.createdAt);
      return shipmentDate >= new Date(startDate) && shipmentDate <= new Date(endDate);
    });
  }

  // 獲取物流分析數據
  getAnalytics() {
    const totalShipments = this.shipments.length;
    const totalReturns = this.returns.length;
    
    // 計算總運費成本
    const totalShippingCost = this.shipments.reduce((sum, shipment) => sum + (shipment.shippingFee || 0), 0);
    
    // 計算配送成功率
    const deliveredShipments = this.shipments.filter(s => s.status === LogisticsStatus.DELIVERED || s.status === LogisticsStatus.PICKED_UP_BY_CUSTOMER).length;
    const deliverySuccessRate = totalShipments > 0 ? deliveredShipments / totalShipments : 0;
    
    // 計算平均配送時間（天）
    const deliveredWithTimes = this.shipments.filter(s => s.actualDelivery && s.createdAt);
    const avgDeliveryTime = deliveredWithTimes.length > 0 ? 
      deliveredWithTimes.reduce((sum, s) => {
        const deliveryTime = new Date(s.actualDelivery) - new Date(s.createdAt);
        return sum + (deliveryTime / (1000 * 60 * 60 * 24)); // 轉換為天
      }, 0) / deliveredWithTimes.length : 2.5;
    
    // 計算退貨率
    const returnRate = totalShipments > 0 ? totalReturns / totalShipments : 0;
    
    // 成本分析
    const costBreakdown = [
      { category: '基本運費', amount: totalShippingCost * 0.6, percentage: 0.6 },
      { category: '包裝費用', amount: totalShippingCost * 0.15, percentage: 0.15 },
      { category: '保險費用', amount: totalShippingCost * 0.1, percentage: 0.1 },
      { category: '手續費', amount: totalShippingCost * 0.1, percentage: 0.1 },
      { category: '其他費用', amount: totalShippingCost * 0.05, percentage: 0.05 }
    ];
    
    // 配送方式統計
    const typeStats = {};
    this.shipments.forEach(shipment => {
      const type = shipment.logisticsType;
      if (!typeStats[type]) {
        typeStats[type] = { count: 0, name: this.getLogisticsTypeDisplayName(type) };
      }
      typeStats[type].count++;
    });
    
    const deliveryMethodStats = Object.values(typeStats).map(stat => ({
      ...stat,
      percentage: totalShipments > 0 ? stat.count / totalShipments : 0
    }));
    
    // 效率指標
    const efficiencyMetrics = {
      onTimeDeliveryRate: '94.2%',
      customerSatisfaction: '4.7★',
      avgProcessingTime: 8,
      costPerDelivery: `$${Math.round(totalShippingCost / Math.max(totalShipments, 1))}`
    };
    
    // 趨勢數據
    const trends = {
      cost: [
        { date: '09/10', value: 12000 },
        { date: '09/11', value: 15000 },
        { date: '09/12', value: 11000 },
        { date: '09/13', value: 18000 },
        { date: '09/14', value: 16000 },
        { date: '09/15', value: 14000 },
        { date: '09/16', value: totalShippingCost }
      ],
      volume: [
        { date: '09/10', value: 45 },
        { date: '09/11', value: 52 },
        { date: '09/12', value: 38 },
        { date: '09/13', value: 68 },
        { date: '09/14', value: 55 },
        { date: '09/15', value: 42 },
        { date: '09/16', value: totalShipments }
      ],
      efficiency: [
        { date: '09/10', value: 92 },
        { date: '09/11', value: 95 },
        { date: '09/12', value: 88 },
        { date: '09/13', value: 97 },
        { date: '09/14', value: 93 },
        { date: '09/15', value: 91 },
        { date: '09/16', value: Math.round(deliverySuccessRate * 100) }
      ]
    };
    
    // 詳細統計
    const detailedStats = deliveryMethodStats.map(method => ({
      method: method.name,
      orderCount: method.count,
      totalCost: totalShippingCost * method.percentage,
      avgCost: method.count > 0 ? (totalShippingCost * method.percentage) / method.count : 0,
      successRate: 0.9 + Math.random() * 0.09 // 模擬成功率 90-99%
    }));
    
    return {
      totalShippingCost,
      deliverySuccessRate,
      averageDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      returnRate,
      costBreakdown,
      deliveryMethodStats,
      efficiencyMetrics,
      trends,
      detailedStats
    };
  }

  // 獲取物流類型顯示名稱的輔助方法
  getLogisticsTypeDisplayName(type) {
    const names = {
      [LogisticsType.CONVENIENCE_STORE]: '超商取貨',
      [LogisticsType.HOME_DELIVERY]: '宅配到府',
      [LogisticsType.POST_OFFICE]: '郵局配送',
      [LogisticsType.EXPRESS]: '快遞',
      [LogisticsType.PICKUP]: '自取'
    };
    return names[type] || type;
  }
}

const logisticsDataManager = new LogisticsDataManager();
export default logisticsDataManager;