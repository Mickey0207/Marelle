import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
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
  MagnifyingGlassIcon,
  CubeIcon,
  BellIcon,
  KeyIcon,
  GiftIcon,
  PlusIcon,
  TruckIcon,
  ShoppingCartIcon,
  TicketIcon,
  MapPinIcon,
  CalculatorIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  SpeakerWaveIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Import management styles configuration
import { ADMIN_STYLES, ADMIN_COLORS, GSAP_ANIMATIONS } from '../lib/ui/adminStyles';

// Import admin pages
import AdminOverview from './Pages/dashboard/Overview';
import SalesAnalytics from './Pages/dashboard/SalesAnalytics';
import OperationsManagement from './Pages/dashboard/OperationsManagement';
import FinanceReports from './Pages/dashboard/FinanceReports';
import LogisticsManagement from './Pages/dashboard/LogisticsManagement';
import AdminProducts from './Pages/products/Products';
import AddProductAdvanced from './Pages/products/AddProductAdvanced';
import EditProduct from './Pages/products/EditProduct';
import AdminOrders from './Pages/orders/OrderList';
import AdminAnalytics from './Pages/analytics/AnalyticsOverview';
import AdminSettings from './Pages/settings/GeneralSettings';
import Inventory from './Pages/inventory/Inventory';
import MemberManagement from './Pages/members/MemberManagement';
import AdminManagement from './Pages/admin/AdminManagement';
// // import GiftManagementContainer from './Pages/gifts/GiftManagement'; // 已移除，此檔案不在Pages/gifts中 // 已移除，gifts目錄為空
import SupplierManagementContainer from './Pages/procurement/SupplierList';
import ProcurementManagementContainer from './Pages/procurement/ProcurementOverview';
import CouponManagementContainer from './Pages/coupons/CouponManagementContainer';
// import LogisticsManagementContainer from './Pages/logistics/LogisticsOverview'; // 已移除

// Import user tracking management components
import UserTrackingOverview from './components/users/UserTrackingOverview';
import UserBehaviorAnalytics from './components/users/UserBehaviorAnalytics';
import RealTimeActivityMonitor from './components/dashboard/RealTimeActivityMonitor';
import UserSegmentManagement from './components/users/UserSegmentManagement';
import PrivacySettings from './components/settings/PrivacySettings';

// Import dashboard management components
import DashboardOverview from './components/dashboard/DashboardOverview';
import TaskManagement from './components/workflow/TaskManagement';
import ApprovalWorkflowManagement from './components/workflow/ApprovalWorkflowManagement';
import RealTimeMonitoringDashboard from './components/dashboard/RealTimeMonitoringDashboard';

// Import UI components
// TabNavigation 已移至各模組獨立管理
import TabNavigation from './components/ui/TabNavigation';

// Import tab configurations
import { getTabsForPath } from '../lib/data/ui/tabsConfig';

// Import accounting system components
import AccountingManagementContainer from './Pages/accounting/AccountingOverview';

// Import festival management components (moved from marketing to festivals domain)
import FestivalOverview from './components/festivals/FestivalOverview';
import FestivalManagement from './components/festivals/FestivalManagement';
import PromotionSettings from './components/festivals/PromotionSettings';
import FestivalAnalytics from './components/analytics/FestivalAnalytics';

// Import marketing management components
import MarketingOverview from './components/marketing/MarketingOverview';
import CampaignManagement from './components/marketing/CampaignManagement';
import AdvertisingManagement from './components/marketing/AdvertisingManagement';
import AudienceManagement from './components/marketing/AudienceManagement';

// Document management components
import SalesDocumentManagement from './Pages/documents/SalesDocumentManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to products page with search term
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    // Check authentication
    const isAdminLoggedIn = localStorage.getItem('marelle-admin-token');
    if (!isAdminLoggedIn) {
      navigate('/login');
    }

    // Animate dashboard on load using unified animation config
    gsap.fromTo(
      '.admin-content',
      GSAP_ANIMATIONS.pageLoad.from,
      GSAP_ANIMATIONS.pageLoad.to
    );
  }, [navigate]);

  const navigation = [
    { name: '總覽', href: '/', icon: HomeIcon },
    { name: '商品管理', href: '/products', icon: ShoppingBagIcon },
    { name: '庫存管理', href: '/inventory', icon: CubeIcon },
    { name: '訂單管理', href: '/orders', icon: ClipboardDocumentListIcon },
    { name: '物流管理', href: '/logistics', icon: MapPinIcon },
    { name: '優惠管理', href: '/coupons', icon: TicketIcon },
    { name: '節慶管理', href: '/festivals', icon: CalendarDaysIcon },
    { name: '行銷管理', href: '/marketing', icon: SpeakerWaveIcon },
    { name: '會員管理', href: '/members', icon: UsersIcon },
    { name: '贈品管理', href: '/gifts', icon: GiftIcon },
    { name: '採購管理', href: '/procurement', icon: ShoppingCartIcon },
    { name: '會計管理', href: '/accounting', icon: CalculatorIcon },
    { name: '用戶追蹤', href: '/user-tracking', icon: ChartBarIcon },
    { name: '通知管理', href: '/notifications', icon: BellIcon },
    { name: '管理員管理', href: '/admin', icon: ShieldCheckIcon },
    { name: '數據分析', href: '/analytics', icon: ChartBarIcon },
    { name: '系統設定', href: '/settings', icon: Cog6ToothIcon },
  ];

  // 子導航配置已移至各模組獨立管理



  const handleLogout = () => {
    localStorage.removeItem('marelle-admin-token');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(path);
  };

  // 獲取當前路徑對應的子頁籤
  const getCurrentTabs = () => {
    const tabs = getTabsForPath(location.pathname);
    return tabs; // 直接返回，不添加 /admin 前綴
  };

  const currentTabs = getCurrentTabs();



  return (
    <div className={`${ADMIN_STYLES.pageContainer} flex`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } lg:translate-x-0 ${sidebarHovered ? 'lg:w-64' : 'lg:w-16'}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="flex flex-col h-full bg-[#fdf8f2] border-r border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 bg-[#cc824d] rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className={`font-bold text-xl text-[#2d1e0f] font-serif transition-opacity duration-300 whitespace-nowrap ${
                sidebarHovered || sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
              }`}>
                管理後台
              </span>
            </Link>
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
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 font-serif group ${
                  isActive(item.href)
                    ? 'bg-[#cc824d] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#cc824d]'
                }`}
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
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-serif group"
              title={!(sidebarHovered || sidebarOpen) ? '登出' : ''}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                sidebarHovered || sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
              }`}>
                登出
              </span>
              {/* Tooltip for collapsed state */}
              {!(sidebarHovered || sidebarOpen) && (
                <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  登出
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-[#fdf8f2] border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg mr-4"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              
              {/* Left: Logo/Brand */}
              <div className="flex items-center mr-8">
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="w-9 h-9 bg-[#cc824d] rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="font-bold text-xl text-[#2d1e0f] font-serif">
                    管理後台
                  </span>
                </Link>
              </div>

              {/* Center: 子頁籤導航 */}
              <div className="hidden lg:flex items-center space-x-6 h-full flex-1 justify-center">
                {currentTabs.length > 0 && (
                  <TabNavigation 
                    tabs={currentTabs} 
                    className=""
                  />
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleGlobalSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="全域搜尋商品、訂單..."
                      className="w-64 px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      autoFocus
                      onBlur={() => {
                        if (!searchTerm.trim()) {
                          setSearchOpen(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchTerm('');
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-gray-400 hover:text-[#cc824d] rounded-lg transition-colors"
                    title="全域搜尋"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              <span className="text-sm text-gray-600 font-serif">
                歡迎回來，管理員
              </span>
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-[#cc824d] border border-[#cc824d] rounded-lg hover:bg-[#cc824d] hover:text-white transition-all duration-200 font-serif"
              >
                查看網站
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`admin-content flex-1 ${ADMIN_STYLES.contentContainer}`} style={{overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <style jsx>{`
            .admin-content::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;