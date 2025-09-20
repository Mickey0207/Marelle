// 前台 API 配置
const API_BASE_URL = 'http://127.0.0.1:8787/api';

// API 端點
export const API_ENDPOINTS = {
  // 前台用戶相關
  FRONT_REGISTER: `${API_BASE_URL}/front/register`,
  FRONT_LOGIN: `${API_BASE_URL}/front/login`,
  FRONT_PROFILE: `${API_BASE_URL}/front/profile`,
  FRONT_ORDERS: `${API_BASE_URL}/front/orders`,
  
  // 產品相關
  PRODUCTS: `${API_BASE_URL}/products`,
  
  // 檔案上傳
  UPLOAD: `${API_BASE_URL}/upload`,
  FILE: `${API_BASE_URL}/file`,
};

// API 請求工具
export class FrontendAPI {
  static async request(url, options = {}) {
    const token = localStorage.getItem('userToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Network error');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 用戶註冊
  static async register(userData) {
    return this.request(API_ENDPOINTS.FRONT_REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 用戶登入
  static async login(credentials) {
    const result = await this.request(API_ENDPOINTS.FRONT_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (result.success && result.data.token) {
      localStorage.setItem('userToken', result.data.token);
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
    
    return result;
  }

  // 登出
  static logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }

  // 獲取用戶資料
  static async getProfile() {
    return this.request(API_ENDPOINTS.FRONT_PROFILE);
  }

  // 獲取用戶訂單
  static async getOrders() {
    return this.request(API_ENDPOINTS.FRONT_ORDERS);
  }

  // 獲取產品列表
  static async getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS);
  }

  // 檢查是否已登入
  static isAuthenticated() {
    return !!localStorage.getItem('userToken');
  }

  // 獲取當前用戶資料
  static getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}

export default FrontendAPI;