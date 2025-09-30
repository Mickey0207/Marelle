// Minimal analytics data manager for dashboard/analytics pages

const rand = (min, max) => Math.round(min + Math.random() * (max - min))

export default {
  getKPIDashboard(period = '30d') {
    return {
      revenue: rand(500000, 1200000),
      orders: rand(800, 2600),
      customers: rand(300, 1200),
      conversionRate: Number((Math.random() * 5 + 1).toFixed(2)),
      period,
      trends: {
        revenue: (Math.random() - 0.5) * 10,
        orders: (Math.random() - 0.5) * 10,
        customers: (Math.random() - 0.5) * 10,
        conversionRate: (Math.random() - 0.5) * 2,
      },
    }
  },
  getSalesTrends(period = '30d') {
    const points = Array.from({ length: 12 }).map((_, i) => ({
      label: `W${i+1}`,
      revenue: rand(50000, 180000),
      orders: rand(50, 260),
    }))
    return { period, points }
  },
  getAIInsights() {
    return {
      highlights: [
        { id: 1, title: '週末轉換提升', impact: '+12%', type: 'opportunity' },
        { id: 2, title: '北區物流延遲改善', impact: '+15%', type: 'trend' },
      ],
      recommendations: [
        { id: 'r1', title: '週末推出限時折扣', priority: 'high' },
        { id: 'r2', title: 'VIP 客戶挽回計畫', priority: 'critical' },
      ]
    }
  },
  getRealTimeMetrics() {
    return {
      current_visitors: rand(20, 120),
      active_sessions: rand(5, 25),
      real_time_sales: rand(10000, 100000),
      conversion_rate: Number((Math.random() * 5 + 1).toFixed(1)),
      device_breakdown: { mobile: 62.5, desktop: 37.5 },
      hot_pages: ['/products', '/marketing', '/dashboard/overview'].map((p, i) => ({ path: p, views: rand(200, 900) })),
    }
  },
  getOperationalAnalytics(period = '30days', _tab = 'overview') {
    return {
      metrics: {
        orderFulfillment: { value: 96.8, trend: 2.1 },
        avgProcessingTime: { value: 1.2, trend: -8.5 },
        inventoryTurnover: { value: 8.5, trend: 12.3 },
      },
      period,
    }
  }
}
