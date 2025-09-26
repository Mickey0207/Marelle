import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '../auth/AuthComponents';
import { AppStateProvider } from './AppStateContext';
import ManagementLayout from '../layouts/ManagementLayout';
import AdminLogin from '../../Pages/auth/AdminLogin';

// Management 模組頁面 - Dashboard
import AdminOverview from '../../Pages/dashboard/Overview';
import SalesAnalytics from '../../Pages/dashboard/SalesAnalytics';
import OperationsManagement from '../../Pages/dashboard/OperationsManagement';
import FinanceReports from '../../Pages/dashboard/FinanceReports';
import LogisticsManagement from '../../Pages/dashboard/LogisticsManagement';
import TaskManagement from '../workflow/TaskManagement';
import ApprovalWorkflowManagement from '../workflow/ApprovalWorkflowManagement';
import RealTimeMonitoringDashboard from '../dashboard/RealTimeMonitoringDashboard';

// Products 模組
import AdminProducts from '../../Pages/products/Products';
import AddProductAdvanced from '../../Pages/products/AddProductAdvanced';
import EditProduct from '../../Pages/products/EditProduct';
import Inventory from '../../Pages/inventory/Inventory';
import WarehouseManagement from '../../Pages/inventory/WarehouseManagement';

// Orders 模組
import OrderList from '../../Pages/orders/OrderList';
import OrderDetails from '../../Pages/orders/OrderDetails';
import OrderForm from '../../Pages/orders/OrderForm';

// Members 模組
import MemberManagement from '../../Pages/members/MemberManagement';

// Gifts 模組 （整合至 marketing，移除不存在頁面的匯入）

// Suppliers 模組
import SupplierList from '../../Pages/procurement/SupplierList';

// Procurement 模組
import ProcurementOverview from '../../Pages/procurement/ProcurementOverview';

// Logistics 模組
import LogisticsTracking from '../../Pages/logistics/LogisticsTracking';
// 移除 Logistics 通知頁面（不再使用）

// Coupons 模組

// Notifications 模組頁面
import NotificationHistory from '../../Pages/notifications/NotificationHistory';
import LineTextMessage from '../../Pages/notifications/LineTextMessage';
import LineFlexMessage from '../../Pages/notifications/LineFlexMessage';
import MailTextMessage from '../../Pages/notifications/MailTextMessage';
import MailHtmlMessage from '../../Pages/notifications/MailHtmlMessage';
import SmsMessage from '../../Pages/notifications/SmsMessage';
import WebNotification from '../../Pages/notifications/WebNotification';

// Accounting 模組
import AccountingOverview from '../../Pages/accounting/AccountingOverview';
import ChartOfAccounts from '../../Pages/accounting/ChartOfAccounts';
import JournalEntries from '../../Pages/accounting/JournalEntries';
import FinancialReports from '../../Pages/accounting/FinancialReports';
import BankReconciliation from '../../Pages/accounting/BankReconciliation';

// Analytics 模組
import AdminAnalyticsOverview from '../../Pages/analytics/AnalyticsOverview';
import SalesAnalyticsPage from '../../Pages/analytics/SalesAnalytics';
import CustomerAnalytics from '../../Pages/analytics/CustomerAnalytics';
import ProductAnalytics from '../../Pages/analytics/ProductAnalytics';
import OperationalAnalytics from '../analytics/OperationalAnalytics';
import AIInsights from '../analytics/AIInsights';

// Settings 模組
import SystemSettingsOverview from '../settings/SystemSettingsOverview';
import GeneralSettings from '../../Pages/settings/GeneralSettings';
import SecuritySettings from '../../Pages/settings/SecuritySettings';
import NotificationSettings from '../../Pages/settings/NotificationSettings';
import PaymentSettings from '../../Pages/settings/PaymentSettings';
import ShippingSettings from '../../Pages/settings/ShippingSettings';

// Admin 模組
import AdminManagement from '../../Pages/admin/AdminManagement';

// Marketing 模組 Pages - 動態載入以進行 code splitting
const MarketingOverviewPage = lazy(() => import('../../Pages/marketing/MarketingMange'));
const CouponManagement = lazy(() => import('../../Pages/marketing/coupons/CouponManagementContainer'));
const FestivalManagement = lazy(() => import('../../Pages/marketing/festivals/FestivalManagement'));
const GiftManagement = lazy(() => import('../../Pages/marketing/gifts/GiftManagement'));

// Festival 模組 Pages（整合進行銷管理後，舊路由將導向 marketing）

// User Tracking 模組 - 暫時移除，因為user-tracking目錄為空
// import UserTrackingOverview from '../../management/components/users/UserTrackingOverview';
// import UserBehaviorAnalytics from '../../management/components/users/UserBehaviorAnalytics';
// import RealTimeActivityMonitor from '../../management/components/dashboard/RealTimeActivityMonitor';
// import UserSegmentManagement from '../../management/components/users/UserSegmentManagement';
// import PrivacySettings from '../../management/components/settings/PrivacySettings';

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <AppStateProvider>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <ManagementLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard 模組路由 */}
              <Route path="" element={<Navigate to="dashboard/overview" replace />} />
              <Route path="dashboard/overview" element={<AdminOverview />} />
              <Route path="dashboard/sales-analytics" element={<SalesAnalytics />} />
              <Route path="dashboard/operations" element={<OperationsManagement />} />
              <Route path="dashboard/finance" element={<FinanceReports />} />
              <Route path="dashboard/logistics" element={<LogisticsManagement />} />
              <Route path="dashboard/tasks" element={<TaskManagement />} />
              <Route path="dashboard/approvals" element={<ApprovalWorkflowManagement />} />
              <Route path="dashboard/realtime" element={<RealTimeMonitoringDashboard />} />

              {/* Products 模組路由 */}
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AddProductAdvanced />} />
              <Route path="products/edit/:sku" element={<EditProduct />} />

              {/* Orders 模組路由 */}
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/details/:id" element={<OrderDetails />} />
              <Route path="orders/new" element={<OrderForm />} />

              {/* Members 模組路由 */}
              <Route path="members" element={<MemberManagement />} />

              {/* Gifts 模組路由（整合後導向行銷管理） */}
              <Route path="gifts" element={<Navigate to="/marketing" replace />} />

              {/* Suppliers 模組路由（集中於採購模組的子頁 /procurement/suppliers） */}
              <Route path="suppliers" element={<SupplierList />} />

              {/* Procurement 模組路由 */}
              <Route path="procurement" element={<ProcurementOverview />} />
              <Route path="procurement/suppliers" element={<SupplierList />} />

              {/* Logistics 模組路由 */}
              <Route path="logistics" element={<LogisticsTracking />} />
              {/* 移除 logistics/notifications 與 logistics/reverse-notifications */}

              {/* Coupons 模組路由（整合後導向行銷管理） */}
              <Route path="coupons" element={<Navigate to="/marketing" replace />} />
              <Route path="coupons/sharing" element={<Navigate to="/marketing" replace />} />
              <Route path="coupons/stacking-rules" element={<Navigate to="/marketing" replace />} />

              {/* Notifications 模組路由 */}
              <Route path="notifications" element={<NotificationHistory />} />
              <Route path="notifications/line-text" element={<LineTextMessage />} />
              <Route path="notifications/line-flex" element={<LineFlexMessage />} />
              <Route path="notifications/mail-text" element={<MailTextMessage />} />
              <Route path="notifications/mail-html" element={<MailHtmlMessage />} />
              <Route path="notifications/sms" element={<SmsMessage />} />
              <Route path="notifications/web" element={<WebNotification />} />

              {/* Marketing 模組路由（整合入口 + 子頁） */}
              <Route
                path="marketing"
                element={
                  <Suspense fallback={<div className="p-6 text-gray-600">載入行銷管理中...</div>}>
                    <MarketingOverviewPage />
                  </Suspense>
                }
              >
                <Route index element={<Navigate to="coupons" replace />} />
                <Route
                  path="coupons"
                  element={
                    <Suspense fallback={<div className="p-6 text-gray-600">載入優惠券...</div>}>
                      <CouponManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="festivals"
                  element={
                    <Suspense fallback={<div className="p-6 text-gray-600">載入節慶管理...</div>}>
                      <FestivalManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="gifts"
                  element={
                    <Suspense fallback={<div className="p-6 text-gray-600">載入贈品管理...</div>}>
                      <GiftManagement />
                    </Suspense>
                  }
                />
              </Route>

              {/* Festivals 模組路由（整合後導向行銷管理） */}
              <Route path="festivals/manage" element={<Navigate to="/marketing" replace />} />

              {/* Accounting 模組路由 */}
              <Route path="accounting" element={<AccountingOverview />} />
              <Route path="accounting/chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="accounting/journal-entries" element={<JournalEntries />} />
              <Route path="accounting/financial-reports" element={<FinancialReports />} />
              <Route path="accounting/bank-reconciliation" element={<BankReconciliation />} />

              {/* Analytics 模組路由 */}
              <Route path="analytics" element={<AdminAnalyticsOverview />} />
              <Route path="analytics/sales" element={<SalesAnalyticsPage />} />
              <Route path="analytics/customers" element={<CustomerAnalytics />} />
              <Route path="analytics/products" element={<ProductAnalytics />} />
              <Route path="analytics/operations" element={<OperationalAnalytics />} />
              <Route path="analytics/ai-insights" element={<AIInsights />} />

              {/* Settings 模組路由 */}
              <Route path="settings" element={<SystemSettingsOverview />} />
              <Route path="settings/general" element={<GeneralSettings />} />
              <Route path="settings/security" element={<SecuritySettings />} />
              <Route path="settings/notifications" element={<NotificationSettings />} />
              <Route path="settings/payment" element={<PaymentSettings />} />
              <Route path="settings/shipping" element={<ShippingSettings />} />

              {/* Admin 模組路由 */}
              <Route path="admin" element={<AdminManagement />} />

              {/* Inventory 模組路由 (獨立模組) */}
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/warehouses" element={<WarehouseManagement />} />
              {/* 暫時註解掉，因為還沒有對應的頁面 */}
              {/* <Route path="inventory/list" element={<Inventory />} />
              <Route path="inventory/adjustments" element={<Inventory />} />
              <Route path="inventory/alerts" element={<Inventory />} />
              <Route path="inventory/reports" element={<Inventory />} /> */}
            </Route>
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;