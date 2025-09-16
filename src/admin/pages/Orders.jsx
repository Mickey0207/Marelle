import { Routes, Route } from 'react-router-dom';
import OrderList from './orders/OrderList';
import OrderDetails from './orders/OrderDetails';
import OrderForm from './orders/OrderForm';

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