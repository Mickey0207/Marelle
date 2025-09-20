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
    { id: 1, name: 'Ë®ÇÂñÆÁ¢∫Ë??öÁü•', channels: ['email_html', 'sms'] },
    { id: 2, name: '?ÉÂì°?üÊó•Á•ùÁ?', channels: ['email_html', 'line_text'] },
    { id: 3, name: '?ÜÂ?Áº∫Ë≤®?êÈ?', channels: ['email_text', 'push_app'] },
    { id: 4, name: '‰øÉÈä∑Ê¥ªÂ??öÁü•', channels: ['email_html', 'line_flex', 'push_web'] }
  ];

  const channels = [
    { id: 'email_html', name: 'Email (HTML)', icon: '?ìß', placeholder: 'test@example.com' },
    { id: 'email_text', name: 'Email (Á¥îÊ?Â≠?', icon: '?ìß', placeholder: 'test@example.com' },
    { id: 'sms', name: 'SMS Á∞°Ë?', icon: '?í¨', placeholder: '0912345678' },
    { id: 'line_text', name: 'LINE ?áÂ?', icon: '?í¨', placeholder: 'LINE User ID' },
    { id: 'line_flex', name: 'LINE Flex', icon: '?í¨', placeholder: 'LINE User ID' },
    { id: 'push_app', name: 'App ?®Êí≠', icon: '?ì±', placeholder: 'Device Token' },
    { id: 'push_web', name: 'Á∂≤È??®Êí≠', icon: '??', placeholder: 'Subscription Endpoint' }
  ];

  const variables = [
    { key: 'user.name', name: '?®Êà∂ÂßìÂ?', example: 'ÂºµÂ??? },
    { key: 'user.email', name: '?ªÂ??µ‰ª∂', example: 'user@example.com' },
    { key: 'order.id', name: 'Ë®ÇÂñÆÁ∑®Ë?', example: 'ORD-20240916-001' },
    { key: 'order.total', name: 'Ë®ÇÂñÆÁ∏ΩÈ?', example: 'NT$ 1,580' },
    { key: 'product.name', name: '?ÜÂ??çÁ®±', example: 'Á≤æÁ∑ª?è‰??ãÁ?' },
    { key: 'system.site_name', name: 'Á∂≤Á??çÁ®±', example: 'Marelle' }
  ];

  const selectedTemplate = templates.find(t => t.id === parseInt(testConfig.templateId));
  const availableChannels = selectedTemplate ? 
    channels.filter(c => selectedTemplate.channels.includes(c.id)) : 
    channels;

  const selectedChannel = channels.find(c => c.id === testConfig.channel);

  const handleTest = async () => {
    if (!testConfig.templateId || !testConfig.channel || !testConfig.recipient) {
      alert('Ë´ãÂ°´ÂØ´Â??¥Á?Ê∏¨Ë©¶?çÁΩÆ');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    // Ê®°Êì¨Ê∏¨Ë©¶?éÁ?
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ?®Ê??êÂ?/Â§±Ê?Ôº?0%?êÂ??áÔ?
      const isSuccess = Math.random() > 0.1;
      
      setTestResult({
        success: isSuccess,
        message: isSuccess ? 'Ê∏¨Ë©¶?öÁü•?ºÈÄÅÊ??üÔ?' : 'Ê∏¨Ë©¶?öÁü•?ºÈÄÅÂ§±??,
        details: isSuccess ? 
          `?öÁü•Â∑≤Ê??üÁôº?ÅËá≥ ${testConfig.recipient}ÔºåË?Ê™¢Êü•?®Á?${selectedChannel?.name}` :
          `?ºÈÄÅÂ§±?óÔ?${testConfig.channel === 'sms' ? 'SMS ?çÈ?‰∏çË∂≥' : '??é•Ë∂ÖÊ?'}`,
        timestamp: new Date().toLocaleString('zh-TW')
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Ê∏¨Ë©¶?éÁ??ºÁ??ØË™§',
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
          <h3 className="text-xl font-bold font-chinese">?öÁü•Ê∏¨Ë©¶Â∑•ÂÖ∑</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* ÁØÑÊú¨?∏Ê? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              ?∏Ê?ÁØÑÊú¨ *
            </label>
            <CustomSelect
              value={testConfig.templateId}
              onChange={(value) => setTestConfig(prev => ({ ...prev, templateId: value, channel: '' }))}
              options={[
                { value: '', label: 'Ë´ãÈÅ∏?áÁ??? },
                ...templates.map(template => ({
                  value: template.id.toString(),
                  label: template.name,
                  description: `?ØÊè¥ ${template.channels.length} ?ãÊ??ì`
                }))
              ]}
              placeholder="Ë´ãÈÅ∏?áÁ???
            />
          </div>

          {/* Ê∏†È??∏Ê? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              ?∏Ê?Ê∏†È? *
            </label>
            <CustomSelect
              value={testConfig.channel}
              onChange={(value) => setTestConfig(prev => ({ ...prev, channel: value }))}
              options={[
                { value: '', label: 'Ë´ãÈÅ∏?áÊ??? },
                ...availableChannels.map(channel => ({
                  value: channel.id,
                  label: channel.name,
                  icon: channel.icon,
                  description: `?ºÈÄÅËá≥ ${channel.placeholder}`
                }))
              ]}
              disabled={!testConfig.templateId}
              placeholder="Ë´ãÈÅ∏?áÊ???
            />
          </div>

          {/* ?∂‰ª∂‰∫?*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              ?∂‰ª∂‰∫?*
            </label>
            <input
              type="text"
              value={testConfig.recipient}
              onChange={(e) => setTestConfig(prev => ({ ...prev, recipient: e.target.value }))}
              placeholder={selectedChannel?.placeholder || 'Ë´ãÂ??∏Ê?Ê∏†È?'}
              disabled={!testConfig.channel}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-chinese focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* ËÆäÊï∏Ë®≠Â? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">
              Ê∏¨Ë©¶ËÆäÊï∏ÔºàÈÅ∏Â°´Ô?
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

          {/* Ê∏¨Ë©¶ÁµêÊ? */}
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
                Ê∏¨Ë©¶?ÇÈ?Ôºö{testResult.timestamp}
              </p>
            </div>
          )}

          {/* ?ç‰??âÈ? */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={handleTest}
              disabled={isLoading || !testConfig.templateId || !testConfig.channel || !testConfig.recipient}
              className="flex-1 btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                  ?ºÈÄÅ‰∏≠...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  ?ºÈÄÅÊ∏¨Ë©?
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              ?úÈ?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPanel;
