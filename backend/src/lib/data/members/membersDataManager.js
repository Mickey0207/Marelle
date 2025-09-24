// 會員資料模擬數據與服務
import { v4 as uuidv4 } from 'uuid';

const defaultMembers = [
  {
    id: 1,
    memberNo: 'M000001',
    name: '張雅婷',
    email: 'zhang@example.com',
    phone: '0912345678',
    gender: '女',
    birthday: '1990-05-15',
    registerDate: '2023-01-15',
    lastLoginDate: '2024-09-15',
    level: 'VIP',
    totalSpent: 15800,
    points: 1580,
    orders: 12,
    status: 'active',
    tags: ['高價值客戶', '忠誠會員'],
    shippingAddresses: [
      {
        id: 'addr-' + Math.random().toString(36).slice(2),
        type: 'home',
        isDefault: true,
        contactName: '張雅婷',
        phone: '0912345678',
        postalCode: '100',
        city: '臺北市',
        district: '中正區',
        streetAddress: '重慶南路一段 122 號 5 樓'
      },
      {
        id: 'addr-' + Math.random().toString(36).slice(2),
        type: 'cvs',
        isDefault: false,
        provider: '7-ELEVEN',
        storeId: '123456',
        storeName: '博愛門市',
        storeAddress: '臺北市中正區重慶南路一段 50 號'
      }
    ]
  },
  {
    id: 2,
    memberNo: 'M000002',
    name: '李大明',
    email: 'li@example.com',
    phone: '0923456789',
    gender: '男',
    birthday: '1985-08-22',
    registerDate: '2023-03-20',
    lastLoginDate: '2024-09-14',
    level: '金卡',
    totalSpent: 8900,
    points: 890,
    orders: 7,
    status: 'active',
    tags: ['潛力客戶'],
    shippingAddresses: [
      {
        id: 'addr-' + Math.random().toString(36).slice(2),
        type: 'home',
        isDefault: true,
        contactName: '李大明',
        phone: '0923456789',
        postalCode: '220',
        city: '新北市',
        district: '板橋區',
        streetAddress: '文化路一段 100 巷 8 號 3 樓'
      }
    ]
  },
  {
    id: 3,
    memberNo: 'M000003',
    name: '王美華',
    email: 'wang@example.com',
    phone: '0934567890',
    gender: '女',
    birthday: '1992-12-03',
    registerDate: '2023-06-10',
    lastLoginDate: '2024-08-30',
    level: '銀卡',
    totalSpent: 3200,
    points: 320,
    orders: 3,
    status: 'inactive',
    tags: ['新會員'],
    shippingAddresses: []
  },
  {
    id: 4,
    memberNo: 'M000004',
    name: '陳志偉',
    email: 'chen@example.com',
    phone: '0945678901',
    gender: '男',
    birthday: '1988-04-18',
    registerDate: '2022-11-25',
    lastLoginDate: '2024-09-16',
    level: 'VIP',
    totalSpent: 25600,
    points: 2560,
    orders: 18,
    status: 'active',
    tags: ['高價值客戶', '推薦達人'],
    shippingAddresses: [
      {
        id: 'addr-' + Math.random().toString(36).slice(2),
        type: 'cvs',
        isDefault: true,
        provider: 'FAMILY_MART',
        storeId: 'F12345',
        storeName: '府前店',
        storeAddress: '臺南市中西區府前路一段 88 號'
      }
    ]
  }
];

class MembersDataManager {
  constructor() {
    const stored = localStorage.getItem('marelle_members');
    this.members = stored ? JSON.parse(stored) : defaultMembers;
    // 確保每個會員都有 shippingAddresses 欄位
    this.members = this.members.map(m => ({
      ...m,
      shippingAddresses: Array.isArray(m.shippingAddresses) ? m.shippingAddresses : []
    }));
  }

  persist() {
    localStorage.setItem('marelle_members', JSON.stringify(this.members));
  }

  async getMembers() {
    return { success: true, data: this.members };
  }

  // 取得指定會員的送貨地址
  async getShippingAddresses(memberId) {
    const member = this.members.find(m => m.id === Number(memberId) || m.memberNo === memberId);
    if (!member) return { success: false, error: '會員不存在' };
    return { success: true, data: member.shippingAddresses || [] };
  }

  // 新增送貨地址（宅配或超商）
  async addShippingAddress(memberId, address) {
    const member = this.members.find(m => m.id === Number(memberId) || m.memberNo === memberId);
    if (!member) return { success: false, error: '會員不存在' };

    const newAddress = {
      id: uuidv4(),
      isDefault: false,
      ...address,
    };

    // 如果此會員目前沒有地址，第一筆自動為預設
    if (!member.shippingAddresses || member.shippingAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    member.shippingAddresses = [...(member.shippingAddresses || []), newAddress];
    this.persist();
    return { success: true, data: newAddress };
  }

  // 更新送貨地址
  async updateShippingAddress(memberId, addressId, patch) {
    const member = this.members.find(m => m.id === Number(memberId) || m.memberNo === memberId);
    if (!member) return { success: false, error: '會員不存在' };
    const idx = (member.shippingAddresses || []).findIndex(a => a.id === addressId);
    if (idx === -1) return { success: false, error: '地址不存在' };
    member.shippingAddresses[idx] = { ...member.shippingAddresses[idx], ...patch };
    this.persist();
    return { success: true, data: member.shippingAddresses[idx] };
  }

  // 刪除送貨地址
  async deleteShippingAddress(memberId, addressId) {
    const member = this.members.find(m => m.id === Number(memberId) || m.memberNo === memberId);
    if (!member) return { success: false, error: '會員不存在' };
    const before = member.shippingAddresses?.length || 0;
    member.shippingAddresses = (member.shippingAddresses || []).filter(a => a.id !== addressId);
    if (member.shippingAddresses.length === before) return { success: false, error: '地址不存在' };
    // 確保至少有一筆設為預設
    if (member.shippingAddresses.length > 0 && !member.shippingAddresses.some(a => a.isDefault)) {
      member.shippingAddresses[0].isDefault = true;
    }
    this.persist();
    return { success: true };
  }

  // 設定預設送貨地址
  async setDefaultShippingAddress(memberId, addressId) {
    const member = this.members.find(m => m.id === Number(memberId) || m.memberNo === memberId);
    if (!member) return { success: false, error: '會員不存在' };
    if (!member.shippingAddresses?.some(a => a.id === addressId)) return { success: false, error: '地址不存在' };
    member.shippingAddresses = member.shippingAddresses.map(a => ({ ...a, isDefault: a.id === addressId }));
    this.persist();
    return { success: true };
  }
}

const membersDataManager = new MembersDataManager();
export default membersDataManager;
