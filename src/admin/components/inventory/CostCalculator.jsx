import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

const mockStockRecords = [
  { id: 1, type: 'in', qty: 10, cost: 100, date: '2025-09-10' },
  { id: 2, type: 'in', qty: 5, cost: 120, date: '2025-09-12' },
  { id: 3, type: 'out', qty: 8, cost: null, date: '2025-09-13' },
  { id: 4, type: 'in', qty: 7, cost: 110, date: '2025-09-14' },
  { id: 5, type: 'out', qty: 6, cost: null, date: '2025-09-15' }
];

const costMethods = [
  { key: 'fifo', label: 'FIFO 先進先出' },
  { key: 'lifo', label: 'LIFO 後進先出' },
  { key: 'avg', label: '加權平均' }
];

function calcFIFO(records) {
  let stock = [];
  let totalCost = 0;
  records.forEach(r => {
    if (r.type === 'in') {
      stock.push({ qty: r.qty, cost: r.cost });
    } else if (r.type === 'out') {
      let remain = r.qty;
      while (remain > 0 && stock.length) {
        let batch = stock[0];
        if (batch.qty > remain) {
          totalCost += remain * batch.cost;
          batch.qty -= remain;
          remain = 0;
        } else {
          totalCost += batch.qty * batch.cost;
          remain -= batch.qty;
          stock.shift();
        }
      }
    }
  });
  return { avg: stock.length ? (stock.reduce((a, b) => a + b.qty * b.cost, 0) / stock.reduce((a, b) => a + b.qty, 0)).toFixed(2) : 0, total: totalCost };
}
function calcLIFO(records) {
  let stock = [];
  let totalCost = 0;
  records.forEach(r => {
    if (r.type === 'in') {
      stock.unshift({ qty: r.qty, cost: r.cost });
    } else if (r.type === 'out') {
      let remain = r.qty;
      while (remain > 0 && stock.length) {
        let batch = stock[0];
        if (batch.qty > remain) {
          totalCost += remain * batch.cost;
          batch.qty -= remain;
          remain = 0;
        } else {
          totalCost += batch.qty * batch.cost;
          remain -= batch.qty;
          stock.shift();
        }
      }
    }
  });
  return { avg: stock.length ? (stock.reduce((a, b) => a + b.qty * b.cost, 0) / stock.reduce((a, b) => a + b.qty, 0)).toFixed(2) : 0, total: totalCost };
}
function calcAVG(records) {
  let totalQty = 0, totalCost = 0;
  records.forEach(r => {
    if (r.type === 'in') {
      totalQty += r.qty;
      totalCost += r.qty * r.cost;
    } else if (r.type === 'out') {
      totalQty -= r.qty;
    }
  });
  return { avg: totalQty > 0 ? (totalCost / totalQty).toFixed(2) : 0, total: totalCost };
}

const CostCalculator = () => {
  const [method, setMethod] = useState('fifo');
  let result = { avg: 0, total: 0 };
  if (method === 'fifo') result = calcFIFO(mockStockRecords);
  if (method === 'lifo') result = calcLIFO(mockStockRecords);
  if (method === 'avg') result = calcAVG(mockStockRecords);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <CalculatorIcon className="w-6 h-6 text-purple-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">多成本計算</h2>
      </div>
      <div className="mb-4 flex space-x-2">
        {costMethods.map(m => (
          <button
            key={m.key}
            className={`tab-btn ${method===m.key?'tab-btn-active':''}`}
            onClick={()=>setMethod(m.key)}
          >{m.label}</button>
        ))}
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">日期</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">類型</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">數量</th>
              <th className="px-6 py-4 text-left text-sm font-semibold font-chinese">單位成本</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockStockRecords.map(r => (
              <tr key={r.id} className="hover:bg-white/30">
                <td className="px-6 py-4">{r.date}</td>
                <td className="px-6 py-4 font-chinese">{r.type==='in'?'入庫':r.type==='out'?'出庫':'-'}</td>
                <td className="px-6 py-4">{r.qty}</td>
                <td className="px-6 py-4">{r.type==='in'?r.cost:'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="font-chinese text-lg mt-4">
        <span className="mr-6">平均成本：<span className="font-bold text-purple-700">{result.avg}</span></span>
        <span>累計成本：<span className="font-bold text-purple-700">{result.total}</span></span>
      </div>
    </div>
  );
};

export default CostCalculator;
