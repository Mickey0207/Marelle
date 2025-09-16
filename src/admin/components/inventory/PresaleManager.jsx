import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PresaleManager = () => {
  const [allowNegative, setAllowNegative] = useState(false);
  const [presaleNote, setPresaleNote] = useState('');

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-pink-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">預售/負庫存設定</h2>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <label className="inline-flex items-center font-chinese">
          <input type="checkbox" className="accent-pink-500 w-5 h-5 mr-2" checked={allowNegative} onChange={e => setAllowNegative(e.target.checked)} />
          允許負庫存（預售）
        </label>
        {allowNegative && (
          <input
            className="input ml-4"
            placeholder="預售說明（選填）"
            value={presaleNote}
            onChange={e => setPresaleNote(e.target.value)}
          />
        )}
      </div>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 font-chinese text-pink-700">
        {allowNegative ? (
          <>
            <div className="font-bold mb-1">預售狀態已啟用</div>
            <div>消費者可下單超過現有庫存，系統將自動標記為預售訂單。</div>
            {presaleNote && <div className="mt-2 text-sm text-pink-500">備註：{presaleNote}</div>}
          </>
        ) : (
          <>
            <div className="font-bold mb-1">預售狀態未啟用</div>
            <div>僅可銷售現有庫存，超過庫存將無法下單。</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PresaleManager;
