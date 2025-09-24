import React from 'react';

const RefundsList = ({ refunds, onOpen }) => {
  if (!refunds || refunds.length === 0) {
    return <div className="text-sm text-gray-500">尚無退款紀錄</div>;
  }
  return (
    <div className="space-y-3">
      {refunds.map(ref => (
        <button
          key={ref.id}
          className="w-full text-left glass rounded-xl p-4 hover:bg-white/60 transition"
          onClick={() => onOpen({ type: 'refund', data: ref })}
        >
          <div className="flex flex-wrap items-center justify-between">
            <div className="font-mono text-sm">{ref.refundNo}</div>
            <div className="text-sm text-gray-600">{ref.createdAt}</div>
            <div className="text-sm font-semibold text-red-600">- NT$ {ref.amounts.totalRefund.toLocaleString()}</div>
            <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{ref.status}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RefundsList;
