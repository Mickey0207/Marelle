import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">編輯商品</h1>
      <p>商品 ID: {id}</p>
      <button 
        onClick={() => navigate('/admin/products')}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        返回商品列表
      </button>
    </div>
  );
};

export default EditProduct;