import React from 'react';

const CVSAddressList = ({ addresses, memberId, refreshAfter, dataManager }) => {
  const list = (addresses || []).filter(a => a.type === 'cvs');

  if (list.length === 0) {
    return <div className="text-sm text-gray-500">尚無超商取貨地址</div>;
  }

  return (
    <div className="space-y-3">
      {list.map(addr => (
        <div key={addr.id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-sm">
            <div className="font-chinese font-semibold">
              {addr.provider} 門市
              {addr.isDefault && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">預設</span>}
            </div>
            <div className="text-gray-600">{addr.storeName}（{addr.storeId}）- {addr.storeAddress}</div>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            {!addr.isDefault && (
              <button
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                onClick={async () => {
                  await dataManager.setDefaultShippingAddress(memberId, addr.id);
                  await refreshAfter();
                }}
              >設為預設</button>
            )}
            <button
              className="px-3 py-1 text-xs bg-red-600 text-white rounded"
              onClick={async () => {
                await dataManager.deleteShippingAddress(memberId, addr.id);
                await refreshAfter();
              }}
            >刪除</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CVSAddressList;
