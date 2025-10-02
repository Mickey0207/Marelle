import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// 負責統一管理路由切換的捲動行為：
// 1. 一般頁面切換 => 自動滾到最上方
// 2. 商品列表 (/products...) ↔ 商品詳細 (/product/:id) ：
//    - 進入商品詳細時記錄列表卷軸位置並捲到頂部
//    - 從商品詳細返回商品列表時還原原本的卷軸位置
// 其餘情況一律重置至頂端
const ScrollManager = () => {
  const location = useLocation();
  const prevLocationRef = useRef(location);
  const productListScrollRef = useRef(0);

  const isProductsList = (path) => path.startsWith('/products'); // 列表路徑 (含 /products 與其子路徑)
  const isProductDetail = (path) => path.startsWith('/product/'); // 詳細頁路徑

  useEffect(() => {
    const prev = prevLocationRef.current;
    const current = location;

    const forceInstant = (y = 0) => {
      // 臨時將 root 的 scroll-behavior 設為 auto 以避免全域 smooth 影響
      const root = document.documentElement;
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, y);
      // 還原為 auto（保持不平滑）
      root.style.scrollBehavior = prevBehavior || 'auto';
    };

    // 列表 -> 詳細：記錄位置並瞬間到頂
    if (isProductsList(prev.pathname) && isProductDetail(current.pathname)) {
      productListScrollRef.current = window.scrollY;
      forceInstant(0);
    }
    // 詳細 -> 列表：平滑恢復列表位置 (唯一需要動畫的情境)
    else if (isProductDetail(prev.pathname) && isProductsList(current.pathname)) {
      const targetY = productListScrollRef.current || 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const root = document.documentElement;
          const prevBehavior = root.style.scrollBehavior;
          root.style.scrollBehavior = 'smooth';
          window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
          // 動畫結束後 (估計 600ms) 還原為 auto, 只保留此流程的平滑
          setTimeout(() => { root.style.scrollBehavior = 'auto'; }, 650);
        });
      });
    }
    // 其它任意路由切換：直接瞬間滾到頂部（無動畫）
    else {
      forceInstant(0);
    }

    prevLocationRef.current = current;
  }, [location]);

  return null;
};

export default ScrollManager;
