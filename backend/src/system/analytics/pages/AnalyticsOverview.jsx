import React from 'react';
import { Card } from '../../../components/ui';

const AnalyticsOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">數據分析</h1>
        <p className="text-gray-600 mt-1">查看業務數據和趨勢分析</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">NT$ 125,890</p>
            <p className="text-sm text-gray-600 mt-1">本月營收</p>
            <p className="text-xs text-green-600 mt-1">▲ +12.5%</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">456</p>
            <p className="text-sm text-gray-600 mt-1">本月訂單</p>
            <p className="text-xs text-green-600 mt-1">▲ +8.3%</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">8,234</p>
            <p className="text-sm text-gray-600 mt-1">網站訪客</p>
            <p className="text-xs text-red-600 mt-1">▼ -2.1%</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">5.4%</p>
            <p className="text-sm text-gray-600 mt-1">轉換率</p>
            <p className="text-xs text-green-600 mt-1">▲ +0.8%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">銷售趨勢</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">銷售趨勢圖表</p>
              <p className="text-sm text-gray-500">（圖表組件開發中）</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">熱門商品</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">經典白T恤</p>
                  <p className="text-sm text-gray-500">156 件銷售</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">NT$ 15,600</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">牛仔褲</p>
                  <p className="text-sm text-gray-500">89 件銷售</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">NT$ 12,400</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">運動鞋</p>
                  <p className="text-sm text-gray-500">67 件銷售</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">NT$ 18,900</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">訪客分析</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-gray-600">訪客分析圖表</p>
              <p className="text-sm text-gray-500">（圖表組件開發中）</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">收入分析</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-gray-600">收入分析圖表</p>
              <p className="text-sm text-gray-500">（圖表組件開發中）</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">高級分析功能開發中</h3>
          <p className="text-gray-600">
            完整的數據分析功能正在開發中，包括自定義報表、數據匯出、預測分析等功能。
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;