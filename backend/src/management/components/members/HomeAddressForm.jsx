import React, { useMemo } from 'react';
import SearchableSelect from '../ui/SearchableSelect';
import { TAIWAN_CITIES, getDistrictsByCity } from '../../../lib/data/members/taiwanDivisions';

const HomeAddressForm = ({ newAddress, setNewAddress, onSave, saving }) => {
  const cityOptions = useMemo(() => (TAIWAN_CITIES || []).map(c => ({ value: c, label: c })), []);
  const districtOptions = useMemo(() => {
    if (!newAddress.city) return [];
    return getDistrictsByCity(newAddress.city).map(d => ({ value: d.name, label: `${d.name}（${d.zip}）`, zip: d.zip }));
  }, [newAddress.city]);

  return (
    <div className="space-y-3">
  <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">收件人</label>
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

  <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">縣市</label>
          <SearchableSelect
            options={cityOptions}
            value={newAddress.city || null}
            onChange={(val) => setNewAddress(prev => ({ ...prev, city: val, district: '', postalCode: '' }))}
            placeholder="選擇縣市"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">行政區</label>
          <SearchableSelect
            options={districtOptions}
            value={newAddress.district || null}
            onChange={(val, option) => setNewAddress(prev => ({ ...prev, district: val, postalCode: option?.zip || '' }))}
            placeholder="選擇行政區"
            disabled={!newAddress.city}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">郵遞區號</label>
          <input
            value={newAddress.postalCode || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="e.g., 100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">詳細地址</label>
        <input
          value={newAddress.streetAddress || ''}
          onChange={(e) => setNewAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          placeholder="某某路 123 號 5 樓"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!newAddress.isDefault}
            onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
          />
          設為預設地址
        </label>
        <button
          onClick={onSave}
          disabled={!!saving}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? '儲存中…' : '新增地址'}
        </button>
      </div>
    </div>
  );
};

export default HomeAddressForm;
