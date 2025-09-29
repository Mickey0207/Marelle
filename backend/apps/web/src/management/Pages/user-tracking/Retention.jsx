import React, { useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../../adminStyles';
import { getRetentionByWeek } from '../../../lib/mocks/user-tracking/dataManager';
import { SimpleLine } from '../../components/ui/Charts';

const Cell = ({ rate }) => (
  <div className={`w-12 h-8 flex items-center justify-center text-xs rounded ${
    rate >= 0.4 ? 'bg-green-500 text-white' : rate >= 0.2 ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-700'
  }`}>{Math.round(rate*100)}%</div>
);

const RetentionPage = () => {
  const matrix = useMemo(() => getRetentionByWeek({}), []);
  const [view, setView] = useState('table');
  const chartData = useMemo(() => {
    // 展平成 { cohort: 'W1234', week: 0, rate }，並在 SimpleLine 以 cohort 分組時可繪多線（暫簡化單線）
    const out = [];
    for (const row of matrix) {
      row.cells.forEach(c => {
        out.push({ cohort: String(row.cohortWeek), week: c.weekOffset, value: Math.round(c.rate*100) });
      });
    }
    return out;
  }, [matrix]);
  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <h1 className="text-3xl font-bold text-gray-800 font-chinese mb-6">留存</h1>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500 font-chinese">共 {matrix.length} 組 Cohort</div>
          <div className="space-x-2">
            <button className={`px-3 py-1 rounded text-sm ${view==='table'?'bg-[#cc824d] text-white':'border text-gray-700'}`} onClick={()=>setView('table')}>表格</button>
            <button className={`px-3 py-1 rounded text-sm ${view==='chart'?'bg-[#cc824d] text-white':'border text-gray-700'}`} onClick={()=>setView('chart')}>圖表</button>
          </div>
        </div>
        {view==='table' ? (
          <div className="glass rounded-2xl p-4 overflow-x-auto">
            <div className="min-w-max">
              {matrix.map(row => (
                <div key={row.cohortWeek} className="flex items-center gap-2 mb-2">
                  <div className="w-28 text-sm text-gray-600">Cohort {row.cohortWeek}（{row.base}人）</div>
                  <div className="flex gap-2">
                    {row.cells.map(c => <Cell key={c.weekOffset} rate={c.rate} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-4">
            <SimpleLine data={chartData} xField="week" yField="value" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RetentionPage;
