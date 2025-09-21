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
import SearchableSelect from "../../../components/ui/SearchableSelect";
// import SearchableSelect from "../../components/ui/SearchableSelect";
import GlassModal from '../../../components/ui/GlassModal';
import StandardTable from "../../../components/ui/StandardTable";

// 模擬會員資料
const mockMemberData = [
  {
    id: 1,
    memberNo: 'M000001',
    name: '張雅婷',
    email: 'zhang@example.com',
    phone: '0912345678',
    gender: '女',
    birthday: '1990-05-15',
    registerDate: '2023-01-15',
    lastLoginDate: '2024-09-15',
    level: 'VIP',
    totalSpent: 15800,
    points: 1580,
    orders: 12,
    status: 'active',
    tags: ['高價值客戶', '忠實會員']
  },
  {
    id: 2,
    memberNo: 'M000002',
    name: '李大明',
    email: 'li@example.com',
    phone: '0923456789',
    gender: '男',
    birthday: '1985-08-22',
    registerDate: '2023-03-20',
    lastLoginDate: '2024-09-14',
    level: '金卡',
    totalSpent: 8900,
    points: 890,
    orders: 7,
    status: 'active',
    tags: ['潛力客戶']
  },
  {
    id: 3,
    memberNo: 'M000003',
    name: '王美華',
    email: 'wang@example.com',
    phone: '0934567890',
    gender: '女',
    birthday: '1992-12-03',
    registerDate: '2023-06-10',
    lastLoginDate: '2024-08-30',
    level: '銀卡',
    totalSpent: 3200,
    points: 320,
    orders: 3,
    status: 'inactive',
    tags: ['新會員']
  },
  {
    id: 4,
    memberNo: 'M000004',
    name: '陳志偉',
    email: 'chen@example.com',
    phone: '0945678901',
    gender: '男',
    birthday: '1988-04-18',
    registerDate: '2022-11-25',
    lastLoginDate: '2024-09-16',
    level: 'VIP',
    totalSpent: 25600,
    points: 2560,
    orders: 18,
    status: 'active',
    tags: ['高價值客戶', '推薦達人']
  }
];

const MemberManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // 篩選資料
  const filteredData = useMemo(() => {
    let filtered = mockMemberData.filter(member => {
      const matchLevel = selectedLevel === '全部' || member.level === selectedLevel;
      const matchStatus = selectedStatus === '全部' || member.status === selectedStatus;
      
      return matchLevel && matchStatus;
    });

    return filtered;
  }, [selectedLevel, selectedStatus]);

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
        onClose={() => setSelectedMember(null)}
        title="會員詳情"
        size="max-w-2xl"
      >
        {selectedMember && (
          <div className="p-6 space-y-6">
            {/* 基本資料 */}
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

            {/* 會員統計 */}
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

            {/* 會員標籤 */}
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
      </GlassModal>
    </div>
    </div>
  );
};

export default MemberManagement;
