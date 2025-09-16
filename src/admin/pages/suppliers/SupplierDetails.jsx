import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supplierDataManager, { SupplierStatus, SupplierGrade, ContactType } from '../../data/supplierDataManager';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TruckIcon,
  UserIcon,
  ChartBarIcon,
  StarIcon,
  PlusIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplierData();
  }, [id]);

  const loadSupplierData = async () => {
    try {
      setLoading(true);
      
      // 載入供應商基本資料
      const supplierData = supplierDataManager.getSupplierById(id);
      if (!supplierData) {
        navigate('/admin/suppliers');
        return;
      }
      setSupplier(supplierData);

      // 載入相關資料
      const contactsData = supplierDataManager.getSupplierContacts(id);
      setContacts(contactsData);

      const productsData = supplierDataManager.getSupplierProducts(id);
      setSupplierProducts(productsData);

      const performanceData = supplierDataManager.getSupplierPerformances(id);
      setPerformanceHistory(performanceData);

    } catch (error) {
      console.error('Error loading supplier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = () => {
    if (window.confirm('確定要刪除這個供應商嗎？此操作將同時刪除相關的聯絡人和商品關聯資料。')) {
      const result = supplierDataManager.deleteSupplier(id);
      if (result.success) {
        navigate('/admin/suppliers');
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [SupplierStatus.ACTIVE]: { label: '活躍', className: 'bg-green-100 text-green-800' },
      [SupplierStatus.INACTIVE]: { label: '停用', className: 'bg-gray-100 text-gray-800' },
      [SupplierStatus.PENDING]: { label: '待審核', className: 'bg-yellow-100 text-yellow-800' },
      [SupplierStatus.SUSPENDED]: { label: '暫停', className: 'bg-red-100 text-red-800' },
      [SupplierStatus.BLACKLISTED]: { label: '黑名單', className: 'bg-red-100 text-red-900' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getGradeBadge = (grade) => {
    const gradeConfig = {
      [SupplierGrade.A_STRATEGIC]: { label: 'A級 策略性', className: 'bg-purple-100 text-purple-800' },
      [SupplierGrade.B_PREFERRED]: { label: 'B級 優選', className: 'bg-blue-100 text-blue-800' },
      [SupplierGrade.C_QUALIFIED]: { label: 'C級 合格', className: 'bg-green-100 text-green-800' },
      [SupplierGrade.D_CONDITIONAL]: { label: 'D級 條件性', className: 'bg-yellow-100 text-yellow-800' },
      [SupplierGrade.E_UNQUALIFIED]: { label: 'E級 不合格', className: 'bg-red-100 text-red-800' }
    };

    const config = gradeConfig[grade];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
        ))}
        {hasHalfStar && <StarIconSolid className="w-5 h-5 text-yellow-400 opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="text-lg font-semibold text-gray-900 ml-2">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getContactTypeBadge = (type) => {
    const typeConfig = {
      [ContactType.PRIMARY]: { label: '主要負責人', className: 'bg-blue-100 text-blue-800' },
      [ContactType.SALES]: { label: '業務聯絡人', className: 'bg-green-100 text-green-800' },
      [ContactType.TECHNICAL]: { label: '技術聯絡人', className: 'bg-purple-100 text-purple-800' },
      [ContactType.FINANCE]: { label: '財務聯絡人', className: 'bg-yellow-100 text-yellow-800' },
      [ContactType.LOGISTICS]: { label: '物流聯絡人', className: 'bg-orange-100 text-orange-800' },
      [ContactType.QUALITY]: { label: '品管聯絡人', className: 'bg-red-100 text-red-800' }
    };

    const config = typeConfig[type];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">找不到供應商資料</h3>
        <Link to="/admin/suppliers" className="text-[#cc824d] hover:text-[#b3723f] mt-2 inline-block">
          返回供應商列表
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題和操作按鈕 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/suppliers"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              返回列表
            </Link>
            <div className="border-l border-gray-300 h-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">
              {supplier.companyName}
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to={`/admin/suppliers/${supplier.id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
              <span>編輯</span>
            </Link>
            <button
              onClick={handleDeleteSupplier}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
              <span>刪除</span>
            </button>
          </div>
        </div>
      </div>

      {/* 供應商基本資訊卡片 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-[#cc824d] to-[#b3723f] flex items-center justify-center">
                  <TruckIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 font-chinese">
                    {supplier.companyName}
                  </h2>
                  {getStatusBadge(supplier.status)}
                  {getGradeBadge(supplier.grade)}
                </div>
                {supplier.companyNameEn && (
                  <p className="text-gray-600 mb-2">{supplier.companyNameEn}</p>
                )}
                <p className="text-gray-600 mb-3">{supplier.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                    <span>統編: {supplier.taxId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>成立: {supplier.establishedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">行業: {supplier.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">規模: {supplier.scale}</span>
                  </div>
                </div>
                
                {supplier.website && (
                  <div className="mt-3">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <GlobeAltIcon className="w-4 h-4" />
                      <span>{supplier.website}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">整體評分</div>
              {renderStarRating(supplier.overallRating)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
                <div className="text-sm text-blue-800">聯絡人</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{supplierProducts.length}</div>
                <div className="text-sm text-green-800">關聯商品</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 頁籤導航 */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'overview', name: '概覽', icon: BuildingOfficeIcon },
            { id: 'contacts', name: '聯絡人', icon: UserIcon },
            { id: 'products', name: '關聯商品', icon: TruckIcon },
            { id: 'performance', name: '績效評估', icon: ChartBarIcon }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'text-[#cc824d] border-[#cc824d]'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-chinese">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 頁籤內容 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">公司名稱</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.companyName}</p>
                </div>
                {supplier.companyNameEn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">英文名稱</label>
                    <p className="mt-1 text-sm text-gray-900">{supplier.companyNameEn}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">統一編號</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.taxId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">營業執照</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.businessLicense}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">公司類型</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.companyType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">成立日期</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.establishedDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">行業別</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.industry}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">公司規模</label>
                  <p className="mt-1 text-sm text-gray-900">{supplier.scale}</p>
                </div>
              </div>
            </div>
            
            {supplier.description && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">公司描述</label>
                <p className="mt-1 text-sm text-gray-900">{supplier.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">聯絡人管理</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
                <PlusIcon className="w-5 h-5" />
                <span>新增聯絡人</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{contact.name}</h4>
                        {getContactTypeBadge(contact.contactType)}
                        {contact.isPrimary && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            主要聯絡人
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">職稱:</span>
                          <span>{contact.title}</span>
                        </div>
                        {contact.department && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">部門:</span>
                            <span>{contact.department}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <span>{contact.phone}</span>
                        </div>
                        {contact.mobile && (
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            <span>{contact.mobile}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <span>{contact.email}</span>
                        </div>
                      </div>
                      
                      {contact.notes && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">備註: </span>
                          <span className="text-sm">{contact.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="text-center py-8">
                  <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">沒有聯絡人資料</h3>
                  <p className="mt-1 text-sm text-gray-500">開始新增聯絡人資訊</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">關聯商品</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
                <PlusIcon className="w-5 h-5" />
                <span>新增關聯</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      商品資訊
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      供貨價格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最小訂購量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      交期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      庫存狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supplierProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.supplierProductName}
                          </div>
                          <div className="text-sm text-gray-500">
                            代碼: {product.supplierProductCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.supplierPrice.toLocaleString()} {product.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.minOrderQuantity.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.leadTimeDays} 天
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.availability === 'in_stock' ? 'bg-green-100 text-green-800' :
                          product.availability === 'limited_stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.availability === 'in_stock' ? '有庫存' :
                           product.availability === 'limited_stock' ? '庫存不足' : '缺貨'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {supplierProducts.length === 0 && (
              <div className="text-center py-8">
                <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">沒有關聯商品</h3>
                <p className="mt-1 text-sm text-gray-500">開始新增商品關聯</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">績效評估歷史</h3>
            
            {supplier.latestPerformance && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">最新評估結果</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {supplier.latestPerformance.overallRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">總體評分</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {supplier.latestPerformance.onTimeDeliveryRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">準時交貨率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {supplier.latestPerformance.qualityPassRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">品質合格率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {supplier.latestPerformance.averageLeadTime.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">平均交期(天)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {supplier.latestPerformance.defectRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">不良品率</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {performanceHistory.map((performance) => (
                <div key={performance.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-md font-medium text-gray-900">
                        {performance.evaluationType === 'quarterly' ? '季度評估' : '年度評估'}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {performance.evaluationPeriod.start} ~ {performance.evaluationPeriod.end}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      performance.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {performance.status === 'completed' ? '已完成' : '進行中'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">總體評分:</span>
                      <span className="ml-2 font-medium">{performance.overallRating.toFixed(1)}/5.0</span>
                    </div>
                    <div>
                      <span className="text-gray-500">品質評分:</span>
                      <span className="ml-2 font-medium">{performance.qualityScore.toFixed(1)}/5.0</span>
                    </div>
                    <div>
                      <span className="text-gray-500">交期評分:</span>
                      <span className="ml-2 font-medium">{performance.deliveryScore.toFixed(1)}/5.0</span>
                    </div>
                    <div>
                      <span className="text-gray-500">服務評分:</span>
                      <span className="ml-2 font-medium">{performance.serviceScore.toFixed(1)}/5.0</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {performanceHistory.length === 0 && (
                <div className="text-center py-8">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">沒有績效評估記錄</h3>
                  <p className="mt-1 text-sm text-gray-500">開始建立績效評估</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDetails;