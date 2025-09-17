import React from 'react';
import {
  UserIcon,
  ShoppingBagIcon,
  CubeIcon,
  Cog6ToothIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const VariableManagement = () => {
  const variableCategories = [
    {
      id: 'user',
      name: '用戶相關',
      icon: UserIcon,
      color: 'blue',
      variables: [
        { key: 'user.name', name: '用戶姓名', description: '用戶的真實姓名', example: '張小明' },
        { key: 'user.email', name: '電子郵件', description: '用戶的電子郵件地址', example: 'user@example.com' },
        { key: 'user.phone', name: '手機號碼', description: '用戶的手機號碼', example: '0912345678' },
        { key: 'user.birthday', name: '生日', description: '用戶的生日日期', example: '1990-01-01' },
        { key: 'user.level', name: '會員等級', description: '用戶的會員等級', example: 'VIP' },
        { key: 'user.points', name: '積分餘額', description: '用戶目前的積分數量', example: '1250' }
      ]
    },
    {
      id: 'order',
      name: '訂單相關',
      icon: ShoppingBagIcon,
      color: 'green',
      variables: [
        { key: 'order.id', name: '訂單編號', description: '訂單的唯一識別碼', example: 'ORD-20240916-001' },
        { key: 'order.total', name: '訂單總額', description: '訂單的總金額', example: 'NT$ 1,580' },
        { key: 'order.status', name: '訂單狀態', description: '訂單目前的處理狀態', example: '已出貨' },
        { key: 'order.date', name: '下單日期', description: '訂單建立的日期時間', example: '2024-09-16 14:30' },
        { key: 'order.items', name: '商品列表', description: '訂單中的商品清單', example: '商品A x2, 商品B x1' },
        { key: 'order.shipping', name: '配送方式', description: '選擇的配送方式', example: '宅配到府' }
      ]
    },
    {
      id: 'product',
      name: '商品相關',
      icon: CubeIcon,
      color: 'purple',
      variables: [
        { key: 'product.name', name: '商品名稱', description: '商品的完整名稱', example: '精緻杏仁蛋糕' },
        { key: 'product.price', name: '商品價格', description: '商品的售價', example: 'NT$ 480' },
        { key: 'product.sku', name: '商品編號', description: '商品的SKU編號', example: 'CAKE-ALM-001' },
        { key: 'product.category', name: '商品分類', description: '商品所屬分類', example: '蛋糕類' },
        { key: 'product.stock', name: '庫存數量', description: '商品目前庫存', example: '25' },
        { key: 'product.discount', name: '折扣資訊', description: '商品的折扣信息', example: '9折優惠' }
      ]
    },
    {
      id: 'system',
      name: '系統相關',
      icon: Cog6ToothIcon,
      color: 'gray',
      variables: [
        { key: 'system.site_name', name: '網站名稱', description: '網站的名稱', example: 'Marelle' },
        { key: 'system.contact_email', name: '客服信箱', description: '客服聯絡信箱', example: 'support@marelle.com' },
        { key: 'system.current_date', name: '當前日期', description: '系統當前日期', example: '2024-09-16' },
        { key: 'system.current_time', name: '當前時間', description: '系統當前時間', example: '14:30:25' },
        { key: 'system.domain', name: '網站域名', description: '網站的域名地址', example: 'www.marelle.com' },
        { key: 'system.version', name: '系統版本', description: '當前系統版本號', example: 'v2.1.0' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100' }
    };
    return colorMap[color] || colorMap.gray;
  };

  const handleCopyVariable = (variableKey) => {
    navigator.clipboard.writeText(`{{${variableKey}}}`);
    // 這裡可以添加複製成功的提示
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-chinese">變數管理</h3>
            <div className="text-sm text-gray-500 font-chinese">
              共 {variableCategories.reduce((sum, cat) => sum + cat.variables.length, 0)} 個變數
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 font-chinese mb-2 flex items-center">
              <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
              使用說明
            </h4>
            <p className="text-sm text-amber-700 font-chinese">
              在通知範本中使用 <code className="bg-amber-100 px-1 rounded">{'{{變數名稱}}'}</code> 格式來插入動態內容。
              例如：<code className="bg-amber-100 px-1 rounded">{'{{user.name}}'}</code> 會被替換為實際的用戶姓名。
            </p>
          </div>
        </div>

        {variableCategories.map(category => {
          const colors = getColorClasses(category.color);
          const IconComponent = category.icon;
          
          return (
            <div key={category.id} className="glass rounded-2xl overflow-visible">
              <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
                <div className="flex items-center">
                  <IconComponent className="w-6 h-6 mr-3 text-gray-600" />
                  <h4 className={`text-lg font-bold font-chinese ${colors.text}`}>
                    {category.name}
                  </h4>
                  <span className={`ml-auto px-3 py-1 ${colors.badge} ${colors.text} text-sm font-medium rounded-full font-chinese`}>
                    {category.variables.length} 個變數
                  </span>
                </div>
              </div>
              
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          變數名稱
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          描述
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          範例值
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {category.variables.map((variable, index) => (
                        <tr key={variable.key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-purple-600">
                                {'{{' + variable.key + '}}'}
                              </code>
                            </div>
                            <div className="text-sm font-medium text-gray-900 font-chinese mt-1">
                              {variable.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 font-chinese">
                              {variable.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-chinese">
                              {variable.example}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              className="inline-flex items-center text-blue-600 hover:text-blue-900 text-sm font-chinese"
                              onClick={() => handleCopyVariable(variable.key)}
                              title="複製變數"
                            >
                              <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                              複製
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariableManagement;