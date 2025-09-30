// Minimal status mapping for logistics, covering Home and CVS subtypes

const BASE_MAP = {
  0: '待處理',
  1: '已成立',
  2: '配送中',
  3: '已配達',
  4: '已取件',
  5: '配送失敗',
  6: '退回',
};

const TYPES = {
  Home: {
    TCAT: { ...BASE_MAP },
    POST: { ...BASE_MAP },
  },
  CVS: {
    UNIMART: { ...BASE_MAP },
    UNIMARTC2C: { ...BASE_MAP },
    FAMI: { ...BASE_MAP },
    FAMIC2C: { ...BASE_MAP },
    HILIFE: { ...BASE_MAP },
    HILIFEC2C: { ...BASE_MAP },
    OKMART: { ...BASE_MAP },
    OKMARTC2C: { ...BASE_MAP },
  },
};

export function getDetailedStatusMap() {
  return TYPES;
}

export function getFlatStatusMap() {
  const flat = {};
  Object.values(TYPES).forEach((sub) => {
    Object.values(sub).forEach((m) => {
      Object.assign(flat, m);
    });
  });
  return flat;
}

export function mapLogisticsStatusToText(status, type = 'Home', subType = 'TCAT') {
  const t = String(type || '').trim();
  const s = String(subType || '').trim();
  const num = Number(status);
  const map = TYPES?.[t]?.[s] || BASE_MAP;
  return map[num] || String(status);
}

export default {
  getDetailedStatusMap,
  getFlatStatusMap,
  mapLogisticsStatusToText,
};
