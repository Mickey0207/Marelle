import { generateMockEvents } from '../../../data/user-tracking/mockEvents';
export { EVENT_LABELS } from '../../../data/user-tracking/mockEvents';

export function getEvents(filters = {}) {
  const {
    startTs, endTs, types, sources, devices, userId, sessionId, productId, sku, utmCampaign
  } = filters;
  let list = generateMockEvents();
  if (startTs) list = list.filter(e => e.ts >= startTs);
  if (endTs) list = list.filter(e => e.ts <= endTs);
  if (types?.length) list = list.filter(e => types.includes(e.type));
  if (sources?.length) list = list.filter(e => sources.includes(e.source));
  if (devices?.length) list = list.filter(e => devices.includes(e.device));
  if (userId) list = list.filter(e => e.userId === userId);
  if (sessionId) list = list.filter(e => e.sessionId === sessionId);
  if (productId) list = list.filter(e => e.productId === productId);
  if (sku) list = list.filter(e => e.sku === sku);
  if (utmCampaign) list = list.filter(e => e.utmCampaign === utmCampaign);
  return list;
}

export function getSessions(filters = {}) {
  const events = getEvents(filters);
  const map = new Map();
  for (const e of events) {
    if (!map.has(e.sessionId)) {
      map.set(e.sessionId, {
        sessionId: e.sessionId,
        userId: e.userId,
        source: e.source,
        device: e.device,
        startedAt: e.ts,
        endedAt: e.ts,
        pages: new Set(),
        events: [],
      });
    }
    const s = map.get(e.sessionId);
    s.startedAt = Math.min(s.startedAt, e.ts);
    s.endedAt = Math.max(s.endedAt, e.ts);
    if (e.path) s.pages.add(e.path);
    s.events.push(e);
  }
  return Array.from(map.values()).map(s => ({
    ...s,
    pages: Array.from(s.pages),
    durationSec: Math.max(1, Math.round((s.endedAt - s.startedAt) / 1000)),
    pageCount: s.pages.length,
    eventCount: s.events.length,
  })).sort((a,b) => b.startedAt - a.startedAt);
}

export function getFunnel(steps = ['product_view','add_to_cart','checkout_start','purchase'], filters = {}) {
  const events = getEvents(filters);
  // 依 userId+sessionId 做步驟達成
  const bySession = new Map();
  for (const e of events) {
    const key = e.userId + '|' + e.sessionId;
    if (!bySession.has(key)) bySession.set(key, new Set());
    bySession.get(key).add(e.type);
  }
  const total = bySession.size || 1;
  let prevSet = new Set(Array.from(bySession.keys()));
  const result = steps.map((step, idx) => {
    const keep = new Set();
    for (const key of prevSet) {
      const types = bySession.get(key);
      if (types?.has(step)) keep.add(key);
    }
    const count = keep.size;
    const rate = count / (idx === 0 ? total : prevSet.size || 1);
    prevSet = keep;
    return { step, count, rate };
  });
  return result;
}

export function getRetentionByWeek(filters = {}) {
  const events = getEvents(filters);
  // 用 userId 的首次週當 cohort，後續週是否有任何活動
  const byUser = new Map();
  for (const e of events) {
    if (!byUser.has(e.userId)) byUser.set(e.userId, []);
    byUser.get(e.userId).push(e.ts);
  }
  const toWeek = (ts) => Math.floor(ts / (1000*60*60*24*7));
  const cohorts = new Map(); // cohortWeek -> Map(weekOffset->Set(userId))
  for (const [uid, tss] of byUser.entries()) {
    tss.sort((a,b)=>a-b);
    const firstW = toWeek(tss[0]);
    if (!cohorts.has(firstW)) cohorts.set(firstW, new Map());
    const map = cohorts.get(firstW);
    const weeks = new Set(tss.map(toWeek));
    for (const w of weeks) {
      const offset = w - firstW;
      if (!map.has(offset)) map.set(offset, new Set());
      map.get(offset).add(uid);
    }
  }
  // 產出矩陣
  const matrix = [];
  for (const [cohortW, offsets] of Array.from(cohorts.entries()).sort((a,b)=>a[0]-b[0])) {
    const size = offsets.get(0)?.size || 1;
    const row = { cohortWeek: cohortW, base: size, cells: [] };
    const maxOffset = Math.max(...Array.from(offsets.keys()));
    for (let i=0;i<=maxOffset;i++) {
      const users = offsets.get(i)?.size || 0;
      row.cells.push({ weekOffset: i, users, rate: users / size });
    }
    matrix.push(row);
  }
  return matrix;
}

export default {
  getEvents,
  getSessions,
  getFunnel,
  getRetentionByWeek,
};
