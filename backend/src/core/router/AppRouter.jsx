import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '../auth/AuthContext';
import { AppStateProvider } from '../../shared/contexts/AppStateContext';
import AdminLayout from '../layout/AdminLayout';
import AdminLogin from '../../management/Pages/auth/AdminLogin';

// Management 模組頁面 - Dashboard
import AdminOverview from '../../management/Pages/dashboard/pages/Overview';
import SalesAnalytics from '../../management/Pages/dashboard/pages/SalesAnalytics';
import OperationsManagement from '../../management/Pages/dashboard/pages/OperationsManagement';
import FinanceReports from '../../management/Pages/dashboard/pages/FinanceReports';
import LogisticsManagement from '../../management/Pages/dashboard/pages/LogisticsManagement';
import TaskManagement from '../../management/components/workflow/TaskManagement';
import ApprovalWorkflowManagement from '../../management/components/workflow/ApprovalWorkflowManagement';
import RealTimeMonitoringDashboard from '../../management/components/dashboard/RealTimeMonitoringDashboard';

// Products 模組
import AdminProducts from '../../management/Pages/products/ProductList';
import AddProductAdvanced from '../../management/Pages/products/AddProduct';
import EditProduct from '../../management/Pages/products/EditProduct';
import Inventory from '../../management/Pages/inventory/Inventory';

// Orders 模組
import OrderList from '../../management/Pages/orders/OrderList';
import OrderDetails from '../../management/Pages/orders/OrderDetails';
import OrderForm from '../../management/Pages/orders/OrderForm';
import Orders from '../../management/Pages/orders/OrderManagement';

// Members 模組
import MemberManagement from '../../management/Pages/members/MemberManagement';
import Customers from '../../management/Pages/members/CustomerList';

// Gifts 模組 - 暫時移除，因為gifts目錄為空
// import GiftManagement from '../../management/Pages/gifts/GiftManagement';
// import GiftTierRules from '../../management/Pages/gifts/GiftTierRules';
// import MemberGiftBenefits from '../../management/Pages/gifts/MemberGiftBenefits';
// import GiftAllocationTracking from '../../management/Pages/gifts/GiftAllocationTracking';

// Suppliers 模組
import SupplierList from '../../management/Pages/suppliers/SupplierList';
import SupplierForm from '../../management/Pages/suppliers/SupplierForm';
import SupplierDetails from '../../management/Pages/suppliers/SupplierDetails';

// Procurement 模組
import ProcurementOverview from '../../management/Pages/procurement/ProcurementOverview';
import PurchaseOrderList from '../../management/Pages/procurement/PurchaseOrderList';
import PurchaseOrderDetails from '../../management/Pages/procurement/PurchaseOrderDetails';
import AddPurchaseOrder from '../../management/Pages/procurement/AddPurchaseOrder';
import ProcurementSuggestions from '../../management/Pages/procurement/ProcurementSuggestions';
import InspectionReceipt from '../../management/Pages/procurement/InspectionReceipt';
import ProcurementAnalytics from '../../management/Pages/procurement/ProcurementAnalytics';

// Logistics 模組
import LogisticsOverview from '../../management/Pages/logistics/LogisticsOverview';
import ShipmentManagement from '../../management/Pages/logistics/ShipmentManagement';
import ShippingRateConfig from '../../management/Pages/logistics/ShippingRateConfig';
import LogisticsTracking from '../../management/Pages/logistics/LogisticsTracking';
import ReturnManagement from '../../management/Pages/logistics/ReturnManagement';
import LogisticsAnalytics from '../../management/Pages/logistics/LogisticsAnalytics';
import LogisticsProviders from '../../management/Pages/logistics/LogisticsProviders';

// Coupons 模組
import CouponManagement from '../../management/Pages/coupons/CouponManagementContainer';
import SharingManager from '../../management/components/coupons/SharingManager';
import StackingRulesManager from '../../management/components/coupons/StackingRulesManager';

// Notifications 模組
import TemplateManagement from '../../management/components/notifications/TemplateManagement';
import VariableManagement from '../../management/components/notifications/VariableManagement';
import TriggerManagement from '../../management/components/notifications/TriggerManagement';
import ChannelSettings from '../../management/Pages/notifications/ChannelSettings';
import NotificationHistory from '../../management/Pages/notifications/NotificationHistory';
import AnalyticsOverview from '../../management/Pages/notifications/AnalyticsOverview';
import NotificationManagement from '../../management/Pages/notifications/NotificationManagement';

// Accounting 模組
import AccountingManagementContainer from '../../management/Pages/accounting/AccountingManagementContainer';
import AccountingOverview from '../../management/Pages/accounting/AccountingOverview';
import ChartOfAccounts from '../../management/Pages/accounting/ChartOfAccounts';
import JournalEntries from '../../management/Pages/accounting/JournalEntries';
import FinancialReports from '../../management/Pages/accounting/FinancialReports';
import BankReconciliation from '../../management/Pages/accounting/BankReconciliation';

// Analytics 模組
import AdminAnalyticsOverview from '../../management/Pages/analytics/AnalyticsOverview';
import SalesAnalyticsPage from '../../management/Pages/analytics/SalesAnalytics';
import CustomerAnalytics from '../../management/Pages/analytics/CustomerAnalytics';
import ProductAnalytics from '../../management/Pages/analytics/ProductAnalytics';
import OperationalAnalytics from '../../management/components/analytics/OperationalAnalytics';
import AIInsights from '../../management/components/analytics/AIInsights';
import Analytics from '../../management/Pages/analytics/Analytics';

// Settings 模組
import SystemSettingsOverview from '../../management/components/settings/SystemSettingsOverview';
import GeneralSettings from '../../management/Pages/settings/GeneralSettings';
import SecuritySettings from '../../management/Pages/settings/SecuritySettings';
import NotificationSettings from '../../management/Pages/settings/NotificationSettings';
import PaymentSettings from '../../management/Pages/settings/PaymentSettings';
import ShippingSettings from '../../management/Pages/settings/ShippingSettings';
import Settings from '../../management/Pages/settings/Settings';

// Documents 模組
import DocumentOverview from '../../management/Pages/documents/DocumentOverview';
import SalesDocumentManagement from '../../management/Pages/documents/SalesDocumentManagement';
import PurchaseDocumentManagement from '../../management/Pages/documents/PurchaseDocumentManagement';
import InventoryDocumentManagement from '../../management/Pages/documents/InventoryDocumentManagement';
import ApprovalWorkflowSystem from '../../management/Pages/documents/ApprovalWorkflowSystem';

// Admin 模組
import AdminManagement from '../../management/Pages/admin/AdminManagement';
import AdminRoleManagement from '../../management/Pages/admin/AdminRoleManagement';
import AdminUserManagement from '../../management/Pages/admin/AdminUserManagement';

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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
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
                      <Route path="products/edit/:id" element={<EditProduct />} />
                      <Route path="products/inventory" element={<Inventory />} />

                      {/* Orders 模組路由 */}
                      <Route path="orders" element={<OrderList />} />
                      <Route path="orders/management" element={<Orders />} />
                      <Route path="orders/details/:id" element={<OrderDetails />} />
                      <Route path="orders/new" element={<OrderForm />} />

                      {/* Members 模組路由 */}
                      <Route path="members" element={<MemberManagement />} />
                      <Route path="members/customers" element={<Customers />} />

                      {/* Gifts 模組路由 - 暫時移除，因為gifts目錄為空 */}
                      {/* <Route path="gifts" element={<GiftManagement />} />
                      <Route path="gifts/tier-rules" element={<GiftTierRules />} />
                      <Route path="gifts/member-benefits" element={<MemberGiftBenefits />} />
                      <Route path="gifts/allocation-tracking" element={<GiftAllocationTracking />} /> */}

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
                      <Route path="accounting/management" element={<AccountingManagementContainer />} />
                      <Route path="accounting/chart-of-accounts" element={<ChartOfAccounts />} />
                      <Route path="accounting/journal-entries" element={<JournalEntries />} />
                      <Route path="accounting/financial-reports" element={<FinancialReports />} />
                      <Route path="accounting/bank-reconciliation" element={<BankReconciliation />} />

                      {/* Analytics 模組路由 */}
                      <Route path="analytics" element={<AdminAnalyticsOverview />} />
                      <Route path="analytics/main" element={<Analytics />} />
                      <Route path="analytics/sales" element={<SalesAnalyticsPage />} />
                      <Route path="analytics/customers" element={<CustomerAnalytics />} />
                      <Route path="analytics/products" element={<ProductAnalytics />} />
                      <Route path="analytics/operations" element={<OperationalAnalytics />} />
                      <Route path="analytics/ai-insights" element={<AIInsights />} />

                      {/* Settings 模組路由 */}
                      <Route path="settings" element={<SystemSettingsOverview />} />
                      <Route path="settings/main" element={<Settings />} />
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

                      {/* Marketing 模組路由 - 暫時移除，因為marketing目錄為空 */}
                      {/* <Route path="marketing" element={<MarketingOverview />} />
                      <Route path="marketing/campaigns" element={<CampaignManagement />} />
                      <Route path="marketing/advertising" element={<AdvertisingManagement />} />
                      <Route path="marketing/audience" element={<AudienceManagement />} /> */}

                      {/* Festivals 模組路由 - 暫時移除，因為festivals目錄為空 */}
                      {/* <Route path="festivals" element={<FestivalOverview />} />
                      <Route path="festivals/management" element={<FestivalManagement />} />
                      <Route path="festivals/promotions" element={<PromotionSettings />} />
                      <Route path="festivals/analytics" element={<FestivalAnalytics />} /> */}

                      {/* User Tracking 模組路由 - 暫時移除，因為user-tracking目錄為空 */}
                      {/* <Route path="user-tracking" element={<UserTrackingOverview />} />
                      <Route path="user-tracking/behavior" element={<UserBehaviorAnalytics />} />
                      <Route path="user-tracking/activity" element={<RealTimeActivityMonitor />} />
                      <Route path="user-tracking/segments" element={<UserSegmentManagement />} />
                      <Route path="user-tracking/privacy" element={<PrivacySettings />} /> */}

                      {/* Inventory 模組路由 (獨立模組) */}
                      <Route path="inventory" element={<Inventory />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;