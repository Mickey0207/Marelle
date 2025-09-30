import React, { useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import SearchableSelect from '../../components/ui/SearchableSelect';
import GlassModal from '../../components/ui/GlassModal';
import { SimpleColumn } from '../../components/ui/Charts';
import { EyeIcon } from '@heroicons/react/24/outline';
import IconActionButton from '../../components/ui/IconActionButton';
import { getSessions, getEvents } from '../../../lib/mocks/user-tracking/dataManager';
import { SOURCES as SOURCE_OPTIONS, DEVICES as DEVICE_OPTIONS } from '../../../data/user-tracking/mockEvents';

const SessionsPage = () => {
  const [filters, setFilters] = useState({ sources: [], devices: [] });
  const [timeline, setTimeline] = useState(null);
  const data = useMemo(() => getSessions(filters), [filters]);
  const [view, setView] = useState('table');
  const chartData = useMemo(() => {
    const map = new Map();
    for (const s of data) {
      map.set(s.source, (map.get(s.source) || 0) + 1);
    }
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [data]);

  const columns = [
    { key: 'sessionId', label: '會話', sortable: true },
    { key: 'userId', label: '用戶', sortable: true },
    { key: 'source', label: '來源', sortable: true },
    { key: 'device', label: '裝置', sortable: true },
    { key: 'startedAt', label: '開始時間', sortable: true, render: v => new Date(v).toLocaleString('zh-TW') },
    { key: 'durationSec', label: '時長(秒)', sortable: true },
    { key: 'pageCount', label: '頁數', sortable: true },
    { key: 'eventCount', label: '事件數', sortable: true },
    { key: 'actions', label: '操作', render: (_v, r) => (
      <IconActionButton Icon={EyeIcon} label="時間軸" variant="blue" onClick={() => setTimeline(r)} />
    ) }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <h1 className="text-3xl font-bold text-gray-800 font-chinese mb-6">會話</h1>

        <div className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-4 items-center">
          <SearchableSelect multiple placeholder="來源" options={SOURCE_OPTIONS.map(v=>({value:v,label:v}))} value={filters.sources} onChange={v=>setFilters(f=>({...f, sources:v}))} />
          <SearchableSelect multiple placeholder="裝置" options={DEVICE_OPTIONS.map(v=>({value:v,label:v}))} value={filters.devices} onChange={v=>setFilters(f=>({...f, devices:v}))} />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500 font-chinese">共 {data.length} 筆</div>
          <div className="space-x-2">
            <button className={`px-3 py-1 rounded text-sm ${view==='table'?'bg-[#cc824d] text-white':'border text-gray-700'}`} onClick={()=>setView('table')}>表格</button>
            <button className={`px-3 py-1 rounded text-sm ${view==='chart'?'bg-[#cc824d] text-white':'border text-gray-700'}`} onClick={()=>setView('chart')}>圖表</button>
          </div>
        </div>
        {view==='table' ? (
          <StandardTable data={data} columns={columns} title="會話列表" exportFileName="會話列表" />
        ) : (
          <div className="glass rounded-2xl p-4">
            <SimpleColumn data={chartData} xField="type" yField="value" />
          </div>
        )}

        <GlassModal isOpen={!!timeline} onClose={()=>setTimeline(null)} title="Session Timeline" size="max-w-3xl">
          {timeline && (
            <div className="space-y-2 text-sm">
              <div className="text-gray-700">Session: {timeline.sessionId} / User: {timeline.userId}</div>
              <ul className="space-y-2">
                {timeline.events.sort((a,b)=>a.ts-b.ts).map(ev => (
                  <li key={ev.id} className="p-2 rounded border bg-white">
                    <div className="text-gray-500 text-xs">{new Date(ev.ts).toLocaleString('zh-TW')}</div>
                    <div className="font-medium">{ev.type}</div>
                    <div className="text-xs text-gray-600 break-all">{ev.path || ev.sku || ev.productId || '-'}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassModal>
      </div>
    </div>
  );
};

export default SessionsPage;
