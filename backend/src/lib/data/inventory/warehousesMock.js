// 倉庫模擬資料與存取工具（使用 localStorage 做前端暫存）

const LS_KEY = 'marelle_warehouses';

export const DEFAULT_WAREHOUSES_DATA = [
  {
    id: 'main',
    name: '主倉庫',
    code: 'WH-MAIN',
    isDefault: true,
    address: '台北市中正區仁愛路 1 段 1 號',
    contact: '02-1234-5678',
    enabled: true,
  },
  {
    id: 'a',
    name: '主倉庫A',
    code: 'WH-A',
    isDefault: false,
    address: '新北市板橋區文化路 100 號',
    contact: '02-8765-4321',
    enabled: true,
  }
];

export const loadWarehouses = () => {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LS_KEY) : null;
    if (!raw) return DEFAULT_WAREHOUSES_DATA;
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_WAREHOUSES_DATA;
    return data;
  } catch (e) {
    return DEFAULT_WAREHOUSES_DATA;
  }
};

export const saveWarehouses = (list) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    // ignore
  }
};

export const getWarehouseOptions = () => {
  const list = loadWarehouses();
  return list.filter(w => w.enabled).map(w => ({ value: w.name, label: w.name }));
};

export default {
  loadWarehouses,
  saveWarehouses,
  getWarehouseOptions,
};
