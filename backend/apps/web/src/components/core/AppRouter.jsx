import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '../auth/AuthComponents';
import { AppStateProvider } from './AppStateContext';
import ManagementLayout from '../layouts/ManagementLayout';
import AdminLogin from '../../Pages/auth/AdminLogin';

// Management 模組頁面 - Dashboard
const AdminOverview = lazy(() => import('../../Pages/dashboard/Overview'));
const SalesAnalytics = lazy(() => import('../../Pages/dashboard/SalesAnalytics'));
const OperationsManagement = lazy(() => import('../../Pages/dashboard/OperationsManagement'));
const FinanceReports = lazy(() => import('../../Pages/dashboard/FinanceReports'));
const LogisticsManagement = lazy(() => import('../../Pages/dashboard/LogisticsManagement'));
import TaskManagement from '../workflow/TaskManagement';
import ApprovalWorkflowManagement from '../workflow/ApprovalWorkflowManagement';
import RealTimeMonitoringDashboard from '../dashboard/RealTimeMonitoringDashboard';

// Products 模組
const AdminProducts = lazy(() => import('../../Pages/products/Products'));
const AddProductAdvanced = lazy(() => import('../../Pages/products/AddProductAdvanced'));
const EditProduct = lazy(() => import('../../Pages/products/EditProduct'));
import Inventory from '../../Pages/inventory/Inventory';
import WarehouseManagement from '../../Pages/inventory/WarehouseManagement';

// Orders 模組
const OrderList = lazy(() => import('../../Pages/orders/OrderList'));
const OrderDetails = lazy(() => import('../../Pages/orders/OrderDetails'));
// 移除新增訂單頁（OrderForm）

// Members 模組
const MemberManagement = lazy(() => import('../../Pages/members/MemberManagement'));

// Gifts 模組 （整合至 marketing，移除不存在頁面的匯入）

// Suppliers 模組
const SupplierList = lazy(() => import('../../Pages/procurement/SupplierList'));

// Procurement 模組
const ProcurementOverview = lazy(() => import('../../Pages/procurement/ProcurementOverview'));

// Logistics 模組
const LogisticsTracking = lazy(() => import('../../Pages/logistics/LogisticsTracking'));
// 移除 Logistics 通知頁面（不再使用）

// Coupons 模組

// Notifications 模組頁面
const NotificationCenter = lazy(() => import('../../Pages/notification-center/NotificationCenter'));
const OrdersInbox = lazy(() => import('../../Pages/notification-center/OrdersInbox'));
const ECPayPayments = lazy(() => import('../../Pages/notification-center/ECPayPayments'));
const ECPaySubscriptions = lazy(() => import('../../Pages/notification-center/ECPaySubscriptions'));
const ECPayCodes = lazy(() => import('../../Pages/notification-center/ECPayCodes'));
const ECPayCardlessInstallments = lazy(() => import('../../Pages/notification-center/ECPayCardlessInstallments'));
const NotificationHistory = lazy(() => import('../../Pages/notifications/NotificationHistory'));
const LineTextMessage = lazy(() => import('../../Pages/notifications/LineTextMessage'));
const LineFlexMessage = lazy(() => import('../../Pages/notifications/LineFlexMessage'));
const MailTextMessage = lazy(() => import('../../Pages/notifications/MailTextMessage'));
const MailHtmlMessage = lazy(() => import('../../Pages/notifications/MailHtmlMessage'));
const SmsMessage = lazy(() => import('../../Pages/notifications/SmsMessage'));
const WebNotification = lazy(() => import('../../Pages/notifications/WebNotification'));

// Accounting 模組（改為表單審批入口）
import FormApprovals from '../../Pages/fromsigning/FormApprovals';

// Analytics 模組
const AdminAnalyticsOverview = lazy(() => import('../../Pages/analytics/AnalyticsOverview'));
const SalesAnalyticsPage = lazy(() => import('../../Pages/analytics/SalesAnalytics'));
const CustomerAnalytics = lazy(() => import('../../Pages/analytics/CustomerAnalytics'));
const ProductAnalytics = lazy(() => import('../../Pages/analytics/ProductAnalytics'));
import OperationalAnalytics from '../analytics/OperationalAnalytics';
import AIInsights from '../analytics/AIInsights';

// Settings 模組
const SystemSettingsOverview = lazy(() => import('../settings/SystemSettingsOverview'));
const GeneralSettings = lazy(() => import('../../Pages/settings/GeneralSettings'));
const SecuritySettings = lazy(() => import('../../Pages/settings/SecuritySettings'));
const NotificationSettings = lazy(() => import('../../Pages/settings/NotificationSettings'));
const PaymentSettings = lazy(() => import('../../Pages/settings/PaymentSettings'));
const ShippingSettings = lazy(() => import('../../Pages/settings/ShippingSettings'));

// Admin 模組
const AdminManagement = lazy(() => import('../../Pages/admin/AdminManagement'));

// Marketing 模組 Pages
import MarketingOverviewPage from '../../Pages/marketing/MarketingMange';
const CouponManagement = lazy(() => import('../../Pages/marketing/coupons/CouponManagementContainer'));
const FestivalManagement = lazy(() => import('../../Pages/marketing/festivals/FestivalManagement'));
const GiftManagement = lazy(() => import('../../Pages/marketing/gifts/GiftManagement'));

// Festival 模組 Pages（整合進行銷管理後，舊路由將導向 marketing）

// User Tracking 模組 - 暫時移除，因為user-tracking目錄為空
const EventsPage = lazy(() => import('../../Pages/user-tracking/Events'));
const SessionsPage = lazy(() => import('../../Pages/user-tracking/Sessions'));
const SegmentsPage = lazy(() => import('../../Pages/user-tracking/Segments'));
const FunnelsPage = lazy(() => import('../../Pages/user-tracking/Funnels'));
const RetentionPage = lazy(() => import('../../Pages/user-tracking/Retention'));

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
                  <Suspense fallback={<div className="p-4">載入中...</div>}>
                    <ManagementLayout />
                  </Suspense>
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
              <Route path="orders/management" element={<OrderList />} />
              <Route path="orders/details/:id" element={<OrderDetails />} />
              {/* 新增訂單頁已移除 */}

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

              {/* Notifications 模組（對外發送）路由 */}
              <Route path="notifications" element={<NotificationHistory />} />
              <Route path="notifications/line-text" element={<LineTextMessage />} />
              <Route path="notifications/line-flex" element={<LineFlexMessage />} />
              <Route path="notifications/mail-text" element={<MailTextMessage />} />
              <Route path="notifications/mail-html" element={<MailHtmlMessage />} />
              <Route path="notifications/sms" element={<SmsMessage />} />
              <Route path="notifications/web" element={<WebNotification />} />

              {/* Notification Center（對內接收）獨立模組路由，不在側邊欄顯示 */}
              <Route path="notification-center" element={<NotificationCenter />} />
              <Route path="notification-center/orders" element={<OrdersInbox />} />
              <Route path="notification-center/ecpay/payments" element={<ECPayPayments />} />
              <Route path="notification-center/ecpay/subscriptions" element={<ECPaySubscriptions />} />
              <Route path="notification-center/ecpay/codes" element={<ECPayCodes />} />
              <Route path="notification-center/ecpay/cardless-installments" element={<ECPayCardlessInstallments />} />

              {/* Marketing 模組路由（整合入口 + 子頁） */}
              <Route path="marketing" element={<MarketingOverviewPage />}>
                <Route index element={<Navigate to="coupons" replace />} />
                <Route path="coupons" element={<CouponManagement />} />
                <Route path="festivals" element={<FestivalManagement />} />
                <Route path="gifts" element={<GiftManagement />} />
              </Route>

              {/* Festivals 模組路由（整合後導向行銷管理） */}
              <Route path="festivals/manage" element={<Navigate to="/marketing" replace />} />

              {/* 表單審批 模組路由 */}
              <Route path="fromsigning" element={<FormApprovals />} />

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

              {/* User Tracking 模組路由 */}
              <Route path="user-tracking" element={<Navigate to="/user-tracking/events" replace />} />
              <Route path="user-tracking/events" element={<EventsPage />} />
              <Route path="user-tracking/sessions" element={<SessionsPage />} />
              <Route path="user-tracking/segments" element={<SegmentsPage />} />
              <Route path="user-tracking/funnels" element={<FunnelsPage />} />
              <Route path="user-tracking/retention" element={<RetentionPage />} />
            </Route>
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;