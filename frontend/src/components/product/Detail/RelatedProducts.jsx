import { Link } from 'react-router-dom';
import { formatPrice } from '../../../../external_mock/data/format.js';
import { buildProductDetailUrl } from '../../../../external_mock/data/products.mock.js';

const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;
  return (
    <div className="mt-16 border-t pt-16" style={{borderColor: '#E5E7EB'}}>
      <h2 className="text-xl xs:text-2xl font-light font-chinese mb-8" style={{color: '#333333'}}>
        您可能也會喜歡
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-6">
        {products.map(r => (
          <Link key={r.id} to={buildProductDetailUrl(r)} className="group block">
            <div className="aspect-square overflow-hidden bg-white rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl mb-3">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className="font-chinese text-sm xs:text-base mb-2 line-clamp-2" style={{color: '#333333', letterSpacing: '0.02em'}}>{r.name}</h3>
            <p className="font-chinese text-sm xs:text-base font-medium" style={{color: '#CC824D'}}>{formatPrice(r.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;