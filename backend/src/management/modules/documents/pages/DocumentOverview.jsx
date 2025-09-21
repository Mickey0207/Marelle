import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

const DocumentOverview = () => {
  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <DocumentIcon className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">文件管理</h1>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold font-chinese mb-4">文件總覽</h2>
          <p className="text-gray-600 font-chinese">文件管理功能開發中...</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentOverview;