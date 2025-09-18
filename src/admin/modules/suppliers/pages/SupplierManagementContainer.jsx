import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplierList from './SupplierList';
import SupplierForm from './SupplierForm';
import SupplierDetails from './SupplierDetails';
import SupplierProductAssociationFixed from './SupplierProductAssociationFixed';
import SupplierPerformanceFixed from './SupplierPerformanceFixed';

const SupplierManagementContainer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#e8ddd4]">
      <Routes>
        {/* 供�??��?表�? */}
        <Route index element={<SupplierList />} />
        
        {/* ?��?供�??��? */}
        <Route path="add" element={<SupplierForm isEdit={false} />} />
        
        {/* 供�??�詳?��? */}
        <Route path=":id" element={<SupplierDetails />} />
        
        {/* 編輯供�??��? */}
        <Route path=":id/edit" element={<SupplierForm isEdit={true} />} />
        
        {/* ?��??�聯管�???- 使用修復?�本 */}
        <Route path="products" element={<SupplierProductAssociationFixed />} />
        
        {/* 績�?評估??- 使用修復?�本 */}
        <Route path="performance" element={<SupplierPerformanceFixed />} />
      </Routes>
    </div>
  );
};

export default SupplierManagementContainer;
