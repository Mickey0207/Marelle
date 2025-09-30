// 綠界付款結果 Mock，提供 getList() 供頁面讀取
const now = Date.now();

const samplePayments = Array.from({ length: 20 }).map((_, i) => {
	const success = i % 5 !== 0; // 大多數為成功
	const rtnCode = success ? 1 : 0;
	const amount = (Math.floor((i * 37) % 4000) + 200);
	const payTypes = ['Credit', 'ATM_TAISHIN', 'CVS_OK'];
	const chargeFees = [15, 25, 0];
	const idx = i % payTypes.length;
	return {
		id: `PAY-${i + 1}`,
		MerchantTradeNo: `MTN${100000 + i}`,
		TradeNo: `TN${200000 + i}`,
		TradeAmt: amount,
		RtnCode: rtnCode,
		RtnMsg: success ? '交易成功' : '交易失敗',
		PaymentType: payTypes[idx],
		PaymentTypeChargeFee: chargeFees[idx],
		TradeDate: new Date(now - i * 3_600_000).toISOString(), // 每筆往前 1 小時
		PaymentDate: success ? new Date(now - i * 3_300_000).toISOString() : '',
		SimulatePaid: i % 7 === 0,
		MerchantID: '2000132',
		StoreID: '',
		PlatformID: '',
		CustomField1: '',
		CustomField2: '',
		CustomField3: '',
		CustomField4: '',
		CheckMacValue: `MOCKEDCHECKMAC${i}`,
	};
});

export default {
	getList() {
		return [...samplePayments];
	}
};
