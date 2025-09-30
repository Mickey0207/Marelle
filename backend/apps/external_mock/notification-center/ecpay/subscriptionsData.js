// 綠界定期定額結果 Mock，提供 getList() 供頁面讀取
const now = Date.now();

const sampleSubs = Array.from({ length: 16 }).map((_, i) => {
	const succeed = i % 4 !== 0; // 大多數成功
	const amount = (Math.floor((i * 53) % 3000) + 100);
	const firstAuth = amount + (i % 3) * 50;
	const totalTimes = (i % 7) + 1;
	const totalAmt = totalTimes * amount;
	const periodTypes = ['M', 'D', 'Y'];
	const pt = periodTypes[i % periodTypes.length];
	const payTypes = ['Credit', 'ATM_TAISHIN', 'CVS_FAMILY'];
	const pay = payTypes[i % payTypes.length];
	const baseDate = new Date(now - i * 86_400_000); // 每筆往前一天
	const tradeDate = new Date(baseDate.getTime() - 3_600_000); // 早一小時
	const paymentDate = succeed ? new Date(baseDate.getTime() - 1_800_000) : '';
	const processDate = succeed ? new Date(baseDate.getTime() - 900_000) : '';
	return {
		id: `SUB-${i + 1}`,
		MerchantTradeNo: `SMTN${400000 + i}`,
		TradeNo: `STN${500000 + i}`,
		RtnCode: succeed ? 1 : 0,
		RtnMsg: succeed ? '交易成功' : '交易失敗',
		PaymentType: pay,
		SimulatePaid: i % 6 === 0,
		MerchantID: '2000132',
		StoreID: '',

		// 週期設定
		PeriodType: pt, // D/M/Y
		Frequency: pt === 'D' ? 7 : pt === 'M' ? 1 : 1,
		ExecTimes: 12,
		PeriodAmount: amount,

		// 時間
		TradeDate: tradeDate.toISOString(),
		PaymentDate: paymentDate ? paymentDate.toISOString() : '',
		ProcessDate: processDate ? processDate.toISOString() : '',

		// 金額
		Amount: amount,
		FirstAuthAmount: firstAuth,
		TotalSuccessTimes: succeed ? totalTimes : 0,
		TotalSuccessAmount: succeed ? totalAmt : 0,

		// 進階欄位
		AuthCode: succeed ? `AC${1000 + i}` : '',
		Gwsr: succeed ? 900000 + i : '',
		CustomField1: '',
		CustomField2: '',
		CustomField3: '',
		CustomField4: '',
		CheckMacValue: `MOCKEDCHECKMACSUB${i}`,
	};
});

export default {
	getList() {
		return [...sampleSubs];
	},
};
