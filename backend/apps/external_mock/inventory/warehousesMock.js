// Minimal warehouses mock
export const DEFAULT_WAREHOUSES_DATA = [
  { id: 'w1', name: '台北一倉', address: '台北市中正區', capacity: 1000 },
  { id: 'w2', name: '新北二倉', address: '新北市板橋區', capacity: 800 },
]

const KEY = '__mock_warehouses__'

export function loadWarehouses() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_WAREHOUSES_DATA
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : DEFAULT_WAREHOUSES_DATA
  } catch {
    return DEFAULT_WAREHOUSES_DATA
  }
}

export function saveWarehouses(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list || []))
  } catch (e) {
    // ignore write errors in mock storage
  }
}
