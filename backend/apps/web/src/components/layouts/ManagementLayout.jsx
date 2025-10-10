import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthComponents';
import TabNavigation from '../ui/TabNavigation';
import { getTabsForPath } from '../../../../external_mock/ui/tabsConfig';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import notificationDataManager from '../../../../external_mock/notifications/notificationDataManager';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  BellIcon,
  ShoppingCartIcon,
  MapPinIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const ManagementLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: _user, logout } = useAuth();
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const sidebarRef = useRef(null);
  // Hover intent control to avoid accidental expansions
  const collapseTimerRef = useRef(null);
  const EDGE_TRIGGER_PX = 2; // Touch the very left screen edge to expand
  const COLLAPSE_GRACE_MS = 200; // Grace period before auto-collapsing

  // 以滑鼠位置偵測是否離開側邊欄，離開即自動收合（僅桌面版生效）
  useEffect(() => {
    const handleMouseMove = (e) => {
  // 桌面版固定行為（不做響應式處理）
      // Only expand when pointer touches the very left screen edge
      if (e.clientX <= EDGE_TRIGGER_PX) {
        if (!sidebarHovered) setSidebarHovered(true);
        if (collapseTimerRef.current) {
          clearTimeout(collapseTimerRef.current);
          collapseTimerRef.current = null;
        }
        return; // prevent collapse logic on the same event
      }
      const el = sidebarRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      // When pointer leaves, start a gentle collapse timer; cancel if pointer comes back in
      if (!inside && sidebarHovered) {
        if (!collapseTimerRef.current) {
          collapseTimerRef.current = setTimeout(() => {
            setSidebarHovered(false);
            collapseTimerRef.current = null;
          }, COLLAPSE_GRACE_MS);
        }
      } else if (inside && collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sidebarHovered]);

  // 根據當前路徑獲取頁籤配置
  const currentTabs = getTabsForPath(location.pathname);

  // 計算待處理通知數（例如：failed 或 pending）
  useEffect(() => {
    try {
      const all = notificationDataManager.getNotifications?.() || [];
      const count = all.filter(n => n.status === 'failed' || n.status === 'pending').length;
      setNotifCount(count);
    } catch (e) {
      setNotifCount(0);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: '總覽', href: '/dashboard/overview', icon: HomeIcon },
    { name: '商品管理', href: '/products', icon: ShoppingBagIcon },
    { name: '庫存管理', href: '/inventory', icon: CubeIcon },
    { name: '訂單管理', href: '/orders', icon: ClipboardDocumentListIcon },
    { name: '物流管理', href: '/logistics', icon: MapPinIcon },
    { name: '通知管理', href: '/notifications', icon: BellIcon },
    { name: '行銷管理', href: '/marketing', icon: ChartBarIcon },
    { name: '會員管理', href: '/members', icon: UsersIcon },
    { name: '採購管理', href: '/procurement', icon: ShoppingCartIcon },
  { name: '會計管理', href: '/accounting/balance-sheet', icon: CurrencyDollarIcon },
    { name: '評價管理', href: '/reviews', icon: StarIcon },
    { name: '表單審批', href: '/fromsigning', icon: DocumentTextIcon },
    // 通知中心從頂部鈴鐺進入，不在側邊欄顯示
  { name: '管理員管理', href: '/admin', icon: ShieldCheckIcon },
  { name: '用戶追蹤', href: '/user-tracking', icon: ChartBarIcon },
    { name: '數據分析', href: '/analytics', icon: ChartBarIcon },
    { name: '系統設定', href: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path) => {
    if (path === '/dashboard/overview') {
      return location.pathname === '/' || location.pathname === '/dashboard/overview';
    }
    // 若導航連結是深層路徑（例如 /accounting/balance-sheet），
    // 也應在同一模組根（/accounting/*）時標示為選中
    const segments = path.split('/').filter(Boolean);
    const base = segments.length > 0 ? `/${segments[0]}` : path;
    if (base && location.pathname.startsWith(base)) return true;
    return location.pathname.startsWith(path);
  };

  // Expanded state helper
  const isExpanded = sidebarHovered;

  return (
    <div className={`${ADMIN_STYLES.pageContainer} flex`}>
      {/* Overlay: non-blocking glass effect while sidebar expanded (desktop-only app) */}
      {sidebarHovered && (
        <div className="fixed inset-0 z-40 bg-white/20 backdrop-blur-sm pointer-events-none transition-opacity duration-300"></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out will-change-transform ${
          sidebarHovered ? 'w-64' : 'w-16'
        } ${sidebarHovered ? 'shadow-xl' : 'shadow-sm'}`}
        ref={sidebarRef}
        onMouseEnter={() => {
          if (collapseTimerRef.current) {
            clearTimeout(collapseTimerRef.current);
            collapseTimerRef.current = null;
          }
        }}
        onMouseLeave={() => {
          if (!collapseTimerRef.current) {
            collapseTimerRef.current = setTimeout(() => {
              setSidebarHovered(false);
              collapseTimerRef.current = null;
            }, COLLAPSE_GRACE_MS);
          }
        }}
      >
        <div className={`flex flex-col h-full bg-[#fdf8f2] border-r border-gray-200 shadow-sm ${isExpanded ? '' : 'pointer-events-none'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 bg-[#cc824d] rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className={`font-bold text-xl text-[#2d1e0f] font-serif transition-opacity duration-300 whitespace-nowrap ${
                sidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                Marelle 管理後台
              </span>
            </div>
            {/* No mobile close button in desktop-only layout */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1" aria-hidden={!isExpanded}>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                tabIndex={isExpanded ? 0 : -1}
                aria-disabled={!isExpanded}
                className={({ isActive: navIsActive }) => 
                  `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 font-serif group ${
                    navIsActive || isActive(item.href)
                      ? 'bg-[#cc824d] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#cc824d]'
                  }`
                }
                title={!sidebarHovered ? item.name : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                  sidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  {item.name}
                </span>
                {/* Tooltip removed in desktop-only simplification */}
              </NavLink>
            ))}
          </nav>

          {/* Footer removed per request: side logout button deleted */}
        </div>
      </div>

      {/* Main content */}
  <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarHovered ? 'ml-64' : 'ml-16'}`}>
        {/* Top bar with tabs */}
        <header className="bg-[#fdf8f2] border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-8 h-16">
            <div className="flex items-center flex-1">
              {/* 子頁籤導航 - 在頂部導航列內 */}
              {currentTabs && currentTabs.length > 0 && (
                <div className="flex-1">
                  <TabNavigation
                    tabs={currentTabs}
                    layout="left"
                    className="text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* 通知按鈕：導向 Notification Center（對內接收），不顯示於側邊欄 */}
              <button
                onClick={() => navigate('/notification-center')}
                className="p-2 rounded-lg text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d] transition-colors duration-200 relative"
                title="通知中心"
              >
                <BellIcon className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* 登出按鈕 */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d] transition-colors duration-200 font-serif"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="text-sm">登出</span>
              </button>
            </div>
          </div>
        </header>

        {/* 內容區域 */}
        <main className="flex-1 overflow-hidden bg-[#fdf8f2]" style={{overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagementLayout;