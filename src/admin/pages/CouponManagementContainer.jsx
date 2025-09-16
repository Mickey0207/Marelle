import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CouponList from './coupons/CouponList';
import CouponDetails from './coupons/CouponDetails';
import CouponForm from './coupons/CouponForm';
import StackingRulesManager from './coupons/StackingRulesManager';
import SharingManager from './coupons/SharingManager';

const CouponManagementContainer = () => {
  return (
    <Routes>
      <Route index element={<CouponList />} />
      <Route path="new" element={<CouponForm />} />
      <Route path=":id" element={<CouponDetails />} />
      <Route path=":id/edit" element={<CouponForm />} />
      <Route path="stacking-rules" element={<StackingRulesManager />} />
      <Route path="sharing" element={<SharingManager />} />
    </Routes>
  );
};

export default CouponManagementContainer;