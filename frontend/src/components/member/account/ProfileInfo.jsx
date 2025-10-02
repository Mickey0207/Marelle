import React from 'react';

export default function ProfileInfo({ user }) {
  return (
    <section className="border rounded-lg p-6 bg-white" style={{borderColor:'#E5E7EB'}}>
      <h2 className="text-base font-medium mb-5" style={{color:'#333333'}}>帳號資訊</h2>
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span style={{color:'#666666'}}>使用者名稱</span>
          <span className="font-medium" style={{color:'#CC824D'}}>{user.username}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{color:'#666666'}}>建立時間</span>
          <span style={{color:'#333333'}}>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{color:'#666666'}}>登入狀態</span>
          <span className="flex items-center gap-2" style={{color:'#16a34a'}}>
            <span className="inline-block w-2 h-2 rounded-full" style={{background:'#16a34a'}} />
            已登入
          </span>
        </div>
      </div>
    </section>
  );
}
