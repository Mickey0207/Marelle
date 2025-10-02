import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileQuickLinks() {
  return (
    <div className="border rounded-lg p-5 bg-white" style={{borderColor:'#E5E7EB'}}>
      <h3 className="text-sm font-medium mb-4" style={{color:'#333333'}}>快速連結</h3>
      <div className="flex flex-col gap-2 text-sm">
        <Link to="/orders" className="underline" style={{color:'#666666'}}>訂單中心 (預留)</Link>
        <Link to="/vip" className="underline" style={{color:'#666666'}}>會員專屬 (預留)</Link>
        <Link to="/products" className="underline" style={{color:'#666666'}}>返回商品列表</Link>
      </div>
    </div>
  );
}
