import React, { useState } from 'react';
import { categories } from '../../../external_mock/data/categories.js';

// 四層分類選單元件 (移動到 product 專屬資料夾)
const FourLevelCategoryMenu = ({ onSelect }) => {
  const [level1, setLevel1] = useState(null);
  const [level2, setLevel2] = useState(null);
  const [level3, setLevel3] = useState(null);
  const [level4, setLevel4] = useState(null);

  const level1Options = categories;
  const level2Options = level1?.children || [];
  const level3Options = level2?.children || [];
  const level4Options = level3?.children || [];

  const handleSelect = (level, item) => {
    if (level === 1) {
      setLevel1(item); setLevel2(null); setLevel3(null); setLevel4(null);
    } else if (level === 2) {
      setLevel2(item); setLevel3(null); setLevel4(null);
    } else if (level === 3) {
      setLevel3(item); setLevel4(null);
    } else if (level === 4) {
      setLevel4(item); onSelect?.(item);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-2 border-b pb-2">
        {level1Options.map(item => (
          <button
            key={item.id}
            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-150 ${level1?.id === item.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => handleSelect(1, item)}
          >{item.name}</button>
        ))}
      </div>
      {level2Options.length > 0 && (
        <div className="flex gap-2 border-b pb-2">
          {level2Options.map(item => (
            <button key={item.id} className={`px-4 py-2 rounded-lg transition-colors duration-150 ${level2?.id === item.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => handleSelect(2, item)}>{item.name}</button>
          ))}
        </div>
      )}
      {level3Options.length > 0 && (
        <div className="flex gap-2 border-b pb-2">
          {level3Options.map(item => (
            <button key={item.id} className={`px-4 py-2 rounded-lg transition-colors duration-150 ${level3?.id === item.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => handleSelect(3, item)}>{item.name}</button>
          ))}
        </div>
      )}
      {level4Options.length > 0 && (
        <div className="flex gap-2">
          {level4Options.map(item => (
            <button key={item.id} className={`px-4 py-2 rounded-lg transition-colors duration-150 ${level4?.id === item.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => handleSelect(4, item)}>{item.name}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FourLevelCategoryMenu;