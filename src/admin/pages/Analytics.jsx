import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

// Import analytics components
import AnalyticsOverview from '../components/AnalyticsOverview';
import SalesAnalytics from '../components/SalesAnalytics';
import CustomerAnalytics from '../components/CustomerAnalytics';
import ProductAnalytics from '../components/ProductAnalytics';
import OperationalAnalytics from '../components/OperationalAnalytics';
import AIInsights from '../components/AIInsights';

const AdminAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      '.analytics-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div className="analytics-content">
      {/* 分析內容 */}
      <div className="analytics-content">
        <Routes>
          <Route path="/" element={<AnalyticsOverview />} />
          <Route path="/sales" element={<SalesAnalytics />} />
          <Route path="/customers" element={<CustomerAnalytics />} />
          <Route path="/products" element={<ProductAnalytics />} />
          <Route path="/operations" element={<OperationalAnalytics />} />
          <Route path="/ai-insights" element={<AIInsights />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminAnalytics;