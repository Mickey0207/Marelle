// 管理員數據存儲管理器 (模擬資料庫操作)
import { 
  DEFAULT_ROLES, 
  DEFAULT_ADMIN_USERS, 
  generateEmployeeId, 
  generateSessionToken,
  SECURITY_CONFIG,
  SESSION_CONFIG
} from './adminConfig.js';

class AdminDataManager {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // 初始化角色數據
    if (!localStorage.getItem('admin_roles')) {
      localStorage.setItem('admin_roles', JSON.stringify(DEFAULT_ROLES));
    }

    // 初始化用戶數據 (包含預設管理員)
    if (!localStorage.getItem('admin_users')) {
      // 為預設管理員設定密碼雜湊
      const defaultUsers = DEFAULT_ADMIN_USERS.map(user => ({
        ...user,
        passwordHash: this.hashPassword('Admin123!') // 預設密碼
      }));
      localStorage.setItem('admin_users', JSON.stringify(defaultUsers));
    }

    // 初始化會話數據
    if (!localStorage.getItem('admin_sessions')) {
      localStorage.setItem('admin_sessions', JSON.stringify([]));
    }

    // 初始化登入日誌
    if (!localStorage.getItem('admin_login_logs')) {
      localStorage.setItem('admin_login_logs', JSON.stringify([]));
    }
  }

  // 角色管理
  getAllRoles() {
    return JSON.parse(localStorage.getItem('admin_roles') || '[]');
  }

  getRoleById(id) {
    const roles = this.getAllRoles();
    return roles.find(role => role.id === id);
  }

  createRole(roleData) {
    const roles = this.getAllRoles();
    const existingIds = this.getAllUsers().map(user => user.employeeId);
    
    const newRole = {
      id: Math.max(0, ...roles.map(r => r.id)) + 1,
      ...roleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    roles.push(newRole);
    localStorage.setItem('admin_roles', JSON.stringify(roles));
    return newRole;
  }

  updateRole(id, updateData) {
    const roles = this.getAllRoles();
    const index = roles.findIndex(role => role.id === id);
    
    if (index === -1) return null;

    roles[index] = {
      ...roles[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('admin_roles', JSON.stringify(roles));
    return roles[index];
  }

  deleteRole(id) {
    const roles = this.getAllRoles();
    const role = roles.find(r => r.id === id);
    
    if (!role || role.isSystemRole) {
      return false; // 不能刪除系統角色
    }

    // 檢查是否有用戶使用此角色
    const users = this.getAllUsers();
    const hasUsers = users.some(user => user.roleId === id);
    
    if (hasUsers) {
      return false; // 有用戶使用此角色時不能刪除
    }

    const filteredRoles = roles.filter(role => role.id !== id);
    localStorage.setItem('admin_roles', JSON.stringify(filteredRoles));
    return true;
  }

  // 用戶管理
  getAllUsers() {
    return JSON.parse(localStorage.getItem('admin_users') || '[]');
  }

  getUserById(id) {
    const users = this.getAllUsers();
    return users.find(user => user.id === id);
  }

  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  getUserByEmployeeId(employeeId) {
    const users = this.getAllUsers();
    return users.find(user => user.employeeId === employeeId);
  }

  createUser(userData) {
    const users = this.getAllUsers();
    const role = this.getRoleById(userData.roleId);
    
    if (!role) {
      throw new Error('指定的角色不存在');
    }

    const existingIds = users.map(user => user.employeeId);
    const employeeId = generateEmployeeId(role.rolePrefix, existingIds);

    const newUser = {
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      employeeId,
      ...userData,
      passwordHash: this.hashPassword(userData.password),
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 不儲存明文密碼
    delete newUser.password;

    users.push(newUser);
    localStorage.setItem('admin_users', JSON.stringify(users));
    return newUser;
  }

  updateUser(id, updateData) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;

    // 如果更新密碼，需要雜湊處理
    if (updateData.password) {
      updateData.passwordHash = this.hashPassword(updateData.password);
      delete updateData.password;
    }

    users[index] = {
      ...users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('admin_users', JSON.stringify(users));
    return users[index];
  }

  deleteUser(id) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) return false;

    // 檢查是否為超級管理員
    const role = this.getRoleById(user.roleId);
    if (role && role.rolePrefix === 'S') {
      return false; // 不能刪除超級管理員
    }

    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem('admin_users', JSON.stringify(filteredUsers));
    return true;
  }

  // 會話管理
  getAllSessions() {
    return JSON.parse(localStorage.getItem('admin_sessions') || '[]');
  }

  createSession(userId) {
    const sessions = this.getAllSessions();
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_CONFIG.maxAge);

    const newSession = {
      id: Math.max(0, ...sessions.map(s => s.id)) + 1,
      userId,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    localStorage.setItem('admin_sessions', JSON.stringify(sessions));
    return newSession;
  }

  validateSession(sessionToken) {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.sessionToken === sessionToken);
    
    if (!session) return null;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      this.invalidateSession(sessionToken);
      return null;
    }

    // 更新最後活動時間
    this.updateSessionActivity(sessionToken);
    
    // 獲取用戶詳細資料
    const user = this.getUserById(session.userId);
    const role = this.getRoleById(user?.roleId);
    
    if (!user || !user.isActive || !role) {
      this.invalidateSession(sessionToken);
      return null;
    }

    return {
      sessionId: session.id,
      userId: user.id,
      employeeId: user.employeeId,
      displayName: user.displayName,
      email: user.email,
      roleId: role.id,
      roleName: role.roleName,
      permissions: role.permissions,
      avatarUrl: user.avatarUrl,
      lastActivity: session.lastActivity
    };
  }

  updateSessionActivity(sessionToken) {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.sessionToken === sessionToken);
    
    if (index !== -1) {
      sessions[index].lastActivity = new Date().toISOString();
      localStorage.setItem('admin_sessions', JSON.stringify(sessions));
    }
  }

  invalidateSession(sessionToken) {
    const sessions = this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.sessionToken !== sessionToken);
    localStorage.setItem('admin_sessions', JSON.stringify(filteredSessions));
  }

  cleanExpiredSessions() {
    const sessions = this.getAllSessions();
    const now = new Date();
    const activeSessions = sessions.filter(session => {
      const expiresAt = new Date(session.expiresAt);
      return now <= expiresAt;
    });
    localStorage.setItem('admin_sessions', JSON.stringify(activeSessions));
  }

  // 登入日誌管理
  getAllLoginLogs() {
    return JSON.parse(localStorage.getItem('admin_login_logs') || '[]');
  }

  addLoginLog(logData) {
    const logs = this.getAllLoginLogs();
    const newLog = {
      id: Math.max(0, ...logs.map(l => l.id)) + 1,
      ...logData,
      createdAt: new Date().toISOString()
    };

    logs.push(newLog);
    
    // 只保留最近1000條記錄
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }

    localStorage.setItem('admin_login_logs', JSON.stringify(logs));
    return newLog;
  }

  // 認證相關
  authenticate(email, password) {
    const user = this.getUserByEmail(email);
    
    if (!user) {
      this.addLoginLog({
        userId: null,
        email,
        loginMethod: 'password',
        success: false,
        failureReason: '用戶不存在',
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent
      });
      return { success: false, message: '帳號或密碼錯誤' };
    }

    // 檢查帳號是否被鎖定
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      this.addLoginLog({
        userId: user.id,
        email,
        loginMethod: 'password',
        success: false,
        failureReason: '帳號被鎖定',
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent
      });
      return { success: false, message: '帳號已被鎖定，請聯繫管理員' };
    }

    // 檢查帳號是否啟用
    if (!user.isActive) {
      this.addLoginLog({
        userId: user.id,
        email,
        loginMethod: 'password',
        success: false,
        failureReason: '帳號已停用',
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent
      });
      return { success: false, message: '帳號已停用' };
    }

    // 驗證密碼
    const isValidPassword = this.verifyPassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      // 增加失敗次數
      const failedAttempts = user.failedLoginAttempts + 1;
      let updateData = { failedLoginAttempts: failedAttempts };
      
      if (failedAttempts >= SECURITY_CONFIG.maxFailedAttempts) {
        updateData.lockedUntil = new Date(Date.now() + SECURITY_CONFIG.lockoutDuration).toISOString();
      }
      
      this.updateUser(user.id, updateData);
      
      this.addLoginLog({
        userId: user.id,
        email,
        loginMethod: 'password',
        success: false,
        failureReason: '密碼錯誤',
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent
      });
      
      return { 
        success: false, 
        message: failedAttempts >= SECURITY_CONFIG.maxFailedAttempts ? 
          '密碼錯誤次數過多，帳號已被鎖定' : '帳號或密碼錯誤' 
      };
    }

    // 登入成功
    this.updateUser(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date().toISOString()
    });

    const session = this.createSession(user.id);
    
    this.addLoginLog({
      userId: user.id,
      email,
      loginMethod: 'password',
      success: true,
      failureReason: null,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    });

    return {
      success: true,
      sessionToken: session.sessionToken,
      user: this.validateSession(session.sessionToken)
    };
  }

  // 工具函數
  hashPassword(password) {
    // 簡化的雜湊函數（實際應用中應使用 bcrypt 等安全的雜湊函數）
    return btoa(password + 'marelle_salt');
  }

  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  getClientIP() {
    // 在實際應用中應從請求中獲取真實IP
    return '127.0.0.1';
  }

  // 統計數據
  getStatistics() {
    const users = this.getAllUsers();
    const roles = this.getAllRoles();
    const sessions = this.getAllSessions();
    const logs = this.getAllLoginLogs();

    const activeUsers = users.filter(user => user.isActive);
    const lockedUsers = users.filter(user => user.lockedUntil && new Date(user.lockedUntil) > new Date());
    const activeSessions = sessions.filter(session => new Date(session.expiresAt) > new Date());

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      lockedUsers: lockedUsers.length,
      totalRoles: roles.length,
      activeSessions: activeSessions.length,
      totalLoginAttempts: logs.length,
      successfulLogins: logs.filter(log => log.success).length,
      failedLogins: logs.filter(log => !log.success).length
    };
  }
}

// 創建全局實例
export const adminDataManager = new AdminDataManager();