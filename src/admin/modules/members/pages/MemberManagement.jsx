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

// Ê®°Êì¨?ÉÂì°?∏Ê?
const mockMemberData = [
  {
    id: 1,
    memberNo: 'M000001',
    name: 'ÂºµÂ???,
    email: 'zhang@example.com',
    phone: '0912345678',
    gender: 'Â•?,
    birthday: '1990-05-15',
    registerDate: '2023-01-15',
    lastLoginDate: '2024-09-15',
    level: 'VIP',
    totalSpent: 15800,
    points: 1580,
    orders: 12,
    status: 'active',
    tags: ['È´òÂÉπ?ºÂÆ¢??, 'Âø†ÂØ¶?ÉÂì°']
  },
  {
    id: 2,
    memberNo: 'M000002',
    name: '?éÂ§ß??,
    email: 'li@example.com',
    phone: '0923456789',
    gender: '??,
    birthday: '1985-08-22',
    registerDate: '2023-03-20',
    lastLoginDate: '2024-09-14',
    level: '?ëÂç°',
    totalSpent: 8900,
    points: 890,
    orders: 7,
    status: 'active',
    tags: ['ÊΩõÂ?ÂÆ¢Êà∂']
  },
  {
    id: 3,
    memberNo: 'M000003',
    name: '?ãÁ?È∫?,
    email: 'wang@example.com',
    phone: '0934567890',
    gender: 'Â•?,
    birthday: '1992-12-03',
    registerDate: '2023-06-10',
    lastLoginDate: '2024-08-30',
    level: '?Ä??,
    totalSpent: 3200,
    points: 320,
    orders: 3,
    status: 'inactive',
    tags: ['?∞Ê???]
  },
  {
    id: 4,
    memberNo: 'M000004',
    name: '?≥Â???,
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
    tags: ['È´òÂÉπ?ºÂÆ¢??, '?®Ëñ¶?î‰∫∫']
  }
];

const MemberManagement = () => {
  const [selectedLevel, setSelectedLevel] = useState('?®ÈÉ®');
  const [selectedStatus, setSelectedStatus] = useState('?®ÈÉ®');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // ÁØ©ÈÅ∏?∏Ê?
  const filteredData = useMemo(() => {
    let filtered = mockMemberData.filter(member => {
      const matchLevel = selectedLevel === '?®ÈÉ®' || member.level === selectedLevel;
      const matchStatus = selectedStatus === '?®ÈÉ®' || member.status === selectedStatus;
      
      return matchLevel && matchStatus;
    });

    return filtered;
  }, [selectedLevel, selectedStatus]);

  const getLevelBadge = (level) => {
    const levelConfig = {
      'VIP': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '??' },
      '?ëÂç°': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '‚≠? },
      '?Ä??: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '??' },
      '‰∏Ä??: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '?ë§' }
    };
    const config = levelConfig[level] || levelConfig['‰∏Ä??];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${config.bg} ${config.text}`}>
        {config.icon} {level}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">Ê¥ªË?</span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">‰ºëÁ?</span>
    );
  };

  // ÂÆöÁæ©Ë°®Ê†º?óÈ?ÁΩ?
  const columns = [
    {
      key: 'memberNo',
      label: '?ÉÂì°Á∑®Ë?',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      label: 'ÂßìÂ?',
      sortable: true,
      render: (value) => <span className="font-chinese font-medium">{value}</span>
    },
    {
      key: 'contact',
      label: '?ØÁµ°Ë≥áË?',
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
      label: '?ÉÂì°Á≠âÁ?',
      sortable: true,
      render: (value) => getLevelBadge(value)
    },
    {
      key: 'totalSpent',
      label: 'Ê∂àË≤ª?ëÈ?',
      sortable: true,
      render: (value) => <span className="font-bold text-green-600">NT$ {value.toLocaleString()}</span>
    },
    {
      key: 'points',
      label: 'Á©çÂ?',
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
      label: 'Ë®ÇÂñÆ??,
      sortable: true
    },
    {
      key: 'status',
      label: '?Ä??,
      sortable: false,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'tags',
      label: 'Ê®ôÁ±§',
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
      label: '?ç‰?',
      sortable: false,
      render: (value, member) => (
        <div className="flex space-x-2">
          <button 
            className="p-1 text-blue-600 hover:bg-blue-100 rounded" 
            title="?•Á?Ë©≥Ê?"
            onClick={() => setSelectedMember(member)}
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Á∑®ËºØ">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="Ê∫ùÈÄöË???>
            <ChatBubbleLeftIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-amber-600 hover:bg-amber-100 rounded" title="Á©çÂ?ÁÆ°Á?">
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
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">?ÉÂì°ÁÆ°Á?Á≥ªÁµ±</h1>
        </div>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          ?∞Â??ÉÂì°
        </button>
      </div>

      {/* ÁØ©ÈÅ∏?Ä??*/}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?®ÈÉ®', label: '?®ÈÉ®Á≠âÁ?' },
                { value: 'VIP', label: 'VIP' },
                { value: '?ëÂç°', label: '?ëÂç°' },
                { value: '?Ä??, label: '?Ä?? },
                { value: '‰∏Ä??, label: '‰∏Ä?? }
              ]}
              value={selectedLevel}
              onChange={setSelectedLevel}
              placeholder="?∏Ê??ÉÂì°Á≠âÁ?"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?®ÈÉ®', label: '?®ÈÉ®?Ä?? },
                { value: 'active', label: 'Ê¥ªË?' },
                { value: 'inactive', label: '‰ºëÁ?' }
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="?∏Ê??ÉÂì°?Ä??
              className="w-28"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            ??{filteredData.length} ‰ΩçÊ???
          </div>
        </div>
      </div>

      {/* ‰∏ªË??ÉÂì°Ë°®Ê†º */}
      <StandardTable
        data={filteredData}
        columns={columns}
        title="?ÉÂì°Ê∏ÖÂñÆ"
        emptyMessage="Ê≤íÊ??æÂà∞Á¨¶Â?Ê¢ù‰ª∂?ÑÊ??°Ë???
        exportFileName="?ÉÂì°Ê∏ÖÂñÆ"
      />

      {/* Áµ±Ë??òË? */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÊ??°Êï∏</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{filteredData.filter(m => m.status === 'active').length}</div>
          <div className="text-sm text-gray-500 font-chinese">Ê¥ªË??ÉÂì°</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredData.filter(m => m.level === 'VIP').length}</div>
          <div className="text-sm text-gray-500 font-chinese">VIP?ÉÂì°</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            NT$ {filteredData.reduce((sum, m) => sum + m.totalSpent, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÊ?Ë≤ªÈ?È°?/div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData.reduce((sum, m) => sum + m.points, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÁ???/div>
        </div>
      </div>

      {/* ?ÉÂì°Ë©≥Ê?Ê®°Ê?Ê°?*/}
      <GlassModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="?ÉÂì°Ë©≥Ê?"
        size="max-w-2xl"
      >
        {selectedMember && (
          <div className="p-6 space-y-6">
            {/* ?∫Êú¨Ë≥áË? */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?ÉÂì°Á∑®Ë?</label>
                <div className="text-gray-900">{selectedMember.memberNo}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">ÂßìÂ?</label>
                <div className="text-gray-900 font-chinese">{selectedMember.name}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Email</label>
                <div className="text-gray-900">{selectedMember.email}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?ãÊ?</label>
                <div className="text-gray-900">{selectedMember.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?ßÂà•</label>
                <div className="text-gray-900 font-chinese">{selectedMember.gender}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?üÊó•</label>
                <div className="text-gray-900">{selectedMember.birthday}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Ë®ªÂ??•Ê?</label>
                <div className="text-gray-900">{selectedMember.registerDate}</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">?ÄÂæåÁôª??/label>
                <div className="text-gray-900">{selectedMember.lastLoginDate}</div>
              </div>
            </div>

            {/* ?ÉÂì°Áµ±Ë? */}
            <div className="border-t border-white/30 pt-6">
              <h3 className="text-lg font-bold font-chinese mb-4">?ÉÂì°Áµ±Ë?</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedMember.level}</div>
                  <div className="text-sm text-gray-500 font-chinese">?ÉÂì°Á≠âÁ?</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">NT$ {selectedMember.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 font-chinese">Á∏ΩÊ?Ë≤?/div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{selectedMember.points}</div>
                  <div className="text-sm text-gray-500 font-chinese">Á©çÂ?</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedMember.orders}</div>
                  <div className="text-sm text-gray-500 font-chinese">Ë®ÇÂñÆ??/div>
                </div>
              </div>
            </div>

            {/* ?ÉÂì°Ê®ôÁ±§ */}
            <div className="border-t border-white/30 pt-6">
              <h3 className="text-lg font-bold font-chinese mb-4">?ÉÂì°Ê®ôÁ±§</h3>
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
