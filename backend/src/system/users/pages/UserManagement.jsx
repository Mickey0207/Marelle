import React from 'react';
import { Card } from '../../../components/ui';

const UserManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">用戶管理</h1>
        <p className="text-gray-600 mt-1">管理系統用戶和權限</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-600 mt-1">系統用戶</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-600 mt-1">在線用戶</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">8</p>
            <p className="text-sm text-gray-600 mt-1">權限角色</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">系統用戶列表</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">A</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">系統管理員</p>
                <p className="text-sm text-gray-500">admin@marelle.com</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-600 rounded-full">
              超級管理員
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium">M</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">商品管理員</p>
                <p className="text-sm text-gray-500">product@marelle.com</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full">
              商品管理
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">用戶管理功能開發中</h3>
          <p className="text-gray-600">
            完整的用戶管理功能正在開發中，包括角色權限、用戶組、操作日誌等功能。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;