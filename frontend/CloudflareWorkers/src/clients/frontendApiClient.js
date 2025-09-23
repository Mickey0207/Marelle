/**
 * 前台 API 客戶端
 * 提供與 Cloudflare Workers 通訊的統一介面
 */

/**
 * 基礎 HTTP 客戶端類
 */
class BaseAPIClient {
  constructor() {
    // 根據環境設定 API 基礎 URL
    this.baseURL = import.meta.env.VITE_WORKERS_URL || 'http://localhost:8787';
  }

  /**
   * 發送 HTTP 請求的通用方法
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

/**
 * 商品 API 客戶端
 */
class ProductAPIClient extends BaseAPIClient {
  // 取得所有商品
  async getAll(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/api/products?${searchParams}`);
  }

  // 取得單一商品
  async getById(id) {
    return this.request(`/api/products/${id}`);
  }

  // 搜尋商品
  async search(query, filters = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...filters,
    });
    return this.request(`/api/products/search?${searchParams}`);
  }
}

/**
 * 分類 API 客戶端
 */
class CategoryAPIClient extends BaseAPIClient {
  // 取得所有分類
  async getAll() {
    return this.request('/api/categories');
  }
}

/**
 * 購物車 API 客戶端
 */
class CartAPIClient extends BaseAPIClient {
  // 驗證購物車商品
  async validate(items) {
    return this.request('/api/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }
}

/**
 * 系統 API 客戶端
 */
class SystemAPIClient extends BaseAPIClient {
  // 健康檢查
  async health() {
    return this.request('/health');
  }
}

/**
 * 統一的 API 客戶端
 */
class FrontendAPIClient {
  constructor() {
    this.products = new ProductAPIClient();
    this.categories = new CategoryAPIClient();
    this.cart = new CartAPIClient();
    this.system = new SystemAPIClient();
  }
}

// 創建並導出單例實例
export default new FrontendAPIClient();