// Mock data manager for Chart of Accounts and Automation Rules

const TYPES = ['資產','負債','權益','收入','費用'];
const NORMAL = ['借','貸'];

const accounts = [
  { id: 'acc-1101', code: '1101', name: '現金', type: '資產', normal: '借', active: true },
  { id: 'acc-1121', code: '1121', name: '應收帳款', type: '資產', normal: '借', active: true },
  { id: 'acc-1141', code: '1141', name: '存貨', type: '資產', normal: '借', active: true },
  { id: 'acc-2101', code: '2101', name: '應付帳款', type: '負債', normal: '貸', active: true },
  { id: 'acc-3110', code: '3110', name: '股本', type: '權益', normal: '貸', active: true },
  { id: 'acc-4101', code: '4101', name: '銷貨收入', type: '收入', normal: '貸', active: true },
  { id: 'acc-5101', code: '5101', name: '銷貨成本', type: '費用', normal: '借', active: true },
  { id: 'acc-7101', code: '7101', name: '運費', type: '費用', normal: '借', active: true },
];

// Automation rules: eventKey -> lines (debit/credit postings)
// eventKey 與 amountSource 採用中文顯示（僅作為文字，mock 不做公式計算）
const automations = [
  {
    id: 'auto-ord-created',
    name: '訂單建立（應收）',
    eventKey: '訂單建立',
    active: true,
    lines: [
      { accountCode: '1121', side: '借', amountSource: '訂單含稅總額', note: '應收帳款增加' },
      { accountCode: '4101', side: '貸', amountSource: '銷貨收入（未稅-折扣）', note: '銷貨收入' },
      { accountCode: '5101', side: '借', amountSource: '銷貨成本', note: '銷貨成本' },
      { accountCode: '1141', side: '貸', amountSource: '銷貨成本', note: '存貨減少' },
    ]
  },
  {
    id: 'auto-ord-paid',
    name: '訂單收款（現金）',
    eventKey: '訂單收款',
    active: true,
    lines: [
      { accountCode: '1101', side: '借', amountSource: '收款金額', note: '現金（或銀行存款）' },
      { accountCode: '1121', side: '貸', amountSource: '收款金額', note: '應收帳款轉銷' },
    ]
  },
  {
    id: 'auto-ord-refund',
    name: '訂單退款',
    eventKey: '訂單退款',
    active: true,
    lines: [
      { accountCode: '4101', side: '借', amountSource: '退款總額', note: '沖銷收入' },
      { accountCode: '1101', side: '貸', amountSource: '退款總額', note: '現金流出' },
    ]
  }
];

function clone(o){ return JSON.parse(JSON.stringify(o)); }

function listAccounts(){ return clone(accounts); }
function getAccountByCode(code){ return clone(accounts.find(a => a.code === code) || null); }
function createAccount(payload){
  if (!payload || !payload.code) return { success:false, message:'缺少代碼' };
  if (accounts.some(a => a.code === payload.code)) return { success:false, message:'代碼已存在' };
  const a = {
    id: `acc-${payload.code}`,
    code: payload.code,
    name: payload.name || '未命名科目',
    type: TYPES.includes(payload.type) ? payload.type : '資產',
    normal: NORMAL.includes(payload.normal) ? payload.normal : '借',
    active: payload.active !== false
  };
  accounts.push(a);
  return { success:true, data: clone(a) };
}
function updateAccount(code, patch){
  const idx = accounts.findIndex(a => a.code === code);
  if (idx === -1) return { success:false };
  accounts[idx] = { ...accounts[idx], ...patch, code: accounts[idx].code };
  return { success:true, data: clone(accounts[idx]) };
}
function deleteAccount(code){
  const i = accounts.findIndex(a => a.code === code);
  if (i === -1) return { success:false };
  accounts.splice(i,1);
  return { success:true };
}

function listAutomations(){ return clone(automations); }
function getAutomationById(id){ return clone(automations.find(a => a.id === id) || null); }
function upsertAutomation(payload){
  if (!payload || !payload.id) return { success:false };
  const idx = automations.findIndex(a => a.id === payload.id);
  if (idx === -1) {
    automations.push(payload);
  } else {
    automations[idx] = { ...automations[idx], ...payload };
  }
  return { success:true, data: clone(getAutomationById(payload.id)) };
}
function deleteAutomation(id){
  const i = automations.findIndex(a => a.id === id);
  if (i === -1) return { success:false };
  automations.splice(i,1);
  return { success:true };
}

export default {
  listAccounts,
  getAccountByCode,
  createAccount,
  updateAccount,
  deleteAccount,
  listAutomations,
  getAutomationById,
  upsertAutomation,
  deleteAutomation,
  TYPES,
  NORMAL,
};
