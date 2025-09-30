import React, { useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import { getFunnel } from '../../../../external_mock/user-tracking/dataManager';

const FunnelsPage = () => {
  const [steps, setSteps] = useState(['product_view','add_to_cart','checkout_start','purchase']);
  const data = useMemo(() => getFunnel(steps, {}), [steps]);
  const columns = [
    { key: 'step', label: '步驟', sortable: false },
    { key: 'count', label: '達成人數(會話)', sortable: true },
    { key: 'rate', label: '轉換率', sortable: true, render: v => (v*100).toFixed(1) + '%' },
  ];
  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <h1 className="text-3xl font-bold text-gray-800 font-chinese mb-6">漏斗</h1>
        <StandardTable data={data} columns={columns} title="漏斗分析" exportFileName="漏斗分析" />
      </div>
    </div>
  );
};

export default FunnelsPage;
