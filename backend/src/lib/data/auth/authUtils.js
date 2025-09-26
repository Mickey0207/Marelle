// 認證相關的工具方法（密碼雜湊、驗證等）

export function hashPassword(password) {
  // 簡化的雜湊函數（實務請改用 bcrypt/scrypt/argon2）
  return btoa(String(password) + 'marelle_salt');
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

export function getClientIP() {
  // Demo：真實專案請由後端取得來源 IP
  return '127.0.0.1';
}
