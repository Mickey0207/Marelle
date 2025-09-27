import React, { useMemo } from 'react';
import { ADMIN_STYLES } from '../../../../lib/ui/adminStyles';
import StandardTable from '../../../components/ui/StandardTable.jsx';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import IconActionButton from '../../../components/ui/IconActionButton.jsx';
import couponDataManager from '../../../../lib/data/marketing/coupons/couponDataManager';

const CouponManagementContainer = () => {
  // 資料來源：資料層的清單 API（表格友善）
  const coupons = useMemo(() => {
    const { data } = couponDataManager.getCouponList();
    return data || [];
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      active: '啟用中',
      expired: '已過期',
      inactive: '停用'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeText = (type) => {
    const types = {
      percentage: '百分比折扣',
      fixed_amount: '固定金額',
      free_shipping: '免運費'
    };
    return types[type] || type;
  };
  // 表格欄位
  const columns = useMemo(() => ([
    { key: 'name', label: '名稱', render: (v, row) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{row.name}</div>
        <div className="text-xs text-gray-500">{row.code}</div>
      </div>
    ) },
    { key: 'type', label: '類型', render: (v) => <span>{getTypeText(v)}</span> },
    { key: 'discount', label: '折扣', render: (_, row) => (
      <span className="text-gray-900">
        {row.type === 'percentage' ? `${row.discountValue}%` : row.type === 'free_shipping' ? '免運費' : `NT$ ${row.discountValue}`}
      </span>
    ) },
    { key: 'status', label: '狀態', render: (v) => getStatusBadge(v) },
    { key: 'usageCount', label: '使用次數' },
    { key: 'validTo', label: '有效期限' },
    { key: 'actions', label: '操作', render: () => (
      <div className="flex items-center justify-start space-x-2">
        <IconActionButton Icon={EyeIcon} label="查看" variant="blue" />
        <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" />
        <IconActionButton Icon={TrashIcon} label="刪除" variant="red" />
      </div>
    ) }
  ]), []);

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>優惠券管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>使用表格檢視所有優惠券資料</p>
        </div>

        <StandardTable
          data={coupons}
          columns={columns}
          title="優惠券清單"
          exportFileName="優惠券清單"
        />
      </div>
    </div>
  );
};

export default CouponManagementContainer;