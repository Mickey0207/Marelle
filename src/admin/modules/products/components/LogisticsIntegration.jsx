import React from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';

const LogisticsIntegration = () => {
  return (
    <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
      <TruckIcon className="w-16 h-16 text-amber-400 mb-4" />
      <h2 className="text-2xl font-bold font-chinese mb-2">?��??��?（�?位�?</h2>
      <p className="text-gray-500 font-chinese text-center max-w-md">
        此�??��?給未來物流系統整?��??��?例�?：出貨單?�步?�物流追蹤、�?費�?算�???br />
        ?��??��??��??�求�?請�??�發人員?�繫??
      </p>
    </div>
  );
};

export default LogisticsIntegration;
