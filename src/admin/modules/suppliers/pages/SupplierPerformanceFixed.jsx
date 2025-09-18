import React, { useState } from 'react';
import {
  ChartBarIcon,
  StarIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const SupplierPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [sortBy, setSortBy] = useState('rating');

  // 模擬績效數據
  const performanceStats = {
    totalSuppliers: 156,
    activeSuppliers: 142,
    avgRating: 4.3,
    onTimeDelivery: 87.5
  };

  const suppliers = [
    {
      id: 1,
      name: '優質材料公司',
      category: '原材料',
      rating: 4.8,
      onTimeRate: 96,
      defectRate: 0.5,
      totalOrders: 245,
      totalValue: 2580000,
      trend: 'up',
      riskLevel: 'low'
    },
    {
      id: 2,
      name: '精密零件供應商',
      category: '零件',
      rating: 4.6,
      onTimeRate: 92,
      defectRate: 1.2,
      totalOrders: 189,
      totalValue: 1890000,
      trend: 'stable',
      riskLevel: 'low'
    },
    {
      id: 3,
      name: '快速物流有限公司',
      category: '物流',
      rating: 4.2,
      onTimeRate: 85,
      defectRate: 2.1,
      totalOrders: 156,
      totalValue: 980000,
      trend: 'down',
      riskLevel: 'medium'
    },
    {
      id: 4,
      name: '標準包裝材料',
      category: '包裝',
      rating: 3.9,
      onTimeRate: 78,
      defectRate: 3.5,
      totalOrders: 98,
      totalValue: 560000,
      trend: 'down',
      riskLevel: 'high'
    }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">供應商績效管理</h1>
        <p className="text-blue-100">全面監控和管理供應商績效評估資訊</p>
      </div>

      {/* 績效統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">總供應商</div>
          <div className="text-2xl font-bold text-gray-900">{performanceStats.totalSuppliers}</div>
          <div className="flex items-center mt-2">
            <ChartBarIcon className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-xs text-gray-500">合作夥伴</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">活躍供應商</div>
          <div className="text-2xl font-bold text-green-600">{performanceStats.activeSuppliers}</div>
          <div className="flex items-center mt-2">
            <TruckIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-xs text-gray-500">正在合作</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">平均評分</div>
          <div className="text-2xl font-bold text-amber-600">{performanceStats.avgRating}</div>
          <div className="flex items-center mt-2">
            <StarIcon className="w-4 h-4 text-amber-500 mr-1" />
            <span className="text-xs text-gray-500">滿分5分</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">準時交付率</div>
          <div className="text-2xl font-bold text-purple-600">{performanceStats.onTimeDelivery}%</div>
          <div className="flex items-center mt-2">
            <TruckIcon className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-xs text-gray-500">本月統計</span>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">供應商績效排行</h2>
          
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">本週</option>
              <option value="month">本月</option>
              <option value="quarter">本季</option>
              <option value="year">本年</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">評分排序</option>
              <option value="onTime">準時率排序</option>
              <option value="value">交易額排序</option>
              <option value="defect">瑕疵率排序</option>
            </select>
          </div>
        </div>

        {/* 供應商列表 */}
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {supplier.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(supplier.riskLevel)}`}>
                      {supplier.riskLevel === 'low' ? '低風險' : 
                       supplier.riskLevel === 'medium' ? '中風險' : '高風險'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">評分:</span>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="font-medium">{supplier.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">準時率:</span>
                      <span className="font-medium text-green-600">{supplier.onTimeRate}%</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">瑕疵率:</span>
                      <span className="font-medium text-red-600">{supplier.defectRate}%</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">訂單數:</span>
                      <span className="font-medium">{supplier.totalOrders}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">交易額:</span>
                      <span className="font-medium">NT$ {supplier.totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {getTrendIcon(supplier.trend)}
                  {supplier.riskLevel === 'high' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 績效改善建議 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">績效改善建議</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">注意事項</p>
              <p className="text-sm text-amber-700">
                標準包裝材料的準時交付率低於80%，建議進行供應商評估會議
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <TruckIcon className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">優化建議</p>
              <p className="text-sm text-blue-700">
                可考慮與優質材料公司擴大合作，其績效指標表現優異
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierPerformance;