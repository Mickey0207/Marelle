import React, { useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import SearchableSelect from '../../components/ui/SearchableSelect';
import GlassModal from '../../components/ui/GlassModal';
import { getEvents, EVENT_LABELS } from '../../../lib/data/user-tracking/dataManager';
import { EyeIcon } from '@heroicons/react/24/outline';
import IconActionButton from '../../components/ui/IconActionButton';
import { SimpleColumn } from '../../components/ui/Charts';
import { EVENT_TYPES, SOURCES as SOURCE_OPTIONS, DEVICES as DEVICE_OPTIONS } from '../../../data/user-tracking/mockEvents';

const EventsPage = () => {
  const [filters, setFilters] = useState({ types: [], sources: [], devices: [] });
  const [detail, setDetail] = useState(null);
  const data = useMemo(() => getEvents(filters), [filters]);
  const [view, setView] = useState('table'); // table | chart
  const chartData = useMemo(() => {
    const map = new Map();
    for (const e of data) {
      const key = EVENT_LABELS[e.type] || e.type;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [data]);

  const columns = [
    { key: 'ts', label: '時間', sortable: true, render: v => new Date(v).toLocaleString('zh-TW') },
    { key: 'type', label: '事件', sortable: true, render: v => EVENT_LABELS[v] || v },
    { key: 'userId', label: '用戶', sortable: true },
    { key: 'sessionId', label: '會話', sortable: true },
    { key: 'source', label: '來源', sortable: true },
    { key: 'device', label: '裝置', sortable: true },
    { key: 'path', label: '路徑/商品', sortable: true, render: (_v, r) => r.path || r.productId || '-' },
    { key: 'value', label: '金額', sortable: true, render: v => v != null ? `NT$${Number(v).toLocaleString()}` : '-' },
    { key: 'actions', label: '操作', render: (_v, r) => (
      <IconActionButton Icon={EyeIcon} label="詳情" variant="blue" onClick={() => setDetail(r)} />
    ) }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <h1 className="text-3xl font-bold text-gray-800 font-chinese mb-6">事件流</h1>

        <div className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-4 items-center">
          <SearchableSelect multiple placeholder="事件類型" options={EVENT_TYPES.map(v=>({value:v,label:EVENT_LABELS[v]||v}))} value={filters.types} onChange={v=>setFilters(f=>({...f, types:v}))} />
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
          <StandardTable data={data} columns={columns} title="事件列表" exportFileName="事件列表" />
        ) : (
          <div className="glass rounded-2xl p-4">
            <SimpleColumn data={chartData} xField="type" yField="value" />
          </div>
        )}

        <GlassModal isOpen={!!detail} onClose={()=>setDetail(null)} title="事件詳情" size="max-w-3xl">
          <pre className="text-xs whitespace-pre-wrap break-all">{detail ? JSON.stringify(detail, null, 2) : ''}</pre>
        </GlassModal>
      </div>
    </div>
  );
};

export default EventsPage;
