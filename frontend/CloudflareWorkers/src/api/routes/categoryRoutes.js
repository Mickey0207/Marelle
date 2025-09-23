/**
 * 商品分類相關路由處理
 * 處理分類列表和分類相關功能
 */

import { eq } from 'drizzle-orm';
import { createDataResponse, createErrorResponse } from '../middleware/responseMiddleware.js';

/**
 * 取得商品分類列表
 */
export async function getCategories(db, schema) {
  try {
    const categories = await db.select({
      category: schema.products.category
    })
    .from(schema.products)
    .where(eq(schema.products.status, 'active'))
    .groupBy(schema.products.category);

    return createDataResponse(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return createErrorResponse('Failed to fetch categories');
  }
}