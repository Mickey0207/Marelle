import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const CategorySidebar = ({
  categories,
  expanded,
  setExpanded,
  isNodeSelected,
  isNodeParent,
  getNodeRoutePath,
  toggleExpand,
  locationPathname
}) => {
  return (
    <aside className="hidden">
      <div className="sticky top-24 space-y-2">
        <div className="pb-4 lg:pb-5 xl:pb-6 border-b border-gray-200">
          <h3 className="font-medium font-chinese text-xs lg:text-xs xl:text-xs tracking-[0.15em] uppercase mb-3 lg:mb-4" style={{color: '#666666'}}>分類</h3>
          <nav className="space-y-1">
            <Link
              to="/products"
              className={`block py-2.5 pl-3 text-sm font-chinese transition-colors duration-200 relative ${locationPathname === '/products' ? 'font-medium' : 'font-normal'}`}
              style={{ color: locationPathname === '/products' ? '#CC824D' : '#666666' }}
              onMouseEnter={(e) => (e.target.style.color = '#CC824D')}
              onMouseLeave={(e) => { if (locationPathname !== '/products') e.target.style.color = '#666666'; }}
            >
              <span>全部商品</span>
              {locationPathname === '/products' && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-btn"></span>}
            </Link>
            {categories.map(root => {
              const rootExpanded = expanded[root.id];
              return (
                <div
                  key={root.id}
                  onMouseEnter={() => setExpanded(e => ({ ...e, [root.id]: true }))}
                  onMouseLeave={() => setExpanded(e => ({ ...e, [root.id]: false }))}
                >
                  <Link
                    to={getNodeRoutePath(root.id)}
                    onClick={() => toggleExpand(root.id)}
                    className={`block py-2.5 pl-3 text-sm font-chinese transition-colors duration-200 relative ${
                      isNodeSelected(root.id) || isNodeParent(root.id) ? 'font-medium' : 'font-normal'
                    }`}
                    style={{ color: isNodeSelected(root.id) || isNodeParent(root.id) ? '#CC824D' : '#666666' }}
                    onMouseEnter={(e) => (e.target.style.color = '#CC824D')}
                    onMouseLeave={(e) => { if (!isNodeSelected(root.id) && !isNodeParent(root.id)) e.target.style.color = '#666666'; }}
                  >
                    <span className="flex items-center justify-between">
                      <span>{root.name}</span>
                      {root.children && (
                        <ChevronDownIcon
                          className={`w-3.5 h-3.5 ml-2 transition-transform ${rootExpanded ? 'rotate-180' : ''}`}
                          style={{ strokeWidth: 1.5 }}
                        />
                      )}
                    </span>
                    {isNodeSelected(root.id) && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-btn"></span>}
                  </Link>
                  {/* 子層 (僅保留原始結構，不再深入全部層級，後續可再細拆) */}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;
