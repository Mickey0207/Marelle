import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const mockAlerts = [
  { sku: 'TSHIRT-001-WH-M', name: '經典T恤 白色/M', stock: 3, safe: 5 },
  { sku: 'BOTTLE-001', name: '運動水壺', stock: 1, safe: 2 }
];

const StockAlertManager = () => {
  const [safeStock, setSafeStock] = useState(5);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">智能低庫存警示</h2>
      </div>
      <div className="mb-4 flex items-center space-x-2 font-chinese">
        <span>安全庫存水位：</span>
        <input
          className="input w-24"
          type="number"
          min="0"
          value={safeStock}
          onChange={e => setSafeStock(Number(e.target.value))}
        />
        <span className="text-xs text-gray-400">（低於此數量將顯示警示）</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">名稱</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">目前庫存</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">安全水位</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockAlerts.map(item => (
              <tr key={item.sku} className="hover:bg-white/30">
                <td className="px-6 py-4">{item.sku}</td>
                <td className="px-6 py-4 font-chinese">{item.name}</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4">{safeStock}</td>
                <td className="px-6 py-4">
                  {item.stock < safeStock ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />低於安全水位
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">正常</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlertManager;
