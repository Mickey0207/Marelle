import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      // 模擬載入供應商數據
      setSupplier({
        id: id,
        name: '供應商名稱',
        contact: '聯絡人',
        email: 'contact@supplier.com'
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">供應商詳情</h1>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          {supplier ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">{supplier.name}</h2>
              <p className="text-gray-600">ID: {supplier.id}</p>
              <p className="text-gray-600">聯絡人: {supplier.contact}</p>
              <p className="text-gray-600">電子郵件: {supplier.email}</p>
            </div>
          ) : (
            <p className="text-gray-600">找不到供應商資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
