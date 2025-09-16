import React from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';

const LogisticsIntegration = () => {
  return (
    <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
      <TruckIcon className="w-16 h-16 text-amber-400 mb-4" />
      <h2 className="text-2xl font-bold font-chinese mb-2">物流整合（佔位）</h2>
      <p className="text-gray-500 font-chinese text-center max-w-md">
        此區預留給未來物流系統整合功能，例如：出貨單同步、物流追蹤、運費計算等。<br />
        若有特定物流需求，請與開發人員聯繫。
      </p>
    </div>
  );
};

export default LogisticsIntegration;
