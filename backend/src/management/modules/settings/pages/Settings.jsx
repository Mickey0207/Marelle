import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';

// Import system settings components
import SystemSettingsOverview from "../../../components/settings/SystemSettingsOverview";
import GeneralSettings from '../components/GeneralSettings';
import SecuritySettings from '../components/SecuritySettings';
import NotificationSettings from '../components/NotificationSettings';
import PaymentSettings from '../components/PaymentSettings';
import ShippingSettings from '../components/ShippingSettings';

const AdminSettings = () => {
  useEffect(() => {
    gsap.fromTo(
      '.settings-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="settings-content">
      {/* 設�??�面路由 */}
      <Routes>
        <Route index element={<SystemSettingsOverview />} />
        <Route path="general" element={<GeneralSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="payments" element={<PaymentSettings />} />
        <Route path="shipping" element={<ShippingSettings />} />
      </Routes>
    </div>
  );
};

export default AdminSettings;
