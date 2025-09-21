import React, { useState } from 'react';
import { ADMIN_STYLES } from '../../../shared/styles/adminStyles';
import {
  TicketIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const CouponManagementContainer = () => {
  const [view, setView] = useState('overview'); // 'overview' 或 'list'

  // 模擬優惠券數據
  const mockCoupons = [
    {
      id: 1,
      name: '新年特惠',
      code: 'NEW2024',
      type: 'percentage',
      value: 20,
      status: 'active',
      usageCount: 45,
      validTo: '2024-01-31'
    },
    {
      id: 2,
      name: '免運優惠',
      code: 'FREESHIP',
      type: 'free_shipping',
      value: 0,
      status: 'active',
      usageCount: 123,
      validTo: '2024-12-31'
    },
    {
      id: 3,
      name: '聖誕特惠',
      code: 'XMAS50',
      type: 'fixed_amount',
      value: 50,
      status: 'expired',
      usageCount: 89,
      validTo: '2023-12-25'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      active: '啟用中',
      expired: '已過期',
      inactive: '停用'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeText = (type) => {
    const types = {
      percentage: '百分比折扣',
      fixed_amount: '固定金額',
      free_shipping: '免運費'
    };
    return types[type] || type;
  };

  const renderOverview = () => (
    <>
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={ADMIN_STYLES.statsCard}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-[#cc824d]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">總優惠券數量</p>
              <p className="text-2xl font-bold text-gray-900">{mockCoupons.length}</p>
            </div>
          </div>
        </div>

        <div className={ADMIN_STYLES.statsCard}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">啟用中</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCoupons.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className={ADMIN_STYLES.statsCard}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">總使用次數</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCoupons.reduce((sum, c) => sum + c.usageCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className={ADMIN_STYLES.statsCard}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-[#cc824d]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">節省金額</p>
              <p className="text-2xl font-bold text-gray-900">NT$ 58,400</p>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className={ADMIN_STYLES.contentCard + " mb-6"}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setView('list')}
              className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <TicketIcon className="h-8 w-8 text-[#cc824d] mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">查看優惠券列表</h3>
                  <p className="text-sm text-gray-600">管理所有優惠券</p>
                </div>
              </div>
            </button>

            <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <PlusIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">建立新優惠券</h3>
                  <p className="text-sm text-gray-600">快速建立各種類型的優惠券</p>
                </div>
              </div>
            </button>

            <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">查看使用統計</h3>
                  <p className="text-sm text-gray-600">分析優惠券使用效果</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活動</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">新年特惠優惠券已啟用</p>
                  <p className="text-xs text-gray-500">2 小時前</p>
                </div>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">已啟用</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">免運優惠券使用 50 次</p>
                  <p className="text-xs text-gray-500">5 小時前</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">使用中</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">聖誕節優惠券即將到期</p>
                  <p className="text-xs text-gray-500">1 天前</p>
                </div>
              </div>
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">即將到期</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderList = () => (
    <>
      {/* 列表工具欄 */}
      <div className={ADMIN_STYLES.contentCard + " mb-6"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('overview')}
              className="text-sm text-gray-600 hover:text-[#cc824d] transition-colors"
            >
              ← 返回概覽
            </button>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋優惠券..."
                className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>
          <button className={ADMIN_STYLES.primaryButton}>
            <PlusIcon className="w-4 h-4 mr-2" />
            新增優惠券
          </button>
        </div>
      </div>

      {/* 優惠券列表 */}
      <div className={ADMIN_STYLES.contentCard}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優惠券
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  類型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  折扣
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用次數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  有效期限
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                      <div className="text-sm text-gray-500">{coupon.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getTypeText(coupon.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : 
                       coupon.type === 'free_shipping' ? '免運費' : `NT$ ${coupon.value}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{coupon.usageCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{coupon.validTo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors" title="查看">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors" title="編輯">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="刪除">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        {/* 頁面標題 */}
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>優惠券管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理和追蹤所有優惠券活動</p>
        </div>

        {view === 'overview' ? renderOverview() : renderList()}
      </div>
    </div>
  );
};

export default CouponManagementContainer;