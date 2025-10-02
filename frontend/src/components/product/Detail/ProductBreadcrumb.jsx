import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const ProductBreadcrumb = ({ categoryPath = [] }) => {
  return (
    <div className="border-b" style={{borderColor: '#E5E7EB'}}>
      <div className="max-w-full mx-auto px-4 xs:px-6 sm:px-6 md:px-8 lg:px-12 py-4">
        <div className="flex items-center gap-2 text-xs xs:text-sm font-chinese" style={{color: '#666666'}}>
          <Link to="/" className="hover:underline transition-all" style={{color: '#666666'}}>首頁</Link>
          <ChevronRightIcon className="w-3 h-3 xs:w-4 xs:h-4" />
          <Link to="/products" className="hover:underline transition-all" style={{color: '#666666'}}>商品</Link>
          {categoryPath.map((cat, index) => (
            <span key={cat.id} className="flex items-center gap-2">
              <ChevronRightIcon className="w-3 h-3 xs:w-4 xs:h-4" />
              <Link
                to={cat.href}
                className={`hover:underline transition-all ${index === categoryPath.length - 1 ? 'font-medium' : ''}`}
                style={{color: index === categoryPath.length - 1 ? '#333333' : '#666666'}}
              >
                {cat.name}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductBreadcrumb;