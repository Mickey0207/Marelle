import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
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

// Import admin pages
import AdminOverview from './pages/Overview';
import AdminProducts from './pages/Products';
import AddProductAdvanced from './pages/AddProductAdvanced';
import EditProduct from './pages/EditProduct';
import AdminOrders from './pages/Orders';
import AdminCustomers from './pages/Customers';
import AdminAnalytics from './pages/Analytics';
import AdminSettings from './pages/Settings';
import Inventory from './pages/Inventory';
import MemberManagement from './pages/MemberManagement';
import NotificationManagement from './pages/NotificationManagement';
import AdminManagement from './pages/AdminManagement';
import GiftManagementContainer from './pages/GiftManagementContainer';
import SupplierManagementContainer from './pages/suppliers/SupplierManagementContainer';
import ProcurementManagementContainer from './pages/procurement/ProcurementManagementContainer';
import CouponManagementContainer from './pages/CouponManagementContainer';
import LogisticsManagementContainer from './pages/logistics/LogisticsManagementContainer';

// Import accounting system components
import AccountingManagementContainer from './accounting/AccountingManagementContainer';

// Import festival management components
import FestivalOverview from './components/FestivalOverview';
import FestivalManagement from './components/FestivalManagement';
import PromotionSettings from './components/PromotionSettings';
import FestivalAnalytics from './components/FestivalAnalytics';

// Import marketing management components
import MarketingOverview from './components/MarketingOverview';
import CampaignManagement from './components/CampaignManagement';
import AdvertisingManagement from './components/AdvertisingManagement';
import AudienceManagement from './components/AudienceManagement';

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
      navigate(`/admin/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    // Check authentication
    const isAdminLoggedIn = localStorage.getItem('marelle-admin-token');
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }

    // Animate dashboard on load
    gsap.fromTo(
      '.admin-content',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  }, [navigate]);

  const navigation = [
    { name: '總覽', href: '/admin', icon: HomeIcon },
    { name: '商品管理', href: '/admin/products', icon: ShoppingBagIcon },
    { name: '訂單管理', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: '物流管理', href: '/admin/logistics', icon: MapPinIcon },
    { name: '優惠管理', href: '/admin/coupons', icon: TicketIcon },
    { name: '節慶管理', href: '/admin/festivals', icon: CalendarDaysIcon },
    { name: '行銷管理', href: '/admin/marketing', icon: SpeakerWaveIcon },
    { name: '會員管理', href: '/admin/members', icon: UsersIcon },
    { name: '贈品管理', href: '/admin/gifts', icon: GiftIcon },
    { name: '供應商管理', href: '/admin/suppliers', icon: TruckIcon },
    { name: '採購管理', href: '/admin/procurement', icon: ShoppingCartIcon },
    { name: '會計管理', href: '/admin/accounting', icon: CalculatorIcon },
    { name: '通知管理', href: '/admin/notifications', icon: BellIcon },
    { name: '數據分析', href: '/admin/analytics', icon: ChartBarIcon },
    { name: '管理員系統', href: '/admin/admin-management', icon: KeyIcon },
    { name: '系統設定', href: '/admin/settings', icon: Cog6ToothIcon },
    { name: '庫存管理', href: '/admin/inventory', icon: CubeIcon },
  ];

  // 獲取當前頁面的子頁籤配置
  const getSubTabs = () => {
    const path = location.pathname;
    
    if (path.startsWith('/admin/products')) {
      return [
        { name: '商品列表', href: '/admin/products', icon: ShoppingBagIcon },
        { name: '新增商品', href: '/admin/products/add', icon: PlusIcon },
      ];
    }
    
    if (path.startsWith('/admin/gifts')) {
      return [
        { name: '贈品概覽', href: '/admin/gifts', icon: GiftIcon },
        { name: '階梯規則', href: '/admin/gifts/tier-rules', icon: Cog6ToothIcon },
        { name: '會員福利', href: '/admin/gifts/member-benefits', icon: UsersIcon },
        { name: '分配追蹤', href: '/admin/gifts/allocation-tracking', icon: ChartBarIcon },
      ];
    }
    
    if (path.startsWith('/admin/orders')) {
      return [
        { name: '訂單列表', href: '/admin/orders', icon: ClipboardDocumentListIcon },
        { name: '新增訂單', href: '/admin/orders/new', icon: PlusIcon },
      ];
    }
    
    if (path.startsWith('/admin/members')) {
      return [
        { name: '會員列表', href: '/admin/members', icon: UsersIcon },
        { name: '會員分析', href: '/admin/members/analytics', icon: ChartBarIcon },
      ];
    }
    
    if (path.startsWith('/admin/suppliers')) {
      return [
        { name: '供應商列表', href: '/admin/suppliers', icon: TruckIcon },
        { name: '新增供應商', href: '/admin/suppliers/add', icon: PlusIcon },
        { name: '商品關聯', href: '/admin/suppliers/products', icon: ShoppingBagIcon },
        { name: '績效評估', href: '/admin/suppliers/performance', icon: ChartBarIcon },
      ];
    }
    
    if (path.startsWith('/admin/procurement')) {
      return [
        { name: '採購總覽', href: '/admin/procurement', icon: ChartBarIcon },
        { name: '採購單列表', href: '/admin/procurement/orders', icon: ClipboardDocumentListIcon },
        { name: '新增採購單', href: '/admin/procurement/orders/add', icon: PlusIcon },
        { name: '採購建議', href: '/admin/procurement/suggestions', icon: CubeIcon },
        { name: '驗收入庫', href: '/admin/procurement/inspection', icon: ShoppingBagIcon },
        { name: '成本分析', href: '/admin/procurement/analytics', icon: ChartBarIcon },
      ];
    }
    
    if (path.startsWith('/admin/logistics')) {
      return [
        { name: '物流總覽', href: '/admin/logistics', icon: MapPinIcon },
        { name: '出貨管理', href: '/admin/logistics/shipments', icon: TruckIcon },
        { name: '運費設定', href: '/admin/logistics/shipping-rates', icon: Cog6ToothIcon },
        { name: '物流追蹤', href: '/admin/logistics/tracking', icon: MapPinIcon },
        { name: '退貨管理', href: '/admin/logistics/returns', icon: ArrowRightOnRectangleIcon },
        { name: '分析報表', href: '/admin/logistics/analytics', icon: ChartBarIcon },
        { name: '物流商管理', href: '/admin/logistics/providers', icon: TruckIcon },
      ];
    }
    
    if (path.startsWith('/admin/coupons')) {
      return [
        { name: '優惠券列表', href: '/admin/coupons', icon: TicketIcon },
        { name: '新增優惠券', href: '/admin/coupons/new', icon: PlusIcon },
        { name: '疊加規則', href: '/admin/coupons/stacking-rules', icon: Cog6ToothIcon },
        { name: '分享管理', href: '/admin/coupons/sharing', icon: GiftIcon },
      ];
    }
    
    if (path.startsWith('/admin/festivals')) {
      return [
        { name: '節慶總覽', href: '/admin/festivals', icon: ChartBarIcon },
        { name: '節慶管理', href: '/admin/festivals/management', icon: CalendarDaysIcon },
        { name: '促銷設定', href: '/admin/festivals/promotions', icon: GiftIcon },
        { name: '節慶分析', href: '/admin/festivals/analytics', icon: ChartBarIcon },
      ];
    }
    
    if (path.startsWith('/admin/marketing')) {
      return [
        { name: '行銷總覽', href: '/admin/marketing', icon: ChartBarIcon },
        { name: '檔期管理', href: '/admin/marketing/campaigns', icon: SpeakerWaveIcon },
        { name: '廣告管理', href: '/admin/marketing/advertising', icon: TruckIcon },
        { name: '受眾管理', href: '/admin/marketing/audiences', icon: UsersIcon },
      ];
    }
    
    if (path.startsWith('/admin/accounting')) {
      return [
        { name: '會計總覽', href: '/admin/accounting', icon: ChartBarIcon },
        { name: '會計科目', href: '/admin/accounting/chart-of-accounts', icon: CalculatorIcon },
        { name: '會計分錄', href: '/admin/accounting/journal-entries', icon: DocumentTextIcon },
        { name: '財務報表', href: '/admin/accounting/financial-reports', icon: DocumentTextIcon },
        { name: '銀行對帳', href: '/admin/accounting/bank-reconciliation', icon: CreditCardIcon },
      ];
    }
    
    if (path.startsWith('/admin/analytics')) {
      return [
        { name: '分析總覽', href: '/admin/analytics', icon: ChartBarIcon },
        { name: '銷售分析', href: '/admin/analytics/sales', icon: ChartBarIcon },
        { name: '客戶分析', href: '/admin/analytics/customers', icon: UsersIcon },
        { name: '商品分析', href: '/admin/analytics/products', icon: ShoppingBagIcon },
        { name: '營運分析', href: '/admin/analytics/operations', icon: Cog6ToothIcon },
        { name: 'AI 洞察', href: '/admin/analytics/ai-insights', icon: SparklesIcon },
      ];
    }
    
    if (path.startsWith('/admin/settings')) {
      return [
        { name: '設定總覽', href: '/admin/settings', icon: ChartBarIcon },
        { name: '一般設定', href: '/admin/settings/general', icon: Cog6ToothIcon },
        { name: '安全設定', href: '/admin/settings/security', icon: ShieldCheckIcon },
        { name: '通知設定', href: '/admin/settings/notifications', icon: BellIcon },
        { name: '付款設定', href: '/admin/settings/payments', icon: CreditCardIcon },
        { name: '物流設定', href: '/admin/settings/shipping', icon: TruckIcon },
      ];
    }
    
    return [];
  };

  const subTabs = getSubTabs();
  const hasSubTabs = subTabs.length > 0;

  const handleLogout = () => {
    localStorage.removeItem('marelle-admin-token');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  // 檢查子頁籤是否激活（只有完全匹配的路徑才激活）
  const isSubTabActive = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex">
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
            <Link to="/admin" className="flex items-center space-x-3 min-w-0">
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
              
              {/* 子頁籤導航 */}
              {hasSubTabs ? (
                <div className="flex space-x-6">
                  {subTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = isSubTabActive(tab.href);
                    
                    return (
                      <Link
                        key={tab.href}
                        to={tab.href}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 hover:text-[#cc824d] ${
                          isActive
                            ? 'text-[#cc824d] border-[#cc824d]'
                            : 'text-gray-600 border-transparent hover:border-gray-300'
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span className="font-chinese">{tab.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500 font-serif">
                  <span className="text-gray-700">管理後台</span>
                </div>
              )}
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
        <main className="admin-content flex-1 p-6 bg-[#fdf8f2] overflow-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
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
            <Route path="members/*" element={<MemberManagement />} />
            <Route path="gifts/*" element={<GiftManagementContainer />} />
            <Route path="suppliers/*" element={<SupplierManagementContainer />} />
            <Route path="procurement/*" element={<ProcurementManagementContainer />} />
            <Route path="notifications/*" element={<NotificationManagement />} />
            <Route path="analytics/*" element={<AdminAnalytics />} />
            <Route path="admin-management/*" element={<AdminManagement />} />
            <Route path="settings/*" element={<AdminSettings />} />
            <Route path="inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;