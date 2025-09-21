import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountingOverview from '../components/AccountingOverview';
import ChartOfAccounts from '../components/ChartOfAccounts';
import JournalEntries from '../components/JournalEntries';
import FinancialReports from '../components/FinancialReports';
import BankReconciliation from '../components/BankReconciliation';

/**
 * 分析管�?系統路由容器
 * 分析分析管�?系統分析分析��?路由
 */
const AccountingManagementContainer = () => {
  return (
    <Routes>
      {/* ?�設導�?分析總覽 */}
      <Route index element={<Navigate to="overview" replace />} />
      
      {/* 分析總覽 */}
      <Route path="overview" element={<AccountingOverview />} />
      
      {/* 分析科目 */}
      <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
      
      {/* 分析分析 */}
      <Route path="journal-entries" element={<JournalEntries />} />
      
      {/* 財�??�表 */}
      <Route path="financial-reports" element={<FinancialReports />} />
      
      {/* ?�行�分析*/}
      <Route path="bank-reconciliation" element={<BankReconciliation />} />
    </Routes>
  );
};

export default AccountingManagementContainer;
