import React from 'react';
import { ADMIN_STYLES } from '../../styles/adminStyles';

const SupplierTestPage = () => {
  return (
    <div className={ADMIN_STYLES.sectionSpacing}>
      <div className={ADMIN_STYLES.glassCard}>
        <h1 className={ADMIN_STYLES.pageTitle}>供應商管理測試頁面</h1>
        <p className={ADMIN_STYLES.pageSubtitle}>
          如果您看到這個頁面，表示供應商管理的路由配置是正確的。
        </p>
        <div className={ADMIN_STYLES.componentSpacing}>
          <p><strong>當前路徑:</strong> /admin/suppliers</p>
          <p><strong>狀態:</strong> <span className={ADMIN_STYLES.statusSuccess}>路由正常</span></p>
        </div>
      </div>
    </div>
  );
};

export default SupplierTestPage;