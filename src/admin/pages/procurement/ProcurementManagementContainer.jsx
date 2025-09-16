import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProcurementOverview from './ProcurementOverview';
import PurchaseOrderList from './PurchaseOrderList';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import AddPurchaseOrder from './AddPurchaseOrder';
import ProcurementSuggestions from './ProcurementSuggestions';
import InspectionReceipt from './InspectionReceipt';
import ProcurementAnalytics from './ProcurementAnalytics';

const ProcurementManagementContainer = () => {
  return (
    <Routes>
      <Route index element={<ProcurementOverview />} />
      <Route path="orders" element={<PurchaseOrderList />} />
      <Route path="orders/:id" element={<PurchaseOrderDetails />} />
      <Route path="orders/add" element={<AddPurchaseOrder />} />
      <Route path="orders/edit/:id" element={<AddPurchaseOrder />} />
      <Route path="suggestions" element={<ProcurementSuggestions />} />
      <Route path="inspection" element={<InspectionReceipt />} />
      <Route path="analytics" element={<ProcurementAnalytics />} />
    </Routes>
  );
};

export default ProcurementManagementContainer;