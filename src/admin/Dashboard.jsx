import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogto } from '@logto/react';
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

// Import admin styles configuration
import { ADMIN_STYLES, ADMIN_COLORS, GSAP_ANIMATIONS } from './shared/adminStyles';

// Import admin pages
import AdminOverview from './modules/dashboard/pages/Overview';
import SalesAnalytics from './modules/dashboard/pages/SalesAnalytics';
import OperationsManagement from './modules/dashboard/pages/OperationsManagement';
import FinanceReports from './modules/dashboard/pages/FinanceReports';
import LogisticsManagement from './modules/dashboard/pages/LogisticsManagement';
import DashboardTabs from './modules/dashboard/components/DashboardTabs';
import AdminProducts from './modules/products/pages/Products';
import AddProductAdvanced from './modules/products/pages/AddProductAdvanced';
import EditProduct from './modules/products/pages/EditProduct';
import AdminOrders from './modules/orders/pages/Orders';
import AdminCustomers from './modules/members/pages/Customers';
import AdminAnalytics from './modules/analytics/pages/Analytics';
import AdminSettings from './modules/settings/pages/Settings';
// import Inventory from './modules/products/pages/Inventory'; // Temporarily disabled due to encoding issues
// import MemberManagement from './modules/members/pages/MemberManagement'; // Temporarily disabled due to encoding issues
import NotificationManagementContainer from './modules/notifications/pages/NotificationManagementContainer';
// import AdminManagement from './modules/admin/pages/AdminManagement'; // Temporarily disabled due to encoding issues
import GiftManagementContainer from './modules/members/pages/GiftManagementContainer';
import SupplierManagementContainer from './modules/suppliers/pages/SupplierManagementContainer';
import ProcurementManagementContainer from './modules/procurement/pages/ProcurementManagementContainer';
import CouponManagementContainer from './modules/coupons/pages/CouponManagementContainer';
import LogisticsManagementContainer from './modules/logistics/pages/LogisticsManagementContainer';

// Import user tracking management components
import UserTrackingOverview from './shared/components/UserTrackingOverview';
import UserBehaviorAnalytics from './shared/components/UserBehaviorAnalytics';
import RealTimeActivityMonitor from './shared/components/RealTimeActivityMonitor';
import UserSegmentManagement from './shared/components/UserSegmentManagement';
import PrivacySettings from './shared/components/PrivacySettings';

// Import dashboard management components
import DashboardOverview from './shared/components/DashboardOverview';
import TaskManagement from './shared/components/TaskManagement';
import ApprovalWorkflowManagement from './shared/components/ApprovalWorkflowManagement';
import RealTimeMonitoringDashboard from './shared/components/RealTimeMonitoringDashboard';

// Import accounting system components
import AccountingManagementContainer from './modules/accounting/pages/AccountingManagementContainer';

// Import festival management components
import FestivalOverview from './shared/components/FestivalOverview';
import FestivalManagement from './shared/components/FestivalManagement';
import PromotionSettings from './shared/components/PromotionSettings';
import FestivalAnalytics from './shared/components/FestivalAnalytics';

// Import marketing management components
import MarketingOverview from './shared/components/MarketingOverview';
import CampaignManagement from './shared/components/CampaignManagement';
import AdvertisingManagement from './shared/components/AdvertisingManagement';
import AudienceManagement from './shared/components/AudienceManagement';

// Document management components temporarily disabled due to encoding issues
// import DocumentOverview from './modules/documents/pages/DocumentOverview';
// import SalesDocumentManagement from './modules/documents/pages/SalesDocumentManagement';
// import PurchaseDocumentManagement from './modules/documents/pages/PurchaseDocumentManagement';
// import InventoryDocumentManagement from './modules/documents/pages/InventoryDocumentManagement';
// import ApprovalWorkflowSystem from './modules/documents/pages/ApprovalWorkflowSystem';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Logto 認證 hooks
  const { isAuthenticated, isLoading, signOut, getAccessToken, getIdTokenClaims } = useLogto();

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
    // Animate dashboard on load using unified animation config
    gsap.fromTo(
      '.admin-content',
      GSAP_ANIMATIONS.pageLoad.from,
      GSAP_ANIMATIONS.pageLoad.to
    );
  }, []);

  // 處理登出
  const handleLogout = async () => {
    try {
      const postLogoutRedirectUri = window.location.hostname === 'localhost'
        ? 'http://localhost:3001/'
        : 'https://admin.marelle.com.tw/';
      await signOut(postLogoutRedirectUri);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  const navigation = [
    { name: '總覽', href: '/', icon: HomeIcon },
    { name: '商品管理', href: '/products', icon: ShoppingBagIcon },
    { name: '訂單管理', href: '/orders', icon: ClipboardDocumentListIcon },
    { name: '物流管理', href: '/logistics', icon: MapPinIcon },
    { name: '優惠管理', href: '/coupons', icon: TicketIcon },
    { name: '節慶管理', href: '/festivals', icon: CalendarDaysIcon },
    { name: '行銷管理', href: '/marketing', icon: SpeakerWaveIcon },
    { name: '會員管理', href: '/members', icon: UsersIcon },
    { name: '贈品管理', href: '/gifts', icon: GiftIcon },
    { name: '供應商管理', href: '/suppliers', icon: TruckIcon },
    { name: '採購管理', href: '/procurement', icon: ShoppingCartIcon },
    { name: '會計管理', href: '/accounting', icon: CalculatorIcon },
    { name: '用戶追蹤', href: '/user-tracking', icon: ChartBarIcon },
    { name: '通知管理', href: '/notifications', icon: BellIcon },
    { name: '數據分析', href: '/analytics', icon: ChartBarIcon },
    { name: '系統設定', href: '/settings', icon: Cog6ToothIcon },
  ];




  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(path);
  };



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
              
              <div className="text-sm text-gray-500 font-serif">
                <span className="text-gray-700">管理後台</span>
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
        <main className={`admin-content flex-1 ${ADMIN_STYLES.contentContainer} overflow-auto`}>
          <Routes>
            <Route index element={<DashboardTabs />} />
            <Route path="sales" element={<SalesAnalytics />} />
            <Route path="operations" element={<OperationsManagement />} />
            <Route path="finance" element={<FinanceReports />} />
            <Route path="logistics-dashboard" element={<LogisticsManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="approvals" element={<ApprovalWorkflowManagement />} />
            <Route path="monitoring" element={<RealTimeMonitoringDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProductAdvanced />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders/*" element={<AdminOrders />} />
            <Route path="logistics/*" element={<LogisticsManagementContainer />} />
            <Route path="coupons/*" element={<CouponManagementContainer />} />
            <Route path="festivals" element={<FestivalOverview />} />
            <Route path="festivals/management" element={<FestivalManagement />} />
            <Route path="festivals/promotions" element={<PromotionSettings />} />
            <Route path="festivals/analytics" element={<FestivalAnalytics />} />
            <Route path="marketing" element={<MarketingOverview />} />
            <Route path="marketing/campaigns" element={<CampaignManagement />} />
            <Route path="marketing/advertising" element={<AdvertisingManagement />} />
            <Route path="marketing/audiences" element={<AudienceManagement />} />
            <Route path="accounting/*" element={<AccountingManagementContainer />} />
            <Route path="user-tracking" element={<UserTrackingOverview />} />
            <Route path="user-tracking/behavior" element={<UserBehaviorAnalytics />} />
            <Route path="user-tracking/real-time" element={<RealTimeActivityMonitor />} />
            <Route path="user-tracking/segments" element={<UserSegmentManagement />} />
            <Route path="user-tracking/privacy" element={<PrivacySettings />} />
            {/* Temporarily disabled routes due to encoding issues */}
            {/* <Route path="members/*" element={<MemberManagement />} /> */}
            <Route path="gifts/*" element={<GiftManagementContainer />} />
            <Route path="suppliers/*" element={<SupplierManagementContainer />} />
            <Route path="procurement/*" element={<ProcurementManagementContainer />} />
            <Route path="notifications/*" element={<NotificationManagementContainer />} />
            <Route path="analytics/*" element={<AdminAnalytics />} />
            {/* <Route path="admin-management/*" element={<AdminManagement />} /> */}
            <Route path="settings/*" element={<AdminSettings />} />
            {/* <Route path="inventory" element={<Inventory />} /> */}
            {/* <Route path="documents" element={<DocumentOverview />} /> */}
            {/* <Route path="documents/sales" element={<SalesDocumentManagement />} /> */}
            {/* <Route path="documents/purchase" element={<PurchaseDocumentManagement />} /> */}
            {/* <Route path="documents/inventory" element={<InventoryDocumentManagement />} /> */}
            {/* <Route path="documents/workflow" element={<ApprovalWorkflowSystem />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;