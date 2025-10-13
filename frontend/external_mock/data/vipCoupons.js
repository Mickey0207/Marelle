// VIP 專區 - 優惠劵 mock 資料
// 注意：此為前端臨時模擬資料，未來請改為後端 API 回傳

export const vipCoupons = [
  {
    id: 'c1',
    title: '新會員 9 折券',
    desc: '全站適用，最高折抵 NT$ 300',
    code: 'WELCOME10',
    expire: '2025-12-31',
    note: '單筆滿 NT$ 800 可用，部分特價品除外',
  },
  {
    id: 'c2',
    title: '滿 1,500 折 200',
    desc: '指定品類適用',
    code: 'SAVE200',
    expire: '2025-11-30',
    note: '單筆滿 NT$ 1,500 可用；不可與其他折扣疊加',
  },
  {
    id: 'c3',
    title: '免運券',
    desc: '常溫配送免運乙次',
    code: 'FREESHIP',
    expire: '2025-10-31',
    note: '限台灣本島，離島/外島不適用',
  },
];
