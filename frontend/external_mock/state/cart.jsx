// external_mock/state/cart.js
// 暫存購物車（純前端 mock 狀態層），未來可改為使用全域 state 管理或 API 同步
import { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'marelle:cart:v1';
const SCHEMA_VERSION = 1;
const STORAGE_TTL_DAYS = 60; // 清理期限：60 天

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!data || data.schemaVersion !== SCHEMA_VERSION) return [];
    if (data.updatedAt && Date.now() - new Date(data.updatedAt).getTime() > STORAGE_TTL_DAYS * 86400000) {
      // 過期視為空車
      return [];
    }
    if (Array.isArray(data.items)) return data.items;
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  try {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      items
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 忽略配額錯誤或序列化錯誤
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadFromStorage());
  const saveTimer = useRef(null);

  // 將變更寫入 localStorage（簡單防抖）
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToStorage(items);
      saveTimer.current = null;
    }, 250);
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, [items]);

  const addToCart = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const cartTotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const cartItemsCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(() => ({
    cartItems: items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemsCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
