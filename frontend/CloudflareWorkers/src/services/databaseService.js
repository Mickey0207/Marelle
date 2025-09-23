/**
 * 資料庫服務初始化
 * 管理資料庫連接和配置
 */

import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../../../backend/CloudflareWorkers/database/schema/index';

/**
 * 初始化資料庫連接
 */
export function initializeDatabase(env) {
  if (!env.DB) {
    throw new Error('Database binding not found');
  }
  
  return drizzle(env.DB, { schema });
}

/**
 * 導出資料庫 schema
 */
export { schema };