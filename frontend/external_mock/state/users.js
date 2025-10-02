// 簡易使用者資料管理器 (mock) - 用 localStorage 模擬持久化
// 功能:
// 1. 初始種子帳號 (username: user / password: password)
// 2. 驗證登入
// 3. 取得 / 新增使用者
// 4. 管理目前登入 session

const LS_USERS_KEY = 'marelle_users';
const LS_SESSION_KEY = 'marelle_session_user';

function loadUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

// 簡單雜湊 (非安全，只作示範) - 真實環境請後端處理
function hashPassword(pwd) {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    hash = (hash << 5) - hash + pwd.charCodeAt(i);
    hash |= 0;
  }
  return 'h' + hash;
}

function ensureSeedUser() {
  const users = loadUsers();
  if (!users.find(u => u.username === 'user')) {
    users.push({
      id: Date.now(),
      username: 'user',
      passwordHash: hashPassword('password'),
      createdAt: new Date().toISOString(),
      profile: { nickname: '示範用戶' }
    });
    saveUsers(users);
  }
}

ensureSeedUser();

export function getUsers() {
  return loadUsers();
}

export function findUser(username) {
  return loadUsers().find(u => u.username === username);
}

export function addUser(username, password, extra = {}) {
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    throw new Error('使用者已存在');
  }
  const user = {
    id: Date.now(),
    username,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    ...extra
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export async function verifyCredentials(username, password) {
  // 模擬 API 延遲
  await new Promise(r => setTimeout(r, 400));
  const user = findUser(username);
  if (!user) return null;
  if (user.passwordHash !== hashPassword(password)) return null;
  // 記錄 session
  localStorage.setItem(LS_SESSION_KEY, JSON.stringify({ id: user.id, username: user.username }));
  return { id: user.id, username: user.username };
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(LS_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(LS_SESSION_KEY);
}
