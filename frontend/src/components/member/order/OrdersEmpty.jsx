import React from 'react';

export default function OrdersEmpty() {
  return (
    <div className="rounded-lg border p-6" style={{borderColor:'#E5E7EB', background:'#FFFFFF'}}>
      <p className="text-sm" style={{color:'#999'}}>尚無訂單紀錄。</p>
    </div>
  );
}
