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

  const primaryNav = [
    {
      name: '油漆',
      href: '/products?cat=paint',
      mega: true,
      groups: [
        {
          title: '類型',
          items: [
            { name: '單色', href: '#' },
            { name: '套組', href: '#' },
            { name: '保護漆', href: '#' },
            { name: '試色罐', href: '#' },
            { name: '工具組', href: '#' }
          ]
        },
        {
          title: '色系',
          items: [
            { name: '灰白色系', href: '#' },
            { name: '大地色系', href: '#' },
            { name: '綠色系', href: '#' },
            { name: '藍色系', href: '#' },
            { name: '奶茶色系', href: '#' }
          ]
        }
      ]
    },
    { name: '家具茶', href: '/products?cat=furniture' },
    { name: '地毯', href: '/products?cat=rug' },
    { name: '窗簾', href: '/products?cat=curtain' },
    { name: '居家商品', href: '/products' },
    { name: '改造指南', href: '/guide' },
    { name: '生活風格', href: '/style' }
  ];

  // secondaryNav 已移除頂部列，不再使用

  const isActive = (path) => location.pathname === path;

    return (
      <nav className={`nav-lofi fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm border-b' : ''}`} style={{background:'#fdf8f2'}}>
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        {/* Left: Logo */}
        <div className="flex items-center mr-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 bg-primary-btn shadow-sm">
              <span className="text-btn-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl font-chinese group-hover:opacity-80 transition-opacity duration-200 text-lofi tracking-wide">Marelle</span>
          </Link>
        </div>
        {/* Center: Primary Nav */}
        <div className="hidden lg:flex items-center space-x-6 h-full flex-1 justify-center">
            {primaryNav.map(item => (
              <div key={item.name} className="relative h-full flex items-center group">
                <Link
                  to={item.href}
                  className={`font-medium font-chinese text-sm tracking-wide transition-colors relative px-1 text-lofi ${isActive(item.href) ? 'text-primary-btn' : 'hover:text-primary-btn'}`}
                >
                  <span className="flex items-center">{item.name}{item.mega && <ChevronDownIcon className="w-4 h-4 ml-1" />}</span>
                  <span className={`absolute left-0 -bottom-2 h-0.5 bg-primary-btn transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
                {item.mega && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-6 grid grid-cols-2 gap-8 w-[520px]">
                      {item.groups.map((g) => (
                        <div key={g.title}>
                          <h4 className="text-xs font-semibold mb-3 tracking-wider text-primary-btn">{g.title}</h4>
                          <ul className="space-y-2">
                            {g.items.map(it => (
                              <li key={it.name}>
                                <Link to={it.href} className="block text-sm text-lofi hover:text-primary-btn transition-colors">{it.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        {/* Right: Actions + Mobile Menu */}
        <div className="flex justify-end items-center space-x-2">
            <button className="p-2 rounded-lg transition-colors duration-200 text-lofi btn-ghost hidden md:inline-flex">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <Link to="/login" className="p-2 rounded-lg transition-colors duration-200 text-lofi btn-ghost hidden md:inline-flex" aria-label="會員登入">
              <UserIcon className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-lg transition-colors duration-200 text-lofi btn-ghost">
              <ShoppingBagIcon className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium bg-primary-btn text-btn-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-lofi btn-ghost">
              {isMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-lofi backdrop-blur-sm border-t">
          <div className="px-4 py-4 space-y-2">
            {primaryNav.map(item => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 font-chinese text-lofi ${isActive(item.href) ? 'bg-primary-btn text-btn-white' : 'hover:bg-primary-btn/10 hover:text-primary-btn'}`}
              >{item.name}</Link>
            ))}
            {secondaryNav.map(item => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium text-lofi hover:bg-primary-btn/10 hover:text-primary-btn transition-colors duration-200"
              >{item.name}</Link>
            ))}
            <Link to="/admin/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg font-medium text-lofi hover:bg-primary-btn/10 hover:text-primary-btn transition-colors duration-200 border-t mt-2 pt-4 font-chinese">管理後台</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;