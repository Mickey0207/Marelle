import React from 'react';
import { Card } from '../../../components/ui';

const MarketingOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">行銷管理</h1>
        <p className="text-gray-600 mt-1">管理行銷活動和促銷</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600 mt-1">進行中活動</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">8,456</p>
            <p className="text-sm text-gray-600 mt-1">活動參與數</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">15.6%</p>
            <p className="text-sm text-gray-600 mt-1">轉換率</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">NT$ 89,456</p>
            <p className="text-sm text-gray-600 mt-1">活動收入</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">進行中的行銷活動</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">新春特惠活動</p>
              <p className="text-sm text-gray-500">全館商品 8 折優惠</p>
              <p className="text-xs text-gray-400">2024-01-01 ~ 2024-02-15</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-600 rounded-full">
              進行中
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">會員專屬優惠</p>
              <p className="text-sm text-gray-500">VIP 會員額外 9 折</p>
              <p className="text-xs text-gray-400">長期活動</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full">
              常駐
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">行銷管理功能開發中</h3>
          <p className="text-gray-600">
            完整的行銷管理功能正在開發中，包括優惠券、促銷活動、Email 行銷等功能。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MarketingOverview;