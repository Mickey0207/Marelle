// 綠界無卡分期（Cardless Installments）Mock
// 提供 getList() 以符合頁面使用的欄位
const now = Date.now();

const sampleCI = Array.from({ length: 12 }).map((_, i) => {
	const succeed = i % 4 !== 0; // 多數成功
	const amount = (Math.floor((i * 41) % 3000) + 500);
	const installments = [3, 6, 12][i % 3];
	const tradeDate = new Date(now - i * 2 * 3_600_000).toISOString(); // 每筆往前 2 小時
	return {
		id: `CI-${i + 1}`,
		MerchantTradeNo: `CIMTN${800000 + i}`,
		TradeNo: `CITN${900000 + i}`,
		RtnCode: succeed ? 1 : 0,
		RtnMsg: succeed ? '申請成功' : '申請失敗',
		TradeAmt: amount,
		PaymentType: 'Credit', // 無卡分期視為信用卡類型，便於中文顯示
		TradeDate: tradeDate,
		CheckMacValue: `MOCKEDCHECKMACCI${i}`,
		// BNPL 詳情
		BNPLTradeNo: `BNPL${700000 + i}`,
		BNPLInstallment: installments,
		// 其他欄位
		MerchantID: '2000132',
		StoreID: '',
		CustomField1: '',
		CustomField2: '',
		CustomField3: '',
		CustomField4: '',
	};
});

export default {
	getList() {
		return [...sampleCI];
	},
};
