// Status mapping helper for ECPay logistics status codes
// Source JSON is produced by scripts/generateLogisticsStatus.js

import statusJson from './logistics_status.json';

const generated = (statusJson && (statusJson.flat || statusJson.detailed)) ? statusJson : { flat: {}, detailed: {} };

export const getStatusMeta = () => ({
  generatedAt: generated.generatedAt || null,
  hasFlat: !!generated.flat,
  hasDetailed: !!generated.detailed,
});

export const getFlatStatusMap = () => generated.flat || {};
export const getDetailedStatusMap = () => generated.detailed || {};

// Map a status code to human-readable Chinese text
// type: 'Home' | 'CVS' | 'HOME' | ...
// subType: 'TCAT' | 'POST' | 'UNIMART' | 'UNIMARTC2C' | 'FAMI' | 'FAMIC2C' | 'HILIFE' | 'HILIFEC2C' | 'OKMART' | 'OKMARTC2C'
export function mapLogisticsStatusToText(code, type, subType) {
  const c = String(code ?? '').trim();
  if (!c) return '';
  const t = String(type || '').toUpperCase();
  const s = String(subType || '').toUpperCase();
  const detailed = getDetailedStatusMap();
  const typeMap = detailed[t];
  const subMap = typeMap ? typeMap[s] : null;
  return (subMap && subMap[c]) || (getFlatStatusMap()[c] || '');
}

// Back-compat alias (if some modules still import this name later)
export const mapStatusToText = mapLogisticsStatusToText;
