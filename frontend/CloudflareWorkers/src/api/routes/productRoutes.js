/**
 * 商品相關路由處理
 * 處理商品列表、詳情、搜尋等功能
 */

import { eq, like, or } from 'drizzle-orm';
import { createDataResponse, createErrorResponse } from '../middleware/responseMiddleware.js';

/**
 * 取得商品列表
 */
export async function getProducts(db, schema, url) {
  try {
    const products = await db.select().from(schema.products)
      .where(eq(schema.products.status, 'active'));
    return createDataResponse(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return createErrorResponse('Failed to fetch products');
  }
}

/**
 * 取得單一商品詳情
 */
export async function getProductById(db, schema, productId) {
  try {
    const product = await db.select().from(schema.products)
      .where(eq(schema.products.id, productId))
      .limit(1);
    
    if (product.length === 0) {
      return createErrorResponse('Product not found', 404);
    }
    
    return createDataResponse(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return createErrorResponse('Failed to fetch product');
  }
}

/**
 * 搜尋商品
 */
export async function searchProducts(db, schema, url) {
  try {
    const searchParams = url.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryBuilder = db.select().from(schema.products)
      .where(eq(schema.products.status, 'active'));

    if (query) {
      queryBuilder = queryBuilder.where(
        or(
          like(schema.products.name, `%${query}%`),
          like(schema.products.description, `%${query}%`)
        )
      );
    }

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.where(eq(schema.products.category, category));
    }

    const products = await queryBuilder
      .limit(limit)
      .offset(offset);

    return createDataResponse(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return createErrorResponse('Failed to search products');
  }
}