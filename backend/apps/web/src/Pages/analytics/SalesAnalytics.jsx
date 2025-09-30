import React from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';

const SalesAnalytics = () => {
  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>銷售分析</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>銷售數據和趨勢分析</p>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
          <p className="text-gray-600 font-chinese">銷售分析功能開發中...</p>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;