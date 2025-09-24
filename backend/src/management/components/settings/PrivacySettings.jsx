import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { userTrackingDataManager } from '../../../lib/data/analytics/userTrackingDataManager';

const PrivacySettings = () => {
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('consent');
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
    personalization: true
  });

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    try {
      setLoading(true);
      const data = await userTrackingDataManager.getPrivacySettings();
      setPrivacyData(data);
    } catch (error) {
      console.error('載入隱私權設定失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataRequest = async (requestType, userId = 'demo-user') => {
    try {
      const result = await userTrackingDataManager.processDataRequest(requestType, userId);
      alert(`${requestType === 'dataExport' ? '數據導出' : '數據刪除'}請求已提交！請求ID: ${result.requestId}`);
    } catch (error) {
      console.error('處理數據請求失敗:', error);
      alert('處理請求時發生錯誤');
    }
  };

  const updateCookieSettings = async () => {
    try {
      await userTrackingDataManager.updatePrivacyConsent('demo-user', cookieSettings);
      alert('Cookie 設定已更新！');
    } catch (error) {
      console.error('更新 Cookie 設定失敗:', error);
      alert('更新設定時發生錯誤');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'processing':
        return <ClockIcon className="w-4 h-4" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <XCircleIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'consent', name: 'Cookie 同意', icon: ShieldCheckIcon },
    { id: 'requests', name: '數據請求', icon: DocumentTextIcon },
    { id: 'compliance', name: '合規狀態', icon: CheckCircleIcon },
    { id: 'settings', name: '隱私設定', icon: CogIcon }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">隱私權設定管理</h1>
          <p className="text-gray-600 mt-1">管理用戶同意、數據保護與 GDPR 合規</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
          <ShieldCheckIcon className="w-5 h-5" />
          <span className="text-sm font-medium">GDPR 合規</span>
        </div>
      </div>

      {/* 總覽統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總同意數</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {privacyData?.cookieConsent.totalConsents.toLocaleString() || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">
                同意率 {((privacyData?.cookieConsent.consentRate || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <UserIcon className="w-12 h-12 text-primary-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">數據請求</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {privacyData?.dataRequests.totalRequests || 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">本月處理中</p>
            </div>
            <DocumentTextIcon className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">分析追蹤</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {((privacyData?.cookieConsent.categoryConsents.analytics || 0) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-green-600 mt-1">同意分析追蹤</p>
            </div>
            <EyeIcon className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">行銷追蹤</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {((privacyData?.cookieConsent.categoryConsents.marketing || 0) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-purple-600 mt-1">同意行銷追蹤</p>
            </div>
            <ShieldCheckIcon className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* 標籤導航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 內容區域 */}
      <div className="space-y-6">
        {activeTab === 'consent' && (
          <>
            {/* Cookie 同意統計 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cookie 同意分類統計</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Object.entries(privacyData?.cookieConsent.categoryConsents || {}).map(([category, rate]) => {
                    const categoryNames = {
                      necessary: '必要 Cookie',
                      analytics: '分析 Cookie',
                      marketing: '行銷 Cookie',
                      personalization: '個人化 Cookie'
                    };
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {categoryNames[category] || category}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                category === 'necessary' ? 'bg-green-500' :
                                category === 'analytics' ? 'bg-blue-500' :
                                category === 'marketing' ? 'bg-purple-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${rate * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {(rate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">最近同意記錄</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {privacyData?.cookieConsent.recentConsents.slice(0, 10).map((consent, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded">
                        <div>
                          <p className="text-xs text-gray-600">用戶 {consent.userId.slice(-8)}</p>
                          <p className="text-xs text-gray-500">{formatDate(consent.timestamp)}</p>
                        </div>
                        <div className="flex space-x-1">
                          {Object.entries(consent.consents).map(([key, value]) => (
                            <div
                              key={key}
                              className={`w-2 h-2 rounded-full ${
                                value ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              title={`${key}: ${value ? '同意' : '拒絕'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {/* 數據請求管理 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">數據請求處理</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDataRequest('dataExport')}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>測試導出請求</span>
                  </button>
                  <button
                    onClick={() => handleDataRequest('dataDeletion')}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>測試刪除請求</span>
                  </button>
                </div>
              </div>

              {/* 請求類型統計 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(privacyData?.dataRequests.requestTypes || {}).map(([type, count]) => {
                  const typeNames = {
                    dataExport: '數據導出',
                    dataDeletion: '數據刪除',
                    consentWithdrawal: '撤回同意'
                  };
                  return (
                    <div key={type} className="bg-white/50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary-600">{count}</p>
                      <p className="text-sm text-gray-600">{typeNames[type] || type}</p>
                    </div>
                  );
                })}
              </div>

              {/* 最近請求記錄 */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">最近處理記錄</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">請求ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">用戶ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">請求類型</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">狀態</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {privacyData?.dataRequests.recentRequests.map((request) => (
                        <tr key={request.requestId} className="border-b border-gray-100 hover:bg-white/30">
                          <td className="py-3 px-4 text-sm text-gray-900">{request.requestId}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{request.userId.slice(-8)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {{
                              dataExport: '數據導出',
                              dataDeletion: '數據刪除',
                              consentWithdrawal: '撤回同意'
                            }[request.requestType] || request.requestType}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(request.status)
                            }`}>
                              {getStatusIcon(request.status)}
                              <span>
                                {{
                                  pending: '等待中',
                                  processing: '處理中',
                                  completed: '已完成'
                                }[request.status] || request.status}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(request.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'compliance' && (
          <>
            {/* 合規狀態 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GDPR 合規狀態</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">GDPR 合規</span>
                    </div>
                    <span className="text-green-600 font-medium">完全合規</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">CCPA 合規</span>
                    </div>
                    <span className="text-green-600 font-medium">完全合規</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">最後審計</span>
                    </div>
                    <span className="text-blue-600 font-medium">
                      {formatDate(privacyData?.complianceStatus.lastAuditDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">自動化刪除</span>
                    </div>
                    <span className="text-green-600 font-medium">
                      {privacyData?.complianceStatus.automatedDeletion ? '已啟用' : '未啟用'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">資料保存政策</h4>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">個人資料保存期限</span>
                        <span className="text-sm font-medium text-gray-900">
                          {privacyData?.complianceStatus.dataRetentionPolicy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">行為追蹤資料</span>
                        <span className="text-sm font-medium text-gray-900">1年</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cookie 數據</span>
                        <span className="text-sm font-medium text-gray-900">30天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">分析報告</span>
                        <span className="text-sm font-medium text-gray-900">匿名永久保存</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* 隱私設定 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">預設 Cookie 設定</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">必要 Cookie</h4>
                    <p className="text-sm text-gray-600">網站基本功能運作所需</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookieSettings.necessary}
                      disabled
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-500">必需</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">分析 Cookie</h4>
                    <p className="text-sm text-gray-600">幫助我們了解網站使用情況</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookieSettings.analytics}
                      onChange={(e) => setCookieSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">行銷 Cookie</h4>
                    <p className="text-sm text-gray-600">用於顯示相關廣告內容</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookieSettings.marketing}
                      onChange={(e) => setCookieSettings(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">個人化 Cookie</h4>
                    <p className="text-sm text-gray-600">提供個人化購物體驗</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookieSettings.personalization}
                      onChange={(e) => setCookieSettings(prev => ({ ...prev, personalization: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-4">
                <button
                  onClick={updateCookieSettings}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  儲存設定
                </button>
                <button
                  onClick={() => setCookieSettings({
                    necessary: true,
                    analytics: true,
                    marketing: false,
                    personalization: true
                  })}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  重設為預設值
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;