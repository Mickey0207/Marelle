import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountingOverview from '../components/AccountingOverview';
import ChartOfAccounts from '../components/ChartOfAccounts';
import JournalEntries from '../components/JournalEntries';
import FinancialReports from '../components/FinancialReports';
import BankReconciliation from '../components/BankReconciliation';

/**
 * ?��?管�?系統路由容器
 * ?��??��?管�?系統?��??�?��?路由
 */
const AccountingManagementContainer = () => {
  return (
    <Routes>
      {/* ?�設導�??��?總覽 */}
      <Route index element={<Navigate to="overview" replace />} />
      
      {/* ?��?總覽 */}
      <Route path="overview" element={<AccountingOverview />} />
      
      {/* ?��?科目 */}
      <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
      
      {/* ?��??��? */}
      <Route path="journal-entries" element={<JournalEntries />} />
      
      {/* 財�??�表 */}
      <Route path="financial-reports" element={<FinancialReports />} />
      
      {/* ?�行�?�?*/}
      <Route path="bank-reconciliation" element={<BankReconciliation />} />
    </Routes>
  );
};

export default AccountingManagementContainer;
