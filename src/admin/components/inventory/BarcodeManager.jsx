import React, { useState } from 'react';
import { QrCodeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const mockSKUs = [
  { sku: 'TSHIRT-001-WH-M', name: '經典T恤 白色/M', barcode: '1234567890123' },
  { sku: 'BOTTLE-001', name: '運動水壺', barcode: '9876543210987' }
];

const BarcodeManager = () => {
  const [search, setSearch] = useState('');
  const filtered = mockSKUs.filter(s => s.sku.includes(search) || s.barcode.includes(search) || s.name.includes(search));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <QrCodeIcon className="w-6 h-6 text-gray-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">條碼/QR Code 管理</h2>
      </div>
      <div className="mb-4 flex items-center space-x-2">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
          className="input flex-1"
          placeholder="輸入SKU、條碼或名稱搜尋..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">名稱</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">條碼</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">QR Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(sku => (
              <tr key={sku.sku} className="hover:bg-white/30">
                <td className="px-6 py-4">{sku.sku}</td>
                <td className="px-6 py-4 font-chinese">{sku.name}</td>
                <td className="px-6 py-4">{sku.barcode}</td>
                <td className="px-6 py-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">QR</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarcodeManager;
