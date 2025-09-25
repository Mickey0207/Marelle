import { buildSampleContext } from './variables';

// 可共用於不同渠道的預設情境定義
export const PREVIEW_PRESETS = [
  {
    value: 'default',
    label: '預設',
    apply: (base) => base,
  },
  {
    value: 'vip',
    label: 'VIP 會員',
    apply: (base) => ({
      ...base,
      user: { ...base.user, tier: 'VIP' },
      userAttributes: { ...base.userAttributes, points: 5000 },
    }),
  },
  {
    value: 'new',
    label: '新客',
    apply: (base) => ({
      ...base,
      user: { ...base.user, tier: 'NEW' },
      userAttributes: { ...base.userAttributes, points: 0 },
    }),
  },
  {
    value: 'delivered',
    label: '物流到貨',
    apply: (base) => ({
      ...base,
      shipment: { ...base.shipment, status: '已到貨' },
    }),
  },
];

export function getPresetContext(presetValue = 'default') {
  const base = buildSampleContext(); // 每次呼叫都刷新 now 等動態值
  const preset = PREVIEW_PRESETS.find((p) => p.value === presetValue);
  return preset ? preset.apply(base) : base;
}

export function getPresetOptions() {
  return PREVIEW_PRESETS.map((p) => ({ value: p.value, label: p.label }));
}
