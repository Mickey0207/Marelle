// 模擬資料與資料存取：綠界物流查詢與狀態通知
// 依據官方文件：
// - 查詢物流訂單：https://developers.ecpay.com.tw/?p=10171
// - 物流狀態通知：https://developers.ecpay.com.tw/?p=10127

// 查詢物流訂單欄位模型（回應）
// 注意：實際 ECPay 會回傳字串與特定格式；此處以模擬資料為主。

const mockTrackingOrders = [
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '1234567',
    LogisticsID: '1234567',
    LogisticsType: 'Home',
    LogisticsSubType: 'TCAT',
    GoodsAmount: 1280,
    GoodsName: '示例商品A',
    Status: '300',
    LogisticsStatus: '300',
    TradeNo: '220000000001',
    MerchantTradeNo: 'M202509240001',
    UpdateStatusDate: '2025/09/24 10:23:45',
    TradeDate: '2025/09/23 09:12:34',
    HandlingCharge: 120,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '王小明',
    ReceiverPhone: '0912345678',
    ReceiverCellPhone: '0912345678',
    ReceiverEmail: 'user@example.com',
    ReceiverAddress: '台北市信義區市府路45號',
    SenderName: '商店出貨部',
    SenderPhone: '0223456789',
    SenderCellPhone: '0911222333',
    CVSStoreID: '',
    CVSStoreName: '',
    CVSAddress: '',
    CVSOutSide: '',
    CVSPaymentNo: '',
    CVSValidationNo: '',
    BookingNote: 'HOME托運單-ABC123456',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '2025/09/24',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654321',
    LogisticsID: '7654321',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMART',
    GoodsAmount: 560,
    GoodsName: '示例商品B',
    Status: '2063',
    LogisticsStatus: '2063',
    TradeNo: '220000000002',
    MerchantTradeNo: 'M202509240002',
    UpdateStatusDate: '2025/09/23 16:05:12',
    TradeDate: '2025/09/22 14:22:01',
    HandlingCharge: 60,
    CollectionAmount: 560,
    CollectionChargeFee: 10,
    ReceiverName: '陳小華',
    ReceiverPhone: '0223456789',
    ReceiverCellPhone: '0987654321',
    ReceiverEmail: 'test@example.com',
    ReceiverAddress: '',
    SenderName: '商店門市',
    SenderPhone: '022221111',
    SenderCellPhone: '0912000111',
    CVSStoreID: '1234',
    CVSStoreName: '台北市政府門市',
    CVSAddress: '台北市信義區信義路五段7號B1',
    CVSOutSide: 'OPENPOINT店外代碼',
    CVSPaymentNo: 'A123456789',
    CVSValidationNo: 'B987654321',
    BookingNote: '貨到付款',
    ShipmentNo: 'C2C-UNIMART-00001',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '2025/09/25',
    CollectionAllocateAmount: 550,
  },
  // CVS B2C - 7-11 到店後成功取件
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654322',
    LogisticsID: '7654322',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMART',
    GoodsAmount: 899,
    GoodsName: '7-11 B2C 商品',
    Status: '2067', // 成功取件
    LogisticsStatus: '2067',
    TradeNo: '220000000003',
    MerchantTradeNo: 'M202509240003',
    UpdateStatusDate: '2025/09/24 18:12:00',
    TradeDate: '2025/09/22 08:01:22',
    HandlingCharge: 65,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '林小姐',
    ReceiverPhone: '',
    ReceiverCellPhone: '0918111222',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '電商出貨',
    SenderPhone: '022200000',
    SenderCellPhone: '',
    CVSStoreID: '8888',
    CVSStoreName: '市府二門市',
    CVSAddress: '台北市信義區市府路1號',
    CVSOutSide: '',
    CVSPaymentNo: '', // B2C 用 ShipmentNo
    CVSValidationNo: '',
    BookingNote: '',
    ShipmentNo: 'B2C-UNIMART-99001',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS C2C - 7-11 七天未取件
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654323',
    LogisticsID: '7654323',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMARTC2C',
    GoodsAmount: 399,
    GoodsName: '7-11 C2C 商品',
    Status: '2074', // 七天未取件
    LogisticsStatus: '2074',
    TradeNo: '220000000004',
    MerchantTradeNo: 'M202509240004',
    UpdateStatusDate: '2025/09/24 20:15:00',
    TradeDate: '2025/09/20 12:00:00',
    HandlingCharge: 60,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '郭小明',
    ReceiverPhone: '',
    ReceiverCellPhone: '0915000111',
    ReceiverEmail: 'c2c@example.com',
    ReceiverAddress: '',
    SenderName: '賣家甲',
    SenderPhone: '',
    SenderCellPhone: '0912123123',
    CVSStoreID: '7001',
    CVSStoreName: '松仁門市',
    CVSAddress: '台北市信義區松仁路3號',
    CVSOutSide: '',
    CVSPaymentNo: '711-ABC123456',
    CVSValidationNo: '55',
    BookingNote: 'C2C',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS C2C - 7-11 二次進店（取件門市）
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654324',
    LogisticsID: '7654324',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMARTC2C',
    GoodsAmount: 499,
    GoodsName: '7-11 C2C 二次進店',
    Status: '2098',
    LogisticsStatus: '2098',
    TradeNo: '220000000005',
    MerchantTradeNo: 'M202509240005',
    UpdateStatusDate: '2025/09/24 21:05:00',
    TradeDate: '2025/09/21 09:00:00',
    HandlingCharge: 60,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '江小姐',
    ReceiverPhone: '',
    ReceiverCellPhone: '0916000222',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '賣家乙',
    SenderPhone: '',
    SenderCellPhone: '0966123123',
    CVSStoreID: '7002',
    CVSStoreName: '松壽門市',
    CVSAddress: '台北市信義區松壽路9號',
    CVSOutSide: '店外代碼示意',
    CVSPaymentNo: '711-DEF222333',
    CVSValidationNo: '99',
    BookingNote: 'C2C',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS C2C - 7-11 二次進店（寄件門市）
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654325',
    LogisticsID: '7654325',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMARTC2C',
    GoodsAmount: 299,
    GoodsName: '7-11 C2C 二次進店(寄件門市)',
    Status: '2099',
    LogisticsStatus: '2099',
    TradeNo: '220000000006',
    MerchantTradeNo: 'M202509240006',
    UpdateStatusDate: '2025/09/24 21:10:00',
    TradeDate: '2025/09/21 10:00:00',
    HandlingCharge: 60,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '趙先生',
    ReceiverPhone: '',
    ReceiverCellPhone: '0916111333',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '賣家丙',
    SenderPhone: '',
    SenderCellPhone: '0922123555',
    CVSStoreID: '7003',
    CVSStoreName: '松德門市',
    CVSAddress: '台北市信義區松德路88號',
    CVSOutSide: '',
    CVSPaymentNo: '711-GHI333444',
    CVSValidationNo: '01',
    BookingNote: 'C2C',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS B2C - 全家 B2C（ShipmentNo）
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654326',
    LogisticsID: '7654326',
    LogisticsType: 'CVS',
    LogisticsSubType: 'FAMI',
    GoodsAmount: 1200,
    GoodsName: '全家 B2C',
    Status: '3018', // 到店
    LogisticsStatus: '3018',
    TradeNo: '220000000007',
    MerchantTradeNo: 'M202509240007',
    UpdateStatusDate: '2025/09/24 11:00:00',
    TradeDate: '2025/09/22 10:10:10',
    HandlingCharge: 65,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '全家收件人',
    ReceiverPhone: '',
    ReceiverCellPhone: '0977000123',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '電商出貨',
    SenderPhone: '022222222',
    SenderCellPhone: '',
    CVSStoreID: 'F001',
    CVSStoreName: '全家信義店',
    CVSAddress: '台北市信義區忠孝東路五段8號',
    CVSOutSide: '',
    CVSPaymentNo: '',
    CVSValidationNo: '',
    BookingNote: '',
    ShipmentNo: 'B2C-FAMI-10001',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS C2C - 全家 C2C（CVSPaymentNo）
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654327',
    LogisticsID: '7654327',
    LogisticsType: 'CVS',
    LogisticsSubType: 'FAMIC2C',
    GoodsAmount: 780,
    GoodsName: '全家 C2C',
    Status: '3022', // 取件成功（等價流程）
    LogisticsStatus: '3022',
    TradeNo: '220000000008',
    MerchantTradeNo: 'M202509240008',
    UpdateStatusDate: '2025/09/24 15:45:00',
    TradeDate: '2025/09/22 11:22:33',
    HandlingCharge: 60,
    CollectionAmount: 780,
    CollectionChargeFee: 15,
    ReceiverName: '全家收件人2',
    ReceiverPhone: '',
    ReceiverCellPhone: '0966333555',
    ReceiverEmail: 'fami@example.com',
    ReceiverAddress: '',
    SenderName: '賣家丁',
    SenderPhone: '',
    SenderCellPhone: '0912000444',
    CVSStoreID: 'F002',
    CVSStoreName: '全家松仁店',
    CVSAddress: '台北市信義區松仁路9號',
    CVSOutSide: '',
    CVSPaymentNo: 'FAMI-444555666',
    CVSValidationNo: '',
    BookingNote: 'COD',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '2025/09/26',
    CollectionAllocateAmount: 765,
  },
  // CVS B2C - 萊爾富
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654328',
    LogisticsID: '7654328',
    LogisticsType: 'CVS',
    LogisticsSubType: 'HILIFE',
    GoodsAmount: 999,
    GoodsName: '萊爾富 B2C',
    Status: '3018',
    LogisticsStatus: '3018',
    TradeNo: '220000000009',
    MerchantTradeNo: 'M202509240009',
    UpdateStatusDate: '2025/09/24 09:30:00',
    TradeDate: '2025/09/21 18:30:00',
    HandlingCharge: 65,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '萊爾富收件人',
    ReceiverPhone: '',
    ReceiverCellPhone: '0955111222',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '電商出貨',
    SenderPhone: '',
    SenderCellPhone: '',
    CVSStoreID: 'HL01',
    CVSStoreName: '萊爾富信義店',
    CVSAddress: '台北市信義區松仁路100號',
    CVSOutSide: '',
    CVSPaymentNo: '',
    CVSValidationNo: '',
    BookingNote: '',
    ShipmentNo: 'B2C-HILIFE-10001',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS C2C - 萊爾富
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654329',
    LogisticsID: '7654329',
    LogisticsType: 'CVS',
    LogisticsSubType: 'HILIFEC2C',
    GoodsAmount: 420,
    GoodsName: '萊爾富 C2C',
    Status: '3020', // 未取
    LogisticsStatus: '3020',
    TradeNo: '220000000010',
    MerchantTradeNo: 'M202509240010',
    UpdateStatusDate: '2025/09/24 13:15:00',
    TradeDate: '2025/09/21 12:05:00',
    HandlingCharge: 60,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: 'HL C2C 收件',
    ReceiverPhone: '',
    ReceiverCellPhone: '0955000555',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '賣家戊',
    SenderPhone: '',
    SenderCellPhone: '0912555666',
    CVSStoreID: 'HL02',
    CVSStoreName: '萊爾富松德店',
    CVSAddress: '台北市信義區松德路10號',
    CVSOutSide: '',
    CVSPaymentNo: 'HL-1122334455',
    CVSValidationNo: '',
    BookingNote: '',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS B2C - OK 超商
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654330',
    LogisticsID: '7654330',
    LogisticsType: 'CVS',
    LogisticsSubType: 'OKMART',
    GoodsAmount: 288,
    GoodsName: 'OK B2C',
    Status: '3018',
    LogisticsStatus: '3018',
    TradeNo: '220000000011',
    MerchantTradeNo: 'M202509240011',
    UpdateStatusDate: '2025/09/24 07:20:00',
    TradeDate: '2025/09/21 07:20:00',
    HandlingCharge: 65,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: 'OK收件',
    ReceiverPhone: '',
    ReceiverCellPhone: '0933777888',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '電商出貨',
    SenderPhone: '',
    SenderCellPhone: '',
    CVSStoreID: 'OK01',
    CVSStoreName: 'OK信義店',
    CVSAddress: '台北市信義區松仁路88號',
    CVSOutSide: '',
    CVSPaymentNo: '',
    CVSValidationNo: '',
    BookingNote: '',
    ShipmentNo: 'B2C-OKMART-88888',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // CVS C2C - OK 超商
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '7654331',
    LogisticsID: '7654331',
    LogisticsType: 'CVS',
    LogisticsSubType: 'OKMARTC2C',
    GoodsAmount: 350,
    GoodsName: 'OK C2C',
    Status: '3022',
    LogisticsStatus: '3022',
    TradeNo: '220000000012',
    MerchantTradeNo: 'M202509240012',
    UpdateStatusDate: '2025/09/24 08:00:00',
    TradeDate: '2025/09/21 08:00:00',
    HandlingCharge: 60,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: 'OKC2C 收件',
    ReceiverPhone: '',
    ReceiverCellPhone: '0933555666',
    ReceiverEmail: '',
    ReceiverAddress: '',
    SenderName: '賣家己',
    SenderPhone: '',
    SenderCellPhone: '0912333444',
    CVSStoreID: 'OK02',
    CVSStoreName: 'OK松德店',
    CVSAddress: '台北市信義區松德路99號',
    CVSOutSide: '',
    CVSPaymentNo: 'OK-5566778899',
    CVSValidationNo: '',
    BookingNote: '',
    ShipmentNo: '',
    GoodsWeight: '',
    ActualWeight: '',
    ShipChargeDate: '',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  },
  // HOME - 中華郵政（重量欄位）
  {
    MerchantID: '2000132',
    RtnCode: 1,
    RtnMsg: '成功',
    AllPayLogisticsID: '1234568',
    LogisticsID: '1234568',
    LogisticsType: 'Home',
    LogisticsSubType: 'POST',
    GoodsAmount: 1500,
    GoodsName: '宅配-郵局',
    Status: '3024', // 已送至物流中心
    LogisticsStatus: '3024',
    TradeNo: '220000000013',
    MerchantTradeNo: 'M202509240013',
    UpdateStatusDate: '2025/09/24 12:34:56',
    TradeDate: '2025/09/22 12:00:00',
    HandlingCharge: 150,
    CollectionAmount: 0,
    CollectionChargeFee: 0,
    ReceiverName: '張先生',
    ReceiverPhone: '0222111999',
    ReceiverCellPhone: '',
    ReceiverEmail: 'post@example.com',
    ReceiverAddress: '新北市板橋區文化路一段1號',
    SenderName: '商店出貨部',
    SenderPhone: '0223456789',
    SenderCellPhone: '',
    CVSStoreID: '',
    CVSStoreName: '',
    CVSAddress: '',
    CVSOutSide: '',
    CVSPaymentNo: '',
    CVSValidationNo: '',
    BookingNote: '郵局托運單-POST0001',
    ShipmentNo: '',
    GoodsWeight: 9.876,
    ActualWeight: 10.123,
    ShipChargeDate: '2025/09/25',
    CollectionAllocateDate: '',
    CollectionAllocateAmount: 0,
  }
];

// 匯入完整狀態碼對照（由 scripts/generateLogisticsStatus.js 產出）
// 使用靜態匯入以避免生產建置時的 top-level await 問題
import generatedStatusJson from './logistics_status.json';
const generatedStatus = (generatedStatusJson && generatedStatusJson.flat)
  ? generatedStatusJson
  : { flat: {}, detailed: {} };

// 內建少量 fallback 狀態碼，若 JSON 尚未生成可先顯示
const FALLBACK_STATUS = {
  '300': '已取件/已收件',
  '2063': '門市已到店',
  '2098': '新增貨態',
  '3123': '新增貨態',
};

export const ECPAY_STATUS_MAP = {
  ...FALLBACK_STATUS,
  ...(generatedStatus.flat || {}),
};

// 以 LogisticsType/SubType 嘗試更精準對照，否則退回扁平表
export function mapStatusToText(code, type, subType) {
  const c = String(code || '').trim();
  if (!c) return '';
  const t = String(type || '').toUpperCase();
  const s = String(subType || '').toUpperCase();
  const detailed = generatedStatus.detailed || {};
  const typeMap = detailed[t];
  const subMap = typeMap ? typeMap[s] : null;
  return (subMap && subMap[c]) || ECPAY_STATUS_MAP[c] || '';
}

// 物流狀態通知（推播）資料模型（模擬）
const mockLogisticsNotifications = [
  {
    id: 'LN-0001',
    AllPayLogisticsID: '1234567',
    RtnCode: 300,
    RtnMsg: '已收件',
    LogisticsType: 'Home',
    LogisticsSubType: 'TCAT',
    UpdateStatusDate: '2025/09/24 10:23:45',
    ReceiverName: '王小明',
    BookingNote: '',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240001',
      CheckMacValue: 'MOCKED',
    }
  },
  {
    id: 'LN-0002',
    AllPayLogisticsID: '7654321',
    RtnCode: 2063,
    RtnMsg: '門市已到店',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMART',
    UpdateStatusDate: '2025/09/23 16:05:12',
    ReceiverName: '陳小華',
    BookingNote: '貨到付款',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240002',
      CheckMacValue: 'MOCKED',
    }
  },
  // 7-11 取件成功
  {
    id: 'LN-0003',
    AllPayLogisticsID: '7654322',
    RtnCode: 2067,
    RtnMsg: '消費者成功取件',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMART',
    UpdateStatusDate: '2025/09/24 18:12:10',
    ReceiverName: '林小姐',
    BookingNote: '',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240003',
      CheckMacValue: 'MOCKED'
    }
  },
  // 7-11 七天未取
  {
    id: 'LN-0004',
    AllPayLogisticsID: '7654323',
    RtnCode: 2074,
    RtnMsg: '七天未取件',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMARTC2C',
    UpdateStatusDate: '2025/09/24 20:15:10',
    ReceiverName: '郭小明',
    BookingNote: 'C2C',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240004',
      CheckMacValue: 'MOCKED'
    }
  },
  // 二次進店（取件門市）
  {
    id: 'LN-0005',
    AllPayLogisticsID: '7654324',
    RtnCode: 2098,
    RtnMsg: '包裹重新配達取件門市',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMARTC2C',
    UpdateStatusDate: '2025/09/24 21:05:10',
    ReceiverName: '江小姐',
    BookingNote: 'C2C',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240005',
      CheckMacValue: 'MOCKED'
    }
  },
  // 二次進店（寄件門市）
  {
    id: 'LN-0006',
    AllPayLogisticsID: '7654325',
    RtnCode: 2099,
    RtnMsg: '包裹重新配達寄件門市',
    LogisticsType: 'CVS',
    LogisticsSubType: 'UNIMARTC2C',
    UpdateStatusDate: '2025/09/24 21:10:10',
    ReceiverName: '趙先生',
    BookingNote: 'C2C',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240006',
      CheckMacValue: 'MOCKED'
    }
  },
  // 全家 C2C 取件成功（等價狀態）
  {
    id: 'LN-0007',
    AllPayLogisticsID: '7654327',
    RtnCode: 3022,
    RtnMsg: '消費者成功取件',
    LogisticsType: 'CVS',
    LogisticsSubType: 'FAMIC2C',
    UpdateStatusDate: '2025/09/24 15:45:10',
    ReceiverName: '全家收件人2',
    BookingNote: 'COD',
    raw: {
      MerchantID: '2000132',
      MerchantTradeNo: 'M202509240008',
      CheckMacValue: 'MOCKED'
    }
  }
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const logisticsDataManager = {
  // 查詢物流訂單（模擬）
  async queryLogisticsOrders(params = {}) {
    await delay(300);
    // 支援以 MerchantTradeNo 或 AllPayLogisticsID 篩選
    const { MerchantTradeNo, AllPayLogisticsID } = params;
    let data = mockTrackingOrders;
    if (MerchantTradeNo) {
      data = data.filter((o) => o.MerchantTradeNo.includes(MerchantTradeNo));
    }
    if (AllPayLogisticsID) {
      data = data.filter((o) => o.AllPayLogisticsID.includes(AllPayLogisticsID));
    }
    return { success: true, data };
  },

  // 取得單筆物流訂單
  async getLogisticsOrder(idOrTradeNo) {
    await delay(200);
    const data = mockTrackingOrders.find(
      (o) => o.AllPayLogisticsID === idOrTradeNo || o.MerchantTradeNo === idOrTradeNo
    );
    return { success: !!data, data };
  },

  // 狀態通知列表
  async getNotifications() {
    await delay(200);
    return { success: true, data: mockLogisticsNotifications };
  },

  // 讀取單筆通知
  async getNotification(id) {
    await delay(150);
    const data = mockLogisticsNotifications.find((n) => n.id === id);
    return { success: !!data, data };
  },

  // 標記通知為已處理
  async acknowledgeNotification(id) {
    await delay(120);
    return { success: true };
  },

  // ===== 模擬：循環更新 =====
  // 假裝呼叫綠界從 latestIndex 開始更新到最後一筆，然後回傳下次起點（若已到最後，回到 0）
  async refreshFromIndex(latestIndex = 0) {
    await delay(300);
    const total = mockTrackingOrders.length;
    if (total === 0) return { success: true, nextIndex: 0, updated: [] };
    const updated = [];
    for (let i = latestIndex; i < total; i++) {
      // 模擬：把每筆 Status 在 fallback/flat map 中找不到時保留，找得到時保持不變；也可以隨機切換一個合理狀態
      const row = mockTrackingOrders[i];
      // 範例：若為 Home/TCAT 且狀態 300，改為 3123 表示新增貨態
      if (row.LogisticsType === 'Home' && row.LogisticsSubType === 'TCAT' && String(row.Status) === '300') {
        row.Status = '3123';
        row.LogisticsStatus = row.Status;
        row.UpdateStatusDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      updated.push({ ...row });
    }
    return { success: true, nextIndex: 0, updated };
  },

  // 單筆更新，並回傳下一筆索引（i+1；若最後一筆則回 0）
  async updateOneAndNext(index = 0) {
    await delay(200);
    const total = mockTrackingOrders.length;
    if (total === 0) return { success: true, nextIndex: 0, updated: null };
    const i = Math.max(0, Math.min(index, total - 1));
    const row = mockTrackingOrders[i];
    // 簡單模擬：切換一個不同狀態碼
    row.Status = String(row.Status) === '300' ? '3123' : '300';
    row.LogisticsStatus = row.Status;
    row.UpdateStatusDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const nextIndex = i + 1 < total ? i + 1 : 0;
    return { success: true, nextIndex, updated: { ...row } };
  },

  // 逆物流通知（模擬）
  async getReverseNotifications() {
    await delay(200);
    // 以一般通知複製幾筆，改個型態當作逆物流
    const data = mockLogisticsNotifications.map((n, idx) => ({
      ...n,
      id: `RLN-${String(idx + 1).padStart(4, '0')}`,
      RtnMsg: `逆物流-${n.RtnMsg}`,
    }));
    return { success: true, data };
  },
};

export default logisticsDataManager;
