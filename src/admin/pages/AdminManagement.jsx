import React, { useState, useEffect } from 'react';
import StandardTable from '../components/StandardTable';
import { 
  UsersIcon, 
  UserGroupIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChartBarIcon,
  KeyIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  LockClosedIcon,
  LockOpenIcon,
  UserIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { adminDataManager } from '../data/adminDataManager.js';
import { ADMIN_PERMISSIONS, MODULE_NAMES, OPERATION_NAMES, validatePassword } from '../data/adminConfig.js';
import { ADMIN_STYLES, getStatusColor } from '../styles/adminStyles';
import CustomSelect from '../components/CustomSelect.jsx';

const AdminManagement = () => {
  const [statistics, setStatistics] = useState({});
  const [recentLogs, setRecentLogs] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  
  // 模態框狀態
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // 表單數據
  const [userFormData, setUserFormData] = useState({
    email: '', password: '', confirmPassword: '', displayName: '', roleId: '', avatarUrl: ''
  });
  const [roleFormData, setRoleFormData] = useState({
    roleName: '', rolePrefix: '', permissions: {}
  });
  
  // 其他狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    loadAllData();
    
    // 定期清理過期會話
    const interval = setInterval(() => {
      adminDataManager.cleanExpiredSessions();
      loadAllData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadAllData = () => {
    const stats = adminDataManager.getStatistics();
    setStatistics(stats);
    
    const logs = adminDataManager.getAllLoginLogs()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    setRecentLogs(logs);
    
    const sessions = adminDataManager.getAllSessions()
      .filter(session => new Date(session.expiresAt) > new Date())
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    setActiveSessions(sessions);
    
    const rolesData = adminDataManager.getAllRoles();
    setRoles(rolesData);
    
    const usersData = adminDataManager.getAllUsers();
    setUsers(usersData);
  };

  const getUserDisplayName = (userId) => {
    const user = adminDataManager.getUserById(userId);
    return user ? user.displayName : '未知用戶';
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, onClick }) => (
    <div 
      className={`glass rounded-2xl p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 font-chinese">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 font-chinese">{subtitle}</p>
          )}
        </div>
      </div>
      {onClick && (
        <div className="mt-2 text-right">
          <span className="text-xs text-blue-600 font-chinese">點擊查看詳情 →</span>
        </div>
      )}
    </div>
  );

  // 玻璃態模態框組件
  const GlassModal = ({ isOpen, onClose, title, children, size = 'max-w-4xl' }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
        {/* 玻璃態背景遮罩 */}
        <div 
          className="absolute inset-0 bg-white/20 backdrop-blur-md"
          onClick={onClose}
        ></div>
        
        {/* 玻璃態彈出視窗 */}
        <div className={`relative ${size} w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl`}>
          {/* 標題列 */}
          <div className="bg-gradient-to-r from-[#cc824d]/80 to-[#b3723f]/80 backdrop-blur-sm text-white px-6 py-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-chinese">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* 內容區域 */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // 用戶管理模態框內容
  const renderUserManagement = () => (
    <div className="p-6 space-y-6">
      {/* 工具欄 */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋用戶..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
          <CustomSelect
            options={[
              { value: '', label: '所有角色' },
              ...roles.map(role => ({ value: role.id, label: role.roleName }))
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="篩選角色"
          />
          <CustomSelect
            options={[
              { value: '', label: '所有狀態' },
              { value: 'active', label: '啟用' },
              { value: 'disabled', label: '停用' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="篩選狀態"
          />
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setUserFormData({
              email: '', password: '', confirmPassword: '', displayName: '', roleId: '', avatarUrl: ''
            });
            setActiveModal('addUser');
          }}
          className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          新增管理員
        </button>
      </div>

      {/* 用戶列表 */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用戶</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最後登入</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-gray-200/50">
            {users
              .filter(user => {
                const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = !roleFilter || user.roleId === roleFilter;
                const matchesStatus = !statusFilter || 
                  (statusFilter === 'active' && user.isActive) ||
                  (statusFilter === 'disabled' && !user.isActive);
                return matchesSearch && matchesRole && matchesStatus;
              })
              .map((user) => (
                <tr key={user.id} className="hover:bg-white/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatarUrl ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {roles.find(r => r.id === user.roleId)?.roleName || '未知角色'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '從未登入'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(user);
                          setUserFormData({
                            email: user.email,
                            password: '',
                            confirmPassword: '',
                            displayName: user.displayName,
                            roleId: user.roleId,
                            avatarUrl: user.avatarUrl || ''
                          });
                          setActiveModal('editUser');
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('確定要刪除這個用戶嗎？')) {
                            adminDataManager.deleteUser(user.id);
                            loadAllData();
                          }
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          adminDataManager.updateUser(user.id, { isActive: !user.isActive });
                          loadAllData();
                        }}
                        className={`p-1 rounded ${user.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {user.isActive ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 角色管理模態框內容
  const renderRoleManagement = () => (
    <div className="p-6 space-y-6">
      {/* 工具欄 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">角色管理</h3>
        <button
          onClick={() => {
            setEditingItem(null);
            setRoleFormData({
              roleName: '',
              rolePrefix: '',
              permissions: {}
            });
            setActiveModal('addRole');
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          新增角色
        </button>
      </div>

      {/* 角色列表 */}
      <div className="grid gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{role.roleName}</h4>
                <p className="text-sm text-gray-500">權限前綴: {role.rolePrefix}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingItem(role);
                    setRoleFormData({
                      roleName: role.roleName,
                      rolePrefix: role.rolePrefix,
                      permissions: role.permissions || {}
                    });
                    setActiveModal('editRole');
                  }}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('確定要刪除這個角色嗎？')) {
                      adminDataManager.deleteRole(role.id);
                      loadAllData();
                    }
                  }}
                  className="text-red-600 hover:text-red-900 p-2 rounded"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 權限顯示 */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">權限列表:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(MODULE_NAMES).map(([module, moduleName]) => {
                  const modulePerms = role.permissions?.[module] || {};
                  const hasAnyPerm = Object.values(modulePerms).some(Boolean);
                  
                  if (!hasAnyPerm) return null;
                  
                  return (
                    <div key={module} className="bg-blue-50/80 rounded-lg p-3">
                      <h6 className="text-xs font-medium text-blue-900 mb-2">{moduleName}</h6>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(OPERATION_NAMES).map(([operation, operationName]) => {
                          if (modulePerms[operation]) {
                            return (
                              <span key={operation} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                {operationName}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 會話管理模態框內容
  const renderSessionManagement = () => (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 font-chinese">活躍會話</h3>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用戶</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登入時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最後活動</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到期時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-gray-200/50">
            {activeSessions.map((session) => (
              <tr key={session.id} className="hover:bg-white/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getUserDisplayName(session.userId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(session.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(session.lastActivity).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(session.expiresAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      if (window.confirm('確定要終止這個會話嗎？')) {
                        adminDataManager.revokeSession(session.id);
                        loadAllData();
                      }
                    }}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 登入日誌模態框內容
  const renderLoginLogs = () => (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 font-chinese">登入日誌</h3>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用戶</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 divide-y divide-gray-200/50">
            {recentLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getUserDisplayName(log.userId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {log.success ? '成功' : '失敗'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.details || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">管理員控制台</h1>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="總管理員數"
          value={statistics.totalUsers || 0}
          icon={UsersIcon}
          color="blue"
          subtitle={`${statistics.activeUsers || 0} 位啟用中`}
          onClick={() => setActiveModal('users')}
        />
        <StatCard
          title="角色數量"
          value={statistics.totalRoles || 0}
          icon={UserGroupIcon}
          color="green"
          onClick={() => setActiveModal('roles')}
        />
        <StatCard
          title="活躍會話"
          value={statistics.activeSessions || 0}
          icon={ClockIcon}
          color="orange"
          onClick={() => setActiveModal('sessions')}
        />
        <StatCard
          title="今日登入"
          value={statistics.todayLogins || 0}
          icon={EyeIcon}
          color="purple"
          onClick={() => setActiveModal('logs')}
        />
      </div>

      {/* 快速操作按鈕 */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 font-chinese mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveModal('users')}
            className="flex flex-col items-center p-4 bg-blue-100/50 rounded-xl hover:bg-blue-200/50 transition-colors"
          >
            <UsersIcon className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900 font-chinese">管理員管理</span>
          </button>
          <button
            onClick={() => setActiveModal('roles')}
            className="flex flex-col items-center p-4 bg-green-100/50 rounded-xl hover:bg-green-200/50 transition-colors"
          >
            <UserGroupIcon className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900 font-chinese">角色管理</span>
          </button>
          <button
            onClick={() => setActiveModal('sessions')}
            className="flex flex-col items-center p-4 bg-orange-100/50 rounded-xl hover:bg-orange-200/50 transition-colors"
          >
            <ClockIcon className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900 font-chinese">會話管理</span>
          </button>
          <button
            onClick={() => setActiveModal('logs')}
            className="flex flex-col items-center p-4 bg-purple-100/50 rounded-xl hover:bg-purple-200/50 transition-colors"
          >
            <EyeIcon className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900 font-chinese">登入日誌</span>
          </button>
        </div>
      </div>

      {/* 最新活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近登入 */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-chinese mb-4">最近登入</h3>
          <div className="space-y-3">
            {recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName(log.userId)}</p>
                    <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.success ? '成功' : '失敗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 活躍會話 */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-chinese mb-4">活躍會話</h3>
          <div className="space-y-3">
            {activeSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{getUserDisplayName(session.userId)}</p>
                  <p className="text-xs text-gray-500">最後活動: {new Date(session.lastActivity).toLocaleString()}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 模態框 */}
      <GlassModal
        isOpen={activeModal === 'users'}
        onClose={() => setActiveModal(null)}
        title="管理員管理"
        size="max-w-6xl"
      >
        {renderUserManagement()}
      </GlassModal>

      <GlassModal
        isOpen={activeModal === 'roles'}
        onClose={() => setActiveModal(null)}
        title="角色管理"
        size="max-w-5xl"
      >
        {renderRoleManagement()}
      </GlassModal>

      <GlassModal
        isOpen={activeModal === 'sessions'}
        onClose={() => setActiveModal(null)}
        title="會話管理"
        size="max-w-4xl"
      >
        {renderSessionManagement()}
      </GlassModal>

      <GlassModal
        isOpen={activeModal === 'logs'}
        onClose={() => setActiveModal(null)}
        title="登入日誌"
        size="max-w-4xl"
      >
        {renderLoginLogs()}
      </GlassModal>
    </div>
  );
};

export default AdminManagement;