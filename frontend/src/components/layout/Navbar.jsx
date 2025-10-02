import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { categories } from "../../../external_mock/data/categories";
import MegaPanel from './navbar/MegaPanel.jsx';
import NavActions from './navbar/NavActions.jsx';
import MobileMenu from './navbar/MobileMenu.jsx';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeRoot, setActiveRoot] = useState(null);
  const [panelMode, setPanelMode] = useState('root');
  const [activeLevel2, setActiveLevel2] = useState(null);
  const [activeLevel3, setActiveLevel3] = useState(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 粗略估算面板高度 (拆分後可改為 callback 回傳高度)
  useEffect(() => {
    if (activeRoot) setPanelHeight(520); else setPanelHeight(0);
  }, [activeRoot, panelMode]);

  // 導航列改為直接使用第一層分類 (不再顯示單一『商品』節點)
  const topLevelCategories = categories; // 第一層

  const isActive = (path) => location.pathname === path || (path.startsWith('/products/') && location.pathname.startsWith(path));

  // 行動版與帳戶/購物動作已拆分為 MobileMenu/NavActions

    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`} 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB'
        }}>
      <div className="w-full px-4 xs:px-6 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center" style={{background: '#FFFFFF'}}>
        {/* Left: Logo */}
        <div className="flex items-center mr-4 xs:mr-6 lg:mr-12">
          <Link to="/" className="flex items-center group">
            <span className="font-light text-2xl font-chinese transition-colors duration-200 tracking-tight" 
              style={{color: '#333333', letterSpacing: '0.05em'}}>
              Marelle
            </span>
          </Link>
        </div>
        {/* Center: Primary Nav => 直接列出第一層分類 */}
        <div className="hidden lg:flex items-center space-x-10 h-full flex-1 justify-center">
          {topLevelCategories.map(cat => {
            const isTopActive = isActive(cat.href);
            return (
              <div
                key={cat.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => { setActiveRoot(cat.id); setPanelMode('root'); setActiveLevel2(null); setActiveLevel3(null); }}
              >
                <Link
                  to={cat.href}
                  className="font-chinese text-sm font-normal transition-colors tracking-[0.05em] flex items-center"
                  style={{ color: isTopActive ? '#CC824D' : '#666666' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#CC824D')}
                  onMouseLeave={(e) => { if (!isTopActive) e.currentTarget.style.color = '#666666'; }}
                >
                  {cat.name}
                  {cat.children && cat.children.length > 0 && (
                    <ChevronDownIcon className="w-3.5 h-3.5 ml-1" style={{ strokeWidth: 1.5, color: '#CC824D' }} />
                  )}
                </Link>
              </div>
            );
          })}
        </div>
        <MegaPanel
          activeRoot={activeRoot}
          setActiveRoot={setActiveRoot}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          activeLevel2={activeLevel2}
          setActiveLevel2={setActiveLevel2}
          activeLevel3={activeLevel3}
          setActiveLevel3={setActiveLevel3}
          categories={topLevelCategories}
        />
        {/* 選單後方主頁內容的玻璃態覆蓋層 */}
        {activeRoot && panelHeight > 0 && (
          <div
            className="hidden lg:block fixed left-0 right-0 z-30"
            style={{
              top: `${80 + panelHeight}px`,
              bottom: 0,
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              pointerEvents: 'none'
            }}
          />
        )}
        <NavActions isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>

      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} categories={topLevelCategories} />
    </nav>
  );
};

export default Navbar;