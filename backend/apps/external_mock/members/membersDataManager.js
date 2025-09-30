// Minimal members mock

const _members = Array.from({ length: 20 }).map((_, i) => ({
  id: `MBR-${100 + i}`,
  memberNo: `M-${100 + i}`,
  name: ['王小明','李小美','陳大文','林靜怡','張雅婷'][i % 5],
  email: `user${i}@example.com`,
  phone: `09${String(10000000 + i).slice(0,8)}`,
  level: ['一般','金卡','銀卡','VIP'][i % 4],
  status: i % 3 === 0 ? 'inactive' : 'active',
  totalOrders: Math.floor(Math.random()*20),
  totalSpent: Math.floor(Math.random()*50000),
}))

export default {
  async getMembers() {
    await new Promise(r => setTimeout(r, 80))
    return { success: true, data: [..._members] }
  }
}
