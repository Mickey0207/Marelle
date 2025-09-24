import React from 'react';
import { StarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import SearchableSelect from '../ui/SearchableSelect';

const FiltersBar = ({ selectedLevel, onChangeLevel, selectedStatus, onChangeStatus, total }) => {
  return (
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
            onChange={onChangeLevel}
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
            onChange={onChangeStatus}
            placeholder="選擇會員狀態"
            className="w-28"
          />
        </div>

        <div className="text-sm text-gray-500 font-chinese">共 {total} 位會員</div>
      </div>
    </div>
  );
};

export default FiltersBar;
