/**
 * 儀表板統計資料管理器
 * 統一管理儀表板相關統計資料，提供統一組件
 */

// 導入相關的資料管理器
import { adminDataManager } from "@shared/data/adminDataManager";
import orderDataManager from '../../../shared/data/orderDataManager';
import supplierDataManager from '../../../shared/data/supplierDataManager';
import logisticsDataManager from '../../../shared/data/logisticsDataManager';
import procurementDataManager from '../../../shared/data/procurementDataManager';
import couponDataManager from '../../../shared/data/couponDataManager';
import giftDataManager from "@shared/data/giftDataManager";
import accountingDataManager from "@shared/data/accountingDataManager";
import { documentDataManager } from "@shared/data/documentDataManager";

/**
 * 統計資料類別常數
 */
export const STATS_CATEGORIES = {
  SALES: 'sales',           // 銷售統計
  OPERATIONS: 'operations', // 營運統計
  FINANCIAL: 'financial',   // 財務統計
  INVENTORY: 'inventory',   // 庫存統計
  CUSTOMER: 'customer',     // 客戶統計
  LOGISTICS: 'logistics',   // 物流統計
  SYSTEM: 'system'          // 系統統計
};

/**
 * 統計圖示對照表
 */
export const STATS_ICONS = {
  // 銷售給計
  total_orders: 'ShoppingBagIcon',
  today_orders: 'CalendarDaysIcon',
  total_revenue: 'CurrencyDollarIcon',
  pending_orders: 'ClockIcon',
  
  // 庫存統計
  total_products: 'CubeIcon',
  low_stock: 'ExclamationTriangleIcon',
  out_of_stock: 'XCircleIcon',
  
  // 客戶統計
  total_customers: 'UsersIcon',
  active_customers: 'UserGroupIcon',
  new_customers: 'UserPlusIcon',
  
  // 物流統計
  total_shipments: 'TruckIcon',
  pending_shipments: 'ClockIcon',
  delivered_shipments: 'CheckCircleIcon',
  
  // 財務統計
  total_assets: 'BanknotesIcon',
  monthly_profit: 'ArrowTrendingUpIcon',
  pending_payments: 'CreditCardIcon',
  
  // 系統統計
  total_users: 'UsersIcon',
  active_sessions: 'ComputerDesktopIcon',
  system_alerts: 'BellIcon'
};

/**
 * 統計顏色主題對照
 */
export const STATS_COLORS = {
  primary: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-purple-600',
  neutral: 'text-gray-600'
};

/**
 * 主統計數據管理器類別
 */
class DashboardStatsManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分鐘快取
  }

  /**
   * 取得快取的統計數據
   */
  getCachedStats(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * 設定快取的統計數據
   */
  setCachedStats(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 清除指定快取或全部快取
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 取得銷售統計
   */
  getSalesStats() {
    const cacheKey = 'sales_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      // 訂單統計
      const orderStats = orderDataManager.getOrderStatistics();
      const todayDate = new Date().toISOString().split('T')[0];
      
      const salesStats = {
        category: STATS_CATEGORIES.SALES,
        title: '銷售統計',
        cards: [
          {
            id: 'total_orders',
            title: '總訂單數',
            value: orderStats.totalOrders || 0,
            subtitle: '累計總數',
            icon: STATS_ICONS.total_orders,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(orderStats.monthlyGrowth || 0)
          },
          {
            id: 'today_orders',
            title: '今日訂單',
            value: orderStats.todayOrders || 0,
            subtitle: '今日新增',
            icon: STATS_ICONS.today_orders,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(5.2)
          },
          {
            id: 'total_revenue',
            title: '總收入',
            value: `$${(orderStats.totalRevenue || 190500).toLocaleString()}`,
            subtitle: '累計收入',
            icon: STATS_ICONS.total_revenue,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(12.8)
          },
          {
            id: 'pending_orders',
            title: '待處理',
            value: orderStats.pendingOrders || 17,
            subtitle: '需要處理',
            icon: STATS_ICONS.pending_orders,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-2.1)
          }
        ]
      };

      this.setCachedStats(cacheKey, salesStats);
      return salesStats;
    } catch (error) {
      console.error('取得銷售統計失敗:', error);
      return this.getDefaultSalesStats();
    }
  }

  /**
   * 取得營運統計
   */
  getOperationsStats() {
    const cacheKey = 'operations_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const operationsStats = {
        category: STATS_CATEGORIES.OPERATIONS,
        title: '營運統計',
        cards: [
          {
            id: 'total_products',
            title: '總商品數',
            value: 156,
            subtitle: '已上架商品',
            icon: STATS_ICONS.total_products,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(8.5)
          },
          {
            id: 'low_stock',
            title: '庫存不足',
            value: 12,
            subtitle: '需要補貨',
            icon: STATS_ICONS.low_stock,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(3.2)
          },
          {
            id: 'active_customers',
            title: '活躍客戶',
            value: 33,
            subtitle: '本月活躍',
            icon: STATS_ICONS.active_customers,
            color: STATS_COLORS.info,
            trend: this.calculateTrend(15.6)
          },
          {
            id: 'total_suppliers',
            title: '合作供應商',
            value: supplierDataManager.getAllSuppliers().length,
            subtitle: '活躍供應商',
            icon: 'BuildingOfficeIcon',
            color: STATS_COLORS.neutral,
            trend: this.calculateTrend(2.3)
          }
        ]
      };

      this.setCachedStats(cacheKey, operationsStats);
      return operationsStats;
    } catch (error) {
      console.error('取得營運統計失敗:', error);
      return this.getDefaultOperationsStats();
    }
  }

  /**
   * 取得財務統計
   */
  getFinancialStats() {
    const cacheKey = 'financial_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const accountingData = accountingDataManager.getDashboardData();
      
      const financialStats = {
        category: STATS_CATEGORIES.FINANCIAL,
        title: '財務統計',
        cards: [
          {
            id: 'total_assets',
            title: '總資產',
            value: `$${(accountingData.totalAssets || 850000).toLocaleString()}`,
            subtitle: '資產總值',
            icon: STATS_ICONS.total_assets,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(6.8)
          },
          {
            id: 'monthly_profit',
            title: '月淨利潤',
            value: `$${(accountingData.monthlyProfit || 45230).toLocaleString()}`,
            subtitle: '淨利潤',
            icon: STATS_ICONS.monthly_profit,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(18.5)
          },
          {
            id: 'pending_payments',
            title: '待收款項',
            value: `$${(accountingData.pendingReceivables || 23450).toLocaleString()}`,
            subtitle: '應收帳款',
            icon: STATS_ICONS.pending_payments,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-5.2)
          },
          {
            id: 'monthly_expenses',
            title: '月支出',
            value: `$${(accountingData.monthlyExpenses || 32180).toLocaleString()}`,
            subtitle: '本月支出',
            icon: 'ArrowTrendingDownIcon',
            color: STATS_COLORS.danger,
            trend: this.calculateTrend(8.9)
          }
        ]
      };

      this.setCachedStats(cacheKey, financialStats);
      return financialStats;
    } catch (error) {
      console.error('取得財務統計失敗:', error);
      return this.getDefaultFinancialStats();
    }
  }

  /**
   * 取得物流統計
   */
  getLogisticsStats() {
    const cacheKey = 'logistics_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const logisticsData = logisticsDataManager.getShipmentStatusStats();
      
      const logisticsStats = {
        category: STATS_CATEGORIES.LOGISTICS,
        title: '物流統計',
        cards: [
          {
            id: 'total_shipments',
            title: '總發貨數',
            value: logisticsData.totalShipments || 284,
            subtitle: '累計發貨',
            icon: STATS_ICONS.total_shipments,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(12.3)
          },
          {
            id: 'pending_shipments',
            title: '運送中',
            value: logisticsData.inTransit || 8,
            subtitle: '正在運送',
            icon: STATS_ICONS.pending_shipments,
            color: STATS_COLORS.info,
            trend: this.calculateTrend(-3.5)
          },
          {
            id: 'delivered_shipments',
            title: '已送達',
            value: logisticsData.delivered || 269,
            subtitle: '完成配送',
            icon: STATS_ICONS.delivered_shipments,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(15.2)
          },
          {
            id: 'delivery_rate',
            title: '準時率',
            value: `${(logisticsData.onTimeRate || 94.5).toFixed(1)}%`,
            subtitle: '配送績效',
            icon: 'ChartBarIcon',
            color: STATS_COLORS.success,
            trend: this.calculateTrend(2.8)
          }
        ]
      };

      this.setCachedStats(cacheKey, logisticsStats);
      return logisticsStats;
    } catch (error) {
      console.error('取得物流統計失敗:', error);
      return this.getDefaultLogisticsStats();
    }
  }

  /**
   * 取得系統統計
   */
  getSystemStats() {
    const cacheKey = 'system_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const adminStats = adminDataManager.getStatistics();
      
      const systemStats = {
        category: STATS_CATEGORIES.SYSTEM,
        title: '系統統計',
        cards: [
          {
            id: 'total_users',
            title: '總用戶數',
            value: adminStats.totalUsers || 45,
            subtitle: '註冊用戶',
            icon: STATS_ICONS.total_users,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(6.2)
          },
          {
            id: 'active_sessions',
            title: '活躍會話',
            value: adminStats.activeSessions || 12,
            subtitle: '在線用戶',
            icon: STATS_ICONS.active_sessions,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(18.9)
          },
          {
            id: 'system_alerts',
            title: '系統警報',
            value: 3,
            subtitle: '需要注意',
            icon: STATS_ICONS.system_alerts,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-12.5)
          },
          {
            id: 'server_uptime',
            title: '系統運行時間',
            value: '99.8%',
            subtitle: '穩定性',
            icon: 'ServerIcon',
            color: STATS_COLORS.success,
            trend: this.calculateTrend(0.2)
          }
        ]
      };

      this.setCachedStats(cacheKey, systemStats);
      return systemStats;
    } catch (error) {
      console.error('取得系統統計失敗:', error);
      return this.getDefaultSystemStats();
    }
  }

  /**
   * 取得所有統計數據
   */
  getAllStats() {
    return [
      this.getSalesStats(),
      this.getOperationsStats(),
      this.getFinancialStats(),
      this.getLogisticsStats(),
      this.getSystemStats()
    ];
  }

  /**
   * 依類別取得統計數據
   */
  getStatsByCategory(category) {
    switch (category) {
      case STATS_CATEGORIES.SALES:
        return this.getSalesStats();
      case STATS_CATEGORIES.OPERATIONS:
        return this.getOperationsStats();
      case STATS_CATEGORIES.FINANCIAL:
        return this.getFinancialStats();
      case STATS_CATEGORIES.LOGISTICS:
        return this.getLogisticsStats();
      case STATS_CATEGORIES.SYSTEM:
        return this.getSystemStats();
      default:
        return null;
    }
  }

  /**
   * 計算趨勢資料
   */
  calculateTrend(percentageChange) {
    return {
      direction: percentageChange >= 0 ? 'up' : 'down',
      percentage: Math.abs(percentageChange),
      color: percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
    };
  }

  /**
   * 取得預設銷售統計
   */
  getDefaultSalesStats() {
    return {
      category: STATS_CATEGORIES.SALES,
      title: '銷售統計',
      cards: [
        {
          id: 'total_orders',
          title: '總訂單',
          value: 50,
          subtitle: '累計總數',
          icon: STATS_ICONS.total_orders,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'today_orders',
          title: '今日訂單',
          value: 0,
          subtitle: '今日新增',
          icon: STATS_ICONS.today_orders,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'total_revenue',
          title: '總收入',
          value: '$190,500',
          subtitle: '累計收入',
          icon: STATS_ICONS.total_revenue,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_orders',
          title: '待處理',
          value: 17,
          subtitle: '需要處理',
          icon: STATS_ICONS.pending_orders,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 取得預設營運統計
   */
  getDefaultOperationsStats() {
    return {
      category: STATS_CATEGORIES.OPERATIONS,
      title: '分析統�?',
      cards: [
        {
          id: 'total_products',
          title: '總商品數',
          value: 156,
          subtitle: '已上架商品',
          icon: STATS_ICONS.total_products,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'low_stock',
          title: '庫存不足',
          value: 12,
          subtitle: '需要補貨',
          icon: STATS_ICONS.low_stock,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'active_customers',
          title: '活躍客戶',
          value: 33,
          subtitle: '本月活躍',
          icon: STATS_ICONS.active_customers,
          color: STATS_COLORS.info,
          trend: this.calculateTrend(0)
        },
        {
          id: 'total_suppliers',
          title: '合作供應商',
          value: 25,
          subtitle: '活躍供應商',
          icon: 'BuildingOfficeIcon',
          color: STATS_COLORS.neutral,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 取得預設財務統計
   */
  getDefaultFinancialStats() {
    return {
      category: STATS_CATEGORIES.FINANCIAL,
      title: '財務統計',
      cards: [
        {
          id: 'total_assets',
          title: '總資產',
          value: '$850,000',
          subtitle: '資產總值',
          icon: STATS_ICONS.total_assets,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'monthly_profit',
          title: '月淨利潤',
          value: '$45,230',
          subtitle: '淨利潤',
          icon: STATS_ICONS.monthly_profit,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_payments',
          title: '待收款項',
          value: '$23,450',
          subtitle: '應收帳款',
          icon: STATS_ICONS.pending_payments,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'monthly_expenses',
          title: '月支出',
          value: '$32,180',
          subtitle: '本月支出',
          icon: 'ArrowTrendingDownIcon',
          color: STATS_COLORS.danger,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 取得預設物流統計
   */
  getDefaultLogisticsStats() {
    return {
      category: STATS_CATEGORIES.LOGISTICS,
      title: '分析統�?',
      cards: [
        {
          id: 'total_shipments',
          title: '總發貨數',
          value: 284,
          subtitle: '累計發貨',
          icon: STATS_ICONS.total_shipments,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_shipments',
          title: '運送中',
          value: 8,
          subtitle: '正在運送',
          icon: STATS_ICONS.pending_shipments,
          color: STATS_COLORS.info,
          trend: this.calculateTrend(0)
        },
        {
          id: 'delivered_shipments',
          title: '已送達',
          value: 269,
          subtitle: '完成配送',
          icon: STATS_ICONS.delivered_shipments,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'delivery_rate',
          title: '準時率',
          value: '94.5%',
          subtitle: '配送績效',
          icon: 'ChartBarIcon',
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 取得預設系統統計
   */
  getDefaultSystemStats() {
    return {
      category: STATS_CATEGORIES.SYSTEM,
      title: '系統統計',
      cards: [
        {
          id: 'total_users',
          title: '總用戶數',
          value: 45,
          subtitle: '註冊用戶',
          icon: STATS_ICONS.total_users,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'active_sessions',
          title: '活躍會話',
          value: 12,
          subtitle: '在線用戶',
          icon: STATS_ICONS.active_sessions,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'system_alerts',
          title: '系統警報',
          value: 3,
          subtitle: '需要注意',
          icon: STATS_ICONS.system_alerts,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'server_uptime',
          title: '系統運行時間',
          value: '99.8%',
          subtitle: '穩定性',
          icon: 'ServerIcon',
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 更新所有統計數據
   */
  refreshAllStats() {
    this.clearCache();
    return this.getAllStats();
  }

  /**
   * 更新指定類別統計數據
   */
  refreshStatsByCategory(category) {
    this.clearCache(`${category}_stats`);
    return this.getStatsByCategory(category);
  }
}

// 建立管理實例
const dashboardStatsManager = new DashboardStatsManager();

export default dashboardStatsManager;

export {
  DashboardStatsManager
};
