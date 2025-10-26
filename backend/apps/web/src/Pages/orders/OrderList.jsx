import React from 'react';
import { useLocation } from 'react-router-dom';
import CreditOrders from "./CreditOrders";
import ATMOrders from "./ATMOrders";
import CVSCodeOrders from "./CVSCodeOrders";
import WebATMOrders from "./WebATMOrders";

const OrderList = () => {
  const location = useLocation();
  const active = React.useMemo(() => {
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/orders/atm')) return 'atm';
    if (p.includes('/orders/cvscode')) return 'cvscode';
    if (p.includes('/orders/webatm')) return 'webatm';
    return 'credit';
  }, [location.pathname]);
  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">訂單管理</h1>
        <p className="text-gray-600 mt-2">依付款方式檢視與管理</p>
      </div>
      {active === 'credit' && <CreditOrders />}
      {active === 'atm' && <ATMOrders />}
      {active === 'cvscode' && <CVSCodeOrders />}
      {active === 'webatm' && <WebATMOrders />}
    </div>
  );
};

export default OrderList;
