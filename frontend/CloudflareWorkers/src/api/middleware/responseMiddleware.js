/**
 * HTTP 響應處理工具
 * 提供統一的響應格式和錯誤處理
 */

import { corsHeaders } from './corsMiddleware.js';

/**
 * 創建標準成功響應
 */
export function createSuccessResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

/**
 * 創建錯誤響應
 */
export function createErrorResponse(message, status = 500) {
  return createSuccessResponse({ error: message }, status);
}

/**
 * 創建資料響應 (包裝在 data 屬性中)
 */
export function createDataResponse(data, status = 200) {
  return createSuccessResponse({ data }, status);
}