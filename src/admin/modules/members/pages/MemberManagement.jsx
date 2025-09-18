import React, { useState, useMemo } from 'react';
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
import CustomSelect from "@shared/components/CustomSelect";
import SearchableSelect from "@shared/components/SearchableSelect";
import GlassModal from '../../components/GlassModal';
import StandardTable from "@shared/components/StandardTable";

// 模擬?�員?��?
const mockMemberData = [
  {
    id: 1,
    memberNo: 'M000001',
    name: '張�???,
    email: 'zhang@example.com',
    phone: '0912345678',
    gender: '�?,
    birthday: '1990-05-15',
    registerDate: '2023-01-15',
    lastLoginDate: '2024-09-15',
    level: 'VIP',
    totalSpent: 15800,
    points: 1580,
    orders: 12,
    status: 'active',
    tags: ['高價?�客??, '忠實?�員']
  },
  {
    id: 2,
    memberNo: 'M000002',
    name: '?�大??,
    email: 'li@example.com',
    phone: '0923456789',
    gender: '??,
    birthday: '1985-08-22',
    registerDate: '2023-03-20',
    lastLoginDate: '2024-09-14',
    level: '?�卡',
    totalSpent: 8900,
    points: 890,
    orders: 7,
    status: 'active',
    tags: ['潛�?客戶']
  },
  {
    id: 3,
    memberNo: 'M000003',
    name: '?��?�?,
    email: 'wang@example.com',
    phone: '0934567890',
    gender: '�?,
    birthday: '1992-12-03',
    registerDate: '2023-06-10',
    lastLoginDate: '2024-08-30',
    level: '?�??,
    totalSpent: 3200,
    points: 320,
    orders: 3,
    status: 'inactive',
    tags: ['?��???]
  },
  {
    id: 4,
    memberNo: 'M000004',
    name: '?��???,
    email: 'chen@example.com',
    phone: '0945678901',
    gender: '??,
    birthday: '1988-04-18',
    registerDate: '2022-11-25',
    lastLoginDate: '2024-09-16',
    level: 'VIP',
    totalSpent: 25600,
    points: 2560,
    orders: 18,
    status: 'active',
    tags: ['高價?�客??, '?�薦?�人']
  }
];

const MemberManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState('?�部');
  const [selectedStatus, setSelectedStatus] = useState('?�部');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // 篩選?��?
  const filteredData = useMemo(() => {
    let filtered = mockMemberData.filter(member => {
      const matchLevel = selectedLevel === '?�部' || member.level === selectedLevel;
      const matchStatus = selectedStatus === '?�部' || member.status === selectedStatus;
      
      return matchLevel && matchStatus;
    });

    return filtered;
  }, [selectedLevel, selectedStatus]);

  const getLevelBadge = (level) => {
    const levelConfig = {
      'VIP': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '??' },
      '?�卡': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '�? },
      '?�??: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '??' },
      '一??: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '?��' }
    };
    const config = levelConfig[level] || levelConfig['一??];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        {config.icon} {level}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">活�?</span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">休�?</span>
    );
  };

  // 定義表格?��?�?
  const columns = [
    {
      key: 'memberNo',
      label: '?�員編�?',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      label: '姓�?',
      sortable: true,
      render: (value) => <span className="font-chinese font-medium">{value}</span>
    },
    {
      key: 'contact',
      label: '?�絡資�?',
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
      label: '?�員等�?',
      sortable: true,
      render: (value) => getLevelBadge(value)
    },
    {
      key: 'totalSpent',
      label: '消費?��?',
      sortable: true,
      render: (value) => <span className="font-bold text-green-600">NT$ {value.toLocaleString()}</span>
    },
    {
      key: 'points',
      label: '積�?',
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
      label: '訂單??,
      sortable: true
    },
    {
      key: 'status',
      label: '?�??,
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
      label: '?��?',
      sortable: false,
      render: (value, member) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-blue-600 hover:bg-blue-100 rounded" 
            title="?��?詳�?"
            onClick={() => setSelectedMember(member)}
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="編輯">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="溝通�???>
            <ChatBubbleLeftIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-amber-600 hover:bg-amber-100 rounded" title="積�?管�?">
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
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">?�員管�?系統</h1>
        </div>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          ?��??�員
        </button>
      </div>

      {/* 篩選?�??*/}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?�部', label: '?�部等�?' },
                { value: 'VIP', label: 'VIP' },
                { value: '?�卡', label: '?�卡' },
                { value: '?�??, label: '?�?? },
                { value: '一??, label: '一?? }
              ]}
              value={selectedLevel}
              onChange={setSelectedLevel}
              placeholder="?��??�員等�?"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?�部', label: '?�部?�?? },
                { value: 'active', label: '活�?' },
                { value: 'inactive', label: '休�?' }
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="?��??�員?�??
              className="w-28"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            ??{filteredData.length} 位�???
          </div>
        </div>
      </div>

      {/* 主�??�員表格 */}
      <StandardTable
        data={filteredData}
        columns={columns}
        title="?�員清單"
        emptyMessage="沒�??�到符�?條件?��??��???
        exportFileName="?�員清單"
      />

      {/* 統�??��? */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">總�??�數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{filteredData.filter(m => m.status === 'active').length}</div>
          <div className="text-sm text-gray-500 font-chinese">活�??�員</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredData.filter(m => m.level === 'VIP').length}</div>
          <div className="text-sm text-gray-500 font-chinese">VIP?�員</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            NT$ {filteredData.reduce((sum, m) => sum + m.totalSpent, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總�?費�?�?/div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData.reduce((sum, m) => sum + m.points, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總�???/div>
        </div>
      </div>

      {/* ?�員詳�?模�?�?*/}
      <GlassModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="?�員詳�?"
        size="max-w-2xl"
      >
        {selectedMember && (
          <div className="p-6 space-y-6">
            {/* ?�本資�? */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?�員編�?</label>
                <div className="text-gray-900">{selectedMember.memberNo}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">姓�?</label>
                <div className="text-gray-900 font-chinese">{selectedMember.name}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Email</label>
                <div className="text-gray-900">{selectedMember.email}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?��?</label>
                <div className="text-gray-900">{selectedMember.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?�別</label>
                <div className="text-gray-900 font-chinese">{selectedMember.gender}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?�日</label>
                <div className="text-gray-900">{selectedMember.birthday}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">註�??��?</label>
                <div className="text-gray-900">{selectedMember.registerDate}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?�後登??/label>
                <div className="text-gray-900">{selectedMember.lastLoginDate}</div>
              </div>
            </div>

            {/* ?�員統�? */}
            <div className="border-t border-white/30 pt-6">
              <h3 className="text-lg font-bold font-chinese mb-4">?�員統�?</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedMember.level}</div>
                  <div className="text-sm text-gray-500 font-chinese">?�員等�?</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">NT$ {selectedMember.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 font-chinese">總�?�?/div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{selectedMember.points}</div>
                  <div className="text-sm text-gray-500 font-chinese">積�?</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedMember.orders}</div>
                  <div className="text-sm text-gray-500 font-chinese">訂單??/div>
                </div>
              </div>
            </div>

            {/* ?�員標籤 */}
            <div className="border-t border-white/30 pt-6">
              <h3 className="text-lg font-bold font-chinese mb-4">?�員標籤</h3>
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
      </GlassModal>
    </div>
    </div>
  );
};

export default MemberManagement;
