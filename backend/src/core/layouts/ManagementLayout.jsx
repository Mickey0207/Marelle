import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      category: '核心功能',
      items: [
        { name: '儀表板', icon: '📊', path: '/', exact: true },
      ]
    },
    {
      category: '商業管理',
      items: [
        { name: '商品管理', icon: '📦', path: '/products' },
        { name: '訂單管理', icon: '📋', path: '/orders' },
        { name: '客戶管理', icon: '👥', path: '/customers' },
        { name: '庫存管理', icon: '📊', path: '/inventory' },
        { name: '行銷管理', icon: '📢', path: '/marketing' },
      ]
    },
    {
      category: '系統管理',
      items: [
        { name: '用戶管理', icon: '👤', path: '/users' },
        { name: '系統設定', icon: '⚙️', path: '/settings' },
        { name: '數據分析', icon: '📈', path: '/analytics' },
      ]
    }
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#fefcf8] to-[#f9f6f0]">
      {/* 側邊欄 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white/95 backdrop-filter backdrop-blur-sm shadow-lg transition-all duration-300 flex flex-col border-r border-[#e5ded6]`}>
        {/* Logo 區域 */}
        <div className="p-4 border-b border-[#e5ded6]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#cc824d] rounded-lg flex items-center justify-center text-white font-bold font-serif">
              M
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-[#2d1e0f] font-serif">Marelle</h1>
                <p className="text-sm text-[#8b7355]">管理後台</p>
              </div>
            )}
          </div>
        </div>

        {/* 導航選單 */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              {sidebarOpen && (
                <h3 className="px-4 mb-2 text-xs font-semibold text-[#8b7355] uppercase tracking-wider font-serif">
                  {category.category}
                </h3>
              )}
              <ul className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 mx-2 rounded-lg transition-colors duration-200 font-serif ${
                          isActive
                            ? 'bg-[#cc824d] text-white shadow-sm'
                            : 'text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d]'
                        }`
                      }
                    >
                      <span className="text-xl">{item.icon}</span>
                      {sidebarOpen && (
                        <span className="ml-3 text-sm font-medium">{item.name}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* 用戶資訊區域 */}
        <div className="border-t border-[#e5ded6] p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#cc824d]/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-[#cc824d] font-serif">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-[#2d1e0f] font-serif">{user?.name}</p>
                <p className="text-xs text-[#8b7355]">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部導航 */}
        <header className="bg-white/80 backdrop-filter backdrop-blur-sm shadow-sm border-b border-[#e5ded6] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d] transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-[#2d1e0f] font-serif">
                管理後台
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* 通知按鈕 */}
              <button className="p-2 rounded-lg text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d] transition-colors duration-200 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-10-3h10v-7a5 5 0 0 0-10 0v7z" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#cc824d] rounded-full"></span>
              </button>

              {/* 登出按鈕 */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#2d1e0f] hover:bg-[#f7ede3] hover:text-[#cc824d] transition-colors duration-200 font-serif"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">登出</span>
              </button>
            </div>
          </div>
        </header>

        {/* 內容區域 */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;