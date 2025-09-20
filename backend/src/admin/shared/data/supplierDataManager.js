// 供應商資料管理模組
// 模仿 giftDataManager.js 的結構，提供完整的供應商管理功能

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// 供應商狀態枚舉
const SupplierStatus = {
  ACTIVE: 'active',           // 活躍
  INACTIVE: 'inactive',       // 停用
  PENDING: 'pending',         // 待審核
  SUSPENDED: 'suspended',     // 暫停合作
  BLACKLISTED: 'blacklisted'  // 黑名單
};

// 供應商分級枚舉
const SupplierGrade = {
  A_STRATEGIC: 'A',     // A級：策略性供應商
  B_PREFERRED: 'B',     // B級：優選供應商
  C_QUALIFIED: 'C',     // C級：合格供應商
  D_CONDITIONAL: 'D',   // D級：條件性供應商
  E_UNQUALIFIED: 'E'    // E級：不合格供應商
};

// 公司類型枚舉
const CompanyType = {
  CORPORATION: 'corporation',         // 股份有限公司
  LIMITED: 'limited',                // 有限公司
  PARTNERSHIP: 'partnership',        // 合夥企業
  SOLE_PROPRIETORSHIP: 'sole',       // 獨資企業
  FOREIGN: 'foreign'                 // 外商企業
};

// 聯絡人類型枚舉
const ContactType = {
  PRIMARY: 'primary',       // 主要負責人
  SALES: 'sales',          // 業務聯絡人
  TECHNICAL: 'technical',   // 技術聯絡人
  FINANCE: 'finance',      // 財務聯絡人
  LOGISTICS: 'logistics',   // 物流聯絡人
  QUALITY: 'quality'       // 品管聯絡人
};

// 付款方式枚舉
const PaymentType = {
  BANK_TRANSFER: 'bank_transfer',     // 銀行轉帳
  CREDIT_CARD: 'credit_card',         // 信用卡
  CHECK: 'check',                     // 支票
  CASH: 'cash',                       // 現金
  LETTER_OF_CREDIT: 'letter_of_credit', // 信用狀
  WIRE_TRANSFER: 'wire_transfer',     // 電匯
  E_WALLET: 'e_wallet'               // 電子錢包
};

// 默認供應商資料
const defaultSuppliers = [
  {
    id: 'supplier-001',
    companyName: '美妝世界股份有限公司',
    companyNameEn: 'Beauty World Corp.',
    taxId: '12345678',
    businessLicense: 'BL-2023-001',
    establishedDate: '2015-03-15',
    companyType: CompanyType.CORPORATION,
    industry: '化妝品批發',
    scale: 'medium',
    website: 'https://beautyworld.com.tw',
    description: '專業化妝品供應商，提供各類美妝產品',
    logo: '/images/suppliers/beauty-world-logo.png',
    status: SupplierStatus.ACTIVE,
    grade: SupplierGrade.A_STRATEGIC,
    overallRating: 4.8,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z'
  },
  {
    id: 'supplier-002',
    companyName: '精品包裝有限公司',
    companyNameEn: 'Premium Packaging Ltd.',
    taxId: '87654321',
    businessLicense: 'BL-2023-002',
    establishedDate: '2018-08-20',
    companyType: CompanyType.LIMITED,
    industry: '包裝材料',
    scale: 'small',
    website: 'https://premium-pack.com',
    description: '專業包裝材料供應商，提供精美包裝解決方案',
    logo: '/images/suppliers/premium-pack-logo.png',
    status: SupplierStatus.ACTIVE,
    grade: SupplierGrade.B_PREFERRED,
    overallRating: 4.5,
    createdAt: '2023-02-20T09:15:00Z',
    updatedAt: '2024-11-28T14:20:00Z'
  },
  {
    id: 'supplier-003',
    companyName: '綠色環保材料企業社',
    companyNameEn: 'Green Eco Materials',
    taxId: '11223344',
    businessLicense: 'BL-2023-003',
    establishedDate: '2020-12-10',
    companyType: CompanyType.SOLE_PROPRIETORSHIP,
    industry: '環保材料',
    scale: 'small',
    website: 'https://green-eco.tw',
    description: '專注於環保材料的供應商，提供可持續包裝解決方案',
    logo: '/images/suppliers/green-eco-logo.png',
    status: SupplierStatus.ACTIVE,
    grade: SupplierGrade.C_QUALIFIED,
    overallRating: 4.2,
    createdAt: '2023-03-10T11:00:00Z',
    updatedAt: '2024-11-25T16:45:00Z'
  }
];

// 供應商聯絡人資料
const defaultContacts = [
  {
    id: 'contact-001',
    supplierId: 'supplier-001',
    contactType: ContactType.PRIMARY,
    name: '張美玲',
    title: '業務經理',
    department: '業務部',
    phone: '02-2234-5678',
    mobile: '0912-345-678',
    email: 'meiling.zhang@beautyworld.com.tw',
    wechat: 'meiling_zhang',
    line: 'meiling123',
    isPrimary: true,
    isActive: true,
    notes: '主要業務聯絡人，負責產品報價與訂單處理'
  },
  {
    id: 'contact-002',
    supplierId: 'supplier-001',
    contactType: ContactType.TECHNICAL,
    name: '李技師',
    title: '技術顧問',
    department: '技術部',
    phone: '02-2234-5679',
    mobile: '0987-654-321',
    email: 'tech.li@beautyworld.com.tw',
    isPrimary: false,
    isActive: true,
    notes: '技術問題聯絡人'
  },
  {
    id: 'contact-003',
    supplierId: 'supplier-002',
    contactType: ContactType.SALES,
    name: '王小明',
    title: '銷售代表',
    department: '銷售部',
    phone: '02-8765-4321',
    mobile: '0923-456-789',
    email: 'xiaoming.wang@premium-pack.com',
    isPrimary: true,
    isActive: true,
    notes: '包裝材料業務負責人'
  }
];

// 供應商商品關聯資料
const defaultSupplierProducts = [
  {
    id: 'sp-001',
    supplierId: 'supplier-001',
    productId: 'product-001', // 假設的商品ID
    supplierProductCode: 'BW-LP-001',
    supplierProductName: '保濕唇膏經典款',
    supplierPrice: 85.00,
    currency: 'TWD',
    minOrderQuantity: 100,
    maxOrderQuantity: 5000,
    leadTimeDays: 7,
    availability: 'in_stock',
    supplierStock: 2500,
    lastPriceUpdate: '2024-11-15T10:00:00Z',
    isMainSupplier: true,
    priority: 1,
    status: 'active',
    notes: '熱銷商品，建議保持充足庫存'
  },
  {
    id: 'sp-002',
    supplierId: 'supplier-002',
    productId: 'product-002',
    supplierProductCode: 'PP-BOX-001',
    supplierProductName: '精美禮品盒',
    supplierPrice: 25.00,
    currency: 'TWD',
    minOrderQuantity: 200,
    leadTimeDays: 10,
    availability: 'in_stock',
    supplierStock: 1000,
    lastPriceUpdate: '2024-11-10T15:30:00Z',
    isMainSupplier: true,
    priority: 1,
    status: 'active',
    notes: '可客製化印刷'
  }
];

// 供應商績效評估資料
const defaultPerformanceMetrics = [
  {
    id: 'perf-001',
    supplierId: 'supplier-001',
    evaluationPeriod: {
      start: '2024-07-01',
      end: '2024-09-30'
    },
    evaluationType: 'quarterly',
    overallRating: 4.8,
    qualityScore: 4.9,
    deliveryScore: 4.7,
    serviceScore: 4.8,
    costScore: 4.6,
    onTimeDeliveryRate: 95.5,
    qualityPassRate: 98.2,
    defectRate: 1.8,
    returnRate: 0.5,
    averageLeadTime: 6.5,
    responseTime: 2.1,
    evaluatedBy: 'admin-001',
    status: 'completed',
    createdAt: '2024-10-01T09:00:00Z'
  },
  {
    id: 'perf-002',
    supplierId: 'supplier-002',
    evaluationPeriod: {
      start: '2024-07-01',
      end: '2024-09-30'
    },
    evaluationType: 'quarterly',
    overallRating: 4.5,
    qualityScore: 4.6,
    deliveryScore: 4.3,
    serviceScore: 4.7,
    costScore: 4.4,
    onTimeDeliveryRate: 89.2,
    qualityPassRate: 96.8,
    defectRate: 3.2,
    returnRate: 1.2,
    averageLeadTime: 9.8,
    responseTime: 3.5,
    evaluatedBy: 'admin-001',
    status: 'completed',
    createdAt: '2024-10-01T10:30:00Z'
  }
];

// 供應商資料管理類
class SupplierDataManager {
  constructor() {
    this.storageKey = 'marelle-suppliers';
    this.contactsKey = 'marelle-supplier-contacts';
    this.productsKey = 'marelle-supplier-products';
    this.performanceKey = 'marelle-supplier-performance';
    this.initializeData();
  }

  // 初始化資料
  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(defaultSuppliers));
    }
    if (!localStorage.getItem(this.contactsKey)) {
      localStorage.setItem(this.contactsKey, JSON.stringify(defaultContacts));
    }
    if (!localStorage.getItem(this.productsKey)) {
      localStorage.setItem(this.productsKey, JSON.stringify(defaultSupplierProducts));
    }
    if (!localStorage.getItem(this.performanceKey)) {
      localStorage.setItem(this.performanceKey, JSON.stringify(defaultPerformanceMetrics));
    }
  }

  // 獲取所有供應商
  getAllSuppliers() {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return suppliers.map(supplier => ({
        ...supplier,
        contactsCount: this.getSupplierContacts(supplier.id).length,
        productsCount: this.getSupplierProducts(supplier.id).length,
        latestPerformance: this.getLatestPerformance(supplier.id)
      }));
    } catch (error) {
      console.error('Error loading suppliers:', error);
      return [];
    }
  }

  // 根據ID獲取供應商
  getSupplierById(id) {
    const suppliers = this.getAllSuppliers();
    return suppliers.find(supplier => supplier.id === id);
  }

  // 創建新供應商
  createSupplier(supplierData) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      
      const newSupplier = {
        id: generateId(),
        ...supplierData,
        status: supplierData.status || SupplierStatus.PENDING,
        grade: supplierData.grade || SupplierGrade.E_UNQUALIFIED,
        overallRating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      suppliers.push(newSupplier);
      localStorage.setItem(this.storageKey, JSON.stringify(suppliers));
      
      return { success: true, supplier: newSupplier };
    } catch (error) {
      console.error('Error creating supplier:', error);
      return { success: false, error: error.message };
    }
  }

  // 更新供應商
  updateSupplier(id, updateData) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const index = suppliers.findIndex(supplier => supplier.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Supplier not found' };
      }

      suppliers[index] = {
        ...suppliers[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(suppliers));
      return { success: true, supplier: suppliers[index] };
    } catch (error) {
      console.error('Error updating supplier:', error);
      return { success: false, error: error.message };
    }
  }

  // 刪除供應商
  deleteSupplier(id) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filteredSuppliers = suppliers.filter(supplier => supplier.id !== id);
      
      // 同時刪除相關的聯絡人和商品關聯
      this.deleteSupplierContacts(id);
      this.deleteSupplierProducts(id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredSuppliers));
      return { success: true };
    } catch (error) {
      console.error('Error deleting supplier:', error);
      return { success: false, error: error.message };
    }
  }

  // 供應商聯絡人管理
  getSupplierContacts(supplierId) {
    try {
      const contacts = JSON.parse(localStorage.getItem(this.contactsKey) || '[]');
      return contacts.filter(contact => contact.supplierId === supplierId);
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  }

  createContact(contactData) {
    try {
      const contacts = JSON.parse(localStorage.getItem(this.contactsKey) || '[]');
      
      const newContact = {
        id: generateId(),
        ...contactData,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      contacts.push(newContact);
      localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
      
      return { success: true, contact: newContact };
    } catch (error) {
      console.error('Error creating contact:', error);
      return { success: false, error: error.message };
    }
  }

  updateContact(id, updateData) {
    try {
      const contacts = JSON.parse(localStorage.getItem(this.contactsKey) || '[]');
      const index = contacts.findIndex(contact => contact.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Contact not found' };
      }

      contacts[index] = { ...contacts[index], ...updateData };
      localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
      
      return { success: true, contact: contacts[index] };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { success: false, error: error.message };
    }
  }

  deleteContact(id) {
    try {
      const contacts = JSON.parse(localStorage.getItem(this.contactsKey) || '[]');
      const filteredContacts = contacts.filter(contact => contact.id !== id);
      
      localStorage.setItem(this.contactsKey, JSON.stringify(filteredContacts));
      return { success: true };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { success: false, error: error.message };
    }
  }

  deleteSupplierContacts(supplierId) {
    try {
      const contacts = JSON.parse(localStorage.getItem(this.contactsKey) || '[]');
      const filteredContacts = contacts.filter(contact => contact.supplierId !== supplierId);
      localStorage.setItem(this.contactsKey, JSON.stringify(filteredContacts));
    } catch (error) {
      console.error('Error deleting supplier contacts:', error);
    }
  }

  // 供應商商品關聯管理
  getSupplierProducts(supplierId) {
    try {
      const supplierProducts = JSON.parse(localStorage.getItem(this.productsKey) || '[]');
      return supplierProducts.filter(sp => sp.supplierId === supplierId);
    } catch (error) {
      console.error('Error loading supplier products:', error);
      return [];
    }
  }

  createSupplierProduct(productData) {
    try {
      const supplierProducts = JSON.parse(localStorage.getItem(this.productsKey) || '[]');
      
      const newSupplierProduct = {
        id: generateId(),
        ...productData,
        currency: productData.currency || 'TWD',
        availability: productData.availability || 'in_stock',
        status: 'active',
        lastPriceUpdate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      supplierProducts.push(newSupplierProduct);
      localStorage.setItem(this.productsKey, JSON.stringify(supplierProducts));
      
      return { success: true, supplierProduct: newSupplierProduct };
    } catch (error) {
      console.error('Error creating supplier product:', error);
      return { success: false, error: error.message };
    }
  }

  deleteSupplierProducts(supplierId) {
    try {
      const supplierProducts = JSON.parse(localStorage.getItem(this.productsKey) || '[]');
      const filteredProducts = supplierProducts.filter(sp => sp.supplierId !== supplierId);
      localStorage.setItem(this.productsKey, JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Error deleting supplier products:', error);
    }
  }

  // 供應商績效評估管理
  getLatestPerformance(supplierId) {
    try {
      const performances = JSON.parse(localStorage.getItem(this.performanceKey) || '[]');
      const supplierPerformances = performances.filter(p => p.supplierId === supplierId);
      return supplierPerformances.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    } catch (error) {
      console.error('Error loading performance:', error);
      return null;
    }
  }

  getSupplierPerformances(supplierId) {
    try {
      const performances = JSON.parse(localStorage.getItem(this.performanceKey) || '[]');
      return performances.filter(p => p.supplierId === supplierId);
    } catch (error) {
      console.error('Error loading performances:', error);
      return [];
    }
  }

  // 搜尋和篩選功能
  searchSuppliers(query, filters = {}) {
    let suppliers = this.getAllSuppliers();
    
    // 文字搜尋
    if (query) {
      const searchTerm = query.toLowerCase();
      suppliers = suppliers.filter(supplier => 
        supplier.companyName.toLowerCase().includes(searchTerm) ||
        supplier.companyNameEn?.toLowerCase().includes(searchTerm) ||
        supplier.taxId.includes(searchTerm) ||
        supplier.industry.toLowerCase().includes(searchTerm)
      );
    }
    
    // 狀態篩選
    if (filters.status) {
      suppliers = suppliers.filter(supplier => supplier.status === filters.status);
    }
    
    // 分級篩選
    if (filters.grade) {
      suppliers = suppliers.filter(supplier => supplier.grade === filters.grade);
    }
    
    // 公司類型篩選
    if (filters.companyType) {
      suppliers = suppliers.filter(supplier => supplier.companyType === filters.companyType);
    }
    
    // 評分範圍篩選
    if (filters.minRating) {
      suppliers = suppliers.filter(supplier => supplier.overallRating >= filters.minRating);
    }
    
    return suppliers;
  }

  // 統計資料
  getSupplierStatistics() {
    const suppliers = this.getAllSuppliers();
    
    return {
      total: suppliers.length,
      active: suppliers.filter(s => s.status === SupplierStatus.ACTIVE).length,
      pending: suppliers.filter(s => s.status === SupplierStatus.PENDING).length,
      suspended: suppliers.filter(s => s.status === SupplierStatus.SUSPENDED).length,
      gradeDistribution: {
        A: suppliers.filter(s => s.grade === SupplierGrade.A_STRATEGIC).length,
        B: suppliers.filter(s => s.grade === SupplierGrade.B_PREFERRED).length,
        C: suppliers.filter(s => s.grade === SupplierGrade.C_QUALIFIED).length,
        D: suppliers.filter(s => s.grade === SupplierGrade.D_CONDITIONAL).length,
        E: suppliers.filter(s => s.grade === SupplierGrade.E_UNQUALIFIED).length
      },
      averageRating: suppliers.reduce((sum, s) => sum + s.overallRating, 0) / suppliers.length || 0
    };
  }
}

// 導出枚舉和管理器
export {
  SupplierStatus,
  SupplierGrade,
  CompanyType,
  ContactType,
  PaymentType,
  SupplierDataManager
};

// 默認導出實例
export default new SupplierDataManager();