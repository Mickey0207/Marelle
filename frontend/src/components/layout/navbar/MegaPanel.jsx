import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { getProductsByCategory } from '../../../../external_mock/data/products.mock';

const MegaPanel = ({
  activeRoot,
  setActiveRoot,
  panelMode,
  setPanelMode,
  activeLevel2,
  setActiveLevel2,
  activeLevel3,
  setActiveLevel3,
  categories
}) => {
  if (!activeRoot) return null;
  const topLevelCategories = categories;
  const rootCat = topLevelCategories.find(c => c.id === activeRoot);
  if (!rootCat) return null;
  const level2List = rootCat.children || [];
  const currentLevel2 = level2List.find(c => c.id === activeLevel2);
  const level3List = currentLevel2?.children || [];
  const currentLevel3 = level3List.find(c => c.id === activeLevel3);

  const getThumb = (catId) => {
    const p = getProductsByCategory(catId)[0];
    return p ? p.image : 'https://picsum.photos/seed/' + catId + '/160/160';
  };

  return (
    <div
      className="hidden lg:block absolute left-0 right-0 top-full z-40"
      onMouseLeave={() => { setActiveRoot(null); setActiveLevel2(null); setActiveLevel3(null); setPanelMode('root'); }}
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', boxShadow:'0 4px 24px -4px rgba(0,0,0,0.08)' }}
    >
      <div className="px-10 py-8" style={{maxWidth: '1750px', margin: '0 auto'}}>
        <div className="flex items-center mb-8">
          <nav className="flex items-center space-x-2 text-base font-chinese">
            <button
              onClick={() => { setPanelMode('root'); setActiveLevel2(null); setActiveLevel3(null); }}
              className="transition-colors hover:text-primary-btn"
              style={{ color: panelMode === 'root' ? '#CC824D' : '#666666' }}
            >
              {rootCat.name}
            </button>
            {panelMode !== 'root' && currentLevel2 && (
              <>
                <span style={{ color: '#999999' }}>/</span>
                <button
                  onClick={() => { setPanelMode('level2'); setActiveLevel3(null); }}
                  className="transition-colors hover:text-primary-btn"
                  style={{ color: panelMode === 'level2' ? '#CC824D' : '#666666' }}
                >
                  {currentLevel2.name}
                </button>
              </>
            )}
            {panelMode === 'level3' && currentLevel3 && (
              <>
                <span style={{ color: '#999999' }}>/</span>
                <span style={{ color: '#CC824D', fontWeight: 500 }}>
                  {currentLevel3.name}
                </span>
              </>
            )}
          </nav>
        </div>
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12">
            {panelMode === 'root' && (
              <div className="grid gap-6" style={{gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))'}}>
                {level2List.map(l2 => (
                  <div key={l2.id} className="group">
                    <Link to={l2.href} onClick={() => { setActiveRoot(null); setActiveLevel2(null); setActiveLevel3(null); setPanelMode('root'); }}>
                      <div className="w-full aspect-[1/1] rounded-xl overflow-hidden mb-3 bg-white/30 ring-1 ring-white/40 backdrop-blur-sm relative shadow-sm cursor-pointer">
                        <img src={getThumb(l2.id)} alt={l2.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        {l2.children && l2.children.length>0 && (
                          <span
                            className="absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-full bg-primary-btn text-white tracking-wider font-medium shadow-lg hover:bg-opacity-90 transition-all z-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveLevel2(l2.id);
                              setPanelMode('level2');
                            }}
                          >
                            更多
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link
                      to={l2.href}
                      onClick={() => { setActiveRoot(null); setActiveLevel2(null); setActiveLevel3(null); setPanelMode('root'); }}
                      className="block text-xs text-center font-chinese tracking-wide hover:text-primary-btn transition-colors"
                      style={{color:'#444'}}
                    >
                      {l2.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {panelMode === 'level2' && (
              <div className="grid gap-6" style={{gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))'}}>
                {level3List.map(l3 => (
                  <div key={l3.id} className="group">
                    <Link to={l3.href} onClick={() => { setActiveRoot(null); setActiveLevel2(null); setActiveLevel3(null); setPanelMode('root'); }}>
                      <div className="w-full aspect-[1/1] rounded-xl overflow-hidden mb-3 bg-white/30 ring-1 ring-white/40 backdrop-blur-sm relative shadow-sm cursor-pointer">
                        <img src={getThumb(l3.id)} alt={l3.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        {l3.children && l3.children.length>0 && (
                          <span
                            className="absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-full bg-primary-btn text-white tracking-wider font-medium shadow-lg hover:bg-opacity-90 transition-all z-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveLevel3(l3.id);
                              setPanelMode('level3');
                            }}
                          >
                            更多
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link
                      to={l3.href}
                      onClick={() => { setActiveRoot(null); setActiveLevel2(null); setActiveLevel3(null); setPanelMode('root'); }}
                      className="block text-xs text-center font-chinese tracking-wide hover:text-primary-btn transition-colors"
                      style={{color:'#444'}}
                    >
                      {l3.name}
                    </Link>
                  </div>
                ))}
                {level3List.length === 0 && (
                  <div className="text-sm text-gray-500">此分類沒有進一步子分類。</div>
                )}
              </div>
            )}
            {panelMode === 'level3' && (
              <div className="grid gap-6" style={{gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))'}}>
                {(currentLevel3?.children || []).map(l4 => (
                  <div key={l4.id} className="group">
                    <Link to={l4.href} onClick={() => { setActiveRoot(null); setActiveLevel2(null); setActiveLevel3(null); setPanelMode('root'); }} className="block">
                      <div className="w-full aspect-[1/1] rounded-xl overflow-hidden mb-3 bg-white/30 ring-1 ring-white/40 backdrop-blur-sm relative shadow-sm cursor-pointer">
                        <img src={getThumb(l4.id)} alt={l4.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="text-xs text-center font-chinese tracking-wide hover:text-primary-btn transition-colors" style={{color:'#444'}}>{l4.name}</div>
                    </Link>
                  </div>
                ))}
                {(!currentLevel3 || (currentLevel3.children||[]).length===0) && (
                  <div className="text-sm text-gray-500">此分類沒有進一步子分類。</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaPanel;
