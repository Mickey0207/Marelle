import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  TagIcon,
  CubeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
  ArrowRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../../adminStyles';
import QRCodeGenerator from '../../components/ui/QRCodeGenerator';
import ImageUpload from './ImageUpload';

const NestedSKUManager = ({ baseSKU, skuVariants, onChange, basePrice = 0, baseComparePrice = 0, baseCostPrice = 0, productName = '', productCategories = [], singleVariant = false, variantSelected = null }) => {
  const [skuTree, setSKUTree] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedSKU, setSelectedSKU] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [levelTitles, setLevelTitles] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化效果：從 skuVariants 重建樹狀結構
  useEffect(() => {
    // 如果有 skuVariants 但沒有樹狀結構，且還沒有初始化過
    if (skuVariants && skuVariants.length > 0 && skuTree.length === 0 && !isInitialized) {
      rebuildTreeFromVariants(skuVariants);
      setIsInitialized(true);
    }
    // 如果沒有 skuVariants 但還沒初始化，標記為已初始化
    else if (!isInitialized && (!skuVariants || skuVariants.length === 0)) {
      setIsInitialized(true);
    }
  }, [skuVariants, baseSKU]);

  // 從變體重建樹狀結構
  const rebuildTreeFromVariants = (variants) => {
    if (!variants || variants.length === 0) return;
    
    const tree = [];
    const levelTitlesMap = {};
    
    // 構建樹狀結構
    variants.forEach(variant => {
      if (variant.path && variant.path.length > 0) {
        let currentLevel = tree;
        
        variant.path.forEach((pathItem, index) => {
          const level = index + 1;
          levelTitlesMap[level] = pathItem.level;
          
          // 檢查當前層級是否已有該選項
          let existingNode = currentLevel.find(node => 
            node.name === pathItem.option && node.level === level
          );
          
          if (!existingNode) {
            // 創建新節點，SKU 代碼暫時設為空，讓用戶重新設定
            existingNode = {
              id: generateId(),
              name: pathItem.option,
              skuCode: '', // 重建時 SKU 代碼需要用戶重新設定
              fullSKU: baseSKU || '',
              level: level,
              children: [],
              config: createDefaultConfig()
            };
            
            currentLevel.push(existingNode);
          }
          
          // 如果是最後一層級，保存變體的配置與完整 SKU
          if (index === variant.path.length - 1) {
            if (variant.config) {
              existingNode.config = { ...createDefaultConfig(), ...variant.config };
            }
            if (variant.sku) {
              existingNode.fullSKU = variant.sku;
            }
          }
          
          // 移動到下一層級
          currentLevel = existingNode.children;
        });
      }
    });
    
    setSKUTree(tree);
    setLevelTitles(levelTitlesMap);
  };

  // 單一變體模式：初始化右側詳情
  useEffect(() => {
    if (!singleVariant) return;
    if (!variantSelected) return;
    const v = variantSelected || {};
    const prepared = {
      id: v.id || `var-${Date.now()}`,
      fullSKU: v.sku || baseSKU || '',
      sku: v.sku || baseSKU || '',
      name: v.name || '',
      config: { ...createDefaultConfig(), ...(v.config || {}) },
      pathInfo: Array.isArray(v.path) ? v.path.map(p => ({ level: p.level, option: p.option })) : []
    };
    setSelectedSKU(prepared);
    setShowDetailPanel(true);
  }, [singleVariant, variantSelected, baseSKU]);

  // 創建默認配置
  const createDefaultConfig = () => ({
    price: '',
    comparePrice: '',
    costPrice: '',
    quantity: '',
    lowStockThreshold: 5,
    allowBackorder: false,
    trackQuantity: true,
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    isActive: true,
    barcode: '',
    hsCode: '',
    origin: '',
    note: '',
    variantImages: []
  });

  // 更新層級標題
  const updateLevelTitle = (level, title) => {
    setLevelTitles(prev => ({
      ...prev,
      [level]: title
    }));
  };

  // 獲取層級標題
  const getLevelTitle = (level) => {
    return levelTitles[level] || `第 ${level} 層`;
  };

  // 生成新的節點 ID
  const generateId = () => Date.now() + Math.random();

  // 創建新節點
  const createNewNode = (level, parentSKU = '') => ({
    id: generateId(),
    name: '',
    skuCode: '',
    fullSKU: parentSKU,
    level: level,
    children: [],
    config: createDefaultConfig(),
    isEditing: true
  });

  // 添加根層級
  const addRootLevel = () => {
    const newNode = createNewNode(1, baseSKU || '');
    setSKUTree(prev => {
      const updatedTree = [...prev, newNode];
      setTimeout(() => {
        const currentVariants = autoGenerateVariants(updatedTree);
        if (onChange) {
          onChange(currentVariants);
        }
      }, 50);
      return updatedTree;
    });
  };

  // 遞歸更新節點
  const updateNodeInTree = (nodes, nodeId, updates, rootNodes = nodes) => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, ...updates };
        
        // 如果更新了 skuCode，重新計算整個樹的 fullSKU
        if ('skuCode' in updates || 'name' in updates) {
          // 計算當前節點的完整路徑 SKU（包含所有父級 + 當前節點的 skuCode）
          const fullPath = getNodeFullPath(rootNodes, nodeId);
          const parentPath = fullPath.slice(0, -1); // 只取父級路徑
          const parentSKU = calculateNodeFullSKU(parentPath);
          // 當前節點的 fullSKU = 所有父級SKU + 當前節點SKU
          updatedNode.fullSKU = parentSKU + (updates.skuCode || updatedNode.skuCode || '');
          
          // 更新所有子節點的 fullSKU
          updatedNode.children = recalculateChildrenSKU(updatedNode.children, updatedNode.fullSKU);
        }
        
        return updatedNode;
      }
      
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updates, rootNodes)
      };
    });
  };

  // 獲取節點的完整路徑（包含自身）
  const getNodeFullPath = (nodes, nodeId) => {
    const findPath = (nodes, targetId, currentPath = []) => {
      for (const node of nodes) {
        const newPath = [...currentPath, node];
        if (node.id === targetId) {
          return newPath;
        }
        if (node.children) {
          const found = findPath(node.children, targetId, newPath);
          if (found) return found;
        }
      }
      return null;
    };
    return findPath(nodes, nodeId) || [];
  };

  // 計算節點路徑的完整 SKU
  const calculateNodeFullSKU = (nodePath, newSkuCode = null) => {
    let fullSKU = baseSKU || '';
    
    for (let i = 0; i < nodePath.length; i++) {
      const node = nodePath[i];
      const skuCode = (i === nodePath.length - 1 && newSkuCode !== null) 
        ? newSkuCode 
        : (node.skuCode || '');
      fullSKU += skuCode;
    }
    
    return fullSKU;
  };

  // 重新計算子節點的 SKU
  const recalculateChildrenSKU = (children, parentFullSKU) => {
    if (!Array.isArray(children) || children.length === 0) return [];
    return children.map(child => {
      // 子節點的 fullSKU = 父節點的 fullSKU + 子節點的 skuCode
      const childFullSKU = parentFullSKU + (child.skuCode || '');
      return {
        ...child,
        fullSKU: childFullSKU,
        children: recalculateChildrenSKU(child.children, childFullSKU)
      };
    });
  };



  // 更新節點
  const updateNode = (nodeId, field, value) => {
    setSKUTree(prev => {
      let updatedTree;
      if (field.includes('.')) {
        // 處理配置字段
        const [parent, child] = field.split('.');
        if (parent === 'config') {
          // 先在當前樹中找到節點
          const findInNodes = (nodes) => {
            for (const node of nodes) {
              if (node.id === nodeId) return node;
              const found = findInNodes(node.children);
              if (found) return found;
            }
            return null;
          };
          
          const targetNode = findInNodes(prev);
          updatedTree = updateNodeInTree(prev, nodeId, {
            config: {
              ...targetNode?.config,
              [child]: value
            }
          });
        } else {
          updatedTree = prev;
        }
      } else {
        // 處理基本字段
        updatedTree = updateNodeInTree(prev, nodeId, { [field]: value });
      }
      
      setTimeout(() => {
        const currentVariants = autoGenerateVariants(updatedTree);
        if (onChange) {
          onChange(currentVariants);
        }
        // 若當前右側面板選中的是同一節點，則同步更新其顯示資料（包含 fullSKU 與路徑）
        if (selectedSKU && selectedSKU.id === nodeId) {
          const findInNodes = (nodes) => {
            for (const node of nodes) {
              if (node.id === nodeId) return node;
              const found = findInNodes(node.children || []);
              if (found) return found;
            }
            return null;
          };
          const fresh = findInNodes(updatedTree);
          if (fresh) {
            // 使用 updatedTree 計算最新路徑
            const buildPath = (nodes, targetId, currentPath = []) => {
              for (const node of nodes) {
                const levelTitle = getLevelTitle(node.level);
                const newPath = [...currentPath, { level: levelTitle, option: node.name || '未命名' }];
                if (node.id === targetId) return newPath;
                const found = buildPath(node.children || [], targetId, newPath);
                if (found) return found;
              }
              return null;
            };
            const newPathInfo = buildPath(updatedTree, nodeId) || [];
            setSelectedSKU({ ...fresh, pathInfo: newPathInfo });
          }
        }
      }, 50);
      
      return updatedTree;
    });
  };

  // 遞歸查找節點
  const findNodeById = (nodeId) => {
    const findInNodes = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        const found = findInNodes(node.children);
        if (found) return found;
      }
      return null;
    };
    return findInNodes(skuTree);
  };

  // 添加子節點
  const addChildNode = (parentId) => {
    setSKUTree(prev => {
      // 先在當前樹中找到父節點
      const findInNodes = (nodes) => {
        for (const node of nodes) {
          if (node.id === parentId) return node;
          const found = findInNodes(node.children);
          if (found) return found;
        }
        return null;
      };
      
      const parentNode = findInNodes(prev);
      if (!parentNode) return prev;
      
      // 計算父節點的完整 SKU（包含父節點的 skuCode）
      const parentPath = getNodeFullPath(prev, parentId);
      const parentFullSKU = calculateNodeFullSKU(parentPath);
      
      const updatedTree = updateNodeInTree(prev, parentId, {
        children: [
          ...parentNode.children || [],
          createNewNode(parentNode.level + 1, parentFullSKU)
        ]
      });
      
      // 延遲觸發自動變體更新
      setTimeout(() => {
        const currentVariants = autoGenerateVariants(updatedTree);
        if (onChange) {
          onChange(currentVariants);
        }
      }, 100);
      
      return updatedTree;
    });
  };

  // 添加同級節點
  const addSiblingNode = (nodeId) => {
    setSKUTree(prev => {
      // 先在當前樹中找到目標節點
      const findInNodes = (nodes) => {
        for (const node of nodes) {
          if (node.id === nodeId) return node;
          const found = findInNodes(node.children);
          if (found) return found;
        }
        return null;
      };
      
      const targetNode = findInNodes(prev);
      if (!targetNode) return prev;

      const getParentSKUFromTree = (nodes, targetNodeId) => {
        for (const node of nodes) {
          if (node.children.some(child => child.id === targetNodeId)) {
            return node.fullSKU;
          }
          const found = getParentSKUFromTree(node.children, targetNodeId);
          if (found !== null && found !== undefined) return found;
        }
        return null; // 根層級時沒有父節點
      };

      const parentSKU = getParentSKUFromTree(prev, nodeId) ?? (baseSKU || '');
      const newNode = createNewNode(targetNode.level, parentSKU);

      const addSiblingInTree = (nodes) => {
        // 檢查是否在根層級
        const rootIndex = nodes.findIndex(n => n.id === nodeId);
        if (rootIndex !== -1) {
          const newNodes = [...nodes];
          newNodes.splice(rootIndex + 1, 0, newNode);
          return newNodes;
        }

        // 遞歸查找在子層級
        return nodes.map(node => ({
          ...node,
          children: addSiblingInTree(node.children)
        }));
      };

      const updatedTree = addSiblingInTree(prev);
      
      // 延遲觸發自動變體更新
      setTimeout(() => {
        const currentVariants = autoGenerateVariants(updatedTree);
        if (onChange) {
          onChange(currentVariants);
        }
      }, 100);
      
      return updatedTree;
    });
  };

  // 刪除節點
  const deleteNode = (nodeId) => {
    setSKUTree(prev => {
      const deleteFromTree = (nodes) => {
        return nodes.filter(node => node.id !== nodeId).map(node => ({
          ...node,
          children: deleteFromTree(node.children)
        }));
      };
      const updatedTree = deleteFromTree(prev);
      
      // 延遲觸發自動變體更新
      setTimeout(() => {
        const currentVariants = autoGenerateVariants(updatedTree);
        if (onChange) {
          onChange(currentVariants);
        }
      }, 100);
      
      return updatedTree;
    });
  };

  // 切換展開狀態
  const toggleExpand = (nodeId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // 選擇 SKU 進行配置
  const selectSKUForConfig = (node) => {
    const pathInfo = getNodePath(node.id);
    setSelectedSKU({
      ...node,
      pathInfo: pathInfo
    });
    setShowDetailPanel(true);
  };

  // 獲取節點路徑
  const getNodePath = (nodeId) => {
    const path = [];
    const findPath = (nodes, targetId, currentPath = []) => {
      for (const node of nodes) {
        const levelTitle = getLevelTitle(node.level);
        const newPath = [...currentPath, { level: levelTitle, option: node.name || '未命名' }];
        
        if (node.id === targetId) {
          path.push(...newPath);
          return true;
        }
        
        if (findPath(node.children, targetId, newPath)) {
          return true;
        }
      }
      return false;
    };

    findPath(skuTree, nodeId);
    return path;
  };

  // 自動生成變體
  const autoGenerateVariants = (currentTree = null) => {
    const treeToUse = currentTree || skuTree;
    const variants = [];
    const toNum = (v) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };
    const bp = toNum(basePrice);
    const bcp = toNum(baseComparePrice);
    const bcost = toNum(baseCostPrice);
    
    const collectLeafNodes = (nodes, accumulatedSKU = baseSKU || '', path = []) => {
      nodes.forEach(node => {
        // 累加當前節點的 SKU
        const currentSKU = accumulatedSKU + (node.skuCode || '');
        const currentPath = [...path, {
          level: levelTitles[node.level] || `層級${node.level}`,
          option: node.name || '未命名選項'
        }];
        
        if (!node.children || node.children.length === 0) {
          // 這是葉子節點，生成變體
          if (node.skuCode && node.skuCode.trim()) {
            const cfg = node.config || createDefaultConfig();
            const deltaPrice = toNum(cfg.price);
            const deltaCompare = toNum(cfg.comparePrice);
            const deltaCost = toNum(cfg.costPrice);

            variants.push({
              id: `sku-${node.id}`,
              sku: currentSKU,
              name: node.name || '未命名選項',
              path: currentPath,
              pathDisplay: currentPath.map(p => `${p.level}: ${p.option}`).join(' → '),
              config: cfg,
              // 展平部分欄位（便於驗證/提交）
              price: cfg.price,
              comparePrice: cfg.comparePrice,
              costPrice: cfg.costPrice,
              quantity: cfg.quantity,
              trackQuantity: cfg.trackQuantity,
              isActive: cfg.isActive,
              // 計算最終價格（基礎價 + 差額；允許負數；無差額時等於基礎價）
              finalPrice: bp + deltaPrice,
              finalComparePrice: bcp + deltaCompare,
              finalCostPrice: bcost + deltaCost
            });
          }
        } else {
          // 有子節點，繼續遞歸，傳遞累加的 SKU
          collectLeafNodes(node.children, currentSKU, currentPath);
        }
      });
    };

    collectLeafNodes(treeToUse);
    return variants;
  };

  // 當樹狀結構變化時自動更新變體
  useEffect(() => {
    if (skuTree.length > 0 && isInitialized) {
      const currentVariants = autoGenerateVariants();
      if (onChange && currentVariants.length > 0) {
        onChange(currentVariants);
      }
    }
  }, [skuTree, baseSKU, isInitialized, basePrice, baseComparePrice, baseCostPrice]);

  return (
    <div className="space-y-6">
      {/* 主要容器 */}
      <div className="flex gap-6">
        {/* 左側：SKU 樹狀結構（單一變體模式隱藏） */}
        {!singleVariant && (
        <div className={`bg-white border border-gray-200 rounded-lg transition-all duration-300 ${
          showDetailPanel ? 'w-2/3' : 'w-full'
        }`}>
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">SKU 結構樹</h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={addRootLevel}
                  className={`${ADMIN_STYLES.btnPrimary} text-sm inline-flex items-center whitespace-nowrap`}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  添加根層級
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {skuTree.length > 0 ? (
              <div className="space-y-2">
                {skuTree.map((node, index) => (
                  <SKUTreeNode
                    key={node.id}
                    node={node}
                    expandedItems={expandedItems}
                    onToggleExpand={toggleExpand}
                    onUpdateNode={updateNode}
                    onDeleteNode={deleteNode}
                    onAddChild={addChildNode}
                    onAddSibling={addSiblingNode}
                    onSelectForConfig={selectSKUForConfig}
                    isFirstInLevel={index === 0}
                    levelTitle={getLevelTitle(node.level)}
                    onUpdateLevelTitle={updateLevelTitle}
                    getLevelTitle={getLevelTitle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <CubeIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium">還沒有建立 SKU 結構</p>
                <p className="text-sm">點擊「添加根層級」開始建立 SKU 樹狀結構</p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* 右側：SKU 詳細設定面板 */}
        {showDetailPanel && selectedSKU && (
          <div className={`${singleVariant ? 'w-full' : 'w-1/3'} bg-white border border-gray-200 rounded-lg`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">SKU 詳細設定</h4>
                <button
                  onClick={() => setShowDetailPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {selectedSKU.fullSKU}
              </p>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <SKUDetailPanel
                sku={selectedSKU}
                onUpdate={(field, value) => updateNode(selectedSKU.id, field, value)}
                baseSKU={baseSKU}
                getLevelTitle={getLevelTitle}
                basePrice={basePrice}
                baseComparePrice={baseComparePrice}
                baseCostPrice={baseCostPrice}
                productName={productName}
                productCategories={productCategories}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SKU 樹狀節點組件
const SKUTreeNode = ({
  node,
  expandedItems,
  onToggleExpand,
  onUpdateNode,
  onDeleteNode,
  onAddChild,
  onAddSibling,
  onSelectForConfig,
  isFirstInLevel = false,
  levelTitle = '',
  onUpdateLevelTitle,
  getLevelTitle
}) => {
  const [isEditing, setIsEditing] = useState(node.isEditing || false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSkuCode, setEditSkuCode] = useState('');
  const [editLevelTitle, setEditLevelTitle] = useState('');

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedItems.has(node.id);
  const canAddChildren = node.level < 5;
  const isLeafNode = !hasChildren;

  // 開始編輯
  const startEdit = () => {
    setEditName(node.name || '');
    setEditSkuCode(node.skuCode || '');
    setIsEditing(true);
  };

  // 保存編輯
  const saveEdit = () => {
    // 先更新名稱
    if (editName !== node.name) {
      onUpdateNode(node.id, 'name', editName);
    }
    // 再更新 SKU 代碼，這會觸發 fullSKU 重新計算
    if (editSkuCode !== node.skuCode) {
      onUpdateNode(node.id, 'skuCode', editSkuCode);
    }
    // 清除編輯狀態標誌
    onUpdateNode(node.id, 'isEditing', false);
    setIsEditing(false);
  };

  // 取消編輯
  const cancelEdit = () => {
    setIsEditing(false);
  };

  // 開始編輯層級標題
  const startEditTitle = () => {
    setEditLevelTitle(levelTitle);
    setIsEditingTitle(true);
  };

  // 保存層級標題
  const saveLevelTitle = () => {
    onUpdateLevelTitle(node.level, editLevelTitle);
    setIsEditingTitle(false);
  };

  // 取消編輯層級標題
  const cancelLevelTitle = () => {
    setIsEditingTitle(false);
  };

  const getIndentClass = () => {
    const indentMap = {
      1: 'pl-0',
      2: 'pl-6',
      3: 'pl-12',
      4: 'pl-18',
      5: 'pl-24'
    };
    return indentMap[node.level] || 'pl-0';
  };

  const getLevelColor = () => {
    const colorMap = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-purple-100 text-purple-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    return colorMap[node.level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="select-none">
      {/* 層級標題 */}
      {isFirstInLevel && (
        <div className={`mb-2 ${getIndentClass()}`}>
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editLevelTitle}
                onChange={(e) => setEditLevelTitle(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm font-medium"
                placeholder={`第 ${node.level} 層標題`}
                autoFocus
              />
              <button
                onClick={saveLevelTitle}
                className="text-green-600 hover:text-green-700 p-1"
              >
                <CheckCircleIcon className="w-4 h-4" />
              </button>
              <button
                onClick={cancelLevelTitle}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              className="flex items-center justify-between py-1 px-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
              onClick={startEditTitle}
            >
              <h6 className="text-sm font-medium text-gray-700">
                {levelTitle || `第 ${node.level} 層`}
              </h6>
              <PencilIcon className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>
      )}

      <div className={`flex items-center py-2 hover:bg-gray-50 rounded-lg transition-colors ${getIndentClass()}`}>
        {/* 展開/收起按鈕 */}
        <div className="flex items-center justify-center w-6 h-6 mr-2">
          {hasChildren ? (
            <button
              onClick={() => onToggleExpand(node.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        {/* 層級標籤 */}
        <span className={`px-2 py-1 rounded text-xs font-medium mr-3 ${getLevelColor()}`}>
          L{node.level}
        </span>

        {/* 節點內容 */}
        <div className="flex-1 flex items-center space-x-3">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
                placeholder="選項名稱 (例如：黑色、大號)"
                autoFocus
              />
              <input
                type="text"
                value={editSkuCode}
                onChange={(e) => setEditSkuCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                placeholder="sku"
                maxLength={3}
              />
              <button
                onClick={saveEdit}
                className="text-green-600 hover:text-green-700 p-1"
              >
                <CheckCircleIcon className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {node.name || '未命名選項'}
                  {node.skuCode && (
                    <span className="ml-2 text-sm font-mono text-gray-600">
                      [{node.skuCode}]
                    </span>
                  )}
                </div>
                {node.fullSKU && (
                  <div className="text-xs text-gray-500 font-mono">
                    完整 SKU: {node.fullSKU}
                  </div>
                )}
              </div>

              {/* 操作按鈕 */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={startEdit}
                  className="text-gray-400 hover:text-blue-600 p-1 rounded"
                  title="編輯選項"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddSibling(node.id)}
                  className="text-gray-400 hover:text-orange-600 p-1 rounded"
                  title="添加同層級選項"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>

                {canAddChildren && (
                  <button
                    onClick={() => onAddChild(node.id)}
                    className="text-gray-400 hover:text-green-600 p-1 rounded"
                    title="添加下一層級"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                )}

                {isLeafNode && (
                  <button
                    onClick={() => onSelectForConfig(node)}
                    className="text-gray-400 hover:text-[#cc824d] p-1 rounded"
                    title="設定 SKU 詳細資訊"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onDeleteNode(node.id)}
                  className="text-gray-400 hover:text-red-600 p-1 rounded"
                  title="刪除"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 子節點 */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children.map((child, index) => (
            <SKUTreeNode
              key={child.id}
              node={child}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              onAddChild={onAddChild}
              onAddSibling={onAddSibling}
              onSelectForConfig={onSelectForConfig}
              isFirstInLevel={index === 0}
              levelTitle={getLevelTitle ? getLevelTitle(child.level) : `第 ${child.level} 層`}
              onUpdateLevelTitle={onUpdateLevelTitle}
              getLevelTitle={getLevelTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// SKU 詳細設定面板組件
const SKUDetailPanel = ({ sku, onUpdate, baseSKU, getLevelTitle, basePrice = 0, baseComparePrice = 0, baseCostPrice = 0, productName = '', productCategories = [] }) => {
  const stockStatus = sku.config.trackQuantity 
    ? (parseInt(sku.config.quantity) || 0) <= (parseInt(sku.config.lowStockThreshold) || 0)
      ? 'low'
      : 'normal'
    : 'unlimited';

  const pathInfo = sku.pathInfo || [];
  // 計算最終價格（基礎價 + 差額）
  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const finalSale = toNum(basePrice) + toNum(sku.config.price);
  const finalCompare = toNum(baseComparePrice) + toNum(sku.config.comparePrice);
  const finalCost = toNum(baseCostPrice) + toNum(sku.config.costPrice);

  return (
    <div className="space-y-6">
      {/* SKU 路徑資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h6 className="text-sm font-medium text-blue-900 mb-3">SKU 組成資訊</h6>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-600">基礎 SKU: </span>
            <span className="font-mono text-blue-800 bg-white px-2 py-1 rounded">
              {baseSKU || 'N/A'}
            </span>
          </div>
          
          {pathInfo.length > 0 && (
            <div className="text-sm">
              <span className="text-gray-600">層級路徑: </span>
              <div className="mt-1 space-y-1">
                {pathInfo.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2">
                      L{index + 1}
                    </span>
                    <span className="text-sm text-gray-800">
                      {item.level}: 
                    </span>
                    <span className="font-medium text-gray-900 ml-1">
                      {item.option}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm pt-2 border-t border-blue-200">
            <span className="text-gray-600">最終 SKU: </span>
            <span className="font-mono text-lg font-bold text-blue-800 bg-white px-2 py-1 rounded">
              {sku.fullSKU || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 基本設定 */}
      <div>
        <h6 className="text-sm font-medium text-gray-900 mb-3">基本設定</h6>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={sku.config.isActive}
              onChange={(e) => onUpdate('config.isActive', e.target.checked)}
              className="h-4 w-4 text-[#cc824d] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">啟用此變體</span>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">條碼</label>
            <input
              type="text"
              value={sku.config.barcode}
              onChange={(e) => onUpdate('config.barcode', e.target.value)}
              className={`${ADMIN_STYLES.input} text-sm`}
              placeholder="條碼"
            />
            {/* QR Code 預覽與下載（含指定內容） */}
            <div className="mt-3">
              <QRCodeGenerator
                product={{ name: productName, categories: productCategories }}
                sku={{
                  sku: sku.fullSKU,
                  salePrice: finalSale,
                  comparePrice: finalCompare,
                  costPrice: finalCost,
                  variantPath: pathInfo.map((p, idx) => ({ level: p.level, option: p.option })),
                  images: Array.isArray(sku.config.variantImages) ? sku.config.variantImages : []
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 價格設定 */}
      <div>
        <h6 className="text-sm font-medium text-gray-900 mb-3">價格設定</h6>
        <p className="text-xs text-gray-500 mb-2">提示：此處輸入的是"差額"，會與定價設定中的基礎價格相加（可為負數）。</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">售價 *</label>
            <input
              type="number"
              value={sku.config.price}
              onChange={(e) => onUpdate('config.price', e.target.value)}
              className={`${ADMIN_STYLES.input} text-sm`}
              placeholder="0"
              step="0.01"
            />
            <div className="mt-1 text-xs text-gray-600">最終售價：NT${Number(finalSale).toLocaleString()}</div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">原價</label>
            <input
              type="number"
              value={sku.config.comparePrice}
              onChange={(e) => onUpdate('config.comparePrice', e.target.value)}
              className={`${ADMIN_STYLES.input} text-sm`}
              placeholder="0"
              step="0.01"
            />
            <div className="mt-1 text-xs text-gray-600">最終原價：NT${Number(finalCompare).toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">成本價</label>
            <input
              type="number"
              value={sku.config.costPrice}
              onChange={(e) => onUpdate('config.costPrice', e.target.value)}
              className={`${ADMIN_STYLES.input} text-sm`}
              placeholder="0"
              step="0.01"
            />
            <div className="mt-1 text-xs text-gray-600">最終成本：NT${Number(finalCost).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* 庫存管理 */}
      {/* 變體圖片 */}
      <div>
        <h6 className="text-sm font-medium text-gray-900 mb-3">變體圖片</h6>
        <p className="text-xs text-gray-500 mb-2">此處設定「此變體」專屬圖片。若未設定，將回退使用商品圖片或無圖。</p>
        <ImageUpload
          images={Array.isArray(sku.config.variantImages) ? sku.config.variantImages : []}
          onChange={(imgs) => onUpdate('config.variantImages', imgs)}
          maxImages={3}
        />
      </div>

      {/* 庫存管理 */}
      <div>
        <h6 className="text-sm font-medium text-gray-900 mb-3">庫存管理</h6>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={sku.config.trackQuantity}
              onChange={(e) => onUpdate('config.trackQuantity', e.target.checked)}
              className="h-4 w-4 text-[#cc824d] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">追蹤庫存</span>
          </div>

          {sku.config.trackQuantity && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">庫存數量 *</label>
                <input
                  type="number"
                  value={sku.config.quantity}
                  onChange={(e) => onUpdate('config.quantity', e.target.value)}
                  className={`${ADMIN_STYLES.input} text-sm`}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">低庫存警告</label>
                <input
                  type="number"
                  value={sku.config.lowStockThreshold}
                  onChange={(e) => onUpdate('config.lowStockThreshold', e.target.value)}
                  className={`${ADMIN_STYLES.input} text-sm`}
                  placeholder="5"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={sku.config.allowBackorder}
                  onChange={(e) => onUpdate('config.allowBackorder', e.target.checked)}
                  className="h-4 w-4 text-[#cc824d] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">允許缺貨預訂</span>
              </div>

              <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                stockStatus === 'low' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {stockStatus === 'low' ? (
                  <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                ) : (
                  <CheckCircleIcon className="w-3 h-3 mr-1" />
                )}
                {stockStatus === 'low' ? '庫存不足' : '庫存充足'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NestedSKUManager;