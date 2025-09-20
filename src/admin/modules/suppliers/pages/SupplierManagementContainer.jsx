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
        {/* ä¾›æ??†å?è¡¨é? */}
        <Route index element={<SupplierList />} />
        
        {/* ?°å?ä¾›æ??†é? */}
        <Route path="add" element={<SupplierForm isEdit={false} />} />
        
        {/* ä¾›æ??†è©³?…é? */}
        <Route path=":id" element={<SupplierDetails />} />
        
        {/* ç·¨è¼¯ä¾›æ??†é? */}
        <Route path=":id/edit" element={<SupplierForm isEdit={true} />} />
        
        {/* ?†å??œè¯ç®¡ç???- ä½¿ç”¨ä¿®å¾©?ˆæœ¬ */}
        <Route path="products" element={<SupplierProductAssociationFixed />} />
        
        {/* ç¸¾æ?è©•ä¼°??- ä½¿ç”¨ä¿®å¾©?ˆæœ¬ */}
        <Route path="performance" element={<SupplierPerformanceFixed />} />
      </Routes>
    </div>
  );
};

export default SupplierManagementContainer;
