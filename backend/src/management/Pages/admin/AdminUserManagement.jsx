import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { adminDataManager } from '../../../shared/data/adminDataManager.js';
import { validatePassword } from '../../../shared/data/adminConfig.js';
import SearchableSelect from '../../components/ui/SearchableSelect';
import GlassModal from '../../components/ui/GlassModal.jsx';
import StandardTable from '../../components/ui/StandardTable.jsx';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    roleId: '',
    avatarUrl: ''
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  // 動態角色選項
  const roleOptions = [
    { value: '', label: '選擇角色' },
    ...roles.map(role => ({
      value: role.id.toString(),
      label: role.roleName,
      icon: '💼'
    }))
  ];

  // 狀態選項
  const statusOptions = [
    { value: '', label: '選擇狀態' },
    { value: 'active', label: '啟用中', icon: '✅' },
    { value: 'inactive', label: '已停用', icon: '❌' },
    { value: 'locked', label: '已鎖定', icon: '🔒' }
  ];

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = () => {
    const usersData = adminDataManager.getAllUsers();
    setUsers(usersData);
  };

  const loadRoles = () => {
    const rolesData = adminDataManager.getAllRoles();
    setRoles(rolesData);
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.roleName : '未知角色';
  };

  const getRolePrefix = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.rolePrefix : 'U';
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        confirmPassword: '',
        displayName: user.displayName,
        roleId: user.roleId,
        avatarUrl: user.avatarUrl || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        roleId: '',
        avatarUrl: ''
      });
    }
    setPasswordErrors([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      roleId: '',
      avatarUrl: ''
    });
    setPasswordErrors([]);
  };

  const handlePasswordChange = (password) => {
    setFormData(prev => ({ ...prev, password }));
    
    if (password) {
      const validation = validatePassword(password);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.displayName.trim() || !formData.roleId) {
      alert('請填寫完整的用戶資訊');
      return;
    }

    // 新用戶密碼為必填
    if (!editingUser && !formData.password) {
      alert('請設定密碼');
      return;
    }

    // 編輯用戶時如果有輸入密碼才驗證
    if (formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        alert('密碼不符合要求：\n' + validation.errors.join('\n'));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('密碼確認不一致');
        return;
      }
    }

    // 檢查信箱是否存在
    const existingUser = adminDataManager.getUserByEmail(formData.email);
    if (existingUser && existingUser.id !== editingUser?.id) {
      alert('此信箱已被使用');
      return;
    }

    try {
      if (editingUser) {
        const updateData = {
          email: formData.email,
          displayName: formData.displayName,
          roleId: parseInt(formData.roleId),
          avatarUrl: formData.avatarUrl
        };
        
        // 只在有輸入密碼時才更新密碼
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        adminDataManager.updateUser(editingUser.id, updateData);
      } else {
        adminDataManager.createUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          roleId: parseInt(formData.roleId),
          avatarUrl: formData.avatarUrl
        });
      }
      
      loadUsers();
      handleCloseModal();
      alert(editingUser ? '管理員更新成功' : '管理員建立成功');
    } catch (error) {
      alert('操作失敗：' + error.message);
    }
  };

  const handleDelete = (user) => {
    // 檢查是否為超級管理員
    const role = roles.find(r => r.id === user.roleId);
    if (role && role.rolePrefix === 'S') {
      alert('不能刪除超級管理員');
      return;
    }

    if (window.confirm(`確定要刪除管理員「${user.displayName}」嗎？`)) {
      const success = adminDataManager.deleteUser(user.id);
      if (success) {
        loadUsers();
        alert('管理員刪除成功');
      } else {
        alert('刪除失敗');
      }
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = !user.isActive;
    adminDataManager.updateUser(user.id, { isActive: newStatus });
    loadUsers();
    alert(`管理員已${newStatus ? '啟用' : '停用'}`);
  };

  const handleUnlock = (user) => {
    if (window.confirm(`確定要解鎖管理員「${user.displayName}」嗎？`)) {
      adminDataManager.updateUser(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null
      });
      loadUsers();
      alert('管理員解鎖成功');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.roleId.toString() === roleFilter;
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive) ||
      (statusFilter === 'locked' && user.lockedUntil && new Date(user.lockedUntil) > new Date());
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleSelectOptions = roles.map(role => ({
    value: role.id.toString(),
    label: role.roleName,
    description: `前綴：${role.rolePrefix}`,
    icon: '👤'
  }));

  const isUserLocked = (user) => {
    return user.lockedUntil && new Date(user.lockedUntil) > new Date();
  };

  // 定義表格分析�?
  const columns = [
    {
      key: 'user',
      label: '管理員',
      sortable: true,
      render: (value, user) => (
        <div className="flex items-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 font-chinese">{user.displayName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'employeeId',
      label: '工號',
      sortable: true,
      render: (value) => (
        <span className="px-3 py-1 bg-[#cc824d] text-white rounded-lg text-sm font-bold">
          {value}
        </span>
      )
    },
    {
      key: 'roleId',
      label: '角色',
      sortable: true,
      render: (value) => <span className="text-gray-900 font-chinese">{getRoleName(value)}</span>
    },
    {
      key: 'status',
      label: '狀態',
      sortable: false,
      render: (value, user) => {
        if (isUserLocked(user)) {
          return (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-chinese">
              🔒 已鎖定
            </span>
          );
        } else if (user.isActive) {
          return (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-chinese">
              ✅ 已啟用
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-chinese">
              ❌ 已停用
            </span>
          );
        }
      }
    },
    {
      key: 'lastLoginAt',
      label: '最後登入',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 text-sm font-chinese">
          {value ? new Date(value).toLocaleDateString('zh-TW') : '從未登入'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (value, user) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleOpenModal(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="編輯管理員"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          {isUserLocked(user) ? (
            <button
              onClick={() => handleUnlock(user)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="解鎖帳號"
            >
              <LockOpenIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleToggleStatus(user)}
              className={`p-2 rounded-lg transition-colors ${
                user.isActive 
                  ? 'text-orange-600 hover:bg-orange-50' 
                  : 'text-green-600 hover:bg-green-50'
              }`}
              title={user.isActive ? '?�用帳�?' : '?�用帳�?'}
            >
              {user.isActive ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
            </button>
          )}
          
          {getRolePrefix(user.roleId) !== 'S' && (
            <button
              onClick={() => handleDelete(user)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="刪除管理員"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* ?�面標�? */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UsersIcon className="w-8 h-8 mr-3 text-[#cc824d]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">管理員管理</h1>
            <p className="text-gray-600 font-chinese">管理系統管理員帳號與權限</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-6 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新增管理員
        </button>
      </div>

      {/* 篩選區域 */}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SearchableSelect
              value={roleFilter}
              onChange={setRoleFilter}
              options={roleOptions}
              placeholder="篩選角色"
            />
          </div>
          <div>
            <SearchableSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="篩選狀態"
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 font-chinese">
              共{filteredUsers.length} 位管理員
            </span>
          </div>
        </div>
      </div>

      {/* 管理員列表 */}
      <StandardTable
        data={filteredUsers}
        columns={columns}
        title="管理員列表"
        emptyMessage="沒有找到符合條件的管理員"
        exportFileName="管理員列表"
      />

      {/* 新增/編輯管理員模態框 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? '編輯管理員' : '新增管理員'}
        size="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 基本資料 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              電子信箱 *
              </label>
              <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
              placeholder="example@marelle.com"
              required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              顯示名稱 *
              </label>
              <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
              placeholder="管理員名稱"
              required
              />
            </div>
            </div>

            {/* 角色選擇 */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              角色 *
            </label>
            <SearchableSelect
              value={formData.roleId}
              onChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
              options={roleSelectOptions}
              placeholder="選擇角色"
            />
          </div>

          {/* 分析URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              分析URL
            </label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* 密碼設�? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                密碼 {!editingUser && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  placeholder={editingUser ? '留空表示不修改密碼' : '請設定密碼'}
                  required={!editingUser}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.length > 0 && (
                <div className="mt-2">
                  {passwordErrors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 font-chinese">{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                確�?密碼 {!editingUser && '*'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="?�次輸入密碼"
                required={!editingUser && formData.password}
              />
            </div>
          </div>

          {/* 密碼安全要求提示 */}
          <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-white/30">
            <h4 className="text-sm font-medium text-blue-900 mb-2 font-chinese">密碼安全要求</h4>
            <ul className="text-xs text-blue-700 space-y-1 font-chinese">
              <li>至少8個字元</li>
              <li>必須包含大寫字母</li>
              <li>必須包含小寫字母</li>
              <li>必須包含數字</li>
              <li>必須包含特殊符號</li>
            </ul>
          </div>

          {/* 按鈕 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 border border-white/30 text-gray-700 rounded-xl hover:bg-white/20 transition-colors font-chinese bg-white/50 backdrop-blur-sm"
            >
              分析
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#cc824d]/90 text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese backdrop-blur-sm"
            >
              {editingUser ? '更新管理員' : '建立管理員'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};

export default AdminUserManagement;
