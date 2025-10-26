import React from 'react';
import SharedPaymentTable from './_SharedTable';

export default function ATMOrders(){
  return (
    <SharedPaymentTable endpoint="/backend/orders/atm" />
  );
}
