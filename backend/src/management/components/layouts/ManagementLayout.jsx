import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthComponents';
import TabNavigation from '../ui/TabNavigation';
import { getTabsForPath } from '../../../lib/data/ui/tabsConfig';
import { ADMIN_STYLES, ADMIN_COLORS } from '../../../lib/ui/adminStyles';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CubeIcon,
  BellIcon,
  ShoppingCartIcon,
  MapPinIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ManagementLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const sidebarRef = useRef(null);

  // 以滑鼠位置偵測是否離開側邊欄，離開即自動收合（僅桌面版生效）
  useEffect(() => {
    const handleMouseMove = (e) => {
      // 僅在桌面版啟用（Tailwind lg: ≥1024px）
      if (window.innerWidth < 1024) return;
      const el = sidebarRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside && sidebarHovered) {
        setSidebarHovered(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sidebarHovered]);

  // 根據當前路徑獲取頁籤配置
  const currentTabs = getTabsForPath(location.pathname);

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
    { name: '行銷管理', href: '/marketing', icon: ChartBarIcon },
    { name: '會員管理', href: '/members', icon: UsersIcon },
    { name: '採購管理', href: '/procurement', icon: ShoppingCartIcon },
    { name: '表單審批', href: '/fromsigning', icon: DocumentTextIcon },
    { name: '通知管理', href: '/notifications', icon: BellIcon },
    { name: '管理員管理', href: '/admin', icon: ShieldCheckIcon },
    { name: '數據分析', href: '/analytics', icon: ChartBarIcon },
    { name: '系統設定', href: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path) => {
    if (path === '/dashboard/overview') {
      return location.pathname === '/' || location.pathname === '/dashboard/overview';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`${ADMIN_STYLES.pageContainer} flex`}>
      {/* Overlays with glass effect */}
      {/* Mobile: glass overlay, click to close */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-white/30 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Desktop: non-blocking glass overlay while sidebar expanded */}
      {sidebarHovered && (
        <div
          className="hidden lg:block fixed inset-0 z-40 bg-white/20 backdrop-blur-sm pointer-events-none transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out will-change-transform ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } lg:translate-x-0 ${sidebarHovered ? 'lg:w-64' : 'lg:w-16'} ${
          sidebarOpen || sidebarHovered ? 'shadow-xl' : 'shadow-sm'
        }`}
        ref={sidebarRef}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="flex flex-col h-full bg-[#fdf8f2] border-r border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 bg-[#cc824d] rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className={`font-bold text-xl text-[#2d1e0f] font-serif transition-opacity duration-300 whitespace-nowrap ${
                sidebarHovered || sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
              }`}>
                管理後台
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-opacity duration-300 ${
                sidebarHovered || sidebarOpen ? 'opacity-100' : 'lg:opacity-0'
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive: navIsActive }) => 
                  `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 font-serif group ${
                    navIsActive || isActive(item.href)
                      ? 'bg-[#cc824d] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#cc824d]'
                  }`
                }
                title={!(sidebarHovered || sidebarOpen) ? item.name : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                  sidebarHovered || sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                }`}>
                  {item.name}
                </span>
                {/* Tooltip for collapsed state */}
                {!(sidebarHovered || sidebarOpen) && (
                  <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer removed per request: side logout button deleted */}
        </div>
      </div>

      {/* Main content */}
  <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Top bar with tabs */}
        <header className="bg-[#fdf8f2] border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg mr-4"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              
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
              {/* 通知按鈕 */}
              <button className="p-2 rounded-lg text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d] transition-colors duration-200 relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#cc824d] rounded-full"></span>
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