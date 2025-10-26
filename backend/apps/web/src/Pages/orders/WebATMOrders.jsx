import React from 'react';
import SharedPaymentTable from './_SharedTable';

export default function WebATMOrders(){
  return (
    <SharedPaymentTable endpoint="/backend/orders/webatm" />
  );
}
