// Simple in-memory mock dataset for logistics orders, modeled after ECPay-like shape
const makeRow = (i) => {
  const types = [
    { LogisticsType: 'Home', LogisticsSubType: 'TCAT' },
    { LogisticsType: 'Home', LogisticsSubType: 'POST' },
    { LogisticsType: 'CVS', LogisticsSubType: 'UNIMART' },
    { LogisticsType: 'CVS', LogisticsSubType: 'FAMI' },
    { LogisticsType: 'CVS', LogisticsSubType: 'HILIFE' },
    { LogisticsType: 'CVS', LogisticsSubType: 'OKMART' },
  ];
  const t = types[i % types.length];
  const baseDate = Date.now() - i * 3600_000;
  return {
    MerchantID: '2000132',
    MerchantTradeNo: `T${(100000 + i).toString(36).toUpperCase()}`,
    TradeNo: `TN${300000 + i}`,
    TradeDate: new Date(baseDate - 86400_000).toISOString(),
    UpdateStatusDate: new Date(baseDate).toISOString(),
    RtnCode: i % 7 === 0 ? 0 : 1,
    RtnMsg: i % 7 === 0 ? '失敗' : '成功',
    LogisticsID: `L${400000 + i}`,
    AllPayLogisticsID: `AL${400000 + i}`,
    Status: (i % 6),
    LogisticsStatus: (i % 6),
    GoodsAmount: 100 + (i % 9) * 50,
    ReceiverName: `客戶${i + 1}`,
    ReceiverEmail: `user${i + 1}@example.com`,
    ReceiverCellPhone: `09${(10000000 + i).toString().slice(0, 8)}`,
    ReceiverPhone: `02-77${(300000 + i).toString().slice(0, 4)}`,
    SenderName: '瑪黑商店',
    SenderCellPhone: '02-00000000',
    SenderPhone: '02-00000000',
    ReceiverAddress: `台北市信義區松高路 ${i + 1} 號`,
    CVSStoreID: `S${(1000 + i)}`,
    CVSStoreName: ['松高門市', '信義門市', '市府門市'][i % 3],
    CVSAddress: `台北市信義區 ${['松高', '信義', '市府'][i % 3]} 路 100 號`,
    HandlingCharge: 60,
    CollectionAmount: (i % 2) ? 0 : 300 + (i % 5) * 50,
    CollectionChargeFee: (i % 2) ? 0 : 10,
    CollectionAllocateDate: new Date(baseDate + 86400_000).toISOString(),
    CollectionAllocateAmount: (i % 2) ? 0 : 300 + (i % 5) * 50,
    GoodsWeight: 1 + (i % 4) * 0.5,
    ActualWeight: 1 + (i % 4) * 0.6,
    ShipChargeDate: new Date(baseDate + 2 * 86400_000).toISOString(),
    BookingNote: `BN${500000 + i}`,
    ShipmentNo: `SP${600000 + i}`,
    CVSPaymentNo: (i % 3 === 0) ? `PM${700000 + i}` : '',
    ...t,
  };
};

const store = {
  rows: Array.from({ length: 40 }).map((_, i) => makeRow(i)),
  // a pointer to simulate progressive update
  cursor: 0,
};

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function queryLogisticsOrders(params = {}) {
  // params could be keyword/type/status in future; here we just return all
  await sleep(120);
  return { success: true, data: [...store.rows] };
}

async function refreshFromIndex(startIndex = 0) {
  // simulate that from index to index+1 gets updated status/time
  await sleep(80);
  const i = Math.max(0, Math.min(store.rows.length - 1, startIndex));
  const row = store.rows[i];
  if (row) {
    // bump status cyclically and update time
    const nextStatus = ((Number(row.Status) || 0) + 1) % 6;
    row.Status = nextStatus;
    row.LogisticsStatus = nextStatus;
    row.UpdateStatusDate = new Date().toISOString();
  }
  return { success: true, nextIndex: (i + 1) % store.rows.length };
}

async function updateOneAndNext(rowIndex = 0) {
  return refreshFromIndex(rowIndex);
}

const api = { queryLogisticsOrders, refreshFromIndex, updateOneAndNext };
export default api;

