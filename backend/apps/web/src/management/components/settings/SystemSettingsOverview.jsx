import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  TruckIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  ServerIcon,
  GlobeAltIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import systemSettingsDataManager from '../../../lib/mocks/settings/systemSettingsDataManager';
import {
  listDepartments, createDepartment, updateDepartment, deleteDepartment,
  listRoles, createRole, updateRole, deleteRole,
  listModules, createModule, updateModule, deleteModule
} from '../../../lib/mocks/core/frontendApiMock'
import SearchableSelect from "../ui/SearchableSelect";

const SystemSettingsOverview = () => {
  const [statistics, setStatistics] = useState({});
  const [recentChanges, setRecentChanges] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [quickSettings, setQuickSettings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // 系統選項：部門/角色/模組（對接後端 Settings CRUD）
  const [departments, setDepartments] = useState([])
  const [roles, setRoles] = useState([])
  const [modules, setModules] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [newDept, setNewDept] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newModule, setNewModule] = useState('')

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // 載入部門/角色/模組選項
    (async () => {
      try {
        setLoadingOptions(true)
        const [d, r, m] = await Promise.all([
          listDepartments(),
          listRoles(),
          listModules(),
        ])
        setDepartments(d || [])
        setRoles(r || [])
        setModules(m || [])
      } catch (e) {
        console.error('載入系統選項失敗', e)
      } finally {
        setLoadingOptions(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = systemSettingsDataManager.searchSettings(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const loadData = () => {
    // 載入統計資料
    const stats = systemSettingsDataManager.getSettingsStatistics();
    setStatistics(stats);
    setRecentChanges(stats.recentChanges);

    // 載入系統狀態
    const status = getSystemStatus();
    setSystemStatus(status);

    // 載入快速設定
    const quick = getQuickSettings();
    setQuickSettings(quick);
  };

  const getSystemStatus = () => {
    const securitySettings = systemSettingsDataManager.getSettingsByCategory('system_security');
    const notificationSettings = systemSettingsDataManager.getSettingsByCategory('notification_management');
    
    return {
      security: {
        status: 'healthy',
        message: '安全設定正常',
        lastCheck: new Date().toISOString(),
        details: {
          passwordPolicy: securitySettings['security.password_min_length']?.value >= 8,
          loginProtection: securitySettings['security.login_max_attempts']?.value <= 5,
          sessionTimeout: securitySettings['security.session_timeout']?.value <= 60
        }
      },
      notifications: {
        status: notificationSettings['notification.email_enabled']?.value ? 'active' : 'warning',
        message: notificationSettings['notification.email_enabled']?.value ? '通知系統正常運作' : '部分通知功能未啟用',
        lastCheck: new Date().toISOString(),
        details: {
          email: notificationSettings['notification.email_enabled']?.value,
          sms: notificationSettings['notification.sms_enabled']?.value
        }
      },
      performance: {
        status: 'healthy',
        message: '系統效能良好',
        lastCheck: new Date().toISOString(),
        details: {
          responseTime: '< 200ms',
          uptime: '99.9%',
          memoryUsage: '65%'
        }
      }
    };
  };

  const getQuickSettings = () => {
    return {
      'system.name': systemSettingsDataManager.getSetting('system_core', 'system.name'),
      'security.password_min_length': systemSettingsDataManager.getSetting('system_security', 'security.password_min_length'),
      'notification.email_enabled': systemSettingsDataManager.getSetting('notification_management', 'notification.email_enabled'),
      'payment.currency': systemSettingsDataManager.getSetting('payment_management', 'payment.currency'),
      'shipping.free_shipping_threshold': systemSettingsDataManager.getSetting('shipping_management', 'shipping.free_shipping_threshold')
    };
  };

  const handleQuickUpdate = (category, key, value) => {
    systemSettingsDataManager.updateSetting(category, key, value);
    loadData();
  };

  const handleExportSettings = () => {
    const settings = systemSettingsDataManager.exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marelle-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = systemSettingsDataManager.importSettings(e.target.result);
        if (result.success) {
          alert('設定匯入成功！');
          loadData();
        } else {
          alert(`匯入失敗：${result.error}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      system_core: <ServerIcon className="h-5 w-5" />,
      system_security: <ShieldCheckIcon className="h-5 w-5" />,
      notification_management: <BellIcon className="h-5 w-5" />,
      payment_management: <CreditCardIcon className="h-5 w-5" />,
      shipping_management: <TruckIcon className="h-5 w-5" />
    };
    return icons[category] || <Cog6ToothIcon className="h-5 w-5" />;
  };

  const getCategoryName = (category) => {
    const names = {
      system_core: '系統核心',
      system_security: '安全設定',
      notification_management: '通知管理',
      payment_management: '支付設定',
      shipping_management: '物流設定'
    };
    return names[category] || category;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">系統設定總覽</h1>
            <p className="text-gray-600">集中管理所有系統配置與設定項目</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportSettings}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              匯出設定
            </button>
            <label className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium cursor-pointer">
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              匯入設定
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 左側主要內容 */}
          <div className="col-span-2 space-y-6">
            {/* 系統狀態監控 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                系統狀態監控
              </h3>
              <div className="space-y-4">
                {Object.entries(systemStatus).map(([key, status]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status.status)}
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{key}</p>
                        <p className="text-sm text-gray-600">{status.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status.status)}`}>
                        {status.status === 'healthy' ? '正常' : 
                         status.status === 'active' ? '運作中' : 
                         status.status === 'warning' ? '警告' : '錯誤'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(status.lastCheck)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 快速設定 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                快速設定
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">系統名稱</label>
                    <input
                      type="text"
                      value={quickSettings['system.name'] || ''}
                      onChange={(e) => handleQuickUpdate('system_core', 'system.name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">密碼最小長度</label>
                    <input
                      type="number"
                      value={quickSettings['security.password_min_length'] || ''}
                      onChange={(e) => handleQuickUpdate('system_security', 'security.password_min_length', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">預設貨幣</label>
                    <SearchableSelect
                      options={[
                        { value: 'TWD', label: '新台幣 (TWD)' },
                        { value: 'USD', label: '美元 (USD)' },
                        { value: 'EUR', label: '歐元 (EUR)' },
                        { value: 'JPY', label: '日圓 (JPY)' }
                      ]}
                      value={quickSettings['payment.currency'] || 'TWD'}
                      onChange={(value) => handleQuickUpdate('payment_management', 'payment.currency', value)}
                      placeholder="選擇貨幣"
                      className="w-full"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">免運費門檻</label>
                    <input
                      type="number"
                      value={quickSettings['shipping.free_shipping_threshold'] || ''}
                      onChange={(e) => handleQuickUpdate('shipping_management', 'shipping.free_shipping_threshold', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 系統選項：部門 / 角色 / 模組 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                系統選項（部門 / 角色 / 模組）
              </h3>
              {loadingOptions ? (
                <p className="text-sm text-gray-500">載入中...</p>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {/* 部門 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">部門</h4>
                      <div className="flex items-center gap-2">
                        <input className="border border-gray-300 rounded px-2 py-1 text-sm" placeholder="新增部門"
                               value={newDept} onChange={e=>setNewDept(e.target.value)} />
                        <button className="text-white bg-amber-600 hover:bg-amber-700 text-sm px-3 py-1 rounded"
                                onClick={async()=>{
                                  if (!newDept.trim()) return
                                  try {
                                    const created = await createDepartment(newDept.trim())
                                    setDepartments(prev=>[{ id: created.id, name: created.name }, ...prev])
                                    setNewDept('')
                                  } catch(e) { alert(e?.message || '新增失敗') }
                                }}>新增</button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {departments.map(d=> (
                        <li key={d.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                          <span className="text-sm text-gray-800">{d.name}</span>
                          <div className="flex items-center gap-2">
                            <button className="text-amber-700 hover:bg-amber-100 rounded px-2 py-1 text-sm"
                                    onClick={async()=>{
                                      const name = prompt('重新命名部門', d.name)
                                      if (name && name !== d.name) {
                                        try { await updateDepartment(d.id, name); setDepartments(prev=>prev.map(x=>x.id===d.id?{...x,name}:x)) }
                                        catch(e){ alert(e?.message || '更新失敗') }
                                      }
                                    }}>重新命名</button>
                            <button className="text-red-700 hover:bg-red-100 rounded px-2 py-1 text-sm"
                                    onClick={async()=>{
                                      if (!confirm(`確定刪除部門「${d.name}」？`)) return
                                      try { await deleteDepartment(d.id); setDepartments(prev=>prev.filter(x=>x.id!==d.id)) }
                                      catch(e){ alert(e?.message || '刪除失敗') }
                                    }}>刪除</button>
                          </div>
                        </li>
                      ))}
                      {departments.length===0 && <li className="text-sm text-gray-500">尚無部門</li>}
                    </ul>
                  </div>

                  {/* 角色 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">角色</h4>
                      <div className="flex items-center gap-2">
                        <input className="border border-gray-300 rounded px-2 py-1 text-sm" placeholder="新增角色"
                               value={newRole} onChange={e=>setNewRole(e.target.value)} />
                        <button className="text-white bg-amber-600 hover:bg-amber-700 text-sm px-3 py-1 rounded"
                                onClick={async()=>{
                                  if (!newRole.trim()) return
                                  try { const created = await createRole(newRole.trim()); setRoles(prev=>[{id:created.id,name:created.name},...prev]); setNewRole('') }
                                  catch(e){ alert(e?.message||'新增失敗') }
                                }}>新增</button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {roles.map(r=> (
                        <li key={r.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                          <span className="text-sm text-gray-800">{r.name}</span>
                          <div className="flex items-center gap-2">
                            <button className="text-amber-700 hover:bg-amber-100 rounded px-2 py-1 text-sm"
                                    onClick={async()=>{
                                      const name = prompt('重新命名角色', r.name)
                                      if (name && name !== r.name) {
                                        try { await updateRole(r.id, name); setRoles(prev=>prev.map(x=>x.id===r.id?{...x,name}:x)) }
                                        catch(e){ alert(e?.message || '更新失敗') }
                                      }
                                    }}>重新命名</button>
                            <button className="text-red-700 hover:bg-red-100 rounded px-2 py-1 text-sm"
                                    onClick={async()=>{
                                      if (!confirm(`確定刪除角色「${r.name}」？`)) return
                                      try { await deleteRole(r.id); setRoles(prev=>prev.filter(x=>x.id!==r.id)) }
                                      catch(e){ alert(e?.message || '刪除失敗') }
                                    }}>刪除</button>
                          </div>
                        </li>
                      ))}
                      {roles.length===0 && <li className="text-sm text-gray-500">尚無角色</li>}
                    </ul>
                  </div>

                  {/* 模組 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">模組</h4>
                      <div className="flex items-center gap-2">
                        <input className="border border-gray-300 rounded px-2 py-1 text-sm" placeholder="新增模組"
                               value={newModule} onChange={e=>setNewModule(e.target.value)} />
                        <button className="text-white bg-amber-600 hover:bg-amber-700 text-sm px-3 py-1 rounded"
                                onClick={async()=>{
                                  if (!newModule.trim()) return
                                  try { const created = await createModule(newModule.trim()); setModules(prev=>[{id:created.id,name:created.name},...prev]); setNewModule('') }
                                  catch(e){ alert(e?.message||'新增失敗') }
                                }}>新增</button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {modules.map(m=> (
                        <li key={m.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                          <span className="text-sm text-gray-800">{m.name}</span>
                          <div className="flex items-center gap-2">
                            <button className="text-amber-700 hover:bg-amber-100 rounded px-2 py-1 text-sm"
                                    onClick={async()=>{
                                      const name = prompt('重新命名模組', m.name)
                                      if (name && name !== m.name) {
                                        try { await updateModule(m.id, name); setModules(prev=>prev.map(x=>x.id===m.id?{...x,name}:x)) }
                                        catch(e){ alert(e?.message || '更新失敗') }
                                      }
                                    }}>重新命名</button>
                            <button className="text-red-700 hover:bg-red-100 rounded px-2 py-1 text-sm"
                                    onClick={async()=>{
                                      if (!confirm(`確定刪除模組「${m.name}」？`)) return
                                      try { await deleteModule(m.id); setModules(prev=>prev.filter(x=>x.id!==m.id)) }
                                      catch(e){ alert(e?.message || '刪除失敗') }
                                    }}>刪除</button>
                          </div>
                        </li>
                      ))}
                      {modules.length===0 && <li className="text-sm text-gray-500">尚無模組</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右側邊欄 */}
          <div className="space-y-6">
            {/* 最近變更 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                最近變更
              </h3>
              <div className="space-y-3">
                {recentChanges.slice(0, 5).map((change, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{change.settingId}</span>
                      <span className="text-xs text-gray-500">{formatDateTime(change.changedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{change.changedBy}</span>
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="text-gray-500">變更：</span>
                      <span className="text-red-600 line-through mr-2">{String(change.oldValue)}</span>
                      <span className="text-green-600">{String(change.newValue)}</span>
                    </div>
                  </div>
                ))}
                {recentChanges.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">暫無變更記錄</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsOverview;