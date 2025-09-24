import React, { useState, useEffect } from 'react';
import giftDataManager from '../../../lib/data/gifts/giftDataManager';

const GiftTierRules = () => {
  const [loading, setLoading] = useState(true);
  const [rulesCount, setRulesCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { success, data } = await giftDataManager.getTierRules();
      if (success) setRulesCount(data.length);
      setLoading(false);
    };
    load();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">禮品等級規則</h1>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-8 text-center">
          <p className="text-gray-600">禮品等級規則開發中...</p>
          <div className="mt-2 text-sm text-gray-500">目前規則數：{rulesCount}</div>
        </div>
      </div>
    </div>
  );
};

export default GiftTierRules;
