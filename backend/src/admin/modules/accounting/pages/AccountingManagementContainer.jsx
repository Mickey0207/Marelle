import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountingOverview from '../components/AccountingOverview';
import ChartOfAccounts from '../components/ChartOfAccounts';
import JournalEntries from '../components/JournalEntries';
import FinancialReports from '../components/FinancialReports';
import BankReconciliation from '../components/BankReconciliation';

/**
 * ?ƒè?ç®¡ç?ç³»çµ±è·¯ç”±å®¹å™¨
 * ?•ç??ƒè?ç®¡ç?ç³»çµ±?§ç??€?‰å?è·¯ç”±
 */
const AccountingManagementContainer = () => {
  return (
    <Routes>
      {/* ?è¨­å°å??ƒè?ç¸½è¦½ */}
      <Route index element={<Navigate to="overview" replace />} />
      
      {/* ?ƒè?ç¸½è¦½ */}
      <Route path="overview" element={<AccountingOverview />} />
      
      {/* ?ƒè?ç§‘ç›® */}
      <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
      
      {/* ?ƒè??†é? */}
      <Route path="journal-entries" element={<JournalEntries />} />
      
      {/* è²¡å??±è¡¨ */}
      <Route path="financial-reports" element={<FinancialReports />} />
      
      {/* ?€è¡Œå?å¸?*/}
      <Route path="bank-reconciliation" element={<BankReconciliation />} />
    </Routes>
  );
};

export default AccountingManagementContainer;
