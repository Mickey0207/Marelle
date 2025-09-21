import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplierList from './SupplierList';
import SupplierForm from './SupplierForm';
import SupplierDetails from './SupplierDetails';

const SupplierManagementContainer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#e8ddd4]">
      <Routes>
        {/* 供應商列表 */}
        <Route index element={<SupplierList />} />
        
        {/* 新增供應商 */}
        <Route path="add" element={<SupplierForm isEdit={false} />} />
        
        {/* 供應商詳情 */}
        <Route path=":id" element={<SupplierDetails />} />
        
        {/* 編輯供應商 */}
        <Route path=":id/edit" element={<SupplierForm isEdit={true} />} />
      </Routes>
    </div>
  );
};

export default SupplierManagementContainer;
