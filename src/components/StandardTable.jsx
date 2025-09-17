import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';

const StandardTable = ({ 
  data = [], 
  columns = [], 
  title = "數據列表", 
  showExport = true,
  onExport = null,
  exportFileName = "數據列表",
  className = "",
  emptyIcon: EmptyIcon = null,
  emptyTitle = "沒有找到數據",
  emptyMessage = "",
  emptyDescription = "請調整搜尋條件或新增第一筆數據"
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 排序功能
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // 處理空值
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // 數字排序
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // 日期排序
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
      }

      // 字串排序
      const stringA = String(aValue).toLowerCase();
      const stringB = String(bValue).toLowerCase();
      
      if (stringA < stringB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (stringA > stringB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // 處理排序點擊
  const handleSort = (key, sortable = true) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }

    setSortConfig({ key: direction ? key : null, direction });
  };

  // 獲取排序圖示
  const getSortIcon = (key, sortable = true) => {
    if (!sortable) return null;

    if (sortConfig.key !== key) {
      return (
        <div className="flex flex-col ml-1 opacity-30">
          <ChevronUp className="w-3 h-3 -mb-1" />
          <ChevronDown className="w-3 h-3" />
        </div>
      );
    }

    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 ml-1 text-apricot-600" />;
    } else if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 ml-1 text-apricot-600" />;
    }

    return (
      <div className="flex flex-col ml-1 opacity-30">
        <ChevronUp className="w-3 h-3 -mb-1" />
        <ChevronDown className="w-3 h-3" />
      </div>
    );
  };

  // 默認導出功能
  const handleExport = () => {
    if (onExport) {
      onExport(sortedData);
      return;
    }

    // 默認CSV導出
    const headers = columns.map(col => col.label || col.title || col.key).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (value === null || value === undefined) return '';
        // 處理包含逗號的值
        const stringValue = String(value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`glass rounded-2xl overflow-visible ${className}`}>
      {/* 表格標題 */}
      <div className="overflow-x-auto overflow-y-visible">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">
              {title} ({sortedData.length})
            </h3>
            {showExport && (
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-chinese"
              >
                <Download className="w-4 h-4" />
                匯出
              </button>
            )}
          </div>
        </div>

        {/* 表格內容 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={column.key || index}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}`}
                    onClick={() => handleSort(column.key, column.sortable)}
                  >
                    <div className="flex items-center">
                      {column.label || column.title}
                      {getSortIcon(column.key, column.sortable)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td 
                      key={column.key || colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm font-chinese"
                    >
                      {column.render ? column.render(row[column.key], row, rowIndex) : (
                        <span className={column.className || "text-gray-900"}>
                          {row[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 空狀態 */}
        {sortedData.length === 0 && (
          <div className="text-center py-12">
            {EmptyIcon && <EmptyIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-chinese">
              {emptyMessage || emptyTitle}
            </h3>
            <p className="text-gray-500 font-chinese">{emptyDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardTable;