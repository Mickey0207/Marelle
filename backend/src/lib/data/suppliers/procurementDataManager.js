// 採購管理資料模組
// 提供完整的採購管理功能，包含採購單管理、供應商選擇、智慧建議等

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// 採購單狀態枚舉
const PurchaseOrderStatus = {
  DRAFT: 'draft',               // 草稿
  PENDING_APPROVAL: 'pending',   // 待審核
  APPROVED: 'approved',         // 已核准
  REJECTED: 'rejected',         // 已拒絕
  SENT_TO_SUPPLIER: 'sent',     // 已發送供應商
  CONFIRMED: 'confirmed',       // 供應商確認
  IN_PRODUCTION: 'production',  // 生產中
  READY_TO_SHIP: 'ready',       // 準備出貨
  SHIPPED: 'shipped',           // 已出貨
  DELIVERED: 'delivered',       // 已送達
  INSPECTING: 'inspecting',     // 驗收中
  COMPLETED: 'completed',       // 已完成
  CANCELLED: 'cancelled',       // 已取消
  PARTIALLY_RECEIVED: 'partial' // 部分收貨
};

// 採購單類型枚舉
const PurchaseOrderType = {
  STANDARD: 'standard',       // 一般採購
  URGENT: 'urgent',          // 緊急採購
  PLANNED: 'planned',        // 預定採購
  SAMPLE: 'sample',          // 樣品採購
  BLANKET: 'blanket',        // 框架採購
  MAINTENANCE: 'maintenance', // 維護採購
  CONSIGNMENT: 'consignment'  // 寄售採購
};

// 採購優先級枚舉
const PurchasePriority = {
  LOW: 'low',           // 低優先級
  NORMAL: 'normal',     // 正常
  HIGH: 'high',         // 高優先級
  URGENT: 'urgent',     // 緊急
  CRITICAL: 'critical'  // 關鍵
};

// 付款條件枚舉
const PaymentTerms = {
  CASH_ON_DELIVERY: 'cod',      // 貨到付款
  NET_30: 'net30',              // 30天付款
  NET_60: 'net60',              // 60天付款
  NET_90: 'net90',              // 90天付款
  ADVANCE_PAYMENT: 'advance',    // 預付款
  PARTIAL_ADVANCE: 'partial',    // 部分預付
  LETTER_OF_CREDIT: 'lc',       // 信用狀
  BANK_GUARANTEE: 'bg'          // 銀行保證
};

// 運送方式枚舉
const ShippingMethod = {
  STANDARD: 'standard',     // 標準運送
  EXPRESS: 'express',       // 快遞
  FREIGHT: 'freight',       // 貨運
  PICKUP: 'pickup',         // 自取
  DROP_SHIPPING: 'dropship' // 直送
};

// 驗收狀態枚舉
const InspectionStatus = {
  PENDING: 'pending',       // 待驗收
  IN_PROGRESS: 'progress',  // 驗收中
  PASSED: 'passed',         // 驗收通過
  FAILED: 'failed',         // 驗收不通過
  PARTIAL: 'partial',       // 部分通過
  REWORK: 'rework'          // 重新製作
};

// 預算類型枚舉
const BudgetType = {
  OPERATIONAL: 'operational',   // 營運預算
  CAPITAL: 'capital',          // 資本預算
  MARKETING: 'marketing',      // 行銷預算
  MAINTENANCE: 'maintenance',   // 維護預算
  EMERGENCY: 'emergency'       // 緊急預算
};

// 默認採購單資料
const defaultPurchaseOrders = [
  {
    id: 'po-001',
    poNumber: 'PO-2024-001',
    type: PurchaseOrderType.STANDARD,
    status: PurchaseOrderStatus.CONFIRMED,
    priority: PurchasePriority.NORMAL,
    supplierId: 'supplier-001',
    supplierName: '美妝世界股份有限公司',
    requesterId: 'user-001',
    requesterName: '張小明',
    departmentId: 'dept-001',
    departmentName: '商品部',
    budgetType: BudgetType.OPERATIONAL,
    budgetCode: 'OP-2024-Q1',
    totalAmount: 85000,
    currency: 'TWD',
    taxRate: 0.05,
    taxAmount: 4250,
    totalWithTax: 89250,
    paymentTerms: PaymentTerms.NET_30,
    shippingMethod: ShippingMethod.STANDARD,
    requestedDate: '2024-12-01',
    expectedDeliveryDate: '2024-12-15',
    actualDeliveryDate: null,
    notes: '年度庫存補充採購',
    internalNotes: '優先處理熱銷商品',
    createdAt: '2024-11-20T09:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    approvedBy: 'manager-001',
    approvedAt: '2024-11-21T10:15:00Z',
    items: [
      {
        id: 'poi-001',
        productId: 'prod-001',
        productName: '玻尿酸精華液',
        productSku: 'HA-SERUM-30ML',
        specification: '30ml/瓶',
        unitPrice: 500,
        quantity: 100,
        receivedQuantity: 0,
        totalPrice: 50000,
        notes: '要求原廠包裝'
      },
      {
        id: 'poi-002',
        productId: 'prod-002',
        productName: '膠原蛋白面膜',
        productSku: 'COL-MASK-BOX',
        specification: '10片/盒',
        unitPrice: 350,
        quantity: 100,
        receivedQuantity: 0,
        totalPrice: 35000,
        notes: '需要中文標籤'
      }
    ]
  },
  {
    id: 'po-002',
    poNumber: 'PO-2024-002',
    type: PurchaseOrderType.URGENT,
    status: PurchaseOrderStatus.IN_PRODUCTION,
    priority: PurchasePriority.HIGH,
    supplierId: 'supplier-002',
    supplierName: '精品包裝有限公司',
    requesterId: 'user-002',
    requesterName: '李美華',
    departmentId: 'dept-002',
    departmentName: '包裝部',
    budgetType: BudgetType.OPERATIONAL,
    budgetCode: 'OP-2024-Q1',
    totalAmount: 45000,
    currency: 'TWD',
    taxRate: 0.05,
    taxAmount: 2250,
    totalWithTax: 47250,
    paymentTerms: PaymentTerms.NET_30,
    shippingMethod: ShippingMethod.EXPRESS,
    requestedDate: '2024-12-03',
    expectedDeliveryDate: '2024-12-10',
    actualDeliveryDate: null,
    notes: '聖誕節包裝緊急補貨',
    internalNotes: '需要加急處理',
    createdAt: '2024-12-01T15:00:00Z',
    updatedAt: '2024-12-03T11:20:00Z',
    approvedBy: 'manager-001',
    approvedAt: '2024-12-01T16:30:00Z',
    items: [
      {
        id: 'poi-003',
        productId: 'pack-001',
        productName: '聖誕禮盒包裝',
        productSku: 'XMAS-BOX-L',
        specification: '大型禮盒',
        unitPrice: 150,
        quantity: 300,
        receivedQuantity: 0,
        totalPrice: 45000,
        notes: '紅色配金色裝飾'
      }
    ]
  }
];

// 採購建議資料
const defaultProcurementSuggestions = [
  {
    id: 'suggestion-001',
    type: 'stock_alert',
    priority: PurchasePriority.HIGH,
    productId: 'prod-003',
    productName: 'BB霜',
    currentStock: 15,
    minStock: 50,
    recommendedOrderQuantity: 200,
    estimatedCost: 60000,
    suggestedSupplierId: 'supplier-001',
    suggestedSupplierName: '美妝世界股份有限公司',
    reason: '庫存低於安全庫存，建議立即補貨',
    urgencyLevel: 'high',
    expectedStockoutDate: '2024-12-08',
    salesTrend: 'increasing',
    seasonalFactor: 1.2,
    createdAt: '2024-12-01T08:00:00Z',
    isActionTaken: false
  },
  {
    id: 'suggestion-002',
    type: 'supplier_performance',
    priority: PurchasePriority.NORMAL,
    supplierId: 'supplier-003',
    supplierName: '綠色環保材料企業社',
    issue: '交貨延遲頻繁',
    recommendation: '建議尋找備用供應商或重新評估合作關係',
    affectedOrders: ['po-003', 'po-005'],
    performanceScore: 3.2,
    createdAt: '2024-11-28T10:30:00Z',
    isActionTaken: false
  },
  {
    id: 'suggestion-003',
    type: 'cost_optimization',
    priority: PurchasePriority.NORMAL,
    category: '化妝品',
    currentAverageCost: 450,
    optimizedAverageCost: 380,
    potentialSavings: 14000,
    recommendation: '通過批量採購可降低單位成本約15%',
    batchSize: 500,
    savingsPercentage: 15.5,
    createdAt: '2024-11-25T14:15:00Z',
    isActionTaken: false
  }
];

// 驗收記錄資料
const defaultInspectionRecords = [
  {
    id: 'inspect-001',
    purchaseOrderId: 'po-001',
    poNumber: 'PO-2024-001',
    inspectionDate: '2024-12-15',
    inspectorId: 'inspector-001',
    inspectorName: '品管王小美',
    status: InspectionStatus.PASSED,
    overallRating: 4.5,
    items: [
      {
        id: 'inspect-item-001',
        productId: 'prod-001',
        productName: '玻尿酸精華液',
        orderedQuantity: 100,
        receivedQuantity: 100,
        acceptedQuantity: 98,
        rejectedQuantity: 2,
        rejectionReason: '包裝破損',
        qualityScore: 4.8,
        notes: '整體品質良好，僅少量包裝問題'
      }
    ],
    totalItemsInspected: 2,
    totalAccepted: 198,
    totalRejected: 2,
    overallNotes: '供應商品質穩定，建議繼續合作',
    actionRequired: false,
    completedAt: '2024-12-15T16:30:00Z'
  }
];

// 預算控制資料
const defaultBudgetControl = {
  budgets: [
    {
      id: 'budget-001',
      code: 'OP-2024-Q1',
      name: '2024年第一季營運預算',
      type: BudgetType.OPERATIONAL,
      totalAmount: 500000,
      usedAmount: 234500,
      remainingAmount: 265500,
      utilizationRate: 46.9,
      department: '商品部',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'active'
    },
    {
      id: 'budget-002',
      code: 'MK-2024-Q1',
      name: '2024年第一季行銷預算',
      type: BudgetType.MARKETING,
      totalAmount: 200000,
      usedAmount: 145000,
      remainingAmount: 55000,
      utilizationRate: 72.5,
      department: '行銷部',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'active'
    }
  ],
  alerts: [
    {
      id: 'alert-001',
      budgetId: 'budget-002',
      type: 'high_utilization',
      message: '行銷預算使用率已達72.5%，請注意預算控制',
      severity: 'warning',
      createdAt: '2024-12-01T09:00:00Z'
    }
  ]
};

// 成本分析資料
const defaultCostAnalysis = {
  categories: [
    {
      id: 'category-001',
      name: '化妝品',
      totalSpent: 180000,
      percentageOfTotal: 45.2,
      averageUnitCost: 420,
      trend: 'stable',
      monthlySpending: [
        { month: '2024-10', amount: 65000 },
        { month: '2024-11', amount: 58000 },
        { month: '2024-12', amount: 57000 }
      ]
    },
    {
      id: 'category-002',
      name: '包裝材料',
      totalSpent: 95000,
      percentageOfTotal: 23.8,
      averageUnitCost: 120,
      trend: 'increasing',
      monthlySpending: [
        { month: '2024-10', amount: 28000 },
        { month: '2024-11', amount: 32000 },
        { month: '2024-12', amount: 35000 }
      ]
    }
  ],
  suppliers: [
    {
      supplierId: 'supplier-001',
      supplierName: '美妝世界股份有限公司',
      totalSpent: 145000,
      orderCount: 12,
      averageOrderValue: 12083,
      onTimeDeliveryRate: 95.5,
      qualityRating: 4.6
    },
    {
      supplierId: 'supplier-002',
      supplierName: '精品包裝有限公司',
      totalSpent: 89000,
      orderCount: 8,
      averageOrderValue: 11125,
      onTimeDeliveryRate: 88.2,
      qualityRating: 4.3
    }
  ]
};

// 數據管理類
class ProcurementDataManager {
  constructor() {
    this.purchaseOrders = [...defaultPurchaseOrders];
    this.suggestions = [...defaultProcurementSuggestions];
    this.inspectionRecords = [...defaultInspectionRecords];
    this.budgetControl = { ...defaultBudgetControl };
    this.costAnalysis = { ...defaultCostAnalysis };
  }

  // 採購單管理方法
  getPurchaseOrders(filters = {}) {
    let orders = [...this.purchaseOrders];
    
    if (filters.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters.type) {
      orders = orders.filter(order => order.type === filters.type);
    }
    
    if (filters.supplierId) {
      orders = orders.filter(order => order.supplierId === filters.supplierId);
    }
    
    if (filters.dateFrom) {
      orders = orders.filter(order => order.createdAt >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      orders = orders.filter(order => order.createdAt <= filters.dateTo);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      orders = orders.filter(order => 
        order.poNumber.toLowerCase().includes(searchTerm) ||
        order.supplierName.toLowerCase().includes(searchTerm) ||
        order.notes.toLowerCase().includes(searchTerm)
      );
    }
    
    return orders;
  }

  getPurchaseOrderById(id) {
    return this.purchaseOrders.find(order => order.id === id);
  }

  createPurchaseOrder(orderData) {
    const newOrder = {
      id: generateId(),
      poNumber: this.generatePONumber(),
      status: PurchaseOrderStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };
    
    this.purchaseOrders.unshift(newOrder);
    return newOrder;
  }

  updatePurchaseOrder(id, updates) {
    const index = this.purchaseOrders.findIndex(order => order.id === id);
    if (index !== -1) {
      this.purchaseOrders[index] = {
        ...this.purchaseOrders[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.purchaseOrders[index];
    }
    return null;
  }

  deletePurchaseOrder(id) {
    const index = this.purchaseOrders.findIndex(order => order.id === id);
    if (index !== -1) {
      return this.purchaseOrders.splice(index, 1)[0];
    }
    return null;
  }

  // 生成採購單號
  generatePONumber() {
    const year = new Date().getFullYear();
    const existingNumbers = this.purchaseOrders
      .map(order => order.poNumber)
      .filter(num => num.startsWith(`PO-${year}-`))
      .map(num => parseInt(num.split('-')[2]))
      .sort((a, b) => b - a);
    
    const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
    return `PO-${year}-${nextNumber.toString().padStart(3, '0')}`;
  }

  // 採購建議方法
  getProcurementSuggestions(filters = {}) {
    let suggestions = [...this.suggestions];
    
    if (filters.type) {
      suggestions = suggestions.filter(suggestion => suggestion.type === filters.type);
    }
    
    if (filters.priority) {
      suggestions = suggestions.filter(suggestion => suggestion.priority === filters.priority);
    }
    
    if (filters.isActionTaken !== undefined) {
      suggestions = suggestions.filter(suggestion => suggestion.isActionTaken === filters.isActionTaken);
    }
    
    return suggestions.sort((a, b) => {
      const priorityOrder = { 'critical': 5, 'urgent': 4, 'high': 3, 'normal': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  markSuggestionAsActionTaken(id) {
    const suggestion = this.suggestions.find(s => s.id === id);
    if (suggestion) {
      suggestion.isActionTaken = true;
      suggestion.actionTakenAt = new Date().toISOString();
    }
    return suggestion;
  }

  // 驗收管理方法
  getInspectionRecords(filters = {}) {
    let records = [...this.inspectionRecords];
    
    if (filters.status) {
      records = records.filter(record => record.status === filters.status);
    }
    
    if (filters.purchaseOrderId) {
      records = records.filter(record => record.purchaseOrderId === filters.purchaseOrderId);
    }
    
    return records;
  }

  createInspectionRecord(recordData) {
    const newRecord = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...recordData
    };
    
    this.inspectionRecords.unshift(newRecord);
    return newRecord;
  }

  // 預算控制方法
  getBudgetInfo() {
    return this.budgetControl;
  }

  checkBudgetAvailability(budgetCode, amount) {
    const budget = this.budgetControl.budgets.find(b => b.code === budgetCode);
    if (!budget) {
      return { available: false, reason: '預算代碼不存在' };
    }
    
    if (budget.remainingAmount < amount) {
      return { 
        available: false, 
        reason: '預算不足',
        remaining: budget.remainingAmount,
        required: amount
      };
    }
    
    return { available: true, remaining: budget.remainingAmount - amount };
  }

  // 成本分析方法
  getCostAnalysis() {
    return this.costAnalysis;
  }

  // 儀表板統計數據
  getDashboardStats() {
    const today = new Date();
    const thisMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const totalOrders = this.purchaseOrders.length;
    const pendingOrders = this.purchaseOrders.filter(order => 
      [PurchaseOrderStatus.PENDING_APPROVAL, PurchaseOrderStatus.SENT_TO_SUPPLIER].includes(order.status)
    ).length;
    
    const completedOrders = this.purchaseOrders.filter(order => 
      order.status === PurchaseOrderStatus.COMPLETED
    ).length;
    
    const thisMonthOrders = this.purchaseOrders.filter(order => 
      order.createdAt.startsWith(thisMonth)
    );
    
    const thisMonthSpending = thisMonthOrders.reduce((sum, order) => sum + order.totalWithTax, 0);
    
    const urgentSuggestions = this.suggestions.filter(suggestion => 
      suggestion.priority === PurchasePriority.URGENT && !suggestion.isActionTaken
    ).length;
    
    const pendingInspections = this.inspectionRecords.filter(record => 
      record.status === InspectionStatus.PENDING
    ).length;

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      thisMonthSpending,
      urgentSuggestions,
      pendingInspections,
      averageOrderValue: totalOrders > 0 ? thisMonthSpending / thisMonthOrders.length : 0,
      onTimeDeliveryRate: this.calculateOnTimeDeliveryRate()
    };
  }

  calculateOnTimeDeliveryRate() {
    const completedOrders = this.purchaseOrders.filter(order => 
      order.status === PurchaseOrderStatus.COMPLETED && order.actualDeliveryDate
    );
    
    if (completedOrders.length === 0) return 0;
    
    const onTimeOrders = completedOrders.filter(order => 
      order.actualDeliveryDate <= order.expectedDeliveryDate
    );
    
    return (onTimeOrders.length / completedOrders.length) * 100;
  }
}

// 創建全局實例
const procurementDataManager = new ProcurementDataManager();

// 導出枚舉和管理器
export {
  PurchaseOrderStatus,
  PurchaseOrderType,
  PurchasePriority,
  PaymentTerms,
  ShippingMethod,
  InspectionStatus,
  BudgetType,
  procurementDataManager
};

export default procurementDataManager;