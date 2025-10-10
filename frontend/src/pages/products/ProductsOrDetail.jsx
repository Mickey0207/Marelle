import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Products from './Products.jsx';
import ProductDetail from './ProductDetail.jsx';
import { getProductByUrlKey } from '../../../external_mock/data/products.mock.js';

export default function ProductsOrDetail() {
  const location = useLocation();

  // 從萬用字元路徑中取最後一段，若符合 *-<id> 規則則視為商品詳情
  const productId = useMemo(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    // 期望格式：/products/.../<productSlug>-<id>
    if (parts[0] !== 'products') return null;
    const last = parts[parts.length - 1];
    const p = getProductByUrlKey(last);
    return p ? p.id : null;
  }, [location.pathname]);

  // 如果有 id 就渲染詳情，否則渲染列表
  if (productId) {
    return <ProductDetail fromNestedProducts />;
  }

  return <Products />;
}
