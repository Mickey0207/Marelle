import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from "../../../lib/data/products/mockProductData";

const EditProduct = () => {
  const { sku } = useParams();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.baseSKU === sku);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">編輯商品</h1>
      <p>商品 SKU: {sku}</p>
      <p className="mt-2 text-sm text-gray-600">{product ? `商品名稱：${product.name}` : '找不到此商品（SKU）'}</p>
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