import React, { useState } from 'react';
import { BuildingStorefrontIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { loadWarehouses, saveWarehouses } from '../../../../external_mock/inventory/warehousesMock';
import { ADMIN_STYLES } from '../../Style/adminStyles';

const newWarehouseTemplate = {
  id: '',
  name: '',
  code: '',
  isDefault: false,
  address: '',
  contact: '',
  enabled: true,
};

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState(() => loadWarehouses());
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(newWarehouseTemplate);

  const resetDraft = () => setDraft(newWarehouseTemplate);

  const startAdd = () => {
    resetDraft();
    setEditingId('NEW');
  };

  const startEdit = (w) => {
    setDraft({ ...w });
    setEditingId(w.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetDraft();
  };

  const saveDraft = () => {
    if (!draft.name?.trim()) return alert('請輸入倉庫名稱');
    const id = editingId === 'NEW' || !draft.id ? draft.name.replace(/\s+/g, '-').toLowerCase() : draft.id;
    const next = editingId === 'NEW'
      ? [...warehouses, { ...draft, id }]
      : warehouses.map(w => (w.id === editingId ? { ...draft, id } : w));

    // 確保只會有一個 isDefault
    if (draft.isDefault) {
      next.forEach(w => { w.isDefault = w.id === id; });
    }

    setWarehouses(next);
    saveWarehouses(next);
    cancelEdit();
  };

  const removeWarehouse = (id) => {
    if (!confirm('確定要刪除此倉庫？')) return;
    const next = warehouses.filter(w => w.id !== id);
    setWarehouses(next);
    saveWarehouses(next);
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
  <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center mb-8">
          <BuildingStorefrontIcon className="w-8 h-8 text-amber-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">倉庫管理</h1>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 font-chinese">管理倉庫清單、新增/刪除、設定預設倉庫與聯絡資訊</div>
            <button onClick={startAdd} className="px-3 py-2 rounded bg-[#cc824d] text-white hover:bg-[#b3723f] flex items-center text-sm">
              <PlusIcon className="w-4 h-4 mr-1" /> 新增倉庫
            </button>
          </div>
        </div>

        {/* 新增/編輯 區塊 */}
        {editingId && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 font-chinese">{editingId === 'NEW' ? '新增倉庫' : '編輯倉庫'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-chinese">名稱</label>
                <input className="w-full border rounded px-3 py-2" value={draft.name} onChange={(e)=> setDraft(d => ({...d, name: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-chinese">代碼</label>
                <input className="w-full border rounded px-3 py-2" value={draft.code} onChange={(e)=> setDraft(d => ({...d, code: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-chinese">聯絡資訊</label>
                <input className="w-full border rounded px-3 py-2" value={draft.contact} onChange={(e)=> setDraft(d => ({...d, contact: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-chinese">地址</label>
                <input className="w-full border rounded px-3 py-2" value={draft.address} onChange={(e)=> setDraft(d => ({...d, address: e.target.value}))} />
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-600 font-chinese">設為預設倉庫</label>
                <input type="checkbox" checked={draft.isDefault} onChange={(e)=> setDraft(d => ({...d, isDefault: e.target.checked}))} />
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-600 font-chinese">啟用</label>
                <input type="checkbox" checked={draft.enabled} onChange={(e)=> setDraft(d => ({...d, enabled: e.target.checked}))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={cancelEdit} className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center text-sm">
                <XMarkIcon className="w-4 h-4 mr-1" /> 取消
              </button>
              <button onClick={saveDraft} className="px-3 py-2 rounded bg-[#cc824d] text-white hover:bg-[#b3723f] flex items-center text-sm">
                <CheckIcon className="w-4 h-4 mr-1" /> 儲存
              </button>
            </div>
          </div>
        )}

        {/* 清單 */}
        <div className="glass rounded-2xl p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">名稱</th>
                <th className="py-2">代碼</th>
                <th className="py-2">聯絡</th>
                <th className="py-2">地址</th>
                <th className="py-2">預設</th>
                <th className="py-2">啟用</th>
                <th className="py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map(w => (
                <tr key={w.id} className="border-t">
                  <td className="py-2">{w.name}</td>
                  <td className="py-2">{w.code}</td>
                  <td className="py-2">{w.contact}</td>
                  <td className="py-2">{w.address}</td>
                  <td className="py-2">{w.isDefault ? '✓' : ''}</td>
                  <td className="py-2">{w.enabled ? '啟用' : '停用'}</td>
                  <td className="py-2 text-right">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" onClick={() => startEdit(w)}>
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-100 rounded ml-1" onClick={() => removeWarehouse(w.id)}>
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarehouseManagement;
