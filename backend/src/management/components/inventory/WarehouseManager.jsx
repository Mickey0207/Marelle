import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const initialWarehouses = [
  {
    id: 1,
    name: '主倉庫',
    code: 'MAIN',
    address: '分析市信義分析分析分析??,
    manager: '?�大??,
    phone: '02-12345678',
    isActive: true,
    isDefault: true
  }
];

const WarehouseManager = () => {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', code: '', address: '', manager: '', phone: '', isActive: true, isDefault: false
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', code: '', address: '', manager: '', phone: '', isActive: true, isDefault: false });
    setShowForm(true);
  };
  const openEdit = (w) => {
    setEditing(w.id);
    setForm({ ...w });
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    if (editing) {
      setWarehouses(ws => ws.map(w => w.id === editing ? { ...form, id: editing } : w));
    } else {
      setWarehouses(ws => [...ws, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  };
  const handleDelete = id => {
    if (window.confirm('確分析要刪?�此?�庫分析)) setWarehouses(ws => ws.filter(w => w.id !== id));
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center font-chinese">
          <BuildingStorefrontIcon className="w-6 h-6 mr-2 text-blue-400" />?�庫管分析
        </h2>
        <button className="btn-primary flex items-center" onClick={openAdd}><PlusIcon className="w-5 h-5 mr-1" />分析?�庫</button>
      </div>
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">{/* ?�許?�直溢出以顯示分析?�選??*/}
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?�稱</th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">分析��</th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">分析</th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">管分析??/th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?�話</th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?�用</th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?�設</th>
                <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">分析</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {warehouses.map(w => (
                <tr key={w.id} className="hover:bg-white/30">
                  <td className="px-6 py-4 font-chinese">{w.name}</td>
                  <td className="px-6 py-4">{w.code}</td>
                  <td className="px-6 py-4">{w.address}</td>
                  <td className="px-6 py-4">{w.manager}</td>
                  <td className="px-6 py-4">{w.phone}</td>
                  <td className="px-6 py-4">{w.isActive ? '?? : '??}</td>
                  <td className="px-6 py-4">{w.isDefault ? '?? : '??}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="text-blue-600 hover:bg-blue-100 rounded-full p-2 transition"
                      onClick={() => openEdit(w)}
                      aria-label="編輯"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:bg-red-100 rounded-full p-2 transition"
                      onClick={() => handleDelete(w.id)}
                      aria-label="?�除"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
          <form className="bg-white/90 backdrop-blur-xl rounded-xl p-8 w-full max-w-md space-y-4 shadow-lg relative border border-white/30" onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold mb-2 font-chinese">{editing ? '編輯?�庫' : '分析?�庫'}</h3>
            <label className="block font-chinese">?�稱<input className="input" name="name" value={form.name} onChange={handleChange} required /></label>
            <label className="block font-chinese">分析��<input className="input" name="code" value={form.code} onChange={handleChange} required /></label>
            <label className="block font-chinese">分析<input className="input" name="address" value={form.address} onChange={handleChange} /></label>
            <label className="block font-chinese">管分析??input className="input" name="manager" value={form.manager} onChange={handleChange} /></label>
            <label className="block font-chinese">?�話<input className="input" name="phone" value={form.phone} onChange={handleChange} /></label>
            <label className="inline-flex items-center mr-4 font-chinese"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> ?�用</label>
            <label className="inline-flex items-center font-chinese"><input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} /> ?�設</label>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" className="btn-secondary" onClick={closeForm}>分析</button>
              <button type="submit" className="btn-primary">{editing ? '分析' : '分析'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WarehouseManager;
