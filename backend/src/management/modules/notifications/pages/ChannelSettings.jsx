import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../styles";

const ChannelSettings = () => {
  const [channels, setChannels] = useState([
    {
      id: 'email',
      name: '電子郵件',
      type: 'email',
      icon: EnvelopeIcon,
      description: '透過電子郵件發送通知',
      status: 'active',
      provider: 'SMTP',
      settings: {
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        use_tls: true,
        daily_limit: 5000
      }
    },
    {
      id: 'sms',
      name: '簡訊通知',
      type: 'sms', 
      icon: DevicePhoneMobileIcon,
      description: '透過簡訊發送重要通知',
      status: 'active',
      provider: '台灣大哥大',
      settings: {
        api_endpoint: 'https://sms.api.com',
        daily_limit: 1000,
        cost_per_sms: 3.5
      }
    },
    {
      id: 'push',
      name: '推播通知',
      type: 'push',
      icon: BellIcon,
      description: '向手機應用程式推送通知',
      status: 'inactive',
      provider: 'Firebase',
      settings: {
        server_key: '',
        daily_limit: 10000
      }
    },
    {
      id: 'line',
      name: 'LINE 通知',
      type: 'messaging',
      icon: BellIcon,
      description: '透過 LINE 官方帳號發送通知',
      status: 'inactive',
      provider: 'LINE Messaging API',
      settings: {
        channel_secret: '',
        access_token: '',
        daily_limit: 2000
      }
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      '.channel-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const handleToggleChannel = (channelId) => {
    setChannels(prev => 
      prev.map(channel => 
        channel.id === channelId
          ? { ...channel, status: channel.status === 'active' ? 'inactive' : 'active' }
          : channel
      )
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <div className="flex items-center space-x-1 text-green-600">
        <CheckCircleIcon className="w-4 h-4" />
        <span className="text-sm font-medium">啟用中</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1 text-gray-500">
        <XCircleIcon className="w-4 h-4" />
        <span className="text-sm font-medium">已停用</span>
      </div>
    );
  };

  const openChannelSettings = (channel) => {
    setSelectedChannel(channel);
    setShowSettingsModal(true);
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">通知渠道設定</h1>
        <p className="text-gray-600 mt-2">配置各種通知發送渠道的設定</p>
      </div>

      {/* 渠道概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {channels.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">啟用渠道</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">5,000</p>
              <p className="text-sm text-gray-600">每日郵件限額</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DevicePhoneMobileIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">1,000</p>
              <p className="text-sm text-gray-600">每日簡訊限額</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BellIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">12,000</p>
              <p className="text-sm text-gray-600">今日發送總數</p>
            </div>
          </div>
        </div>
      </div>

      {/* 渠道設定 */}
      <div className={ADMIN_STYLES.glassCard}>
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 font-chinese">通知渠道</h2>
            <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              新增渠道
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map((channel) => {
              const IconComponent = channel.icon;
              return (
                <div key={channel.id} className="channel-card bg-gray-50/80 rounded-lg p-6 border border-gray-200/60">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        channel.status === 'active' 
                          ? 'bg-[#cc824d]/10 text-[#cc824d]' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-chinese">{channel.name}</h3>
                        <p className="text-sm text-gray-500">{channel.provider}</p>
                      </div>
                    </div>
                    {getStatusBadge(channel.status)}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{channel.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">每日限額：</span>
                      <span className="font-medium">{channel.settings.daily_limit?.toLocaleString()}</span>
                    </div>
                    {channel.settings.cost_per_sms && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">每則費用：</span>
                        <span className="font-medium">{channel.settings.cost_per_sms}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">今日已發送：</span>
                      <span className="font-medium">{Math.floor(Math.random() * 1000).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleChannel(channel.id)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        channel.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {channel.status === 'active' ? '停用' : '啟用'}
                    </button>
                    <button
                      onClick={() => openChannelSettings(channel)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      設定
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 設定模態框 */}
      {showSettingsModal && selectedChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-6">
              <selectedChannel.icon className="w-6 h-6 text-[#cc824d]" />
              <h3 className="text-lg font-bold text-gray-900 font-chinese">
                {selectedChannel.name} 設定
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">渠道狀態</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  defaultValue={selectedChannel.status}
                >
                  <option value="active">啟用</option>
                  <option value="inactive">停用</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">服務提供商</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  defaultValue={selectedChannel.provider}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">每日發送限額</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  defaultValue={selectedChannel.settings.daily_limit}
                />
              </div>

              {selectedChannel.type === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP 主機</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedChannel.settings.smtp_host}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP 埠號</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedChannel.settings.smtp_port}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="use_tls"
                      defaultChecked={selectedChannel.settings.use_tls}
                      className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="use_tls" className="ml-2 text-sm text-gray-700">使用 TLS 加密</label>
                  </div>
                </>
              )}

              {selectedChannel.type === 'sms' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API 端點</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedChannel.settings.api_endpoint}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">每則簡訊費用 ()</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedChannel.settings.cost_per_sms}
                    />
                  </div>
                </>
              )}

              {selectedChannel.type === 'messaging' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel Secret</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedChannel.settings.channel_secret}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedChannel.settings.access_token}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setSelectedChannel(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors">
                儲存設定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSettings;
