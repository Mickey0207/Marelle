import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, MagnifyingGlassIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../../../external_mock/state/cart.jsx';
import { useState, useEffect, useRef, useCallback } from 'react';

const NavActions = ({
  isMenuOpen,
  setIsMenuOpen
}) => {
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  // 從後端 /frontend/auth/me 取得真實登入狀態（Cookie 驗證）
  const [currentUser, setCurrentUser] = useState(null);
  // 是否已綁定 LINE（null 代表尚未載入）
  const [isLineBound, setIsLineBound] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const [accountHover, setAccountHover] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/frontend/auth/me', { credentials: 'include' });
      if (!res.ok) {
        setCurrentUser(null);
        return;
      }
      const data = await res.json();
      setCurrentUser({ id: data.id, email: data.email, display_name: data.display_name || null });
      // 可在此處理首次登入後的提示（例如透過事件通知頁面彈出 LineBindPrompt）
      // 目前先維持由個人資料頁掛載提示，避免全站重複彈窗。
    } catch {
      setCurrentUser(null);
    }
  }, []);

  // 初始與路由 path 變更時檢查登入狀態（避免對 query/hash 變更過度敏感）
  useEffect(() => { fetchMe(); }, [fetchMe, location.pathname]);

  // 取得 LINE 綁定狀態：已登入時才查詢
  useEffect(() => {
    let cancelled = false;
    async function loadLineStatus() {
      if (!currentUser) { setIsLineBound(null); return; }
      try {
        const res = await fetch('/frontend/account/line/status', { credentials: 'include' });
        if (!res.ok) { if (!cancelled) setIsLineBound(null); return; }
        const data = await res.json();
        if (!cancelled) setIsLineBound(!!data.is_bound);
      } catch {
        if (!cancelled) setIsLineBound(null);
      }
    }
    loadLineStatus();
    return () => { cancelled = true; };
  }, [currentUser, location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAccountMenu && accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu]);

  const handleLogout = async () => {
    try {
      await fetch('/frontend/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setCurrentUser(null);
    setShowAccountMenu(false);
    // 登出後導回首頁
    navigate('/');
  };

  return (
    <div className="flex items-center space-x-3 xs:space-x-4 ml-auto">
      {/* 未綁定 LINE 的使用者：在搜尋 icon 左側顯示綁定按鈕（桌面端） */}
      {currentUser && isLineBound === false && (
        <a
          href="/frontend/account/line/start"
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-md transition-all"
          style={{ background: '#06C755', color: '#FFFFFF' }}
          title="綁定 LINE"
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
        >
          綁定 LINE
        </a>
      )}
      <button
        className="hidden lg:block p-1.5 xs:p-2 transition-colors duration-200"
        style={{color: '#666666'}}
        onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
      >
        <MagnifyingGlassIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
      </button>
      <Link
        to="/favorites"
        className="p-1.5 xs:p-2 transition-colors duration-200"
        aria-label="收藏清單"
        style={{color: '#666666'}}
        onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
      >
        <HeartIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
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
          <span className="absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" style={{background: '#CC824D', color: '#FFFFFF'}}>
            {cartItemsCount}
          </span>
        )}
      </Link>
      {currentUser ? (
        <div className="relative" ref={accountMenuRef}>
          <button
            onClick={() => setShowAccountMenu(v => !v)}
            onMouseEnter={() => setAccountHover(true)}
            onMouseLeave={() => setAccountHover(false)}
            className="p-1.5 xs:p-2 transition-colors duration-200 flex items-center gap-1"
            style={{color: (accountHover || showAccountMenu) ? '#CC824D' : '#666666'}}
          >
            <UserIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
            {currentUser.display_name ? (
              <span className="hidden xl:inline text-xs font-chinese tracking-wide" style={{letterSpacing:'0.05em'}}>
                {currentUser.display_name}
              </span>
            ) : null}
          </button>
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg ring-1 ring-black/5 z-50" style={{background:'#FFFFFF', border:'1px solid #E5E7EB'}}>
              <div className="px-3 py-2 border-b" style={{borderColor:'#E5E7EB'}}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-chinese" style={{color:'#666666'}}>已登入</span>
                  {currentUser.display_name ? (
                    <span className="text-xs font-chinese font-medium" style={{color:'#CC824D'}}>
                      {currentUser.display_name}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setShowAccountMenu(false); navigate('/account'); }}
                  className="w-full text-left px-4 py-2 text-sm font-chinese transition-colors hover:bg-gray-50"
                  style={{color:'#666666'}}
                >
                  我的帳戶
                </button>
                <button
                  onClick={() => { setShowAccountMenu(false); navigate('/orders'); }}
                  className="w-full text-left px-4 py-2 text-sm font-chinese transition-colors hover:bg-gray-50"
                  style={{color:'#666666'}}
                >
                  訂單中心
                </button>
                <button
                  onClick={() => { setShowAccountMenu(false); navigate('/vip'); }}
                  className="w-full text-left px-4 py-2 text-sm font-chinese transition-colors hover:bg-gray-50"
                  style={{color:'#666666'}}
                >
                  會員專屬
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-chinese hover:bg-gray-50 transition-colors"
                style={{color:'#CC824D'}}
              >
                登出
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to={{ pathname: '/login' }}
          state={{ from: location.pathname }}
          className="p-1.5 xs:p-2 transition-colors duration-200"
          aria-label="會員登入"
          style={{color: '#666666'}}
          onMouseEnter={(e) => e.currentTarget.style.color = '#CC824D'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
        >
          <UserIcon className="w-5 h-5" style={{strokeWidth: 1.5}} />
        </Link>
      )}
      <button
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          if (isMenuOpen) {
            // reset state when closing
          }
        }}
        className="lg:hidden p-1.5 xs:p-2"
        style={{color: '#666666'}}
      >
        {isMenuOpen ? <XMarkIcon className="w-5 h-5" style={{strokeWidth: 1.5}} /> : <Bars3Icon className="w-5 h-5" style={{strokeWidth: 1.5}} />}
      </button>
    </div>
  );
};

export default NavActions;
