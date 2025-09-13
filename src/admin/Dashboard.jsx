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
  XMarkIcon
} from '@heroicons/react/24/outline';

// Import admin pages (we'll create these)
import AdminOverview from './pages/Overview';
import AdminProducts from './pages/Products';
import AdminOrders from './pages/Orders';
import AdminCustomers from './pages/Customers';
import AdminAnalytics from './pages/Analytics';
import AdminSettings from './pages/Settings';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: '客戶管理', href: '/admin/customers', icon: UsersIcon },
    { name: '數據分析', href: '/admin/analytics', icon: ChartBarIcon },
    { name: '系統設定', href: '/admin/settings', icon: Cog6ToothIcon },
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
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-apricot-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-apricot-400 to-apricot-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-apricot-800 font-chinese">管理後台</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 font-chinese ${
                  isActive(item.href)
                    ? 'bg-apricot-100 text-apricot-700 border border-apricot-200'
                    : 'text-gray-700 hover:bg-apricot-50 hover:text-apricot-600'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-chinese"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              登出
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-chinese">
                歡迎回來，管理員
              </span>
              <Link
                to="/"
                className="btn-secondary text-sm font-chinese"
              >
                查看網站
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="products/*" element={<AdminProducts />} />
            <Route path="orders/*" element={<AdminOrders />} />
            <Route path="customers/*" element={<AdminCustomers />} />
            <Route path="analytics/*" element={<AdminAnalytics />} />
            <Route path="settings/*" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;