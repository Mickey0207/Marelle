import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";
import { DashboardStatsSection, STATS_CATEGORIES } from "../../components/dashboard/DashboardStatsSection";

const LogisticsManagement = () => {
  const [logisticsData, setLogisticsData] = useState({
    shipments: [],
    vehicles: [],
    deliveryStats: {}
  });

  useEffect(() => {
    gsap.fromTo(
      '.logistics-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
    
    loadLogisticsData();
  }, []);

  const loadLogisticsData = () => {
    // 模擬物流數據
    setLogisticsData({
      shipments: [
        {
          id: 1,
          orderNumber: 'ORD-20240115-001',
          customer: '張小明',
          destination: '台北市信義區',
          status: '配送中',
          trackingNumber: 'TW123456789',
          estimatedDelivery: '2024-01-16 14:00',
          driver: '李司機'
        },
        {
          id: 2,
          orderNumber: 'ORD-20240115-002',
          customer: '王小美',
          destination: '新北市板橋區',
          status: '已送達',
          trackingNumber: 'TW123456790',
          estimatedDelivery: '2024-01-15 16:30',
          driver: '陳司機'
        },
        {
          id: 3,
          orderNumber: 'ORD-20240115-003',
          customer: '林先生',
          destination: '桃園市中壢區',
          status: '準備中',
          trackingNumber: 'TW123456791',
          estimatedDelivery: '2024-01-17 10:00',
          driver: '待分配'
        }
      ],
      vehicles: [
        {
          id: 1,
          plateNumber: 'ABC-1234',
          driver: '李司機',
          status: '運送中',
          location: '台北市大安區',
          capacity: '85%',
          nextDelivery: '14:30'
        },
        {
          id: 2,
          plateNumber: 'DEF-5678',
          driver: '陳司機',
          status: '可用',
          location: '物流中心',
          capacity: '0%',
          nextDelivery: '待分配'
        }
      ],
      deliveryStats: {
        todayDeliveries: 24,
        completedDeliveries: 18,
        pendingDeliveries: 6,
        onTimeRate: 92.5
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '已送達':
        return 'bg-green-100 text-green-800';
      case '配送中':
        return 'bg-blue-100 text-blue-800';
      case '準備中':
        return 'bg-yellow-100 text-yellow-800';
      case '延遲':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case '已送達':
        return <CheckCircleIcon className="w-4 h-4" />;
      case '配送中':
        return <TruckIcon className="w-4 h-4" />;
      case '準備中':
        return <ClockIcon className="w-4 h-4" />;
      case '延遲':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ArrowPathIcon className="w-4 h-4" />;
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case '運送中':
        return 'bg-blue-100 text-blue-800';
      case '可用':
        return 'bg-green-100 text-green-800';
      case '維修中':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="logistics-section mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">物流管理</h1>
        <p className="text-gray-600 mt-2">
          管理配送狀況、車輛調度及物流績效
        </p>
      </div>

      {/* 物流統計 */}
      <div className="logistics-section">
        <DashboardStatsSection 
          categories={[STATS_CATEGORIES.LOGISTICS]}
          defaultExpandedCategories={[STATS_CATEGORIES.LOGISTICS]}
          showRefreshButton={true}
          className="mb-8"
        />
      </div>

      {/* 配送概覽 */}
      <div className="logistics-section mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">今日配送概覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">總配送數</p>
                <p className="text-2xl font-bold text-gray-900">{logisticsData.deliveryStats.todayDeliveries}</p>
              </div>
            </div>
          </div>
          
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已完成</p>
                <p className="text-2xl font-bold text-gray-900">{logisticsData.deliveryStats.completedDeliveries}</p>
              </div>
            </div>
          </div>
          
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">待配送</p>
                <p className="text-2xl font-bold text-gray-900">{logisticsData.deliveryStats.pendingDeliveries}</p>
              </div>
            </div>
          </div>
          
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowPathIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">準時率</p>
                <p className="text-2xl font-bold text-gray-900">{logisticsData.deliveryStats.onTimeRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 配送單列表 */}
        <div className="logistics-section xl:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">配送單管理</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="" style={{overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">訂單編號</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">客戶</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">目的地</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">狀態</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">預計送達</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {logisticsData.shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{shipment.orderNumber}</div>
                        <div className="text-sm text-gray-500">{shipment.trackingNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-chinese">{shipment.customer}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="font-chinese">{shipment.destination}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          <span className="ml-1 font-chinese">{shipment.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {shipment.estimatedDelivery}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="查看詳情"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="列印標籤"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 車輛狀態 */}
        <div className="logistics-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">車輛狀態</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {logisticsData.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{vehicle.plateNumber}</h3>
                      <p className="text-sm text-gray-500 font-chinese">司機: {vehicle.driver}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">目前位置:</span>
                      <span className="font-chinese">{vehicle.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">載貨率:</span>
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">下次配送:</span>
                      <span>{vehicle.nextDelivery}</span>
                    </div>
                  </div>
                  
                  {vehicle.capacity !== '0%' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#cc824d] h-2 rounded-full"
                          style={{ width: vehicle.capacity }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsManagement;
