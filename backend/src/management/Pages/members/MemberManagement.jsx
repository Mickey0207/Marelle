import React, { useState, useMemo, useEffect } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  GiftIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import SearchableSelect from "../../components/ui/SearchableSelect";
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from "../../components/ui/TabNavigation";
import StandardTable from "../../components/ui/StandardTable";
import membersDataManager from "../../../lib/data/members/membersDataManager";
import memberOrdersDataManager from "../../../lib/data/members/memberOrdersDataManager";
import { TAIWAN_CITIES, getDistrictsByCity } from "../../../lib/data/members/taiwanDivisions";

const empty = [];

const MemberManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders' | 'home' | 'cvs'
  const [memberOrders, setMemberOrders] = useState([]);
  const [memberRefunds, setMemberRefunds] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null); // { type: 'order'|'refund', data: {...} }
  const [memberData, setMemberData] = useState(empty);
  const [newAddress, setNewAddress] = useState({
    type: 'home', // 'home' | 'cvs'
    contactName: '',
    phone: '',
    postalCode: '',
    city: '',
    district: '',
    streetAddress: '',
    provider: '7-ELEVEN',
    storeId: '',
    storeName: '',
    storeAddress: ''
  });

  useEffect(() => {
    const fetchMembers = async () => {
      const { success, data } = await membersDataManager.getMembers();
      if (success) setMemberData(data);
    };
    fetchMembers();
  }, []);

  // 當開啟會員詳情時，載入該會員的訂單
  useEffect(() => {
    const loadOrders = async () => {
      if (selectedMember?.id) {
        const { success, data } = await memberOrdersDataManager.getOrdersByMember(selectedMember.id);
        if (success) setMemberOrders(data);
        const r = await memberOrdersDataManager.getRefundsByMember(selectedMember.id);
        if (r.success) setMemberRefunds(r.data);
      } else {
        setMemberOrders([]);
        setMemberRefunds([]);
      }
    };
    loadOrders();
  }, [selectedMember]);

  const closeDetail = () => setOrderDetail(null);

  // 篩選資料
  const filteredData = useMemo(() => {
    let filtered = memberData.filter(member => {
      const matchLevel = selectedLevel === '全部' || member.level === selectedLevel;
      const matchStatus = selectedStatus === '全部' || member.status === selectedStatus;
      
      return matchLevel && matchStatus;
    });

    return filtered;
  }, [selectedLevel, selectedStatus, memberData]);

  // 城市/地區選項（供 SearchableSelect 使用）
  const cityOptions = useMemo(() => (TAIWAN_CITIES || []).map(c => ({ value: c, label: c })), []);
  const districtOptions = useMemo(
    () => newAddress.city ? getDistrictsByCity(newAddress.city).map(d => ({ value: d.name, label: d.name })) : [],
    [newAddress.city]
  );

  const providerOptions = useMemo(() => ([
    { value: '7-ELEVEN', label: '7-ELEVEN'},
    { value: 'FAMILY_MART', label: '全家'},
    { value: 'HI_LIFE', label: '萊爾富'},
    { value: 'OK_MART', label: 'OK超商'},
  ]), []);

  const getLevelBadge = (level) => {
    const levelConfig = {
      'VIP': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👑' },
      '金卡': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🥇' },
      '銀卡': { bg: 'bg-gray-100', text: 'text-gray-700', icon: '🥈' },
      '一般': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '✅' }
    };
    const config = levelConfig[level] || levelConfig['一般'];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        {config.icon} {level}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">活動</span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">休眠</span>
    );
  };

  // 定義表格欄位
  const columns = [
    {
      key: 'memberNo',
      label: '會員編號',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      label: '姓名',
      sortable: true,
      render: (value) => <span className="font-chinese font-medium">{value}</span>
    },
    {
      key: 'contact',
      label: '聯絡資料',
      sortable: false,
      render: (value, member) => (
        <div className="text-sm">
          <div>{member.email}</div>
          <div className="text-gray-500">{member.phone}</div>
        </div>
      )
    },
    {
      key: 'level',
      label: '會員等級',
      sortable: true,
      render: (value) => getLevelBadge(value)
    },
    {
      key: 'totalSpent',
      label: '消費金額',
      sortable: true,
      render: (value) => <span className="font-bold text-green-600">NT$ {value.toLocaleString()}</span>
    },
    {
      key: 'points',
      label: '積分',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <GiftIcon className="w-4 h-4 text-amber-500 mr-1" />
          {value}
        </div>
      )
    },
    {
      key: 'orders',
      label: '訂單數',
      sortable: true
    },
    {
      key: 'status',
      label: '狀態',
      sortable: false,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'tags',
      label: '標籤',
      sortable: false,
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-chinese">
              <TagIcon className="w-3 h-3 mr-1" />{tag}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (value, member) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-blue-600 hover:bg-blue-100 rounded" 
            title="查看詳情"
            onClick={() => setSelectedMember(member)}
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="編輯">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="溝通紀錄">
            <ChatBubbleLeftIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-amber-600 hover:bg-amber-100 rounded" title="積分管理">
            <CreditCardIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <UsersIcon className="w-8 h-8 text-amber-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">會員管理系統</h1>
        </div>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新增會員
        </button>
      </div>

      {/* 篩選控制 */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '全部', label: '全部等級' },
                { value: 'VIP', label: 'VIP' },
                { value: '金卡', label: '金卡' },
                { value: '銀卡', label: '銀卡' },
                { value: '一般', label: '一般' }
              ]}
              value={selectedLevel}
              onChange={setSelectedLevel}
              placeholder="選擇會員等級"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '全部', label: '全部狀態' },
                { value: 'active', label: '活動' },
                { value: 'inactive', label: '休眠' }
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="選擇會員狀態"
              className="w-28"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            共 {filteredData.length} 位會員
          </div>
        </div>
      </div>

      {/* 主要會員表格 */}
      <StandardTable
        data={filteredData}
        columns={columns}
        title="會員清單"
        emptyMessage="沒有找到符合條件的會員資料"
        exportFileName="會員清單"
      />

      {/* 統計資料 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">總會員數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{filteredData.filter(m => m.status === 'active').length}</div>
          <div className="text-sm text-gray-500 font-chinese">活動會員</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredData.filter(m => m.level === 'VIP').length}</div>
          <div className="text-sm text-gray-500 font-chinese">VIP會員</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            NT$ {filteredData.reduce((sum, m) => sum + m.totalSpent, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總消費金額</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData.reduce((sum, m) => sum + m.points, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總積分</div>
        </div>
      </div>

      {/* 會員詳情模態框 */}
      <GlassModal
        isOpen={!!selectedMember}
        onClose={() => { setOrderDetail(null); setSelectedMember(null); }}
        title="會員詳情"
        size="max-w-2xl"
      >
        {selectedMember && (
          <div className="p-6 space-y-4">
            {/* 子頁籤 */}
            <TabNavigation
              mode="controlled"
              activeKey={activeTab}
              onTabChange={(tab) => setActiveTab(tab.key)}
              layout="left"
              tabs={[
                { key: 'profile', label: '基本資料' },
                { key: 'orders', label: `訂單 (${memberOrders.length})` },
                { key: 'home', label: '宅配地址' },
                { key: 'cvs', label: '超商取貨地址' },
                { key: 'refunds', label: `退款 (${memberRefunds.length})` },
              ]}
            />

            {/* 內容區塊 */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">會員編號</label>
                    <div className="text-gray-900">{selectedMember.memberNo}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">姓名</label>
                    <div className="text-gray-900 font-chinese">{selectedMember.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Email</label>
                    <div className="text-gray-900">{selectedMember.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">電話</label>
                    <div className="text-gray-900">{selectedMember.phone}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">性別</label>
                    <div className="text-gray-900 font-chinese">{selectedMember.gender}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">生日</label>
                    <div className="text-gray-900">{selectedMember.birthday}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">註冊日期</label>
                    <div className="text-gray-900">{selectedMember.registerDate}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">最後登入</label>
                    <div className="text-gray-900">{selectedMember.lastLoginDate}</div>
                  </div>
                </div>

                <div className="border-t border-white/30 pt-6">
                  <h3 className="text-lg font-bold font-chinese mb-4">會員統計</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedMember.level}</div>
                      <div className="text-sm text-gray-500 font-chinese">會員等級</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">NT$ {selectedMember.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 font-chinese">總消費</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{selectedMember.points}</div>
                      <div className="text-sm text-gray-500 font-chinese">積分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedMember.orders}</div>
                      <div className="text-sm text-gray-500 font-chinese">訂單數</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/30 pt-6">
                  <h3 className="text-lg font-bold font-chinese mb-4">會員標籤</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 text-sm bg-blue-100/80 text-blue-700 rounded-full font-chinese backdrop-blur-sm">
                        <TagIcon className="w-4 h-4 mr-1" />{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-3">
                {memberOrders.length === 0 ? (
                  <div className="text-sm text-gray-500">尚無訂單</div>
                ) : (
                  memberOrders.map(order => (
                    <button
                      key={order.id}
                      className="w-full text-left glass rounded-xl p-4 hover:bg-white/60 transition"
                      onClick={() => setOrderDetail({ type: 'order', data: order })}
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="font-mono text-sm">{order.orderNo}</div>
                        <div className="text-sm text-gray-600">{order.createdAt}</div>
                        <div className="text-sm font-semibold">NT$ {order.totals.grandTotal.toLocaleString()}</div>
                        <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{order.status}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {activeTab === 'refunds' && (
              <div className="space-y-3">
                {memberRefunds.length === 0 ? (
                  <div className="text-sm text-gray-500">尚無退款紀錄</div>
                ) : (
                  memberRefunds.map(ref => (
                    <button
                      key={ref.id}
                      className="w-full text-left glass rounded-xl p-4 hover:bg-white/60 transition"
                      onClick={() => setOrderDetail({ type: 'refund', data: ref })}
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="font-mono text-sm">{ref.refundNo}</div>
                        <div className="text-sm text-gray-600">{ref.createdAt}</div>
                        <div className="text-sm font-semibold text-red-600">- NT$ {ref.amounts.totalRefund.toLocaleString()}</div>
                        <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{ref.status}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {activeTab === 'home' && (
              <div className="space-y-3">
                <div className="space-y-3">
                  {(selectedMember.shippingAddresses || []).filter(a=>a.type==='home').map(addr => (
                    <div key={addr.id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="text-sm">
                        <div className="font-chinese font-semibold">{addr.contactName}（{addr.phone}）{addr.isDefault && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">預設</span>}</div>
                        <div className="text-gray-600">{addr.postalCode} {addr.city}{addr.district}{addr.streetAddress}</div>
                      </div>
                      <div className="flex gap-2 mt-3 md:mt-0">
                        {!addr.isDefault && (
                          <button
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                            onClick={async () => {
                              await membersDataManager.setDefaultShippingAddress(selectedMember.id, addr.id);
                              const { data } = await membersDataManager.getMembers();
                              setMemberData(data);
                              setSelectedMember(data.find(m => m.id === selectedMember.id));
                            }}
                          >設為預設</button>
                        )}
                        <button
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                          onClick={async () => {
                            await membersDataManager.deleteShippingAddress(selectedMember.id, addr.id);
                            const { data } = await membersDataManager.getMembers();
                            setMemberData(data);
                            setSelectedMember(data.find(m => m.id === selectedMember.id));
                          }}
                        >刪除</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 新增宅配地址表單 */}
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" placeholder="收件人姓名" value={newAddress.contactName} onChange={e=>setNewAddress({...newAddress, contactName:e.target.value})} />
                    <input className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" placeholder="手機號碼" value={newAddress.phone} onChange={e=>setNewAddress({...newAddress, phone:e.target.value})} />
                    <input className="border rounded-lg px-3 py-2 text-sm bg-gray-50" placeholder="郵遞區號" value={newAddress.postalCode} readOnly />
                    <SearchableSelect
                      options={cityOptions}
                      value={newAddress.city}
                      onChange={(val) => {
                        const city = val || '';
                        setNewAddress({ ...newAddress, type: 'home', city, district: '', postalCode: '' });
                      }}
                      placeholder="選擇城市（直轄市/縣市）"
                      className="w-full"
                      allowClear
                      disabled={false}
                    />
                    <SearchableSelect
                      options={districtOptions}
                      value={newAddress.district}
                      onChange={(val) => {
                        const district = val || '';
                        const d = getDistrictsByCity(newAddress.city).find(x => x.name === district);
                        setNewAddress({ ...newAddress, type: 'home', district, postalCode: d ? d.zip : '' });
                      }}
                      placeholder="選擇地區（鄉鎮市區）"
                      className="w-full"
                      allowClear
                      disabled={!newAddress.city}
                    />
                    <input className="border rounded-lg px-3 py-2 text-sm md:col-span-2 focus:ring-2 focus:ring-amber-300 focus:border-amber-400" placeholder="街道與門牌" value={newAddress.streetAddress} onChange={e=>setNewAddress({...newAddress, streetAddress:e.target.value})} />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      className="px-4 py-2 bg-amber-600 text-white rounded"
                      onClick={async () => {
                        const payload = {
                          type: 'home',
                          contactName: newAddress.contactName,
                          phone: newAddress.phone,
                          postalCode: newAddress.postalCode,
                          city: newAddress.city,
                          district: newAddress.district,
                          streetAddress: newAddress.streetAddress,
                        };
                        await membersDataManager.addShippingAddress(selectedMember.id, payload);
                        const { data } = await membersDataManager.getMembers();
                        setMemberData(data);
                        const updated = data.find(m => m.id === selectedMember.id);
                        setSelectedMember(updated);
                        setNewAddress({ type:'home', contactName:'', phone:'', postalCode:'', city:'', district:'', streetAddress:'', provider:'7-ELEVEN', storeId:'', storeName:'', storeAddress:'' });
                      }}
                    >新增地址</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cvs' && (
              <div className="space-y-3">
                <div className="space-y-3">
                  {(selectedMember.shippingAddresses || []).filter(a=>a.type==='cvs').map(addr => (
                    <div key={addr.id} className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="text-sm">
                        <div className="font-chinese font-semibold">{addr.provider} 門市 {addr.isDefault && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">預設</span>}</div>
                        <div className="text-gray-600">{addr.storeName}（{addr.storeId}）- {addr.storeAddress}</div>
                      </div>
                      <div className="flex gap-2 mt-3 md:mt-0">
                        {!addr.isDefault && (
                          <button
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                            onClick={async () => {
                              await membersDataManager.setDefaultShippingAddress(selectedMember.id, addr.id);
                              const { data } = await membersDataManager.getMembers();
                              setMemberData(data);
                              setSelectedMember(data.find(m => m.id === selectedMember.id));
                            }}
                          >設為預設</button>
                        )}
                        <button
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                          onClick={async () => {
                            await membersDataManager.deleteShippingAddress(selectedMember.id, addr.id);
                            const { data } = await membersDataManager.getMembers();
                            setMemberData(data);
                            setSelectedMember(data.find(m => m.id === selectedMember.id));
                          }}
                        >刪除</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 新增超商地址表單 */}
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">超商</label>
                      <div className="flex-1">
                        <SearchableSelect
                          options={providerOptions}
                          value={newAddress.provider}
                          onChange={(val) => setNewAddress({ ...newAddress, type: 'cvs', provider: val })}
                          placeholder="選擇超商品牌"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <input className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" placeholder="門市代號" value={newAddress.storeId} onChange={e=>setNewAddress({...newAddress, type:'cvs', storeId:e.target.value})} />
                    <input className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" placeholder="門市名稱" value={newAddress.storeName} onChange={e=>setNewAddress({...newAddress, type:'cvs', storeName:e.target.value})} />
                    <input className="border rounded-lg px-3 py-2 text-sm md:col-span-2 focus:ring-2 focus:ring-amber-300 focus:border-amber-400" placeholder="門市地址" value={newAddress.storeAddress} onChange={e=>setNewAddress({...newAddress, type:'cvs', storeAddress:e.target.value})} />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      className="px-4 py-2 bg-amber-600 text-white rounded"
                      onClick={async () => {
                        const payload = {
                          type: 'cvs',
                          provider: newAddress.provider,
                          storeId: newAddress.storeId,
                          storeName: newAddress.storeName,
                          storeAddress: newAddress.storeAddress,
                        };
                        await membersDataManager.addShippingAddress(selectedMember.id, payload);
                        const { data } = await membersDataManager.getMembers();
                        setMemberData(data);
                        const updated = data.find(m => m.id === selectedMember.id);
                        setSelectedMember(updated);
                        setNewAddress({ type:'home', contactName:'', phone:'', postalCode:'', city:'', district:'', streetAddress:'', provider:'7-ELEVEN', storeId:'', storeName:'', storeAddress:'' });
                      }}
                    >新增地址</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassModal>

      {/* 訂單/退款 詳情 子模態窗 */}
      {orderDetail && (
        <GlassModal
          isOpen={!!orderDetail}
          onClose={closeDetail}
          title={orderDetail.type === 'order' ? `訂單詳情：${orderDetail.data.orderNo}` : `退款詳情：${orderDetail.data.refundNo}`}
          size="max-w-4xl"
        >
          <div className="p-4">
            <OrderRefundDetailTabs detail={orderDetail} />
          </div>
        </GlassModal>
      )}
    </div>
    </div>
  );
};

function OrderRefundDetailTabs({ detail }) {
  const [tab, setTab] = useState('items'); // items | shipping | payment | invoice
  const isOrder = detail.type === 'order';
  const data = detail.data;
  const money = (n) => `NT$ ${Number(n || 0).toLocaleString()}`;

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
}

export default MemberManagement;
