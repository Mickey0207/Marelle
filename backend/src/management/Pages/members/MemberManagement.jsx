import React, { useState, useMemo, useEffect } from 'react';
import { UsersIcon, EyeIcon, PencilIcon, ChatBubbleLeftIcon, CreditCardIcon, GiftIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from "../../components/ui/TabNavigation";
import StandardTable from "../../components/ui/StandardTable";
import membersDataManager from "../../../lib/data/members/membersDataManager";
import memberOrdersDataManager from "../../../lib/data/members/memberOrdersDataManager";
import OrderRefundDetailTabs from "../../components/members/OrderRefundDetailTabs";
import HomeAddressForm from "../../components/members/HomeAddressForm";
import CVSAddressForm from "../../components/members/CVSAddressForm";
import FiltersBar from "../../components/members/FiltersBar";
import OrdersList from "../../components/members/OrdersList";
import RefundsList from "../../components/members/RefundsList";
import HomeAddressList from "../../components/members/HomeAddressList";
import CVSAddressList from "../../components/members/CVSAddressList";

const empty = [];

const MemberManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders' | 'home' | 'cvs' | 'refunds'
  const [memberOrders, setMemberOrders] = useState([]);
  const [memberRefunds, setMemberRefunds] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null); // { type: 'order'|'refund', data: {...} }
  const [memberData, setMemberData] = useState(empty);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
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

  const filteredData = useMemo(() => {
    let filtered = memberData.filter(member => {
      const matchLevel = selectedLevel === '全部' || member.level === selectedLevel;
      const matchStatus = selectedStatus === '全部' || member.status === selectedStatus;
      return matchLevel && matchStatus;
    });
    return filtered;
  }, [selectedLevel, selectedStatus, memberData]);

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
      render: (value) => <span className="font-bold text-green-600">NT$ {Number(value || 0).toLocaleString()}</span>
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
      render: (value = []) => (
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
          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="查看詳情" onClick={() => setSelectedMember(member)}>
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
  <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">會員管理系統</h1>
          </div>
          <button className="btn btn-primary flex items-center" onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            新增會員
          </button>
        </div>

        <FiltersBar
          selectedLevel={selectedLevel}
          onChangeLevel={setSelectedLevel}
          selectedStatus={selectedStatus}
          onChangeStatus={setSelectedStatus}
          total={filteredData.length}
        />

        <StandardTable
          data={filteredData}
          columns={columns}
          title="會員清單"
          emptyMessage="沒有找到符合條件的會員資料"
          exportFileName="會員清單"
        />

        <GlassModal
          isOpen={!!selectedMember}
          onClose={() => {
            setOrderDetail(null);
            setSelectedMember(null);
          }}
          title="會員詳情"
          size="max-w-2xl"
        >
          {selectedMember && (
            <div className="p-6 space-y-4">
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
                    <h3 className="text-lg font-bold font-chinese mb-4">會員標籤</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedMember.tags || []).map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 text-sm bg-blue-100/80 text-blue-700 rounded-full font-chinese backdrop-blur-sm">
                          <TagIcon className="w-4 h-4 mr-1" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <OrdersList orders={memberOrders} onOpen={setOrderDetail} />
              )}

              {activeTab === 'refunds' && (
                <RefundsList refunds={memberRefunds} onOpen={setOrderDetail} />
              )}

              {activeTab === 'home' && (
                <div className="space-y-3">
                  <HomeAddressList
                    addresses={selectedMember.shippingAddresses}
                    memberId={selectedMember.id}
                    dataManager={membersDataManager}
                    refreshAfter={async () => {
                      const { data } = await membersDataManager.getMembers();
                      setMemberData(data);
                      setSelectedMember(data.find((m) => m.id === selectedMember.id));
                    }}
                  />

                  <div className="mt-2">
                    <HomeAddressForm
                      newAddress={newAddress}
                      setNewAddress={setNewAddress}
                      onSave={async () => {
                        const payload = {
                          type: 'home',
                          contactName: newAddress.contactName,
                          phone: newAddress.phone,
                          postalCode: newAddress.postalCode,
                          city: newAddress.city,
                          district: newAddress.district,
                          streetAddress: newAddress.streetAddress,
                          isDefault: !!newAddress.isDefault,
                        };
                        await membersDataManager.addShippingAddress(selectedMember.id, payload);
                        const { data } = await membersDataManager.getMembers();
                        setMemberData(data);
                        const updated = data.find((m) => m.id === selectedMember.id);
                        setSelectedMember(updated);
                        setNewAddress({
                          type: 'home',
                          contactName: '',
                          phone: '',
                          postalCode: '',
                          city: '',
                          district: '',
                          streetAddress: '',
                          provider: '7-ELEVEN',
                          storeId: '',
                          storeName: '',
                          storeAddress: '',
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'cvs' && (
                <div className="space-y-3">
                  <CVSAddressList
                    addresses={selectedMember.shippingAddresses}
                    memberId={selectedMember.id}
                    dataManager={membersDataManager}
                    refreshAfter={async () => {
                      const { data } = await membersDataManager.getMembers();
                      setMemberData(data);
                      setSelectedMember(data.find((m) => m.id === selectedMember.id));
                    }}
                  />

                  <div className="mt-2">
                    <CVSAddressForm
                      newAddress={newAddress}
                      setNewAddress={setNewAddress}
                      onSave={async () => {
                        const payload = {
                          type: 'cvs',
                          provider: newAddress.provider,
                          storeId: newAddress.storeId,
                          storeName: newAddress.storeName,
                          storeAddress: newAddress.storeAddress,
                          isDefault: !!newAddress.isDefault,
                        };
                        await membersDataManager.addShippingAddress(selectedMember.id, payload);
                        const { data } = await membersDataManager.getMembers();
                        setMemberData(data);
                        const updated = data.find((m) => m.id === selectedMember.id);
                        setSelectedMember(updated);
                        setNewAddress({
                          type: 'home',
                          contactName: '',
                          phone: '',
                          postalCode: '',
                          city: '',
                          district: '',
                          streetAddress: '',
                          provider: '7-ELEVEN',
                          storeId: '',
                          storeName: '',
                          storeAddress: '',
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassModal>

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

export default MemberManagement;
