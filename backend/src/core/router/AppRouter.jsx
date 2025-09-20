import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '../auth/AuthContext';
import { AppStateProvider } from '../../shared/contexts/AppStateContext';
import AdminLayout from '../layout/AdminLayout';
import AdminLogin from '../auth/AdminLogin';

// 業務模組頁面
import Dashboard from '../../business/dashboard/pages/Dashboard';
import ProductList from '../../business/products/pages/ProductList';
import ProductDetail from '../../business/products/pages/ProductDetail';
import OrderList from '../../business/orders/pages/OrderList';
import OrderDetail from '../../business/orders/pages/OrderDetail';
import CustomerList from '../../business/customers/pages/CustomerList';
import CustomerDetail from '../../business/customers/pages/CustomerDetail';
import InventoryOverview from '../../business/inventory/pages/InventoryOverview';
import MarketingOverview from '../../business/marketing/pages/MarketingOverview';

// 系統模組頁面
import UserManagement from '../../system/users/pages/UserManagement';
import SystemSettings from '../../system/settings/pages/SystemSettings';
import AnalyticsOverview from '../../system/analytics/pages/AnalyticsOverview';

const AppRouter = () => {
  return (
    <Router>
      <AppStateProvider>
        <AuthProvider>
          <Routes>
            {/* 登入頁面 */}
            <Route path="/login" element={<AdminLogin />} />
            
            {/* 保護的管理後台路由 */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* 儀表板 */}
              <Route index element={<Dashboard />} />
              
              {/* 商品管理 */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetail />} />
              
              {/* 訂單管理 */}
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              
              {/* 客戶管理 */}
              <Route path="customers" element={<CustomerList />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              
              {/* 庫存管理 */}
              <Route path="inventory" element={<InventoryOverview />} />
              
              {/* 行銷管理 */}
              <Route path="marketing" element={<MarketingOverview />} />
              
              {/* 用戶管理 */}
              <Route path="users" element={<UserManagement />} />
              
              {/* 系統設定 */}
              <Route path="settings" element={<SystemSettings />} />
              
              {/* 數據分析 */}
              <Route path="analytics" element={<AnalyticsOverview />} />
              
              {/* 404 頁面 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </AppStateProvider>
    </Router>
  );
};

export default AppRouter;