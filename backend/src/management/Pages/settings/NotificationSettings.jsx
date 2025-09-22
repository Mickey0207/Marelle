import React, { useState } from 'react';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import SearchableSelect from '../../components/ui/SearchableSelect';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      newOrders: true,
      lowStock: true,
      customerMessages: true,
      systemUpdates: false
    },
    smsNotifications: {
      orderStatusChanges: true,
      urgentAlerts: true,
      promotions: false
    },
    pushNotifications: {
      realTimeAlerts: true,
      dailySummary: true,
      weeklyReports: false
    },
    notificationSchedule: {
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      timezone: 'Asia/Taipei'
    }
  });

  const handleEmailChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: value
      }
    }));
  };

  const handleSmsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      smsNotifications: {
        ...prev.smsNotifications,
        [key]: value
      }
    }));
  };

  const handlePushChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value
      }
    }));
  };

  const handleScheduleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notificationSchedule: {
        ...prev.notificationSchedule,
        [key]: value
      }
    }));
  };

  const handleQuietHoursChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notificationSchedule: {
        ...prev.notificationSchedule,
        quietHours: {
          ...prev.notificationSchedule.quietHours,
          [key]: value
        }
      }
    }));
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>通知設定</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理系統通知和提醒設定</p>
        </div>

        <div className="space-y-6">
          {/* 電子郵件通知 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">電子郵件通知</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">新訂單通知</label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.newOrders}
                  onChange={(e) => handleEmailChange('newOrders', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">庫存不足警告</label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.lowStock}
                  onChange={(e) => handleEmailChange('lowStock', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">客戶訊息</label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.customerMessages}
                  onChange={(e) => handleEmailChange('customerMessages', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">系統更新</label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.systemUpdates}
                  onChange={(e) => handleEmailChange('systemUpdates', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* 簡訊通知 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">簡訊通知</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">訂單狀態變更</label>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications.orderStatusChanges}
                  onChange={(e) => handleSmsChange('orderStatusChanges', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">緊急警告</label>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications.urgentAlerts}
                  onChange={(e) => handleSmsChange('urgentAlerts', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">促銷活動</label>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications.promotions}
                  onChange={(e) => handleSmsChange('promotions', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* 推播通知 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">推播通知</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">即時警告</label>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications.realTimeAlerts}
                  onChange={(e) => handlePushChange('realTimeAlerts', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">每日摘要</label>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications.dailySummary}
                  onChange={(e) => handlePushChange('dailySummary', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">週報</label>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications.weeklyReports}
                  onChange={(e) => handlePushChange('weeklyReports', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* 通知時程 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">通知時程</h3>
            <div className="space-y-4">
              <div>
                <SearchableSelect
                  placeholder="時區"
                  value={settings.notificationSchedule.timezone}
                  onChange={(value) => handleScheduleChange('timezone', value)}
                  options={[
                    { value: 'Asia/Taipei', label: '台北 (UTC+8)' },
                    { value: 'Asia/Shanghai', label: '上海 (UTC+8)' },
                    { value: 'Asia/Hong_Kong', label: '香港 (UTC+8)' },
                    { value: 'UTC', label: 'UTC (UTC+0)' }
                  ]}
                  size="sm"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={settings.notificationSchedule.quietHours.enabled}
                    onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <label className="text-sm font-medium font-chinese">啟用免打擾時間</label>
                </div>
                {settings.notificationSchedule.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">開始時間</label>
                      <input
                        type="time"
                        value={settings.notificationSchedule.quietHours.startTime}
                        onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">結束時間</label>
                      <input
                        type="time"
                        value={settings.notificationSchedule.quietHours.endTime}
                        onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-[#D4A574] text-white rounded-md hover:bg-[#B8956A] transition-colors font-chinese"
            >
              儲存設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;