import React, { useMemo, useState, useEffect } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import coaManager from '../../../../external_mock/accounting/chartOfAccountsManager';

export default function BalanceSheet() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // 直接讀取科目清單（mock 為同步）
    setAccounts(coaManager.listAccounts());
  }, []);

  const assetList = useMemo(() => accounts.filter(a => a.type === '資產' && a.active !== false), [accounts]);
  const liabilityList = useMemo(() => accounts.filter(a => a.type === '負債' && a.active !== false), [accounts]);

  // 將資產與負債對齊成單一表格的左右兩欄
  const rows = useMemo(() => {
    const mockBalances = {
      // 資產
      '1101': 300000, // 現金
      '1121': 120000, // 應收帳款
      '1141': 80000,  // 存貨
      // 負債
      '2101': 90000,  // 應付帳款
      // 其他未列於此者預設 0
    };
    const fmt = (n) => new Intl.NumberFormat('zh-TW').format(Number(n || 0));
    const withAmount = (a) => a ? ({ code: a.code, name: a.name, amount: Number(mockBalances[a.code] ?? 0), fmt }) : null;
    const max = Math.max(assetList.length, liabilityList.length);
    const data = [];
    for (let i = 0; i < max; i++) {
      const asset = withAmount(assetList[i]);
      const liability = withAmount(liabilityList[i]);
      data.push({ asset, liability });
    }
    return data;
  }, [assetList, liabilityList]);

  const columns = useMemo(() => ([
    { key: 'asset', label: '資產', sortable: false, render: (v) => v ? (
      <div className="flex items-center justify-between w-full">
        <span className="truncate"><span className="font-mono text-sm mr-2">{v.code}</span>{v.name}</span>
        <span className="tabular-nums text-right whitespace-nowrap">NT${v.fmt(v.amount)}</span>
      </div>
    ) : '' },
    { key: 'liability', label: '負債', sortable: false, render: (v) => v ? (
      <div className="flex items-center justify-between w-full">
        <span className="truncate"><span className="font-mono text-sm mr-2">{v.code}</span>{v.name}</span>
        <span className="tabular-nums text-right whitespace-nowrap">NT${v.fmt(v.amount)}</span>
      </div>
    ) : '' },
  ]), []);

  const totals = useMemo(() => {
    const sum = (list) => list.reduce((acc, a) => acc + (a?.amount || 0), 0);
    const assetAmounts = rows.map(r => r.asset).filter(Boolean);
    const liabilityAmounts = rows.map(r => r.liability).filter(Boolean);
    const fmt = (n) => new Intl.NumberFormat('zh-TW').format(Number(n || 0));
    return { asset: fmt(sum(assetAmounts)), liability: fmt(sum(liabilityAmounts)) };
  }, [rows]);

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <h1 className="text-3xl font-bold text-gray-800 font-chinese mb-6">資產負債表</h1>
        <div className="glass rounded-2xl p-6">
          <StandardTable
            title="資產 / 負債"
            data={rows}
            columns={columns}
            exportFileName="資產負債表"
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between px-3 py-2 bg-white/60 rounded-lg border border-gray-100">
              <span className="text-gray-700">資產合計</span>
              <span className="font-semibold tabular-nums">NT${totals.asset}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-white/60 rounded-lg border border-gray-100">
              <span className="text-gray-700">負債合計</span>
              <span className="font-semibold tabular-nums">NT${totals.liability}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
