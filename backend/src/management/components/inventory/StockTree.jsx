import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CubeIcon } from '@heroicons/react/24/outline';

// 模擬分析/贈分析/變分析資分析
const mockData = [
  {
    id: 1,
    type: 'product',
    name: '經典T??,
    sku: 'TSHIRT-001',
    variants: [
      { id: 11, type: 'variant', name: '?�色/M', sku: 'TSHIRT-001-WH-M', stock: 30 },
      { id: 12, type: 'variant', name: '黑色/L', sku: 'TSHIRT-001-BK-L', stock: 12 }
    ],
    gifts: [
      { id: 21, type: 'gift', name: '分析貼分析', sku: 'GIFT-001', stock: 100 }
    ],
    stock: 42 // 變分析分析?�總
  },
  {
    id: 2,
    type: 'product',
    name: '分析水壺',
    sku: 'BOTTLE-001',
    variants: [],
    gifts: [],
    stock: 15
  }
];

const StockTree = () => {
  const [expanded, setExpanded] = useState({});
  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <CubeIcon className="w-6 h-6 text-amber-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">分析/贈分析庫分析</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">?�稱</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">庫分析</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockData.map(item => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-white/30">
                  <td className="px-6 py-4 font-chinese">
                    <button className="mr-2" onClick={() => toggle(item.id)} aria-label="展分析/分析">
                      {item.variants.length > 0 || item.gifts.length > 0 ? (
                        expanded[item.id] ? <ChevronDownIcon className="w-4 h-4 inline" /> : <ChevronRightIcon className="w-4 h-4 inline" />
                      ) : null}
                    </button>
                    {item.name}
                  </td>
                  <td className="px-6 py-4">{item.sku}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{item.variants.length > 0 ? item.variants.reduce((sum, v) => sum + v.stock, 0) : item.stock}</td>
                </tr>
                {expanded[item.id] && item.variants.map(variant => (
                  <tr key={variant.id} className="bg-white/60">
                    <td className="px-10 py-3 font-chinese text-sm">??{variant.name}</td>
                    <td className="px-6 py-3 text-sm">{variant.sku}</td>
                    <td className="px-6 py-3 text-sm">{variant.stock}</td>
                  </tr>
                ))}
                {expanded[item.id] && item.gifts.map(gift => (
                  <tr key={gift.id} className="bg-white/60">
                    <td className="px-10 py-3 font-chinese text-sm text-amber-700">?? {gift.name}</td>
                    <td className="px-6 py-3 text-sm">{gift.sku}</td>
                    <td className="px-6 py-3 text-sm">{gift.stock}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTree;
