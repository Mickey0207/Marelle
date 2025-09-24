import React, { useState } from 'react';
import TabNavigation from '../ui/TabNavigation';

const money = (n) => `NT$ ${Number(n || 0).toLocaleString()}`;

const OrderRefundDetailTabs = ({ detail }) => {
  const [tab, setTab] = useState('items'); // items | shipping | payment | invoice
  const isOrder = detail.type === 'order';
  const data = detail.data;

  return (
    <div className="space-y-5">
      {/* 摘要列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass rounded-lg p-3">
          <div className="text-xs text-gray-500">{isOrder ? '訂單編號' : '退款編號'}</div>
          <div className="font-mono text-sm mt-1">{isOrder ? data.orderNo : data.refundNo}</div>
        </div>
        <div className="glass rounded-lg p-3">
          <div className="text-xs text-gray-500">建立時間</div>
          <div className="text-sm mt-1">{data.createdAt || '—'}</div>
        </div>
        <div className="glass rounded-lg p-3">
          <div className="text-xs text-gray-500">狀態</div>
          <div className="mt-1 inline-flex px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">{data.status || '—'}</div>
        </div>
        <div className="glass rounded-lg p-3">
          <div className="text-xs text-gray-500">{isOrder ? '金額' : '退款金額'}</div>
          <div className={`text-sm mt-1 ${!isOrder ? 'text-red-600 font-semibold' : 'font-semibold'}`}>{isOrder ? money(data.totals?.grandTotal) : `- ${money(data.amounts?.totalRefund)}`}</div>
        </div>
      </div>

      <TabNavigation
        mode="controlled"
        activeKey={tab}
        onTabChange={(t) => setTab(t.key)}
        layout="left"
        tabs={[
          { key: 'items', label: '商品明細' },
          { key: 'shipping', label: '配送細節' },
          { key: 'payment', label: '付款與金額' },
          { key: 'invoice', label: '發票/折讓' },
        ]}
      />

      {tab === 'items' && (
        <div className="text-sm">
          <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs text-gray-500 px-2 mb-1">
            <div className="md:col-span-6">商品</div>
            <div className="md:col-span-2 text-right">單價</div>
            <div className="md:col-span-2 text-right">數量</div>
            <div className="md:col-span-2 text-right">小計</div>
          </div>
          <div className="space-y-2">
            {(data.items || []).map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white/60 rounded px-2 py-3">
                <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                  {it.image && <img src={it.image} alt="" className="w-10 h-10 rounded object-cover" />}
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">{it.sku || ''}</div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">{money(it.price)}</div>
                <div className="col-span-4 md:col-span-2 text-right">x {it.qty}</div>
                <div className="col-span-4 md:col-span-2 text-right font-semibold">{money((it.price || 0) * (it.qty || 0))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'shipping' && (
        <div className="text-sm grid md:grid-cols-2 gap-4">
          {isOrder ? (
            <>
              <div className="glass rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">配送方式</div>
                <div className="font-medium">{data.shipping?.method === 'home' ? '宅配' : '超商取貨'}</div>
                {data.shipping?.method === 'home' ? (
                  <div className="text-gray-700 mt-2">
                    {data.shipping?.address?.postalCode} {data.shipping?.address?.city}{data.shipping?.address?.district}{data.shipping?.address?.streetAddress}
                  </div>
                ) : (
                  <div className="text-gray-700 mt-2">
                    {data.shipping?.store?.name}（{data.shipping?.store?.id}）- {data.shipping?.store?.address}
                  </div>
                )}
              </div>
              <div className="glass rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">物流資訊</div>
                <div>物流：{data.shipping?.carrier || '—'}</div>
                <div>追蹤：{data.shipping?.trackingNo || '—'}</div>
                <div>狀態：{data.status || '—'}</div>
              </div>
            </>
          ) : (
            <>
              <div className="glass rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">退貨方式</div>
                <div className="font-medium">{data.shippingReturn?.method === 'home' ? '宅配' : '超商寄件'}</div>
                {data.shippingReturn?.method === 'home' ? (
                  <div className="text-gray-700 mt-2">
                    {data.shippingReturn?.address?.postalCode || ''}
                  </div>
                ) : (
                  <div className="text-gray-700 mt-2">
                    {data.shippingReturn?.storeName || ''}（{data.shippingReturn?.storeId || ''}）
                  </div>
                )}
              </div>
              <div className="glass rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">物流資訊</div>
                <div>物流：{data.shippingReturn?.carrier || data.shippingReturn?.provider || '—'}</div>
                <div>追蹤：{data.shippingReturn?.trackingNo || '—'}</div>
                <div>狀態：{data.status || '—'}</div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'payment' && (
        <div className="text-sm space-y-3">
          <div className="glass rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{isOrder ? '付款方式' : '退款方式'}</div>
            <div>{data.payment?.method || '—'}（{data.payment?.status || '—'}）</div>
          </div>
          {isOrder ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">小計</div><div className="font-medium mt-1">{money(data.totals?.subtotal)}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">折扣</div><div className="font-medium mt-1">{money(data.totals?.discount)}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">運費</div><div className="font-medium mt-1">{money(data.totals?.shipping)}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">應付金額</div><div className="font-semibold mt-1">{money(data.totals?.grandTotal)}</div></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">退貨商品金額</div><div className="font-medium mt-1">{money(data.amounts?.subtotal)}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">退運費</div><div className="font-medium mt-1">{money(data.amounts?.shippingRefund)}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">退款總額</div><div className="font-semibold text-red-600 mt-1">{money(data.amounts?.totalRefund)}</div></div>
            </div>
          )}
        </div>
      )}

      {tab === 'invoice' && (
        <div className="text-sm grid md:grid-cols-2 gap-3">
          {isOrder ? (
            <>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">發票類型</div><div className="mt-1">{data.invoice?.type || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">發票號碼</div><div className="mt-1">{data.invoice?.number || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">載具</div><div className="mt-1">{data.invoice?.carrier || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">抬頭</div><div className="mt-1">{data.invoice?.title || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">開立日期</div><div className="mt-1">{data.invoice?.issuedAt || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">狀態</div><div className="mt-1">{data.invoice?.status || '—'}</div></div>
            </>
          ) : (
            <>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">類型</div><div className="mt-1">{data.invoice?.type || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">折讓單號</div><div className="mt-1">{data.invoice?.number || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">開立日期</div><div className="mt-1">{data.invoice?.issuedAt || '—'}</div></div>
              <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">狀態</div><div className="mt-1">{data.invoice?.status || '—'}</div></div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderRefundDetailTabs;
