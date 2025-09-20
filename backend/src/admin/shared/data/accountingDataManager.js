// 會計管理系統數據層
// 基於 Marelle 電商平台的會計功能實現

// 會計科目類型定義
export const AccountType = {
  ASSET: 'asset',                  // 資產
  LIABILITY: 'liability',          // 負債
  EQUITY: 'equity',                // 權益
  REVENUE: 'revenue',              // 收入
  EXPENSE: 'expense',              // 費用
  COST_OF_GOODS: 'cost_of_goods'   // 銷貨成本
};

// 會計科目類別
export const AccountCategory = {
  // 資產類別
  CURRENT_ASSETS: 'current_assets',           // 流動資產
  NON_CURRENT_ASSETS: 'non_current_assets',   // 非流動資產
  
  // 負債類別
  CURRENT_LIABILITIES: 'current_liabilities', // 流動負債
  NON_CURRENT_LIABILITIES: 'non_current_liabilities', // 非流動負債
  
  // 權益類別
  OWNERS_EQUITY: 'owners_equity',             // 業主權益
  RETAINED_EARNINGS: 'retained_earnings',     // 保留盈餘
  
  // 收入類別
  OPERATING_REVENUE: 'operating_revenue',     // 營業收入
  NON_OPERATING_REVENUE: 'non_operating_revenue', // 營業外收入
  
  // 費用類別
  OPERATING_EXPENSES: 'operating_expenses',   // 營業費用
  NON_OPERATING_EXPENSES: 'non_operating_expenses', // 營業外費用
  
  // 成本類別
  DIRECT_COSTS: 'direct_costs',               // 直接成本
  INDIRECT_COSTS: 'indirect_costs'            // 間接成本
};

// 分錄來源類型
export const EntrySourceType = {
  MANUAL: 'manual',                // 手動建立
  ORDER: 'order',                  // 訂單
  PAYMENT: 'payment',              // 付款
  REFUND: 'refund',                // 退款
  PURCHASE: 'purchase',            // 採購
  INVENTORY: 'inventory',          // 庫存
  EXPENSE: 'expense',              // 費用
  PAYROLL: 'payroll',              // 薪資
  DEPRECIATION: 'depreciation',    // 折舊
  ADJUSTMENT: 'adjustment',        // 調整
  CLOSING: 'closing'               // 結帳
};

// 分錄狀態
export const EntryStatus = {
  DRAFT: 'draft',                  // 草稿
  PENDING: 'pending',              // 待審核
  APPROVED: 'approved',            // 已核准
  POSTED: 'posted',                // 已過帳
  REVERSED: 'reversed'             // 已沖銷
};

// 報表類型
export const ReportType = {
  BALANCE_SHEET: 'balance_sheet',           // 資產負債表
  INCOME_STATEMENT: 'income_statement',     // 損益表
  CASH_FLOW: 'cash_flow',                   // 現金流量表
  TRIAL_BALANCE: 'trial_balance',           // 試算表
  GENERAL_LEDGER: 'general_ledger',         // 總分類帳
  ACCOUNTS_RECEIVABLE: 'accounts_receivable', // 應收帳款明細
  ACCOUNTS_PAYABLE: 'accounts_payable',     // 應付帳款明細
  INVENTORY_REPORT: 'inventory_report',     // 存貨報表
  SALES_REPORT: 'sales_report',             // 銷售報表
  EXPENSE_REPORT: 'expense_report'          // 費用報表
};

class AccountingDataManager {
  constructor() {
    this.accounts = [];
    this.journalEntries = [];
    this.journalEntryLines = [];
    this.reports = [];
    this.bankReconciliations = [];
    
    // 初始化數據
    this.init();
  }

  init() {
    // 如果本地存儲有數據則載入，否則生成樣本數據
    this.loadFromStorage();
    
    if (this.accounts.length === 0) {
      this.generateSampleAccounts();
    }
    
    if (this.journalEntries.length === 0) {
      this.generateSampleJournalEntries();
    }
    
    if (this.reports.length === 0) {
      this.generateSampleReports();
    }
  }

  // 載入本地存儲數據
  loadFromStorage() {
    try {
      const accountsData = localStorage.getItem('marelle-accounting-accounts');
      const entriesData = localStorage.getItem('marelle-accounting-entries');
      const reportsData = localStorage.getItem('marelle-accounting-reports');
      
      if (accountsData) this.accounts = JSON.parse(accountsData);
      if (entriesData) this.journalEntries = JSON.parse(entriesData);
      if (reportsData) this.reports = JSON.parse(reportsData);
    } catch (error) {
      console.error('載入會計數據失敗:', error);
    }
  }

  // 保存到本地存儲
  saveToStorage() {
    try {
      localStorage.setItem('marelle-accounting-accounts', JSON.stringify(this.accounts));
      localStorage.setItem('marelle-accounting-entries', JSON.stringify(this.journalEntries));
      localStorage.setItem('marelle-accounting-reports', JSON.stringify(this.reports));
    } catch (error) {
      console.error('保存會計數據失敗:', error);
    }
  }

  // 生成樣本會計科目
  generateSampleAccounts() {
    const sampleAccounts = [
      // 資產科目
      {
        id: 'acc_001',
        accountCode: '1001',
        accountName: '現金',
        accountNameEn: 'Cash',
        parentId: null,
        type: AccountType.ASSET,
        category: AccountCategory.CURRENT_ASSETS,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '庫存現金',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 125000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_002',
        accountCode: '1101',
        accountName: '銀行存款-第一銀行',
        accountNameEn: 'Bank Deposit - First Bank',
        parentId: null,
        type: AccountType.ASSET,
        category: AccountCategory.CURRENT_ASSETS,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '第一銀行活期存款',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 850000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_003',
        accountCode: '1131',
        accountName: '應收帳款',
        accountNameEn: 'Accounts Receivable',
        parentId: null,
        type: AccountType.ASSET,
        category: AccountCategory.CURRENT_ASSETS,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '客戶應收款項',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 245000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_004',
        accountCode: '1141',
        accountName: '存貨-商品',
        accountNameEn: 'Inventory - Products',
        parentId: null,
        type: AccountType.ASSET,
        category: AccountCategory.CURRENT_ASSETS,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '商品庫存',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 320000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      // 負債科目
      {
        id: 'acc_005',
        accountCode: '2101',
        accountName: '應付帳款',
        accountNameEn: 'Accounts Payable',
        parentId: null,
        type: AccountType.LIABILITY,
        category: AccountCategory.CURRENT_LIABILITIES,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '供應商應付款項',
        balanceType: 'credit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 180000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_006',
        accountCode: '2141',
        accountName: '應付稅金',
        accountNameEn: 'Tax Payable',
        parentId: null,
        type: AccountType.LIABILITY,
        category: AccountCategory.CURRENT_LIABILITIES,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '應付營業稅等稅金',
        balanceType: 'credit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: true,
        balance: 42000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      // 權益科目
      {
        id: 'acc_007',
        accountCode: '3101',
        accountName: '資本',
        accountNameEn: 'Capital',
        parentId: null,
        type: AccountType.EQUITY,
        category: AccountCategory.OWNERS_EQUITY,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '股東資本',
        balanceType: 'credit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 1000000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_008',
        accountCode: '3201',
        accountName: '保留盈餘',
        accountNameEn: 'Retained Earnings',
        parentId: null,
        type: AccountType.EQUITY,
        category: AccountCategory.RETAINED_EARNINGS,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '累積保留盈餘',
        balanceType: 'credit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 158000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      // 收入科目
      {
        id: 'acc_009',
        accountCode: '4101',
        accountName: '商品銷售收入',
        accountNameEn: 'Product Sales Revenue',
        parentId: null,
        type: AccountType.REVENUE,
        category: AccountCategory.OPERATING_REVENUE,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '商品銷售收入',
        balanceType: 'credit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 680000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_010',
        accountCode: '4103',
        accountName: '運費收入',
        accountNameEn: 'Shipping Revenue',
        parentId: null,
        type: AccountType.REVENUE,
        category: AccountCategory.OPERATING_REVENUE,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '客戶支付的運費收入',
        balanceType: 'credit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 28000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      // 成本科目
      {
        id: 'acc_011',
        accountCode: '5101',
        accountName: '銷貨成本',
        accountNameEn: 'Cost of Goods Sold',
        parentId: null,
        type: AccountType.COST_OF_GOODS,
        category: AccountCategory.DIRECT_COSTS,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '商品銷售成本',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 340000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      // 費用科目
      {
        id: 'acc_012',
        accountCode: '6101',
        accountName: '薪資費用',
        accountNameEn: 'Payroll Expense',
        parentId: null,
        type: AccountType.EXPENSE,
        category: AccountCategory.OPERATING_EXPENSES,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '員工薪資費用',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: true,
        requireProject: false,
        isTaxAccount: false,
        balance: 120000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_013',
        accountCode: '6106',
        accountName: '廣告費',
        accountNameEn: 'Advertising Expense',
        parentId: null,
        type: AccountType.EXPENSE,
        category: AccountCategory.OPERATING_EXPENSES,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '廣告宣傳費用',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 45000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      },
      {
        id: 'acc_014',
        accountCode: '6111',
        accountName: '刷卡手續費',
        accountNameEn: 'Credit Card Processing Fee',
        parentId: null,
        type: AccountType.EXPENSE,
        category: AccountCategory.OPERATING_EXPENSES,
        level: 1,
        isActive: true,
        isSystem: true,
        description: '信用卡刷卡手續費',
        balanceType: 'debit',
        allowPosting: true,
        requireDepartment: false,
        requireProject: false,
        isTaxAccount: false,
        balance: 18000,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T14:30:00').toISOString()
      }
    ];

    this.accounts = sampleAccounts;
    this.saveToStorage();
  }

  // 生成樣本會計分錄
  generateSampleJournalEntries() {
    const sampleEntries = [
      {
        id: 'entry_001',
        entryNumber: 'JE2024090001',
        entryDate: new Date('2024-09-01T10:00:00').toISOString(),
        period: '2024-09',
        sourceType: EntrySourceType.ORDER,
        sourceId: 'order_001',
        referenceNumber: 'M2024090001',
        description: '銷售收入-訂單#M2024090001',
        totalDebit: 2980,
        totalCredit: 2980,
        status: EntryStatus.POSTED,
        postedAt: new Date('2024-09-01T10:30:00').toISOString(),
        postedBy: 1,
        isAdjustment: false,
        createdBy: 1,
        createdAt: new Date('2024-09-01T10:00:00').toISOString(),
        updatedAt: new Date('2024-09-01T10:30:00').toISOString(),
        lines: [
          {
            id: 'line_001',
            lineNumber: 1,
            accountId: 'acc_003',
            accountCode: '1131',
            accountName: '應收帳款',
            debitAmount: 2980,
            creditAmount: 0,
            description: '銷售商品-客戶應收款'
          },
          {
            id: 'line_002',
            lineNumber: 2,
            accountId: 'acc_009',
            accountCode: '4101',
            accountName: '商品銷售收入',
            debitAmount: 0,
            creditAmount: 2680,
            description: '銷售收入'
          },
          {
            id: 'line_003',
            lineNumber: 3,
            accountId: 'acc_010',
            accountCode: '4103',
            accountName: '運費收入',
            debitAmount: 0,
            creditAmount: 300,
            description: '運費收入'
          }
        ]
      },
      {
        id: 'entry_002',
        entryNumber: 'JE2024090002',
        entryDate: new Date('2024-09-01T11:00:00').toISOString(),
        period: '2024-09',
        sourceType: EntrySourceType.ORDER,
        sourceId: 'order_001',
        referenceNumber: 'M2024090001',
        description: '銷貨成本-訂單#M2024090001',
        totalDebit: 1340,
        totalCredit: 1340,
        status: EntryStatus.POSTED,
        postedAt: new Date('2024-09-01T11:30:00').toISOString(),
        postedBy: 1,
        isAdjustment: false,
        createdBy: 1,
        createdAt: new Date('2024-09-01T11:00:00').toISOString(),
        updatedAt: new Date('2024-09-01T11:30:00').toISOString(),
        lines: [
          {
            id: 'line_004',
            lineNumber: 1,
            accountId: 'acc_011',
            accountCode: '5101',
            accountName: '銷貨成本',
            debitAmount: 1340,
            creditAmount: 0,
            description: '商品銷售成本'
          },
          {
            id: 'line_005',
            lineNumber: 2,
            accountId: 'acc_004',
            accountCode: '1141',
            accountName: '存貨-商品',
            debitAmount: 0,
            creditAmount: 1340,
            description: '存貨減少'
          }
        ]
      },
      {
        id: 'entry_003',
        entryNumber: 'JE2024090003',
        entryDate: new Date('2024-09-02T09:00:00').toISOString(),
        period: '2024-09',
        sourceType: EntrySourceType.PAYMENT,
        sourceId: 'payment_001',
        referenceNumber: 'PAY2024090001',
        description: '收到客戶付款-信用卡',
        totalDebit: 2980,
        totalCredit: 2980,
        status: EntryStatus.POSTED,
        postedAt: new Date('2024-09-02T09:30:00').toISOString(),
        postedBy: 1,
        isAdjustment: false,
        createdBy: 1,
        createdAt: new Date('2024-09-02T09:00:00').toISOString(),
        updatedAt: new Date('2024-09-02T09:30:00').toISOString(),
        lines: [
          {
            id: 'line_006',
            lineNumber: 1,
            accountId: 'acc_002',
            accountCode: '1101',
            accountName: '銀行存款-第一銀行',
            debitAmount: 2896,
            creditAmount: 0,
            description: '收到客戶刷卡付款'
          },
          {
            id: 'line_007',
            lineNumber: 2,
            accountId: 'acc_014',
            accountCode: '6111',
            accountName: '刷卡手續費',
            debitAmount: 84,
            creditAmount: 0,
            description: '信用卡手續費 2.8%'
          },
          {
            id: 'line_008',
            lineNumber: 3,
            accountId: 'acc_003',
            accountCode: '1131',
            accountName: '應收帳款',
            debitAmount: 0,
            creditAmount: 2980,
            description: '應收帳款減少'
          }
        ]
      }
    ];

    this.journalEntries = sampleEntries;
    this.saveToStorage();
  }

  // 生成樣本報表
  generateSampleReports() {
    const sampleReports = [
      {
        id: 'report_001',
        reportType: ReportType.INCOME_STATEMENT,
        reportName: '損益表',
        periodType: 'monthly',
        periodStart: new Date('2024-09-01').toISOString(),
        periodEnd: new Date('2024-09-30').toISOString(),
        status: 'completed',
        generatedAt: new Date('2024-09-16T15:00:00').toISOString(),
        generatedBy: 1,
        fileFormat: 'html',
        createdAt: new Date('2024-09-16T15:00:00').toISOString()
      },
      {
        id: 'report_002',
        reportType: ReportType.BALANCE_SHEET,
        reportName: '資產負債表',
        periodType: 'monthly',
        periodStart: new Date('2024-09-01').toISOString(),
        periodEnd: new Date('2024-09-30').toISOString(),
        status: 'completed',
        generatedAt: new Date('2024-09-16T15:05:00').toISOString(),
        generatedBy: 1,
        fileFormat: 'pdf',
        createdAt: new Date('2024-09-16T15:05:00').toISOString()
      }
    ];

    this.reports = sampleReports;
    this.saveToStorage();
  }

  // 會計科目相關方法
  getAllAccounts() {
    return this.accounts;
  }

  getAccountById(id) {
    return this.accounts.find(account => account.id === id);
  }

  getAccountsByType(type) {
    return this.accounts.filter(account => account.type === type);
  }

  createAccount(accountData) {
    const newAccount = {
      id: `acc_${Date.now()}`,
      ...accountData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.accounts.push(newAccount);
    this.saveToStorage();
    return newAccount;
  }

  updateAccount(id, accountData) {
    const index = this.accounts.findIndex(account => account.id === id);
    if (index !== -1) {
      this.accounts[index] = {
        ...this.accounts[index],
        ...accountData,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      return this.accounts[index];
    }
    return null;
  }

  deleteAccount(id) {
    const index = this.accounts.findIndex(account => account.id === id);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // 會計分錄相關方法
  getAllJournalEntries() {
    return this.journalEntries;
  }

  getJournalEntryById(id) {
    return this.journalEntries.find(entry => entry.id === id);
  }

  createJournalEntry(entryData) {
    const newEntry = {
      id: `entry_${Date.now()}`,
      entryNumber: this.generateEntryNumber(),
      status: EntryStatus.DRAFT,
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.journalEntries.push(newEntry);
    this.saveToStorage();
    return newEntry;
  }

  updateJournalEntry(id, entryData) {
    const index = this.journalEntries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      this.journalEntries[index] = {
        ...this.journalEntries[index],
        ...entryData,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      return this.journalEntries[index];
    }
    return null;
  }

  // 生成分錄編號
  generateEntryNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = this.journalEntries.length + 1;
    return `JE${year}${month}${String(count).padStart(4, '0')}`;
  }

  // 財務報表相關方法
  getAllReports() {
    return this.reports;
  }

  generateTrialBalance(periodStart, periodEnd) {
    const accounts = this.accounts.map(account => ({
      accountCode: account.accountCode,
      accountName: account.accountName,
      debitBalance: account.balanceType === 'debit' ? account.balance : 0,
      creditBalance: account.balanceType === 'credit' ? account.balance : 0
    }));

    const totalDebit = accounts.reduce((sum, acc) => sum + acc.debitBalance, 0);
    const totalCredit = accounts.reduce((sum, acc) => sum + acc.creditBalance, 0);

    return {
      accounts,
      totalDebit,
      totalCredit,
      isBalanced: totalDebit === totalCredit
    };
  }

  generateIncomeStatement(periodStart, periodEnd) {
    const revenueAccounts = this.getAccountsByType(AccountType.REVENUE);
    const expenseAccounts = this.getAccountsByType(AccountType.EXPENSE);
    const costAccounts = this.getAccountsByType(AccountType.COST_OF_GOODS);

    const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalCost = costAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalExpense = expenseAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    const grossProfit = totalRevenue - totalCost;
    const netIncome = grossProfit - totalExpense;

    return {
      revenue: {
        accounts: revenueAccounts,
        total: totalRevenue
      },
      costOfGoods: {
        accounts: costAccounts,
        total: totalCost
      },
      expenses: {
        accounts: expenseAccounts,
        total: totalExpense
      },
      grossProfit,
      netIncome
    };
  }

  generateBalanceSheet(asOfDate) {
    const assetAccounts = this.getAccountsByType(AccountType.ASSET);
    const liabilityAccounts = this.getAccountsByType(AccountType.LIABILITY);
    const equityAccounts = this.getAccountsByType(AccountType.EQUITY);

    const totalAssets = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = liabilityAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalEquity = equityAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      assets: {
        accounts: assetAccounts,
        total: totalAssets
      },
      liabilities: {
        accounts: liabilityAccounts,
        total: totalLiabilities
      },
      equity: {
        accounts: equityAccounts,
        total: totalEquity
      },
      isBalanced: totalAssets === (totalLiabilities + totalEquity)
    };
  }

  // 獲取儀表板數據
  getDashboardData() {
    const incomeStatement = this.generateIncomeStatement();
    const balanceSheet = this.generateBalanceSheet();
    
    const totalAssets = balanceSheet.assets.total;
    const totalLiabilities = balanceSheet.liabilities.total;
    const totalEquity = balanceSheet.equity.total;
    const netIncome = incomeStatement.netIncome;

    // 財務比率計算
    const currentRatio = totalLiabilities > 0 ? (totalAssets / totalLiabilities) : 0;
    const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity) : 0;
    const profitMargin = incomeStatement.revenue.total > 0 ? (netIncome / incomeStatement.revenue.total) : 0;

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      netIncome,
      totalRevenue: incomeStatement.revenue.total,
      totalExpenses: incomeStatement.expenses.total,
      grossProfit: incomeStatement.grossProfit,
      currentRatio,
      debtToEquity,
      profitMargin,
      recentEntries: this.journalEntries.slice(-5).reverse(),
      pendingEntries: this.journalEntries.filter(entry => entry.status === EntryStatus.PENDING).length,
      monthlyTrends: this.generateMonthlyTrends()
    };
  }

  // 生成月度趨勢數據
  generateMonthlyTrends() {
    return [
      { month: '06', revenue: 520000, expenses: 380000, profit: 140000 },
      { month: '07', revenue: 580000, expenses: 420000, profit: 160000 },
      { month: '08', revenue: 650000, expenses: 470000, profit: 180000 },
      { month: '09', revenue: 708000, expenses: 523000, profit: 185000 }
    ];
  }

  // 獲取科目類型顯示名稱
  getAccountTypeDisplayName(type) {
    const names = {
      [AccountType.ASSET]: '資產',
      [AccountType.LIABILITY]: '負債',
      [AccountType.EQUITY]: '權益',
      [AccountType.REVENUE]: '收入',
      [AccountType.EXPENSE]: '費用',
      [AccountType.COST_OF_GOODS]: '銷貨成本'
    };
    return names[type] || type;
  }

  // 獲取科目類別顯示名稱
  getAccountCategoryDisplayName(category) {
    const names = {
      [AccountCategory.CURRENT_ASSETS]: '流動資產',
      [AccountCategory.NON_CURRENT_ASSETS]: '非流動資產',
      [AccountCategory.CURRENT_LIABILITIES]: '流動負債',
      [AccountCategory.NON_CURRENT_LIABILITIES]: '非流動負債',
      [AccountCategory.OWNERS_EQUITY]: '業主權益',
      [AccountCategory.RETAINED_EARNINGS]: '保留盈餘',
      [AccountCategory.OPERATING_REVENUE]: '營業收入',
      [AccountCategory.NON_OPERATING_REVENUE]: '營業外收入',
      [AccountCategory.OPERATING_EXPENSES]: '營業費用',
      [AccountCategory.NON_OPERATING_EXPENSES]: '營業外費用',
      [AccountCategory.DIRECT_COSTS]: '直接成本',
      [AccountCategory.INDIRECT_COSTS]: '間接成本'
    };
    return names[category] || category;
  }
}

const accountingDataManager = new AccountingDataManager();
export default accountingDataManager;