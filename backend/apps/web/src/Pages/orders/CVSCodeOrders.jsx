import React from 'react';
import SharedPaymentTable from './_SharedTable';

export default function CVSCodeOrders(){
  return (
    <SharedPaymentTable endpoint="/backend/orders/cvscode" />
  );
}
