import apiClient from '../../clients/apiClient';

class OrderService {
  // 獲取訂單列表
  async getOrders(params = {}) {
    try {
      const response = await apiClient.get('/orders', params);
      return response;
    } catch (error) {
      console.warn('Using mock data for orders');
      return this.getMockOrders(params);
    }
  }

  // 獲取單個訂單
  async getOrder(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.warn('Using mock data for order');
      return this.getMockOrder(id);
    }
  }

  // 更新訂單狀態
  async updateOrderStatus(id, status, notes = '') {
    try {
      return await apiClient.patch(`/orders/${id}/status`, { status, notes });
    } catch (error) {
      console.warn('Mock update order status:', id, status);
      return { success: true };
    }
  }

  // 更新出貨狀態
  async updateShippingStatus(id, shippingStatus, trackingNumber = '') {
    try {
      return await apiClient.patch(`/orders/${id}/shipping`, { 
        shippingStatus, 
        trackingNumber 
      });
    } catch (error) {
      console.warn('Mock update shipping status:', id, shippingStatus);
      return { success: true };
    }
  }

  // 模擬訂單數據
  getMockOrders(params = {}) {
    const allOrders = [
      {
        id: 'ORD-001',
        customer: {
          name: '王小明',
          email: 'wang@example.com',
          phone: '0912-345-678'
        },
        items: [
          { name: '經典白T恤', sku: 'WT-001', quantity: 2, price: 899 },
          { name: '牛仔褲', sku: 'JP-002', quantity: 1, price: 1399 }
        ],
        total: 3197,
        status: 'completed',
        paymentStatus: 'paid',
        shippingStatus: 'delivered',
        createdAt: '2024-01-15 10:30',
        shippingAddress: '台北市信義區信義路五段7號'
      },
      {
        id: 'ORD-002',
        customer: {
          name: '李小華',
          email: 'li@example.com',
          phone: '0923-456-789'
        },
        items: [
          { name: '運動鞋', sku: 'SH-004', quantity: 1, price: 2599 }
        ],
        total: 2699,
        status: 'processing',
        paymentStatus: 'paid',
        shippingStatus: 'preparing',
        createdAt: '2024-01-15 09:15',
        shippingAddress: '台中市西屯區台中港路三段123號'
      },
      {
        id: 'ORD-003',
        customer: {
          name: '張小美',
          email: 'zhang@example.com',
          phone: '0934-567-890'
        },
        items: [
          { name: '連帽外套', sku: 'HO-003', quantity: 1, price: 1899 },
          { name: '皮革錢包', sku: 'WA-005', quantity: 1, price: 799 }
        ],
        total: 2798,
        status: 'pending',
        paymentStatus: 'pending',
        shippingStatus: 'pending',
        createdAt: '2024-01-15 08:45',
        shippingAddress: '高雄市前鎮區中華五路456號'
      }
    ];

    // 篩選邏輯
    let filteredOrders = allOrders;

    if (params.search) {
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(params.search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(params.search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params.status && params.status !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.status === params.status
      );
    }

    return {
      data: filteredOrders,
      total: filteredOrders.length,
      page: parseInt(params.page) || 1,
      limit: parseInt(params.limit) || 10
    };
  }

  getMockOrder(id) {
    const orders = this.getMockOrders().data;
    return orders.find(order => order.id === id) || null;
  }
}

// 創建單例實例
const orderService = new OrderService();

export default orderService;