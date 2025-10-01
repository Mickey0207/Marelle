import React, { useMemo, useState, useEffect, useCallback } from 'react';
import SearchableSelect from './SearchableSelect';

// 簡易級聯選單（最多 5 層）
// props:
// - tree: 類別樹（PRODUCT_CATEGORIES）
// - value: 選中的分類 id（可為 null）
// - onChange: (id|null) => void
// - placeholder: string
const CategoryCascader = ({ tree = [], value = null, onChange, placeholder = '選擇分類' }) => {
  // 將 value 映射成層級路徑
  const findPathById = useCallback((nodes, id, path = []) => {
    for (const n of nodes) {
      const nextPath = [...path, n];
      if (n.id === id) return nextPath;
      if (n.children?.length) {
        const found = findPathById(n.children, id, nextPath);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const initialPath = useMemo(() => (value ? findPathById(tree, value) : []), [tree, value, findPathById]);
  const [path, setPath] = useState(initialPath || []);

  useEffect(() => {
    // 外部 value 變更時，同步路徑
    const p = value ? findPathById(tree, value) : [];
    setPath(p || []);
  }, [value, tree, findPathById]);

  // 當前每一層的 options
  const levelOptions = useMemo(() => {
    const opts = [];
    // level 1
    opts.push(tree.map(n => ({ value: n.id, label: n.name, node: n })));
    // 之後層級根據前一層選擇
    for (let i = 1; i < 5; i++) {
      const prev = path[i - 1];
      const children = prev?.children || [];
      if (children.length) {
        opts.push(children.map(n => ({ value: n.id, label: n.name, node: n })));
      } else {
        break;
      }
    }
    return opts;
  }, [tree, path]);

  const handleSelectAtLevel = (levelIdx, id) => {
    if (!id) {
      // 先用目前的 path 推算上一層 id，再更新狀態
      const prevId = levelIdx === 0 ? null : (path[levelIdx - 1]?.id || null);
      setPath(prev => prev.slice(0, levelIdx));
      if (onChange) onChange(prevId);
      return;
    }
    const opts = levelOptions[levelIdx] || [];
    const node = opts.find(o => o.value === id)?.node;
    if (!node) return;
    const newPath = [...path.slice(0, levelIdx), node];
    setPath(newPath);
    if (onChange) onChange(node.id);
  };

  const clearAll = () => {
    setPath([]);
    if (onChange) onChange(null);
  };

  return (
    <div className="flex items-center space-x-2">
      {levelOptions.map((opts, idx) => (
        <SearchableSelect
          key={idx}
          options={[{ value: '', label: idx === 0 ? '全部' : '無' }, ...opts.map(o => ({ value: o.value, label: o.label }))]}
          value={path[idx]?.id || ''}
          onChange={(val) => handleSelectAtLevel(idx, val)}
          placeholder={idx === 0 ? placeholder : '選擇子分類'}
          className="w-40"
        />
      ))}
      <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded" onClick={clearAll}>清除</button>
    </div>
  );
};

export default CategoryCascader;
