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
        {/* 供應商列表頁 */}
        <Route index element={<SupplierList />} />
        
        {/* 新增供應商頁 */}
        <Route path="add" element={<SupplierForm isEdit={false} />} />
        
        {/* 供應商詳情頁 */}
        <Route path=":id" element={<SupplierDetails />} />
        
        {/* 編輯供應商頁 */}
        <Route path=":id/edit" element={<SupplierForm isEdit={true} />} />
        
        {/* 商品關聯管理頁 - 使用修復版本 */}
        <Route path="products" element={<SupplierProductAssociationFixed />} />
        
        {/* 績效評估頁 - 使用修復版本 */}
        <Route path="performance" element={<SupplierPerformanceFixed />} />
      </Routes>
    </div>
  );
};

export default SupplierManagementContainer;