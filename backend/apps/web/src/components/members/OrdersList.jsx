import React from 'react';

const money = (n) => `NT$ ${Number(n || 0).toLocaleString()}`;

const OrdersList = ({ orders, onOpen }) => {
  if (!orders || orders.length === 0) {
    return <div className="text-sm text-gray-500">尚無訂單</div>;
  }
  return (
    <div className="space-y-3">
      {orders.map(order => (
        <button
          key={order.id}
          className="w-full text-left glass rounded-xl p-4 hover:bg-white/60 transition"
          onClick={() => onOpen({ type: 'order', data: order })}
        >
          <div className="flex flex-wrap items-center justify-between">
            <div className="font-mono text-sm">{order.orderNo}</div>
            <div className="text-sm text-gray-600">{order.createdAt}</div>
            <div className="text-sm font-semibold">{money(order?.totals?.grandTotal ?? order?.grandTotal ?? order?.total)}</div>
            <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{order.status}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OrdersList;
