import React, { useState } from 'react';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';

const ShippingSettings = () => {
  const [settings, setSettings] = useState({
    shippingMethods: [
      {
        id: 1,
        name: '標準配送',
        cost: 60,
        estimatedDays: '3-5',
        enabled: true,
        freeThreshold: 1000
      },
      {
        id: 2,
        name: '快速配送',
        cost: 120,
        estimatedDays: '1-2',
        enabled: true,
        freeThreshold: null
      },
      {
        id: 3,
        name: '超商取貨',
        cost: 50,
        estimatedDays: '2-3',
        enabled: true,
        freeThreshold: 800
      }
    ],
    zones: [
      {
        id: 1,
        name: '台灣本島',
        regions: ['台北', '桃園', '台中', '台南', '高雄'],
        multiplier: 1.0
      },
      {
        id: 2,
        name: '離島地區',
        regions: ['澎湖', '金門', '馬祖'],
        multiplier: 1.5
      }
    ],
    packaging: {
      standardBox: { length: 30, width: 20, height: 15, weight: 0.2 },
      largeBox: { length: 40, width: 30, height: 25, weight: 0.3 },
      customPackaging: false
    }
  });

  const handleMethodChange = (methodId, field, value) => {
    setSettings(prev => ({
      ...prev,
      shippingMethods: prev.shippingMethods.map(method =>
        method.id === methodId
          ? { ...method, [field]: value }
          : method
      )
    }));
  };

  const handleZoneChange = (zoneId, field, value) => {
    setSettings(prev => ({
      ...prev,
      zones: prev.zones.map(zone =>
        zone.id === zoneId
          ? { ...zone, [field]: value }
          : zone
      )
    }));
  };

  const handlePackagingChange = (type, field, value) => {
    setSettings(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        [type]: typeof prev.packaging[type] === 'object'
          ? { ...prev.packaging[type], [field]: value }
          : value
      }
    }));
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>配送設定</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理配送方式和運費設定</p>
        </div>

        <div className="space-y-6">
          {/* 配送方式 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">配送方式</h3>
            <div className="space-y-4">
              {settings.shippingMethods.map(method => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">方式名稱</label>
                      <input
                        type="text"
                        value={method.name}
                        onChange={(e) => handleMethodChange(method.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">運費 (元)</label>
                      <input
                        type="number"
                        value={method.cost}
                        onChange={(e) => handleMethodChange(method.id, 'cost', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">預計天數</label>
                      <input
                        type="text"
                        value={method.estimatedDays}
                        onChange={(e) => handleMethodChange(method.id, 'estimatedDays', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="1-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">免運門檻</label>
                      <input
                        type="number"
                        value={method.freeThreshold || ''}
                        onChange={(e) => handleMethodChange(method.id, 'freeThreshold', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="無限制"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => handleMethodChange(method.id, 'enabled', e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <label className="text-sm font-chinese">啟用此配送方式</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 配送區域 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">配送區域</h3>
            <div className="space-y-4">
              {settings.zones.map(zone => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">區域名稱</label>
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => handleZoneChange(zone.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">運費倍數</label>
                      <input
                        type="number"
                        step="0.1"
                        value={zone.multiplier}
                        onChange={(e) => handleZoneChange(zone.id, 'multiplier', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 font-chinese">包含地區</label>
                      <input
                        type="text"
                        value={zone.regions.join(', ')}
                        onChange={(e) => handleZoneChange(zone.id, 'regions', e.target.value.split(', '))}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="台北, 桃園, 台中"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 包裝設定 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">包裝設定</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 font-chinese">標準包裝箱</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">長 (cm)</label>
                      <input
                        type="number"
                        value={settings.packaging.standardBox.length}
                        onChange={(e) => handlePackagingChange('standardBox', 'length', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">寬 (cm)</label>
                      <input
                        type="number"
                        value={settings.packaging.standardBox.width}
                        onChange={(e) => handlePackagingChange('standardBox', 'width', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">高 (cm)</label>
                      <input
                        type="number"
                        value={settings.packaging.standardBox.height}
                        onChange={(e) => handlePackagingChange('standardBox', 'height', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">重量 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.packaging.standardBox.weight}
                        onChange={(e) => handlePackagingChange('standardBox', 'weight', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 font-chinese">大型包裝箱</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">長 (cm)</label>
                      <input
                        type="number"
                        value={settings.packaging.largeBox.length}
                        onChange={(e) => handlePackagingChange('largeBox', 'length', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">寬 (cm)</label>
                      <input
                        type="number"
                        value={settings.packaging.largeBox.width}
                        onChange={(e) => handlePackagingChange('largeBox', 'width', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">高 (cm)</label>
                      <input
                        type="number"
                        value={settings.packaging.largeBox.height}
                        onChange={(e) => handlePackagingChange('largeBox', 'height', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-chinese">重量 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.packaging.largeBox.weight}
                        onChange={(e) => handlePackagingChange('largeBox', 'weight', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-sm border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.packaging.customPackaging}
                  onChange={(e) => handlePackagingChange('customPackaging', '', e.target.checked)}
                  className="mr-2 rounded"
                />
                <label className="text-sm font-chinese">允許自訂包裝</label>
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

export default ShippingSettings;