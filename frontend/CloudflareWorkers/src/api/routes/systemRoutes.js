/**
 * 系統相關路由處理
 * 處理健康檢查和系統狀態
 */

import { createDataResponse } from '../middleware/responseMiddleware.js';

/**
 * 健康檢查端點
 */
export async function healthCheck(env) {
  return createDataResponse({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT || 'development',
    service: 'frontend-workers'
  });
}