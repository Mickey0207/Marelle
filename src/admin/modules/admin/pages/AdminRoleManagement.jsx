import React, { useState, useEffect } from 'react';
import StandardTable from "@shared/components/StandardTable";
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { adminDataManager } from '../data/adminDataManager.js';
import { ADMIN_PERMISSIONS, MODULE_NAMES, OPERATION_NAMES } from '../data/adminConfig.js';
import CustomSelect from '../components/CustomSelect.jsx';
import GlassModal from '../../components/GlassModal.jsx';

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
      alert('Ë´ãÂ°´ÂØ´Ê??âÂ?Â°´Ê?‰Ω?);
      return;
    }

    // Ê™¢Êü•ËßíËâ≤?çÁ∂¥?ØÂê¶?çË?
    const existingRole = roles.find(role => 
      role.rolePrefix.toLowerCase() === formData.rolePrefix.toLowerCase() && 
      role.id !== editingRole?.id
    );
    
    if (existingRole) {
      alert('ËßíËâ≤?çÁ∂¥Â∑≤Â??®Ô?Ë´ã‰Ωø?®ÂÖ∂‰ªñÂ?Á∂?);
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
      alert(editingRole ? 'ËßíËâ≤?¥Êñ∞?êÂ?' : 'ËßíËâ≤?µÂª∫?êÂ?');
    } catch (error) {
      alert('?ç‰?Â§±Ê?Ôº? + error.message);
    }
  };

  const handleDelete = (role) => {
    if (role.isSystemRole) {
      alert('Á≥ªÁµ±ËßíËâ≤‰∏çËÉΩ?™Èô§');
      return;
    }

    if (window.confirm(`Á¢∫Â?Ë¶ÅÂà™?§Ë??≤„Ä?{role.roleName}?çÂ?Ôºü`)) {
      const success = adminDataManager.deleteRole(role.id);
      if (success) {
        loadRoles();
        alert('ËßíËâ≤?™Èô§?êÂ?');
      } else {
        alert('?™Èô§Â§±Ê?ÔºåÂèØ?ΩÊ?ÁÆ°Á??°Ê≠£?®‰Ωø?®Ê≠§ËßíËâ≤');
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
      {/* ?ÅÈù¢Ê®ôÈ? */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserGroupIcon className="w-8 h-8 mr-3 text-[#cc824d]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">ËßíËâ≤ÁÆ°Á?</h1>
            <p className="text-gray-600 font-chinese">ÁÆ°Á?Á≥ªÁµ±ËßíËâ≤?åÊ??êË®≠ÂÆ?/p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-6 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          ?∞Â?ËßíËâ≤
        </button>
      </div>

      {/* ?úÂ???*/}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="?úÂ?ËßíËâ≤?çÁ®±?ñÂ?Á∂?.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
            />
          </div>
        </div>
      </div>

      {/* ËßíËâ≤?óË°® */}
      <StandardTable
        data={filteredRoles}
        columns={[
          {
            label: 'ËßíËâ≤?çÁ®±',
            sortable: true,
            render: (role) => (
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-3 text-[#cc824d]" />
                <span className="font-medium text-gray-900 font-chinese">{role.roleName}</span>
              </div>
            )
          },
          {
            label: 'Â∑•Ë??çÁ∂¥',
            sortable: true,
            render: (role) => (
              <span className="px-3 py-1 bg-[#cc824d] text-white rounded-lg text-sm font-bold">
                {role.rolePrefix}
              </span>
            )
          },
          {
            label: 'Ê¨äÈ??∏È?',
            sortable: true,
            render: (role) => (
              <span className="text-gray-900 font-medium">
                {getPermissionCount(role.permissions)}/56
              </span>
            )
          },
          {
            label: 'Á≥ªÁµ±ËßíËâ≤',
            sortable: true,
            render: (role) => (
              role.isSystemRole ? (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-chinese">
                  Á≥ªÁµ±ËßíËâ≤
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-chinese">
                  ?™Ë?ËßíËâ≤
                </span>
              )
            )
          },
          {
            label: '?µÂª∫?ÇÈ?',
            sortable: true,
            render: (role) => (
              <span className="text-gray-500 text-sm font-chinese">
                {new Date(role.createdAt).toLocaleDateString('zh-TW')}
              </span>
            )
          },
          {
            label: '?ç‰?',
            render: (role) => (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleOpenModal(role)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Á∑®ËºØËßíËâ≤"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {!role.isSystemRole && (
                  <button
                    onClick={() => handleDelete(role)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="?™Èô§ËßíËâ≤"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          }
        ]}
        emptyMessage="Ê≤íÊ??æÂà∞Á¨¶Â?Ê¢ù‰ª∂?ÑË???
        exportFileName="admin_roles"
      />

      {/* ?∞Â?/Á∑®ËºØËßíËâ≤Ê®°Ê?Ê°?*/}
      <GlassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRole ? 'Á∑®ËºØËßíËâ≤' : '?∞Â?ËßíËâ≤'}
        size="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ?∫Êú¨Ë≥áË? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                ËßíËâ≤?çÁ®± *
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="‰æãÔ??ÜÂ?ÁÆ°Á???
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                Â∑•Ë??çÁ∂¥ *
              </label>
              <input
                type="text"
                value={formData.rolePrefix}
                onChange={(e) => setFormData(prev => ({ ...prev, rolePrefix: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                placeholder="‰æãÔ?P"
                maxLength="3"
                pattern="[A-Z]{1,3}"
                required
              />
              <p className="text-xs text-gray-500 mt-1 font-chinese">
                ?ÄÂ§??ãËã±?áÂ?ÊØçÔ?Â∞áÁî®?ºÁ??êÂ∑•?üÔ?Â¶ÇÔ?P0001Ôº?
              </p>
            </div>
          </div>

          {/* Ê¨äÈ?Ë®≠Â? */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese flex items-center">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-[#cc824d]" />
              Ê¨äÈ?Ë®≠Â?
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
                        ?®ÈÅ∏
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAllPermissions(module, false)}
                        className="text-xs px-2 py-1 bg-gray-100/80 text-gray-700 rounded font-chinese hover:bg-gray-200/80 backdrop-blur-sm"
                      >
                        ?®Ê?
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

          {/* ?âÈ? */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 border border-white/30 text-gray-700 rounded-xl hover:bg-white/20 transition-colors font-chinese bg-white/50 backdrop-blur-sm"
            >
              ?ñÊ?
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#cc824d]/90 text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese backdrop-blur-sm"
            >
              {editingRole ? '?¥Êñ∞ËßíËâ≤' : '?µÂª∫ËßíËâ≤'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};

export default AdminRoleManagement;
