import React, { useEffect, useRef, useState, useMemo } from 'react';
import logisticsDataManager from '../../../lib/data/logistics/logisticsDataManager';
import { mapLogisticsStatusToText as mapStatusToText, getDetailedStatusMap, getFlatStatusMap } from '../../../lib/data/logistics/statusMapper';
import StandardTable from '../../components/ui/StandardTable';
import TabNavigation from '../../components/ui/TabNavigation';
import GlassModal from '../../components/ui/GlassModal';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { TruckIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ADMIN_STYLES, COMPONENT_DEFAULTS } from '../../../lib/ui/adminStyles';

// 將物流方式轉為中文（放在元件外避免初始化順序問題）
function mapTypeToChinese(type, subType) {
  const dict = {
    Home: { TCAT: '黑貓宅配', POST: '郵局宅配' },
    CVS: {
      UNIMART: '7-11 B2C', UNIMARTC2C: '7-11 C2C',
      FAMI: '全家 B2C', FAMIC2C: '全家 C2C',
      HILIFE: '萊爾富 B2C', HILIFEC2C: '萊爾富 C2C',
      OKMART: 'OK 超商 B2C', OKMARTC2C: 'OK 超商 C2C',
    },
  };
  if (dict[type] && dict[type][subType]) return dict[type][subType];
  if (type && subType) return `${type}/${subType}`;
  return type || subType || '-';
}

export default function LogisticsTracking() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  // 新搜尋介面狀態
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // value: `${type}:${subType}`
  const [statusFilter, setStatusFilter] = useState('all'); // value: 狀態中文
  const pollingIndexRef = useRef(0);
  const timerRef = useRef(null);

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const res = await logisticsDataManager.queryLogisticsOrders(params);
      if (res.success) setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初始載入：顯示全部模擬資料
    load();
    // 啟動自動輪詢
    const tick = async () => {
      const res = await logisticsDataManager.refreshFromIndex(pollingIndexRef.current);
      pollingIndexRef.current = res.nextIndex || 0;
      setRows((prev) => prev.map((r) => ({ ...r })));
      timerRef.current = setTimeout(tick, 2000);
    };
    tick();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleUpdateContinue = async (rowIndex) => {
    pollingIndexRef.current = rowIndex;
    const res = await logisticsDataManager.updateOneAndNext(rowIndex);
    pollingIndexRef.current = res.nextIndex || 0;
    setRows((prev) => prev.map((r) => ({ ...r })));
  };

  // 用於產生過濾選項
  const typeOptions = useMemo(() => {
    const set = new Map();
    rows.forEach(r => {
      const key = `${r.LogisticsType}:${r.LogisticsSubType}`;
      if (!set.has(key)) set.set(key, mapTypeToChinese(r.LogisticsType, r.LogisticsSubType));
    });
    return [{ value: 'all', label: '全部物流方式' }, ...Array.from(set.entries()).map(([value, label]) => ({ value, label }))];
  }, [rows]);

  const statusOptions = useMemo(() => {
    const all = { value: 'all', label: '全部狀態' };
    const detailed = getDetailedStatusMap();
    const flat = getFlatStatusMap();
    const set = new Set();
    if (typeFilter && typeFilter !== 'all') {
      const [t, s] = String(typeFilter).split(':');
      const T = String(t || '').toUpperCase();
      const S = String(s || '').toUpperCase();
      const subMap = detailed?.[T]?.[S] || {};
      Object.values(subMap).forEach((txt) => txt && set.add(txt));
    } else {
      Object.values(flat).forEach((txt) => txt && set.add(txt));
    }
    const list = Array.from(set);
    return [all, ...list.map((v) => ({ value: v, label: v }))];
  }, [typeFilter]);

  // 客端篩選資料
  const displayRows = useMemo(() => {
    const kw = (keyword || '').toLowerCase().trim();
    return rows.filter(r => {
      // 關鍵字比對所有欄位
      const hitKW = kw ? JSON.stringify(r).toLowerCase().includes(kw) : true;

      // 物流方式過濾
      const tpKey = `${r.LogisticsType}:${r.LogisticsSubType}`;
      const hitType = typeFilter === 'all' ? true : tpKey === typeFilter;

      // 狀態過濾（以中文狀態）
      const sText = mapStatusToText(r.LogisticsStatus || r.Status, r.LogisticsType, r.LogisticsSubType) || '';
      const hitStatus = statusFilter === 'all' ? true : sText === statusFilter;

      return hitKW && hitType && hitStatus;
    });
  }, [rows, keyword, typeFilter, statusFilter]);

  // mapTypeToChinese 已移至元件外

  const getStatusBadgeClass = (text) => {
    if (!text) return ADMIN_STYLES.statusInfo;
    const s = String(text);
    const success = ['成功', '完成', '已配達', '已取件', '領取', '撥款'];
    const warning = ['待', '處理', '配送', '運送', '轉運', '重新'];
    const error = ['失敗', '取消', '逾期', '異常', '未取', '退回'];
    if (error.some(k => s.includes(k))) return ADMIN_STYLES.statusError;
    if (success.some(k => s.includes(k))) return ADMIN_STYLES.statusSuccess;
    if (warning.some(k => s.includes(k))) return ADMIN_STYLES.statusWarning;
    return ADMIN_STYLES.statusInfo;
  };

  const getStatusBadge = (text) => (
    <span className={getStatusBadgeClass(text)}>{text || '未知狀態'}</span>
  );

  const getTypeBadgeClass = (type, subType) => {
    if (type === 'Home') return ADMIN_STYLES.statusInfo; // 宅配：藍色
    if (type === 'CVS') {
      const m = {
        UNIMART: ADMIN_STYLES.statusSuccess,
        UNIMARTC2C: ADMIN_STYLES.statusSuccess,
        FAMI: ADMIN_STYLES.statusInfo,
        FAMIC2C: ADMIN_STYLES.statusInfo,
        HILIFE: ADMIN_STYLES.statusWarning,
        HILIFEC2C: ADMIN_STYLES.statusWarning,
        OKMART: ADMIN_STYLES.statusInactive,
        OKMARTC2C: ADMIN_STYLES.statusInactive,
      };
      return m[subType] || ADMIN_STYLES.statusInfo;
    }
    return ADMIN_STYLES.statusInfo;
  };

  const columns = useMemo(() => [
    // 訂單成立時間
    { key: 'TradeDate', label: '訂單成立時間', sortable: true, render: (v) => v || '-' },
    // 更新時間
    { key: 'UpdateStatusDate', label: '更新時間', sortable: true },
    // 物流方式（中文）
    { key: 'LogisticsType', label: '物流方式', sortable: true, render: (_, item) => (
      <span className={getTypeBadgeClass(item.LogisticsType, item.LogisticsSubType)}>
        {mapTypeToChinese(item.LogisticsType, item.LogisticsSubType)}
      </span>
    )},
    // 狀態（徽章）
    { key: 'LogisticsStatus', label: '物流狀態', sortable: false, render: (v, item) => getStatusBadge(mapStatusToText(v || item.Status, item.LogisticsType, item.LogisticsSubType)) },
    // 商品金額
    { key: 'GoodsAmount', label: '商品金額', sortable: true },
    // 收件人
    { key: 'ReceiverName', label: '收件人', sortable: true },
    // 手機
    { key: 'ReceiverCellPhone', label: '手機', sortable: false },
    // 回應代碼
    { key: 'RtnCode', label: '回應代碼', sortable: true, render: (v) => {
      if (v === null || v === undefined || v === '') return '-';
      const num = Number(v);
      if (!Number.isNaN(num)) {
        const cls = num === 1 ? 'text-green-600 font-mono' : 'text-red-600 font-mono';
        return <span className={cls}>{num}</span>;
      }
      return String(v);
    } },
    // 操作
    { key: 'actions', label: '操作', sortable: false, render: (_, item, rowIndex) => (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => { setDetail(item); setActiveTab('overview'); }}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          title="檢視詳情"
          aria-label="檢視詳情"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleUpdateContinue(rowIndex)}
          className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
          title="更新此筆後繼續"
          aria-label="更新此筆後繼續"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>
    )},
  ], []);

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
  <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <TruckIcon className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">物流追蹤</h1>
          </div>
          {/* 移除 ECPay 設定按鈕 */}
        </div>

        {/* 新搜尋/篩選區域 */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* 關鍵字搜尋（全欄位） */}
            <input
              value={keyword}
              onChange={(e)=>setKeyword(e.target.value)}
              className={`${ADMIN_STYLES.input} flex-1`}
              placeholder="輸入關鍵字，搜尋所有欄位"
            />
            {/* 右側篩選器 */}
            <div className="flex items-center gap-3 md:ml-auto">
              <div className="min-w-[14rem]">
                <SearchableSelect
                  value={typeFilter}
                  onChange={(v) => setTypeFilter(v)}
                  options={typeOptions}
                  placeholder="選擇物流方式"
                  searchPlaceholder="搜尋物流方式..."
                  className="font-chinese"
                  maxDisplayOptions={9999}
                />
              </div>
              <div className="w-full md:w-[30rem]">
                <SearchableSelect
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v)}
                  options={statusOptions}
                  placeholder="選擇狀態"
                  searchPlaceholder="搜尋狀態..."
                  className="font-chinese"
                  maxDisplayOptions={9999}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 主要表格 */}
        <StandardTable
          data={displayRows}
          columns={columns}
          title={loading ? '載入中…' : '物流清單'}
          emptyMessage="沒有找到符合條件的物流資料"
          exportFileName="物流清單"
        />

        {/* 移除 從第一筆開始更新 按鈕 */}

        {detail && (
          <GlassModal
            isOpen={!!detail}
            onClose={() => setDetail(null)}
            title="物流詳情"
            size="max-w-5xl"
          >
            <div className="p-6">
              <TabNavigation
                mode="controlled"
                activeKey={activeTab}
                onTabChange={(t)=>setActiveTab(t.key || t.label)}
                tabs={[
                  { key: 'overview', label: '概要' },
                  { key: 'order', label: '訂單/交易' },
                  { key: 'logistics', label: '物流' },
                  { key: 'receiver', label: '收件/寄件' },
                  { key: 'address', label: '門市/地址' },
                  { key: 'fees', label: '費用/重量' },
                  { key: 'raw', label: '原始資料' },
                ]}
                className="mb-4"
                layout="left"
              />

              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-chinese">
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">訂單成立時間</div>
                    <div className="font-medium">{detail.TradeDate || '-'}</div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">更新時間</div>
                    <div className="font-medium">{detail.UpdateStatusDate || '-'}</div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">物流方式</div>
                    <div className={getTypeBadgeClass(detail.LogisticsType, detail.LogisticsSubType)}>
                      {mapTypeToChinese(detail.LogisticsType, detail.LogisticsSubType)}
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">物流狀態</div>
                    <div className="font-medium">{getStatusBadge(mapStatusToText(detail.LogisticsStatus || detail.Status, detail.LogisticsType, detail.LogisticsSubType))}</div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">商品金額</div>
                    <div className="font-medium">{detail.GoodsAmount}</div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">收件人</div>
                    <div className="font-medium">{detail.ReceiverName}</div>
                  </div>
                </div>
              )}

              {activeTab === 'order' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-chinese">
                  <Field label="特店編號" value={detail.MerchantID} />
                  <Field label="商店訂單" value={detail.MerchantTradeNo} />
                  <Field label="綠界交易" value={detail.TradeNo} />
                  <Field label="訂單成立時間" value={detail.TradeDate} />
                  <Field label="回應代碼" value={detail.RtnCode} />
                  <Field label="回應訊息" value={detail.RtnMsg} />
                </div>
              )}

              {activeTab === 'logistics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-chinese">
                  <Field label="綠界物流編號" value={detail.LogisticsID || detail.AllPayLogisticsID} />
                  <Field label="更新時間" value={detail.UpdateStatusDate} />
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">物流方式</div>
                    <div className={getTypeBadgeClass(detail.LogisticsType, detail.LogisticsSubType)}>
                      {mapTypeToChinese(detail.LogisticsType, detail.LogisticsSubType)}
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <div className="text-gray-500 mb-1">狀態</div>
                    {getStatusBadge(mapStatusToText(detail.LogisticsStatus || detail.Status, detail.LogisticsType, detail.LogisticsSubType))}
                  </div>
                  <Field label="寄貨/配送編號" value={detail.CVSPaymentNo || detail.ShipmentNo} />
                  <Field label="托運單號" value={detail.BookingNote} />
                </div>
              )}

              {activeTab === 'receiver' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-chinese">
                  <Field label="收件人" value={detail.ReceiverName} />
                  <Field label="Email" value={detail.ReceiverEmail} />
                  <Field label="手機" value={detail.ReceiverCellPhone} />
                  <Field label="電話" value={detail.ReceiverPhone} />
                  <Field label="寄件人" value={detail.SenderName} />
                  <Field label="寄件人手機" value={detail.SenderCellPhone} />
                  <Field label="寄件人電話" value={detail.SenderPhone} />
                </div>
              )}

              {activeTab === 'address' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-chinese">
                  <Field label="收件地址" value={detail.ReceiverAddress} />
                  <Field label="門市代碼" value={detail.CVSStoreID} />
                  <Field label="門市名稱" value={detail.CVSStoreName} />
                  <Field label="門市地址" value={detail.CVSAddress} />
                </div>
              )}

              {activeTab === 'fees' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-chinese">
                  <Field label="物流費" value={detail.HandlingCharge} />
                  <Field label="代收金額" value={detail.CollectionAmount} />
                  <Field label="代收手續費" value={detail.CollectionChargeFee} />
                  <Field label="撥款日" value={detail.CollectionAllocateDate} />
                  <Field label="撥款金額" value={detail.CollectionAllocateAmount} />
                  <Field label="商品重量(kg)" value={detail.GoodsWeight} />
                  <Field label="實際重量(kg)" value={detail.ActualWeight} />
                  <Field label="運費扣款日" value={detail.ShipChargeDate} />
                </div>
              )}

              {activeTab === 'raw' && (
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-[60vh]">
{JSON.stringify(detail, null, 2)}
                </pre>
              )}
            </div>
          </GlassModal>
        )}
      </div>
    </div>
  );
}

// 小型欄位顯示元件（沿用玻璃樣式，提升可讀性）
const Field = ({ label, value }) => (
  <div className="glass p-4 rounded-xl">
    <div className="text-gray-500 mb-1">{label}</div>
    <div className="font-medium break-words">{value ?? '-'}</div>
  </div>
);
