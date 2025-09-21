import React from 'react';
import { ADMIN_STYLES } from '../../../shared/styles/adminStyles';

const ProductAnalytics = () => {
  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>產品分析</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>產品銷售和績效分析</p>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
          <p className="text-gray-600 font-chinese">產品分析功能開發中...</p>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;