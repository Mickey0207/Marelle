import React, { useState, useEffect, useCallback } from 'react';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../Style/adminStyles.js';
import StandardTable from '../../components/ui/StandardTable.jsx';
import GlassModal from '../../components/ui/GlassModal.jsx';
import SearchableSelect from '../../components/ui/SearchableSelect.jsx';
import IconActionButton from '../../components/ui/IconActionButton.jsx';
import supplierDataManager, { SupplierStatus, SupplierGrade } from '../../../../external_mock/procurement/supplierDataManager.js';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'all', grade: 'all' });
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', grade: '', website: '' });
  const [createForm, setCreateForm] = useState({ companyName: '', industry: '', taxId: '', website: '', establishedDate: '', status: SupplierStatus.PENDING, grade: SupplierGrade.E_UNQUALIFIED });
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadSuppliers = useCallback(() => {
    setLoading(true);
    try {
      const list = supplierDataManager.getAllSuppliers() || [];
      const filtered = list.filter((s) => {
        const term = (filters.search || '').toLowerCase();
        const matchesSearch = !term || [
          s.companyName,
          s.companyNameEn,
          s.taxId,
          s.industry,
          s.website,
        ].some(v => String(v || '').toLowerCase().includes(term));
        const matchesStatus = filters.status === 'all' || s.status === filters.status;
        const matchesGrade = filters.grade === 'all' || s.grade === filters.grade;
        return matchesSearch && matchesStatus && matchesGrade;
      });
      setSuppliers(filtered);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSuppliers();
  }, [filters, loadSuppliers]);

  // loadSuppliers 已用 useCallback 包裝

  const statusBadge = (status) => {
    const map = {
      [SupplierStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [SupplierStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [SupplierStatus.SUSPENDED]: 'bg-red-100 text-red-800',
      [SupplierStatus.BLACKLISTED]: 'bg-red-100 text-red-900',
      inactive: 'bg-gray-100 text-gray-800',
    };
    const textMap = {
      [SupplierStatus.ACTIVE]: '活躍',
      [SupplierStatus.PENDING]: '待審核',
      [SupplierStatus.SUSPENDED]: '暫停',
      [SupplierStatus.BLACKLISTED]: '黑名單',
      inactive: '停用',
    };
    const cls = map[status] || 'bg-gray-100 text-gray-800';
    const label = textMap[status] || status;
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
  };

  const openView = (supplier) => {
    setSelectedSupplier(supplier);
    setViewOpen(true);
  };

  const openEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setEditForm({
      status: supplier.status || SupplierStatus.PENDING,
      grade: supplier.grade || SupplierGrade.E_UNQUALIFIED,
      website: supplier.website || '',
    });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedSupplier) return;
    setSaving(true);
    try {
      const res = supplierDataManager.updateSupplier(selectedSupplier.id, {
        status: editForm.status,
        grade: editForm.grade,
        website: editForm.website,
      });
      if (!res?.success) {
        alert('儲存失敗：' + (res?.error || '未知錯誤'));
      }
      loadSuppliers();
      setEditOpen(false);
    } catch (e) {
      console.error('更新供應商失敗', e);
      alert('更新供應商失敗');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('確定要刪除這個供應商嗎？此操作會一併刪除相關聯絡人和採購記錄。')) {
      const result = supplierDataManager.deleteSupplier(id);
      if (result.success) {
        loadSuppliers();
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const handleCreateSupplier = () => {
    if (!createForm.companyName || !createForm.companyName.trim()) {
      alert('請輸入供應商名稱');
      return;
    }
    setCreating(true);
    try {
      const payload = {
        companyName: createForm.companyName.trim(),
        industry: createForm.industry || '',
        taxId: createForm.taxId || '',
        website: createForm.website || '',
        establishedDate: createForm.establishedDate || '',
        status: createForm.status,
        grade: createForm.grade,
      };
      const res = supplierDataManager.createSupplier(payload);
      if (!res?.success) {
        alert('建立失敗：' + (res?.error || '未知錯誤'));
      } else {
        loadSuppliers();
        setCreateOpen(false);
        // 重置
        setCreateForm({ companyName: '', industry: '', taxId: '', website: '', establishedDate: '', status: SupplierStatus.PENDING, grade: SupplierGrade.E_UNQUALIFIED });
      }
    } catch (e) {
      console.error('建立供應商失敗', e);
      alert('建立供應商失敗');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入供應商數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 標題 + 主動作 */}
  <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-chinese">供應商管理</h1>
          <p className="text-gray-600 mt-2">管理所有供應商信息與合作關係</p>
        </div>
        <div>
          <button
            className={`${ADMIN_STYLES.primaryButton} inline-flex items-center`}
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon className="w-5 h-5 mr-2" /> 新增供應商
          </button>
        </div>
      </div>

      {/* 篩選列 */}
      <div className={`${ADMIN_STYLES.glassCard} mb-6`}>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜尋供應商名稱、統編、產業..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <SearchableSelect
              placeholder="狀態"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              options={[
                { value: 'all', label: '所有狀態' },
                { value: SupplierStatus.ACTIVE, label: '活躍' },
                { value: SupplierStatus.PENDING, label: '待審核' },
                { value: SupplierStatus.SUSPENDED, label: '暫停' },
                { value: SupplierStatus.BLACKLISTED, label: '黑名單' },
                { value: 'inactive', label: '停用' },
              ]}
              size="sm"
            />
          </div>
          <div>
            <SearchableSelect
              placeholder="分級"
              value={filters.grade}
              onChange={(value) => setFilters(prev => ({ ...prev, grade: value }))}
              options={[
                { value: 'all', label: '所有分級' },
                { value: SupplierGrade.A_STRATEGIC, label: 'A' },
                { value: SupplierGrade.B_PREFERRED, label: 'B' },
                { value: SupplierGrade.C_QUALIFIED, label: 'C' },
                { value: SupplierGrade.D_CONDITIONAL, label: 'D' },
                { value: SupplierGrade.E_UNQUALIFIED, label: 'E' },
              ]}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* 供應商表格 */}
      <StandardTable
        title="供應商列表"
        data={suppliers}
        exportFileName="供應商列表"
        emptyIcon={BuildingOfficeIcon}
        emptyTitle="沒有找到供應商"
        emptyDescription="請調整搜尋/篩選條件或新增第一筆供應商"
        columns={[
          { key: 'companyName', label: '供應商名稱', sortable: true },
          { key: 'industry', label: '產業', sortable: true },
          { key: 'status', label: '狀態', sortable: true, render: (val) => statusBadge(val) },
          { key: 'grade', label: '分級', sortable: true },
          { key: 'overallRating', label: '評分', sortable: true, render: (val) => (
            <span className="text-gray-900">{val != null ? Number(val).toFixed(1) : '-'}</span>
          ) },
          { key: 'taxId', label: '統一編號', sortable: true },
          { key: 'establishedDate', label: '成立日期', sortable: true },
          { key: 'createdAt', label: '建立時間', sortable: true },
          { key: 'actions', label: '操作', sortable: false, render: (_val, row) => (
            <div className="flex items-center space-x-2">
              <IconActionButton Icon={EyeIcon} label="檢視" variant="blue" onClick={() => openView(row)} />
              <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => openEdit(row)} />
              <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => handleDeleteSupplier(row.id)} />
            </div>
          ) },
        ]}
      />

      {/* 檢視彈窗 */}
      <GlassModal
        isOpen={viewOpen && !!selectedSupplier}
        onClose={() => setViewOpen(false)}
        title={selectedSupplier ? `檢視供應商：${selectedSupplier.companyName}` : '檢視供應商'}
      >
        {selectedSupplier && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">供應商名稱</div>
                <div className="font-medium">{selectedSupplier.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">產業</div>
                <div className="font-medium">{selectedSupplier.industry || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">狀態</div>
                <div className="font-medium">{statusBadge(selectedSupplier.status)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">分級</div>
                <div className="font-medium">{selectedSupplier.grade || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">統一編號</div>
                <div className="font-medium">{selectedSupplier.taxId || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">網站</div>
                <div className="font-medium">{selectedSupplier.website || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">成立日期</div>
                <div className="font-medium">{selectedSupplier.establishedDate || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">建立時間</div>
                <div className="font-medium">{selectedSupplier.createdAt || '-'}</div>
              </div>
            </div>
          </div>
        )}
      </GlassModal>

      {/* 編輯彈窗 */}
      <GlassModal
        isOpen={editOpen && !!selectedSupplier}
        onClose={() => setEditOpen(false)}
        title={selectedSupplier ? `編輯供應商：${selectedSupplier.companyName}` : '編輯供應商'}
      >
        {selectedSupplier && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">狀態</label>
                <SearchableSelect
                  value={editForm.status}
                  onChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                  options={[
                    { value: SupplierStatus.ACTIVE, label: '活躍' },
                    { value: SupplierStatus.PENDING, label: '待審核' },
                    { value: SupplierStatus.SUSPENDED, label: '暫停' },
                    { value: SupplierStatus.BLACKLISTED, label: '黑名單' },
                    { value: 'inactive', label: '停用' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">分級</label>
                <SearchableSelect
                  value={editForm.grade}
                  onChange={(value) => setEditForm(prev => ({ ...prev, grade: value }))}
                  options={[
                    { value: SupplierGrade.A_STRATEGIC, label: 'A' },
                    { value: SupplierGrade.B_PREFERRED, label: 'B' },
                    { value: SupplierGrade.C_QUALIFIED, label: 'C' },
                    { value: SupplierGrade.D_CONDITIONAL, label: 'D' },
                    { value: SupplierGrade.E_UNQUALIFIED, label: 'E' },
                  ]}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1">網站</label>
                <input
                  type="text"
                  className={ADMIN_STYLES.input}
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
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

      {/* 新增彈窗 */}
      <GlassModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="新增供應商"
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">供應商名稱</label>
              <input
                type="text"
                className={ADMIN_STYLES.input}
                value={createForm.companyName}
                onChange={(e) => setCreateForm(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="例如：美妝世界股份有限公司"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">產業</label>
              <input
                type="text"
                className={ADMIN_STYLES.input}
                value={createForm.industry}
                onChange={(e) => setCreateForm(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="例如：化妝品批發"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">統一編號</label>
              <input
                type="text"
                className={ADMIN_STYLES.input}
                value={createForm.taxId}
                onChange={(e) => setCreateForm(prev => ({ ...prev, taxId: e.target.value }))}
                placeholder="例如：12345678"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">網站</label>
              <input
                type="text"
                className={ADMIN_STYLES.input}
                value={createForm.website}
                onChange={(e) => setCreateForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">成立日期</label>
              <input
                type="date"
                className={ADMIN_STYLES.input}
                value={createForm.establishedDate}
                onChange={(e) => setCreateForm(prev => ({ ...prev, establishedDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">狀態</label>
              <SearchableSelect
                value={createForm.status}
                onChange={(value) => setCreateForm(prev => ({ ...prev, status: value }))}
                options={[
                  { value: SupplierStatus.ACTIVE, label: '活躍' },
                  { value: SupplierStatus.PENDING, label: '待審核' },
                  { value: SupplierStatus.SUSPENDED, label: '暫停' },
                  { value: SupplierStatus.BLACKLISTED, label: '黑名單' },
                  { value: 'inactive', label: '停用' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">分級</label>
              <SearchableSelect
                value={createForm.grade}
                onChange={(value) => setCreateForm(prev => ({ ...prev, grade: value }))}
                options={[
                  { value: SupplierGrade.A_STRATEGIC, label: 'A' },
                  { value: SupplierGrade.B_PREFERRED, label: 'B' },
                  { value: SupplierGrade.C_QUALIFIED, label: 'C' },
                  { value: SupplierGrade.D_CONDITIONAL, label: 'D' },
                  { value: SupplierGrade.E_UNQUALIFIED, label: 'E' },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => setCreateOpen(false)}>取消</button>
            <button className={`${ADMIN_STYLES.primaryButton} ${creating ? 'opacity-70 pointer-events-none' : ''}`} onClick={handleCreateSupplier}>
              {creating ? '建立中…' : '建立供應商'}
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export default SupplierList;
