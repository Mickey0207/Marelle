import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const AdminAnalytics = () => {
  useEffect(() => {
    gsap.fromTo(
      '.analytics-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="analytics-content space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">數據分析</h1>
        <p className="text-gray-600 mt-2 font-chinese">查看銷售數據和業績分析</p>
      </div>

      <div className="glass p-8 rounded-2xl text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 font-chinese">
          數據分析功能開發中
        </h2>
        <p className="text-gray-600 font-chinese">
          此功能正在開發中，敬請期待...
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;