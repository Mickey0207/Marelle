const types = ['信用卡','ATM','超商代碼','Line Pay','Apple Pay'];

function formatWithChinese(value) {
	if (!value) return '-';
	// 常見的 ECPay PaymentType 代碼對應中文
	const map = {
		Credit: '信用卡',
		ATM: 'ATM',
		ATM_TAISHIN: 'ATM（台新）',
		CVS: '超商代碼',
		CVS_FAMILY: '超商代碼（全家）',
		CVS_OK: '超商代碼（OK）',
		CVS_HILIFE: '超商代碼（萊爾富）',
		CVS_7_11: '超商代碼（7-11）',
		BARCODE: '超商條碼',
		LinePay: 'Line Pay',
		ApplePay: 'Apple Pay',
	};
	return map[value] || value;
}

export default Object.assign(types, { formatWithChinese });
