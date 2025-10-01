import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { HeartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts, getProductsByCategory, getProductsByCategoryPath } from "../../../external_mock/data/products.mock.js";
import { categories, findCategoryById, getCategoryPath } from "../../../external_mock/data/categories.js";
import { formatPrice } from "../../../external_mock/data/format.js";
import { useCart } from "../../../external_mock/state/cart.jsx";
import SortDropdown from "../../components/ui/SortDropdown.jsx";
import { getProductTags, getTagConfig } from "../../../external_mock/data/productTags.js";

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

    // 根據當前選中的分類節點篩選產品
    if (selectedNode) {
      filtered = getProductsByCategory(selectedNode);
      
      // 如果有搜尋詞,在已篩選的結果中再次搜尋
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
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
            <div className="mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
              <div className="border-b pb-5 xs:pb-6 sm:pb-7 md:pb-8" style={{borderColor: '#E5E7EB'}}>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-light font-chinese tracking-tight mb-2 xs:mb-3 sm:mb-4 md:mb-4" style={{color: '#333333'}}>
                  {currentTitle}
                </h1>
                <p className="text-xs xs:text-xs sm:text-sm md:text-sm font-chinese" style={{color: '#999999', letterSpacing: '0.05em'}}>
                  {breadcrumb}
                </p>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 xs:mb-7 sm:mb-8 md:mb-8 gap-3 xs:gap-4 sm:gap-0">
              <p className="text-xs xs:text-sm sm:text-sm md:text-sm font-chinese" style={{color: '#999999'}}>
                顯示 {filteredProducts.length} 個商品
              </p>
              <div className="hidden sm:block w-full xs:w-auto sm:w-auto">
                <SortDropdown value={sortBy} onChange={setSortBy} size="sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 xs:gap-x-4 sm:gap-x-5 md:gap-x-6 lg:gap-x-6 gap-y-8 xs:gap-y-10 sm:gap-y-12 md:gap-y-12">
              {filteredProducts.map(p => {
                const tags = getProductTags(p);
                const primaryTag = tags[0] ? getTagConfig(tags[0]) : null;
                
                return (
                  <div key={p.id} id={`product-${p.id}`} className="group">
                    <Link to={`/product/${p.id}`} className="block">
                      <div className="relative mb-3 xs:mb-3.5 sm:mb-4 md:mb-4 overflow-hidden bg-white rounded-lg" style={{aspectRatio: '1/1'}}>
                        {primaryTag && (
                          <div 
                            className="absolute top-2 xs:top-3 sm:top-3 md:top-4 left-2 xs:left-3 sm:left-3 md:left-4 z-10 px-2 xs:px-3 sm:px-3 md:px-4 py-1 xs:py-1 sm:py-1.5 md:py-1.5 text-[10px] xs:text-xs sm:text-xs md:text-xs font-semibold font-chinese tracking-widest uppercase shadow-lg"
                            style={{
                              background: primaryTag.bgColor,
                              color: primaryTag.textColor,
                              border: `2px solid ${primaryTag.borderColor}`,
                              borderRadius: '4px',
                              backdropFilter: 'blur(8px)'
                            }}
                          >
                            {primaryTag.label}
                          </div>
                        )}
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      
                      {/* Hover overlay with actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                        <div className="absolute bottom-3 xs:bottom-4 sm:bottom-5 md:bottom-6 left-0 right-0 flex justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3 px-2 xs:px-3 sm:px-4 md:px-4">
                          <button
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation();
                              toggleFavorite(p.id); 
                            }}
                            className="w-10 xs:w-11 sm:w-12 md:w-12 h-10 xs:h-11 sm:h-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                            style={{
                              background: 'rgba(255,255,255,0.95)',
                              color: favorites.has(p.id) ? '#CC824D' : '#666666'
                            }}
                            aria-label="收藏"
                          >
                            {favorites.has(p.id)
                              ? <HeartSolidIcon className="w-4 xs:w-5 sm:w-5 md:w-5 h-4 xs:h-5 sm:h-5 md:h-5" />
                              : <HeartIcon className="w-4 xs:w-5 sm:w-5 md:w-5 h-4 xs:h-5 sm:h-5 md:h-5" />}
                          </button>
                          
                          {p.inStock && (
                            <button
                              onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                handleAddToCart(p); 
                              }}
                              className="px-3 xs:px-4 sm:px-5 md:px-6 h-10 xs:h-11 sm:h-12 md:h-12 rounded-full font-chinese text-xs xs:text-xs sm:text-sm md:text-sm font-medium tracking-wide transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center"
                              style={{
                                background: '#CC824D',
                                color: '#FFFFFF'
                              }}
                            >
                              加入購物車
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Product info */}
                    <div className="text-center px-1 xs:px-1.5 sm:px-2 md:px-2">
                      <h3 className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 transition-colors duration-200 line-clamp-2" 
                        style={{color: '#333333', letterSpacing: '0.02em'}}>
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3">
                        <span className="font-chinese text-sm xs:text-sm sm:text-base md:text-base lg:text-lg" style={{color: '#CC824D', fontWeight: 500}}>
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm line-through" style={{color: '#CCCCCC'}}>
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                );
              })}
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
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setShowFilters(false)} />
          <div className="absolute top-0 right-0 h-full w-80 bg-white p-8 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
              <h3 className="font-medium font-chinese text-sm tracking-[0.15em] uppercase" style={{color: '#333333'}}>
                篩選與排序
              </h3>
              <button 
                onClick={()=>setShowFilters(false)} 
                className="text-sm font-chinese transition-colors duration-200"
                style={{color: '#999999'}}
                onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                onMouseLeave={(e) => e.target.style.color = '#999999'}
              >
                關閉
              </button>
            </div>
            
            <div className="mb-8">
              <label className="block text-xs font-medium mb-4 font-chinese tracking-wider uppercase" style={{color: '#666666'}}>
                排序方式
              </label>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
            
            <div className="mb-8">
              <h4 className="text-xs font-medium mb-4 font-chinese tracking-wider uppercase" style={{color: '#666666'}}>
                商品分類
              </h4>
              <nav className="space-y-1">
                <Link
                  to="/products"
                  onClick={() => setShowFilters(false)}
                  className="block py-2.5 text-sm font-chinese transition-colors duration-200"
                  style={{color: location.pathname === '/products' ? '#CC824D' : '#666666'}}
                >
                  全部商品
                </Link>
                {hierarchicalCategories.map(root => (
                  <div key={root.slug}>
                    <Link
                      to={getNodeRoutePath(root.slug)}
                      onClick={() => setShowFilters(false)}
                      className="block py-2.5 text-sm font-chinese transition-colors duration-200"
                      style={{
                        color: (isNodeSelected(root.slug) || isNodeParent(root.slug)) ? '#CC824D' : '#666666'
                      }}
                    >
                      {root.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
            
            <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
              <button 
                onClick={()=>{
                  setSearchTerm(''); 
                  setSelectedNode(null); 
                  setSortBy('name');
                  setShowFilters(false);
                }} 
                className="w-full py-3 font-chinese text-sm font-medium tracking-wider transition-all duration-300"
                style={{
                  border: '1px solid #CC824D',
                  color: '#CC824D',
                  background: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#CC824D';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#FFFFFF';
                  e.target.style.color = '#CC824D';
                }}
              >
                重設篩選
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}