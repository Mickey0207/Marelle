/**
 * 購物車相關路由處理
 * 處理購物車驗證和相關功能
 */

import { inArray } from 'drizzle-orm';
import { createDataResponse, createErrorResponse } from '../middleware/responseMiddleware.js';

/**
 * 驗證購物車商品
 * 檢查商品存在性、庫存和價格
 */
export async function validateCart(db, schema, request) {
  try {
    const body = await request.json();
    const { items } = body;
    
    if (!items || !Array.isArray(items)) {
      return createErrorResponse('Invalid cart items', 400);
    }
    
    const productIds = items.map(item => item.id);
    const products = await db.select().from(schema.products)
      .where(inArray(schema.products.id, productIds));
    
    // 驗證商品存在性和庫存
    const validatedItems = items.map(item => {
      const product = products.find(p => p.id === item.id);
      return {
        ...item,
        exists: !!product,
        inStock: product ? product.stock >= item.quantity : false,
        currentPrice: product?.price || 0,
        available: product?.status === 'active'
      };
    });

    return createDataResponse(validatedItems);
  } catch (error) {
    console.error('Error validating cart:', error);
    return createErrorResponse('Failed to validate cart');
  }
}