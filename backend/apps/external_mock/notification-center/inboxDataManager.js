// 通知中心收件匣 Mock
// 提供多種來源的通知（order/payment/review/system），含狀態與嚴重度

const now = Date.now();

function genItem(i, type, severity = 'info', status = 'unread') {
  const sources = {
    order: '訂單系統',
    payment: '金流（ECPay）',
    review: '顧客評價',
    system: '系統監控'
  };
  const titles = {
    order: `訂單更新通知 #${2000 + i}`,
    payment: `付款狀態異動 #${3000 + i}`,
    review: `新評價通知（${(i % 5) + 1}★）`,
    system: severity === 'error' ? '系統告警：CPU 使用率偏高' : '排程任務完成'
  };
  return {
    id: `${type.toUpperCase()}-${i + 1}`,
    type,
    title: titles[type],
    source: sources[type],
    severity,
    status,
    receivedAt: new Date(now - i * 60 * 1000).toISOString(),
  };
}

// 預設資料池（固定順序以利穩定）
const inbox = [
  // 訂單通知
  ...Array.from({ length: 6 }, (_, i) => genItem(i, 'order', 'info', i % 3 === 0 ? 'unread' : i % 3 === 1 ? 'read' : 'resolved')),
  // 金流通知
  ...Array.from({ length: 5 }, (_, i) => genItem(i + 6, 'payment', i % 2 === 0 ? 'info' : 'error', i % 2 === 0 ? 'unread' : 'read')),
  // 評價通知
  ...Array.from({ length: 4 }, (_, i) => genItem(i + 11, 'review', 'info', i % 2 === 0 ? 'unread' : 'read')),
  // 系統通知（含 error）
  ...Array.from({ length: 5 }, (_, i) => genItem(i + 15, 'system', i % 3 === 0 ? 'error' : 'info', i % 3 === 0 ? 'unread' : 'read')),
];

export default {
  // 供頁面直接取得全部列表
  getAll() {
    return [...inbox];
  },

  // 依類型篩選（order/payment/review/system）
  getByType(type) {
    if (!type || type === 'all') return [...inbox];
    return inbox.filter(x => x.type === type);
  },

  // 舊有方法（仍保留相容）
  getOrdersInbox() {
    return inbox.filter(x => x.type === 'order');
  },
};
