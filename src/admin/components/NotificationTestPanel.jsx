import React, { useState } from 'react';
import {
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import CustomSelect from './CustomSelect';

const NotificationTestPanel = ({ isOpen, onClose }) => {
  const [testConfig, setTestConfig] = useState({
    templateId: '',
    channel: '',
    recipient: '',
    variables: {}
  });
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    { id: 1, name: '訂單確認通知', channels: ['email_html', 'sms'] },
    { id: 2, name: '會員生日祝福', channels: ['email_html', 'line_text'] },
    { id: 3, name: '商品缺貨提醒', channels: ['email_text', 'push_app'] },
    { id: 4, name: '促銷活動通知', channels: ['email_html', 'line_flex', 'push_web'] }
  ];

  const channels = [
    { id: 'email_html', name: 'Email (HTML)', icon: '📧', placeholder: 'test@example.com' },
    { id: 'email_text', name: 'Email (純文字)', icon: '📧', placeholder: 'test@example.com' },
    { id: 'sms', name: 'SMS 簡訊', icon: '💬', placeholder: '0912345678' },
    { id: 'line_text', name: 'LINE 文字', icon: '💬', placeholder: 'LINE User ID' },
    { id: 'line_flex', name: 'LINE Flex', icon: '💬', placeholder: 'LINE User ID' },
    { id: 'push_app', name: 'App 推播', icon: '📱', placeholder: 'Device Token' },
    { id: 'push_web', name: '網頁推播', icon: '🌐', placeholder: 'Subscription Endpoint' }
  ];

  const variables = [
    { key: 'user.name', name: '用戶姓名', example: '張小明' },
    { key: 'user.email', name: '電子郵件', example: 'user@example.com' },
    { key: 'order.id', name: '訂單編號', example: 'ORD-20240916-001' },
    { key: 'order.total', name: '訂單總額', example: 'NT$ 1,580' },
    { key: 'product.name', name: '商品名稱', example: '精緻杏仁蛋糕' },
    { key: 'system.site_name', name: '網站名稱', example: 'Marelle' }
  ];

  const selectedTemplate = templates.find(t => t.id === parseInt(testConfig.templateId));
  const availableChannels = selectedTemplate ? 
    channels.filter(c => selectedTemplate.channels.includes(c.id)) : 
    channels;

  const selectedChannel = channels.find(c => c.id === testConfig.channel);

  const handleTest = async () => {
    if (!testConfig.templateId || !testConfig.channel || !testConfig.recipient) {
      alert('請填寫完整的測試配置');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    // 模擬測試過程
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 隨機成功/失敗（90%成功率）
      const isSuccess = Math.random() > 0.1;
      
      setTestResult({
        success: isSuccess,
        message: isSuccess ? '測試通知發送成功！' : '測試通知發送失敗',
        details: isSuccess ? 
          `通知已成功發送至 ${testConfig.recipient}，請檢查您的${selectedChannel?.name}` :
          `發送失敗：${testConfig.channel === 'sms' ? 'SMS 配額不足' : '連接超時'}`,
        timestamp: new Date().toLocaleString('zh-TW')
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: '測試過程發生錯誤',
        details: error.message,
        timestamp: new Date().toLocaleString('zh-TW')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariableChange = (key, value) => {
    setTestConfig(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [key]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-chinese">通知測試工具</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 範本選擇 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              選擇範本 *
            </label>
            <CustomSelect
              value={testConfig.templateId}
              onChange={(value) => setTestConfig(prev => ({ ...prev, templateId: value, channel: '' }))}
              options={[
                { value: '', label: '請選擇範本' },
                ...templates.map(template => ({
                  value: template.id.toString(),
                  label: template.name,
                  description: `支援 ${template.channels.length} 個渠道`
                }))
              ]}
              placeholder="請選擇範本"
            />
          </div>

          {/* 渠道選擇 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              選擇渠道 *
            </label>
            <CustomSelect
              value={testConfig.channel}
              onChange={(value) => setTestConfig(prev => ({ ...prev, channel: value }))}
              options={[
                { value: '', label: '請選擇渠道' },
                ...availableChannels.map(channel => ({
                  value: channel.id,
                  label: channel.name,
                  icon: channel.icon,
                  description: `發送至 ${channel.placeholder}`
                }))
              ]}
              disabled={!testConfig.templateId}
              placeholder="請選擇渠道"
            />
          </div>

          {/* 收件人 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              收件人 *
            </label>
            <input
              type="text"
              value={testConfig.recipient}
              onChange={(e) => setTestConfig(prev => ({ ...prev, recipient: e.target.value }))}
              placeholder={selectedChannel?.placeholder || '請先選擇渠道'}
              disabled={!testConfig.channel}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-chinese focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* 變數設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              測試變數（選填）
            </label>
            <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {variables.map(variable => (
                <div key={variable.key} className="flex items-center space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-purple-600 w-32 flex-shrink-0">
                    {`{{${variable.key}}}`}
                  </code>
                  <input
                    type="text"
                    placeholder={variable.example}
                    value={testConfig.variables[variable.key] || ''}
                    onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 測試結果 */}
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                {testResult.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium font-chinese ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.message}
                </span>
              </div>
              <p className={`text-sm font-chinese ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.details}
              </p>
              <p className="text-xs text-gray-500 mt-2 font-chinese">
                測試時間：{testResult.timestamp}
              </p>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={handleTest}
              disabled={isLoading || !testConfig.templateId || !testConfig.channel || !testConfig.recipient}
              className="flex-1 btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                  發送中...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  發送測試
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPanel;