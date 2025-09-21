import React, { useState, useEffect } from 'react';
import StandardTable from "../../components/ui/StandardTable";
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { adminDataManager } from '../../../shared/data/adminDataManager.js';
import { ADMIN_PERMISSIONS, MODULE_NAMES, OPERATION_NAMES } from '../../../shared/data/adminConfig.js';
import SearchableSelect from '../../components/ui/SearchableSelect';
import GlassModal from '../../components/ui/GlassModal.jsx';

const AdminRoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    roleName: '',
    rolePrefix: '',
    permissions: {}
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    const rolesData = adminDataManager.getAllRoles();
    setRoles(rolesData);
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        roleName: role.roleName,
        rolePrefix: role.rolePrefix,
        permissions: role.permissions || {}
      });
    } else {
      setEditingRole(null);
      setFormData({
        roleName: '',
        rolePrefix: '',
        permissions: {}
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({
      roleName: '',
      rolePrefix: '',
      permissions: {}
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.roleName.trim() || !formData.rolePrefix.trim()) {
      alert('請填寫完整的角色資訊');
      return;
    }

    // 檢查角色前綴是否存在
    const existingRole = roles.find(role => 
      role.rolePrefix.toLowerCase() === formData.rolePrefix.toLowerCase() && 
      role.id !== editingRole?.id
    );
    
    if (existingRole) {
      alert('角色前綴已存在，請使用其他前綴');
      return;
    }

    try {
      if (editingRole) {
        adminDataManager.updateRole(editingRole.id, formData);
      } else {
        adminDataManager.createRole(formData);
      }
      
      loadRoles();
      handleCloseModal();
      alert(editingRole ? '角色更新成功' : '角色建立成功');
    } catch (error) {
      alert('操作失敗：' + error.message);
    }
  };

  const handleDelete = (role) => {
    if (role.isSystemRole) {
      alert('系統角色不能刪除');
      return;
    }

    if (window.confirm(`確定要刪除角色「${role.roleName}」嗎？`)) {
      const success = adminDataManager.deleteRole(role.id);
      if (success) {
        loadRoles();
        alert('角色刪除成功');
      } else {
        alert('刪除失敗，可能有管理員正在使用此角色');
      }
    }
  };

  const handlePermissionChange = (module, operation, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [operation]: value
        }
      }
    }));
  };

  const toggleAllPermissions = (module, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          create: value,
          read: value,
          update: value,
          delete: value
        }
      }
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.rolePrefix.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionCount = (permissions) => {
    let count = 0;
    Object.values(permissions || {}).forEach(module => {
      Object.values(module || {}).forEach(permission => {
        if (permission === true) count++;
      });
    });
    return count;
  };

  return (
    <div className="space-y-6">
      {/* ?�面標�? */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserGroupIcon className="w-8 h-8 mr-3 text-[#cc824d]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">角色管理</h1>
            <p className="text-gray-600 font-chinese">管理系統角色與權限設定</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-6 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新增角色
        </button>
      </div>

      {/* 分析??*/}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="分析角色?�稱分析�?.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
            />
          </div>
        </div>
      </div>

      {/* 角色?�表 */}
      <StandardTable
        data={filteredRoles}
        columns={[
          {
            label: '角色?�稱',
            sortable: true,
            render: (role) => (
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-3 text-[#cc824d]" />
                <span className="font-medium text-gray-900 font-chinese">{role.roleName}</span>
              </div>
            )
          },
          {
            label: '工�??�綴',
            sortable: true,
            render: (role) => (
              <span className="px-3 py-1 bg-[#cc824d] text-white rounded-lg text-sm font-bold">
                {role.rolePrefix}
              </span>
            )
          },
          {
            label: '權�?分析',
            sortable: true,
            render: (role) => (
              <span className="text-gray-900 font-medium">
                {getPermissionCount(role.permissions)}/56
              </span>
            )
          },
          {
            label: '系統角色',
            sortable: true,
            render: (role) => (
              role.isSystemRole ? (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-chinese">
                  系統角色
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-chinese">
                  分析角色
                </span>
              )
            )
          },
          {
            label: '?�建分析',
            sortable: true,
            render: (role) => (
              <span className="text-gray-500 text-sm font-chinese">
                {new Date(role.createdAt).toLocaleDateString('zh-TW')}
              </span>
            )
          },
          {
            label: '分析',
            render: (role) => (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleOpenModal(role)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="編輯角色"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {!role.isSystemRole && (
                  <button
                    onClick={() => handleDelete(role)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="?�除角色"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          }
        ]}
        emptyMessage="沒有找到符合條件的角色"
        exportFileName="admin_roles"
      />

      {/* 新增/編輯角色模態視窗 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRole ? '編輯角色' : '新增角色'}
        size="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                角色名稱 *
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="例如：系統管理員"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                角色前綴 *
              </label>
              <input
                type="text"
                value={formData.rolePrefix}
                onChange={(e) => setFormData(prev => ({ ...prev, rolePrefix: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="例如：ADMIN"
                maxLength="3"
                pattern="[A-Z]{1,3}"
                required
              />
              <p className="text-xs text-gray-500 mt-1 font-chinese">
                分析?�英分析母�?將用分析?�工分析如�?P0001�?
              </p>
            </div>
          </div>

          {/* 權�?設�? */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese flex items-center">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-[#cc824d]" />
              權�?設�?
            </h3>
            
            <div className="space-y-4">
              {Object.entries(ADMIN_PERMISSIONS).map(([module, operations]) => (
                <div key={module} className="border border-white/30 rounded-xl p-4 bg-white/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 font-chinese">
                      {MODULE_NAMES[module]}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleAllPermissions(module, true)}
                        className="text-xs px-2 py-1 bg-green-100/80 text-green-700 rounded font-chinese hover:bg-green-200/80 backdrop-blur-sm"
                      >
                        ?�選
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAllPermissions(module, false)}
                        className="text-xs px-2 py-1 bg-gray-100/80 text-gray-700 rounded font-chinese hover:bg-gray-200/80 backdrop-blur-sm"
                      >
                        分析
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(operations).map(([operation, description]) => (
                      <label key={operation} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions[module]?.[operation] || false}
                          onChange={(e) => handlePermissionChange(module, operation, e.target.checked)}
                          className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                        />
                        <span className="text-sm text-gray-700 font-chinese">
                          {OPERATION_NAMES[operation]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
              {editingRole ? '?�新角色' : '?�建角色'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};

export default AdminRoleManagement;
