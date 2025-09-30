import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronRight, Download } from 'lucide-react';

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
  emptyDescription = "請調整搜尋條件或新增第一筆數據",
  // 批量選擇相關props
  enableBatchSelection = false,
  selectedItems = [],
  onSelectedItemsChange = null,
  batchActions = [],
  getRowId = (item, index) => item.id || index,
  // 子表格相關 props（可選）
  enableRowExpansion = false,
  getSubRows = null, // (row) => []
  subColumns = [],
  renderSubtableHeader = null, // (row) => ReactNode（子表格上方自定義抬頭，可選）
  subtableClassName = ""
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set()); // Set of rowIds
  const [subSortConfigs, setSubSortConfigs] = useState({}); // { [rowId]: { key, direction } }

  // 通用排序函式（供主表與子表使用）
  const sortData = (arr, cfg) => {
    if (!cfg || !cfg.key) return arr;
    const { key, direction } = cfg;
    return [...arr].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // 處理空值
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // 數字排序
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // 日期排序（嘗試將字串轉日期）
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
      }

      // 字串排序
      const stringA = String(aValue).toLowerCase();
      const stringB = String(bValue).toLowerCase();
      if (stringA < stringB) return direction === 'asc' ? -1 : 1;
      if (stringA > stringB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // 主表排序
  const sortedData = useMemo(() => sortData(data, sortConfig), [data, sortConfig]);

  // 批量選擇功能
  const handleSelectAll = (checked) => {
    if (!onSelectedItemsChange) return;
    
    if (checked) {
      const allIds = sortedData.map((item, index) => getRowId(item, index));
      onSelectedItemsChange(allIds);
    } else {
      onSelectedItemsChange([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (!onSelectedItemsChange) return;
    
    const newSelected = checked 
      ? [...selectedItems, itemId]
      : selectedItems.filter(id => id !== itemId);
    
    onSelectedItemsChange(newSelected);
  };

  const isAllSelected = enableBatchSelection && 
    sortedData.length > 0 && 
    selectedItems.length === sortedData.length;
  
  const isIndeterminate = enableBatchSelection && 
    selectedItems.length > 0 && 
    selectedItems.length < sortedData.length;

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

  // 子表格排序處理（每一列獨立）
  const handleSubSort = (rowId, key, sortable = true) => {
    if (!sortable) return;
    setSubSortConfigs(prev => {
      const current = prev[rowId] || { key: null, direction: 'asc' };
      let direction = 'asc';
      if (current.key === key && current.direction === 'asc') direction = 'desc';
      else if (current.key === key && current.direction === 'desc') direction = null;
      return { ...prev, [rowId]: { key: direction ? key : null, direction } };
    });
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

  const getSubSortIcon = (rowId, key, sortable = true) => {
    if (!sortable) return null;
    const cfg = subSortConfigs[rowId] || { key: null, direction: 'asc' };
    if (cfg.key !== key) {
      return (
        <div className="flex flex-col ml-1 opacity-30">
          <ChevronUp className="w-3 h-3 -mb-1" />
          <ChevronDown className="w-3 h-3" />
        </div>
      );
    }
    if (cfg.direction === 'asc') return <ChevronUp className="w-4 h-4 ml-1 text-apricot-600" />;
    if (cfg.direction === 'desc') return <ChevronDown className="w-4 h-4 ml-1 text-apricot-600" />;
    return (
      <div className="flex flex-col ml-1 opacity-30">
        <ChevronUp className="w-3 h-3 -mb-1" />
        <ChevronDown className="w-3 h-3" />
      </div>
    );
  };

  // 切換展開/收合
  const toggleExpand = (rowId) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId); else next.add(rowId);
      return next;
    });
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

        {/* 批量操作工具欄 */}
        {enableBatchSelection && selectedItems.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-chinese">
                已選擇 {selectedItems.length} 項
              </span>
              <div className="flex items-center gap-2">
                {batchActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => action.onClick(selectedItems)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors font-chinese ${
                      action.variant === 'danger' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {action.icon && <action.icon className="w-4 h-4 mr-1 inline" />}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 表格內容 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {enableRowExpansion && (
                  <th className="px-3 py-3 text-left w-8"></th>
                )}
                {enableBatchSelection && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={checkbox => {
                        if (checkbox) checkbox.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-apricot-600 focus:ring-apricot-500"
                    />
                  </th>
                )}
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
              {sortedData.map((row, rowIndex) => {
                const rowId = getRowId(row, rowIndex);
                const isSelected = selectedItems.includes(rowId);
                const subRows = enableRowExpansion && typeof getSubRows === 'function' ? (getSubRows(row) || []) : [];
                const isExpandable = enableRowExpansion && subRows.length > 0;
                const isExpanded = isExpandable && expandedRows.has(rowId);
                
                return (
                  <React.Fragment key={rowId}>
                    <tr className="hover:bg-gray-50">
                      {enableRowExpansion && (
                        <td className="px-3 py-4 whitespace-nowrap align-top">
                          {isExpandable ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(rowId)}
                              className="p-1 rounded hover:bg-gray-100 transition-colors"
                              aria-label={isExpanded ? '收合' : '展開'}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          ) : null}
                        </td>
                      )}
                      {enableBatchSelection && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectItem(rowId, e.target.checked)}
                            className="rounded border-gray-300 text-apricot-600 focus:ring-apricot-500"
                          />
                        </td>
                      )}
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

                    {/* 子表格區塊 */}
                    {isExpanded && (
                      <tr>
                        <td
                          className="px-0 py-0 bg-gray-50"
                          colSpan={columns.length + (enableBatchSelection ? 1 : 0) + (enableRowExpansion ? 1 : 0)}
                        >
                          <div className={`p-4 border-t border-gray-200 ${subtableClassName}`}>
                            {typeof renderSubtableHeader === 'function' && (
                              <div className="mb-3">{renderSubtableHeader(row)}</div>
                            )}

                            {/* 子表格（有獨立排序） */}
                            {subRows && subRows.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      {subColumns && subColumns.length > 0 ? (
                                        subColumns.map((col, idx) => (
                                          <th
                                            key={col.key || idx}
                                            className={`px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider font-chinese ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-200 select-none' : ''}`}
                                            onClick={() => handleSubSort(rowId, col.key, col.sortable)}
                                          >
                                            <div className="flex items-center">
                                              {col.label || col.title}
                                              {getSubSortIcon(rowId, col.key, col.sortable)}
                                            </div>
                                          </th>
                                        ))
                                      ) : (
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">子表格</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {sortData(subRows, subSortConfigs[rowId]).map((child, childIdx) => (
                                      <tr key={child.id || childIdx} className="hover:bg-gray-50">
                                        {(subColumns && subColumns.length > 0) ? (
                                          subColumns.map((col, cidx) => (
                                            <td key={col.key || cidx} className="px-4 py-2 text-sm font-chinese">
                                              {col.render ? col.render(child[col.key], child, childIdx, row) : (
                                                <span className={col.className || 'text-gray-900'}>{child[col.key]}</span>
                                              )}
                                            </td>
                                          ))
                                        ) : (
                                          <td className="px-4 py-2 text-sm text-gray-700">未提供子表格欄位設定</td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">沒有可顯示的子項目</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
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