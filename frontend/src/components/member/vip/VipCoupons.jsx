import React from 'react';
import { vipCoupons as coupons } from '../../../../external_mock/data/vipCoupons.js';

export default function VipCoupons() {
  

  return (
    <div className="space-y-4">
      {coupons.map((cp) => (
        <div key={cp.id} className="border rounded-lg p-4 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium" style={{ color: '#CC824D' }}>{cp.title}</div>
              <div className="text-xs mt-1" style={{ color: '#666666' }}>{cp.desc}</div>
            </div>
            <button
              className="px-3 py-1.5 rounded-md text-xs border"
              style={{ color: '#666666', borderColor: '#E5E7EB' }}
              type="button"
            >使用</button>
          </div>
          <div className="mt-3 text-xs" style={{ color: '#333333' }}>
            代碼：<span className="font-mono tracking-wider" style={{ color: '#CC824D' }}>{cp.code}</span>
          </div>
          <div className="mt-1 text-xs" style={{ color: '#999999' }}>有效至：{cp.expire}</div>
          {cp.note && (
            <div className="mt-2 text-[11px] leading-relaxed" style={{ color: '#666666' }}>注意事項：{cp.note}</div>
          )}
        </div>
      ))}
    </div>
  );
}
