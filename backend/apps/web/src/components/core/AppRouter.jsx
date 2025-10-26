import React, { Suspense, lazy, useMemo } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, useAuth } from '../auth/AuthComponents';
import { AppStateProvider } from './AppStateContext';
import LoadingSpinner from '../ui/LoadingSpinner';
const ManagementLayout = lazy(() => import('../layouts/ManagementLayout'));
const AdminLogin = lazy(() => import('../../Pages/auth/AdminLogin'));
const AccountSettingProfile = lazy(() => import('../../Pages/accountsetting/Profile'));
const AccountSettingOAuth = lazy(() => import('../../Pages/accountsetting/OAuth'));
const AccountSettingPermissions = lazy(() => import('../../Pages/accountsetting/Permissions'));

// Management 模組頁面 - Dashboard
const AdminOverview = lazy(() => import('../../Pages/dashboard/Overview'));
const SalesAnalytics = lazy(() => import('../../Pages/dashboard/SalesAnalytics'));
const OperationsManagement = lazy(() => import('../../Pages/dashboard/OperationsManagement'));
const FinanceReports = lazy(() => import('../../Pages/dashboard/FinanceReports'));
const LogisticsManagement = lazy(() => import('../../Pages/dashboard/LogisticsManagement'));
const TaskManagement = lazy(() => import('../workflow/TaskManagement'));
const ApprovalWorkflowManagement = lazy(() => import('../workflow/ApprovalWorkflowManagement'));
const RealTimeMonitoringDashboard = lazy(() => import('../dashboard/RealTimeMonitoringDashboard'));

// Products 模組
const AdminProducts = lazy(() => import('../../Pages/products/Products'));
const AddProductAdvanced = lazy(() => import('../../Pages/products/AddProductAdvanced'));
const EditProduct = lazy(() => import('../../Pages/products/EditProduct'));
const CategoryManagement = lazy(() => import('../../Pages/products/CategoryManagement'));
const Inventory = lazy(() => import('../../Pages/inventory/Inventory'));
const WarehouseManagement = lazy(() => import('../../Pages/inventory/WarehouseManagement'));

// Orders 模組
const OrderList = lazy(() => import('../../Pages/orders/OrderList'));
const OrderDetails = lazy(() => import('../../Pages/orders/OrderDetails'));
// 移除新增訂單頁（OrderForm）

// Members 模組
const MemberManagement = lazy(() => import('../../Pages/members/MemberManagement'));
const EditMember = lazy(() => import('../../Pages/members/EditMember'));

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
const FormApprovals = lazy(() => import('../../Pages/fromsigning/FormApprovals'));
// 新增模組頁面
const AccountingManagement = lazy(() => import('../../Pages/accounting/AccountingManagement'));
const BalanceSheet = lazy(() => import('../../Pages/accounting/BalanceSheet'));
const ChartOfAccounts = lazy(() => import('../../Pages/accounting/ChartOfAccounts'));
const ReviewsManagement = lazy(() => import('../../Pages/reviews/ReviewsManagement'));

// Analytics 模組
const AdminAnalyticsOverview = lazy(() => import('../../Pages/analytics/AnalyticsOverview'));
const SalesAnalyticsPage = lazy(() => import('../../Pages/analytics/SalesAnalytics'));
const CustomerAnalytics = lazy(() => import('../../Pages/analytics/CustomerAnalytics'));
const ProductAnalytics = lazy(() => import('../../Pages/analytics/ProductAnalytics'));
const OperationalAnalytics = lazy(() => import('../analytics/OperationalAnalytics'));
const AIInsights = lazy(() => import('../analytics/AIInsights'));

// Settings 模組
const SystemSettingsOverview = lazy(() => import('../settings/SystemSettingsOverview'));
const GeneralSettings = lazy(() => import('../../Pages/settings/GeneralSettings'));
const SecuritySettings = lazy(() => import('../../Pages/settings/SecuritySettings'));
const NotificationSettings = lazy(() => import('../../Pages/settings/NotificationSettings'));
const PaymentSettings = lazy(() => import('../../Pages/settings/PaymentSettings'));
const ShippingSettings = lazy(() => import('../../Pages/settings/ShippingSettings'));

// Admin 模組
const AdminManagement = lazy(() => import('../../Pages/admin/AdminManagement'));
const AdminRoleManagement = lazy(() => import('../../Pages/admin/AdminRoleManagement'));

// Marketing 模組 Pages
const MarketingOverviewPage = lazy(() => import('../../Pages/marketing/MarketingMange'));
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
  const RequireModule = ({ module, children }) => {
    const { currentUser } = useAuth()
    const has = currentUser && Array.isArray(currentUser.permissions) && currentUser.permissions.includes(module)
    if (!has) return <Navigate to="/accountsetting/permissions" replace />
    return children
  }

  const router = useMemo(() =>
    createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner message="頁面載入中..." /> }>
                  <ManagementLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            {/* Dashboard 模組路由 */}
            <Route index element={<Navigate to="dashboard/overview" replace />} />
            <Route path="dashboard/overview" element={<RequireModule module="dashboard"><AdminOverview /></RequireModule>} />
            <Route path="dashboard/sales-analytics" element={<SalesAnalytics />} />
            <Route path="dashboard/operations" element={<OperationsManagement />} />
            <Route path="dashboard/finance" element={<FinanceReports />} />
            <Route path="dashboard/logistics" element={<LogisticsManagement />} />
            <Route path="dashboard/tasks" element={<TaskManagement />} />
            <Route path="dashboard/approvals" element={<ApprovalWorkflowManagement />} />
            <Route path="dashboard/realtime" element={<RealTimeMonitoringDashboard />} />

            {/* Products 模組路由 */}
            <Route path="products" element={<RequireModule module="products"><AdminProducts /></RequireModule>} />
            <Route path="products/add" element={<AddProductAdvanced />} />
            <Route path="products/edit/:sku" element={<EditProduct />} />
            <Route path="products/categories" element={<CategoryManagement />} />

            {/* Orders 模組路由（依付款方式分頁籤） */}
            <Route path="orders" element={<RequireModule module="orders"><Navigate to="/orders/credit" replace /></RequireModule>} />
            <Route path="orders/credit" element={<RequireModule module="orders"><OrderList /></RequireModule>} />
            <Route path="orders/atm" element={<RequireModule module="orders"><OrderList /></RequireModule>} />
            <Route path="orders/cvscode" element={<RequireModule module="orders"><OrderList /></RequireModule>} />
            <Route path="orders/webatm" element={<RequireModule module="orders"><OrderList /></RequireModule>} />
            <Route path="orders/management" element={<Navigate to="/orders/credit" replace />} />
            <Route path="orders/details/:id" element={<OrderDetails />} />
            {/* 新增訂單頁已移除 */}

            {/* Members 模組路由 */}
            <Route path="members" element={<RequireModule module="members"><MemberManagement /></RequireModule>} />
            <Route path="members/edit/:id" element={<EditMember />} />

            {/* Gifts 模組路由（整合後導向行銷管理） */}
            <Route path="gifts" element={<Navigate to="/marketing" replace />} />

            {/* Suppliers 模組路由（集中於採購模組的子頁 /procurement/suppliers） */}
            <Route path="suppliers" element={<RequireModule module="procurement"><SupplierList /></RequireModule>} />

            {/* Procurement 模組路由 */}
            <Route path="procurement" element={<RequireModule module="procurement"><ProcurementOverview /></RequireModule>} />
            <Route path="procurement/suppliers" element={<SupplierList />} />

            {/* Logistics 模組路由 */}
            <Route path="logistics" element={<RequireModule module="logistics"><LogisticsTracking /></RequireModule>} />
            {/* 移除 logistics/notifications 與 logistics/reverse-notifications */}

            {/* Coupons 模組路由（整合後導向行銷管理） */}
            <Route path="coupons" element={<Navigate to="/marketing" replace />} />
            <Route path="coupons/sharing" element={<Navigate to="/marketing" replace />} />
            <Route path="coupons/stacking-rules" element={<Navigate to="/marketing" replace />} />

            {/* Notifications 模組（對外發送）路由 */}
            <Route path="notifications" element={<RequireModule module="notifications"><NotificationHistory /></RequireModule>} />
            <Route path="notifications/line-text" element={<LineTextMessage />} />
            <Route path="notifications/line-flex" element={<LineFlexMessage />} />
            <Route path="notifications/mail-text" element={<MailTextMessage />} />
            <Route path="notifications/mail-html" element={<MailHtmlMessage />} />
            <Route path="notifications/sms" element={<SmsMessage />} />
            <Route path="notifications/web" element={<WebNotification />} />

            {/* Notification Center（對內接收）獨立模組路由，不在側邊欄顯示 */}
            <Route path="notification-center" element={<RequireModule module="notification-center"><NotificationCenter /></RequireModule>} />
            <Route path="notification-center/orders" element={<RequireModule module="notification-center"><OrdersInbox /></RequireModule>} />
            <Route path="notification-center/ecpay/payments" element={<RequireModule module="notification-center"><ECPayPayments /></RequireModule>} />
            <Route path="notification-center/ecpay/subscriptions" element={<RequireModule module="notification-center"><ECPaySubscriptions /></RequireModule>} />
            <Route path="notification-center/ecpay/codes" element={<RequireModule module="notification-center"><ECPayCodes /></RequireModule>} />
            <Route path="notification-center/ecpay/cardless-installments" element={<RequireModule module="notification-center"><ECPayCardlessInstallments /></RequireModule>} />

            {/* Marketing 模組路由（整合入口 + 子頁） */}
            <Route path="marketing" element={<RequireModule module="marketing"><MarketingOverviewPage /></RequireModule>}>
              <Route index element={<Navigate to="coupons" replace />} />
              <Route path="coupons" element={<CouponManagement />} />
              <Route path="festivals" element={<FestivalManagement />} />
              <Route path="gifts" element={<GiftManagement />} />
            </Route>

            {/* Festivals 模組路由（整合後導向行銷管理） */}
            <Route path="festivals/manage" element={<Navigate to="/marketing" replace />} />

            {/* 表單審批 模組路由 */}
            <Route path="fromsigning" element={<RequireModule module="fromsigning"><FormApprovals /></RequireModule>} />

            {/* 新增：會計管理與評價管理 */}
            <Route path="accounting" element={<Navigate to="/accounting/journal" replace />} />
            <Route path="accounting/journal" element={<RequireModule module="accounting"><AccountingManagement /></RequireModule>} />
            <Route path="accounting/balance-sheet" element={<RequireModule module="accounting"><BalanceSheet /></RequireModule>} />
            <Route path="accounting/accounts" element={<RequireModule module="accounting"><ChartOfAccounts /></RequireModule>} />
            <Route path="reviews" element={<RequireModule module="reviews"><ReviewsManagement /></RequireModule>} />

            {/* Analytics 模組路由 */}
            <Route path="analytics" element={<RequireModule module="analytics"><AdminAnalyticsOverview /></RequireModule>} />
            <Route path="analytics/sales" element={<RequireModule module="analytics"><SalesAnalyticsPage /></RequireModule>} />
            <Route path="analytics/customers" element={<RequireModule module="analytics"><CustomerAnalytics /></RequireModule>} />
            <Route path="analytics/products" element={<RequireModule module="analytics"><ProductAnalytics /></RequireModule>} />
            <Route path="analytics/operations" element={<RequireModule module="analytics"><OperationalAnalytics /></RequireModule>} />
            <Route path="analytics/ai-insights" element={<RequireModule module="analytics"><AIInsights /></RequireModule>} />

            {/* Settings 模組路由 */}
            <Route path="settings" element={<RequireModule module="settings"><SystemSettingsOverview /></RequireModule>} />
            <Route path="settings/general" element={<RequireModule module="settings"><GeneralSettings /></RequireModule>} />
            <Route path="settings/security" element={<RequireModule module="settings"><SecuritySettings /></RequireModule>} />
            <Route path="settings/notifications" element={<RequireModule module="settings"><NotificationSettings /></RequireModule>} />
            <Route path="settings/payment" element={<RequireModule module="settings"><PaymentSettings /></RequireModule>} />
            <Route path="settings/shipping" element={<RequireModule module="settings"><ShippingSettings /></RequireModule>} />

            {/* 帳號設定：直接掛載子頁，index 轉址 */}
            <Route path="accountsetting" element={<Navigate to="/accountsetting/profile" replace />} />
            <Route path="accountsetting/profile" element={<AccountSettingProfile />} />
            <Route path="accountsetting/oauth" element={<AccountSettingOAuth />} />
            <Route path="accountsetting/permissions" element={<AccountSettingPermissions />} />

            {/* Admin 模組路由 */}
            <Route path="admin" element={<RequireModule module="admin"><AdminManagement /></RequireModule>} />
            <Route path="admin/roles" element={<RequireModule module="admin"><AdminRoleManagement /></RequireModule>} />

            {/* Inventory 模組路由 (獨立模組) */}
            <Route path="inventory" element={<RequireModule module="inventory"><Inventory /></RequireModule>} />
            <Route path="inventory/warehouses" element={<RequireModule module="inventory"><WarehouseManagement /></RequireModule>} />

            {/* User Tracking 模組路由 */}
            <Route path="user-tracking" element={<RequireModule module="user-tracking"><Navigate to="/user-tracking/events" replace /></RequireModule>} />
            <Route path="user-tracking/events" element={<RequireModule module="user-tracking"><EventsPage /></RequireModule>} />
            <Route path="user-tracking/sessions" element={<RequireModule module="user-tracking"><SessionsPage /></RequireModule>} />
            <Route path="user-tracking/segments" element={<RequireModule module="user-tracking"><SegmentsPage /></RequireModule>} />
            <Route path="user-tracking/funnels" element={<RequireModule module="user-tracking"><FunnelsPage /></RequireModule>} />
            <Route path="user-tracking/retention" element={<RequireModule module="user-tracking"><RetentionPage /></RequireModule>} />
          </Route>
        </>
      ),
      {
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        },
      }
    )
  , []);

  return (
    <AuthProvider>
      <AppStateProvider>
        <Suspense fallback={<LoadingSpinner fullPage />}> 
          <RouterProvider router={router} fallbackElement={<LoadingSpinner fullPage />} />
        </Suspense>
      </AppStateProvider>
    </AuthProvider>
  );
};

export default AppRouter;