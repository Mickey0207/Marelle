import React, { useState } from 'react';

const AddPurchaseOrder = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">新增採購訂單</h1>
        <p className="text-gray-600">新增採購訂單表單開發中...</p>
      </div>
    </div>
  );
};

export default AddPurchaseOrder;
