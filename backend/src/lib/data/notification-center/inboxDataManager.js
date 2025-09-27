// 模擬 Notification Center（對內接收）的訊息資料
// 類型包含：order（訂單通知）、payment（金流供應商）、review（顧客評價）、system（系統事件）等

const defaultInbox = [
  {
    id: 'inbox-1',
    type: 'order',
    source: 'order-webhook',
    title: '訂單已付款',
    message: '訂單 #ORD-2024-101 完成付款，等待出貨',
    severity: 'info',
    status: 'unread',
    receivedAt: '2024-01-15T10:35:20Z',
    metadata: { orderNumber: 'ORD-2024-101', paymentId: 'pay_123' }
  },
  {
    id: 'inbox-2',
    type: 'payment',
    source: 'payment-gateway',
    title: '退款完成',
    message: '金流供應商通知：退款單 RF-2024-002 已完成',
    severity: 'info',
    status: 'read',
    receivedAt: '2024-01-15T09:12:10Z',
    metadata: { refundId: 'RF-2024-002', amount: 1280 }
  },
  {
    id: 'inbox-3',
    type: 'review',
    source: 'customer-feedback',
    title: '顧客評價：5 星',
    message: '商品「經典手提包」獲得 5 星好評：非常滿意！',
    severity: 'info',
    status: 'unread',
    receivedAt: '2024-01-15T11:25:00Z',
    metadata: { productSku: 'BAG-CL-001', rating: 5 }
  },
  {
    id: 'inbox-4',
    type: 'system',
    source: 'warehouse-service',
    title: '庫存同步失敗',
    message: '倉庫同步 API 回應 500 錯誤，請檢查服務狀態',
    severity: 'error',
    status: 'unread',
    receivedAt: '2024-01-15T08:59:40Z',
    metadata: { service: 'warehouse', code: 500 }
  },
  {
    id: 'inbox-5',
    type: 'order',
    source: 'order-webhook',
    title: '訂單已出貨',
    message: '訂單 #ORD-2024-099 已出貨，物流單號 TW1234567890',
    severity: 'info',
    status: 'read',
    receivedAt: '2024-01-14T16:45:33Z',
    metadata: { orderNumber: 'ORD-2024-099', trackingNumber: 'TW1234567890' }
  },
];

const inboxDataManager = {
  getAll: () => [...defaultInbox].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
  getByType: (type) => defaultInbox.filter(i => i.type === type).sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
};

export default inboxDataManager;
