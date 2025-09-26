import React from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';

const AdminManagement = () => {
  return (
    <div className="bg-[#fdf8f2] min-h-screen">
  <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">管理員系統</h1>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold font-chinese mb-4">系統管理</h2>
          <p className="text-gray-600 font-chinese">管理員功能開發中...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
