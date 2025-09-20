import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: '',
    country: 'TW',
    agreeTerms: false,
    agreeMarketing: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // TODO: 實際的註冊邏輯
      console.log('註冊資料:', formData);
      
      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功後導向登入頁面
      navigate('/admin/login', { 
        state: { message: '註冊成功！請使用您的帳號登入' }
      });
    } catch (error) {
      setErrors({ general: '註冊失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          註冊帳號
        </h1>
        <p className="text-center text-gray-600 mb-8">
          加入我們開始您的購物旅程
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 姓名欄位 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓氏
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名字
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
              required
            />
          </div>

          {/* 密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
              required
            />
          </div>

          {/* 確認密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              確認密碼
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
              required
            />
          </div>

          {/* 同意條款 */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              required
            />
            <label className="text-sm text-gray-700">
              我同意
              <Link to="/terms" className="text-orange-600 hover:text-orange-700 mx-1">
                服務條款
              </Link>
              和
              <Link to="/privacy" className="text-orange-600 hover:text-orange-700 mx-1">
                隱私政策
              </Link>
            </label>
          </div>

          {/* 錯誤訊息 */}
          {errors.general && (
            <div className="text-red-600 text-sm text-center">
              {errors.general}
            </div>
          )}

          {/* 註冊按鈕 */}
          <button
            type="submit"
            disabled={loading || !formData.agreeTerms}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '註冊中...' : '立即註冊'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            已有帳號？
            <Link 
              to="/admin/login" 
              className="text-orange-600 hover:text-orange-700 font-medium ml-1"
            >
              立即登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;