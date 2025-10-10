import React, { useMemo } from 'react';
import SearchableSelect from '../ui/SearchableSelect';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import { TAIWAN_CITIES, getDistrictsByCity } from '../../../../external_mock/members/taiwanDivisions';

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
            className={ADMIN_STYLES.input}
            placeholder="王小明"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">電話</label>
          <input
            value={newAddress.phone || ''}
            onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
            className={ADMIN_STYLES.input}
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
            className={ADMIN_STYLES.input}
            placeholder="e.g., 100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">詳細地址</label>
        <input
          value={newAddress.streetAddress || ''}
          onChange={(e) => setNewAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
          className={ADMIN_STYLES.input}
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
          className={`${ADMIN_STYLES.primaryButton} py-1.5 text-sm`}
        >
          {saving ? '儲存中…' : '新增地址'}
        </button>
      </div>
    </div>
  );
};

export default HomeAddressForm;
