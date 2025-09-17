import React, { useState } from 'react';
import StandardTable from '../../components/StandardTable';
import CustomSelect from '../../components/CustomSelect';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const NotificationHistory = () => {
  const [historyTimeRange, setHistoryTimeRange] = useState('7d');
  const [historyChannel, setHistoryChannel] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');

  const historyData = [
    {
      id: 1,
      templateName: '訂單確認通知',
      recipient: 'user@example.com',
      channel: 'email_html',
      status: 'delivered',
      sentAt: '2024-09-16 14:30:25',
      deliveredAt: '2024-09-16 14:30:28',
      openedAt: '2024-09-16 14:35:12',
      subject: '您的訂單已確認 - ORD-20240916-001',
      errorMessage: null
    },
    {
      id: 2,
      templateName: '生日祝福訊息',
      recipient: '0912345678',
      channel: 'sms',
      status: 'delivered',
      sentAt: '2024-09-16 09:00:00',
      deliveredAt: '2024-09-16 09:00:03',
      openedAt: null,
      subject: '生日快樂！專屬優惠等您領取',
      errorMessage: null
    },
    {
      id: 3,
      templateName: '庫存不足提醒',
      recipient: 'admin@marelle.com',
      channel: 'email_text',
      status: 'failed',
      sentAt: '2024-09-15 18:45:10',
      deliveredAt: null,
      openedAt: null,
      subject: '商品庫存警告 - 精緻杏仁蛋糕',
      errorMessage: 'SMTP connection timeout'
    },
    {
      id: 4,
      templateName: '促銷活動通知',
      recipient: 'LINE_U123456789',
      channel: 'line_text',
      status: 'delivered',
      sentAt: '2024-09-15 12:00:00',
      deliveredAt: '2024-09-15 12:00:01',
      openedAt: '2024-09-15 12:05:30',
      subject: '限時優惠！全館9折起',
      errorMessage: null
    },
    {
      id: 5,
      templateName: '系統維護通知',
      recipient: 'browser_token_abc123',
      channel: 'push_web',
      status: 'pending',
      sentAt: '2024-09-15 10:30:00',
      deliveredAt: null,
      openedAt: null,
      subject: '系統維護預告通知',
      errorMessage: null
    }
  ];

  const getChannelIcon = (channel) => {
    const channelConfig = {
      'email_html': EnvelopeIcon,
      'email_text': EnvelopeIcon,
      'sms': DevicePhoneMobileIcon,
      'line_text': ChatBubbleLeftIcon,
      'line_flex': ChatBubbleLeftIcon,
      'push_web': GlobeAltIcon
    };
    return channelConfig[channel] || EnvelopeIcon;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">
            <CheckCircleIcon className="w-3 h-3 mr-1" />已送達
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
            <XCircleIcon className="w-3 h-3 mr-1" />失敗
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded font-chinese">
            <ClockIcon className="w-3 h-3 mr-1" />處理中
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded font-chinese">
            未知
          </span>
        );
    }
  };

  const historyColumns = [
    {
      key: 'templateName',
      label: '通知範本',
      sortable: true,
      render: (_, history) => (
        <div>
          <div className="font-medium text-gray-900">{history.templateName}</div>
          <div className="text-sm text-gray-500">{history.subject}</div>
        </div>
      )
    },
    {
      key: 'recipient',
      label: '接收者',
      sortable: true,
      render: (_, history) => (
        <div className="text-sm text-gray-900 font-mono">
          {history.recipient.length > 20 
            ? `${history.recipient.substring(0, 20)}...` 
            : history.recipient
          }
        </div>
      )
    },
    {
      key: 'channel',
      label: '發送渠道',
      sortable: true,
      render: (_, history) => {
        const IconComponent = getChannelIcon(history.channel);
        return (
          <div className="flex items-center">
            <IconComponent className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-900">{history.channel}</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, history) => getStatusBadge(history.status)
    },
    {
      key: 'sentAt',
      label: '發送時間',
      sortable: true,
      render: (_, history) => (
        <div className="text-sm text-gray-500">{history.sentAt}</div>
      )
    },
    {
      key: 'deliveredAt',
      label: '送達時間',
      sortable: true,
      render: (_, history) => (
        <div className="text-sm text-gray-500">
          {history.deliveredAt || '-'}
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, history) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredHistoryData = historyData.filter(item => {
    const timeMatch = historyTimeRange === 'all' || true; // 簡化時間篩選
    const channelMatch = historyChannel === 'all' || item.channel === historyChannel;
    const statusMatch = historyStatus === 'all' || item.status === historyStatus;
    return timeMatch && channelMatch && statusMatch;
  });

  const stats = {
    total: filteredHistoryData.length,
    delivered: filteredHistoryData.filter(h => h.status === 'delivered').length,
    failed: filteredHistoryData.filter(h => h.status === 'failed').length,
    pending: filteredHistoryData.filter(h => h.status === 'pending').length
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* 篩選區域 */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">通知歷史</h3>
          </div>

          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <CustomSelect
                value={historyTimeRange}
                onChange={setHistoryTimeRange}
                options={[
                  { value: '1d', label: '今天' },
                  { value: '7d', label: '近7天' },
                  { value: '30d', label: '近30天' },
                  { value: 'all', label: '全部' }
                ]}
                className="w-32"
              />
            </div>

            <CustomSelect
              value={historyChannel}
              onChange={setHistoryChannel}
              options={[
                { value: 'all', label: '全部渠道' },
                { value: 'email_html', label: 'HTML郵件' },
                { value: 'email_text', label: '文字郵件' },
                { value: 'sms', label: 'SMS' },
                { value: 'line_text', label: 'LINE' },
                { value: 'push_web', label: '網頁推播' }
              ]}
              className="w-32"
            />

            <CustomSelect
              value={historyStatus}
              onChange={setHistoryStatus}
              options={[
                { value: 'all', label: '全部狀態' },
                { value: 'delivered', label: '已送達' },
                { value: 'failed', label: '失敗' },
                { value: 'pending', label: '處理中' }
              ]}
              className="w-32"
            />

            <div className="text-sm text-gray-500 font-chinese">
              共 {filteredHistoryData.length} 條記錄
            </div>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-500 font-chinese">總發送數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <div className="text-sm text-gray-500 font-chinese">成功送達</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-500 font-chinese">發送失敗</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500 font-chinese">處理中</div>
            </div>
          </div>
        </div>

        <StandardTable
          data={filteredHistoryData}
          columns={historyColumns}
          title="通知歷史記錄"
          emptyMessage="沒有找到通知記錄"
          emptyDescription="請調整篩選條件或等待新的通知發送"
          emptyIcon={ClockIcon}
        />
      </div>
    </div>
  );
};

export default NotificationHistory;