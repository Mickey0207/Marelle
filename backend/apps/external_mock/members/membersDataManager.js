// Rich members mock with all fields required by MemberManagement

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pad = (n) => String(n).padStart(2, '0');
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const makeDate = (offsetDays = 0) => {
  const d = new Date(Date.now() - offsetDays * 86400000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

let addressSeq = 1;
const makeHomeAddress = (overrides = {}) => ({
  id: `ADDR-H-${addressSeq++}`,
  type: 'home',
  contactName: '王小明',
  phone: `09${randInt(10000000, 99999999)}`,
  postalCode: String(randInt(100, 999)),
  city: randomPick(['台北市','新北市','桃園市','台中市','台南市','高雄市']),
  district: randomPick(['中正區','大安區','信義區','板橋區','新店區','三重區']),
  streetAddress: `${randInt(1, 300)} 號 ${randomPick(['1F','2F','3F','5F','7F'])}`,
  isDefault: false,
  ...overrides,
});

const makeCvsAddress = (overrides = {}) => ({
  id: `ADDR-C-${addressSeq++}`,
  type: 'cvs',
  provider: randomPick(['7-ELEVEN','全家 FamilyMart','萊爾富 Hi-Life','OK mart']),
  storeId: String(randInt(100000, 999999)),
  storeName: randomPick(['站前門市','市府門市','西門門市','南港門市','中壢門市']),
  storeAddress: `${randomPick(['台北市','新北市','桃園市'])}${randomPick(['信義區','中正區','板橋區'])}${randInt(1, 300)} 號`,
  isDefault: false,
  ...overrides,
});

const _members = Array.from({ length: 20 }).map((_, i) => {
  const id = `MBR-${100 + i}`;
  const orders = randInt(1, 25);
  const points = randInt(0, 5000);
  const base = {
    id,
    memberNo: `M-${100 + i}`,
    name: ['王小明','李小美','陳大文','林靜怡','張雅婷'][i % 5],
    email: `user${i}@example.com`,
    phone: `09${String(10000000 + i).slice(0,8)}`,
    level: ['一般','金卡','銀卡','VIP'][i % 4],
    status: i % 3 === 0 ? 'inactive' : 'active',
    orders,
    totalOrders: orders,
    totalSpent: randInt(1000, 120000),
    points,
    // 基本資料（詳情頁）
    gender: i % 2 === 0 ? '男' : '女',
    birthday: `${randInt(1978, 2002)}-${pad(randInt(1, 12))}-${pad(randInt(1, 28))}`,
    registerDate: makeDate(randInt(200, 1200)),
    lastLoginDate: makeDate(randInt(0, 30)),
    tags: Array.from({ length: randInt(1, 3) }).map(() => randomPick(['高價值','常客','黑名單','社群來客','廣告轉化'])),
  };

  // 地址（至少各一）
  const homeDefault = makeHomeAddress({ contactName: base.name, isDefault: true });
  const cvsDefault = makeCvsAddress({ isDefault: false });
  return {
    ...base,
    shippingAddresses: [homeDefault, cvsDefault],
  };
});

function findMember(memberId) {
  return _members.find(m => m.id === memberId);
}

export default {
  async getMembers() {
    await new Promise(r => setTimeout(r, 80));
    return { success: true, data: [..._members] };
  },

  async getMemberById(memberId) {
    await new Promise(r => setTimeout(r, 50));
    const m = findMember(memberId);
    return m ? { success: true, data: { ...m } } : { success: false, message: 'not found' };
  },

  async updateMember(memberId, payload) {
    const m = findMember(memberId);
    if (!m) return { success: false, message: 'not found' };
    const allowed = ['name','email','phone','gender','birthday','level','status','tags','points'];
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(payload, k)) {
        m[k] = payload[k];
      }
    }
    await new Promise(r => setTimeout(r, 60));
    return { success: true, data: { ...m } };
  },

  async addShippingAddress(memberId, payload) {
    const m = findMember(memberId);
    if (!m) return { success: false, message: 'member not found' };
    const type = payload?.type;
    if (type !== 'home' && type !== 'cvs') return { success: false, message: 'invalid type' };
    const addr = type === 'home' ? makeHomeAddress({ ...payload }) : makeCvsAddress({ ...payload });
    // 清理：避免外部傳入的 id/type 覆寫
    addr.id = addr.id;
    addr.type = type;
    // 若設為預設，取消同類型其他預設
    if (addr.isDefault) {
      (m.shippingAddresses || []).forEach(a => { if (a.type === type) a.isDefault = false; });
    }
    m.shippingAddresses = [...(m.shippingAddresses || []), addr];
    await new Promise(r => setTimeout(r, 50));
    return { success: true, data: addr };
  },

  async setDefaultShippingAddress(memberId, addressId) {
    const m = findMember(memberId);
    if (!m) return { success: false };
    const addr = (m.shippingAddresses || []).find(a => a.id === addressId);
    if (!addr) return { success: false };
    const type = addr.type;
    (m.shippingAddresses || []).forEach(a => {
      if (a.type === type) a.isDefault = (a.id === addressId);
    });
    await new Promise(r => setTimeout(r, 40));
    return { success: true };
  },

  async deleteShippingAddress(memberId, addressId) {
    const m = findMember(memberId);
    if (!m) return { success: false };
    m.shippingAddresses = (m.shippingAddresses || []).filter(a => a.id !== addressId);
    await new Promise(r => setTimeout(r, 40));
    return { success: true };
  },
}
