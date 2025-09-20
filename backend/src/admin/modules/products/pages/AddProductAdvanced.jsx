import React, { useState } from 'react';

const AddProductAdvanced = () => {
  const [activeTab, setActiveTab] = useState('basic');
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">新增商品 - 進階設定</h1>
          <p className="mt-1 text-sm text-gray-500">建立新的商品並設定詳細資訊</p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            功能開發中...
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            onClick={() => alert('商品保存成功！')}
          >
            發布商品
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductAdvanced;
