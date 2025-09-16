import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supplierDataManager, { SupplierStatus, SupplierGrade, CompanyType } from '../../data/supplierDataManager';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const SupplierForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyName: '',
    companyNameEn: '',
    taxId: '',
    businessLicense: '',
    establishedDate: '',
    companyType: CompanyType.LIMITED,
    industry: '',
    scale: 'small',
    website: '',
    description: '',
    status: SupplierStatus.PENDING,
    grade: SupplierGrade.E_UNQUALIFIED
  });

  useEffect(() => {
    if (isEdit && id) {
      loadSupplierData();
    }
  }, [isEdit, id]);

  const loadSupplierData = () => {
    const supplier = supplierDataManager.getSupplierById(id);
    if (supplier) {
      setFormData({
        companyName: supplier.companyName || '',
        companyNameEn: supplier.companyNameEn || '',
        taxId: supplier.taxId || '',
        businessLicense: supplier.businessLicense || '',
        establishedDate: supplier.establishedDate || '',
        companyType: supplier.companyType || CompanyType.LIMITED,
        industry: supplier.industry || '',
        scale: supplier.scale || 'small',
        website: supplier.website || '',
        description: supplier.description || '',
        status: supplier.status || SupplierStatus.PENDING,
        grade: supplier.grade || SupplierGrade.E_UNQUALIFIED
      });
    } else {
      navigate('/admin/suppliers');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除該欄位的錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 必填欄位驗證
    if (!formData.companyName.trim()) {
      newErrors.companyName = '公司名稱為必填項目';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = '統一編號為必填項目';
    } else if (!/^\d{8}$/.test(formData.taxId)) {
      newErrors.taxId = '統一編號必須為8位數字';
    }

    if (!formData.businessLicense.trim()) {
      newErrors.businessLicense = '營業執照號碼為必填項目';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = '行業別為必填項目';
    }

    // 網址格式驗證
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = '請輸入有效的網址格式（需包含 http:// 或 https://）';
    }

    // 日期格式驗證
    if (formData.establishedDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.establishedDate)) {
      newErrors.establishedDate = '請輸入有效的日期格式（YYYY-MM-DD）';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      let result;
      
      if (isEdit) {
        result = supplierDataManager.updateSupplier(id, formData);
      } else {
        result = supplierDataManager.createSupplier(formData);
      }

      if (result.success) {
        navigate(`/admin/suppliers/${result.supplier.id}`);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      setErrors({ submit: '保存失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      navigate(`/admin/suppliers/${id}`);
    } else {
      navigate('/admin/suppliers');
    }
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to={isEdit ? `/admin/suppliers/${id}` : '/admin/suppliers'}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            {isEdit ? '返回詳情' : '返回列表'}
          </Link>
          <div className="border-l border-gray-300 h-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 font-chinese">
            {isEdit ? '編輯供應商' : '新增供應商'}
          </h1>
        </div>
      </div>

      {/* 表單 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 錯誤訊息 */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XMarkIcon className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* 基本資訊 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              基本資訊
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  公司名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="請輸入公司中文名稱"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyNameEn" className="block text-sm font-medium text-gray-700 mb-2">
                  英文名稱
                </label>
                <input
                  type="text"
                  id="companyNameEn"
                  name="companyNameEn"
                  value={formData.companyNameEn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="請輸入公司英文名稱"
                />
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
                  統一編號 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                    errors.taxId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="請輸入8位數統一編號"
                  maxLength="8"
                />
                {errors.taxId && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>
                )}
              </div>

              <div>
                <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-2">
                  營業執照號碼 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessLicense"
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                    errors.businessLicense ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="請輸入營業執照號碼"
                />
                {errors.businessLicense && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessLicense}</p>
                )}
              </div>

              <div>
                <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700 mb-2">
                  成立日期
                </label>
                <input
                  type="date"
                  id="establishedDate"
                  name="establishedDate"
                  value={formData.establishedDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                    errors.establishedDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.establishedDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.establishedDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                  公司類型
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value={CompanyType.LIMITED}>有限公司</option>
                  <option value={CompanyType.CORPORATION}>股份有限公司</option>
                  <option value={CompanyType.PARTNERSHIP}>合夥企業</option>
                  <option value={CompanyType.SOLE_PROPRIETORSHIP}>獨資企業</option>
                  <option value={CompanyType.FOREIGN}>外商企業</option>
                </select>
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  行業別 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                    errors.industry ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="例如：化妝品批發、包裝材料等"
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              <div>
                <label htmlFor="scale" className="block text-sm font-medium text-gray-700 mb-2">
                  公司規模
                </label>
                <select
                  id="scale"
                  name="scale"
                  value={formData.scale}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="startup">新創企業</option>
                  <option value="small">小型企業</option>
                  <option value="medium">中型企業</option>
                  <option value="large">大型企業</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  公司網站
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                    errors.website ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://www.example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  公司描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  placeholder="請描述公司的主要業務、產品或服務特色"
                />
              </div>
            </div>
          </div>

          {/* 狀態設定 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">狀態設定</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  供應商狀態
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value={SupplierStatus.PENDING}>待審核</option>
                  <option value={SupplierStatus.ACTIVE}>活躍</option>
                  <option value={SupplierStatus.INACTIVE}>停用</option>
                  <option value={SupplierStatus.SUSPENDED}>暫停合作</option>
                  <option value={SupplierStatus.BLACKLISTED}>黑名單</option>
                </select>
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  供應商分級
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value={SupplierGrade.E_UNQUALIFIED}>E級 - 不合格</option>
                  <option value={SupplierGrade.D_CONDITIONAL}>D級 - 條件性</option>
                  <option value={SupplierGrade.C_QUALIFIED}>C級 - 合格</option>
                  <option value={SupplierGrade.B_PREFERRED}>B級 - 優選</option>
                  <option value={SupplierGrade.A_STRATEGIC}>A級 - 策略性</option>
                </select>
              </div>
            </div>
          </div>

          {/* 表單按鈕 */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>取消</span>
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CheckIcon className="w-5 h-5" />
              <span>{loading ? '保存中...' : (isEdit ? '更新' : '建立')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;