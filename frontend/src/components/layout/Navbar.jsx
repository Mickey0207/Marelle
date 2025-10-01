import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  GlobeAltIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useCart } from "../../../external_mock/state/cart.jsx"; // 移至 external_mock 暫存層
import { formatNavigationForNavbar } from "../../../external_mock/data/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuState, setMegaMenuState] = useState({
    activeItem: null,
    hoveredColumn: null,
    hoveredItemPath: []
  });
  const location = useLocation();
  const { cartItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 使用新的導航配置
  const primaryNav = formatNavigationForNavbar();

  // 改進的路由激活狀態檢查，支援層次化路由
  const isActive = (path) => {
    if (location.pathname === path) {
      return true;
    }
    // 對於商品類別，檢查是否為子路由
    if (path.startsWith('/products/') && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  // 簡化的路徑檢查邏輯 - 只需要檢查當前 URL 是否匹配項目的 href
  const isItemSelected = (itemHref) => {
    return location.pathname === itemHref;
  };

  // 檢查是否為父級路徑 - 當前路徑是否以該項目路徑開始
  const isParentSelected = (itemHref) => {
    return location.pathname.startsWith(itemHref + '/');
  };

    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`} 
        style={{
          background: '#FFFFFF',
          borderBottom: isScrolled ? '1px solid #E5E7EB' : '1px solid transparent'
        }}>
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center">
        {/* Left: Logo */}
        <div className="flex items-center mr-12">
          <Link to="/" className="flex items-center group">
            <span className="font-light text-2xl font-chinese transition-colors duration-200 tracking-tight" 
              style={{color: '#333333', letterSpacing: '0.05em'}}>
              Marelle
            </span>
          </Link>
        </div>
        {/* Center: Primary Nav */}
        <div className="hidden lg:flex items-center space-x-10 h-full flex-1 justify-center">
            {primaryNav.map(item => (
              <div key={item.name} className="relative h-full flex items-center group"
                onMouseEnter={() => setMegaMenuState({ activeItem: item.name, hoveredColumn: 0, hoveredItemPath: [] })}
                onMouseLeave={() => setMegaMenuState({ activeItem: null, hoveredColumn: null, hoveredItemPath: [] })}
              >
                <Link
                  to={item.href}
                  className={`font-chinese text-sm font-normal transition-colors relative tracking-[0.05em]`}
                  style={{
                    color: isActive(item.href) ? '#CC824D' : '#666666'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.target.style.color = '#666666';
                    }
                  }}
                >
                  <span className="flex items-center">
                    {item.name}
                    {item.mega && <ChevronDownIcon className="w-3.5 h-3.5 ml-1" style={{strokeWidth: 1.5}} />}
                  </span>
                </Link>
                {item.mega && megaMenuState.activeItem === item.name && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                    <div className={`bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 flex gap-4 ${
                      item.columns && item.columns.length > 3 ? 'w-[720px]' : 
                      item.columns && item.columns.length > 2 ? 'w-[540px]' : 'w-[360px]'
                    }`}>
                      {item.columns && item.columns.map((column, columnIndex) => {
                        const isColumnVisible = columnIndex === 0 || 
                          (columnIndex <= megaMenuState.hoveredColumn + 1 && megaMenuState.hoveredItemPath.length >= columnIndex);
                        
                        return (
                          <div 
                            key={column.title} 
                            className="flex-1 min-w-0"
                          >
                            <h4 className="text-xs font-semibold mb-3 tracking-wider text-primary-btn border-b border-gray-100 pb-2">
                              {column.title}
                            </h4>
                            <div className="space-y-1">
                              {column.items.slice(0, 8).map(it => {
                                const isSelected = isItemSelected(it.href);
                                const isParentItem = isParentSelected(it.href);
                                
                                return (
                                  <div key={it.name} className="relative">
                                    <Link 
                                      to={it.href} 
                                      className={`block text-sm transition-all duration-200 leading-relaxed py-1 px-2 rounded ${
                                        isSelected 
                                          ? 'bg-primary-btn text-btn-white shadow-sm font-medium' 
                                          : isParentItem
                                            ? 'bg-primary-btn/10 text-primary-btn font-medium'
                                            : it.hasChildren 
                                              ? 'text-lofi font-medium hover:bg-primary-btn/5 hover:text-primary-btn' 
                                              : 'text-gray-600 hover:bg-primary-btn/5 hover:text-primary-btn'
                                      }`}
                                      onMouseEnter={() => {
                                        if (it.hasChildren && columnIndex < 4) {
                                          setMegaMenuState(prev => ({
                                            ...prev,
                                            hoveredColumn: columnIndex,
                                            hoveredItemPath: [...prev.hoveredItemPath.slice(0, columnIndex), it.name]
                                          }));
                                        }
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="truncate">{it.name}</span>
                                        {it.hasChildren && <span className="ml-1 text-xs flex-shrink-0 opacity-60">›</span>}
                                      </div>
                                      {it.parent && !isSelected && !isParentItem && (
                                        <div className="text-xs opacity-60 truncate">
                                          {it.parent}
                                        </div>
                                      )}
                                    </Link>
                                  </div>
                                );
                              })}
                              {column.items.length > 8 && (
                                <div className="text-xs text-gray-400 px-2 py-1">
                                  +{column.items.length - 8} 更多...
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        {/* Right: Actions + Mobile Menu */}
        <div className="flex justify-end items-center space-x-4">
            <button 
              className="p-2 transition-colors duration-200 hidden md:inline-flex"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              <MagnifyingGlassIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
            </button>
            <Link 
              to="/login" 
              className="p-2 transition-colors duration-200 hidden md:inline-flex" 
              aria-label="會員登入"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              <UserIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
            </Link>
            <Link 
              to="/cart" 
              className="relative p-2 transition-colors duration-200"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              <ShoppingBagIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" 
                  style={{background: '#CC824D', color: '#FFFFFF'}}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2"
              style={{color: '#666666'}}
            >
              {isMenuOpen ? <XMarkIcon className="w-5 h-5" style={{strokeWidth: 1.5}} /> : <Bars3Icon className="w-5 h-5" style={{strokeWidth: 1.5}} />}
            </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-sm" style={{background: '#FFFFFF', borderTop: '1px solid #E5E7EB'}}>
          <div className="px-6 py-6 space-y-1">
            {primaryNav.map(item => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 font-chinese text-sm transition-colors duration-200 ${isActive(item.href) ? 'font-medium' : 'font-normal'}`}
                style={{
                  color: isActive(item.href) ? '#CC824D' : '#666666',
                  letterSpacing: '0.05em'
                }}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/admin/login" 
              onClick={() => setIsMenuOpen(false)} 
              className="block py-3 font-chinese text-sm font-normal transition-colors duration-200 border-t mt-4 pt-4" 
              style={{
                color: '#666666',
                borderColor: '#E5E7EB',
                letterSpacing: '0.05em'
              }}
            >
              管理後台
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;