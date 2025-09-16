import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { HeartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts, categories, formatPrice } from '../utils/data';
import { useCart } from '../hooks';
import SortDropdown from '../components/SortDropdown';

const hierarchicalCategories = [
  { id: 'root-living', name: '家居生活', children: [ { id: 'home', name: '家居'}, { id: 'lifestyle', name: '生活用品'} ] },
  { id: 'root-scent', name: '香氛茶飲', children: [ { id: 'fragrance', name: '香氛'}, { id: 'tea', name: '茶品'} ] },
  { id: 'root-fashion', name: '穿搭配件', children: [ { id: 'accessories', name: '配件'}, { id: 'clothing', name: '服飾'} ] }
];

const hierarchyToBaseCategory = {
  home: 'home', lifestyle: 'lifestyle', fragrance: 'fragrance', tea: 'tea', accessories: 'accessories', clothing: 'clothing'
};

function findNodePath(targetId) {
  if (!targetId) return [];
  const path = [];
  function dfs(nodes, trail) {
    for (const n of nodes) {
      const next = [...trail, n];
      if (n.id === targetId) { path.push(...next); return true; }
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // 同步 URL 參數 ( ?cat=home )
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat && hierarchyToBaseCategory[cat]) {
      setSelectedCategory(cat);
      setSelectedNode(cat);
    }
  }, [location.search]);

                        {/* 此區塊移除，正確的 rootExpanded 用法已在下方 map 內部 */}
  const handleAddToCart = p => addToCart(p);

  const path = findNodePath(selectedNode || '');
  const currentTitle = path.slice(-1)[0]?.name || '全部商品';
  const breadcrumb = path.length ? path.map(n=>n.name).join(' / ') : '全部類別';

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
                  {hierarchicalCategories.map(root => {
                    const rootExpanded = expanded[root.id];
                    return (
                      <div key={root.id}
                        onMouseEnter={() => setExpanded(e => ({...e, [root.id]: true}))}
                        onMouseLeave={() => setExpanded(e => ({...e, [root.id]: false}))}
                      >
                        <button
                          onClick={() => { toggleExpand(root.id); handleSelectNode(root); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-chinese transition-colors ${selectedNode === root.id ? 'bg-primary-btn text-btn-white':'text-lofi hover:bg-white/70'}`}
                        >
                          <span>{root.name}</span>
                          {root.children && <ChevronDownIcon className={`w-4 h-4 transition-transform ${rootExpanded?'rotate-180':''}`} />}
                        </button>
                        <div
                          className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-1 ${rootExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                          style={{ pointerEvents: rootExpanded ? 'auto' : 'none' }}
                        >
                          {root.children && root.children.map(child => {
                            const childExpanded = expanded[child.id];
                            const hasGrand = !!child.children;
                            return (
                              <div key={child.id}
                                onMouseEnter={() => setExpanded(e => ({...e, [child.id]: true, [root.id]: true}))}
                                onMouseLeave={() => setExpanded(e => ({...e, [child.id]: false}))}
                              >
                                <button
                                  onClick={() => { if(hasGrand) toggleExpand(child.id); handleSelectNode(child); }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-chinese transition-colors ${selectedNode===child.id?'bg-primary-btn/90 text-btn-white':'text-lofi hover:bg-white/70'}`}
                                >
                                  <span>{child.name}</span>
                                  {hasGrand && <ChevronDownIcon className={`w-4 h-4 transition-transform ${childExpanded?'rotate-180':''}`} />}
                                </button>
                                <div
                                  className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-1 ${hasGrand && childExpanded ? 'sidebar-anim-expand' : 'sidebar-anim-collapse'}`}
                                  style={{ pointerEvents: hasGrand && childExpanded ? 'auto' : 'none' }}
                                >
                                  {hasGrand && child.children && child.children.map(grand => (
                                    <button key={grand.id} onClick={() => handleSelectNode(grand)} className={`w-full text-left px-3 py-1.5 rounded text-sm font-chinese transition-colors ${selectedNode===grand.id?'bg-primary-btn/80 text-btn-white':'text-lofi hover:bg-white/70'}`}>{grand.name}</button>
                                  ))}
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
                      <Link to={`/products/${p.id}`} className="block w-full h-full">
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
                      <Link to={`/products/${p.id}`}> <h3 className="title text-lofi hover:opacity-70 transition-opacity">{p.name}</h3></Link>
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