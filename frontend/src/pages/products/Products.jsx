import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
// 移除產品 mock，改由後端 API 取得
import { categories, findCategoryById, getCategoryPath } from "../../../external_mock/data/categories.js";
import { useCart } from "../../../external_mock/state/cart.jsx";
import ProductQuickAddModal from "../../components/product/ProductQuickAddModal.jsx";
import ProductsHeader from '../../components/product/ProductsHeader.jsx';
import ProductCard from '../../components/product/ProductCard.jsx';
import CategorySidebar from '../../components/product/CategorySidebar.jsx';
import MobileFilterPanel from '../../components/product/MobileFilterPanel.jsx';

// 使用統一的分類系統
const hierarchicalCategories = categories;

// 根據路徑片段查找對應的分類節點
const findNodeByPath = (pathSegments) => {
  if (!pathSegments || pathSegments.length === 0) return null;
  
  const findInTree = (nodes, slugs) => {
    if (slugs.length === 0) return null;
    const [currentSlug, ...remainingSlugs] = slugs;
    
    for (const node of nodes) {
      if (node.slug === currentSlug) {
        if (remainingSlugs.length === 0) return node;
        if (node.children) return findInTree(node.children, remainingSlugs);
        return node;
      }
    }
    return null;
  };
  
  return findInTree(hierarchicalCategories, pathSegments);
};

// 解析當前路徑獲取路徑片段
const parsePathSegments = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'products') {
    return segments.slice(1); // 移除 'products' 前綴
  }
  return [];
};

function findNodePath(targetSlug) {
  if (!targetSlug) return [];
  const path = [];
  function dfs(nodes, trail) {
    for (const n of nodes) {
      const next = [...trail, n];
      if (n.slug === targetSlug) { path.push(...next); return true; }
      if (n.children && dfs(n.children, next)) return true;
    }
    return false;
  }
  dfs(hierarchicalCategories, []);
  return path;
}

export default function Products() {
  const location = useLocation();
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentPathSegments, setCurrentPathSegments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  // const [activeParents, setActiveParents] = useState(new Set()); // 保留可能的後續使用
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 同步當前路徑
  useEffect(() => {
    const pathSegments = parsePathSegments(location.pathname);
    setCurrentPathSegments(pathSegments);
    
    // 根據路徑找到對應的節點
    const node = findNodeByPath(pathSegments);
    if (node) {
      setSelectedNode(node.id);
    } else {
      setSelectedNode(null);
    }
  }, [location.pathname]);

  // 處理展開/收合
  const toggleExpand = (nodeSlug) => {
    setExpanded(prev => ({ ...prev, [nodeSlug]: !prev[nodeSlug] }));
  };

  // 生成節點的完整路徑
  // const getNodePath = (targetSlug) => { ...保留原本未使用方法 }

  // 處理收藏切換
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // 處理產品篩選和排序
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const categoryPath = currentPathSegments.join('/');
        const params = new URLSearchParams();
        if (categoryPath) params.set('category', categoryPath);
        // 先讓後端只做基本篩選；搜尋與排序先在前端處理
        const res = await fetch(`/frontend/products?${params.toString()}`, { credentials: 'include' });
        if (!res.ok) { setFilteredProducts([]); return; }
        const data = await res.json();
        let items = Array.isArray(data?.items) ? data.items : [];
        // 搜尋（前端）
        if (searchTerm) {
          const kw = searchTerm.toLowerCase();
          items = items.filter(p => String(p.name||'').toLowerCase().includes(kw));
        }
        // 排序（前端）
        items.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return (a.price||0) - (b.price||0);
            case 'price-high':
              return (b.price||0) - (a.price||0);
            case 'name':
            default:
              return String(a.name||'').localeCompare(String(b.name||''));
          }
        });
        if (!cancelled) setFilteredProducts(items);
      } catch {
        if (!cancelled) setFilteredProducts([]);
      }
    })();
    return () => { cancelled = true; }
  }, [searchTerm, currentPathSegments, sortBy]);

  const handleAddToCart = (product, quantity, variant) => {
    addToCart(product, quantity);
    // 可以在這裡處理 variant 邏輯
  };

  const openQuickAddModal = (product) => {
    setQuickAddProduct(product);
    setIsModalOpen(true);
  };

  // 檢查一個分類是否應該顯示為活躍狀態（選中狀態）
  const isNodeSelected = (nodeId) => {
    return selectedNode === nodeId;
  };

  // 檢查一個分類是否是當前選中項目的父級
  const isNodeParent = (nodeId) => {
    if (!selectedNode) return false;
    const category = findCategoryById(selectedNode);
    if (!category) return false;
    const path = getCategoryPath(category.id);
    return path && path.some(cat => cat.id === nodeId) && nodeId !== selectedNode;
  };

  // 生成節點的路由路徑
  const getNodeRoutePath = (nodeId) => {
    const category = findCategoryById(nodeId);
    return category ? category.href : '/products';
  };

  // 根據當前選中節點生成標題和面包屑
  const getDisplayInfo = () => {
    if (selectedNode) {
      const category = findCategoryById(selectedNode);
      if (category) {
        const path = getCategoryPath(category.id);
        const currentTitle = category.name;
        const breadcrumb = path ? path.map(c => c.name).join(' / ') : category.name;
        return { currentTitle, breadcrumb };
      }
    }
    
    return { currentTitle: '全部商品', breadcrumb: '全部類別' };
  };
  
  const { currentTitle, breadcrumb } = getDisplayInfo();

  return (
    <div className="min-h-screen pt-20 xs:pt-22 sm:pt-24 md:pt-24 pb-16 xs:pb-20 sm:pb-24 md:pb-24" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      <div className="w-full px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-6 xs:gap-8 sm:gap-10 md:gap-12 xl:gap-16">
          <aside className="hidden">
            <div className="sticky top-24 space-y-2">
              <div className="pb-4 lg:pb-5 xl:pb-6 border-b border-gray-200">
                <h3 className="font-medium font-chinese text-xs lg:text-xs xl:text-xs tracking-[0.15em] uppercase mb-3 lg:mb-4" style={{color: '#666666'}}>分類</h3>
                <nav className="space-y-1">
                  {/* 全部商品按鈕 */}
                  <Link
                    to="/products"
                    className={`block py-2.5 pl-3 text-sm font-chinese transition-colors duration-200 relative ${
                      location.pathname === '/products'
                        ? 'font-medium' 
                        : 'font-normal'
                    }`}
                    style={{
                      color: location.pathname === '/products' ? '#CC824D' : '#666666'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                    onMouseLeave={(e) => {
                      if (location.pathname !== '/products') {
                        e.target.style.color = '#666666';
                      }
                    }}
                  >
                    <span>全部商品</span>
                    {location.pathname === '/products' && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-btn"></span>
                    )}
                  </Link>
                  
                  {/* 分類導航 */}
                  {hierarchicalCategories.map(root => {
                    const rootExpanded = expanded[root.id];
                    return (
                      <div key={root.id}
                        onMouseEnter={() => setExpanded(e => ({...e, [root.id]: true}))}
                        onMouseLeave={() => setExpanded(e => ({...e, [root.id]: false}))}
                      >
                        <Link
                          to={getNodeRoutePath(root.id)}
                          onClick={() => toggleExpand(root.id)}
                          className={`block py-2.5 pl-3 text-sm font-chinese transition-colors duration-200 relative ${
                            isNodeSelected(root.id) || isNodeParent(root.id)
                              ? 'font-medium' 
                              : 'font-normal'
                          }`}
                          style={{
                            color: (isNodeSelected(root.id) || isNodeParent(root.id)) ? '#CC824D' : '#666666'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                          onMouseLeave={(e) => {
                            if (!isNodeSelected(root.id) && !isNodeParent(root.id)) {
                              e.target.style.color = '#666666';
                            }
                          }}
                        >
                          <span className="flex items-center justify-between">
                            <span>{root.name}</span>
                            {root.children && <ChevronDownIcon className={`w-3.5 h-3.5 ml-2 transition-transform ${rootExpanded?'rotate-180':''}`} style={{strokeWidth: 1.5}} />}
                          </span>
                          {isNodeSelected(root.id) && (
                            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-btn"></span>
                          )}
                        </Link>
                        <div
                          className={`mt-1 ml-3 pl-3 space-y-1 ${rootExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                          style={{ pointerEvents: rootExpanded ? 'auto' : 'none', borderLeft: rootExpanded ? '1px solid #E5E7EB' : 'none' }}
                        >
                          {root.children && root.children.map(child => {
                            const childExpanded = expanded[child.slug];
                            const hasGrand = !!child.children;
                            return (
                              <div key={child.slug}
                                onMouseEnter={() => setExpanded(e => ({...e, [child.slug]: true, [root.slug]: true}))}
                                onMouseLeave={() => setExpanded(e => ({...e, [child.slug]: false}))}
                              >
                                <Link
                                  to={getNodeRoutePath(child.slug)}
                                  onClick={() => { if(hasGrand) toggleExpand(child.slug); }}
                                  className={`block py-2 text-sm font-chinese transition-colors duration-200 ${
                                    isNodeSelected(child.slug) || isNodeParent(child.slug)
                                      ? 'font-medium'
                                      : 'font-normal'
                                  }`}
                                  style={{
                                    color: (isNodeSelected(child.slug) || isNodeParent(child.slug)) ? '#CC824D' : '#888888'
                                  }}
                                  onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                                  onMouseLeave={(e) => {
                                    if (!isNodeSelected(child.slug) && !isNodeParent(child.slug)) {
                                      e.target.style.color = '#888888';
                                    }
                                  }}
                                >
                                  <span className="flex items-center justify-between">
                                    <span>{child.name}</span>
                                    {hasGrand && <ChevronDownIcon className={`w-3 h-3 ml-2 transition-transform ${childExpanded?'rotate-180':''}`} style={{strokeWidth: 1.5}} />}
                                  </span>
                                </Link>
                                <div
                                  className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-1 ${hasGrand && childExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                                  style={{ pointerEvents: hasGrand && childExpanded ? 'auto' : 'none' }}
                                >
                                  {hasGrand && child.children && child.children.map(grand => {
                                    const grandExpanded = expanded[grand.slug];
                                    const hasGreatGrand = !!grand.children;
                                    return (
                                      <div key={grand.slug}
                                        onMouseEnter={() => setExpanded(e => ({...e, [grand.slug]: true, [child.slug]: true, [root.slug]: true}))}
                                        onMouseLeave={() => setExpanded(e => ({...e, [grand.slug]: false}))}
                                      >
                                        <Link 
                                          to={getNodeRoutePath(grand.slug)}
                                          onClick={() => { if(hasGreatGrand) toggleExpand(grand.slug); }}
                                          className={`block py-1.5 text-xs font-chinese transition-colors duration-200 ${
                                            isNodeSelected(grand.slug) || isNodeParent(grand.slug)
                                              ? 'font-medium'
                                              : 'font-normal'
                                          }`}
                                          style={{
                                            color: (isNodeSelected(grand.slug) || isNodeParent(grand.slug)) ? '#CC824D' : '#999999'
                                          }}
                                          onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                                          onMouseLeave={(e) => {
                                            if (!isNodeSelected(grand.slug) && !isNodeParent(grand.slug)) {
                                              e.target.style.color = '#999999';
                                            }
                                          }}
                                        >
                                          <span className="flex items-center justify-between">
                                            <span>{grand.name}</span>
                                            {hasGreatGrand && <ChevronDownIcon className={`w-3 h-3 ml-2 transition-transform ${grandExpanded?'rotate-180':''}`} style={{strokeWidth: 1.5}} />}
                                          </span>
                                        </Link>
                                        <div
                                          className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-1 ${hasGreatGrand && grandExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                                          style={{ pointerEvents: hasGreatGrand && grandExpanded ? 'auto' : 'none' }}
                                        >
                                          {hasGreatGrand && grand.children && grand.children.map(greatGrand => {
                                            const greatGrandExpanded = expanded[greatGrand.slug];
                                            const hasGreatGreatGrand = !!greatGrand.children;
                                            return (
                                              <div key={greatGrand.slug}
                                                onMouseEnter={() => setExpanded(e => ({...e, [greatGrand.slug]: true, [grand.slug]: true, [child.slug]: true, [root.slug]: true}))}
                                                onMouseLeave={() => setExpanded(e => ({...e, [greatGrand.slug]: false}))}
                                              >
                                                <Link 
                                                  to={getNodeRoutePath(greatGrand.slug)}
                                                  onClick={() => { if(hasGreatGreatGrand) toggleExpand(greatGrand.slug); }}
                                                  className={`block w-full flex items-center justify-between px-2 py-1 rounded text-xs font-chinese transition-all duration-300 ${
                                                    isNodeSelected(greatGrand.slug)
                                                      ? 'bg-primary-btn/70 text-btn-white shadow-sm'
                                                      : isNodeParent(greatGrand.slug)
                                                        ? 'bg-primary-btn/5 text-primary-btn font-medium'
                                                        : 'text-gray-600 hover:bg-primary-btn/5 hover:text-primary-btn'
                                                  }`}
                                                >
                                                  <span>{greatGrand.name}</span>
                                                  {hasGreatGreatGrand && <ChevronDownIcon className={`w-3 h-3 transition-transform ${greatGrandExpanded?'rotate-180':''}`} />}
                                                </Link>
                                                <div
                                                  className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-1 ${hasGreatGreatGrand && greatGrandExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                                                  style={{ pointerEvents: hasGreatGreatGrand && greatGrandExpanded ? 'auto' : 'none' }}
                                                >
                                                  {hasGreatGreatGrand && greatGrand.children && greatGrand.children.map(greatGreatGrand => (
                                                    <Link 
                                                      key={greatGreatGrand.slug} 
                                                      to={getNodeRoutePath(greatGreatGrand.slug)}
                                                      className={`block w-full text-left px-2 py-0.5 rounded text-xs font-chinese transition-all duration-300 ${
                                                        isNodeSelected(greatGreatGrand.slug)
                                                          ? 'bg-primary-btn/60 text-btn-white shadow-sm'
                                                          : 'text-gray-500 hover:bg-primary-btn/5 hover:text-primary-btn'
                                                      }`}
                                                    >
                                                      {greatGreatGrand.name}
                                                    </Link>
                                                  ))}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9 xl:col-span-10">
            <ProductsHeader
              currentTitle={currentTitle}
              breadcrumb={breadcrumb}
              count={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 xs:gap-x-4 sm:gap-x-5 md:gap-x-6 lg:gap-x-6 gap-y-8 xs:gap-y-10 sm:gap-y-12 md:gap-y-12">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFavorite={favorites.has(p.id)}
                  onToggleFavorite={toggleFavorite}
                  onQuickAdd={openQuickAddModal}
                />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-16 xs:py-20 sm:py-24 md:py-24 px-4">
                <h3 className="text-xl xs:text-2xl sm:text-2xl md:text-2xl font-light font-chinese mb-3 xs:mb-4 sm:mb-4 md:mb-4" style={{color: '#666666', letterSpacing: '0.05em'}}>
                  沒有找到相關商品
                </h3>
                <p className="mb-6 xs:mb-7 sm:mb-8 md:mb-8 font-chinese text-xs xs:text-sm sm:text-sm md:text-sm" style={{color: '#999999'}}>
                  請嘗試調整搜尋條件或瀏覽其他類別
                </p>
                <Link 
                  to="/products"
                  onClick={() => {setSearchTerm(''); setSelectedNode(null);}}
                  className="inline-block px-6 xs:px-7 sm:px-8 md:px-8 py-2.5 xs:py-3 sm:py-3 md:py-3 font-chinese text-xs xs:text-sm sm:text-sm md:text-sm font-medium tracking-wider transition-all duration-300 rounded-lg"
                  style={{
                    background: '#CC824D',
                    color: '#FFFFFF',
                    border: '1px solid #CC824D'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#FFFFFF';
                    e.target.style.color = '#CC824D';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#CC824D';
                    e.target.style.color = '#FFFFFF';
                  }}
                >
                  瀏覽所有商品
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileFilterPanel
        show={showFilters}
        onClose={() => setShowFilters(false)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={hierarchicalCategories}
        isNodeSelected={isNodeSelected}
        isNodeParent={isNodeParent}
        getNodeRoutePath={getNodeRoutePath}
        locationPathname={location.pathname}
        onReset={() => {
          setSearchTerm('');
            setSelectedNode(null);
            setSortBy('name');
            setShowFilters(false);
        }}
      />
      
      {/* 快速加入購物車彈出視窗 */}
      <ProductQuickAddModal
        product={quickAddProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setQuickAddProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}