import React, { useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import CategoryCascader from '../../components/ui/CategoryCascader';
import categoryManager, { PRODUCT_CATEGORIES, getCategoryBreadcrumbBySlug, searchCategories } from '../../../../external_mock/products/categoryDataManager';
import GlassModal from '../../components/ui/GlassModal';
import ImageUpload from '../../components/products/ImageUpload';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import IconActionButton from '../../components/ui/IconActionButton';

// 單一層分類表格（可展開顯示下一層）；透過遞迴支援最多五層（不限層數）
const CategoryLevelTable = ({ data = [], depth = 1 }) => {
  const columns = [
    {
      key: 'image',
      label: '圖片',
      sortable: false,
      render: (_v, row) => (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {row.image ? (
            <img src={row.image} alt={`${row.name} 圖片`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400">無圖</span>
          )}
        </div>
      )
    },
    {
      key: 'name',
      label: '分類名稱',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center">
          <span className="text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      key: 'breadcrumb',
      label: '階層',
      sortable: true,
      render: (_v, row) => (
        <span className="text-sm text-gray-600">{getCategoryBreadcrumbBySlug(PRODUCT_CATEGORIES, row.slug)}</span>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      render: (v) => <span className="font-mono text-xs text-gray-700">{v}</span>
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_v, row) => (
        <div className="flex items-center space-x-2">
          <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => row.onEdit?.(row)} />
          <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => row.onDelete?.(row)} />
        </div>
      )
    }
  ];

  // 將下一層包在子表格單列容器中，內含下一層的 CategoryLevelTable，實現遞迴子表格
  const getSubRows = (row) => {
    const children = row.children || [];
    if (!children.length) return [];
    return [{ __container__: true, children: children.map(c => ({ ...c, onEdit: row.onEdit, onDelete: row.onDelete })) }];
  };

  const subColumns = [
    {
      key: '__container__',
      label: '子分類',
      sortable: false,
      render: (_v, childRow) => (
        <div className="py-2">
          <CategoryLevelTable data={childRow.children} depth={depth + 1} />
        </div>
      )
    }
  ];

  return (
    <StandardTable
      title={depth === 1 ? '分類清單' : `第 ${depth} 層`}
      columns={columns}
      data={data}
      exportFileName={depth === 1 ? 'product-categories' : `product-categories-level-${depth}`}
      emptyMessage="沒有找到符合條件的分類"
      enableRowExpansion
      getSubRows={getSubRows}
      subColumns={subColumns}
      subtableClassName="bg-white/70 rounded-xl"
      getRowId={(item, idx) => item.slug || item.id || idx}
    />
  );
};

const CategoryManagement = () => {
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [parentSlug, setParentSlug] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '' });
  const [createImages, setCreateImages] = useState([]);
  const [editImages, setEditImages] = useState([]);

  const filteredTree = useMemo(() => searchCategories(PRODUCT_CATEGORIES, term), [term]);

  // 刷新視圖（mock 以記憶體儲存）
  const refresh = () => setTerm(prev => prev);

  const openCreate = (parent = null) => {
    setParentSlug(parent?.slug || null);
    setForm({ name: '', slug: '', image: '' });
    setCreateImages([]);
    setCreateOpen(true);
  };

  const openEdit = (row) => {
    setTarget(row);
    setForm({ name: row.name || '', slug: row.slug || '', image: row.image || '' });
    setEditImages(row.image ? [{ id: `${row.slug}-img`, url: row.image, name: row.name || 'image' }] : []);
    setEditOpen(true);
  };

  const handleCreate = () => {
    const imageUrl = createImages[0]?.url || form.image || '';
    categoryManager.addCategory({ parentSlug, name: form.name, slug: form.slug, image: imageUrl });
    setCreateOpen(false);
    refresh();
  };

  const handleUpdate = () => {
    if (!target) return;
    const imageUrl = editImages[0]?.url || form.image || '';
    categoryManager.updateCategory(target.slug, { name: form.name, slug: form.slug, image: imageUrl });
    setEditOpen(false);
    setTarget(null);
    refresh();
  };

  const handleDelete = (row) => {
    categoryManager.deleteCategory(row.slug);
    refresh();
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>分類管理</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>建立與管理產品分類階層（支援最多五層）</p>
          </div>
          <button onClick={() => openCreate(null)} className="inline-flex items-center px-6 py-3 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-md hover:shadow-lg font-chinese">
            <PlusIcon className="w-5 h-5 mr-2" />
            新增分類
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <input
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc824d]"
              placeholder="搜尋分類名稱"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <CategoryCascader tree={PRODUCT_CATEGORIES} value={selected} onChange={setSelected} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
          <CategoryLevelTable data={(filteredTree || []).map(n => ({ ...n, onEdit: openEdit, onDelete: handleDelete }))} />
        </div>
      </div>
      {/* 新增分類 Modal */}
      <GlassModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="新增分類"
        size="max-w-lg"
        maxHeight="max-h-[80vh]"
        contentMaxHeight="max-h-[calc(80vh-80px)]"
      >
        <div className="p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">上層分類（可留空）</label>
            <CategoryCascader tree={PRODUCT_CATEGORIES} value={parentSlug} onChange={setParentSlug} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名稱</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug（可留空自動生成）</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.slug} onChange={e=>setForm(f=>({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分類圖片</label>
            <ImageUpload images={createImages} onChange={(imgs)=>{ setCreateImages(imgs); setForm(f=>({ ...f, image: imgs[0]?.url || '' })); }} maxImages={1} />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={()=>setCreateOpen(false)}>取消</button>
            <button className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37]" onClick={handleCreate}>新增</button>
          </div>
        </div>
      </GlassModal>

      {/* 編輯分類 Modal */}
      <GlassModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="編輯分類"
        size="max-w-lg"
        maxHeight="max-h-[80vh]"
        contentMaxHeight="max-h-[calc(80vh-80px)]"
      >
        <div className="p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名稱</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.slug} onChange={e=>setForm(f=>({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分類圖片</label>
            <ImageUpload images={editImages} onChange={(imgs)=>{ setEditImages(imgs); setForm(f=>({ ...f, image: imgs[0]?.url || '' })); }} maxImages={1} />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={()=>setEditOpen(false)}>取消</button>
            <button className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37]" onClick={handleUpdate}>儲存</button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export default CategoryManagement;
