// Rich member orders/refunds mock matching UI fields

const pad = (n) => String(n).padStart(2, '0');
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const money = (n) => Math.max(0, n);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function makeOrderItem(idx) {
  const price = randInt(100, 3000);
  const qty = randInt(1, 3);
  return {
    sku: `SKU-${1000 + idx}`,
    name: pick(['經典帆布包','保溫杯','無線滑鼠','藍牙耳機','運動毛巾','筆記本']),
    image: `https://picsum.photos/seed/${1000 + idx}/80/80`,
    price,
    qty,
  };
}

function buildOrders(memberId) {
  const count = randInt(2, 7);
  return Array.from({ length: count }).map((_, i) => {
    const id = `${memberId}-ORD-${i + 1}`;
    const createdAt = new Date(Date.now() - i * 86400000);
    const created = `${createdAt.getFullYear()}-${pad(createdAt.getMonth() + 1)}-${pad(createdAt.getDate())}`;
    const itemCount = randInt(1, 4);
    const items = Array.from({ length: itemCount }).map((_, k) => makeOrderItem(i * 10 + k));
    const subtotal = items.reduce((s, it) => s + (it.price * it.qty), 0);
    const discount = randInt(0, Math.floor(subtotal * 0.2));
    const shipping = pick([0, 60, 90, 120]);
    const grandTotal = money(subtotal - discount + shipping);

    const order = {
      id,
      orderNo: `O${Date.now().toString().slice(-6)}-${i + 1}`,
      createdAt: created,
      status: pick(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      items,
      totals: { subtotal, discount, shipping, grandTotal },
      payment: { method: pick(['信用卡','Line Pay','貨到付款']), status: pick(['paid','unpaid','refunding']) },
      shipping: pick([ 
        { method: 'home', carrier: pick(['黑貓','新竹物流','郵局']), trackingNo: `TRK${randInt(100000,999999)}`, address: { postalCode: '100', city: '台北市', district: '中正區', streetAddress: '重慶南路一段 122 號' } },
        { method: 'cvs', carrier: '超商配', trackingNo: `CVS${randInt(100000,999999)}`, store: { id: String(randInt(100000,999999)), name: '站前門市', address: '台北市中正區忠孝西路一段 47 號' } }
      ]),
      invoice: { type: pick(['雲端發票','紙本']), number: `AB${randInt(10,99)}-${randInt(10000000,99999999)}`, carrier: '/ABCD1234', title: pick(['個人','美樂有限公司']), issuedAt: created, status: pick(['issued','void']) }
    };
    return order;
  });
}

function buildRefunds(memberId) {
  const count = randInt(0, 3);
  return Array.from({ length: count }).map((_, i) => {
    const id = `${memberId}-RF-${i + 1}`;
    const createdAt = new Date(Date.now() - i * 172800000);
    const created = `${createdAt.getFullYear()}-${pad(createdAt.getMonth() + 1)}-${pad(createdAt.getDate())}`;
    const subtotal = randInt(200, 2500);
    const shippingRefund = pick([0, 60, 90]);
    const totalRefund = money(subtotal + shippingRefund);
    return {
      id,
      refundNo: `R${Date.now().toString().slice(-6)}-${i + 1}`,
      createdAt: created,
      status: pick(['requested','approved','rejected','refunded']),
      amounts: { subtotal, shippingRefund, totalRefund },
      payment: { method: pick(['信用卡','Line Pay','ATM']), status: pick(['processing','refunded','failed']) },
      shippingReturn: pick([
        { method: 'home', carrier: pick(['黑貓','新竹物流']), trackingNo: `RTRK${randInt(100000,999999)}`, address: { postalCode: '100' } },
        { method: 'cvs', provider: '超商退貨', trackingNo: `RCVS${randInt(100000,999999)}`, storeId: String(randInt(100000,999999)), storeName: '站前門市' }
      ]),
      invoice: { type: '折讓', number: `CR${randInt(1000,9999)}-${randInt(100000,999999)}`, issuedAt: created, status: pick(['issued','void']) }
    };
  });
}

export default {
  async getOrdersByMember(memberId) {
    await new Promise(r => setTimeout(r, 60));
    return { success: true, data: buildOrders(memberId) };
  },
  async getRefundsByMember(memberId) {
    await new Promise(r => setTimeout(r, 60));
    return { success: true, data: buildRefunds(memberId) };
  }
}
