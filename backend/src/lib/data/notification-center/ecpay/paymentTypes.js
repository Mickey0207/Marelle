// 綠界付款方式代碼對應（常見值，後續可擴充）
// 來源：綠界回傳付款方式一覽表與常見代碼組合

const PAYMENT_TYPE_MAP = {
  // 信用卡
  'Credit': '信用卡',
  'Credit_CreditCard': '信用卡',
  // ATM
  'ATM': 'ATM 轉帳',
  'ATM_TAISHIN': 'ATM 台新銀行',
  'ATM_ESUN': 'ATM 玉山銀行',
  'ATM_BOT': 'ATM 臺灣銀行',
  'ATM_FUBON': 'ATM 台北富邦',
  'ATM_CHINATRUST': 'ATM 中國信託',
  // CVS 超商代碼
  'CVS': '超商代碼',
  'CVS_CVS': '超商代碼',
  // BARCODE
  'BARCODE': '超商條碼',
  'BARCODE_BARCODE': '超商條碼',
  // WebATM
  'WebATM': '網路 ATM',
  'WebATM_TAISHIN': '網路 ATM 台新',
  'WebATM_ESUN': '網路 ATM 玉山',
  // 行動支付/台灣Pay 等（預留）
  'TWQR': '行動支付（QR）',
  // BNPL 無卡分期
  'BNPL': '無卡分期',
};

const paymentTypes = {
  getAll: () => ({ ...PAYMENT_TYPE_MAP }),
  getLabel: (code) => PAYMENT_TYPE_MAP[code] || null,
  formatWithChinese: (code) => {
    if (!code) return '-';
    const zh = PAYMENT_TYPE_MAP[code];
    return zh ? `${code}（${zh}）` : code;
  }
};

export default paymentTypes;