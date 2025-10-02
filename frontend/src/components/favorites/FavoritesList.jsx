import React from 'react';

export default function FavoritesList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center" style={{borderColor:'#E5E7EB', background:'#FFFFFF'}}>
        <p className="text-sm mb-3" style={{color:'#666'}}>目前還沒有任何收藏的商品。</p>
        <p className="text-xs" style={{color:'#999'}}>瀏覽商品並點擊愛心即可加入收藏。</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map(item => (
        <div key={item.id} className="border rounded-lg overflow-hidden group" style={{borderColor:'#E5E7EB', background:'#FFFFFF'}}>
          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-xs" style={{color:'#999'}}>Image</div>
          <div className="p-3">
            <p className="text-sm font-chinese mb-1" style={{color:'#444'}}>{item.name || '未命名商品'}</p>
            <p className="text-xs" style={{color:'#999'}}>{item.price ? `NT$${item.price}` : '—'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
