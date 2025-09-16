import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountingOverview from '../components/AccountingOverview';
import ChartOfAccounts from '../components/ChartOfAccounts';
import JournalEntries from '../components/JournalEntries';
import FinancialReports from '../components/FinancialReports';
import BankReconciliation from '../components/BankReconciliation';

/**
 * 會計管理系統路由容器
 * 處理會計管理系統內的所有子路由
 */
const AccountingManagementContainer = () => {
  return (
    <Routes>
      {/* 預設導向會計總覽 */}
      <Route index element={<Navigate to="overview" replace />} />
      
      {/* 會計總覽 */}
      <Route path="overview" element={<AccountingOverview />} />
      
      {/* 會計科目 */}
      <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
      
      {/* 會計分錄 */}
      <Route path="journal-entries" element={<JournalEntries />} />
      
      {/* 財務報表 */}
      <Route path="financial-reports" element={<FinancialReports />} />
      
      {/* 銀行對帳 */}
      <Route path="bank-reconciliation" element={<BankReconciliation />} />
    </Routes>
  );
};

export default AccountingManagementContainer;