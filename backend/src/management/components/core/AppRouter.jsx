import React from 'react';
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
import Customers from '../../Pages/members/Customers';

// Gifts 模組 
import GiftManagement from '../../Pages/members/GiftManagement';
import GiftTierRules from '../../Pages/members/GiftTierRules';
import MemberGiftBenefits from '../../Pages/members/MemberGiftBenefits';
import GiftAllocationTracking from '../../Pages/members/GiftAllocationTracking';

// Suppliers 模組
import SupplierList from '../../Pages/suppliers/SupplierList';
import SupplierForm from '../../Pages/suppliers/SupplierForm';
import SupplierDetails from '../../Pages/suppliers/SupplierDetails';

// Procurement 模組
import ProcurementOverview from '../../Pages/procurement/ProcurementOverview';
import PurchaseOrderList from '../../Pages/procurement/PurchaseOrderList';
import PurchaseOrderDetails from '../../Pages/procurement/PurchaseOrderDetails';
import AddPurchaseOrder from '../../Pages/procurement/AddPurchaseOrder';
import ProcurementSuggestions from '../../Pages/procurement/ProcurementSuggestions';
import InspectionReceipt from '../../Pages/procurement/InspectionReceipt';
import ProcurementAnalytics from '../../Pages/procurement/ProcurementAnalytics';

// Logistics 模組
import LogisticsOverview from '../../Pages/logistics/LogisticsOverview';
import ShipmentManagement from '../../Pages/logistics/ShipmentManagement';
import ShippingRateConfig from '../../Pages/logistics/ShippingRateConfig';
import LogisticsTracking from '../../Pages/logistics/LogisticsTracking';
import ReturnManagement from '../../Pages/logistics/ReturnManagement';
import LogisticsAnalytics from '../../Pages/logistics/LogisticsAnalytics';
import LogisticsProviders from '../../Pages/logistics/LogisticsProviders';

// Coupons 模組
import CouponManagement from '../../Pages/coupons/CouponManagementContainer';
import SharingManager from '../coupons/SharingManager';
import StackingRulesManager from '../coupons/StackingRulesManager';

// Notifications 模組
import TemplateManagement from '../notifications/TemplateManagement';
import VariableManagement from '../notifications/VariableManagement';
import TriggerManagement from '../notifications/TriggerManagement';
import ChannelSettings from '../../Pages/notifications/ChannelSettings';
import NotificationHistory from '../../Pages/notifications/NotificationHistory';
import AnalyticsOverview from '../../Pages/notifications/AnalyticsOverview';
import NotificationManagement from '../../Pages/notifications/NotificationManagement';

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

// Documents 模組
import DocumentOverview from '../../Pages/documents/DocumentOverview';
import SalesDocumentManagement from '../../Pages/documents/SalesDocumentManagement';
import PurchaseDocumentManagement from '../../Pages/documents/PurchaseDocumentManagement';
import InventoryDocumentManagement from '../../Pages/documents/InventoryDocumentManagement';
import ApprovalWorkflowSystem from '../../Pages/documents/ApprovalWorkflowSystem';

// Admin 模組
import AdminManagement from '../../Pages/admin/AdminManagement';
import AdminRoleManagement from '../../Pages/admin/AdminRoleManagement';
import AdminUserManagement from '../../Pages/admin/AdminUserManagement';

// Marketing 模組 - 暫時移除，因為marketing目錄為空
// import MarketingOverview from '../../management/components/marketing/MarketingOverview';
// import CampaignManagement from '../../management/components/marketing/CampaignManagement';
// import AdvertisingManagement from '../../management/components/marketing/AdvertisingManagement';
// import AudienceManagement from '../../management/components/marketing/AudienceManagement';

// Festival 模組 - 暫時移除，因為festivals目錄為空
// import FestivalOverview from '../../management/components/marketing/FestivalOverview';
// import FestivalManagement from '../../management/components/marketing/FestivalManagement';
// import PromotionSettings from '../../management/components/marketing/PromotionSettings';
// import FestivalAnalytics from '../../management/components/analytics/FestivalAnalytics';

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
              <Route path="members/customers" element={<Customers />} />

              {/* Gifts 模組路由 */}
              <Route path="gifts" element={<GiftManagement />} />
              <Route path="gifts/tier-rules" element={<GiftTierRules />} />
              <Route path="gifts/member-benefits" element={<MemberGiftBenefits />} />
              <Route path="gifts/allocation-tracking" element={<GiftAllocationTracking />} />

              {/* Suppliers 模組路由 */}
              <Route path="suppliers" element={<SupplierList />} />
              <Route path="suppliers/new" element={<SupplierForm />} />
              <Route path="suppliers/edit/:id" element={<SupplierForm />} />
              <Route path="suppliers/details/:id" element={<SupplierDetails />} />

              {/* Procurement 模組路由 */}
              <Route path="procurement" element={<ProcurementOverview />} />
              <Route path="procurement/purchase-orders" element={<PurchaseOrderList />} />
              <Route path="procurement/purchase-orders/details/:id" element={<PurchaseOrderDetails />} />
              <Route path="procurement/purchase-orders/new" element={<AddPurchaseOrder />} />
              <Route path="procurement/suggestions" element={<ProcurementSuggestions />} />
              <Route path="procurement/inspection" element={<InspectionReceipt />} />
              <Route path="procurement/analytics" element={<ProcurementAnalytics />} />

              {/* Logistics 模組路由 */}
              <Route path="logistics" element={<LogisticsOverview />} />
              <Route path="logistics/shipments" element={<ShipmentManagement />} />
              <Route path="logistics/rates" element={<ShippingRateConfig />} />
              <Route path="logistics/tracking" element={<LogisticsTracking />} />
              <Route path="logistics/returns" element={<ReturnManagement />} />
              <Route path="logistics/analytics" element={<LogisticsAnalytics />} />
              <Route path="logistics/providers" element={<LogisticsProviders />} />

              {/* Coupons 模組路由 */}
              <Route path="coupons" element={<CouponManagement />} />
              <Route path="coupons/sharing" element={<SharingManager />} />
              <Route path="coupons/stacking-rules" element={<StackingRulesManager />} />

              {/* Notifications 模組路由 */}
              <Route path="notifications" element={<NotificationManagement />} />
              <Route path="notifications/templates" element={<TemplateManagement />} />
              <Route path="notifications/variables" element={<VariableManagement />} />
              <Route path="notifications/triggers" element={<TriggerManagement />} />
              <Route path="notifications/channels" element={<ChannelSettings />} />
              <Route path="notifications/history" element={<NotificationHistory />} />
              <Route path="notifications/analytics" element={<AnalyticsOverview />} />

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

              {/* Documents 模組路由 */}
              <Route path="documents" element={<DocumentOverview />} />
              <Route path="documents/sales" element={<SalesDocumentManagement />} />
              <Route path="documents/purchase" element={<PurchaseDocumentManagement />} />
              <Route path="documents/inventory" element={<InventoryDocumentManagement />} />
              <Route path="documents/approval-workflow" element={<ApprovalWorkflowSystem />} />

              {/* Admin 模組路由 */}
              <Route path="admin" element={<AdminManagement />} />
              <Route path="admin/roles" element={<AdminRoleManagement />} />
              <Route path="admin/users" element={<AdminUserManagement />} />

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