import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, HeartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const MobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  categories
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  if (!isMenuOpen) return null;

  const toggleExpanded = (itemKey) => {
    setExpandedItems(prev => prev[itemKey] ? (() => { const n={...prev}; delete n[itemKey]; return n; })() : {...prev, [itemKey]: true});
  };

  const renderMenuItem = (item, level = 0, parentKey = '') => {
    const itemKey = parentKey ? `${parentKey}-${item.name}` : item.name;
    const isExpanded = expandedItems[itemKey];
    const hasChildren = item.children;
    const paddingLeft = level === 0 ? '0.5rem' : `${0.5 + level * 1}rem`;

    return (
      <div key={itemKey} className="mb-1">
        <div className="w-full flex items-center justify-between py-2.5 font-chinese transition-colors duration-200" style={{paddingLeft, letterSpacing:'0.02em'}}>
          <Link
            to={item.href}
            onClick={() => { setIsMenuOpen(false); setExpandedItems({}); }}
            className="flex-1 text-left font-light transition-colors"
            style={{color: isExpanded ? '#CC824D' : '#666666', fontSize: level === 0 ? '1rem':'0.875rem'}}
          >
            {item.name}
          </Link>
          {hasChildren && (
            <button
              type="button"
              aria-label={isExpanded ? '收合子分類' : '展開子分類'}
              onClick={(e) => { e.stopPropagation(); toggleExpanded(itemKey); }}
              className="ml-2 p-2 -mr-2 flex items-center justify-center"
            >
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180':''}`} style={{strokeWidth:1.5, color: isExpanded ? '#CC824D':'#999999'}} />
            </button>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className="overflow-hidden">
            {item.children.map(sub => renderMenuItem(sub, level+1, itemKey))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lg:hidden fixed inset-0 top-20 z-40" style={{background:'#FFFFFF'}}>
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col min-h-full">
          <div className="px-6 pt-6 pb-4">
            <div className="relative">
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="搜尋商品..."
                className="w-full py-2.5 pl-10 pr-4 font-chinese text-sm rounded-lg transition-all duration-200 focus:outline-none"
                style={{background:'#F5F5F5', color:'#333333', border:'1px solid transparent'}}
                onFocus={(e) => e.currentTarget.style.borderColor = '#CC824D'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{strokeWidth:1.5, color:'#999999'}} />
            </div>
          </div>
          <div className="flex-1 px-6 pb-6">
            {renderMenuItem({ name: '全部商品', href: '/products' })}
            <div className="my-4 border-t" style={{borderColor:'#E5E7EB'}}></div>
            {categories.map(root => renderMenuItem(root))}
          </div>
          <div className="border-t px-6 py-6 mt-auto" style={{borderColor:'#E5E7EB', background:'#FAFAFA'}}>
            <Link
              to={{ pathname: '/login' }}
              state={{ from: window.location?.pathname || '/' }}
              onClick={() => { setIsMenuOpen(false); setExpandedItems({}); }}
              className="flex items-center py-3 font-chinese text-sm transition-colors duration-200"
              style={{color:'#666666', letterSpacing:'0.05em'}}
            >
              <UserIcon className="w-5 h-5 mr-3" style={{strokeWidth:1.5}} />
              <span>ACCOUNT</span>
            </Link>
            <Link
              to="/favorites"
              onClick={() => { setIsMenuOpen(false); setExpandedItems({}); }}
              className="flex items-center py-3 font-chinese text-sm transition-colors duration-200"
              style={{color:'#666666', letterSpacing:'0.05em'}}
            >
              <HeartIcon className="w-5 h-5 mr-3" style={{strokeWidth:1.5}} />
              <span>FAVOURITES</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
