// 認證資料處理器：封裝登入、登出、Session 與登入日誌
// 將密碼雜湊、驗證與 session 流程集中，避免耦合在 adminDataManager

import { adminDataManager } from '../admin/adminDataManager.js';
import { SECURITY_CONFIG, SESSION_CONFIG } from '../admin/adminConfig.js';
import { hashPassword, verifyPassword, getClientIP } from './authUtils.js';

const LS_LOGIN_LOGS = 'admin_login_logs';

function loadLogs() {
  try { return JSON.parse(localStorage.getItem(LS_LOGIN_LOGS) || '[]'); } catch { return []; }
}
function saveLogs(list) { localStorage.setItem(LS_LOGIN_LOGS, JSON.stringify(list)); }

export const authManager = {
  // 暴露工具，供舊程式平滑遷移
  hashPassword,
  verifyPassword,
  getClientIP,

  // 登入流程（與原 authenticate 等價，但搬遷至此）
  authenticate(email, password) {
    const user = adminDataManager.getUserByEmail(email);

    if (!user) {
      this.addLoginLog({ userId: null, email, loginMethod: 'password', success: false, failureReason: '用戶不存在' });
      return { success: false, message: '帳號或密碼錯誤' };
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      this.addLoginLog({ userId: user.id, email, loginMethod: 'password', success: false, failureReason: '帳號被鎖定' });
      return { success: false, message: '帳號已被鎖定，請聯繫管理員' };
    }

    if (!user.isActive) {
      this.addLoginLog({ userId: user.id, email, loginMethod: 'password', success: false, failureReason: '帳號已停用' });
      return { success: false, message: '帳號已停用' };
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      const failed = (user.failedLoginAttempts || 0) + 1;
      const update = { failedLoginAttempts: failed };
      if (failed >= SECURITY_CONFIG.maxFailedAttempts) {
        update.lockedUntil = new Date(Date.now() + SECURITY_CONFIG.lockoutDuration).toISOString();
      }
      adminDataManager.updateUser(user.id, update);
      this.addLoginLog({ userId: user.id, email, loginMethod: 'password', success: false, failureReason: '密碼錯誤' });
      return { success: false, message: failed >= SECURITY_CONFIG.maxFailedAttempts ? '密碼錯誤次數過多，帳號已被鎖定' : '帳號或密碼錯誤' };
    }

    adminDataManager.updateUser(user.id, { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date().toISOString() });
    const session = adminDataManager.createSession(user.id);
    this.addLoginLog({ userId: user.id, email, loginMethod: 'password', success: true, failureReason: null });
    return { success: true, sessionToken: session.sessionToken, user: adminDataManager.validateSession(session.sessionToken) };
  },

  // Login logs（集中於此）
  addLoginLog(partial) {
    const logs = loadLogs();
    const newLog = {
      id: Math.max(0, ...logs.map(l => l.id)) + 1,
      ipAddress: getClientIP(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      createdAt: new Date().toISOString(),
      ...partial,
    };
    logs.push(newLog);
    if (logs.length > 1000) logs.splice(0, logs.length - 1000);
    saveLogs(logs);
    return newLog;
  },

  getAllLoginLogs() { return loadLogs(); },

  // Session 協作（仍由 adminDataManager 持久化 sessions）
  validateSession(token) { return adminDataManager.validateSession(token); },
  updateSessionActivity(token) { return adminDataManager.updateSessionActivity(token); },
  invalidateSession(token) { return adminDataManager.invalidateSession(token); },
  cleanExpiredSessions() { return adminDataManager.cleanExpiredSessions(); },
};

export default authManager;
