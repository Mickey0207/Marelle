/**
 * CORS 中間件
 * 處理跨域請求和預檢請求
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * 處理 CORS 預檢請求
 */
export function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * 檢查是否為預檢請求
 */
export function isPreflightRequest(request) {
  return request.method === 'OPTIONS';
}