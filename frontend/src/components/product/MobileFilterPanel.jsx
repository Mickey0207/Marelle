import { Link } from 'react-router-dom';
import SortDropdown from "../../components/ui/SortDropdown.jsx";

const MobileFilterPanel = ({
  show,
  onClose,
  sortBy,
  onSortChange,
  categories,
  isNodeSelected,
  isNodeParent,
  getNodeRoutePath,
  locationPathname,
  onReset
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-80 bg-white p-8 overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
          <h3 className="font-medium font-chinese text-sm tracking-[0.15em] uppercase" style={{color: '#333333'}}>
            篩選與排序
          </h3>
          <button
            onClick={onClose}
            className="text-sm font-chinese transition-colors duration-200"
            style={{color: '#999999'}}
            onMouseEnter={(e) => (e.target.style.color = '#CC824D')}
            onMouseLeave={(e) => (e.target.style.color = '#999999')}
          >
            關閉
          </button>
        </div>
        <div className="mb-8">
          <label className="block text-xs font-medium mb-4 font-chinese tracking-wider uppercase" style={{color: '#666666'}}>
            排序方式
          </label>
          <SortDropdown value={sortBy} onChange={onSortChange} />
        </div>
        <div className="mb-8">
          <h4 className="text-xs font-medium mb-4 font-chinese tracking-wider uppercase" style={{color: '#666666'}}>
            商品分類
          </h4>
          <nav className="space-y-1">
            <Link
              to="/products"
              onClick={onClose}
              className="block py-2.5 text-sm font-chinese transition-colors duration-200"
              style={{color: locationPathname === '/products' ? '#CC824D' : '#666666'}}
            >全部商品</Link>
            {categories.map(root => (
              <div key={root.slug}>
                <Link
                  to={getNodeRoutePath(root.slug)}
                  onClick={onClose}
                  className="block py-2.5 text-sm font-chinese transition-colors duration-200"
                  style={{ color: isNodeSelected(root.slug) || isNodeParent(root.slug) ? '#CC824D' : '#666666' }}
                >
                  {root.name}
                </Link>
              </div>
            ))}
          </nav>
        </div>
        <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
          <button
            onClick={onReset}
            className="w-full py-3 font-chinese text-sm font-medium tracking-wider transition-all duration-300"
            style={{ border: '1px solid #CC824D', color: '#CC824D', background: '#FFFFFF' }}
            onMouseEnter={(e) => { e.target.style.background = '#CC824D'; e.target.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.color = '#CC824D'; }}
          >
            重設篩選
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterPanel;
