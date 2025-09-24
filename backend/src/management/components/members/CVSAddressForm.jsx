import React, { useMemo } from 'react';
import SearchableSelect from '../ui/SearchableSelect';

const PROVIDERS = [
  { value: '711', label: '7-ELEVEN', icon: () => <span className="inline-block w-4 h-4 rounded-sm bg-green-600" /> },
  { value: 'familymart', label: '全家 FamilyMart', icon: () => <span className="inline-block w-4 h-4 rounded-sm bg-emerald-500" /> },
  { value: 'hilife', label: '萊爾富 Hi-Life', icon: () => <span className="inline-block w-4 h-4 rounded-sm bg-red-500" /> },
  { value: 'okmart', label: 'OK mart', icon: () => <span className="inline-block w-4 h-4 rounded-sm bg-rose-500" /> },
];

const CVSAddressForm = ({ newAddress, setNewAddress, onSave, saving }) => {
  const providerOptions = useMemo(() => PROVIDERS.map(p => ({ value: p.value, label: p.label, icon: p.icon })), []);

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">取件人</label>
          <input
            value={newAddress.contactName || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, contactName: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="王小明"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">電話</label>
          <input
            value={newAddress.phone || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="09xx-xxx-xxx"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">超商</label>
          <SearchableSelect
            options={providerOptions}
            value={newAddress.provider || null}
            onChange={(val) => setNewAddress(prev => ({ ...prev, provider: val }))}
            placeholder="選擇品牌"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-600 mb-1">門市名稱</label>
          <input
            value={newAddress.storeName || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, storeName: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="如 台北站前門市"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">門市代號</label>
          <input
            value={newAddress.storeId || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, storeId: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="e.g., 123456"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-600 mb-1">門市地址</label>
          <input
            value={newAddress.storeAddress || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, storeAddress: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="完整地址"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!newAddress.isDefault}
            onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
          />
          設為預設門市
        </label>
        <button
          onClick={onSave}
          disabled={!!saving}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? '儲存中…' : '新增門市'}
        </button>
      </div>
    </div>
  );
};

export default CVSAddressForm;
