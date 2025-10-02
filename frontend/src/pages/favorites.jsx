import { useEffect, useState } from 'react';
import FavoritesHeader from '../components/favorites/FavoritesHeader.jsx';
import FavoritesList from '../components/favorites/FavoritesList.jsx';

// 簡易收藏示意: 先以 localStorage 存一個陣列 key: marelle_favorites
// 未實作商品加入收藏流程，僅顯示空狀態與結構
export default function Favorites() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('marelle_favorites');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      // ignore parse error
    }
  }, []);

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto" style={{color:'#444'}}>
      <FavoritesHeader />
      <FavoritesList items={items} />
    </div>
  );
}
