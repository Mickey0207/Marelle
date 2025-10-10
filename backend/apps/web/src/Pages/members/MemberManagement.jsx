import React, { useState, useMemo, useEffect } from 'react';
import { UsersIcon, EyeIcon, PencilIcon, ChatBubbleLeftIcon, CreditCardIcon, GiftIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from "../../components/ui/TabNavigation";
import StandardTable from "../../components/ui/StandardTable";
import membersDataManager from "../../../../external_mock/members/membersDataManager";
import memberOrdersDataManager from "../../../../external_mock/members/memberOrdersDataManager";
import OrderRefundDetailTabs from "../../components/members/OrderRefundDetailTabs";
import HomeAddressForm from "../../components/members/HomeAddressForm";
import CVSAddressForm from "../../components/members/CVSAddressForm";
import FiltersBar from "../../components/members/FiltersBar";
import OrdersList from "../../components/members/OrdersList";
import RefundsList from "../../components/members/RefundsList";
import HomeAddressList from "../../components/members/HomeAddressList";
import CVSAddressList from "../../components/members/CVSAddressList";
import { ADMIN_STYLES } from "../../Style/adminStyles";
import IconActionButton from "../../components/ui/IconActionButton";
import { useNavigate } from 'react-router-dom';

const empty = [];

const MemberManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const navigate = useNavigate();
  const [_showAddModal, _setShowAddModal] = useState(false);
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
    // 統一為專案的 chips 風格（圓角膠囊 + 一致色票）
    const clsMap = {
      VIP: 'bg-purple-100 text-purple-800',
      金卡: 'bg-yellow-100 text-yellow-800',
      銀卡: 'bg-gray-100 text-gray-800',
      一般: 'bg-blue-100 text-blue-800',
    };
    const colorCls = clsMap[level] || clsMap['一般'];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium font-chinese ${colorCls}`}>
        {level}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    // 與全站一致的狀態樣式
    const base = 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full font-chinese';
    if (status === 'active') {
      return <span className={`${base} bg-green-100 text-green-800`}>活動</span>;
    }
    return <span className={`${base} bg-red-100 text-red-800`}>休眠</span>;
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
      render: (value, _member) => {
        const tags = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-chinese">
                <TagIcon className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (value, member) => (
        <div className="flex items-center gap-2">
          <IconActionButton Icon={EyeIcon} label="查看詳情" variant="blue" onClick={() => setSelectedMember(member)} />
          <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => navigate(`/members/edit/${member.id}`)} />
          <IconActionButton Icon={ChatBubbleLeftIcon} label="溝通紀錄" variant="purple" />
          <IconActionButton Icon={CreditCardIcon} label="積分管理" variant="green" />
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
          <button className={`${ADMIN_STYLES.primaryButton} flex items-center`} onClick={() => _setShowAddModal(true)}>
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
            <div className="p-6 pt-0 space-y-4">
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
            <div className="p-6 pt-0">
              <OrderRefundDetailTabs detail={orderDetail} />
            </div>
          </GlassModal>
        )}
      </div>
    </div>
  );
};

export default MemberManagement;
