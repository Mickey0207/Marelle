import React, { useEffect, useMemo, useState } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import CategoryCascader from '../../components/ui/CategoryCascader';
import GlassModal from '../../components/ui/GlassModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ImageUpload from '../../components/products/ImageUpload';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import IconActionButton from '../../components/ui/IconActionButton';

// 單一層分類表格（可展開顯示下一層）；透過遞迴支援最多五層（不限層數）
const CategoryLevelTable = ({ data = [], depth = 1, onEdit, onDelete }) => {
  // 計算階層路徑
  const getBreadcrumb = (row, allData) => {
    const path = [];
    function findPath(id, items) {
      for (const item of items) {
        if (item.id === id) {
          return [item.name];
        }
        if (item.children && item.children.length > 0) {
          const result = findPath(id, item.children);
          if (result) {
            return [item.name, ...result];
          }
        }
      }
      return null;
    }
    const fullPath = findPath(row.id, allData);
    return fullPath ? fullPath.join(' / ') : row.name;
  };

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
      sortable: false,
      render: (_v, row) => (
        <span className="text-sm text-gray-600">{getBreadcrumb(row, data)}</span>
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
          <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => onEdit?.(row)} />
          <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => onDelete?.(row)} />
        </div>
      )
    }
  ];

  // 將下一層包在子表格單列容器中，內含下一層的 CategoryLevelTable，實現遞迴子表格
  const getSubRows = (row) => {
    const children = row.children || [];
    if (!children.length) return [];
    return [{ __container__: true, children }];
  };

  const subColumns = [
    {
      key: '__container__',
      label: '子分類',
      sortable: false,
      render: (_v, childRow) => (
        <div className="py-2">
          <CategoryLevelTable data={childRow.children} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
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
      getRowId={(item, idx) => item.id || item.slug || idx}
    />
  );
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editImages, setEditImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/backend/categories', { method: 'GET', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Error loading categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filteredTree = useMemo(() => {
    if (!term) return categories;
    const kw = term.toLowerCase();
    function filterNode(node) {
      const selfHit = (node.name || '').toLowerCase().includes(kw);
      const children = (node.children || []).map(filterNode).filter(Boolean);
      return (selfHit || children.length) ? { ...node, children } : null;
    }
    return categories.map(filterNode).filter(Boolean);
  }, [categories, term]);

  const openCreate = (parent = null) => {
    setParentId(parent?.id || null);
    setForm({ name: '', slug: '' });
    setEditImages([]);
    setCreateOpen(true);
  };

  const openEdit = (row) => {
    setTarget(row);
    setForm({ name: row.name || '', slug: row.slug || '' });
    setEditImages(row.image ? [{ id: `${row.slug}-img`, url: row.image, name: row.name || 'image' }] : []);
    setEditOpen(true);
  };

  const openDelete = (row) => {
    setTarget(row);
    setDeleteOpen(true);
  };

  const handleCreate = async () => {
    if (!form.name || !form.slug) {
      alert('請填寫名稱和Slug');
      return;
    }

    try {
      setSubmitting(true);
      // First, create the category without image
      const payload = {
        name: form.name,
        slug: form.slug,
        parent_id: parentId,
        image_url: ''
      };
      const res = await fetch('/backend/categories', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create category');
      
      const createdCategory = await res.json();
      
      // Then upload image if provided and has file
      if (editImages.length > 0 && editImages[0].file) {
        const formData = new FormData();
        formData.append('file', editImages[0].file);
        
        const uploadRes = await fetch(`/backend/categories/${createdCategory.id}/upload-image`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        if (!uploadRes.ok) {
          console.warn('Image upload failed, but category created');
        }
      }
      
      await fetchCategories();
      setCreateOpen(false);
      setForm({ name: '', slug: '' });
      setEditImages([]);
    } catch (err) {
      alert(`建立失敗: ${err.message}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!target || !form.name || !form.slug) {
      alert('請填寫名稱和Slug');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name,
        slug: form.slug
      };
      const res = await fetch(`/backend/categories/${target.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update category');
      
      // If there's a new image file (not just URL), upload it
      if (editImages.length > 0 && editImages[0].file) {
        const formData = new FormData();
        formData.append('file', editImages[0].file);
        
        const uploadRes = await fetch(`/backend/categories/${target.id}/upload-image`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        if (!uploadRes.ok) {
          console.warn('Image upload failed, but category updated');
        }
      }
      
      await fetchCategories();
      setEditOpen(false);
      setTarget(null);
      setForm({ name: '', slug: '' });
      setEditImages([]);
    } catch (err) {
      alert(`編輯失敗: ${err.message}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!target) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/backend/categories/${target.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete category');
      await fetchCategories();
      setDeleteOpen(false);
      setTarget(null);
    } catch (err) {
      alert(`刪除失敗: ${err.message}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <input
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc824d]"
              placeholder="搜尋分類名稱"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <CategoryCascader tree={categories} value={selected} onChange={setSelected} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-500">載入中...</div>
          ) : (
            <CategoryLevelTable 
              data={filteredTree} 
              onEdit={openEdit} 
              onDelete={openDelete}
            />
          )}
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
            <CategoryCascader tree={categories} value={parentId} onChange={setParentId} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名稱*</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
              value={form.slug} 
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} 
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分類圖片</label>
            <ImageUpload 
              images={editImages} 
              onChange={(imgs) => setEditImages(imgs)} 
              maxImages={1}
              disabled={submitting}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50" 
              onClick={() => setCreateOpen(false)}
              disabled={submitting}
            >
              取消
            </button>
            <button 
              className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37] disabled:opacity-50" 
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? '建立中...' : '新增'}
            </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">名稱*</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
              value={form.slug} 
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分類圖片</label>
            <ImageUpload 
              images={editImages} 
              onChange={(imgs) => setEditImages(imgs)} 
              maxImages={1}
              disabled={submitting}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50" 
              onClick={() => setEditOpen(false)}
              disabled={submitting}
            >
              取消
            </button>
            <button 
              className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37] disabled:opacity-50" 
              onClick={handleUpdate}
              disabled={submitting}
            >
              {submitting ? '儲存中...' : '儲存'}
            </button>
          </div>
        </div>
      </GlassModal>

      {/* 確認刪除 Modal */}
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="確認刪除"
        message={`確定要刪除分類「${target?.name}」及其所有子分類嗎？此操作無法復原。`}
        confirmVariant="danger"
        isLoading={submitting}
      />
    </div>
  );
};

export default CategoryManagement;
