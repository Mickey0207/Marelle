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
  BellIcon
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
    { name: '會員管理', href: '/admin/members', icon: UsersIcon },
    { name: '通知管理', href: '/admin/notifications', icon: BellIcon },
    { name: '數據分析', href: '/admin/analytics', icon: ChartBarIcon },
    { name: '系統設定', href: '/admin/settings', icon: Cog6ToothIcon },
    { name: '庫存管理', href: '/admin/inventory', icon: CubeIcon },
  ];

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
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg mr-2"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <nav className="text-sm text-gray-500 font-serif">
                <Link to="/admin" className="hover:text-[#cc824d]">管理首頁</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-700">查看網站</span>
              </nav>
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
            <Route path="members/*" element={<MemberManagement />} />
            <Route path="notifications/*" element={<NotificationManagement />} />
            <Route path="analytics/*" element={<AdminAnalytics />} />
            <Route path="settings/*" element={<AdminSettings />} />
            <Route path="inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;