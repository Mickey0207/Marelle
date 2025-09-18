import React, { useState } from 'react';
import { ClipboardDocumentListIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const orderTypes = [
  { key: 'in', label: '?¥åº«?? },
  { key: 'pick', label: '?€è²¨å–®' },
  { key: 'out', label: '?ºåº«?? },
  { key: 'qc', label: 'è³ªæª¢?? }
];

const mockOrders = [
  { id: 1, type: 'in', warehouse: 'ä¸»å€‰åº«', sku: 'TSHIRT-001-WH-M', qty: 10, date: '2025-09-16', note: 'è£œè²¨' },
  { id: 2, type: 'out', warehouse: 'ä¸»å€‰åº«', sku: 'BOTTLE-001', qty: 2, date: '2025-09-15', note: '?ºè²¨' }
];

const StockOrderManager = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'in', warehouse: '', sku: '', qty: 1, date: '', note: '' });

  const openForm = () => { setForm({ type: 'in', warehouse: '', sku: '', qty: 1, date: '', note: '' }); setShowForm(true); };
  const closeForm = () => setShowForm(false);
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    setOrders(os => [{ ...form, id: Date.now() }, ...os]);
    setShowForm(false);
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <ClipboardDocumentListIcon className="w-6 h-6 text-green-500 mr-2" />
          <h2 className="text-xl font-bold font-chinese">åº«å??®æ?ç®¡ç?</h2>
        </div>
        <button className="btn-primary flex items-center" onClick={openForm}><PlusIcon className="w-5 h-5 mr-1" />?°å??®æ?</button>
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?®æ?é¡žå?</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?‰åº«</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?¸é?</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?¥æ?</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?™è¨»</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-white/30">
                <td className="px-6 py-4 font-chinese">{orderTypes.find(t => t.key === order.type)?.label}</td>
                <td className="px-6 py-4">{order.warehouse}</td>
                <td className="px-6 py-4">{order.sku}</td>
                <td className="px-6 py-4">{order.qty}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
          <form className="bg-white/90 backdrop-blur-xl rounded-xl p-8 w-full max-w-md space-y-4 shadow-lg relative border border-white/30" onSubmit={handleSubmit}>
            <button type="button" className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" onClick={closeForm}><XMarkIcon className="w-6 h-6" /></button>
            <h3 className="text-lg font-bold mb-2 font-chinese">?°å?åº«å??®æ?</h3>
            <label className="block font-chinese">?®æ?é¡žå?
              <select className="input" name="type" value={form.type} onChange={handleChange}>
                {orderTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </label>
            <label className="block font-chinese">?‰åº«
              <input className="input" name="warehouse" value={form.warehouse} onChange={handleChange} required />
            </label>
            <label className="block font-chinese">SKU
              <input className="input" name="sku" value={form.sku} onChange={handleChange} required />
            </label>
            <label className="block font-chinese">?¸é?
              <input className="input" name="qty" type="number" min="1" value={form.qty} onChange={handleChange} required />
            </label>
            <label className="block font-chinese">?¥æ?
              <input className="input" name="date" type="date" value={form.date} onChange={handleChange} required />
            </label>
            <label className="block font-chinese">?™è¨»
              <input className="input" name="note" value={form.note} onChange={handleChange} />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" className="btn-secondary" onClick={closeForm}>?–æ?</button>
              <button type="submit" className="btn-primary">?°å?</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StockOrderManager;
