/**
 * ?ÄË°®ÊùøÁµ±Ë?Ë≥áÊ?ÁÆ°Á???
 * Áµ±‰?ÁÆ°Á??Ä?âÈ??¢Á?Áµ±Ë?Ë≥áË?ÔºåÊ??ÜÈ?ÁµÑÁ?
 */

// Â∞éÂÖ•?Ä?âÁõ∏?úÁ?Ë≥áÊ?ÁÆ°Á???
import { adminDataManager } from "@shared/data/adminDataManager";
import orderDataManager from '../data/orderDataManager';
import logisticsDataManager from '../data/logisticsDataManager';
import supplierDataManager from '../data/supplierDataManager';
import procurementDataManager from '../data/procurementDataManager';
import couponDataManager from '../data/couponDataManager';
import giftDataManager from "@shared/data/giftDataManager";
import accountingDataManager from "@shared/data/accountingDataManager";
import { documentDataManager } from "@shared/data/documentDataManager";

/**
 * Áµ±Ë?Ë≥áË??ÜÈ?Â∏∏Êï∏
 */
export const STATS_CATEGORIES = {
  SALES: 'sales',           // ?∑ÂîÆÁµ±Ë?
  OPERATIONS: 'operations', // ?üÈ?Áµ±Ë?
  FINANCIAL: 'financial',   // Ë≤°Â?Áµ±Ë?
  INVENTORY: 'inventory',   // Â∫´Â?Áµ±Ë?
  CUSTOMER: 'customer',     // ÂÆ¢Êà∂Áµ±Ë?
  LOGISTICS: 'logistics',   // ?©Ê?Áµ±Ë?
  SYSTEM: 'system'          // Á≥ªÁµ±Áµ±Ë?
};

/**
 * Áµ±Ë??°Á??ñÊ??†Â?
 */
export const STATS_ICONS = {
  // ?∑ÂîÆ?∏È?
  total_orders: 'ShoppingBagIcon',
  today_orders: 'CalendarDaysIcon',
  total_revenue: 'CurrencyDollarIcon',
  pending_orders: 'ClockIcon',
  
  // Â∫´Â??∏È?
  total_products: 'CubeIcon',
  low_stock: 'ExclamationTriangleIcon',
  out_of_stock: 'XCircleIcon',
  
  // ÂÆ¢Êà∂?∏È?
  total_customers: 'UsersIcon',
  active_customers: 'UserGroupIcon',
  new_customers: 'UserPlusIcon',
  
  // ?©Ê??∏È?
  total_shipments: 'TruckIcon',
  pending_shipments: 'ClockIcon',
  delivered_shipments: 'CheckCircleIcon',
  
  // Ë≤°Â??∏È?
  total_assets: 'BanknotesIcon',
  monthly_profit: 'ArrowTrendingUpIcon',
  pending_payments: 'CreditCardIcon',
  
  // Á≥ªÁµ±?∏È?
  total_users: 'UsersIcon',
  active_sessions: 'ComputerDesktopIcon',
  system_alerts: 'BellIcon'
};

/**
 * Áµ±Ë??°Á?È°èËâ≤‰∏ªÈ??†Â?
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
 * ‰∏ªÁµ±Ë®àË??ôÁÆ°?ÜÂô®È°ûÂà•
 */
class DashboardStatsManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5?ÜÈ?Âø´Â?
  }

  /**
   * ?≤Â?Âø´Â??ÑÁµ±Ë®àË???
   */
  getCachedStats(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Ë®≠Â?Âø´Â??ÑÁµ±Ë®àË???
   */
  setCachedStats(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Ê∏ÖÈô§?áÂ?Âø´Â??ñÂÖ®?®Âø´??
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * ?≤Â??∑ÂîÆÁµ±Ë?
   */
  getSalesStats() {
    const cacheKey = 'sales_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      // Ë®ÇÂñÆÁµ±Ë?
      const orderStats = orderDataManager.getOrderStatistics();
      const todayDate = new Date().toISOString().split('T')[0];
      
      const salesStats = {
        category: STATS_CATEGORIES.SALES,
        title: '?∑ÂîÆÁµ±Ë?',
        cards: [
          {
            id: 'total_orders',
            title: 'Á∏ΩË???,
            value: orderStats.totalOrders || 0,
            subtitle: 'Á¥ØË?Á∏ΩÊï∏',
            icon: STATS_ICONS.total_orders,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(orderStats.monthlyGrowth || 0)
          },
          {
            id: 'today_orders',
            title: '‰ªäÊó•Ë®ÇÂñÆ',
            value: orderStats.todayOrders || 0,
            subtitle: '‰ªäÊó•?∞Â?',
            icon: STATS_ICONS.today_orders,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(5.2)
          },
          {
            id: 'total_revenue',
            title: 'Á∏ΩÁ???,
            value: `$${(orderStats.totalRevenue || 190500).toLocaleString()}`,
            subtitle: 'Á¥ØË??∂ÂÖ•',
            icon: STATS_ICONS.total_revenue,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(12.8)
          },
          {
            id: 'pending_orders',
            title: 'ÂæÖË???,
            value: orderStats.pendingOrders || 17,
            subtitle: '?ÄË¶ÅË???,
            icon: STATS_ICONS.pending_orders,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-2.1)
          }
        ]
      };

      this.setCachedStats(cacheKey, salesStats);
      return salesStats;
    } catch (error) {
      console.error('?≤Â??∑ÂîÆÁµ±Ë?Â§±Ê?:', error);
      return this.getDefaultSalesStats();
    }
  }

  /**
   * ?≤Â??üÈ?Áµ±Ë?
   */
  getOperationsStats() {
    const cacheKey = 'operations_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const operationsStats = {
        category: STATS_CATEGORIES.OPERATIONS,
        title: '?üÈ?Áµ±Ë?',
        cards: [
          {
            id: 'total_products',
            title: 'Á∏ΩÂ??ÅÊï∏',
            value: 156,
            subtitle: 'Â∑≤‰??∂Â???,
            icon: STATS_ICONS.total_products,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(8.5)
          },
          {
            id: 'low_stock',
            title: 'Â∫´Â?‰∏çË∂≥',
            value: 12,
            subtitle: '?ÄË¶ÅË?Ë≤?,
            icon: STATS_ICONS.low_stock,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(3.2)
          },
          {
            id: 'active_customers',
            title: 'Ê¥ªË?ÂÆ¢Êà∂',
            value: 33,
            subtitle: '?¨Ê?Ê¥ªË?',
            icon: STATS_ICONS.active_customers,
            color: STATS_COLORS.info,
            trend: this.calculateTrend(15.6)
          },
          {
            id: 'total_suppliers',
            title: '?à‰?‰æõÊ???,
            value: supplierDataManager.getAllSuppliers().length,
            subtitle: 'Ê¥ªË?‰æõÊ???,
            icon: 'BuildingOfficeIcon',
            color: STATS_COLORS.neutral,
            trend: this.calculateTrend(2.3)
          }
        ]
      };

      this.setCachedStats(cacheKey, operationsStats);
      return operationsStats;
    } catch (error) {
      console.error('?≤Â??üÈ?Áµ±Ë?Â§±Ê?:', error);
      return this.getDefaultOperationsStats();
    }
  }

  /**
   * ?≤Â?Ë≤°Â?Áµ±Ë?
   */
  getFinancialStats() {
    const cacheKey = 'financial_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const accountingData = accountingDataManager.getDashboardData();
      
      const financialStats = {
        category: STATS_CATEGORIES.FINANCIAL,
        title: 'Ë≤°Â?Áµ±Ë?',
        cards: [
          {
            id: 'total_assets',
            title: 'Á∏ΩË???,
            value: `$${(accountingData.totalAssets || 850000).toLocaleString()}`,
            subtitle: 'Ë≥áÁî¢Á∏ΩÂÄ?,
            icon: STATS_ICONS.total_assets,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(6.8)
          },
          {
            id: 'monthly_profit',
            title: '?¨Ê??©ÊΩ§',
            value: `$${(accountingData.monthlyProfit || 45230).toLocaleString()}`,
            subtitle: 'Ê∑®Âà©ÊΩ?,
            icon: STATS_ICONS.monthly_profit,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(18.5)
          },
          {
            id: 'pending_payments',
            title: 'ÂæÖÊî∂Ê¨æÈ?',
            value: `$${(accountingData.pendingReceivables || 23450).toLocaleString()}`,
            subtitle: '?âÊî∂Â∏≥Ê¨æ',
            icon: STATS_ICONS.pending_payments,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-5.2)
          },
          {
            id: 'monthly_expenses',
            title: '?¨Ê??ØÂá∫',
            value: `$${(accountingData.monthlyExpenses || 32180).toLocaleString()}`,
            subtitle: '?üÈ??ØÂá∫',
            icon: 'ArrowTrendingDownIcon',
            color: STATS_COLORS.danger,
            trend: this.calculateTrend(8.9)
          }
        ]
      };

      this.setCachedStats(cacheKey, financialStats);
      return financialStats;
    } catch (error) {
      console.error('?≤Â?Ë≤°Â?Áµ±Ë?Â§±Ê?:', error);
      return this.getDefaultFinancialStats();
    }
  }

  /**
   * ?≤Â??©Ê?Áµ±Ë?
   */
  getLogisticsStats() {
    const cacheKey = 'logistics_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const logisticsData = logisticsDataManager.getShipmentStatusStats();
      
      const logisticsStats = {
        category: STATS_CATEGORIES.LOGISTICS,
        title: '?©Ê?Áµ±Ë?',
        cards: [
          {
            id: 'total_shipments',
            title: 'Á∏ΩÈ??ÅÊï∏',
            value: logisticsData.totalShipments || 284,
            subtitle: 'Á¥ØË??çÈÄ?,
            icon: STATS_ICONS.total_shipments,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(12.3)
          },
          {
            id: 'pending_shipments',
            title: '?çÈÄÅ‰∏≠',
            value: logisticsData.inTransit || 8,
            subtitle: 'Ê≠?ú®?çÈÄ?,
            icon: STATS_ICONS.pending_shipments,
            color: STATS_COLORS.info,
            trend: this.calculateTrend(-3.5)
          },
          {
            id: 'delivered_shipments',
            title: 'Â∑≤ÈÄÅÈ?',
            value: logisticsData.delivered || 269,
            subtitle: '?êÂ??çÈÄ?,
            icon: STATS_ICONS.delivered_shipments,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(15.2)
          },
          {
            id: 'delivery_rate',
            title: 'Ê∫ñÊ???,
            value: `${(logisticsData.onTimeRate || 94.5).toFixed(1)}%`,
            subtitle: '?çÈÄÅÁ∏æ??,
            icon: 'ChartBarIcon',
            color: STATS_COLORS.success,
            trend: this.calculateTrend(2.8)
          }
        ]
      };

      this.setCachedStats(cacheKey, logisticsStats);
      return logisticsStats;
    } catch (error) {
      console.error('?≤Â??©Ê?Áµ±Ë?Â§±Ê?:', error);
      return this.getDefaultLogisticsStats();
    }
  }

  /**
   * ?≤Â?Á≥ªÁµ±Áµ±Ë?
   */
  getSystemStats() {
    const cacheKey = 'system_stats';
    const cached = this.getCachedStats(cacheKey);
    if (cached) return cached;

    try {
      const adminStats = adminDataManager.getStatistics();
      
      const systemStats = {
        category: STATS_CATEGORIES.SYSTEM,
        title: 'Á≥ªÁµ±Áµ±Ë?',
        cards: [
          {
            id: 'total_users',
            title: 'Á∏ΩÁî®?∂Êï∏',
            value: adminStats.totalUsers || 45,
            subtitle: 'Ë®ªÂ??®Êà∂',
            icon: STATS_ICONS.total_users,
            color: STATS_COLORS.primary,
            trend: this.calculateTrend(6.2)
          },
          {
            id: 'active_sessions',
            title: 'Ê¥ªË??ÉË©±',
            value: adminStats.activeSessions || 12,
            subtitle: '?®Á??®Êà∂',
            icon: STATS_ICONS.active_sessions,
            color: STATS_COLORS.success,
            trend: this.calculateTrend(18.9)
          },
          {
            id: 'system_alerts',
            title: 'Á≥ªÁµ±Ë≠¶Â†±',
            value: 3,
            subtitle: '?ÄË¶ÅÊ≥®??,
            icon: STATS_ICONS.system_alerts,
            color: STATS_COLORS.warning,
            trend: this.calculateTrend(-12.5)
          },
          {
            id: 'server_uptime',
            title: 'Á≥ªÁµ±?ãË??ÇÈ?',
            value: '99.8%',
            subtitle: 'Á©©Â???,
            icon: 'ServerIcon',
            color: STATS_COLORS.success,
            trend: this.calculateTrend(0.2)
          }
        ]
      };

      this.setCachedStats(cacheKey, systemStats);
      return systemStats;
    } catch (error) {
      console.error('?≤Â?Á≥ªÁµ±Áµ±Ë?Â§±Ê?:', error);
      return this.getDefaultSystemStats();
    }
  }

  /**
   * ?≤Â??Ä?âÁµ±Ë®àË???
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
   * ‰æùÂ?È°ûÁç≤?ñÁµ±Ë®àË???
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
   * Ë®àÁ?Ë∂®Âã¢Ë≥áË?
   */
  calculateTrend(percentageChange) {
    return {
      direction: percentageChange >= 0 ? 'up' : 'down',
      percentage: Math.abs(percentageChange),
      color: percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
    };
  }

  /**
   * ?≤Â??êË®≠?∑ÂîÆÁµ±Ë?
   */
  getDefaultSalesStats() {
    return {
      category: STATS_CATEGORIES.SALES,
      title: '?∑ÂîÆÁµ±Ë?',
      cards: [
        {
          id: 'total_orders',
          title: 'Á∏ΩË???,
          value: 50,
          subtitle: 'Á¥ØË?Á∏ΩÊï∏',
          icon: STATS_ICONS.total_orders,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'today_orders',
          title: '‰ªäÊó•Ë®ÇÂñÆ',
          value: 0,
          subtitle: '‰ªäÊó•?∞Â?',
          icon: STATS_ICONS.today_orders,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'total_revenue',
          title: 'Á∏ΩÁ???,
          value: '$190,500',
          subtitle: 'Á¥ØË??∂ÂÖ•',
          icon: STATS_ICONS.total_revenue,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_orders',
          title: 'ÂæÖË???,
          value: 17,
          subtitle: '?ÄË¶ÅË???,
          icon: STATS_ICONS.pending_orders,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * ?≤Â??êË®≠?üÈ?Áµ±Ë?
   */
  getDefaultOperationsStats() {
    return {
      category: STATS_CATEGORIES.OPERATIONS,
      title: '?üÈ?Áµ±Ë?',
      cards: [
        {
          id: 'total_products',
          title: 'Á∏ΩÂ??ÅÊï∏',
          value: 156,
          subtitle: 'Â∑≤‰??∂Â???,
          icon: STATS_ICONS.total_products,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'low_stock',
          title: 'Â∫´Â?‰∏çË∂≥',
          value: 12,
          subtitle: '?ÄË¶ÅË?Ë≤?,
          icon: STATS_ICONS.low_stock,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'active_customers',
          title: '?®Á?ÂÆ¢Êà∂',
          value: 33,
          subtitle: 'Ê¥ªË??®Êà∂',
          icon: STATS_ICONS.active_customers,
          color: STATS_COLORS.info,
          trend: this.calculateTrend(0)
        },
        {
          id: 'total_suppliers',
          title: '?à‰?‰æõÊ???,
          value: 25,
          subtitle: 'Ê¥ªË?‰æõÊ???,
          icon: 'BuildingOfficeIcon',
          color: STATS_COLORS.neutral,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * ?≤Â??êË®≠Ë≤°Â?Áµ±Ë?
   */
  getDefaultFinancialStats() {
    return {
      category: STATS_CATEGORIES.FINANCIAL,
      title: 'Ë≤°Â?Áµ±Ë?',
      cards: [
        {
          id: 'total_assets',
          title: 'Á∏ΩË???,
          value: '$850,000',
          subtitle: 'Ë≥áÁî¢Á∏ΩÂÄ?,
          icon: STATS_ICONS.total_assets,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'monthly_profit',
          title: '?¨Ê??©ÊΩ§',
          value: '$45,230',
          subtitle: 'Ê∑®Âà©ÊΩ?,
          icon: STATS_ICONS.monthly_profit,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_payments',
          title: 'ÂæÖÊî∂Ê¨æÈ?',
          value: '$23,450',
          subtitle: '?âÊî∂Â∏≥Ê¨æ',
          icon: STATS_ICONS.pending_payments,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'monthly_expenses',
          title: '?¨Ê??ØÂá∫',
          value: '$32,180',
          subtitle: '?üÈ??ØÂá∫',
          icon: 'ArrowTrendingDownIcon',
          color: STATS_COLORS.danger,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * ?≤Â??êË®≠?©Ê?Áµ±Ë?
   */
  getDefaultLogisticsStats() {
    return {
      category: STATS_CATEGORIES.LOGISTICS,
      title: '?©Ê?Áµ±Ë?',
      cards: [
        {
          id: 'total_shipments',
          title: 'Á∏ΩÈ??ÅÊï∏',
          value: 284,
          subtitle: 'Á¥ØË??çÈÄ?,
          icon: STATS_ICONS.total_shipments,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'pending_shipments',
          title: '?çÈÄÅ‰∏≠',
          value: 8,
          subtitle: 'Ê≠?ú®?çÈÄ?,
          icon: STATS_ICONS.pending_shipments,
          color: STATS_COLORS.info,
          trend: this.calculateTrend(0)
        },
        {
          id: 'delivered_shipments',
          title: 'Â∑≤ÈÄÅÈ?',
          value: 269,
          subtitle: '?êÂ??çÈÄ?,
          icon: STATS_ICONS.delivered_shipments,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'delivery_rate',
          title: 'Ê∫ñÊ???,
          value: '94.5%',
          subtitle: '?çÈÄÅÁ∏æ??,
          icon: 'ChartBarIcon',
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * ?≤Â??êË®≠Á≥ªÁµ±Áµ±Ë?
   */
  getDefaultSystemStats() {
    return {
      category: STATS_CATEGORIES.SYSTEM,
      title: 'Á≥ªÁµ±Áµ±Ë?',
      cards: [
        {
          id: 'total_users',
          title: 'Á∏ΩÁî®?∂Êï∏',
          value: 45,
          subtitle: 'Ë®ªÂ??®Êà∂',
          icon: STATS_ICONS.total_users,
          color: STATS_COLORS.primary,
          trend: this.calculateTrend(0)
        },
        {
          id: 'active_sessions',
          title: 'Ê¥ªË??ÉË©±',
          value: 12,
          subtitle: '?®Á??®Êà∂',
          icon: STATS_ICONS.active_sessions,
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        },
        {
          id: 'system_alerts',
          title: 'Á≥ªÁµ±Ë≠¶Â†±',
          value: 3,
          subtitle: '?ÄË¶ÅÊ≥®??,
          icon: STATS_ICONS.system_alerts,
          color: STATS_COLORS.warning,
          trend: this.calculateTrend(0)
        },
        {
          id: 'server_uptime',
          title: 'Á≥ªÁµ±?ãË??ÇÈ?',
          value: '99.8%',
          subtitle: 'Á©©Â???,
          icon: 'ServerIcon',
          color: STATS_COLORS.success,
          trend: this.calculateTrend(0)
        }
      ]
    };
  }

  /**
   * ?∑Êñ∞?Ä?âÁµ±Ë®àË???
   */
  refreshAllStats() {
    this.clearCache();
    return this.getAllStats();
  }

  /**
   * ?∑Êñ∞?áÂ??ÜÈ??ÑÁµ±Ë®àË???
   */
  refreshStatsByCategory(category) {
    this.clearCache(`${category}_stats`);
    return this.getStatsByCategory(category);
  }
}

// Âª∫Á??Æ‰?ÂØ¶‰?
const dashboardStatsManager = new DashboardStatsManager();

export default dashboardStatsManager;

export {
  DashboardStatsManager
};
