// 單據管理系統核心數據管理器
class DocumentDataManager {
  constructor() {
    this.documents = this.initializeDocuments();
    this.workflows = this.initializeWorkflows();
    this.approvals = this.initializeApprovals();
    this.templates = this.initializeTemplates();
  }

  // 單據類型定義
  static DocumentTypes = {
    // 銷售相關單據
    SALES_ORDER: 'sales_order',
    SALES_RETURN: 'sales_return',
    DELIVERY_ORDER: 'delivery_order',
    SALES_INVOICE: 'sales_invoice',
    PAYMENT_RECEIPT: 'payment_receipt',
    REFUND_RECEIPT: 'refund_receipt',
    
    // 採購相關單據
    PURCHASE_REQUEST: 'purchase_request',
    PURCHASE_ORDER: 'purchase_order',
    PURCHASE_RETURN: 'purchase_return',
    GOODS_RECEIPT: 'goods_receipt',
    PURCHASE_INVOICE: 'purchase_invoice',
    PAYMENT_VOUCHER: 'payment_voucher',
    
    // 庫存相關單據
    STOCK_IN: 'stock_in',
    STOCK_OUT: 'stock_out',
    STOCK_TRANSFER: 'stock_transfer',
    STOCK_COUNT: 'stock_count',
    STOCK_ADJUSTMENT: 'stock_adjustment',
    
    // 財務相關單據
    JOURNAL_ENTRY: 'journal_entry',
    CASH_RECEIPT: 'cash_receipt',
    CASH_PAYMENT: 'cash_payment',
    EXPENSE_CLAIM: 'expense_claim',
    EXPENSE_REIMBURSEMENT: 'expense_reimbursement'
  };

  // 單據狀態定義
  static DocumentStatus = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    PENDING_APPROVAL: 'pending_approval',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    PARTIALLY_COMPLETED: 'partially_completed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    SUSPENDED: 'suspended',
    ERROR: 'error',
    EXPIRED: 'expired',
    CLOSED: 'closed',
    ARCHIVED: 'archived'
  };

  // 優先級定義
  static Priority = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
    CRITICAL: 'critical'
  };

  // 審核類型定義
  static ApprovalType = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    SEQUENTIAL: 'sequential',
    PARALLEL: 'parallel',
    MAJORITY: 'majority',
    UNANIMOUS: 'unanimous',
    HIERARCHICAL: 'hierarchical'
  };

  initializeDocuments() {
    const documents = [];
    const types = Object.values(DocumentDataManager.DocumentTypes);
    const statuses = Object.values(DocumentDataManager.DocumentStatus);
    const priorities = Object.values(DocumentDataManager.Priority);

    // 生成範例單據數據
    for (let i = 1; i <= 200; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 90));

      documents.push({
        id: `DOC-${String(i).padStart(6, '0')}`,
        documentNumber: this.generateDocumentNumber(type, i),
        type,
        status,
        priority,
        title: this.generateDocumentTitle(type, i),
        description: this.generateDocumentDescription(type),
        
        // 基本資訊
        companyId: 'MARELLE_001',
        branchId: 'BRANCH_MAIN',
        departmentId: this.getRandomDepartment(),
        
        // 客戶/供應商資訊
        partnerId: this.getRandomPartner(type),
        partnerName: this.getRandomPartnerName(type),
        partnerType: this.getPartnerType(type),
        
        // 金額資訊
        subtotal: Math.floor(Math.random() * 100000) + 1000,
        taxAmount: 0,
        discountAmount: Math.floor(Math.random() * 5000),
        totalAmount: 0,
        currency: 'TWD',
        
        // 日期資訊
        documentDate: baseDate,
        dueDate: new Date(baseDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        requestedDate: new Date(baseDate.getTime() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
        
        // 審核資訊
        requiresApproval: this.requiresApproval(type, status),
        approvalLevel: Math.floor(Math.random() * 3) + 1,
        approvalHistory: this.generateApprovalHistory(status),
        currentApprover: this.getCurrentApprover(status),
        
        // 相關文件
        attachments: this.generateAttachments(),
        relatedDocuments: this.generateRelatedDocuments(type),
        
        // 單據項目
        items: this.generateDocumentItems(type),
        
        // 備註資訊
        internalNotes: this.generateInternalNotes(),
        customerNotes: Math.random() > 0.7 ? this.generateCustomerNotes() : '',
        
        // 位置資訊
        warehouseId: this.getRandomWarehouse(),
        locationId: this.getRandomLocation(),
        
        // 系統資訊
        createdAt: baseDate,
        updatedAt: new Date(baseDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        createdBy: this.getRandomUser(),
        updatedBy: this.getRandomUser(),
        
        // 版本控制
        version: '1.0',
        isLatestVersion: true,
        
        // 自訂欄位
        customFields: this.generateCustomFields(type),
        
        // 工作流程
        workflowId: this.getWorkflowId(type),
        workflowStage: this.getWorkflowStage(status),
        
        // 通知設定
        notifications: this.generateNotifications(),
        
        // 標籤
        tags: this.generateTags(type),
        
        // 績效指標
        metrics: this.generateMetrics(type, status)
      });
    }

    // 計算稅額和總金額
    documents.forEach(doc => {
      doc.taxAmount = Math.floor(doc.subtotal * 0.05); // 5% 稅率
      doc.totalAmount = doc.subtotal + doc.taxAmount - doc.discountAmount;
    });

    return documents;
  }

  generateDocumentNumber(type, index) {
    const prefixes = {
      sales_order: 'SO',
      sales_return: 'SR',
      delivery_order: 'DO',
      sales_invoice: 'SI',
      payment_receipt: 'PR',
      refund_receipt: 'RR',
      purchase_request: 'PQ',
      purchase_order: 'PO',
      purchase_return: 'RT',
      goods_receipt: 'GR',
      purchase_invoice: 'PI',
      payment_voucher: 'PV',
      stock_in: 'IN',
      stock_out: 'OUT',
      stock_transfer: 'TF',
      stock_count: 'SC',
      stock_adjustment: 'SA',
      journal_entry: 'JE',
      cash_receipt: 'CR',
      cash_payment: 'CP',
      expense_claim: 'EC',
      expense_reimbursement: 'ER'
    };

    const prefix = prefixes[type] || 'DOC';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const number = String(index).padStart(4, '0');
    
    return `${prefix}${year}${month}${number}`;
  }

  generateDocumentTitle(type, index) {
    const titles = {
      sales_order: `銷售訂單 #${index}`,
      sales_return: `銷售退貨單 #${index}`,
      delivery_order: `出貨單 #${index}`,
      sales_invoice: `銷售發票 #${index}`,
      payment_receipt: `收款單 #${index}`,
      refund_receipt: `退款單 #${index}`,
      purchase_request: `採購申請單 #${index}`,
      purchase_order: `採購訂單 #${index}`,
      purchase_return: `採購退貨單 #${index}`,
      goods_receipt: `收貨單 #${index}`,
      purchase_invoice: `採購發票 #${index}`,
      payment_voucher: `付款單 #${index}`,
      stock_in: `入庫單 #${index}`,
      stock_out: `出庫單 #${index}`,
      stock_transfer: `調撥單 #${index}`,
      stock_count: `盤點單 #${index}`,
      stock_adjustment: `庫存調整單 #${index}`,
      journal_entry: `記帳憑證 #${index}`,
      cash_receipt: `現金收據 #${index}`,
      cash_payment: `現金支付單 #${index}`,
      expense_claim: `費用申請單 #${index}`,
      expense_reimbursement: `費用報銷單 #${index}`
    };

    return titles[type] || `單據 #${index}`;
  }

  generateDocumentDescription(type) {
    const descriptions = {
      sales_order: '客戶訂購商品的銷售訂單，需要確認庫存並安排出貨',
      sales_return: '客戶退貨申請，需要檢查商品狀態並處理退款',
      delivery_order: '商品出貨指示單，包含配送地址和特殊要求',
      sales_invoice: '銷售發票，記錄交易明細和稅務資訊',
      payment_receipt: '客戶付款收據，確認收款金額和方式',
      refund_receipt: '退款收據，記錄退款原因和金額',
      purchase_request: '採購需求申請，需要主管審核後轉為採購訂單',
      purchase_order: '正式採購訂單，向供應商訂購商品或服務',
      purchase_return: '採購退貨單，向供應商退回不符要求的商品',
      goods_receipt: '收貨確認單，驗收採購商品的數量和品質',
      purchase_invoice: '供應商發票，需要核對採購訂單並安排付款',
      payment_voucher: '付款憑證，向供應商支付貨款',
      stock_in: '商品入庫單，記錄進貨商品的詳細資訊',
      stock_out: '商品出庫單，記錄出貨商品的詳細資訊',
      stock_transfer: '庫存調撥單，在不同倉庫間移動商品',
      stock_count: '定期盤點單，核實實際庫存與帳面庫存',
      stock_adjustment: '庫存調整單，修正盤點差異或損耗',
      journal_entry: '會計記帳憑證，記錄財務交易',
      cash_receipt: '現金收款記錄，管理現金流入',
      cash_payment: '現金付款記錄，管理現金流出',
      expense_claim: '員工費用申請，需要主管審核',
      expense_reimbursement: '費用報銷單，返還員工墊付費用'
    };

    return descriptions[type] || '業務單據處理';
  }

  getRandomDepartment() {
    const departments = ['SALES', 'PURCHASE', 'WAREHOUSE', 'FINANCE', 'ADMIN'];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  getRandomPartner(type) {
    const salesTypes = ['sales_order', 'sales_return', 'delivery_order', 'sales_invoice', 'payment_receipt', 'refund_receipt'];
    if (salesTypes.includes(type)) {
      return `CUST_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`;
    } else {
      return `SUPP_${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`;
    }
  }

  getRandomPartnerName(type) {
    const salesTypes = ['sales_order', 'sales_return', 'delivery_order', 'sales_invoice', 'payment_receipt', 'refund_receipt'];
    if (salesTypes.includes(type)) {
      const customers = ['美麗佳人', '時尚生活', '優雅女士', '精品小舖', '魅力無限', '美顏堂', '韓系美妝', '日式護膚'];
      return customers[Math.floor(Math.random() * customers.length)];
    } else {
      const suppliers = ['韓國化妝品', '日本護膚品', '歐美彩妝', '天然保養', '專業美容', '國際香水', '有機護理', '科技美妝'];
      return suppliers[Math.floor(Math.random() * suppliers.length)];
    }
  }

  getPartnerType(type) {
    const salesTypes = ['sales_order', 'sales_return', 'delivery_order', 'sales_invoice', 'payment_receipt', 'refund_receipt'];
    return salesTypes.includes(type) ? 'customer' : 'supplier';
  }

  requiresApproval(type, status) {
    const approvalTypes = ['purchase_request', 'purchase_order', 'expense_claim', 'stock_adjustment'];
    return approvalTypes.includes(type) && 
           ['submitted', 'pending_approval', 'approved', 'rejected'].includes(status);
  }

  generateApprovalHistory(status) {
    if (!['pending_approval', 'approved', 'rejected', 'completed'].includes(status)) {
      return [];
    }

    const history = [];
    const approvers = ['王經理', '李主管', '陳總監', '張副理'];
    
    if (status === 'approved' || status === 'completed') {
      history.push({
        id: 'APP_001',
        approver: approvers[Math.floor(Math.random() * approvers.length)],
        action: 'approve',
        comments: '審核通過，同意執行',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        level: 1
      });
    } else if (status === 'rejected') {
      history.push({
        id: 'APP_002',
        approver: approvers[Math.floor(Math.random() * approvers.length)],
        action: 'reject',
        comments: '需要補充更多資料',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000),
        level: 1
      });
    }

    return history;
  }

  getCurrentApprover(status) {
    if (status === 'pending_approval') {
      const approvers = ['王經理', '李主管', '陳總監', '張副理'];
      return approvers[Math.floor(Math.random() * approvers.length)];
    }
    return null;
  }

  generateAttachments() {
    const attachments = [];
    const fileTypes = ['pdf', 'jpg', 'png', 'doc', 'xls'];
    const fileNames = ['合約文件', '商品照片', '規格說明', '報價單', '檢驗報告'];
    
    const attachmentCount = Math.floor(Math.random() * 4);
    for (let i = 0; i < attachmentCount; i++) {
      attachments.push({
        id: `ATT_${String(i + 1).padStart(3, '0')}`,
        fileName: `${fileNames[i % fileNames.length]}.${fileTypes[i % fileTypes.length]}`,
        fileSize: Math.floor(Math.random() * 5000) + 100,
        uploadDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        uploadedBy: this.getRandomUser()
      });
    }
    
    return attachments;
  }

  generateRelatedDocuments(type) {
    const related = [];
    const relationTypes = ['parent', 'child', 'reference'];
    
    const relatedCount = Math.floor(Math.random() * 3);
    for (let i = 0; i < relatedCount; i++) {
      related.push({
        id: `REL_${String(i + 1).padStart(3, '0')}`,
        documentId: `DOC-${String(Math.floor(Math.random() * 200) + 1).padStart(6, '0')}`,
        relationType: relationTypes[Math.floor(Math.random() * relationTypes.length)],
        description: '相關業務單據'
      });
    }
    
    return related;
  }

  generateDocumentItems(type) {
    const items = [];
    const products = [
      '韓式水光精華', '日系美白面膜', '歐美抗老精華', '天然保濕乳液',
      '專業遮瑕膏', '持久口紅', '防水睫毛膏', '自然眉筆',
      '溫和卸妝水', '深層清潔泡沫', '保濕化妝水', '滋潤面霜'
    ];
    
    const itemCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < itemCount; i++) {
      const quantity = Math.floor(Math.random() * 10) + 1;
      const unitPrice = Math.floor(Math.random() * 2000) + 100;
      
      items.push({
        id: `ITEM_${String(i + 1).padStart(3, '0')}`,
        lineNumber: i + 1,
        productId: `PROD_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
        productName: products[Math.floor(Math.random() * products.length)],
        quantity,
        unit: 'PCS',
        unitPrice,
        discountPercent: Math.floor(Math.random() * 20),
        discountAmount: Math.floor(unitPrice * quantity * 0.1),
        taxRate: 5,
        lineTotal: unitPrice * quantity,
        description: '高品質美妝保養品',
        specifications: this.generateSpecifications()
      });
    }
    
    return items;
  }

  generateSpecifications() {
    const specs = [
      { name: '容量', value: '30ml' },
      { name: '產地', value: '韓國' },
      { name: '保存期限', value: '3年' },
      { name: '適用膚質', value: '所有膚質' }
    ];
    
    return specs.slice(0, Math.floor(Math.random() * 4) + 1);
  }

  generateInternalNotes() {
    const notes = [
      '優先處理，客戶VIP等級',
      '注意包裝完整性',
      '需要品質檢驗',
      '客戶要求快速出貨',
      '特殊包裝要求',
      '需要主管確認',
      '緊急訂單處理'
    ];
    
    return Math.random() > 0.5 ? notes[Math.floor(Math.random() * notes.length)] : '';
  }

  generateCustomerNotes() {
    const notes = [
      '請小心包裝',
      '生日禮物，請包裝精美',
      '送貨前請電話聯繫',
      '辦公室收件',
      '週末不在家',
      '請放管理室代收'
    ];
    
    return notes[Math.floor(Math.random() * notes.length)];
  }

  getRandomWarehouse() {
    const warehouses = ['WH_MAIN', 'WH_NORTH', 'WH_SOUTH', 'WH_CENTRAL'];
    return warehouses[Math.floor(Math.random() * warehouses.length)];
  }

  getRandomLocation() {
    const locations = ['A01-01', 'A01-02', 'B02-01', 'B02-02', 'C03-01'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  getRandomUser() {
    const users = ['陳小明', '王美麗', '李大華', '張小芳', '劉志強', '林雅婷'];
    return users[Math.floor(Math.random() * users.length)];
  }

  generateCustomFields(type) {
    const fields = {};
    
    if (['sales_order', 'purchase_order'].includes(type)) {
      fields.urgentLevel = Math.floor(Math.random() * 5) + 1;
      fields.specialRequirements = Math.random() > 0.7 ? '特殊包裝' : '';
    }
    
    if (type.includes('invoice')) {
      fields.paymentTerms = Math.random() > 0.5 ? '30天' : '即期';
      fields.invoiceType = Math.random() > 0.5 ? '二聯式' : '三聯式';
    }
    
    return fields;
  }

  getWorkflowId(type) {
    const workflows = {
      sales_order: 'WF_SALES_001',
      purchase_request: 'WF_PURCHASE_001',
      expense_claim: 'WF_EXPENSE_001',
      stock_adjustment: 'WF_INVENTORY_001'
    };
    
    return workflows[type] || 'WF_STANDARD_001';
  }

  getWorkflowStage(status) {
    const stages = {
      draft: 'stage_draft',
      submitted: 'stage_review',
      pending_approval: 'stage_approval',
      approved: 'stage_execution',
      completed: 'stage_completed'
    };
    
    return stages[status] || 'stage_unknown';
  }

  generateNotifications() {
    return {
      emailEnabled: Math.random() > 0.5,
      smsEnabled: Math.random() > 0.7,
      systemEnabled: true,
      recipients: [this.getRandomUser()]
    };
  }

  generateTags(type) {
    const allTags = ['緊急', 'VIP客戶', '大宗採購', '品質要求', '快速出貨', '特殊包裝'];
    const tagCount = Math.floor(Math.random() * 3);
    const selectedTags = [];
    
    for (let i = 0; i < tagCount; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!selectedTags.includes(tag)) {
        selectedTags.push(tag);
      }
    }
    
    return selectedTags;
  }

  generateMetrics(type, status) {
    return {
      processingTime: Math.floor(Math.random() * 48) + 1, // 小時
      approvalTime: Math.floor(Math.random() * 24) + 1,   // 小時
      completionRate: Math.floor(Math.random() * 100) + 1, // 百分比
      qualityScore: Math.floor(Math.random() * 100) + 80   // 分數
    };
  }

  initializeWorkflows() {
    return [
      {
        id: 'WF_SALES_001',
        name: '銷售流程',
        description: '從訂單建立到出貨完成的完整流程',
        documentTypes: ['sales_order', 'delivery_order'],
        stages: [
          { id: 'stage_draft', name: '草稿', description: '訂單建立中' },
          { id: 'stage_review', name: '審核', description: '訂單審核中' },
          { id: 'stage_confirmed', name: '確認', description: '訂單已確認' },
          { id: 'stage_shipping', name: '出貨', description: '準備出貨中' },
          { id: 'stage_completed', name: '完成', description: '交易完成' }
        ],
        approvalRequired: true,
        approvalType: 'sequential'
      },
      {
        id: 'WF_PURCHASE_001',
        name: '採購流程',
        description: '從採購申請到收貨完成的完整流程',
        documentTypes: ['purchase_request', 'purchase_order', 'goods_receipt'],
        stages: [
          { id: 'stage_request', name: '申請', description: '採購需求申請' },
          { id: 'stage_approval', name: '審批', description: '主管審批中' },
          { id: 'stage_order', name: '訂購', description: '向供應商下單' },
          { id: 'stage_receipt', name: '收貨', description: '商品收貨驗收' },
          { id: 'stage_completed', name: '完成', description: '採購完成' }
        ],
        approvalRequired: true,
        approvalType: 'hierarchical'
      },
      {
        id: 'WF_INVENTORY_001',
        name: '庫存管理流程',
        description: '庫存異動和調整的管理流程',
        documentTypes: ['stock_in', 'stock_out', 'stock_adjustment'],
        stages: [
          { id: 'stage_request', name: '申請', description: '庫存異動申請' },
          { id: 'stage_verification', name: '驗證', description: '庫存數量驗證' },
          { id: 'stage_execution', name: '執行', description: '執行庫存異動' },
          { id: 'stage_completed', name: '完成', description: '異動完成' }
        ],
        approvalRequired: false,
        approvalType: 'single'
      }
    ];
  }

  initializeApprovals() {
    return [
      {
        id: 'APP_001',
        documentId: 'DOC-000001',
        workflowId: 'WF_PURCHASE_001',
        approver: '王經理',
        approverRole: 'manager',
        status: 'pending',
        assignedAt: new Date(),
        level: 1,
        comments: '',
        options: ['approve', 'reject', 'hold', 'return']
      },
      {
        id: 'APP_002',
        documentId: 'DOC-000002',
        workflowId: 'WF_SALES_001',
        approver: '李主管',
        approverRole: 'supervisor',
        status: 'approved',
        assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        level: 1,
        comments: '審核通過，可以進行下一步',
        options: ['approve', 'reject', 'hold', 'return']
      }
    ];
  }

  initializeTemplates() {
    return [
      {
        id: 'TPL_001',
        name: '標準銷售訂單',
        type: 'sales_order',
        description: '一般客戶銷售訂單範本',
        defaultFields: {
          currency: 'TWD',
          paymentTerms: '30天',
          shippingMethod: '宅配',
          taxRate: 5
        },
        customFields: [
          { name: 'urgentLevel', type: 'number', required: false },
          { name: 'specialPackaging', type: 'boolean', required: false }
        ]
      }
    ];
  }

  // API 方法
  getAllDocuments() {
    return this.documents;
  }

  getDocumentById(id) {
    return this.documents.find(doc => doc.id === id);
  }

  getDocumentsByType(type) {
    return this.documents.filter(doc => doc.type === type);
  }

  getDocumentsByStatus(status) {
    return this.documents.filter(doc => doc.status === status);
  }

  getPendingApprovals() {
    return this.documents.filter(doc => doc.status === 'pending_approval');
  }

  getDocumentStatistics() {
    const stats = {};
    const types = Object.values(DocumentDataManager.DocumentTypes);
    const statuses = Object.values(DocumentDataManager.DocumentStatus);

    // 按類型統計
    stats.byType = {};
    types.forEach(type => {
      stats.byType[type] = this.documents.filter(doc => doc.type === type).length;
    });

    // 按狀態統計
    stats.byStatus = {};
    statuses.forEach(status => {
      stats.byStatus[status] = this.documents.filter(doc => doc.status === status).length;
    });

    // 按優先級統計
    stats.byPriority = {};
    Object.values(DocumentDataManager.Priority).forEach(priority => {
      stats.byPriority[priority] = this.documents.filter(doc => doc.priority === priority).length;
    });

    // 待處理項目
    stats.pendingItems = {
      approvals: this.documents.filter(doc => doc.status === 'pending_approval').length,
      drafts: this.documents.filter(doc => doc.status === 'draft').length,
      inProgress: this.documents.filter(doc => doc.status === 'in_progress').length,
      urgent: this.documents.filter(doc => doc.priority === 'urgent' || doc.priority === 'critical').length
    };

    // 總計
    stats.total = this.documents.length;
    stats.completed = this.documents.filter(doc => doc.status === 'completed').length;
    stats.cancelled = this.documents.filter(doc => doc.status === 'cancelled').length;

    return stats;
  }

  getWorkflowById(id) {
    return this.workflows.find(wf => wf.id === id);
  }

  getApprovalById(id) {
    return this.approvals.find(app => app.id === id);
  }

  createDocument(documentData) {
    const newId = `DOC-${String(this.documents.length + 1).padStart(6, '0')}`;
    const document = {
      id: newId,
      ...documentData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: DocumentDataManager.DocumentStatus.DRAFT,
      version: '1.0',
      isLatestVersion: true
    };
    
    this.documents.push(document);
    return document;
  }

  updateDocument(id, updates) {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.documents[index] = {
        ...this.documents[index],
        ...updates,
        updatedAt: new Date()
      };
      return this.documents[index];
    }
    return null;
  }

  deleteDocument(id) {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      return this.documents.splice(index, 1)[0];
    }
    return null;
  }

  searchDocuments(criteria) {
    return this.documents.filter(doc => {
      let matches = true;
      
      if (criteria.type && doc.type !== criteria.type) matches = false;
      if (criteria.status && doc.status !== criteria.status) matches = false;
      if (criteria.priority && doc.priority !== criteria.priority) matches = false;
      if (criteria.partnerId && doc.partnerId !== criteria.partnerId) matches = false;
      if (criteria.dateFrom && doc.documentDate < criteria.dateFrom) matches = false;
      if (criteria.dateTo && doc.documentDate > criteria.dateTo) matches = false;
      if (criteria.amountMin && doc.totalAmount < criteria.amountMin) matches = false;
      if (criteria.amountMax && doc.totalAmount > criteria.amountMax) matches = false;
      if (criteria.keyword) {
        const keyword = criteria.keyword.toLowerCase();
        const searchFields = [doc.documentNumber, doc.title, doc.description, doc.partnerName].join(' ').toLowerCase();
        if (!searchFields.includes(keyword)) matches = false;
      }
      
      return matches;
    });
  }
}

// 全域實例
export const documentDataManager = new DocumentDataManager();
export default DocumentDataManager;