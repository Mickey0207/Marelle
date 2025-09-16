/**
 * 訂單管理數據層
 * 處理訂單相關的所有業務邏輯和數據操作
 */

// 訂單狀態定義
export const OrderStatus = {
  // 初始狀態
  PENDING: 'pending',
  
  // 付款處理階段
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_PROCESSING: 'payment_processing', 
  PAYMENT_FAILED: 'payment_failed',
  
  // 訂單確認階段
  CONFIRMED: 'confirmed',
  ON_HOLD: 'on_hold',
  
  // 處理階段
  PROCESSING: 'processing',
  PICKING: 'picking',
  PACKED: 'packed',
  
  // 物流階段
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  
  // 完成階段
  COMPLETED: 'completed',
  
  // 異常處理階段
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  RETURNED: 'returned',
  EXCHANGED: 'exchanged',
  
  // 特殊狀態
  DISPUTED: 'disputed',
  FRAUD: 'fraud'
};

// 付款狀態定義
export const PaymentStatus = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  TRANSFERRED: 'transferred',
  CONFIRMED: 'confirmed',
  PARTIAL_PAID: 'partial_paid',
  REFUNDED: 'refunded',
  PARTIAL_REFUNDED: 'partial_refunded',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// 訂單類型定義
export const OrderType = {
  NORMAL: 'normal',
  PRE_ORDER: 'pre_order',
  SUBSCRIPTION: 'subscription',
  GIFT: 'gift',
  SAMPLE: 'sample',
  B2B: 'b2b',
  WHOLESALE: 'wholesale',
  DROPSHIPPING: 'dropshipping'
};

// 訂單優先級
export const OrderPriority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
  VIP: 'vip'
};

// 退換貨類型
export const ReturnType = {
  RETURN: 'return',
  EXCHANGE: 'exchange',
  REPAIR: 'repair'
};

// 退換貨狀態
export const ReturnStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SHIPPED: 'shipped',
  RECEIVED: 'received',
  PROCESSED: 'processed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 退換貨原因
export const ReturnReason = {
  DEFECTIVE: 'defective',
  WRONG_ITEM: 'wrong_item',
  SIZE_ISSUE: 'size_issue',
  COLOR_ISSUE: 'color_issue',
  NOT_AS_DESCRIBED: 'not_as_described',
  DAMAGED_IN_SHIPPING: 'damaged_in_shipping',
  CHANGED_MIND: 'changed_mind',
  ALLERGIC_REACTION: 'allergic_reaction',
  EXPIRED: 'expired',
  OTHER: 'other'
};

// 發票類型
export const InvoiceType = {
  PERSONAL: 'personal',
  COMPANY: 'company',
  DONATION: 'donation',
  CARRIER: 'carrier'
};

// 訂單來源
export const OrderSource = {
  WEBSITE: 'website',
  MOBILE_APP: 'mobile_app',
  ADMIN: 'admin',
  API: 'api',
  PHONE: 'phone',
  STORE: 'store',
  MARKETPLACE: 'marketplace'
};

/**
 * 訂單數據管理器
 */
class OrderDataManager {
  constructor() {
    this.storageKey = 'marelle-orders';
    this.statusHistoryKey = 'marelle-order-status-history';
    this.returnRequestsKey = 'marelle-return-requests';
    this.orderCounterKey = 'marelle-order-counter';
    this.initializeData();
  }

  /**
   * 初始化數據
   */
  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const sampleOrders = this.generateSampleOrders();
      localStorage.setItem(this.storageKey, JSON.stringify(sampleOrders));
    }

    if (!localStorage.getItem(this.statusHistoryKey)) {
      localStorage.setItem(this.statusHistoryKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.returnRequestsKey)) {
      localStorage.setItem(this.returnRequestsKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.orderCounterKey)) {
      localStorage.setItem(this.orderCounterKey, JSON.stringify(1000));
    }
  }

  /**
   * 生成範例訂單數據
   */
  generateSampleOrders() {
    const now = new Date();
    const orders = [];

    for (let i = 1; i <= 50; i++) {
      const orderDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const order = {
        id: i,
        orderNumber: `ORD-${(1000 + i).toString()}`,
        type: OrderType.NORMAL,
        status: this.getRandomStatus(),
        paymentStatus: this.getRandomPaymentStatus(),
        priority: OrderPriority.NORMAL,
        
        // 客戶資訊
        customerId: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : null,
        customerType: Math.random() > 0.3 ? 'member' : 'guest',
        customerEmail: `customer${i}@example.com`,
        customerPhone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        
        // 收件資訊
        shippingAddress: {
          firstName: '王',
          lastName: `小明${i}`,
          addressLine1: `台北市大安區復興南路${i}號`,
          city: '台北市',
          state: '大安區',
          postalCode: '10677',
          country: 'Taiwan',
          phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
        },
        
        // 商品明細
        items: this.generateOrderItems(i),
        
        // 金額計算
        subtotal: 1200 + (i * 100),
        shippingFee: 80,
        taxAmount: 0,
        discountAmount: i % 5 === 0 ? 100 : 0,
        totalAmount: 1200 + (i * 100) + 80 - (i % 5 === 0 ? 100 : 0),
        paidAmount: 0,
        
        // 付款資訊
        paymentMethod: this.getRandomPaymentMethod(),
        paymentGateway: 'green_world',
        
        // 物流資訊
        shippingMethod: '宅配',
        shippingCarrier: '黑貓宅急便',
        trackingNumber: Math.random() > 0.5 ? `BK${Math.floor(Math.random() * 1000000000)}` : null,
        
        // 特殊處理
        isGift: Math.random() > 0.8,
        giftMessage: Math.random() > 0.9 ? '祝您生日快樂！' : null,
        
        // 發票資訊
        invoiceType: InvoiceType.PERSONAL,
        
        // 風險控制
        riskScore: Math.floor(Math.random() * 100),
        manualReviewRequired: Math.random() > 0.9,
        
        // 系統欄位
        source: OrderSource.WEBSITE,
        channel: 'online',
        tags: [],
        
        // 時間戳記
        createdAt: orderDate.toISOString(),
        updatedAt: orderDate.toISOString(),
        confirmedAt: this.isConfirmedStatus(this.getRandomStatus()) ? orderDate.toISOString() : null,
        shippedAt: null,
        deliveredAt: null,
        completedAt: null,
        cancelledAt: null
      };

      // 設置已付金額
      if ([PaymentStatus.PAID, PaymentStatus.CONFIRMED].includes(order.paymentStatus)) {
        order.paidAmount = order.totalAmount;
      }

      orders.push(order);
    }

    return orders;
  }

  /**
   * 生成訂單商品明細
   */
  generateOrderItems(orderId) {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    
    const products = [
      { id: 1, name: '保濕精華液', price: 680, sku: 'SK001' },
      { id: 2, name: '美白面膜', price: 380, sku: 'SK002' },
      { id: 3, name: '抗老眼霜', price: 980, sku: 'SK003' },
      { id: 4, name: '潔面乳', price: 280, sku: 'SK004' },
      { id: 5, name: '防曬乳', price: 450, sku: 'SK005' }
    ];

    for (let i = 0; i < itemCount; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      items.push({
        id: orderId * 10 + i,
        orderId: orderId,
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.price,
        originalPrice: product.price,
        discountAmount: 0,
        totalPrice: product.price * quantity,
        isGift: false,
        status: 'pending',
        shippedQuantity: 0,
        deliveredQuantity: 0,
        returnedQuantity: 0
      });
    }

    return items;
  }

  /**
   * 獲取隨機訂單狀態
   */
  getRandomStatus() {
    const statuses = [
      OrderStatus.PENDING,
      OrderStatus.PAYMENT_PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * 獲取隨機付款狀態
   */
  getRandomPaymentStatus() {
    const statuses = [
      PaymentStatus.UNPAID,
      PaymentStatus.PAID,
      PaymentStatus.CONFIRMED,
      PaymentStatus.FAILED
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * 獲取隨機付款方式
   */
  getRandomPaymentMethod() {
    const methods = ['信用卡', 'LINE Pay', '銀行轉帳', '貨到付款', 'Apple Pay'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  /**
   * 檢查是否為已確認狀態
   */
  isConfirmedStatus(status) {
    return [
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED
    ].includes(status);
  }

  /**
   * 生成訂單編號
   */
  generateOrderNumber() {
    let counter = parseInt(localStorage.getItem(this.orderCounterKey) || '1000');
    counter += 1;
    localStorage.setItem(this.orderCounterKey, JSON.stringify(counter));
    return `ORD-${counter}`;
  }

  /**
   * 獲取所有訂單
   */
  getAllOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  /**
   * 根據ID獲取訂單
   */
  getOrderById(id) {
    const orders = this.getAllOrders();
    return orders.find(order => order.id === parseInt(id));
  }

  /**
   * 根據訂單編號獲取訂單
   */
  getOrderByNumber(orderNumber) {
    const orders = this.getAllOrders();
    return orders.find(order => order.orderNumber === orderNumber);
  }

  /**
   * 搜尋訂單
   */
  searchOrders(searchTerm, filters = {}) {
    let orders = this.getAllOrders();

    // 文字搜尋
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      orders = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        (order.customerPhone && order.customerPhone.includes(term)) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(term))
      );
    }

    // 狀態篩選
    if (filters.status && filters.status.length > 0) {
      orders = orders.filter(order => filters.status.includes(order.status));
    }

    // 付款狀態篩選
    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      orders = orders.filter(order => filters.paymentStatus.includes(order.paymentStatus));
    }

    // 訂單類型篩選
    if (filters.type) {
      orders = orders.filter(order => order.type === filters.type);
    }

    // 優先級篩選
    if (filters.priority) {
      orders = orders.filter(order => order.priority === filters.priority);
    }

    // 客戶篩選
    if (filters.customerId) {
      orders = orders.filter(order => order.customerId === filters.customerId);
    }

    // 日期範圍篩選
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      orders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(start) && orderDate <= new Date(end);
      });
    }

    // 付款方式篩選
    if (filters.paymentMethod) {
      orders = orders.filter(order => order.paymentMethod === filters.paymentMethod);
    }

    return orders;
  }

  /**
   * 建立新訂單
   */
  createOrder(orderData) {
    try {
      const orders = this.getAllOrders();
      const newOrder = {
        id: Date.now(),
        orderNumber: this.generateOrderNumber(),
        type: OrderType.NORMAL,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        priority: OrderPriority.NORMAL,
        
        // 客戶資訊
        customerId: orderData.customerId || null,
        customerType: orderData.customerId ? 'member' : 'guest',
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone || null,
        customerNotes: orderData.customerNotes || null,
        
        // 地址資訊
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress,
        
        // 商品明細
        items: orderData.items.map((item, index) => ({
          id: Date.now() + index,
          orderId: Date.now(),
          productId: item.productId,
          variantId: item.variantId || null,
          sku: item.sku,
          productName: item.productName,
          variantName: item.variantName || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          originalPrice: item.originalPrice || item.unitPrice,
          discountAmount: item.discountAmount || 0,
          totalPrice: item.unitPrice * item.quantity,
          isGift: item.isGift || false,
          status: 'pending',
          shippedQuantity: 0,
          deliveredQuantity: 0,
          returnedQuantity: 0
        })),
        
        // 金額計算
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee || 0,
        taxAmount: orderData.taxAmount || 0,
        discountAmount: orderData.discountAmount || 0,
        couponDiscount: orderData.couponDiscount || 0,
        pointDiscount: orderData.pointDiscount || 0,
        totalAmount: orderData.totalAmount,
        paidAmount: 0,
        refundedAmount: 0,
        
        // 付款資訊
        paymentMethod: orderData.paymentMethod || null,
        paymentGateway: orderData.paymentGateway || null,
        
        // 物流資訊
        shippingMethod: orderData.shippingMethod || null,
        shippingCarrier: orderData.shippingCarrier || null,
        
        // 優惠資訊
        couponsUsed: orderData.couponsUsed || [],
        pointsUsed: orderData.pointsUsed || 0,
        pointsEarned: orderData.pointsEarned || 0,
        
        // 發票資訊
        invoiceType: orderData.invoiceType || InvoiceType.PERSONAL,
        invoiceData: orderData.invoiceData || null,
        
        // 特殊處理
        isGift: orderData.isGift || false,
        giftMessage: orderData.giftMessage || null,
        giftWrapping: orderData.giftWrapping || false,
        specialInstructions: orderData.specialInstructions || null,
        internalNotes: orderData.internalNotes || null,
        
        // 風險控制
        riskScore: 0,
        fraudCheckStatus: 'pending',
        manualReviewRequired: false,
        
        // 系統欄位
        createdBy: orderData.createdBy || null,
        assignedTo: orderData.assignedTo || null,
        tags: orderData.tags || [],
        source: orderData.source || OrderSource.ADMIN,
        channel: orderData.channel || 'admin',
        
        // 時間戳記
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmedAt: null,
        shippedAt: null,
        deliveredAt: null,
        completedAt: null,
        cancelledAt: null
      };

      orders.unshift(newOrder);
      localStorage.setItem(this.storageKey, JSON.stringify(orders));

      // 記錄狀態變更
      this.recordStatusChange(newOrder.id, null, OrderStatus.PENDING, '訂單建立', null, true);

      return {
        success: true,
        order: newOrder
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 更新訂單
   */
  updateOrder(id, updateData) {
    try {
      const orders = this.getAllOrders();
      const orderIndex = orders.findIndex(order => order.id === parseInt(id));
      
      if (orderIndex === -1) {
        return {
          success: false,
          error: '訂單不存在'
        };
      }

      const originalOrder = { ...orders[orderIndex] };
      const updatedOrder = {
        ...originalOrder,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      orders[orderIndex] = updatedOrder;
      localStorage.setItem(this.storageKey, JSON.stringify(orders));

      // 如果狀態有變更，記錄狀態歷史
      if (updateData.status && updateData.status !== originalOrder.status) {
        this.recordStatusChange(
          id,
          originalOrder.status,
          updateData.status,
          updateData.statusChangeReason || '手動更新',
          updateData.changedBy || null,
          false
        );
      }

      return {
        success: true,
        order: updatedOrder
      };
    } catch (error) {
      console.error('Error updating order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 更新訂單狀態
   */
  updateOrderStatus(id, newStatus, reason, changedBy = null, notifyCustomer = false) {
    try {
      const order = this.getOrderById(id);
      if (!order) {
        return {
          success: false,
          error: '訂單不存在'
        };
      }

      const oldStatus = order.status;
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      // 設置狀態相關的時間戳記
      if (newStatus === OrderStatus.CONFIRMED && !order.confirmedAt) {
        updateData.confirmedAt = new Date().toISOString();
      } else if (newStatus === OrderStatus.SHIPPED && !order.shippedAt) {
        updateData.shippedAt = new Date().toISOString();
      } else if (newStatus === OrderStatus.DELIVERED && !order.deliveredAt) {
        updateData.deliveredAt = new Date().toISOString();
      } else if (newStatus === OrderStatus.COMPLETED && !order.completedAt) {
        updateData.completedAt = new Date().toISOString();
      } else if (newStatus === OrderStatus.CANCELLED && !order.cancelledAt) {
        updateData.cancelledAt = new Date().toISOString();
      }

      const result = this.updateOrder(id, updateData);
      
      if (result.success) {
        // 記錄狀態變更
        this.recordStatusChange(id, oldStatus, newStatus, reason, changedBy, false);
        
        // TODO: 實現客戶通知邏輯
        if (notifyCustomer) {
          console.log(`Notify customer about order ${order.orderNumber} status change to ${newStatus}`);
        }
      }

      return result;
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 記錄狀態變更歷史
   */
  recordStatusChange(orderId, fromStatus, toStatus, reason, changedBy, automated) {
    try {
      const history = JSON.parse(localStorage.getItem(this.statusHistoryKey) || '[]');
      const record = {
        id: Date.now(),
        orderId: parseInt(orderId),
        fromStatus,
        toStatus,
        reason,
        changedBy,
        automated,
        metadata: {},
        createdAt: new Date().toISOString()
      };

      history.unshift(record);
      localStorage.setItem(this.statusHistoryKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error recording status change:', error);
    }
  }

  /**
   * 獲取訂單狀態歷史
   */
  getOrderStatusHistory(orderId) {
    try {
      const history = JSON.parse(localStorage.getItem(this.statusHistoryKey) || '[]');
      return history.filter(record => record.orderId === parseInt(orderId));
    } catch (error) {
      console.error('Error loading status history:', error);
      return [];
    }
  }

  /**
   * 刪除訂單
   */
  deleteOrder(id) {
    try {
      const orders = this.getAllOrders();
      const filteredOrders = orders.filter(order => order.id !== parseInt(id));
      
      if (filteredOrders.length === orders.length) {
        return {
          success: false,
          error: '訂單不存在'
        };
      }

      localStorage.setItem(this.storageKey, JSON.stringify(filteredOrders));
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 獲取訂單統計資料
   */
  getOrderStatistics() {
    const orders = this.getAllOrders();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // 總訂單統計
    const totalOrders = orders.length;
    const todayOrders = orders.filter(order => new Date(order.createdAt) >= today).length;
    const monthOrders = orders.filter(order => new Date(order.createdAt) >= thisMonth).length;
    const yearOrders = orders.filter(order => new Date(order.createdAt) >= thisYear).length;

    // 狀態統計
    const statusCounts = {};
    Object.values(OrderStatus).forEach(status => {
      statusCounts[status] = orders.filter(order => order.status === status).length;
    });

    // 付款狀態統計
    const paymentStatusCounts = {};
    Object.values(PaymentStatus).forEach(status => {
      paymentStatusCounts[status] = orders.filter(order => order.paymentStatus === status).length;
    });

    // 金額統計
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const paidRevenue = orders
      .filter(order => [PaymentStatus.PAID, PaymentStatus.CONFIRMED].includes(order.paymentStatus))
      .reduce((sum, order) => sum + order.paidAmount, 0);
    const pendingRevenue = orders
      .filter(order => order.paymentStatus === PaymentStatus.UNPAID)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // 平均訂單金額
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 客戶統計
    const uniqueCustomers = new Set(orders.filter(o => o.customerId).map(o => o.customerId)).size;
    const guestOrders = orders.filter(order => order.customerType === 'guest').length;
    const memberOrders = orders.filter(order => order.customerType === 'member').length;

    // 商品統計
    const totalItemsSold = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return {
      // 訂單數量
      totalOrders,
      todayOrders,
      monthOrders,
      yearOrders,

      // 狀態分佈
      statusDistribution: statusCounts,
      paymentStatusDistribution: paymentStatusCounts,

      // 金額統計
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      averageOrderValue,

      // 客戶統計
      uniqueCustomers,
      guestOrders,
      memberOrders,

      // 商品統計
      totalItemsSold,

      // 特殊統計
      giftOrders: orders.filter(order => order.isGift).length,
      urgentOrders: orders.filter(order => order.priority === OrderPriority.URGENT).length,
      manualReviewOrders: orders.filter(order => order.manualReviewRequired).length
    };
  }

  /**
   * 批次更新訂單狀態
   */
  batchUpdateStatus(orderIds, newStatus, reason, changedBy = null) {
    try {
      const results = {
        successful: [],
        failed: []
      };

      orderIds.forEach(id => {
        const result = this.updateOrderStatus(id, newStatus, reason, changedBy);
        if (result.success) {
          results.successful.push(id);
        } else {
          results.failed.push({ id, error: result.error });
        }
      });

      return {
        success: true,
        results
      };
    } catch (error) {
      console.error('Error in batch status update:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 獲取訂單趨勢資料
   */
  getOrderTrends(days = 30) {
    const orders = this.getAllOrders();
    const now = new Date();
    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate < dayEnd;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      trends.push({
        date: dayStart.toISOString().split('T')[0],
        orderCount: dayOrders.length,
        revenue: dayRevenue,
        averageOrderValue: dayOrders.length > 0 ? dayRevenue / dayOrders.length : 0
      });
    }

    return trends;
  }
}

// 創建全域實例
const orderDataManager = new OrderDataManager();

export default orderDataManager;