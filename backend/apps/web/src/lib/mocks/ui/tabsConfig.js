// Minimal tabs config mock for layout/dashboard
// Map path prefixes to tabs
export function getTabsForPath(pathname) {
  // Very simple demo: show few tabs based on first segment
  if (!pathname || typeof pathname !== 'string') return []
  const p = pathname.toLowerCase()
  if (p.startsWith('/dashboard')) {
    return [
      { id: 'overview', label: '總覽', href: '/dashboard' },
      { id: 'analytics', label: '分析', href: '/dashboard/analytics' },
      { id: 'operations', label: '運營', href: '/dashboard/operations' },
    ]
  }
  if (p.startsWith('/settings')) {
    return [
      { id: 'system', label: '系統', href: '/settings' },
      { id: 'security', label: '安全', href: '/settings/security' },
      { id: 'payment', label: '金流', href: '/settings/payment' },
      { id: 'shipping', label: '物流', href: '/settings/shipping' },
    ]
  }
  // default empty
  return []
}
