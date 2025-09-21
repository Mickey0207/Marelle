import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PresaleManager = () => {
  const [allowNegative, setAllowNegative] = useState(false);
  const [presaleNote, setPresaleNote] = useState('');

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-pink-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">?�售/負庫存設分析/h2>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <label className="inline-flex items-center font-chinese">
          <input type="checkbox" className="accent-pink-500 w-5 h-5 mr-2" checked={allowNegative} onChange={e => setAllowNegative(e.target.checked)} />
          ?�許負庫存分析?�售分析
        </label>
        {allowNegative && (
          <input
            className="input ml-4"
            placeholder="?�售說分析（選填分析"
            value={presaleNote}
            onChange={e => setPresaleNote(e.target.value)}
          />
        )}
      </div>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 font-chinese text-pink-700">
        {allowNegative ? (
          <>
            <div className="font-bold mb-1">?�售分析�已?�用</div>
            <div>消費?�可下單超分析分析庫分析，系統分析分析標分析分析分析分析/div>
            {presaleNote && <div className="mt-2 text-sm text-pink-500">?�註：{presaleNote}</div>}
          </>
        ) : (
          <>
            <div className="font-bold mb-1">?�售分析�未?�用</div>
            <div>?�可?�售分析庫分析，分析?�庫存分析分析下單??/div>
          </>
        )}
      </div>
    </div>
  );
};

export default PresaleManager;
