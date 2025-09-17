import React, { useState } from 'react';
import StandardTable from '../../components/StandardTable';
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ChannelSettings = () => {
  const [channels] = useState([
    {
      id: 1,
      type: 'email_html',
      name: 'HTML 郵件',
      icon: EnvelopeIcon,
      description: '富文本格式的電子郵件',
      status: 'active',
      provider: 'SendGrid',
      settings: {
        smtp_host: 'smtp.sendgrid.net',
        smtp_port: 587,
        daily_limit: 10000,
        used_today: 2340
      },
      lastUsed: '2024-09-16 14:30'
    },
    {
      id: 2,
      type: 'sms',
      name: 'SMS 簡訊',
      icon: DevicePhoneMobileIcon,
      description: '手機短信通知',
      status: 'active',
      provider: '台灣大哥大',
      settings: {
        api_endpoint: 'https://sms.api.com',
        daily_limit: 1000,
        used_today: 156
      },
      lastUsed: '2024-09-16 13:45'
    },
    {
      id: 3,
      type: 'line_text',
      name: 'LINE 文字訊息',
      icon: ChatBubbleLeftIcon,
      description: 'LINE 官方帳號文字訊息',
      status: 'active',
      provider: 'LINE Messaging API',
      settings: {
        channel_token: 'line_******',
        monthly_limit: 5000,
        used_this_month: 890
      },
      lastUsed: '2024-09-16 12:20'
    },
    {
      id: 4,
      type: 'push_web',
      name: '網頁推播',
      icon: GlobeAltIcon,
      description: '瀏覽器推播通知',
      status: 'inactive',
      provider: 'Firebase FCM',
      settings: {
        firebase_key: 'fcm_******',
        daily_limit: 50000,
        used_today: 0
      },
      lastUsed: '2024-09-10 09:15'
    }
  ]);

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
        <CheckCircleIcon className="w-3 h-3 mr-1" />啟用
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
        <XCircleIcon className="w-3 h-3 mr-1" />停用
      </span>
    );
  };

  const getUsagePercentage = (used, limit) => {
    const percentage = (used / limit) * 100;
    let colorClass = 'bg-green-500';
    if (percentage > 80) colorClass = 'bg-red-500';
    else if (percentage > 60) colorClass = 'bg-yellow-500';
    
    return { percentage: Math.min(percentage, 100), colorClass };
  };

  const channelColumns = [
    {
      key: 'name',
      label: '渠道名稱',
      sortable: true,
      render: (_, channel) => {
        const IconComponent = channel.icon;
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <IconComponent className="w-8 h-8 text-gray-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{channel.name}</div>
              <div className="text-sm text-gray-500">{channel.description}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'provider',
      label: '服務商',
      sortable: true,
      render: (_, channel) => (
        <div className="text-sm text-gray-900">{channel.provider}</div>
      )
    },
    {
      key: 'usage',
      label: '使用量',
      sortable: false,
      render: (_, channel) => {
        const limitKey = channel.settings.daily_limit ? 'daily_limit' : 'monthly_limit';
        const usedKey = channel.settings.used_today !== undefined ? 'used_today' : 'used_this_month';
        const limit = channel.settings[limitKey];
        const used = channel.settings[usedKey];
        const { percentage, colorClass } = getUsagePercentage(used, limit);
        
        return (
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>{used.toLocaleString()}</span>
              <span className="text-gray-500">{limit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${colorClass}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {percentage.toFixed(1)}% 已使用
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, channel) => getStatusBadge(channel.status)
    },
    {
      key: 'lastUsed',
      label: '最後使用',
      sortable: true,
      render: (_, channel) => (
        <div className="text-sm text-gray-500">{channel.lastUsed}</div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, channel) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-900">
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">渠道設定</h3>
          </div>
          
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 font-chinese mb-2 flex items-center">
              <InformationCircleIcon className="w-5 h-5 mr-2" />
              渠道說明
            </h4>
            <p className="text-sm text-amber-700 font-chinese">
              配置各種通知發送渠道的設定，包括 API 密鑰、發送限制和服務商配置。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{channels.length}</div>
              <div className="text-sm text-gray-500 font-chinese">總渠道數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {channels.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-500 font-chinese">啟用中</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {channels.reduce((sum, c) => {
                  const used = c.settings.used_today || c.settings.used_this_month || 0;
                  return sum + used;
                }, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-chinese">今日發送量</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {channels.reduce((sum, c) => {
                  const limit = c.settings.daily_limit || c.settings.monthly_limit || 0;
                  return sum + limit;
                }, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-chinese">總限制量</div>
            </div>
          </div>
        </div>

        <StandardTable
          data={channels}
          columns={channelColumns}
          title="渠道設定"
          emptyMessage="沒有找到渠道設定"
          emptyDescription="請配置通知發送渠道"
          emptyIcon={Cog6ToothIcon}
        />
      </div>
    </div>
  );
};

export default ChannelSettings;