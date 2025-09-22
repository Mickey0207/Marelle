import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  CubeIcon,
  TruckIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";
import { DashboardStatsSection, STATS_CATEGORIES } from "../../components/dashboard/DashboardStatsSection";
// withPageTabs HOC 已移除，子頁籤導航統一在頂部管理

const OperationsManagement = () => {
  const [operationsData, setOperationsData] = useState({
    alerts: [],
    inventoryStatus: [],
    staffPerformance: [],
    recentActivities: []
  });

  useEffect(() => {
    gsap.fromTo(
      '.operations-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
    
    loadOperationsData();
  }, []);

  const loadOperationsData = () => {
    // 模擬營運數據
    setOperationsData({
      alerts: [
        { id: 1, type: 'inventory', message: '商品庫存不足', status: 'critical', timestamp: new Date() },
        { id: 2, type: 'shipping', message: '配送延遲警告', status: 'warning', timestamp: new Date() },
        { id: 3, type: 'system', message: '系統運行正常', status: 'normal', timestamp: new Date() }
      ],
      inventoryStatus: [
        { category: '服飾類', total: 1250, available: 980, reserved: 270, lowStock: 15 },
        { category: '配件類', total: 650, available: 520, reserved: 130, lowStock: 8 },
        { category: '鞋類', total: 430, available: 360, reserved: 70, lowStock: 5 }
      ],
      staffPerformance: [
        { name: '王小明', department: '客服', efficiency: 92, tasks: 45 },
        { name: '李小華', department: '倉儲', efficiency: 88, tasks: 38 },
        { name: '張小美', department: '配送', efficiency: 95, tasks: 52 }
      ],
      recentActivities: [
        { time: '10:30', action: '新訂單處理', user: '系統自動', status: 'completed' },
        { time: '10:15', action: '庫存更新', user: '王小明', status: 'completed' },
        { time: '09:45', action: '客戶查詢回覆', user: '李小華', status: 'in-progress' }
      ]
    });
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'inventory':
        return <CubeIcon className="w-5 h-5" />;
      case 'shipping':
        return <TruckIcon className="w-5 h-5" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5" />;
    }
  };

  const getAlertColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="operations-section mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">營運管理</h1>
        <p className="text-gray-600 mt-2">
          監控日常營運狀況、庫存管理及團隊績效
        </p>
      </div>

      {/* 營運統計 */}
      <div className="operations-section">
        <DashboardStatsSection 
          categories={[STATS_CATEGORIES.OPERATIONAL]}
          defaultExpandedCategories={[STATS_CATEGORIES.OPERATIONAL]}
          showRefreshButton={true}
          className="mb-8"
        />
      </div>

      {/* 警報和通知 */}
      <div className="operations-section mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">系統警報</h2>
        <div className="grid grid-cols-1 gap-4">
          {operationsData.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`${ADMIN_STYLES.glassCard} border-l-4 ${getAlertColor(alert.status)}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getAlertColor(alert.status).replace('bg-', 'bg-').replace('100', '200')}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 font-chinese">{alert.message}</p>
                  <p className="text-sm text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.status === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status === 'critical' ? '緊急' :
                     alert.status === 'warning' ? '警告' : '正常'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 庫存狀況 */}
        <div className="operations-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">庫存狀況</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-6">
              {operationsData.inventoryStatus.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 font-chinese">{item.category}</h3>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">可用: {item.available}</span>
                      <span className="text-yellow-600">預留: {item.reserved}</span>
                      <span className="text-red-600">低庫存: {item.lowStock}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#cc824d] h-2 rounded-full"
                      style={{ width: `${(item.available / item.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    總計: {item.total} 件
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 員工績效 */}
        <div className="operations-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">員工績效</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {operationsData.staffPerformance.map((staff, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#cc824d] rounded-full flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 font-chinese">{staff.name}</h3>
                      <p className="text-sm text-gray-500">{staff.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-[#cc824d]">{staff.efficiency}%</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <ChartBarIcon className="w-4 h-4 mr-1" />
                        {staff.tasks} 任務
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 最近活動 */}
      <div className="operations-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">最近活動</h2>
        <div className={ADMIN_STYLES.glassCard}>
          <div className="space-y-4">
            {operationsData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-sm text-gray-500 w-16">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 font-chinese">{activity.action}</p>
                  <p className="text-sm text-gray-500">執行者: {activity.user}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status === 'completed' ? (
                      <>
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        已完成
                      </>
                    ) : activity.status === 'in-progress' ? (
                      <>
                        <ClockIcon className="w-3 h-3 mr-1" />
                        進行中
                      </>
                    ) : (
                      '等待中'
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsManagement;
