import React, { useState, useEffect } from 'react';
import SearchableSelect from '../../components/ui/SearchableSelect';
import StandardTable from '../../components/ui/StandardTable';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import { procurementDataManager } from '../../../lib/data/procurement/procurementDataManager.js';
import supplierDataManager from '../../../lib/data/procurement/supplierDataManager.js';
import GlassModal from '../../components/ui/GlassModal';
import { DocumentTextIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProcurementOverview = () => {
  const [procurementOrders, setProcurementOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    searchQuery: ''
  });
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', priority: '', expectedDeliveryDate: '', notes: '' });
  const [createForm, setCreateForm] = useState({ supplierId: '', supplierName: '', type: 'standard', priority: 'normal', totalAmount: '', taxRate: 0.05, expectedDeliveryDate: '', notes: '' });
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProcurementData();
  }, [filters]);

  useEffect(() => {
    // 載入供應商選項
    try {
      const suppliers = supplierDataManager.getAllSuppliers ? supplierDataManager.getAllSuppliers() : [];
      const options = (suppliers || []).map(s => ({ value: s.id, label: s.companyName }));
      setSupplierOptions(options);
    } catch (e) {
      console.warn('載入供應商失敗或未提供供應商管理器', e);
      setSupplierOptions([]);
    }
  }, []);

  const loadProcurementData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.searchQuery) params.search = filters.searchQuery;
      const orders = procurementDataManager.getPurchaseOrders(params) || [];

      const filtered = filters.priority === 'all'
        ? orders
        : orders.filter(o => o.priority === filters.priority);
      setProcurementOrders(filtered);
    } catch (error) {
      console.error('Error loading procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      draft: ADMIN_STYLES.statusInactive,
      pending: ADMIN_STYLES.statusPending,
      approved: ADMIN_STYLES.statusInfo,
      confirmed: ADMIN_STYLES.statusSuccess,
      production: ADMIN_STYLES.statusWarning,
      shipped: ADMIN_STYLES.statusInfo,
      delivered: ADMIN_STYLES.statusSuccess,
      completed: ADMIN_STYLES.statusSuccess,
      cancelled: ADMIN_STYLES.statusError,
    };
    const textMap = {
      draft: '草稿',
      pending: '待審核',
      approved: '已核准',
      confirmed: '已確認',
      production: '生產中',
      shipped: '已出貨',
      delivered: '已送達',
      completed: '已完成',
      cancelled: '已取消',
    };
    const cls = map[status] || ADMIN_STYLES.statusInactive;
    return <span className={cls}>{textMap[status] || status}</span>;
  };

  const priorityBadge = (priority) => {
    const map = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
      critical: 'bg-red-100 text-red-800',
    };
    const textMap = { low: '低', normal: '一般', high: '高', urgent: '緊急', critical: '關鍵' };
    const cls = map[priority] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{textMap[priority] || priority}</span>;
  };

  const openView = (order) => {
    setSelectedOrder(order);
    setViewOpen(true);
  };

  const openEdit = (order) => {
    setSelectedOrder(order);
    setEditForm({
      status: order.status || 'draft',
      priority: order.priority || 'normal',
      expectedDeliveryDate: order.expectedDeliveryDate || '',
      notes: order.notes || ''
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      procurementDataManager.updatePurchaseOrder(selectedOrder.id, {
        status: editForm.status,
        priority: editForm.priority,
        expectedDeliveryDate: editForm.expectedDeliveryDate,
        notes: editForm.notes
      });
      await loadProcurementData();
      setEditOpen(false);
    } catch (e) {
      console.error('更新失敗', e);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateOrder = async () => {
    // 簡易驗證
    if (!createForm.supplierId && !createForm.supplierName) {
      alert('請選擇或輸入供應商');
      return;
    }
    setSaving(true);
    try {
      const totalAmountNum = Number(createForm.totalAmount) || 0;
      const taxRateNum = Number(createForm.taxRate) || 0;
      const totalWithTax = Math.round(totalAmountNum * (1 + taxRateNum));

      const payload = {
        supplierId: createForm.supplierId || undefined,
        supplierName: createForm.supplierName || (supplierOptions.find(o => o.value === createForm.supplierId)?.label) || '',
        type: createForm.type,
        priority: createForm.priority,
        totalAmount: totalAmountNum,
        taxRate: taxRateNum,
        totalWithTax,
        expectedDeliveryDate: createForm.expectedDeliveryDate || '',
        notes: createForm.notes || ''
      };
      const created = procurementDataManager.createPurchaseOrder(payload);
      await loadProcurementData();
      setCreateOpen(false);
      // 開啟編輯或檢視（可選），這裡直接打開檢視
      if (created) {
        setSelectedOrder(created);
        setViewOpen(true);
      }
      // 重置表單
      setCreateForm({ supplierId: '', supplierName: '', type: 'standard', priority: 'normal', totalAmount: '', taxRate: 0.05, expectedDeliveryDate: '', notes: '' });
    } catch (e) {
      console.error('建立失敗', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入採購數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 + 主動作 */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-chinese">採購管理</h1>
          <p className="text-gray-600 mt-2">管理所有採購訂單和供應商關係</p>
        </div>
        <div>
          <button
            className={`${ADMIN_STYLES.primaryButton} inline-flex items-center`}
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon className="w-5 h-5 mr-2" /> 新增採購單
          </button>
        </div>
      </div>

      {/* 篩選器 */}
      <div className={`${ADMIN_STYLES.glassCard} mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 搜尋 */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜尋採購單號、供應商..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          {/* 狀態篩選 */}
          <div>
            <SearchableSelect
              placeholder="篩選狀態"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              options={[
                { value: 'all', label: '所有狀態' },
                { value: 'draft', label: '草稿' },
                { value: 'pending', label: '待審核' },
                { value: 'approved', label: '已核准' },
                { value: 'confirmed', label: '已確認' },
                { value: 'production', label: '生產中' },
                { value: 'shipped', label: '已出貨' },
                { value: 'delivered', label: '已送達' },
                { value: 'completed', label: '已完成' },
                { value: 'cancelled', label: '已取消' }
              ]}
              size="sm"
            />
          </div>

          {/* 優先級篩選 */}
          <div>
            <SearchableSelect
              placeholder="優先級"
              value={filters.priority}
              onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              options={[
                { value: 'all', label: '所有優先級' },
                { value: 'low', label: '低' },
                { value: 'normal', label: '一般' },
                { value: 'high', label: '高' },
                { value: 'urgent', label: '緊急' },
                { value: 'critical', label: '關鍵' }
              ]}
            />
          </div>
          <div></div>
        </div>
      </div>
      {/* 採購訂單表格 */}
      <StandardTable
        title="採購訂單"
        data={procurementOrders}
        columns={[
          { key: 'poNumber', label: '採購單號', sortable: true },
          { key: 'supplierName', label: '供應商', sortable: true },
          { key: 'type', label: '類型', sortable: true, render: (val) => (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{val}</span>
          ) },
          { key: 'status', label: '狀態', sortable: true, render: (val) => statusBadge(val) },
          { key: 'priority', label: '優先級', sortable: true, render: (val) => priorityBadge(val) },
          { key: 'totalWithTax', label: '總金額(含稅)', sortable: true, render: (val, row) => (
            <span className="text-gray-900">{(val ?? row.totalAmount ?? 0).toLocaleString()}</span>
          ) },
          { key: 'expectedDeliveryDate', label: '預計交期', sortable: true },
          { key: 'createdAt', label: '建立時間', sortable: true },
          { key: 'actions', label: '操作', sortable: false, render: (_val, row) => (
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="檢視"
                aria-label="檢視"
                onClick={() => openView(row)}
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                title="編輯"
                aria-label="編輯"
                onClick={() => openEdit(row)}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          ) }
        ]}
        showExport={true}
        exportFileName="採購訂單"
        emptyIcon={DocumentTextIcon}
        emptyTitle="沒有找到採購訂單"
        emptyDescription="請調整篩選條件或稍後再試"
        enableBatchSelection={false}
      />

      {/* 新增採購單彈窗 */}
      <GlassModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="新增採購單"
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">供應商</label>
              {supplierOptions.length > 0 ? (
                <SearchableSelect
                  placeholder="選擇供應商"
                  value={createForm.supplierId || 'custom'}
                  onChange={(value) => {
                    if (value === 'custom') {
                      setCreateForm(prev => ({ ...prev, supplierId: '', supplierName: '' }));
                    } else {
                      setCreateForm(prev => ({ ...prev, supplierId: value, supplierName: '' }));
                    }
                  }}
                  options={[{ value: 'custom', label: '手動輸入供應商名稱' }, ...supplierOptions]}
                />
              ) : (
                <input
                  type="text"
                  className={ADMIN_STYLES.input}
                  placeholder="輸入供應商名稱"
                  value={createForm.supplierName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, supplierName: e.target.value }))}
                />
              )}
              {supplierOptions.length > 0 && !createForm.supplierId && (
                <input
                  type="text"
                  className={`${ADMIN_STYLES.input} mt-2`}
                  placeholder="或輸入供應商名稱"
                  value={createForm.supplierName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, supplierName: e.target.value }))}
                />
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">類型</label>
              <SearchableSelect
                value={createForm.type}
                onChange={(value) => setCreateForm(prev => ({ ...prev, type: value }))}
                options={[
                  { value: 'standard', label: '一般' },
                  { value: 'urgent', label: '緊急' },
                  { value: 'planned', label: '預定' },
                  { value: 'sample', label: '樣品' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">優先級</label>
              <SearchableSelect
                value={createForm.priority}
                onChange={(value) => setCreateForm(prev => ({ ...prev, priority: value }))}
                options={[
                  { value: 'low', label: '低' },
                  { value: 'normal', label: '一般' },
                  { value: 'high', label: '高' },
                  { value: 'urgent', label: '緊急' },
                  { value: 'critical', label: '關鍵' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">預計交期</label>
              <input
                type="date"
                className={ADMIN_STYLES.input}
                value={createForm.expectedDeliveryDate}
                onChange={(e) => setCreateForm(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">金額（未稅）</label>
              <input
                type="number"
                min="0"
                className={ADMIN_STYLES.input}
                placeholder="例如 50000"
                value={createForm.totalAmount}
                onChange={(e) => setCreateForm(prev => ({ ...prev, totalAmount: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">稅率</label>
              <SearchableSelect
                value={String(createForm.taxRate)}
                onChange={(value) => setCreateForm(prev => ({ ...prev, taxRate: Number(value) }))}
                options={[
                  { value: '0', label: '0%' },
                  { value: '0.05', label: '5%' },
                  { value: '0.1', label: '10%' }
                ]}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">備註</label>
              <textarea
                className={`${ADMIN_STYLES.input} min-h-[100px]`}
                value={createForm.notes}
                onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => setCreateOpen(false)}>取消</button>
            <button className={`${ADMIN_STYLES.primaryButton} ${saving ? 'opacity-70 pointer-events-none' : ''}`} onClick={handleCreateOrder}>
              {saving ? '建立中…' : '建立採購單'}
            </button>
          </div>
        </div>
      </GlassModal>

      {/* 檢視彈窗 */}
      <GlassModal
        isOpen={viewOpen && !!selectedOrder}
        onClose={() => setViewOpen(false)}
        title={selectedOrder ? `檢視採購單 ${selectedOrder.poNumber}` : '檢視採購單'}
      >
        {selectedOrder && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">採購單號</div>
                <div className="font-medium">{selectedOrder.poNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">供應商</div>
                <div className="font-medium">{selectedOrder.supplierName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">狀態</div>
                <div className="font-medium">{statusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">優先級</div>
                <div className="font-medium">{priorityBadge(selectedOrder.priority)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">總金額(含稅)</div>
                <div className="font-medium">{(selectedOrder.totalWithTax ?? selectedOrder.totalAmount ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">預計交期</div>
                <div className="font-medium">{selectedOrder.expectedDeliveryDate || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">建立時間</div>
                <div className="font-medium">{selectedOrder.createdAt}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">備註</div>
              <div className="text-gray-700 whitespace-pre-line">{selectedOrder.notes || '—'}</div>
            </div>
            <div className="px-0 pt-2">
              <button className={ADMIN_STYLES.primaryButton} onClick={() => { setViewOpen(false); openEdit(selectedOrder); }}>
                編輯此採購單
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* 編輯彈窗 */}
      <GlassModal
        isOpen={editOpen && !!selectedOrder}
        onClose={() => setEditOpen(false)}
        title={selectedOrder ? `編輯採購單 ${selectedOrder.poNumber}` : '編輯採購單'}
      >
        {selectedOrder && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">狀態</label>
                <SearchableSelect
                  value={editForm.status}
                  onChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                  options={[
                    { value: 'draft', label: '草稿' },
                    { value: 'pending', label: '待審核' },
                    { value: 'approved', label: '已核准' },
                    { value: 'confirmed', label: '已確認' },
                    { value: 'production', label: '生產中' },
                    { value: 'ready', label: '準備出貨' },
                    { value: 'shipped', label: '已出貨' },
                    { value: 'delivered', label: '已送達' },
                    { value: 'inspecting', label: '驗收中' },
                    { value: 'completed', label: '已完成' },
                    { value: 'cancelled', label: '已取消' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">優先級</label>
                <SearchableSelect
                  value={editForm.priority}
                  onChange={(value) => setEditForm(prev => ({ ...prev, priority: value }))}
                  options={[
                    { value: 'low', label: '低' },
                    { value: 'normal', label: '一般' },
                    { value: 'high', label: '高' },
                    { value: 'urgent', label: '緊急' },
                    { value: 'critical', label: '關鍵' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">預計交期</label>
                <input
                  type="date"
                  className={ADMIN_STYLES.input}
                  value={editForm.expectedDeliveryDate || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">備註</label>
                <textarea
                  className={`${ADMIN_STYLES.input} min-h-[100px]`}
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button className={ADMIN_STYLES.secondaryButton} onClick={() => setEditOpen(false)}>取消</button>
              <button className={`${ADMIN_STYLES.primaryButton} ${saving ? 'opacity-70 pointer-events-none' : ''}`} onClick={handleSaveEdit}>
                {saving ? '儲存中…' : '儲存變更'}
              </button>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default ProcurementOverview;
