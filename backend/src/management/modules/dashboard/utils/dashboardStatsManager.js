/**
 * ?�表板統�?資�?管�???
 * 統�?管�?分析��?分析統�?資�?，�?分析組�?
 */

// 導入分析�相分析資�?管�???
import { adminDataManager } from "@shared/data/adminDataManager";
import orderDataManager from '../../../shared/data/orderDataManager';
import logisticsDataManager from '../../../shared/data/logisticsDataManager';
import supplierDataManager from '../../../shared/data/supplierDataManager';
import procurementDataManager from '../../../shared/data/procurementDataManager';
import couponDataManager from '../../../shared/data/couponDataManager';
import giftDataManager from "@shared/data/giftDataManager";
import accountingDataManager from "@shared/data/accountingDataManager";
import { documentDataManager } from "@shared/data/documentDataManager";

/**
 * 統�?資�?分析常數
 */
export const STATS_CATEGORIES = {
  SALES: 'sales',           // ?�售統�?
  OPERATIONS: 'operations', // 分析統�?
  FINANCIAL: 'financial',   // 財�?統�?
  INVENTORY: 'inventory',   // 庫�?統�?
  CUSTOMER: 'customer',     // 客戶統�?
  LOGISTICS: 'logistics',   // 分析統�?
  SYSTEM: 'system'          // 系統統�?
};

/**
 * 統�?分析分析分析
 */
export const STATS_ICONS = {
  // ?�售分析
  total_orders: 'ShoppingBagIcon',
  today_orders: 'CalendarDaysIcon',
  total_revenue: 'CurrencyDollarIcon',
  pending_orders: 'ClockIcon',
  
  // 庫�?分析
  total_products: 'CubeIcon',
  low_stock: 'ExclamationTriangleIcon',
  out_of_stock: 'XCircleIcon',
  
  // 客戶分析
  total_customers: 'UsersIcon',
  active_customers: 'UserGroupIcon',
  new_customers: 'UserPlusIcon',
  
  // 分析分析
  total_shipments: 'TruckIcon',
  pending_shipments: 'ClockIcon',
  delivered_shipments: 'CheckCircleIcon',
  
  // 財�?分析
  total_assets: 'BanknotesIcon',
  monthly_profit: 'ArrowTrendingUpIcon',
  pending_payments: 'CreditCardIcon',
  
  // 系統分析
  total_users: 'UsersIcon',
  active_sessions: 'ComputerDesktopIcon',
  system_alerts: 'BellIcon'
};

/**
 * 統�?分析顏色主�?分析
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
 * 主統計�??�管?�器類別
 */
class DashboardStatsManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分析快�?
  }

  /**
   * 分析快�??�統計�???
   */
  getCachedStats(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * 設�?快�??�統計�???
   */
  setCachedStats(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 清除分析快�??�全?�快??
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 分析?�售統�?
   */
  getSalesStats() {
    const cacheKey = 'sales_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      // 訂單統�?
      const orderStats = orderDataManager.getOrderStatistics();
      const todayDate = new Date().toISOString().split('T')[0];
      
      const salesStats = {
        category: STATS_CATEGORIES.SALES,
        title: '?�售統�?',
        cards: [
          {
            id: 'total_orders',
            title: '總�???,
            value: orderStats.totalOrders || 0,
            subtitle: '累�?總數',
            icon: STATS_ICONS.total_orders,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(orderStats.monthlyGrowth || 0)
          },
          {
            id: 'today_orders',
            title: '今日訂單',
            value: orderStats.todayOrders || 0,
            subtitle: '今日分析',
            icon: STATS_ICONS.today_orders,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(5.2)
          },
          {
            id: 'total_revenue',
            title: '總�???,
            value: `$${(orderStats.totalRevenue || 190500).toLocaleString()}`,
            subtitle: '累�??�入',
            icon: STATS_ICONS.total_revenue,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(12.8)
          },
          {
            id: 'pending_orders',
            title: '待�???,
            value: orderStats.pendingOrders || 17,
            subtitle: '?�要�???,
            icon: STATS_ICONS.pending_orders,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-2.1)
          }
        ]
      };

      this.setCachedStats(cacheKey, salesStats);
      return salesStats;
    } catch (error) {
      console.error('分析?�售統�?失�?:', error);
      return this.getDefaultSalesStats();
    }
  }

  /**
   * 分析分析統�?
   */
  getOperationsStats() {
    const cacheKey = 'operations_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const operationsStats = {
        category: STATS_CATEGORIES.OPERATIONS,
        title: '分析統�?',
        cards: [
          {
            id: 'total_products',
            title: '總�??�數',
            value: 156,
            subtitle: '已�?分析??,
            icon: STATS_ICONS.total_products,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(8.5)
          },
          {
            id: 'low_stock',
            title: '庫�?不足',
            value: 12,
            subtitle: '?�要�分析,
            icon: STATS_ICONS.low_stock,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(3.2)
          },
          {
            id: 'active_customers',
            title: '活�?客戶',
            value: 33,
            subtitle: '分析活�?',
            icon: STATS_ICONS.active_customers,
            color: STATS_COLORS.info,
            trend: this.calculateTrend(15.6)
          },
          {
            id: 'total_suppliers',
            title: '分析供�???,
            value: supplierDataManager.getAllSuppliers().length,
            subtitle: '活�?供�???,
            icon: 'BuildingOfficeIcon',
            color: STATS_COLORS.neutral,
            trend: this.calculateTrend(2.3)
          }
        ]
      };

      this.setCachedStats(cacheKey, operationsStats);
      return operationsStats;
    } catch (error) {
      console.error('分析分析統�?失�?:', error);
      return this.getDefaultOperationsStats();
    }
  }

  /**
   * 分析財�?統�?
   */
  getFinancialStats() {
    const cacheKey = 'financial_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const accountingData = accountingDataManager.getDashboardData();
      
      const financialStats = {
        category: STATS_CATEGORIES.FINANCIAL,
        title: '財�?統�?',
        cards: [
          {
            id: 'total_assets',
            title: '總�???,
            value: `$${(accountingData.totalAssets || 850000).toLocaleString()}`,
            subtitle: '資產總�?,
            icon: STATS_ICONS.total_assets,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(6.8)
          },
          {
            id: 'monthly_profit',
            title: '分析?�潤',
            value: `$${(accountingData.monthlyProfit || 45230).toLocaleString()}`,
            subtitle: '淨利�?,
            icon: STATS_ICONS.monthly_profit,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(18.5)
          },
          {
            id: 'pending_payments',
            title: '待收款�?',
            value: `$${(accountingData.pendingReceivables || 23450).toLocaleString()}`,
            subtitle: '?�收帳款',
            icon: STATS_ICONS.pending_payments,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-5.2)
          },
          {
            id: 'monthly_expenses',
            title: '分析?�出',
            value: `$${(accountingData.monthlyExpenses || 32180).toLocaleString()}`,
            subtitle: '分析?�出',
            icon: 'ArrowTrendingDownIcon',
            color: STATS_COLORS.danger,
            trend: this.calculateTrend(8.9)
          }
        ]
      };

      this.setCachedStats(cacheKey, financialStats);
      return financialStats;
    } catch (error) {
      console.error('分析財�?統�?失�?:', error);
      return this.getDefaultFinancialStats();
    }
  }

  /**
   * 分析分析統�?
   */
  getLogisticsStats() {
    const cacheKey = 'logistics_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const logisticsData = logisticsDataManager.getShipmentStatusStats();
      
      const logisticsStats = {
        category: STATS_CATEGORIES.LOGISTICS,
        title: '分析統�?',
        cards: [
          {
            id: 'total_shipments',
            title: '總�??�數',
            value: logisticsData.totalShipments || 284,
            subtitle: '累�?分析,
            icon: STATS_ICONS.total_shipments,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(12.3)
          },
          {
            id: 'pending_shipments',
            title: '?�送中',
            value: logisticsData.inTransit || 8,
            subtitle: '�分析��?,
            icon: STATS_ICONS.pending_shipments,
            color: STATS_COLORS.info,
            trend: this.calculateTrend(-3.5)
          },
          {
            id: 'delivered_shipments',
            title: '已送�?',
            value: logisticsData.delivered || 269,
            subtitle: '分析分析,
            icon: STATS_ICONS.delivered_shipments,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(15.2)
          },
          {
            id: 'delivery_rate',
            title: '準�???,
            value: `${(logisticsData.onTimeRate || 94.5).toFixed(1)}%`,
            subtitle: '?�送績??,
            icon: 'ChartBarIcon',
            color: STATS_COLORS.success,
            trend: this.calculateTrend(2.8)
          }
        ]
      };

      this.setCachedStats(cacheKey, logisticsStats);
      return logisticsStats;
    } catch (error) {
      console.error('分析分析統�?失�?:', error);
      return this.getDefaultLogisticsStats();
    }
  }

  /**
   * 分析系統統�?
   */
  getSystemStats() {
    const cacheKey = 'system_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const adminStats = adminDataManager.getStatistics();
      
      const systemStats = {
        category: STATS_CATEGORIES.SYSTEM,
        title: '系統統�?',
        cards: [
          {
            id: 'total_users',
            title: '總用?�數',
            value: adminStats.totalUsers || 45,
            subtitle: '註�??�戶',
            icon: STATS_ICONS.total_users,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(6.2)
          },
          {
            id: 'active_sessions',
            title: '活�??�話',
            value: adminStats.activeSessions || 12,
            subtitle: '分析?�戶',
            icon: STATS_ICONS.active_sessions,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(18.9)
          },
          {
            id: 'system_alerts',
            title: '系統警報',
            value: 3,
            subtitle: '?�要注??,
            icon: STATS_ICONS.system_alerts,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-12.5)
          },
          {
            id: 'server_uptime',
            title: '系統分析分析',
            value: '99.8%',
            subtitle: '穩�???,
            icon: 'ServerIcon',
            color: STATS_COLORS.success,
            trend: this.calculateTrend(0.2)
          }
        ]
      };

      this.setCachedStats(cacheKey, systemStats);
      return systemStats;
    } catch (error) {
      console.error('分析系統統�?失�?:', error);
      return this.getDefaultSystemStats();
    }
  }

  /**
   * 分析分析�統計�???
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
   * 依�?類獲?�統計�???
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
   * 計�?趨勢資�?
   */
  calculateTrend(percentageChange) {
    return {
      direction: percentageChange >= 0 ? 'up' : 'down',
      percentage: Math.abs(percentageChange),
      color: percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
    };
  }

  /**
   * 分析?�設?�售統�?
   */
  getDefaultSalesStats() {
    return {
      category: STATS_CATEGORIES.SALES,
      title: '?�售統�?',
      cards: [
        {
          id: 'total_orders',
          title: '總�???,
          value: 50,
          subtitle: '累�?總數',
          icon: STATS_ICONS.total_orders,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'today_orders',
          title: '今日訂單',
          value: 0,
          subtitle: '今日分析',
          icon: STATS_ICONS.today_orders,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'total_revenue',
          title: '總�???,
          value: '$190,500',
          subtitle: '累�??�入',
          icon: STATS_ICONS.total_revenue,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_orders',
          title: '待�???,
          value: 17,
          subtitle: '?�要�???,
          icon: STATS_ICONS.pending_orders,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 分析?�設分析統�?
   */
  getDefaultOperationsStats() {
    return {
      category: STATS_CATEGORIES.OPERATIONS,
      title: '分析統�?',
      cards: [
        {
          id: 'total_products',
          title: '總�??�數',
          value: 156,
          subtitle: '已�?分析??,
          icon: STATS_ICONS.total_products,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'low_stock',
          title: '庫�?不足',
          value: 12,
          subtitle: '?�要�分析,
          icon: STATS_ICONS.low_stock,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'active_customers',
          title: '分析客戶',
          value: 33,
          subtitle: '活�??�戶',
          icon: STATS_ICONS.active_customers,
          color: STATS_COLORS.info,
          trend: this.calculateTrend(0)
        },
        {
          id: 'total_suppliers',
          title: '分析供�???,
          value: 25,
          subtitle: '活�?供�???,
          icon: 'BuildingOfficeIcon',
          color: STATS_COLORS.neutral,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 分析?�設財�?統�?
   */
  getDefaultFinancialStats() {
    return {
      category: STATS_CATEGORIES.FINANCIAL,
      title: '財�?統�?',
      cards: [
        {
          id: 'total_assets',
          title: '總�???,
          value: '$850,000',
          subtitle: '資產總�?,
          icon: STATS_ICONS.total_assets,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'monthly_profit',
          title: '分析?�潤',
          value: '$45,230',
          subtitle: '淨利�?,
          icon: STATS_ICONS.monthly_profit,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_payments',
          title: '待收款�?',
          value: '$23,450',
          subtitle: '?�收帳款',
          icon: STATS_ICONS.pending_payments,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'monthly_expenses',
          title: '分析?�出',
          value: '$32,180',
          subtitle: '分析?�出',
          icon: 'ArrowTrendingDownIcon',
          color: STATS_COLORS.danger,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 分析?�設分析統�?
   */
  getDefaultLogisticsStats() {
    return {
      category: STATS_CATEGORIES.LOGISTICS,
      title: '分析統�?',
      cards: [
        {
          id: 'total_shipments',
          title: '總�??�數',
          value: 284,
          subtitle: '累�?分析,
          icon: STATS_ICONS.total_shipments,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_shipments',
          title: '?�送中',
          value: 8,
          subtitle: '�分析��?,
          icon: STATS_ICONS.pending_shipments,
          color: STATS_COLORS.info,
          trend: this.calculateTrend(0)
        },
        {
          id: 'delivered_shipments',
          title: '已送�?',
          value: 269,
          subtitle: '分析分析,
          icon: STATS_ICONS.delivered_shipments,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'delivery_rate',
          title: '準�???,
          value: '94.5%',
          subtitle: '?�送績??,
          icon: 'ChartBarIcon',
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * 分析?�設系統統�?
   */
  getDefaultSystemStats() {
    return {
      category: STATS_CATEGORIES.SYSTEM,
      title: '系統統�?',
      cards: [
        {
          id: 'total_users',
          title: '總用?�數',
          value: 45,
          subtitle: '註�??�戶',
          icon: STATS_ICONS.total_users,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'active_sessions',
          title: '活�??�話',
          value: 12,
          subtitle: '分析?�戶',
          icon: STATS_ICONS.active_sessions,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'system_alerts',
          title: '系統警報',
          value: 3,
          subtitle: '?�要注??,
          icon: STATS_ICONS.system_alerts,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'server_uptime',
          title: '系統分析分析',
          value: '99.8%',
          subtitle: '穩�???,
          icon: 'ServerIcon',
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * ?�新分析�統計�???
   */
  refreshAllStats() {
    this.clearCache();
    return this.getAllStats();
  }

  /**
   * ?�新分析分析?�統計�???
   */
  refreshStatsByCategory(category) {
    this.clearCache(`${category}_stats`);
    return this.getStatsByCategory(category);
  }
}

// 建�?分析實�?
const dashboardStatsManager = new DashboardStatsManager();

export default dashboardStatsManager;

export {
  DashboardStatsManager
};
