import React, { useState } from 'react';
import {
  PaperAirplaneIcon,
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const NotificationTestPanel = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 模擬通知模板
  const templates = [
    { id: 1, name: '歡迎通知', content: '歡迎加入 Marelle！' },
    { id: 2, name: '訂單確認', content: '您的訂單已確認。' },
    { id: 3, name: '付款通知', content: '付款已收到，謝謝！' }
  ];

  // 可用通知渠道
  const availableChannels = [
    { value: 'email', label: '電子郵件', icon: EnvelopeIcon },
    { value: 'sms', label: '簡訊', icon: DevicePhoneMobileIcon },
    { value: 'push', label: '推播通知', icon: BellIcon }
  ];

  const handleSendTest = async () => {
    if (!selectedTemplate || !selectedChannel) {
      alert('請選擇模板和通知渠道');
      return;
    }

    setIsLoading(true);
    
    // 模擬發送過程
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isSuccess = Math.random() > 0.2; // 80% 成功率
      
      setTestResult({
        success: isSuccess,
        message: isSuccess ? '測試通知發送成功' : '測試通知發送失敗',
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: '發送過程中發生錯誤',
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <PaperAirplaneIcon className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">通知測試面板</h3>
      </div>

      <div className="space-y-6">
        {/* 選擇模板 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇通知模板
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">請選擇模板</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* 選擇渠道 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            通知渠道
          </label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">請選擇渠道</option>
            {availableChannels.map(channel => (
              <option key={channel.value} value={channel.value}>
                {channel.label}
              </option>
            ))}
          </select>
        </div>

        {/* 預覽內容 */}
        {selectedTemplate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              預覽內容
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-800">
                {templates.find(t => t.id.toString() === selectedTemplate)?.content}
              </p>
            </div>
          </div>
        )}

        {/* 發送按鈕 */}
        <div>
          <button
            onClick={handleSendTest}
            disabled={!selectedTemplate || !selectedChannel || isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                發送中...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                發送測試通知
              </>
            )}
          </button>
        </div>

        {/* 測試結果 */}
        {testResult && (
          <div className={`p-4 rounded-lg border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              {testResult.success ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.message}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  時間：{testResult.timestamp}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTestPanel;