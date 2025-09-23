/**
 * 前台 Cloudflare Worker 主入口
 * 統一處理請求分發和錯誤處理
 */

import { handleCORS, isPreflightRequest } from './api/middleware/corsMiddleware.js';
import { createErrorResponse } from './api/middleware/responseMiddleware.js';
import { createRouter, executeRoute } from './api/apiRouter.js';
import { initializeDatabase, schema } from './services/databaseService.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // 處理 CORS 預檢請求
      if (isPreflightRequest(request)) {
        return handleCORS();
      }

      // 初始化資料庫連接
      const db = initializeDatabase(env);
      
      // 解析請求
      const url = new URL(request.url);
      const method = request.method;

      // 創建路由處理器
      const router = createRouter(db, schema, env);

      // 執行路由
      const response = await executeRoute(router, method, url, request);
      
      if (response) {
        return response;
      }

      // 404 處理
      return createErrorResponse('Route not found', 404);

    } catch (error) {
      console.error('Worker error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  },
};