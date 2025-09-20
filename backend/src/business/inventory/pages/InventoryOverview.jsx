import React from 'react';
import { Card } from '../../../components/ui';

const InventoryOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">庫存管理</h1>
        <p className="text-gray-600 mt-1">監控和管理商品庫存</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">1,234</p>
            <p className="text-sm text-gray-600 mt-1">總商品數</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">956</p>
            <p className="text-sm text-gray-600 mt-1">有庫存</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">67</p>
            <p className="text-sm text-gray-600 mt-1">庫存不足</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">23</p>
            <p className="text-sm text-gray-600 mt-1">缺貨</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">庫存警報</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-red-900">連帽外套 (HO-004)</p>
              <p className="text-sm text-red-600">庫存：0 件 - 缺貨</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-600 rounded-full">
              緊急
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <p className="font-medium text-yellow-900">經典白T恤 (WT-001)</p>
              <p className="text-sm text-yellow-600">庫存：15 件 - 庫存不足</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-600 rounded-full">
              警告
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">庫存管理功能開發中</h3>
          <p className="text-gray-600">
            完整的庫存管理功能正在開發中，包括入庫、出庫、盤點等功能。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default InventoryOverview;