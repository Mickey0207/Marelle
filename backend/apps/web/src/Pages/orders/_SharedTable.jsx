import React, { useEffect, useState } from 'react';
import { ADMIN_STYLES } from "../../Style/adminStyles";
import IconActionButton from "../../components/ui/IconActionButton";
import { EyeIcon, PencilIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function SharedPaymentTable({ endpoint }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => { load(); }, [endpoint, page]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${endpoint}?page=${page}&pageSize=${pageSize}`, { credentials: 'include' });
      if (!res.ok) throw new Error('load failed');
      const json = await res.json();
      const items = Array.isArray(json?.items) ? json.items : [];
      const mapped = items.map((r) => ({
        id: r.merchant_trade_no || r.id,
        amount: r.trade_amt ?? 0,
        createdAt: r.created_at || r.trade_date || '-',
        ecpay: {
          RtnCode: r.rtn_code ?? '',
          RtnMsg: r.rtn_msg ?? '',
          TradeNo: r.trade_no ?? '',
          PaymentDate: r.payment_date ?? '',
          PaymentType: r.payment_type ?? ''
        }
      }));
      setRows(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function formatPaymentMethod(order) {
    const pt = (order?.ecpay?.PaymentType || order?.paymentMethod || '').toString();
    const key = pt.toUpperCase();
    if (key.includes('CREDIT')) return '信用卡';
    if (key.includes('WEBATM')) return 'WebATM';
    if (key.includes('ATM')) return 'ATM 轉帳';
    if (key.includes('CVS')) return '超商代碼';
    if (!pt) return '-';
    return pt;
  }

  function PayStatusBadge({ order }) {
    const rtnCode = String(order?.ecpay?.RtnCode ?? '');
    const rtnMsg = (order?.ecpay?.RtnMsg || '').toString();
    const method = formatPaymentMethod(order);
    let label = '—';
    let className = 'bg-gray-100 text-gray-800';

    if (rtnCode === '1') {
      label = '已付款';
      className = 'bg-green-100 text-green-800';
    } else if (!rtnCode) {
      const unpaid = (method.includes('ATM') || method.includes('超商')) && !order?.ecpay?.PaymentDate;
      label = unpaid ? '待付款' : '處理中';
      className = unpaid ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
    } else {
      label = rtnMsg ? `失敗：${rtnMsg}` : '付款失敗';
      className = 'bg-red-100 text-red-800';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`} title={rtnMsg}>
        {label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className={`${ADMIN_STYLES.glassCard} p-6`}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ADMIN_STYLES.glassCard} overflow-hidden`}>
      <div className="" style={{overflowX: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        <style>{`div::-webkit-scrollbar{display:none;}`}</style>
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-200/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單編號</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">付款方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">總金額</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">付款狀態</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代碼</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">綠界交易編號</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">下單時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">付款時間</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60">
            {rows.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{order.id}</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{formatPaymentMethod(order)}</div></td>
                <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{Number(order.amount || 0).toLocaleString()}</div></td>
                <td className="px-6 py-4"><PayStatusBadge order={order} /></td>
                <td className="px-2 py-4"><div className="text-xs text-gray-700">{order?.ecpay?.RtnCode ?? '-'}</div></td>
                <td className="px-6 py-4"><div className="text-xs text-gray-900">{order?.ecpay?.TradeNo || '-'}</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{order.createdAt || '-'}</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{order?.ecpay?.PaymentDate || '-'}</div></td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-1">
                    <IconActionButton Icon={EyeIcon} label="檢視詳情" variant="blue" />
                    <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" />
                    <IconActionButton Icon={PrinterIcon} label="列印" variant="green" />
                    <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => alert('請改由後端 API 或 DB 處理刪除')} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
