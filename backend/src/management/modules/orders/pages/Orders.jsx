import { Routes, Route } from 'react-router-dom';
import OrderList from "./OrderList";
import OrderDetails from './OrderDetails';
import OrderForm from './OrderForm';

const AdminOrders = () => {
  return (
    <Routes>
      <Route index element={<OrderList />} />
      <Route path=":id" element={<OrderDetails />} />
      <Route path=":id/edit" element={<OrderForm />} />
      <Route path="new" element={<OrderForm />} />
    </Routes>
  );
};

export default AdminOrders;
