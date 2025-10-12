// Minimal tabs config mock for layout/dashboard
// Map path prefixes to tabs
export function getTabsForPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return []
  const p = pathname.toLowerCase()

  // Dashboard
  if (p.startsWith('/dashboard')) {
    return [
      { id: 'overview', label: '總覽', href: '/dashboard/overview' },
      { id: 'analytics', label: '分析', href: '/dashboard/sales-analytics' },
      { id: 'operations', label: '運營', href: '/dashboard/operations' },
    ]
  }

  // Settings
  if (p.startsWith('/settings')) {
    return [
      { id: 'system', label: '系統', href: '/settings' },
      { id: 'general', label: '一般', href: '/settings/general' },
      { id: 'security', label: '安全', href: '/settings/security' },
      { id: 'payment', label: '金流', href: '/settings/payment' },
      { id: 'shipping', label: '物流', href: '/settings/shipping' },
      { id: 'notifications', label: '通知', href: '/settings/notifications' },
    ]
  }

  // Account Setting
  if (p.startsWith('/accountsetting')) {
    return [
      { id: 'profile', label: '個人資料', href: '/accountsetting/profile' },
      { id: 'oauth', label: '第三方登入', href: '/accountsetting/oauth' },
      { id: 'permissions', label: '權限管理', href: '/accountsetting/permissions' },
    ]
  }

  // Marketing
  if (p.startsWith('/marketing')) {
    return [
      { id: 'coupons', label: '優惠券', href: '/marketing/coupons' },
      { id: 'festivals', label: '節慶活動', href: '/marketing/festivals' },
      { id: 'gifts', label: '贈品', href: '/marketing/gifts' },
    ]
  }

  // Orders
  if (p.startsWith('/orders')) {
    return [
      { id: 'management', label: '訂單管理', href: '/orders' },
    ]
  }

  // Products
  if (p.startsWith('/products')) {
    return [
      { id: 'list', label: '商品清單', href: '/products' },
      { id: 'add', label: '新增商品', href: '/products/add' },
      { id: 'categories', label: '分類管理', href: '/products/categories' },
    ]
  }

  // Inventory
  if (p.startsWith('/inventory')) {
    return [
      { id: 'overview', label: '庫存清單', href: '/inventory' },
      { id: 'warehouses', label: '倉庫管理', href: '/inventory/warehouses' },
    ]
  }

  // Logistics
  if (p.startsWith('/logistics')) {
    return [
      { id: 'tracking', label: '物流追蹤', href: '/logistics' },
    ]
  }

  // Outbound Notifications
  if (p.startsWith('/notifications')) {
    return [
      { id: 'history', label: '歷史', href: '/notifications' },
      { id: 'line-text', label: 'LINE 文字', href: '/notifications/line-text' },
      { id: 'line-flex', label: 'LINE Flex', href: '/notifications/line-flex' },
      { id: 'mail-text', label: 'Email 文字', href: '/notifications/mail-text' },
      { id: 'mail-html', label: 'Email HTML', href: '/notifications/mail-html' },
      { id: 'sms', label: 'SMS', href: '/notifications/sms' },
      { id: 'web', label: '站內通知', href: '/notifications/web' },
    ]
  }

  // Procurement
  if (p.startsWith('/procurement')) {
    return [
      { id: 'overview', label: '採購總覽', href: '/procurement' },
      { id: 'suppliers', label: '供應商', href: '/procurement/suppliers' },
    ]
  }

  // Accounting
  if (p.startsWith('/accounting')) {
    return [
      { id: 'balance-sheet', label: '資產負債表', href: '/accounting/balance-sheet' },
      { id: 'journal', label: '日記帳', href: '/accounting/journal' },
      { id: 'accounts', label: '會計科目', href: '/accounting/accounts' },
    ]
  }

  // Members
  if (p.startsWith('/members')) {
    return [
      { id: 'members', label: '會員管理', href: '/members' },
    ]
  }

  // Admin
  if (p.startsWith('/admin')) {
    return [
      { id: 'admin', label: '管理員管理', href: '/admin' },
      { id: 'roles', label: '角色管理', href: '/admin/roles' },
    ]
  }

  // Form signing / approvals
  if (p.startsWith('/fromsigning')) {
    return [
      { id: 'approvals', label: '表單審批', href: '/fromsigning' },
    ]
  }

  // Notification Center (inbound)
  if (p.startsWith('/notification-center')) {
    return [
      { id: 'overview', label: '總覽', href: '/notification-center' },
      { id: 'orders', label: '訂單通知', href: '/notification-center/orders' },
      { id: 'ecpay-payments', label: '綠界付款', href: '/notification-center/ecpay/payments' },
      { id: 'ecpay-subscriptions', label: '綠界定期', href: '/notification-center/ecpay/subscriptions' },
      { id: 'ecpay-codes', label: '綠界取號', href: '/notification-center/ecpay/codes' },
      { id: 'ecpay-cardless', label: '綠界分期', href: '/notification-center/ecpay/cardless-installments' },
    ]
  }

  // Analytics
  if (p.startsWith('/analytics')) {
    return [
      { id: 'overview', label: '總覽', href: '/analytics' },
      { id: 'sales', label: '銷售', href: '/analytics/sales' },
      { id: 'customers', label: '顧客', href: '/analytics/customers' },
      { id: 'products', label: '商品', href: '/analytics/products' },
      { id: 'operations', label: '運營', href: '/analytics/operations' },
      { id: 'ai', label: 'AI 洞察', href: '/analytics/ai-insights' },
    ]
  }

  // User Tracking
  if (p.startsWith('/user-tracking')) {
    return [
      { id: 'events', label: '事件', href: '/user-tracking/events' },
      { id: 'sessions', label: '工作階段', href: '/user-tracking/sessions' },
      { id: 'segments', label: '分群', href: '/user-tracking/segments' },
      { id: 'funnels', label: '漏斗', href: '/user-tracking/funnels' },
      { id: 'retention', label: '留存', href: '/user-tracking/retention' },
    ]
  }

  return []
}
