/**
 * API 路由配置和分發器
 * 統一管理所有路由規則
 */

import { getProducts, getProductById, searchProducts } from './routes/productRoutes.js';
import { getCategories } from './routes/categoryRoutes.js';
import { validateCart } from './routes/cartRoutes.js';
import { healthCheck } from './routes/systemRoutes.js';

/**
 * 創建路由處理器
 */
export function createRouter(db, schema, env) {
  return {
    // 商品相關路由
    'GET /api/products': () => getProducts(db, schema),
    'GET /api/products/:id': (url) => {
      const productId = url.pathname.split('/').pop();
      return getProductById(db, schema, productId);
    },
    'GET /api/products/search': (url) => searchProducts(db, schema, url),

    // 分類相關路由
    'GET /api/categories': () => getCategories(db, schema),

    // 購物車相關路由
    'POST /api/cart/validate': (url, request) => validateCart(db, schema, request),

    // 系統相關路由
    'GET /health': () => healthCheck(env),
    'GET /api/health': () => healthCheck(env),
  };
}

/**
 * 路由匹配和執行
 */
export async function executeRoute(router, method, url, request) {
  const path = url.pathname;
  const routeKey = `${method} ${path}`;
  
  // 嘗試精確匹配
  let handler = router[routeKey];
  
  // 如果沒有精確匹配，嘗試動態路由匹配
  if (!handler) {
    const dynamicRouteKey = `${method} ${path.replace(/\/[^\/]+$/, '/:id')}`;
    handler = router[dynamicRouteKey];
  }
  
  if (handler) {
    return await handler(url, request);
  }
  
  return null; // 未找到路由
}