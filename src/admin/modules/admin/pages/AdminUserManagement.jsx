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
import { adminDataManager } from '../data/adminDataManager.js';
import { validatePassword } from '../data/adminConfig.js';
import CustomSelect from '../components/CustomSelect.jsx';
import GlassModal from '../../components/GlassModal.jsx';
import StandardTable from '../../components/StandardTable.jsx';

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
    return role ? role.roleName : '?ªçŸ¥è§’è‰²';
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
      alert('è«‹å¡«å¯«æ??‰å?å¡«æ?ä½?);
      return;
    }

    // ?°å??¨æˆ¶?‚å?ç¢¼ç‚ºå¿…å¡«
    if (!editingUser && !formData.password) {
      alert('è«‹è¨­å®šå?ç¢?);
      return;
    }

    // ç·¨è¼¯?¨æˆ¶?‚ï?å¦‚æ??‰è¼¸?¥å?ç¢¼æ?é©—è?
    if (formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        alert('å¯†ç¢¼ä¸ç¬¦?ˆå??¨è?æ±‚ï?\n' + validation.errors.join('\n'));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('å¯†ç¢¼ç¢ºè?ä¸ä???);
        return;
      }
    }

    // æª¢æŸ¥?µç®±?¯å¦?è?
    const existingUser = adminDataManager.getUserByEmail(formData.email);
    if (existingUser && existingUser.id !== editingUser?.id) {
      alert('æ­¤éƒµç®±å·²è¢«ä½¿??);
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
        
        // ?ªåœ¨?‰è¼¸?¥å?ç¢¼æ??æ›´?°å?ç¢?
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
      alert(editingUser ? 'ç®¡ç??¡æ›´?°æ??? : 'ç®¡ç??¡å‰µå»ºæ???);
    } catch (error) {
      alert('?ä?å¤±æ?ï¼? + error.message);
    }
  };

  const handleDelete = (user) => {
    // æª¢æŸ¥?¯å¦?ºè?ç´šç®¡?†å“¡
    const role = roles.find(r => r.id === user.roleId);
    if (role && role.rolePrefix === 'S') {
      alert('ä¸èƒ½?ªé™¤è¶…ç?ç®¡ç???);
      return;
    }

    if (window.confirm(`ç¢ºå?è¦åˆª?¤ç®¡?†å“¡??{user.displayName}?å?ï¼Ÿ`)) {
      const success = adminDataManager.deleteUser(user.id);
      if (success) {
        loadUsers();
        alert('ç®¡ç??¡åˆª?¤æ???);
      } else {
        alert('?ªé™¤å¤±æ?');
      }
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = !user.isActive;
    adminDataManager.updateUser(user.id, { isActive: newStatus });
    loadUsers();
    alert(`ç®¡ç??¡å·²${newStatus ? '?Ÿç”¨' : '?œç”¨'}`);
  };

  const handleUnlock = (user) => {
    if (window.confirm(`ç¢ºå?è¦è§£?–ç®¡?†å“¡??{user.displayName}?å?ï¼Ÿ`)) {
      adminDataManager.updateUser(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null
      });
      loadUsers();
      alert('ç®¡ç??¡è§£?–æ???);
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
    { value: '', label: '?€?‰è??? },
    ...roles.map(role => ({
      value: role.id.toString(),
      label: role.roleName,
      icon: '??'
    }))
  ];

  const statusOptions = [
    { value: '', label: '?€?‰ç??? },
    { value: 'active', label: '?Ÿç”¨ä¸?, icon: '?? },
    { value: 'inactive', label: 'å·²å???, icon: '?? },
    { value: 'locked', label: 'å·²é?å®?, icon: '??' }
  ];

  const roleSelectOptions = roles.map(role => ({
    value: role.id.toString(),
    label: role.roleName,
    description: `?ç¶´ï¼?{role.rolePrefix}`,
    icon: '??'
  }));

  const isUserLocked = (user) => {
    return user.lockedUntil && new Date(user.lockedUntil) > new Date();
  };

  // å®šç¾©è¡¨æ ¼?—é?ç½?
  const columns = [
    {
      key: 'user',
      label: 'ç®¡ç???,
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
      label: 'å·¥è?',
      sortable: true,
      render: (value) => (
        <span className="px-3 py-1 bg-[#cc824d] text-white rounded-lg text-sm font-bold">
          {value}
        </span>
      )
    },
    {
      key: 'roleId',
      label: 'è§’è‰²',
      sortable: true,
      render: (value) => <span className="text-gray-900 font-chinese">{getRoleName(value)}</span>
    },
    {
      key: 'status',
      label: '?€??,
      sortable: false,
      render: (value, user) => {
        if (isUserLocked(user)) {
          return (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-chinese">
              ?? å·²é?å®?
            </span>
          );
        } else if (user.isActive) {
          return (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-chinese">
              ???Ÿç”¨ä¸?
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-chinese">
              ??å·²å???
            </span>
          );
        }
      }
    },
    {
      key: 'lastLoginAt',
      label: '?€å¾Œç™»??,
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 text-sm font-chinese">
          {value ? new Date(value).toLocaleDateString('zh-TW') : 'å¾æœª?»å…¥'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '?ä?',
      sortable: false,
      render: (value, user) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleOpenModal(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="ç·¨è¼¯ç®¡ç???
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          {isUserLocked(user) ? (
            <button
              onClick={() => handleUnlock(user)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="è§??å¸³è?"
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
              title={user.isActive ? '?œç”¨å¸³è?' : '?Ÿç”¨å¸³è?'}
            >
              {user.isActive ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
            </button>
          )}
          
          {getRolePrefix(user.roleId) !== 'S' && (
            <button
              onClick={() => handleDelete(user)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="?ªé™¤ç®¡ç???
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
      {/* ?é¢æ¨™é? */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UsersIcon className="w-8 h-8 mr-3 text-[#cc824d]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">ç®¡ç??¡ç®¡??/h1>
            <p className="text-gray-600 font-chinese">ç®¡ç?ç³»çµ±ç®¡ç??¡å¸³?Ÿå?æ¬Šé?</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-6 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          ?°å?ç®¡ç???
        </button>
      </div>

      {/* ç¯©é¸??*/}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <CustomSelect
              value={roleFilter}
              onChange={setRoleFilter}
              options={roleOptions}
              placeholder="ç¯©é¸è§’è‰²"
            />
          </div>
          <div>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="ç¯©é¸?€??
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 font-chinese">
              ??{filteredUsers.length} ä½ç®¡?†å“¡
            </span>
          </div>
        </div>
      </div>

      {/* ç®¡ç??¡å?è¡?*/}
      <StandardTable
        data={filteredUsers}
        columns={columns}
        title="ç®¡ç??¡æ???
        emptyMessage="æ²’æ??¾åˆ°ç¬¦å?æ¢ä»¶?„ç®¡?†å“¡"
        exportFileName="ç®¡ç??¡æ???
      />

      {/* ?°å?/ç·¨è¼¯ç®¡ç??¡æ¨¡?‹æ? */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'ç·¨è¼¯ç®¡ç??? : '?°å?ç®¡ç???}
        size="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ?ºæœ¬è³‡è? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                ?µç®± *
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
                é¡¯ç¤º?ç¨± *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="ç®¡ç??¡å???
                required
              />
            </div>
          </div>

          {/* è§’è‰²?¸æ? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              è§’è‰² *
            </label>
            <CustomSelect
              value={formData.roleId}
              onChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
              options={roleSelectOptions}
              placeholder="?¸æ?è§’è‰²"
            />
          </div>

          {/* ?­å?URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
              ?­å?URL
            </label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* å¯†ç¢¼è¨­å? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                å¯†ç¢¼ {!editingUser && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  placeholder={editingUser ? '?™ç©ºè¡¨ç¤ºä¸ä¿®?¹å?ç¢? : 'è«‹è¨­å®šå?ç¢?}
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
                ç¢ºè?å¯†ç¢¼ {!editingUser && '*'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="?æ¬¡è¼¸å…¥å¯†ç¢¼"
                required={!editingUser && formData.password}
              />
            </div>
          </div>

          {/* å¯†ç¢¼å®‰å…¨è¦æ??ç¤º */}
          <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-white/30">
            <h4 className="text-sm font-medium text-blue-900 mb-2 font-chinese">å¯†ç¢¼å®‰å…¨è¦æ?ï¼?/h4>
            <ul className="text-xs text-blue-700 space-y-1 font-chinese">
              <li>???³å?8?‹å???/li>
              <li>???…å«å¤§å¯«å­—æ?</li>
              <li>???…å«å°å¯«å­—æ?</li>
              <li>???…å«?¸å?</li>
              <li>???…å«?¹æ?ç¬¦è?</li>
            </ul>
          </div>

          {/* ?‰é? */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 border border-white/30 text-gray-700 rounded-xl hover:bg-white/20 transition-colors font-chinese bg-white/50 backdrop-blur-sm"
            >
              ?–æ?
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#cc824d]/90 text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese backdrop-blur-sm"
            >
              {editingUser ? '?´æ–°ç®¡ç??? : '?µå»ºç®¡ç???}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};

export default AdminUserManagement;
