import React, { useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import StandardTable from '../../components/ui/StandardTable';

const SegmentsPage = () => {
  const [segments, setSegments] = useState([
    { id: 'seg1', name: '近7天活躍+有加購物車', rules: 'last7d && add_to_cart' },
  ]);
  const columns = [
    { key: 'name', label: '分群名稱', sortable: true },
    { key: 'rules', label: '規則', sortable: false },
  ];
  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <h1 className="text-3xl font-bold text-gray-800 font-chinese mb-6">分群</h1>
        <StandardTable data={segments} columns={columns} title="分群管理" exportFileName="分群清單" />
      </div>
    </div>
  );
};

export default SegmentsPage;
