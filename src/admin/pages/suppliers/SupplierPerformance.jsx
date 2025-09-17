import React, { useState, useEffect } from 'react';
import StandardTable from '../../components/StandardTable';
import supplierDataManager, { SupplierGrade } from '../../data/supplierDataManager';
import {
  ChartBarIcon,
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const SupplierPerformance = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');

  useEffect(() => {
    loadData();
  }, [selectedSupplier, selectedPeriod]);

  const loadData = () => {
    const allSuppliers = supplierDataManager.getAllSuppliers();
    setSuppliers(allSuppliers);

    if (selectedSupplier) {
      const performances = supplierDataManager.getSupplierPerformances(selectedSupplier);
      const filteredPerformances = performances.filter(p => p.evaluationType === selectedPeriod);
      setPerformanceData(filteredPerformances);
      
      if (filteredPerformances.length > 0) {
        calculateSummaryStats(filteredPerformances);
      }
    } else {
      // 載入所有供應商的最新績效資料
      const allPerformances = [];
      allSuppliers.forEach(supplier => {
        const latestPerformance = supplier.latestPerformance;
        if (latestPerformance) {
          allPerformances.push({
            ...latestPerformance,
            supplierName: supplier.companyName,
            supplierGrade: supplier.grade
          });
        }
      });
      setPerformanceData(allPerformances);
      calculateOverallStats(allPerformances);
    }
  };

  const calculateSummaryStats = (performances) => {
    if (performances.length === 0) return;

    const latest = performances[0];
    const previous = performances[1];

    const stats = {
      currentRating: latest.overallRating,
      ratingTrend: previous ? latest.overallRating - previous.overallRating : 0,
      onTimeDelivery: latest.onTimeDeliveryRate,
      deliveryTrend: previous ? latest.onTimeDeliveryRate - previous.onTimeDeliveryRate : 0,
      qualityPass: latest.qualityPassRate,
      qualityTrend: previous ? latest.qualityPassRate - previous.qualityPassRate : 0,
      defectRate: latest.defectRate,
      defectTrend: previous ? latest.defectRate - previous.defectRate : 0,
      performanceCount: performances.length
    };

    setSummaryStats(stats);
  };

  const calculateOverallStats = (performances) => {
    if (performances.length === 0) return;

    const stats = {
      totalSuppliers: performances.length,
      averageRating: performances.reduce((sum, p) => sum + p.overallRating, 0) / performances.length,
      averageOnTimeDelivery: performances.reduce((sum, p) => sum + p.onTimeDeliveryRate, 0) / performances.length,
      averageQualityPass: performances.reduce((sum, p) => sum + p.qualityPassRate, 0) / performances.length,
      topPerformers: performances.filter(p => p.overallRating >= 4.5).length,
      needsImprovement: performances.filter(p => p.overallRating < 3.0).length
    };

    setSummaryStats(stats);
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        ))}
        {hasHalfStar && <StarIconSolid className="w-4 h-4 text-yellow-400 opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getGradeBadge = (grade) => {
    const gradeConfig = {
      [SupplierGrade.A_STRATEGIC]: { label: 'A級', className: 'bg-purple-100 text-purple-800' },
      [SupplierGrade.B_PREFERRED]: { label: 'B級', className: 'bg-blue-100 text-blue-800' },
      [SupplierGrade.C_QUALIFIED]: { label: 'C級', className: 'bg-green-100 text-green-800' },
      [SupplierGrade.D_CONDITIONAL]: { label: 'D級', className: 'bg-yellow-100 text-yellow-800' },
      [SupplierGrade.E_UNQUALIFIED]: { label: 'E級', className: 'bg-red-100 text-red-800' }
    };

    const config = gradeConfig[grade];
    return config ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    ) : null;
  };

  const getPerformanceColor = (value, type = 'rating') => {
    if (type === 'rating') {
      if (value >= 4.5) return 'text-green-600';
      if (value >= 3.5) return 'text-yellow-600';
      return 'text-red-600';
    } else if (type === 'percentage') {
      if (value >= 95) return 'text-green-600';
      if (value >= 85) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  // 定義表格列配置
  const columns = [
    {
      key: 'supplier',
      label: selectedSupplier ? '評估期間' : '供應商',
      sortable: true,
      render: (performance) => (
        selectedSupplier ? (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {performance.evaluationPeriod?.start} ~ {performance.evaluationPeriod?.end}
            </div>
            <div className="text-xs text-gray-500">
              {performance.evaluationType === 'quarterly' ? '季度評估' : '年度評估'}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {performance.supplierName}
            </div>
            <div className="text-xs text-gray-500">
              {getGradeBadge(performance.supplierGrade)}
            </div>
          </div>
        )
      )
    },
    {
      key: 'overallRating',
      label: '總體評分',
      sortable: true,
      render: (performance) => (
        <div className="flex items-center space-x-2">
          {renderStarRating(performance.overallRating)}
        </div>
      )
    },
    {
      key: 'qualityScore',
      label: '品質評分',
      sortable: true,
      render: (performance) => (
        <span className={`text-sm font-medium ${getPerformanceColor(performance.qualityScore)}`}>
          {performance.qualityScore.toFixed(1)}
        </span>
      )
    },
    {
      key: 'deliveryScore',
      label: '交期評分',
      sortable: true,
      render: (performance) => (
        <span className={`text-sm font-medium ${getPerformanceColor(performance.deliveryScore)}`}>
          {performance.deliveryScore.toFixed(1)}
        </span>
      )
    },
    {
      key: 'serviceScore',
      label: '服務評分',
      sortable: true,
      render: (performance) => (
        <span className={`text-sm font-medium ${getPerformanceColor(performance.serviceScore)}`}>
          {performance.serviceScore.toFixed(1)}
        </span>
      )
    },
    {
      key: 'onTimeDeliveryRate',
      label: '準時交貨率',
      sortable: true,
      render: (performance) => (
        <span className={`text-sm font-medium ${getPerformanceColor(performance.onTimeDeliveryRate, 'percentage')}`}>
          {performance.onTimeDeliveryRate.toFixed(1)}%
        </span>
      )
    },
    {
      key: 'qualityPassRate',
      label: '品質合格率',
      sortable: true,
      render: (performance) => (
        <span className={`text-sm font-medium ${getPerformanceColor(performance.qualityPassRate, 'percentage')}`}>
          {performance.qualityPassRate.toFixed(1)}%
        </span>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (performance) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          performance.status === 'completed' ? 'bg-green-100 text-green-800' : 
          performance.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {performance.status === 'completed' ? '已完成' : 
           performance.status === 'approved' ? '已核准' : '進行中'}
        </span>
      )
    }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題和篩選 */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">供應商績效評估</h1>
          
          <div className="flex space-x-4">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="">全部供應商</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.companyName}
                </option>
              ))}
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="quarterly">季度評估</option>
              <option value="annual">年度評估</option>
            </select>
          </div>
        </div>
      </div>

      {/* 績效統計卡片 */}
      {selectedSupplier ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">總體評分</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(summaryStats.currentRating)}`}>
                  {summaryStats.currentRating?.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(summaryStats.ratingTrend)}
                <span className={`text-sm ${summaryStats.ratingTrend > 0 ? 'text-green-600' : summaryStats.ratingTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {summaryStats.ratingTrend ? (summaryStats.ratingTrend > 0 ? '+' : '') + summaryStats.ratingTrend.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">準時交貨率</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(summaryStats.onTimeDelivery, 'percentage')}`}>
                  {summaryStats.onTimeDelivery?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(summaryStats.deliveryTrend)}
                <span className={`text-sm ${summaryStats.deliveryTrend > 0 ? 'text-green-600' : summaryStats.deliveryTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {summaryStats.deliveryTrend ? (summaryStats.deliveryTrend > 0 ? '+' : '') + summaryStats.deliveryTrend.toFixed(1) : '0.0'}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">品質合格率</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(summaryStats.qualityPass, 'percentage')}`}>
                  {summaryStats.qualityPass?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(summaryStats.qualityTrend)}
                <span className={`text-sm ${summaryStats.qualityTrend > 0 ? 'text-green-600' : summaryStats.qualityTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {summaryStats.qualityTrend ? (summaryStats.qualityTrend > 0 ? '+' : '') + summaryStats.qualityTrend.toFixed(1) : '0.0'}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">不良品率</p>
                <p className={`text-2xl font-bold ${summaryStats.defectRate <= 2 ? 'text-green-600' : summaryStats.defectRate <= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {summaryStats.defectRate?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(-summaryStats.defectTrend)} {/* 不良品率下降是好事 */}
                <span className={`text-sm ${summaryStats.defectTrend < 0 ? 'text-green-600' : summaryStats.defectTrend > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {summaryStats.defectTrend ? (summaryStats.defectTrend > 0 ? '+' : '') + summaryStats.defectTrend.toFixed(1) : '0.0'}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">總供應商</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalSuppliers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">優秀供應商</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.topPerformers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">平均評分</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.averageRating ? summaryStats.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">需改善</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.needsImprovement || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 績效表格 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <StandardTable
          data={performanceData}
          columns={columns}
          emptyMessage="沒有績效評估資料"
          emptyDescription={selectedSupplier ? '此供應商尚無績效評估記錄' : '系統中暫無績效評估資料'}
          emptyIcon={ChartBarIcon}
        />
      </div>
    </div>
  );
};

export default SupplierPerformance;