import React from 'react';

const MailHtmlMessage = () => {
  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">Mail HTML</h1>
        <p className="text-gray-600 mt-2">建立並預覽 HTML 郵件</p>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <p className="text-gray-500">此頁面重構中，稍後將提供 HTML 編輯器與預覽。</p>
      </div>
    </div>
  );
};

export default MailHtmlMessage;
