import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, MagnifyingGlassIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../../../external_mock/state/cart.jsx';
import { getCurrentUser, logout } from '../../../../external_mock/state/users.js';
import { useState, useEffect, useRef } from 'react';

const NavActions = ({
  isMenuOpen,
  setIsMenuOpen
}) => {
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const [accountHover, setAccountHover] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'marelle_session_user') setCurrentUser(getCurrentUser());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAccountMenu && accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setShowAccountMenu(false);
  };

  return (
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
            <span className="hidden xl:inline text-xs font-chinese tracking-wide" style={{letterSpacing:'0.05em'}}>{currentUser.username}</span>
          </button>
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg ring-1 ring-black/5 z-50" style={{background:'#FFFFFF', border:'1px solid #E5E7EB'}}>
              <div className="px-3 py-2 border-b" style={{borderColor:'#E5E7EB'}}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-chinese" style={{color:'#666666'}}>已登入</span>
                  <span className="text-xs font-chinese font-medium" style={{color:'#CC824D'}}>{currentUser.username}</span>
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
          to="/login"
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
