import { Routes, Route } from 'react-router-dom';
import LogisticsOverview from './LogisticsOverview';
import ShipmentManagement from './ShipmentManagement';
import ShippingRateConfig from './ShippingRateConfig';
import LogisticsTracking from './LogisticsTracking';
import ReturnManagement from './ReturnManagement';
import LogisticsAnalytics from './LogisticsAnalytics';
import LogisticsProviders from './LogisticsProviders';

const LogisticsManagementContainer = () => {
  return (
    <Routes>
      <Route index element={<LogisticsOverview />} />
      <Route path="shipments" element={<ShipmentManagement />} />
      <Route path="shipping-rates" element={<ShippingRateConfig />} />
      <Route path="tracking" element={<LogisticsTracking />} />
      <Route path="returns" element={<ReturnManagement />} />
      <Route path="analytics" element={<LogisticsAnalytics />} />
      <Route path="providers" element={<LogisticsProviders />} />
    </Routes>
  );
};

export default LogisticsManagementContainer;