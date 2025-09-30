import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 初始狀態
const initialState = {
  // 全局設定
  settings: {
    theme: 'light',
    language: 'zh-TW',
    currency: 'TWD',
    timezone: 'Asia/Taipei'
  },
  
  // 統計數據
  stats: {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    loading: false
  },
  
  // 通知系統
  notifications: [],
  
  // 載入狀態
  loading: {
    global: false,
    dashboard: false,
    products: false,
    orders: false,
    customers: false
  },
  
  // 錯誤狀態
  errors: {}
  ,
  // 登入狀態
  auth: {
    currentUser: null,
  }
};

// Action 類型
export const ACTION_TYPES = {
  // 設定相關
  SET_SETTING: 'SET_SETTING',
  SET_SETTINGS: 'SET_SETTINGS',
  
  // 統計數據
  SET_STATS: 'SET_STATS',
  UPDATE_STAT: 'UPDATE_STAT',
  SET_STATS_LOADING: 'SET_STATS_LOADING',
  
  // 通知系統
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // 載入狀態
  SET_LOADING: 'SET_LOADING',
  SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
  
  // 錯誤處理
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_SETTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ACTION_TYPES.SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
      
    case ACTION_TYPES.SET_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };
      
    case ACTION_TYPES.UPDATE_STAT:
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ACTION_TYPES.SET_STATS_LOADING:
      return {
        ...state,
        stats: {
          ...state.stats,
          loading: action.payload
        }
      };
      
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            timestamp: new Date(),
            ...action.payload
          }
        ]
      };
      
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
      
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ACTION_TYPES.SET_GLOBAL_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          global: action.payload
        }
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        }
      };
      
    case ACTION_TYPES.CLEAR_ERROR:
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors
      };
      
    case ACTION_TYPES.CLEAR_ALL_ERRORS:
      return {
        ...state,
        errors: {}
      };
    
    case 'SET_CURRENT_USER':
      return {
        ...state,
        auth: {
          ...state.auth,
          currentUser: action.payload || null,
        }
      }
      
    default:
      return state;
  }
};

// Context
const AppStateContext = createContext();

// Provider
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 載入設定
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({
          type: ACTION_TYPES.SET_SETTINGS,
          payload: settings
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // 保存設定
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Action creators
  const actions = {
    // 設定相關
    setSetting: (key, value) => {
      dispatch({
        type: ACTION_TYPES.SET_SETTING,
        payload: { key, value }
      });
    },
    
    setSettings: (settings) => {
      dispatch({
        type: ACTION_TYPES.SET_SETTINGS,
        payload: settings
      });
    },
    
    // 統計數據
    setStats: (stats) => {
      dispatch({
        type: ACTION_TYPES.SET_STATS,
        payload: stats
      });
    },
    
    updateStat: (key, value) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_STAT,
        payload: { key, value }
      });
    },
    
    setStatsLoading: (loading) => {
      dispatch({
        type: ACTION_TYPES.SET_STATS_LOADING,
        payload: loading
      });
    },
    
    // 通知系統
    addNotification: (notification) => {
      dispatch({
        type: ACTION_TYPES.ADD_NOTIFICATION,
        payload: notification
      });
      
      // 自動移除通知 (可選)
      if (notification.autoRemove !== false) {
        setTimeout(() => {
          actions.removeNotification(notification.id || Date.now());
        }, notification.duration || 5000);
      }
    },
    
    removeNotification: (id) => {
      dispatch({
        type: ACTION_TYPES.REMOVE_NOTIFICATION,
        payload: id
      });
    },
    
    clearNotifications: () => {
      dispatch({
        type: ACTION_TYPES.CLEAR_NOTIFICATIONS
      });
    },
    
    // 載入狀態
    setLoading: (key, value) => {
      dispatch({
        type: ACTION_TYPES.SET_LOADING,
        payload: { key, value }
      });
    },
    
    setGlobalLoading: (loading) => {
      dispatch({
        type: ACTION_TYPES.SET_GLOBAL_LOADING,
        payload: loading
      });
    },
    
    // 錯誤處理
    setError: (key, error) => {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: { key, error }
      });
    },
    
    clearError: (key) => {
      dispatch({
        type: ACTION_TYPES.CLEAR_ERROR,
        payload: key
      });
    },
    
    clearAllErrors: () => {
      dispatch({
        type: ACTION_TYPES.CLEAR_ALL_ERRORS
      });
    },
    setCurrentUser: (user) => dispatch({ type: 'SET_CURRENT_USER', payload: user }),
    // 嘗試使用 refresh cookie 自動登入
    async tryAutoLogin(api) {
      try {
        const profile = await api.me()
        actions.setCurrentUser(profile)
        return profile
      } catch (_) {
        // ignore
        return null
      }
    }
  };

  return (
    <AppStateContext.Provider value={{ state, actions }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

// 便利的 hooks
export const useNotifications = () => {
  const { state, actions } = useAppState();
  return {
    notifications: state.notifications,
    addNotification: actions.addNotification,
    removeNotification: actions.removeNotification,
    clearNotifications: actions.clearNotifications
  };
};

export const useLoading = (key) => {
  const { state, actions } = useAppState();
  return {
    loading: key ? state.loading[key] : state.loading.global,
    setLoading: (value) => actions.setLoading(key, value),
    setGlobalLoading: actions.setGlobalLoading
  };
};

export const useError = (key) => {
  const { state, actions } = useAppState();
  return {
    error: state.errors[key],
    setError: (error) => actions.setError(key, error),
    clearError: () => actions.clearError(key)
  };
};