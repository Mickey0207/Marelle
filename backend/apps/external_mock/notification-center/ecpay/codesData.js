// 綠界取號 Mock，提供 getList() 供頁面讀取
const now = Date.now();

function makeCommon(i, amount) {
	return {
		id: `EC-${i + 1}`,
		MerchantTradeNo: `MTN${600000 + i}`,
		TradeNo: `TN${700000 + i}`,
		RtnMsg: '取號成功',
		TradeAmt: amount,
		TradeDate: new Date(now - i * 5_400_000).toISOString(), // 每筆往前 1.5 小時
		MerchantID: '2000132',
		StoreID: '',
		CustomField1: '',
		CustomField2: '',
		CustomField3: '',
		CustomField4: '',
		CheckMacValue: `MOCKEDCHECKMACCODE${i}`,
	};
}

function makeAtm(i) {
	const amount = 200 + (i % 5) * 50;
	return {
		...makeCommon(i, amount),
		PaymentType: 'ATM_TAISHIN',
		BankCode: '812', // 台新
		vAccount: `812-${10000000 + i}`,
		ExpireDate: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
	};
}

function makeCvs(i) {
	const amount = 150 + (i % 7) * 30;
	const cvsTypes = ['CVS_FAMILY', 'CVS_OK', 'CVS_HILIFE'];
	return {
		...makeCommon(i, amount),
		PaymentType: cvsTypes[i % cvsTypes.length],
		PaymentNo: `${88000000 + i}`,
		ExpireDate: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
	};
}

function makeBarcode(i) {
	const amount = 300 + (i % 4) * 40;
	return {
		...makeCommon(i, amount),
		PaymentType: 'BARCODE',
		Barcode1: `${1000 + i}`,
		Barcode2: `${2000 + i}`,
		Barcode3: `${3000 + i}`,
		ExpireDate: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
	};
}

const sampleCodes = [
	// 6 筆 ATM、6 筆 CVS、6 筆 BARCODE
	...Array.from({ length: 6 }, (_, i) => makeAtm(i)),
	...Array.from({ length: 6 }, (_, i) => makeCvs(i + 6)),
	...Array.from({ length: 6 }, (_, i) => makeBarcode(i + 12)),
];

export default {
	getList() {
		return [...sampleCodes];
	},
};
