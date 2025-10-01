import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { HeartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts } from "../../external_mock/data/products.mock";
import { categories } from "../../external_mock/data/categories";
import { formatPrice } from "../../external_mock/data/format";
import { navigationConfig, generateRoutePath } from "../../external_mock/data/navigation";
import { useCart } from "../../external_mock/state/cart";
import SortDropdown from "../components/ui/SortDropdown";

// 將 navigationConfig 轉換為適合的格式
const hierarchicalCategories = navigationConfig;

// 根據路徑片段查找對應的導航節點
const findNodeByPath = (pathSegments) => {
  if (!pathSegments || pathSegments.length === 0) return null;
  
  let currentLevel = hierarchicalCategories;
  let foundNode = null;
  
  for (const segment of pathSegments) {
    foundNode = currentLevel.find(item => item.slug === segment);
    if (!foundNode) break;
    if (foundNode.children) {
      currentLevel = foundNode.children;
    }
  }
  
  return foundNode;
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
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentPathSegments, setCurrentPathSegments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [activeParents, setActiveParents] = useState(new Set());

  // 同步當前路徑
  useEffect(() => {
    const pathSegments = parsePathSegments(location.pathname);
    setCurrentPathSegments(pathSegments);
    
    // 根據路徑找到對應的節點
    const node = findNodeByPath(pathSegments);
    if (node) {
      setSelectedNode(node.slug);
    } else {
      setSelectedNode(null);
    }
  }, [location.pathname]);

  // 處理展開/收合
  const toggleExpand = (nodeSlug) => {
    setExpanded(prev => ({ ...prev, [nodeSlug]: !prev[nodeSlug] }));
  };

  // 生成節點的完整路徑
  const getNodePath = (targetSlug) => {
    const path = [];
    
    const findPath = (items, target, currentPath = []) => {
      for (const item of items) {
        const newPath = [...currentPath, item.slug];
        if (item.slug === target) {
          path.push(...newPath);
          return true;
        }
        if (item.children && findPath(item.children, target, newPath)) {
          return true;
        }
      }
      return false;
    };
    
    findPath(hierarchicalCategories, targetSlug);
    return path;
  };

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
    let filtered = [...mockProducts];

    // 根據搜尋詞篩選
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 根據當前路徑篩選產品
    if (currentPathSegments.length > 0) {
      filtered = filtered.filter(product => {
        // 檢查產品的 categoryPath 是否包含當前路徑的任一片段
        return product.categoryPath && currentPathSegments.some(segment => 
          product.categoryPath.includes(segment)
        );
      });
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, currentPathSegments, sortBy]);

  const handleAddToCart = p => addToCart(p);

  // 檢查一個分類是否應該顯示為活躍狀態（選中狀態）
  const isNodeSelected = (nodeSlug) => {
    return selectedNode === nodeSlug;
  };

  // 檢查一個分類是否是當前選中項目的父級
  const isNodeParent = (nodeSlug) => {
    if (!selectedNode) return false;
    const selectedPath = getNodePath(selectedNode);
    return selectedPath.includes(nodeSlug) && nodeSlug !== selectedNode;
  };

  // 生成節點的路由路徑
  const getNodeRoutePath = (nodeSlug) => {
    const pathSegments = getNodePath(nodeSlug);
    
    // 對於第一層分類，確保至少包含節點本身
    if (pathSegments.length === 0 && nodeSlug) {
      // 如果 getNodePath 返回空數組，但有 nodeSlug，說明這是第一層節點
      const foundInRoot = hierarchicalCategories.find(item => item.slug === nodeSlug);
      if (foundInRoot) {
        return generateRoutePath('/products', [nodeSlug]);
      }
    }
    
    return generateRoutePath('/products', pathSegments);
  };

  // 根據當前選中節點生成標題和面包屑
  const getDisplayInfo = () => {
    if (selectedNode) {
      const pathSegments = getNodePath(selectedNode);
      const pathNodes = [];
      
      let currentLevel = hierarchicalCategories;
      for (const segment of pathSegments) {
        const node = currentLevel.find(item => item.slug === segment);
        if (node) {
          pathNodes.push(node);
          if (node.children) currentLevel = node.children;
        }
      }
      
      const currentTitle = pathNodes.length > 0 ? pathNodes[pathNodes.length - 1].name : '全部商品';
      const breadcrumb = pathNodes.length > 0 ? pathNodes.map(n => n.name).join(' / ') : '全部類別';
      
      return { currentTitle, breadcrumb };
    }
    
    return { currentTitle: '全部商品', breadcrumb: '全部類別' };
  };
  
  const { currentTitle, breadcrumb } = getDisplayInfo();

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold font-chinese text-primary-btn">分類</h3>
                  <SortDropdown value={sortBy} onChange={setSortBy} size="sm" />
                </div>
                <nav className="space-y-1">
                  {/* 全部商品按鈕 */}
                  <Link
                    to="/products"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-chinese transition-all duration-300 ${
                      location.pathname === '/products'
                        ? 'bg-primary-btn text-btn-white shadow-sm' 
                        : 'text-lofi hover:bg-primary-btn/10 hover:text-primary-btn'
                    }`}
                  >
                    <span>全部商品</span>
                  </Link>
                  
                  {/* 分類導航 */}
                  {hierarchicalCategories.map(root => {
                    const rootExpanded = expanded[root.slug];
                    return (
                      <div key={root.slug}
                        onMouseEnter={() => setExpanded(e => ({...e, [root.slug]: true}))}
                        onMouseLeave={() => setExpanded(e => ({...e, [root.slug]: false}))}
                      >
                        <Link
                          to={getNodeRoutePath(root.slug)}
                          onClick={() => toggleExpand(root.slug)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-chinese transition-all duration-300 ${
                            isNodeSelected(root.slug) 
                              ? 'bg-primary-btn text-btn-white shadow-sm' 
                              : isNodeParent(root.slug)
                                ? 'bg-primary-btn/10 text-primary-btn font-medium'
                                : 'text-lofi hover:bg-primary-btn/10 hover:text-primary-btn'
                          }`}
                        >
                          <span>{root.name}</span>
                          {root.children && <ChevronDownIcon className={`w-4 h-4 transition-transform ${rootExpanded?'rotate-180':''}`} />}
                        </Link>
                        <div
                          className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-1 ${rootExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                          style={{ pointerEvents: rootExpanded ? 'auto' : 'none' }}
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
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-chinese transition-all duration-300 ${
                                    isNodeSelected(child.slug)
                                      ? 'bg-primary-btn/90 text-btn-white shadow-sm'
                                      : isNodeParent(child.slug)
                                        ? 'bg-primary-btn/10 text-primary-btn font-medium'
                                        : 'text-lofi hover:bg-primary-btn/10 hover:text-primary-btn'
                                  }`}
                                >
                                  <span>{child.name}</span>
                                  {hasGrand && <ChevronDownIcon className={`w-4 h-4 transition-transform ${childExpanded?'rotate-180':''}`} />}
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
                                          className={`block w-full flex items-center justify-between px-3 py-1.5 rounded text-sm font-chinese transition-all duration-300 ${
                                            isNodeSelected(grand.slug)
                                              ? 'bg-primary-btn/80 text-btn-white shadow-sm'
                                              : isNodeParent(grand.slug)
                                                ? 'bg-primary-btn/5 text-primary-btn font-medium'
                                                : 'text-lofi hover:bg-primary-btn/10 hover:text-primary-btn'
                                          }`}
                                        >
                                          <span>{grand.name}</span>
                                          {hasGreatGrand && <ChevronDownIcon className={`w-3 h-3 transition-transform ${grandExpanded?'rotate-180':''}`} />}
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

          <div className="lg:col-span-9">
            <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 bg-white/60 backdrop-blur-sm">
              <div className="aspect-[16/5] w-full bg-gradient-to-r from-[#EFEAE4] to-[#e6ddcf] flex items-center">
                <div className="px-10 py-8">
                  <h2 className="text-3xl font-bold font-chinese text-primary-btn mb-3">{currentTitle}</h2>
                  <p className="text-lofi font-chinese opacity-80 text-sm max-w-xl">精選 {breadcrumb} 系列商品，呈現簡約與質感的生活美學。</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end mb-4 lg:hidden">
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} id={`product-${p.id}`} className="product-item group">
                  <div className="product-card-minimal relative overflow-hidden">
                    <div className="imgbox">
                      {!p.inStock && <div className="badge-out font-chinese">缺貨</div>}
                      <Link to={`/product/${p.id}`} className="block w-full h-full">
                        <img src={p.image} alt={p.name} />
                      </Link>
                      {/* hover/focus 時才顯示操作列 */}
                      <button
                        className={`product-card-favcenter${favorites.has(p.id) ? ' active' : ''}`}
                        onClick={e => { e.preventDefault(); toggleFavorite(p.id); }}
                        aria-label="收藏"
                        tabIndex={0}
                        style={{ pointerEvents: 'auto', background: 'none', border: 'none', boxShadow: 'none' }}
                      >
                        {favorites.has(p.id)
                          ? <HeartSolidIcon className="w-8 h-8" />
                          : <HeartIcon className="w-8 h-8" />}
                      </button>
                      <button
                        className="product-card-cartbar"
                        onClick={e => { e.preventDefault(); handleAddToCart(p); }}
                        disabled={!p.inStock}
                        style={{ pointerEvents: 'auto' }}
                      >{p.inStock ? '加入購物車' : '暫時缺貨'}</button>
                    </div>
                    <div className="info font-chinese">
                      <Link to={`/product/${p.id}`}> <h3 className="title text-lofi hover:opacity-70 transition-opacity">{p.name}</h3></Link>
                      <div className="pricing">
                        <span className="price-tag font-bold">{formatPrice(p.price)}</span>
                        {p.originalPrice && <span className="price-original">{formatPrice(p.originalPrice)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="p-8 rounded-xl max-w-md mx-auto shadow-sm bg-white/80 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-2 font-chinese text-lofi">沒有找到相關商品</h3>
                  <p className="mb-4 font-chinese text-gray-500">請嘗試調整搜尋條件或篩選器</p>
                  <button onClick={()=>{setSearchTerm(''); setSelectedCategory('all');}} className="px-6 py-3 rounded-lg font-medium font-chinese transform hover:scale-105 transition-all duration-200 bg-primary-btn text-btn-white">清除篩選</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setShowFilters(false)} />
          <div className="absolute top-0 left-0 h-full w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold font-chinese text-primary-btn">篩選與搜尋</h3><button onClick={()=>setShowFilters(false)} className="btn-ghost font-chinese">關閉</button></div>
            <div className="mb-6"><label className="block text-sm font-medium mb-2 font-chinese text-lofi">排序</label><SortDropdown value={sortBy} onChange={setSortBy} /></div>
            <div>
              <h4 className="font-semibold mb-3 font-chinese text-primary-btn">分類</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat.id} onClick={()=>setSelectedCategory(cat.id)} className={`category-btn-lofi px-4 py-2 font-medium font-chinese ${selectedCategory===cat.id?'selected':''}`}>{cat.name}</button>
                ))}
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={()=>{setSearchTerm(''); setSelectedCategory('all'); setSortBy('name');}} className="btn-secondary flex-1 font-chinese">重設</button>
              <button onClick={()=>setShowFilters(false)} className="btn-primary flex-1 font-chinese">套用</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}