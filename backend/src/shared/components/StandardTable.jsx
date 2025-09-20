import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';

const StandardTable = ({ 
  data = [], 
  columns = [], 
  title = "?∏Ê??óË°®", 
  showExport = true,
  onExport = null,
  exportFileName = "?∏Ê??óË°®",
  className = "",
  emptyIcon: EmptyIcon = null,
  emptyTitle = "Ê≤íÊ??æÂà∞?∏Ê?",
  emptyMessage = "",
  emptyDescription = "Ë´ãË™ø?¥Ê?Â∞ãÊ?‰ª∂Ê??∞Â?Á¨¨‰?Á≠ÜÊï∏??,
  // ?πÈ??∏Ê??∏È?props
  enableBatchSelection = false,
  selectedItems = [],
  onSelectedItemsChange = null,
  batchActions = [],
  getRowId = (item, index) => item.id || index
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // ?íÂ??üËÉΩ
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // ?ïÁ?Á©∫ÂÄ?
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // ?∏Â??íÂ?
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // ?•Ê??íÂ?
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
      }

      // Â≠ó‰∏≤?íÂ?
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

  // ?πÈ??∏Ê??üËÉΩ
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

  // ?ïÁ??íÂ?ÈªûÊ?
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

  // ?≤Â??íÂ??ñÁ§∫
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

  // ÈªòË?Â∞éÂá∫?üËÉΩ
  const handleExport = () => {
    if (onExport) {
      onExport(sortedData);
      return;
    }

    // ÈªòË?CSVÂ∞éÂá∫
    const headers = columns.map(col => col.label || col.title || col.key).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (value === null || value === undefined) return '';
        // ?ïÁ??ÖÂê´?óË??ÑÂÄ?
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
      {/* Ë°®Ê†ºÊ®ôÈ? */}
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
                ?ØÂá∫
              </button>
            )}
          </div>
        </div>

        {/* ?πÈ??ç‰?Â∑•ÂÖ∑Ê¨?*/}
        {enableBatchSelection && selectedItems.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-chinese">
                Â∑≤ÈÅ∏??{selectedItems.length} ??
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

        {/* Ë°®Ê†º?ßÂÆπ */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
                
                return (
                  <tr key={rowId} className="hover:bg-gray-50">
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Á©∫Á???*/}
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
