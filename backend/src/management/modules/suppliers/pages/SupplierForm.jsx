import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import { 
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const SupplierForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyNameEn: '',
    taxId: '',
    businessLicense: '',
    establishedDate: '',
    companyType: 'limited',
    industry: '',
    scale: 'small',
    
    // 聯絡資訊
    contactPerson: '',
    contactTitle: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    
    // 地址資訊
    country: 'TW',
    city: '',
    district: '',
    address: '',
    postalCode: '',
    
    // 銀行資訊
    bankName: '',
    bankBranch: '',
    accountName: '',
    accountNumber: '',
    swiftCode: '',
    
    // 業務資訊
    paymentTerms: '30',
    creditLimit: '',
    currency: 'TWD',
    discountRate: '',
    minimumOrder: '',
    leadTime: '',
    
    // 產品類別
    productCategories: [],
    primaryCategory: '',
    
    // 證書與資質
    certifications: [],
    qualityStandards: [],
    
    // 其他資訊
    description: '',
    notes: '',
    status: 'active',
    priority: 'normal'
  });

  const companyTypes = [
    { value: 'limited', label: '有限公司' },
    { value: 'corporation', label: '股份有限公司' },
    { value: 'partnership', label: '合夥企業' },
    { value: 'sole', label: '獨資企業' },
    { value: 'branch', label: '分公司' },
    { value: 'representative', label: '代表處' }
  ];

  const scales = [
    { value: 'micro', label: '微型企業 (<10人)' },
    { value: 'small', label: '小型企業 (10-49人)' },
    { value: 'medium', label: '中型企業 (50-249人)' },
    { value: 'large', label: '大型企業 (>250人)' }
  ];

  const industries = [
    { value: 'manufacturing', label: '製造業' },
    { value: 'wholesale', label: '批發業' },
    { value: 'retail', label: '零售業' },
    { value: 'technology', label: '科技業' },
    { value: 'agriculture', label: '農業' },
    { value: 'textiles', label: '紡織業' },
    { value: 'food', label: '食品業' },
    { value: 'chemicals', label: '化工業' },
    { value: 'electronics', label: '電子業' },
    { value: 'automotive', label: '汽車業' },
    { value: 'other', label: '其他' }
  ];

  const paymentTermsOptions = [
    { value: '0', label: '現金付款' },
    { value: '7', label: '7天' },
    { value: '15', label: '15天' },
    { value: '30', label: '30天' },
    { value: '45', label: '45天' },
    { value: '60', label: '60天' },
    { value: '90', label: '90天' }
  ];

  const currencies = [
    { value: 'TWD', label: '新台幣 (TWD)' },
    { value: 'USD', label: '美元 (USD)' },
    { value: 'EUR', label: '歐元 (EUR)' },
    { value: 'JPY', label: '日圓 (JPY)' },
    { value: 'CNY', label: '人民幣 (CNY)' },
    { value: 'HKD', label: '港幣 (HKD)' }
  ];

  useEffect(() => {
    if (isEdit && id) {
      loadSupplierData(id);
    }
  }, [id, isEdit]);

  const loadSupplierData = async (supplierId) => {
    setLoading(true);
    try {
      // 模擬載入供應商數據
      const mockData = {
        companyName: '優質材料股份有限公司',
        companyNameEn: 'Quality Materials Co., Ltd.',
        taxId: '12345678',
        businessLicense: 'BL20240001',
        establishedDate: '2020-01-15',
        companyType: 'limited',
        industry: 'manufacturing',
        scale: 'medium',
        contactPerson: '李經理',
        contactTitle: '業務經理',
        phone: '02-12345678',
        mobile: '0912345678',
        email: 'manager@quality-materials.com',
        website: 'https://www.quality-materials.com',
        country: 'TW',
        city: '台北市',
        district: '大安區',
        address: '復興南路一段123號',
        postalCode: '10691',
        bankName: '台灣銀行',
        bankBranch: '台北分行',
        accountName: '優質材料股份有限公司',
        accountNumber: '123456789012',
        swiftCode: 'BKTWTWTP',
        paymentTerms: '30',
        creditLimit: '5000000',
        currency: 'TWD',
        discountRate: '5',
        minimumOrder: '100000',
        leadTime: '14',
        description: '專業生產高品質原材料的知名供應商',
        status: 'active',
        priority: 'high'
      };
      
      setFormData(mockData);
    } catch (error) {
      console.error('Error loading supplier data:', error);
      toast.error('載入供應商資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 必填欄位驗證
    if (!formData.companyName.trim()) {
      newErrors.companyName = '公司名稱為必填項目';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = '統編為必填項目';
    } else if (!/^\d{8}$/.test(formData.taxId)) {
      newErrors.taxId = '統編必須為8位數字';
    }

    if (!formData.businessLicense.trim()) {
      newErrors.businessLicense = '營業執照號碼為必填項目';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = '聯絡人為必填項目';
    }

    if (!formData.phone.trim() && !formData.mobile.trim()) {
      newErrors.phone = '至少需要填寫一個聯絡電話';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件地址';
    }

    if (!formData.address.trim()) {
      newErrors.address = '地址為必填項目';
    }

    if (formData.creditLimit && isNaN(Number(formData.creditLimit))) {
      newErrors.creditLimit = '信用額度必須為數字';
    }

    if (formData.minimumOrder && isNaN(Number(formData.minimumOrder))) {
      newErrors.minimumOrder = '最小訂購量必須為數字';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('請修正表單錯誤後再提交');
      return;
    }

    setLoading(true);
    try {
      // 模擬提交API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEdit) {
        toast.success('供應商資料更新成功');
      } else {
        toast.success('新增供應商成功');
      }
      
      navigate('/admin/suppliers');
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast.error(isEdit ? '更新供應商失敗' : '新增供應商失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除對應欄位的錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">
          {isEdit ? '編輯供應商' : '新增供應商'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? '修改現有供應商的詳細資訊' : '建立新的供應商檔案'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本資訊 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BuildingOfficeIcon className="w-6 h-6 text-[#cc824d]" />
            <h2 className="text-xl font-bold text-gray-900 font-chinese">基本資訊</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="請輸入公司名稱"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                統一編號 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.taxId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12345678"
                maxLength={8}
              />
              {errors.taxId && (
                <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                英文名稱
              </label>
              <input
                type="text"
                value={formData.companyNameEn}
                onChange={(e) => handleInputChange('companyNameEn', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="Company Name in English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                營業執照號碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.businessLicense}
                onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.businessLicense ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="BL20240001"
              />
              {errors.businessLicense && (
                <p className="text-red-500 text-sm mt-1">{errors.businessLicense}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                成立日期
              </label>
              <input
                type="date"
                value={formData.establishedDate}
                onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>

            <div>
              <SearchableSelect
                placeholder="公司類型"
                value={formData.companyType}
                onChange={(value) => handleInputChange('companyType', value)}
                options={companyTypes.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
                size="sm"
              />
            </div>

            <div>
              <SearchableSelect
                placeholder="行業類別"
                value={formData.industry}
                onChange={(value) => handleInputChange('industry', value)}
                options={[
                  { value: '', label: '請選擇行業類別' },
                  ...industries.map(industry => ({
                    value: industry.value,
                    label: industry.label,
                    icon: '🏢'
                  }))
                ]}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                企業規模
              </label>
              <select
                value={formData.scale}
                onChange={(e) => handleInputChange('scale', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                {scales.map(scale => (
                  <option key={scale.value} value={scale.value}>{scale.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <UserIcon className="w-6 h-6 text-[#cc824d]" />
            <h2 className="text-xl font-bold text-gray-900 font-chinese">聯絡資訊</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="聯絡人姓名"
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                職稱
              </label>
              <input
                type="text"
                value={formData.contactTitle}
                onChange={(e) => handleInputChange('contactTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="業務經理"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司電話
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="02-12345678"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手機號碼
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="0912345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電子郵件
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="supplier@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                官方網站
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* 地址資訊 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MapPinIcon className="w-6 h-6 text-[#cc824d]" />
            <h2 className="text-xl font-bold text-gray-900 font-chinese">地址資訊</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                國家/地區
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="TW">台灣</option>
                <option value="CN">中國大陸</option>
                <option value="HK">香港</option>
                <option value="SG">新加坡</option>
                <option value="JP">日本</option>
                <option value="KR">韓國</option>
                <option value="US">美國</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="台北市"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                區域
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="大安區"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                郵遞區號
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="10691"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="復興南路一段123號"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* 銀行資訊 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCardIcon className="w-6 h-6 text-[#cc824d]" />
            <h2 className="text-xl font-bold text-gray-900 font-chinese">銀行資訊</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                銀行名稱
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="台灣銀行"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分行名稱
              </label>
              <input
                type="text"
                value={formData.bankBranch}
                onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="台北分行"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                戶名
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="公司名稱"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                銀行帳號
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="123456789012"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SWIFT代碼
              </label>
              <input
                type="text"
                value={formData.swiftCode}
                onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="BKTWTWTP"
              />
            </div>
          </div>
        </div>

        {/* 業務資訊 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BanknotesIcon className="w-6 h-6 text-[#cc824d]" />
            <h2 className="text-xl font-bold text-gray-900 font-chinese">業務資訊</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                付款條件
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                {paymentTermsOptions.map(term => (
                  <option key={term.value} value={term.value}>{term.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                幣別
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>{currency.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                信用額度
              </label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.creditLimit ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5000000"
              />
              {errors.creditLimit && (
                <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                折扣率 (%)
              </label>
              <input
                type="number"
                value={formData.discountRate}
                onChange={(e) => handleInputChange('discountRate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="5"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小訂購量
              </label>
              <input
                type="number"
                value={formData.minimumOrder}
                onChange={(e) => handleInputChange('minimumOrder', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  errors.minimumOrder ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100000"
              />
              {errors.minimumOrder && (
                <p className="text-red-500 text-sm mt-1">{errors.minimumOrder}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                交期 (天)
              </label>
              <input
                type="number"
                value={formData.leadTime}
                onChange={(e) => handleInputChange('leadTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="14"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                狀態
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="active">啟用</option>
                <option value="inactive">停用</option>
                <option value="pending">待審核</option>
                <option value="suspended">暫停</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先級
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="low">低</option>
                <option value="normal">普通</option>
                <option value="high">高</option>
                <option value="critical">緊急</option>
              </select>
            </div>
          </div>
        </div>

        {/* 其他資訊 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DocumentTextIcon className="w-6 h-6 text-[#cc824d]" />
            <h2 className="text-xl font-bold text-gray-900 font-chinese">其他資訊</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司簡介
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent resize-none"
                placeholder="請描述公司的主要業務、優勢特色等..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備註
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent resize-none"
                placeholder="其他需要記錄的資訊..."
              />
            </div>
          </div>
        </div>

        {/* 表單按鈕 */}
        <div className="flex justify-end space-x-4 pb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/suppliers')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isEdit ? '更新供應商' : '新增供應商'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
