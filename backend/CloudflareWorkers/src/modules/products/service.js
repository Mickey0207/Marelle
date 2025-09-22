import apiClient from '../../clients/apiClient';

class ProductService {
  // 獲取商品列表
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', params);
      return response;
    } catch (error) {
      // 如果 API 不可用，返回模擬數據
      console.warn('Using mock data for products');
      return this.getMockProducts(params);
    }
  }

  // 獲取單個商品
  async getProduct(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.warn('Using mock data for product');
      return this.getMockProduct(id);
    }
  }

  // 創建商品
  async createProduct(productData) {
    try {
      return await apiClient.post('/products', productData);
    } catch (error) {
      console.warn('Mock create product:', productData);
      return { success: true, id: Date.now(), ...productData };
    }
  }

  // 更新商品
  async updateProduct(id, productData) {
    try {
      return await apiClient.put(`/products/${id}`, productData);
    } catch (error) {
      console.warn('Mock update product:', id, productData);
      return { success: true, id, ...productData };
    }
  }

  // 刪除商品
  async deleteProduct(id) {
    try {
      return await apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.warn('Mock delete product:', id);
      return { success: true };
    }
  }

  // 上傳商品圖片
  async uploadProductImage(productId, file) {
    try {
      return await apiClient.upload(`/products/${productId}/image`, file);
    } catch (error) {
      console.warn('Mock upload image for product:', productId);
      return { success: true, imageUrl: '/api/placeholder/400/300' };
    }
  }

  // 模擬商品數據
  getMockProducts(params = {}) {
    const allProducts = [
      {
        id: 1,
        name: '經典白T恤',
        sku: 'WT-001',
        category: '上衣',
        price: 899,
        stock: 156,
        status: 'active',
        sales: 234,
        createdAt: '2024-01-10',
        description: '舒適的純棉白色T恤，適合日常穿著。',
        images: ['/api/placeholder/400/300']
      },
      {
        id: 2,
        name: '牛仔褲',
        sku: 'JP-002',
        category: '褲子',
        price: 1399,
        stock: 89,
        status: 'active',
        sales: 167,
        createdAt: '2024-01-08',
        description: '經典藍色牛仔褲，修身版型。',
        images: ['/api/placeholder/400/300']
      },
      {
        id: 3,
        name: '連帽外套',
        sku: 'HO-003',
        category: '外套',
        price: 1899,
        stock: 45,
        status: 'active',
        sales: 98,
        createdAt: '2024-01-05',
        description: '保暖舒適的連帽外套，適合秋冬穿著。',
        images: ['/api/placeholder/400/300']
      },
      {
        id: 4,
        name: '運動鞋',
        sku: 'SH-004',
        category: '鞋子',
        price: 2599,
        stock: 67,
        status: 'active',
        sales: 156,
        createdAt: '2024-01-03',
        description: '輕量化運動鞋，適合跑步和日常運動。',
        images: ['/api/placeholder/400/300']
      },
      {
        id: 5,
        name: '皮革錢包',
        sku: 'WA-005',
        category: '配件',
        price: 799,
        stock: 23,
        status: 'low_stock',
        sales: 89,
        createdAt: '2023-12-28',
        description: '真皮手工錢包，多個卡槽設計。',
        images: ['/api/placeholder/400/300']
      },
      {
        id: 6,
        name: '冬季大衣',
        sku: 'CO-006',
        category: '外套',
        price: 3299,
        stock: 0,
        status: 'out_of_stock',
        sales: 45,
        createdAt: '2023-12-20',
        description: '保暖防風大衣，適合嚴寒天氣。',
        images: ['/api/placeholder/400/300']
      }
    ];

    // 簡單的篩選邏輯
    let filteredProducts = allProducts;

    if (params.search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(params.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params.category && params.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category === params.category
      );
    }

    if (params.status && params.status !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.status === params.status
      );
    }

    return {
      data: filteredProducts,
      total: filteredProducts.length,
      page: parseInt(params.page) || 1,
      limit: parseInt(params.limit) || 10
    };
  }

  getMockProduct(id) {
    const products = this.getMockProducts().data;
    return products.find(product => product.id === parseInt(id)) || null;
  }
}

// 創建單例實例
const productService = new ProductService();

export default productService;