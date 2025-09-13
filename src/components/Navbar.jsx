import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../hooks';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: '首頁', href: '/' },
    { name: '商品', href: '/products' },
    { name: '關於我們', href: '/about' },
    { name: '聯絡我們', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`nav-lofi fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm border-b' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 bg-primary-btn">
              <span className="text-btn-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl font-chinese group-hover:opacity-80 transition-opacity duration-200 text-lofi">Marelle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-all duration-200 relative group font-chinese text-lofi ${
                  isActive(item.href)
                    ? 'opacity-100'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full bg-primary-btn ${
                  isActive(item.href) ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 rounded-lg transition-colors duration-200 text-lofi btn-ghost">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* User */}
            <button className="p-2 rounded-lg transition-colors duration-200 text-lofi btn-ghost">
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-lg transition-colors duration-200 text-lofi btn-ghost"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium bg-primary-btn text-btn-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Admin Link - Desktop Only */}
            <Link
              to="/admin/login"
              className="hidden md:block px-4 py-2 text-sm font-medium btn-secondary"
            >
              管理後台
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-lofi btn-ghost"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-lofi backdrop-blur-sm border-t">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 font-chinese text-lofi ${
                  isActive(item.href)
                    ? 'bg-primary-btn text-btn-white'
                    : 'hover:bg-primary-btn/10 hover:text-primary-btn'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-lofi hover:bg-primary-btn/10 hover:text-primary-btn transition-colors duration-200 border-t mt-2 pt-4 font-chinese"
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