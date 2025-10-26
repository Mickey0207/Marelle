import React from 'react';
import SharedPaymentTable from './_SharedTable';

export default function CreditOrders(){
  return (
    <SharedPaymentTable endpoint="/backend/orders/credit" />
  );
}
