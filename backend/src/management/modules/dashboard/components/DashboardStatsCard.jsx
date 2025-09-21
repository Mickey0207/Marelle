import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UsersIcon,
  UserGroupIcon,
  UserPlusIcon,
  TruckIcon,
  CheckCircleIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ComputerDesktopIcon,
  BellIcon,
  ServerIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../../shared/styles/adminStyles";

/**
 * 分析分析�?
 */
const ICON_MAP = {
  ShoppingBagIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UsersIcon,
  UserGroupIcon,
  UserPlusIcon,
  TruckIcon,
  CheckCircleIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ComputerDesktopIcon,
  BellIcon,
  ServerIcon,
  ChartBarIcon,
  BuildingOfficeIcon
};

/**
 * 統�?分析組件
 * @param {Object} props - 組件屬�?
 * @param {string} props.title - 分析標�?
 * @param {string|number} props.value - 主�?分析
 * @param {string} props.subtitle - 分析�?
 * @param {string} props.icon - 分析?�稱
 * @param {string} props.color - 顏色主�?
 * @param {Object} props.trend - 趨勢資�? {direction, percentage, color}
 * @param {boolean} props.loading - 載入分析?
 * @param {function} props.onClick - 點�?事件
 * @param {string} props.className - 額�??�CSS類別
 */
const DashboardStatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'text-blue-600',
  trend,
  loading = false,
  onClick,
  className = ''
}) => {
  // 分析分析組件
  const IconComponent = ICON_MAP[icon] || CubeIcon;
  
  // 趨勢分析
  const TrendIcon = trend?.direction === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  // 載入分析?
  if (loading) {
    return (
      <div className={`${ADMIN_STYLES.statCard} animate-pulse ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-xl bg-gray-200">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${ADMIN_STYLES.statCard} ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { y: -2 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl bg-gray-50/50`}>
          <IconComponent className={`w-6 h-6 ${color}`} />
        </div>
        
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 font-chinese mb-1">
            {title}
          </p>
          
          <div className="flex items-baseline mb-1">
            <p className="text-2xl font-bold text-gray-900">
              {value}
            </p>
            
            {trend && (
              <div className={`ml-2 flex items-center text-sm font-medium ${trend.color}`}>
                <TrendIcon className="w-4 h-4 mr-1" />
                <span>{trend.percentage.toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-gray-500 font-chinese">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* 滑�?分析分析?�示??*/}
      {onClick && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-[#cc824d]/20 transition-colors duration-200 pointer-events-none" />
      )}
    </motion.div>
  );
};

/**
 * 統�?分析網格組件
 * @param {Object} props - 組件屬�?
 * @param {Array} props.cards - 分析資�????
 * @param {string} props.columns - 網格?�數 (2, 3, 4)
 * @param {string} props.className - 額�??�CSS類別
 */
export const DashboardStatsGrid = ({ 
  cards = [], 
  columns = '4',
  className = ''
}) => {
  const gridClass = {
    '2': ADMIN_STYLES.gridCols2,
    '3': ADMIN_STYLES.gridCols3,
    '4': ADMIN_STYLES.gridCols4
  }[columns] || ADMIN_STYLES.gridCols4;

  return (
    <div className={`${gridClass} gap-6 ${className}`}>
      {cards.map((card, index) => (
        <DashboardStatsCard
          key={card.id || index}
          {...card}
        />
      ))}
    </div>
  );
};

/**
 * 統�?分析?�塊�?件�?帶�?題�?
 * @param {Object} props - 組件屬�?
 * @param {string} props.title - ?�塊�分析
 * @param {Array} props.cards - 分析資�????
 * @param {string} props.columns - 網格?�數
 * @param {boolean} props.collapsible - ?�否?�摺??
 * @param {boolean} props.defaultExpanded - ?�設?�否展�?
 * @param {string} props.className - 額�??�CSS類別
 */
export const DashboardStatsBlock = ({
  title,
  cards = [],
  columns = '4',
  collapsible = false,
  defaultExpanded = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ?�塊�分析*/}
      <div className="flex items-center justify-between">
        <h2 
          className={`text-xl font-bold text-gray-900 font-chinese ${collapsible ? 'cursor-pointer hover:text-[#cc824d] transition-colors' : ''}`}
          onClick={toggleExpanded}
        >
          {title}
          {collapsible && (
            <motion.span
              className="ml-2 inline-block"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ??
            </motion.span>
          )}
        </h2>
      </div>

      {/* 統�?分析網格 */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <DashboardStatsGrid 
          cards={cards} 
          columns={columns}
        />
      </motion.div>
    </div>
  );
};

export default DashboardStatsCard;
