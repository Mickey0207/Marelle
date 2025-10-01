import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
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
  // 使用物件來記錄每個項目的展開狀態,支援多層級
  const [expandedItems, setExpandedItems] = useState({});
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
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

  // 切換展開/收合狀態 - 同層級手風琴效果
  const toggleExpanded = (itemKey) => {
    setExpandedItems(prev => {
      // 如果當前項目已展開,則收合它
      if (prev[itemKey]) {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      }
      
      // 找出同層級的項目(有相同的 parent key)
      const itemParts = itemKey.split('-');
      const parentKey = itemParts.slice(0, -1).join('-');
      
      // 保留不同層級的展開狀態,只收合同層級的項目
      const newState = {};
      Object.keys(prev).forEach(key => {
        const keyParts = key.split('-');
        const keyParent = keyParts.slice(0, -1).join('-');
        
        // 如果不是同層級(parent key 不同),保留展開狀態
        if (keyParent !== parentKey) {
          newState[key] = prev[key];
        }
      });
      
      // 展開當前項目
      newState[itemKey] = true;
      return newState;
    });
  };

  // 遞迴渲染選單項目
  const renderMenuItem = (item, level = 0, parentKey = '') => {
    const itemKey = parentKey ? `${parentKey}-${item.name}` : item.name;
    const isExpanded = expandedItems[itemKey];
    const hasChildren = item.children || (item.mega && item.columns);
    // 計算縮排:每層增加 1rem (pl-4)
    const paddingLeft = level === 0 ? '0.5rem' : `${0.5 + level * 1}rem`;
    
    if (hasChildren) {
      // 有子項目的分類
      let allSubItems = [];
      
      if (item.columns) {
        // Mega menu 結構
        allSubItems = item.columns.flatMap(col => 
          col.items.map(it => ({
            name: it.name,
            href: it.href,
            hasChildren: it.hasChildren,
            children: it.children
          }))
        );
      } else if (item.children) {
        // 一般子項目結構
        allSubItems = item.children;
      }

      return (
        <div key={itemKey} className="mb-1">
          {/* 分類標題 */}
          {level === 0 && item.name === '全部商品' ? (
            <div style={{borderLeft: '3px solid #CC824D'}}>
              <Link
                to={item.href}
                onClick={() => {
                  setIsMenuOpen(false);
                  setExpandedItems({});
                }}
                className="block pl-5 py-3 font-chinese text-base font-medium transition-colors duration-200"
                style={{
                  color: '#CC824D',
                  letterSpacing: '0.02em'
                }}
              >
                {item.name}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => toggleExpanded(itemKey)}
              className="w-full flex items-center justify-between py-2.5 font-chinese transition-colors duration-200"
              style={{
                paddingLeft: paddingLeft,
                color: isExpanded ? '#CC824D' : '#666666',
                fontSize: level === 0 ? '1rem' : level === 1 ? '0.9rem' : level === 2 ? '0.875rem' : '0.85rem',
                letterSpacing: '0.02em'
              }}
            >
              <span className={level === 0 ? 'font-normal' : 'font-light'}>
                {item.name}
              </span>
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}
                style={{strokeWidth: 1.5, color: isExpanded ? '#CC824D' : '#999999'}} 
              />
            </button>
          )}

          {/* 子項目列表 */}
          {isExpanded && allSubItems.length > 0 && (
            <div className="overflow-hidden">
              {allSubItems.map((subItem, idx) => 
                renderMenuItem(subItem, level + 1, itemKey)
              )}
            </div>
          )}
        </div>
      );
    } else {
      // 沒有子項目的連結
      return (
        <div key={itemKey} className="mb-1">
          <Link
            to={item.href}
            onClick={() => {
              setIsMenuOpen(false);
              setExpandedItems({});
            }}
            className={`block py-2.5 font-chinese transition-colors duration-200 ${
              isActive(item.href) ? 'font-medium' : 'font-light'
            }`}
            style={{
              paddingLeft: paddingLeft,
              color: isActive(item.href) ? '#CC824D' : '#666666',
              fontSize: level === 0 ? '1rem' : level === 1 ? '0.9rem' : level === 2 ? '0.875rem' : '0.85rem',
              letterSpacing: '0.02em'
            }}
          >
            {item.name}
          </Link>
        </div>
      );
    }
  };

    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`} 
        style={{
          background: '#FFFFFF',
          borderBottom: isScrolled ? '1px solid #E5E7EB' : '1px solid transparent'
        }}>
      <div className="w-full px-4 xs:px-6 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center">
        {/* Left: Logo */}
        <div className="flex items-center mr-4 xs:mr-6 lg:mr-12">
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
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 flex gap-4" style={{minWidth: '360px', maxWidth: '960px'}}>
                      {/* 渲染第一層級 (columns) */}
                      {item.columns && item.columns.map((column, columnIndex) => (
                        <div key={column.title} className="flex-1 min-w-0" style={{minWidth: '180px'}}>
                          <h4 className="text-xs font-semibold mb-3 tracking-wider text-primary-btn border-b border-gray-100 pb-2">
                            {column.title}
                          </h4>
                          <div className="space-y-1">
                            {column.items.map((it, itemIdx) => {
                              const isSelected = isItemSelected(it.href);
                              const isParentItem = isParentSelected(it.href);
                              const hasChildren = it.hasChildren || (it.children && it.children.length > 0);
                              const isHovered = megaMenuState.hoveredItemPath[0] === it.name;
                              
                              return (
                                <div key={it.name} className="relative">
                                  <Link 
                                    to={it.href} 
                                    className={`block text-sm transition-all duration-200 leading-relaxed py-1 px-2 rounded ${
                                      isSelected 
                                        ? 'bg-primary-btn text-btn-white shadow-sm font-medium' 
                                        : isParentItem
                                          ? 'bg-primary-btn/10 text-primary-btn font-medium'
                                          : hasChildren 
                                            ? 'text-lofi font-medium hover:bg-primary-btn/5 hover:text-primary-btn' 
                                            : 'text-gray-600 hover:bg-primary-btn/5 hover:text-primary-btn'
                                    }`}
                                    onMouseEnter={() => {
                                      if (hasChildren) {
                                        setMegaMenuState(prev => ({
                                          ...prev,
                                          hoveredColumn: 0,
                                          hoveredItemPath: [it.name]
                                        }));
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      if (hasChildren) {
                                        setMegaMenuState(prev => ({
                                          ...prev,
                                          hoveredItemPath: []
                                        }));
                                      }
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="truncate">{it.name}</span>
                                      {hasChildren && <span className="ml-1 text-xs flex-shrink-0 opacity-60">›</span>}
                                    </div>
                                  </Link>
                                  
                                  {/* 子選單 - 第二層級及以上 */}
                                  {hasChildren && isHovered && it.children && it.children.length > 0 && (
                                    <div 
                                      className="absolute left-full top-0 ml-1 opacity-0 pointer-events-none transition-all duration-200"
                                      style={{
                                        opacity: isHovered ? 1 : 0,
                                        pointerEvents: isHovered ? 'auto' : 'none'
                                      }}
                                      onMouseEnter={() => {
                                        setMegaMenuState(prev => ({
                                          ...prev,
                                          hoveredItemPath: [it.name]
                                        }));
                                      }}
                                    >
                                      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3" style={{minWidth: '180px', maxWidth: '240px'}}>
                                        <div className="space-y-1">
                                          {it.children.map((subItem, subIdx) => {
                                            const subIsSelected = isItemSelected(subItem.href);
                                            const subIsParent = isParentSelected(subItem.href);
                                            const subHasChildren = subItem.hasChildren || (subItem.children && subItem.children.length > 0);
                                            const subIsHovered = megaMenuState.hoveredItemPath[1] === subItem.name;
                                            
                                            return (
                                              <div key={subItem.name} className="relative">
                                                <Link
                                                  to={subItem.href}
                                                  className={`block text-sm transition-all duration-200 leading-relaxed py-1 px-2 rounded ${
                                                    subIsSelected
                                                      ? 'bg-primary-btn text-btn-white shadow-sm font-medium'
                                                      : subIsParent
                                                        ? 'bg-primary-btn/10 text-primary-btn font-medium'
                                                        : subHasChildren
                                                          ? 'text-lofi font-medium hover:bg-primary-btn/5 hover:text-primary-btn'
                                                          : 'text-gray-600 hover:bg-primary-btn/5 hover:text-primary-btn'
                                                  }`}
                                                  onMouseEnter={() => {
                                                    if (subHasChildren) {
                                                      setMegaMenuState(prev => ({
                                                        ...prev,
                                                        hoveredItemPath: [it.name, subItem.name]
                                                      }));
                                                    }
                                                  }}
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <span className="truncate text-xs">{subItem.name}</span>
                                                    {subHasChildren && <span className="ml-1 text-xs flex-shrink-0 opacity-60">›</span>}
                                                  </div>
                                                </Link>
                                                
                                                {/* 可以繼續遞迴到第三、四、五層 */}
                                                {subHasChildren && subIsHovered && subItem.children && subItem.children.length > 0 && (
                                                  <div 
                                                    className="absolute left-full top-0 ml-1"
                                                    style={{
                                                      opacity: subIsHovered ? 1 : 0,
                                                      pointerEvents: subIsHovered ? 'auto' : 'none'
                                                    }}
                                                  >
                                                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3" style={{minWidth: '160px', maxWidth: '220px'}}>
                                                      <div className="space-y-1">
                                                        {subItem.children.map(level3Item => (
                                                          <Link
                                                            key={level3Item.name}
                                                            to={level3Item.href}
                                                            className={`block text-xs transition-all duration-200 leading-relaxed py-1 px-2 rounded ${
                                                              isItemSelected(level3Item.href)
                                                                ? 'bg-primary-btn text-btn-white shadow-sm font-medium'
                                                                : 'text-gray-600 hover:bg-primary-btn/5 hover:text-primary-btn'
                                                            }`}
                                                          >
                                                            <span className="truncate">{level3Item.name}</span>
                                                          </Link>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        {/* Right: Actions + Mobile Menu */}
        <div className="flex items-center space-x-3 xs:space-x-4 ml-auto">
            <button 
              className="hidden lg:block p-1.5 xs:p-2 transition-colors duration-200"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              <MagnifyingGlassIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
            </button>
            <Link 
              to="/wishlist" 
              className="p-1.5 xs:p-2 transition-colors duration-200" 
              aria-label="收藏清單"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              <HeartIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
            </Link>
            <Link 
              to="/login" 
              className="p-1.5 xs:p-2 transition-colors duration-200" 
              aria-label="會員登入"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              <UserIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
            </Link>
            <Link 
              to="/cart" 
              className="relative p-1.5 xs:p-2 transition-colors duration-200"
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
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isMenuOpen) {
                  setExpandedItems({});
                }
              }} 
              className="lg:hidden p-1.5 xs:p-2"
              style={{color: '#666666'}}
            >
              {isMenuOpen ? <XMarkIcon className="w-5 h-5" style={{strokeWidth: 1.5}} /> : <Bars3Icon className="w-5 h-5" style={{strokeWidth: 1.5}} />}
            </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40" style={{background: '#FFFFFF'}}>
          <div className="h-full overflow-y-auto">
            <div className="flex flex-col min-h-full">
              {/* 搜尋框 */}
              <div className="px-6 pt-6 pb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="搜尋商品..."
                    className="w-full py-2.5 pl-10 pr-4 font-chinese text-sm rounded-lg transition-all duration-200 focus:outline-none"
                    style={{
                      background: '#F5F5F5',
                      color: '#333333',
                      border: '1px solid transparent'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#CC824D'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  />
                  <MagnifyingGlassIcon 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{strokeWidth: 1.5, color: '#999999'}}
                  />
                </div>
              </div>

              {/* 導航項目 - 使用遞迴渲染 */}
              <div className="flex-1 px-6 pb-6">
                {/* 全部商品 */}
                {renderMenuItem({ name: '全部商品', href: '/products' }, 0)}
                
                {/* 分隔線 */}
                <div className="my-4 border-t" style={{borderColor: '#E5E7EB'}}></div>
                
                {/* 直接顯示所有主要分類,不要「商品」這一層 */}
                {primaryNav.find(item => item.mega)?.columns.map(column => 
                  renderMenuItem({
                    name: column.title,
                    href: column.items[0]?.href?.split('/').slice(0, 3).join('/') || '/products',
                    children: column.items
                  }, 0)
                )}
              </div>

              {/* 底部選項 */}
              <div className="border-t px-6 py-6 mt-auto" style={{borderColor: '#E5E7EB', background: '#FAFAFA'}}>
                <Link 
                  to="/login" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setExpandedItems({});
                  }}
                  className="flex items-center py-3 font-chinese text-sm transition-colors duration-200"
                  style={{color: '#666666', letterSpacing: '0.05em'}}
                >
                  <UserIcon className="w-5 h-5 mr-3" style={{strokeWidth: 1.5}} />
                  <span>ACCOUNT</span>
                </Link>
                <Link 
                  to="/wishlist" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setExpandedItems({});
                  }}
                  className="flex items-center py-3 font-chinese text-sm transition-colors duration-200"
                  style={{color: '#666666', letterSpacing: '0.05em'}}
                >
                  <HeartIcon className="w-5 h-5 mr-3" style={{strokeWidth: 1.5}} />
                  <span>FAVOURITES</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;