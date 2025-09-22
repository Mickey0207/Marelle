import apiClient from '../../clients/apiClient';

class CustomerService {
  // 獲取客戶列表
  async getCustomers(params = {}) {
    try {
      const response = await apiClient.get('/customers', params);
      return response;
    } catch (error) {
      console.warn('Using mock data for customers');
      return this.getMockCustomers(params);
    }
  }

  // 獲取單個客戶
  async getCustomer(id) {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response;
    } catch (error) {
      console.warn('Using mock data for customer');
      return this.getMockCustomer(id);
    }
  }

  // 更新客戶資訊
  async updateCustomer(id, customerData) {
    try {
      return await apiClient.put(`/customers/${id}`, customerData);
    } catch (error) {
      console.warn('Mock update customer:', id, customerData);
      return { success: true };
    }
  }

  // 添加客戶備註
  async addCustomerNote(id, note) {
    try {
      return await apiClient.post(`/customers/${id}/notes`, { note });
    } catch (error) {
      console.warn('Mock add customer note:', id, note);
      return { success: true };
    }
  }

  // 模擬客戶數據
  getMockCustomers(params = {}) {
    const allCustomers = [
      {
        id: 1,
        name: '王小明',
        email: 'wang@example.com',
        phone: '0912-345-678',
        address: '台北市信義區信義路五段7號',
        totalOrders: 15,
        totalSpent: 25890,
        lastOrderDate: '2024-01-15',
        status: 'vip',
        registeredAt: '2023-06-15',
        notes: ['優質客戶，經常購買，對品質要求高']
      },
      {
        id: 2,
        name: '李小華',
        email: 'li@example.com',
        phone: '0923-456-789',
        address: '台中市西屯區台中港路三段123號',
        totalOrders: 8,
        totalSpent: 12350,
        lastOrderDate: '2024-01-10',
        status: 'active',
        registeredAt: '2023-08-22',
        notes: []
      },
      {
        id: 3,
        name: '張小美',
        email: 'zhang@example.com',
        phone: '0934-567-890',
        address: '高雄市前鎮區中華五路456號',
        totalOrders: 22,
        totalSpent: 45670,
        lastOrderDate: '2024-01-12',
        status: 'vip',
        registeredAt: '2023-03-10',
        notes: ['VIP客戶，偏好高端商品']
      },
      {
        id: 4,
        name: '陳小強',
        email: 'chen@example.com',
        phone: '0945-678-901',
        address: '桃園市中壢區中正路789號',
        totalOrders: 3,
        totalSpent: 2890,
        lastOrderDate: '2023-12-20',
        status: 'inactive',
        registeredAt: '2023-11-05',
        notes: []
      },
      {
        id: 5,
        name: '林小雨',
        email: 'lin@example.com',
        phone: '0956-789-012',
        address: '台南市東區東門路321號',
        totalOrders: 12,
        totalSpent: 18990,
        lastOrderDate: '2024-01-08',
        status: 'active',
        registeredAt: '2023-07-18',
        notes: []
      }
    ];

    // 篩選邏輯
    let filteredCustomers = allCustomers;

    if (params.search) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(params.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(params.search.toLowerCase()) ||
        customer.phone.includes(params.search)
      );
    }

    if (params.status && params.status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.status === params.status
      );
    }

    return {
      data: filteredCustomers,
      total: filteredCustomers.length,
      page: parseInt(params.page) || 1,
      limit: parseInt(params.limit) || 10
    };
  }

  getMockCustomer(id) {
    const customers = this.getMockCustomers().data;
    return customers.find(customer => customer.id === parseInt(id)) || null;
  }
}

// 創建單例實例
const customerService = new CustomerService();

export default customerService;