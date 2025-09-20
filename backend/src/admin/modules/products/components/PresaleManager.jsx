import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PresaleManager = () => {
  const [allowNegative, setAllowNegative] = useState(false);
  const [presaleNote, setPresaleNote] = useState('');

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-pink-500 mr-2" />
        <h2 className="text-xl font-bold font-chinese">?å”®/è² åº«å­˜è¨­å®?/h2>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <label className="inline-flex items-center font-chinese">
          <input type="checkbox" className="accent-pink-500 w-5 h-5 mr-2" checked={allowNegative} onChange={e => setAllowNegative(e.target.checked)} />
          ?è¨±è² åº«å­˜ï??å”®ï¼?
        </label>
        {allowNegative && (
          <input
            className="input ml-4"
            placeholder="?å”®èªªæ?ï¼ˆé¸å¡«ï?"
            value={presaleNote}
            onChange={e => setPresaleNote(e.target.value)}
          />
        )}
      </div>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 font-chinese text-pink-700">
        {allowNegative ? (
          <>
            <div className="font-bold mb-1">?å”®?€?‹å·²?Ÿç”¨</div>
            <div>æ¶ˆè²»?…å¯ä¸‹å–®è¶…é??¾æ?åº«å?ï¼Œç³»çµ±å??ªå?æ¨™è??ºé??®è??®ã€?/div>
            {presaleNote && <div className="mt-2 text-sm text-pink-500">?™è¨»ï¼š{presaleNote}</div>}
          </>
        ) : (
          <>
            <div className="font-bold mb-1">?å”®?€?‹æœª?Ÿç”¨</div>
            <div>?…å¯?·å”®?¾æ?åº«å?ï¼Œè??åº«å­˜å??¡æ?ä¸‹å–®??/div>
          </>
        )}
      </div>
    </div>
  );
};

export default PresaleManager;
