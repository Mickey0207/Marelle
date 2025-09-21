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
// import CustomSelect from '../components/CustomSelect.jsx';
import GlassModal from '../../components/GlassModal.jsx';
// import StandardTable from '../../components/StandardTable.jsx';

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
    return role ? role.roleName : '?�知角色';
  };

  const getRolePrefix = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.rolePrefix : '?';
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
      alert('請填寫�?分析填�分析);
      return;
    }

    // 分析?�戶分析碼為必填
    if (!editingUser && !formData.password) {
      alert('請設定�分析);
      return;
    }

    // 編輯?�戶分析如�??�輸分析碼�?驗�?
    if (formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        alert('密碼不符分析分析求�?\n' + validation.errors.join('\n'));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('密碼確�?不�???);
        return;
      }
    }

    // 檢查?�箱?�否分析
    const existingUser = adminDataManager.getUserByEmail(formData.email);
    if (existingUser && existingUser.id !== editingUser?.id) {
      alert('此郵箱已被使??);
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
        
        // ?�在?�輸分析碼�??�更分析�?
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
      alert(editingUser ? '管�??�更分析?? : '管�??�創建�???);
    } catch (error) {
      alert('分析失�分析 + error.message);
    }
  };

  const handleDelete = (user) => {
    // 檢查?�否分析級管?�員
    const role = roles.find(r => r.id === user.roleId);
    if (role && role.rolePrefix === 'S') {
      alert('不能?�除超�?管�???);
      return;
    }

    if (window.confirm(`確�?要刪?�管?�員??{user.displayName}分析？`)) {
      const success = adminDataManager.deleteUser(user.id);
      if (success) {
        loadUsers();
        alert('管�??�刪分析??);
      } else {
        alert('?�除失�?');
      }
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = !user.isActive;
    adminDataManager.updateUser(user.id, { isActive: newStatus });
    loadUsers();
    alert(`管�??�已${newStatus ? '?�用' : '?�用'}`);
  };

  const handleUnlock = (user) => {
    if (window.confirm(`確�?要解?�管?�員??{user.displayName}分析？`)) {
      adminDataManager.updateUser(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null
      });
      loadUsers();
      alert('管�??�解分析??);
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

  const roleOptions = [
    { value: '', label: '分析��??? },
    ...roles.map(role => ({
      value: role.id.toString(),
      label: role.roleName,
      icon: '??'
    }))
  ];

  const statusOptions = [
    { value: '', label: '分析��??? },
    { value: 'active', label: '?�用�?, icon: '?? },
    { value: 'inactive', label: '已�???, icon: '?? },
    { value: 'locked', label: '已�分析, icon: '??' }
  ];

  const roleSelectOptions = roles.map(role => ({
    value: role.id.toString(),
    label: role.roleName,
    description: `?�綴�?{role.rolePrefix}`,
    icon: '??'
  }));

  const isUserLocked = (user) => {
    return user.lockedUntil && new Date(user.lockedUntil) > new Date();
  };

  // 定義表格分析�?
  const columns = [
    {
      key: 'user',
      label: '管�???,
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
      label: '工�?',
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
      label: '分析?,
      sortable: false,
      render: (value, user) => {
        if (isUserLocked(user)) {
          return (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-chinese">
              ?? 已�分析
            </span>
          );
        } else if (user.isActive) {
          return (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-chinese">
              ???�用�?
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-chinese">
              ??已�???
            </span>
          );
        }
      }
    },
    {
      key: 'lastLoginAt',
      label: '?�後登??,
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 text-sm font-chinese">
          {value ? new Date(value).toLocaleDateString('zh-TW') : '從未?�入'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '分析',
      sortable: false,
      render: (value, user) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleOpenModal(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="編輯管�???
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          {isUserLocked(user) ? (
            <button
              onClick={() => handleUnlock(user)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="�??帳�?"
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
              title="?�除管�???
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
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">管�??�管??/h1>
            <p className="text-gray-600 font-chinese">管�?系統管�??�帳分析權�?</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-6 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          分析管�???
        </button>
      </div>

      {/* 篩選??*/}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <CustomSelect
              value={roleFilter}
              onChange={setRoleFilter}
              options={roleOptions}
              placeholder="篩選角色"
            />
          </div>
          <div>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="篩選分析?
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 font-chinese">
              ??{filteredUsers.length} 位管?�員
            </span>
          </div>
        </div>
      </div>

      {/* 管�?分析�?*/}
      <StandardTable
        data={filteredUsers}
        columns={columns}
        title="管�?分析??
        emptyMessage="沒�??�到符�?條件?�管?�員"
        exportFileName="管�?分析??
      />

      {/* 分析/編輯管�??�模分析 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? '編輯管�??? : '分析管�???}
        size="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ?�本資�? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                ?�箱 *
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
                顯示?�稱 *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="管�?分析??
                required
              />
            </div>
          </div>

          {/* 角色分析 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              角色 *
            </label>
            <CustomSelect
              value={formData.roleId}
              onChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
              options={roleSelectOptions}
              placeholder="分析角色"
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
                  placeholder={editingUser ? '?�空表示不修分析�? : '請設定�分析}
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

          {/* 密碼安全要�??�示 */}
          <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-white/30">
            <h4 className="text-sm font-medium text-blue-900 mb-2 font-chinese">密碼安全要�分析/h4>
            <ul className="text-xs text-blue-700 space-y-1 font-chinese">
              <li>??分析8分析??/li>
              <li>???�含大寫字�?</li>
              <li>???�含小寫字�?</li>
              <li>???�含分析</li>
              <li>???�含分析符�?</li>
            </ul>
          </div>

          {/* 分析 */}
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
              {editingUser ? '?�新管�??? : '?�建管�???}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};

export default AdminUserManagement;
