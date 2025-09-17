import React, { useState } from 'react';
import StandardTable from '../../components/StandardTable';
import CustomSelect from '../../components/CustomSelect';
import {
  ChartBarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const AnalyticsOverview = () => {
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d');

  // 渠道效果分析數據
  const channelAnalyticsData = [
    {
      id: 1,
      channel: 'email_html',
      name: 'HTML 郵件',
      sent: 1250,
      delivered: 1190,
      opened: 856,
      clicked: 234,
      deliveryRate: 95.2,
      openRate: 71.9,
      clickRate: 27.3,
      trend: 'up'
    },
    {
      id: 2,
      channel: 'sms',
      name: 'SMS 簡訊',
      sent: 890,
      delivered: 875,
      opened: 850,
      clicked: 45,
      deliveryRate: 98.3,
      openRate: 97.1,
      clickRate: 5.3,
      trend: 'up'
    },
    {
      id: 3,
      channel: 'line_text',
      name: 'LINE 訊息',
      sent: 567,
      delivered: 543,
      opened: 421,
      clicked: 89,
      deliveryRate: 95.8,
      openRate: 77.5,
      clickRate: 21.1,
      trend: 'down'
    },
    {
      id: 4,
      channel: 'push_web',
      name: '網頁推播',
      sent: 234,
      delivered: 198,
      opened: 156,
      clicked: 23,
      deliveryRate: 84.6,
      openRate: 78.8,
      clickRate: 14.7,
      trend: 'up'
    }
  ];

  // 每日效果趨勢數據
  const dailyTrendData = [
    { date: '2024-09-10', sent: 450, delivered: 432, opened: 324, clicked: 67 },
    { date: '2024-09-11', sent: 523, delivered: 501, opened: 378, clicked: 89 },
    { date: '2024-09-12', sent: 489, delivered: 467, opened: 345, clicked: 72 },
    { date: '2024-09-13', sent: 610, delivered: 595, opened: 450, clicked: 89 },
    { date: '2024-09-14', sent: 580, delivered: 568, opened: 420, clicked: 85 },
    { date: '2024-09-15', sent: 640, delivered: 622, opened: 480, clicked: 95 },
    { date: '2024-09-16', sent: 610, delivered: 594, opened: 440, clicked: 88 }
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

  const getPerformanceColor = (rate, type) => {
    if (type === 'delivery') {
      return rate >= 95 ? 'text-green-600' : rate >= 85 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'open') {
      return rate >= 25 ? 'text-green-600' : rate >= 15 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'click') {
      return rate >= 5 ? 'text-green-600' : rate >= 2 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  // 渠道分析欄位配置
  const channelAnalyticsColumns = [
    {
      key: 'channel',
      label: '渠道',
      sortable: true,
      render: (_, channel) => {
        const IconComponent = getChannelIcon(channel.channel);
        return (
          <div className="flex items-center">
            <IconComponent className="w-5 h-5 text-gray-500 mr-3" />
            <span className="font-medium text-gray-900">{channel.name}</span>
          </div>
        );
      }
    },
    {
      key: 'sent',
      label: '發送數',
      sortable: true,
      render: (_, channel) => (
        <div className="text-sm text-gray-900">
          {channel.sent.toLocaleString()}
        </div>
      )
    },
    {
      key: 'deliveryRate',
      label: '送達率',
      sortable: true,
      render: (_, channel) => (
        <div className={`text-sm font-medium ${getPerformanceColor(channel.deliveryRate, 'delivery')}`}>
          {channel.deliveryRate.toFixed(1)}%
        </div>
      )
    },
    {
      key: 'openRate',
      label: '開啟率',
      sortable: true,
      render: (_, channel) => (
        <div className={`text-sm font-medium ${getPerformanceColor(channel.openRate, 'open')}`}>
          {channel.openRate.toFixed(1)}%
        </div>
      )
    },
    {
      key: 'clickRate',
      label: '點擊率',
      sortable: true,
      render: (_, channel) => (
        <div className={`text-sm font-medium ${getPerformanceColor(channel.clickRate, 'click')}`}>
          {channel.clickRate.toFixed(1)}%
        </div>
      )
    },
    {
      key: 'trend',
      label: '趨勢',
      sortable: false,
      render: (_, channel) => (
        <div className="flex items-center">
          {getTrendIcon(channel.trend)}
        </div>
      )
    }
  ];

  // 計算總體統計
  const totalStats = {
    sent: channelAnalyticsData.reduce((sum, c) => sum + c.sent, 0),
    delivered: channelAnalyticsData.reduce((sum, c) => sum + c.delivered, 0),
    opened: channelAnalyticsData.reduce((sum, c) => sum + c.opened, 0),
    clicked: channelAnalyticsData.reduce((sum, c) => sum + c.clicked, 0)
  };

  totalStats.deliveryRate = (totalStats.delivered / totalStats.sent) * 100;
  totalStats.openRate = (totalStats.opened / totalStats.delivered) * 100;
  totalStats.clickRate = (totalStats.clicked / totalStats.opened) * 100;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">效果分析</h3>
            <CustomSelect
              value={analyticsTimeRange}
              onChange={setAnalyticsTimeRange}
              options={[
                { value: '1d', label: '今天' },
                { value: '7d', label: '近7天' },
                { value: '30d', label: '近30天' },
                { value: '90d', label: '近3個月' }
              ]}
              className="w-32"
            />
          </div>

          {/* 總體統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">
                {totalStats.sent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 font-chinese">總發送數</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className={`text-2xl font-bold ${getPerformanceColor(totalStats.deliveryRate, 'delivery')}`}>
                {totalStats.deliveryRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">平均送達率</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className={`text-2xl font-bold ${getPerformanceColor(totalStats.openRate, 'open')}`}>
                {totalStats.openRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">平均開啟率</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className={`text-2xl font-bold ${getPerformanceColor(totalStats.clickRate, 'click')}`}>
                {totalStats.clickRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 font-chinese">平均點擊率</div>
            </div>
          </div>

          {/* 每日趨勢圖表區域 - 簡化顯示 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4 font-chinese">每日發送趨勢</h4>
            <div className="text-sm text-gray-500 font-chinese">
              📊 圖表功能開發中... 近7天平均發送量: {Math.round(dailyTrendData.reduce((sum, d) => sum + d.sent, 0) / dailyTrendData.length)} 條/天
            </div>
          </div>
        </div>

        <StandardTable
          data={channelAnalyticsData}
          columns={channelAnalyticsColumns}
          title="渠道效果分析"
          emptyMessage="沒有找到分析數據"
          emptyDescription="請等待數據收集完成"
          emptyIcon={ChartBarIcon}
        />
      </div>
    </div>
  );
};

export default AnalyticsOverview;