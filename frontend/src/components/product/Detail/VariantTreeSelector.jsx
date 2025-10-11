import React, { useMemo, useState, useEffect } from 'react';

/**
 * @typedef {Object} VariantNode
 * @property {string} id
 * @property {string} label
 * @property {VariantNode[]=} children
 * @property {{ sku?: string, stock?: number, price?: number }=} payload
 */

/**
 * @param {Object} props
 * @param {VariantNode[]} props.data
 * @param {string[]} [props.labels]
 * @param {number} [props.maxDepth]
 * @param {(state: { path: VariantNode[], isComplete: boolean, leaf?: VariantNode }) => void} [props.onChange]
 * @param {(args: { level: number, options: VariantNode[], value?: string, onChange: (id: string) => void, disabled: boolean, label?: string }) => React.ReactNode} props.renderSelect
 * @param {string} [props.className]
 */
function VariantTreeSelector({
  data,
  labels,
  maxDepth = 5,
  onChange,
  renderSelect,
  className,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  // 計算每一層可選項目
  const levels = useMemo(() => {
    const result = [];
    let currentLevel = data;
    result.push(currentLevel);
    for (let lvl = 1; lvl < maxDepth; lvl++) {
      const prevSelected = currentLevel.find(n => n.id === selectedIds[lvl - 1]);
      const children = prevSelected?.children || [];
      if (!children.length) break;
      result.push(children);
      currentLevel = children;
    }
    return result;
  }, [data, selectedIds, maxDepth]);

  // 計算當前 path 與是否完成
  const selectionPath = useMemo(() => {
    const path = [];
    let currentLevel = data;
    for (let lvl = 0; lvl < selectedIds.length; lvl++) {
      const node = currentLevel.find(n => n.id === selectedIds[lvl]);
      if (!node) break;
      path.push(node);
      if (!node.children || node.children.length === 0) break;
      currentLevel = node.children;
    }
    return path;
  }, [data, selectedIds]);

  const leaf = selectionPath[selectionPath.length - 1];
  const isComplete = !!leaf && (!leaf.children || leaf.children.length === 0);

  useEffect(() => {
    onChange?.({ path: selectionPath, isComplete, leaf });
  }, [onChange, selectionPath, isComplete, leaf]);

  const handleChange = (level, id) => {
    const next = selectedIds.slice(0, level);
    next[level] = id;
    setSelectedIds(next);
  };

  return (
    <div className={className}>
      {levels.map((options, idx) => {
        const disabled = idx > 0 && !selectedIds[idx - 1];
        const value = selectedIds[idx];
        const label = labels?.[idx];
        return (
          <div key={idx} style={{ marginBottom: 8 }}>
            {renderSelect({
              level: idx,
              options,
              value,
              onChange: (id) => handleChange(idx, id),
              disabled,
              label,
            })}
          </div>
        );
      })}
    </div>
  );
}

export default VariantTreeSelector;
