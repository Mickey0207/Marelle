import React from 'react';

export default function ProfileNotice() {
  return (
    <section className="border rounded-lg p-6 bg-white" style={{borderColor:'#E5E7EB'}}>
      <h2 className="text-base font-medium mb-5" style={{color:'#333333'}}>通知 / 假資料</h2>
      <p className="text-sm leading-relaxed" style={{color:'#666666'}}>
        目前尚未串接後端，這裡可以未來顯示會員層級、優惠券、點數或訂閱設定。
      </p>
    </section>
  );
}
