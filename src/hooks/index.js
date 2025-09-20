import { useState, useEffect } from 'react';

// 購物車 Hook
export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('marelle-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('marelle-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount
  };
};

// 本地儲存 Hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// GSAP 動畫 Hook
export const useGSAPAnimation = () => {
  const fadeInUp = (elements, options = {}) => {
    const { delay = 0, stagger = 0.2, duration = 0.8 } = options;
    
    if (window.gsap) {
      window.gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'power2.out',
        }
      );
    }
  };

  const scaleIn = (elements, options = {}) => {
    const { delay = 0, duration = 0.6 } = options;
    
    if (window.gsap) {
      window.gsap.fromTo(
        elements,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: 'back.out(1.7)',
        }
      );
    }
  };

  const slideInLeft = (elements, options = {}) => {
    const { delay = 0, duration = 0.8 } = options;
    
    if (window.gsap) {
      window.gsap.fromTo(
        elements,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration,
          delay,
          ease: 'power2.out',
        }
      );
    }
  };

  return {
    fadeInUp,
    scaleIn,
    slideInLeft
  };
};