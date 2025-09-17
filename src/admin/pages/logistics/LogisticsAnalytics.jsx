import React, { useState, useEffect } from 'react';
import logisticsDataManager from '../../data/logisticsDataManager';
import SearchableSelect from '../../../components/SearchableSelect';
import StandardTable from '../../components/StandardTable';

const LogisticsAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('cost');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = () => {
    const data = logisticsDataManager.getAnalytics();
    setAnalytics(data);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#fdf8f2] p-6">
        <div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">物流分析報表</h1>
              <p className="text-gray-600">詳細數據分析、成本分析、效率報表、趨勢圖表</p>
            </div>
            <div className="flex gap-3">
              <SearchableSelect
                options={[
                  { value: '7days', label: '最近7天' },
                  { value: '30days', label: '最近30天' },
                  { value: '90days', label: '最近90天' },
                  { value: '1year', label: '最近一年' }
                ]}
                value={dateRange}
                onChange={setDateRange}
                placeholder="選擇時間範圍"
                className="min-w-[140px]"
              />
              <button className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors">
                匯出報表
              </button>
            </div>
          </div>
        </div>

        {/* 關鍵指標卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">總運費成本</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalShippingCost)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">配送成功率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(analytics.deliverySuccessRate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">平均配送時間</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.averageDeliveryTime}天
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">退貨率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(analytics.returnRate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 成本分析 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">成本分析</h2>
            
            <div className="space-y-4">
              {analytics.costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({formatPercentage(item.percentage)})
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">總計</span>
                <span className="text-lg font-bold text-[#cc824d]">
                  {formatCurrency(analytics.costBreakdown.reduce((sum, item) => sum + item.amount, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* 配送方式統計 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">配送方式統計</h2>
            
            <div className="space-y-4">
              {analytics.deliveryMethodStats.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{method.name}</span>
                    <span className="text-gray-500">{method.count} 筆 ({formatPercentage(method.percentage)})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#cc824d] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${method.percentage * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 效率報表 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">效率報表</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analytics.efficiencyMetrics.onTimeDeliveryRate}</p>
                <p className="text-sm text-gray-600">準時送達率</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{analytics.efficiencyMetrics.customerSatisfaction}</p>
                <p className="text-sm text-gray-600">客戶滿意度</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{analytics.efficiencyMetrics.avgProcessingTime}小時</p>
                <p className="text-sm text-gray-600">平均處理時間</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{analytics.efficiencyMetrics.costPerDelivery}</p>
                <p className="text-sm text-gray-600">單筆配送成本</p>
              </div>
            </div>
          </div>

          {/* 趨勢圖表 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">趨勢分析</h2>
            
            <div className="mb-4">
              <SearchableSelect
                options={[
                  { value: 'cost', label: '成本趨勢' },
                  { value: 'volume', label: '出貨量趨勢' },
                  { value: 'efficiency', label: '效率趨勢' }
                ]}
                value={selectedMetric}
                onChange={setSelectedMetric}
                placeholder="選擇指標"
                className="min-w-[140px]"
              />
            </div>
            
            {/* 簡化的趨勢圖表展示 */}
            <div className="space-y-3">
              {analytics.trends[selectedMetric]?.map((point, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-16 text-xs text-gray-500">{point.date}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#cc824d] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(point.value / Math.max(...analytics.trends[selectedMetric].map(p => p.value))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-16 text-xs text-gray-900 text-right">{point.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 詳細數據表格 */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">詳細數據</h2>
          
          <StandardTable
            data={analytics.detailedStats}
            columns={[
              {
                key: 'method',
                label: '配送方式',
                sortable: true,
                render: (_, stat) => (
                  <span className="text-sm font-medium text-gray-900">
                    {stat?.method || 'N/A'}
                  </span>
                )
              },
              {
                key: 'orderCount',
                label: '訂單數量',
                sortable: true,
                render: (_, stat) => (
                  <span className="text-sm text-gray-900">
                    {stat?.orderCount || 0}
                  </span>
                )
              },
              {
                key: 'totalCost',
                label: '總成本',
                sortable: true,
                render: (_, stat) => (
                  <span className="text-sm text-gray-900">
                    {formatCurrency(stat?.totalCost || 0)}
                  </span>
                )
              },
              {
                key: 'avgCost',
                label: '平均成本',
                sortable: true,
                render: (_, stat) => (
                  <span className="text-sm text-gray-900">
                    {formatCurrency(stat?.avgCost || 0)}
                  </span>
                )
              },
              {
                key: 'successRate',
                label: '成功率',
                sortable: true,
                render: (_, stat) => (
                  <span className="text-sm text-gray-900">
                    {formatPercentage(stat?.successRate || 0)}
                  </span>
                )
              }
            ]}
            emptyMessage="沒有找到詳細統計數據"
            exportFileName="logistics_analytics"
          />
        </div>
      </div>
    </div>
  );
};

export default LogisticsAnalytics;