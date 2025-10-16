// 簡易地址簿（純前端 mock，使用 localStorage）
// 結構：{ [userId]: Address[] }
// Address: { id, fullName, email, phone, address, city, zipCode, notes, isDefault }

const LS_KEY = 'marelle_addresses';

function loadAll() {
	try {
		const raw = localStorage.getItem(LS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function saveAll(data) {
	localStorage.setItem(LS_KEY, JSON.stringify(data || {}));
}

export function getAddressBook(userId) {
	if (!userId) return [];
	const all = loadAll();
	return Array.isArray(all[userId]) ? all[userId] : [];
}

export function setAddressBook(userId, list) {
	if (!userId) return;
	const all = loadAll();
	all[userId] = Array.isArray(list) ? list : [];
	saveAll(all);
}

export function addAddress(userId, addr) {
	if (!userId) return null;
	const list = getAddressBook(userId);
	const id = addr?.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	const next = [...list, { ...addr, id }];
	setAddressBook(userId, next);
	return id;
}

export function setDefaultAddress(userId, addressId) {
	if (!userId || !addressId) return;
	const list = getAddressBook(userId);
	const next = list.map(a => ({ ...a, isDefault: a.id === addressId }));
	setAddressBook(userId, next);
}

export function getDefaultAddress(userId) {
	const list = getAddressBook(userId);
	return list.find(a => a.isDefault) || list[0] || null;
}

// 若使用者地址簿為空，建立一筆示範地址（不覆蓋現有資料）
export function ensureSampleAddress(userId) {
	if (!userId) return;
	const list = getAddressBook(userId);
	if (list && list.length > 0) return;
	const sample = {
		id: `${Date.now()}`,
		fullName: '示範用戶',
		email: 'user@example.com',
		phone: '0912-345-678',
		address: '台北市中正區仁愛路一段 1 號',
		city: '台北市',
		zipCode: '100',
		notes: '',
		isDefault: true,
	};
	addAddress(userId, sample);
}

// 超商品牌清單（簡易）
// 與綠界 LogisticsSubType 對應
export const CVS_BRANDS = [
	{ value: 'UNIMARTC2C', label: '7-ELEVEN (UNIMARTC2C)' },
	{ value: 'FAMIC2C', label: '全家 (FAMIC2C)' },
	{ value: 'HILIFEC2C', label: '萊爾富 (HILIFEC2C)' },
	{ value: 'OKMARTC2C', label: 'OK (OKMARTC2C)' },
];

