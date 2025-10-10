import React, { useEffect, useMemo, useState } from 'react';
import { ChatBubbleBottomCenterTextIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import StandardTable from '../../components/ui/StandardTable';
import reviewsDataManager from '../../../../external_mock/reviews/reviewsDataManager';
import GlassModal from '../../components/ui/GlassModal';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import IconActionButton from '../../components/ui/IconActionButton';

export default function ReviewsManagement() {
  const [rows, setRows] = useState([]); // 所有 reviews 原始資料
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await reviewsDataManager.list();
      if (res.success) setRows(res.data);
    })();
  }, []);

  // 以商品（sku）為主鍵分群，母表顯示商品摘要、子表顯示該商品所有評價
  const groupedByProduct = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const key = r.sku || r.productName;
      if (!map.has(key)) {
        map.set(key, { sku: r.sku, productName: r.productName, reviews: [] });
      }
      map.get(key).reviews.push(r);
    }
    const products = Array.from(map.values()).map(p => {
      const count = p.reviews.length;
      const avg = count ? (p.reviews.reduce((s, x) => s + (x.rating || 0), 0) / count) : 0;
      const last = p.reviews.reduce((acc, x) => (acc > x.createdAt ? acc : x.createdAt), '');
      return { ...p, reviewCount: count, avgRating: Number(avg.toFixed(2)), lastReviewedAt: last };
    });
    return products;
  }, [rows]);

  const productColumns = useMemo(() => ([
    {
      key: 'productName', label: '商品', sortable: true,
      render: (_v, row) => (
        <div>
          <div className="font-medium text-gray-900 font-chinese">{row.productName || '-'}</div>
          <div className="text-xs text-gray-500 font-mono">{row.sku || '-'}</div>
        </div>
      )
    },
    {
      key: 'reviewCount', label: '評價數', sortable: true,
      render: (v) => <span className="text-gray-900 font-semibold">{v}</span>
    },
    {
      key: 'avgRating', label: '平均評分', sortable: true,
      render: (v) => (
        <div className="text-amber-600 font-semibold">
          {Number(v || 0).toFixed(2)}
        </div>
      )
    },
    { key: 'lastReviewedAt', label: '最近評價日期', sortable: true },
  ]), []);

  const handleDelete = async (review) => {
    const res = await reviewsDataManager.delete(review.id);
    if (res.success) {
      setRows(prev => prev.filter(r => r.id !== review.id));
    }
  };

  const reviewSubColumns = useMemo(() => ([
    { key: 'createdAt', label: '日期', sortable: true },
    { key: 'author', label: '作者', sortable: true },
    { key: 'rating', label: '評分', sortable: true, render: (v) => (
      <div className="text-amber-600 font-semibold">{'★'.repeat(v)}<span className="text-gray-300">{'★'.repeat(5 - v)}</span></div>
    ) },
    { key: 'title', label: '標題', sortable: true },
    { key: 'status', label: '狀態', sortable: true, render: (v) => {
      const labelMap = { published: '已發布', pending: '待審核', hidden: '隱藏' };
      const label = labelMap[v] || v;
      const color = v === 'published' ? 'bg-green-100 text-green-800' : v === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
      return (
        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-chinese ${color}`}>{label}</span>
      );
    } },
    { key: 'actions', label: '操作', sortable: false, render: (_v, r) => (
      <div className="flex items-center gap-2">
        <IconActionButton Icon={EyeIcon} label="查看" variant="blue" onClick={() => setDetail(r)} />
        <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => handleDelete(r)} />
      </div>
    ) },
  ]), []);

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">評價管理</h1>
          </div>
        </div>

        <StandardTable
          title="商品評價概覽"
          data={groupedByProduct}
          columns={productColumns}
          exportFileName="商品評價概覽"
          enableRowExpansion
          getSubRows={(row) => row.reviews || []}
          subColumns={reviewSubColumns}
          renderSubtableHeader={(row) => (
            <div className="text-sm text-gray-600">
              {row.productName || '-'}（{row.sku || '-'}）的評價列表（{row.reviewCount} 筆）
            </div>
          )}
          subtableClassName="bg-white/70 rounded-xl"
          getRowId={(item) => item.sku || item.productName}
        />

        <GlassModal isOpen={!!detail} onClose={() => setDetail(null)} title={`評價詳情：${detail?.id}`} size="max-w-3xl">
          {detail && (
            <div className="p-6 pt-0 space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-gray-700">
                  <div className="mb-1"><span className="text-gray-500">商品：</span>{detail.productName}（{detail.sku}）</div>
                  <div className="mb-1"><span className="text-gray-500">訂單：</span>{detail.orderNo}</div>
                  <div className="mb-1"><span className="text-gray-500">評分：</span>{'★'.repeat(detail.rating)}<span className="text-gray-300">{'★'.repeat(5-detail.rating)}</span></div>
                  <div className="mb-1"><span className="text-gray-500">標題：</span>{detail.title}</div>
                  <div className="mb-1"><span className="text-gray-500">內容：</span>{detail.content}</div>
                  <div className="mb-1"><span className="text-gray-500">作者：</span>{detail.author}</div>
                  <div className="mb-1"><span className="text-gray-500">日期：</span>{detail.createdAt}</div>
                </div>
              </div>
            </div>
          )}
        </GlassModal>
      </div>
    </div>
  );
}
