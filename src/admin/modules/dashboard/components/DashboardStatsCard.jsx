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
import { ADMIN_STYLES } from "@shared/adminStyles";

/**
 * ?–æ?? å?è¡?
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
 * çµ±è??¡ç?çµ„ä»¶
 * @param {Object} props - çµ„ä»¶å±¬æ€?
 * @param {string} props.title - ?¡ç?æ¨™é?
 * @param {string|number} props.value - ä¸»è??¸å€?
 * @param {string} props.subtitle - ?¯æ?é¡?
 * @param {string} props.icon - ?–æ??ç¨±
 * @param {string} props.color - é¡è‰²ä¸»é?
 * @param {Object} props.trend - è¶¨å‹¢è³‡è? {direction, percentage, color}
 * @param {boolean} props.loading - è¼‰å…¥?€??
 * @param {function} props.onClick - é»žæ?äº‹ä»¶
 * @param {string} props.className - é¡å??„CSSé¡žåˆ¥
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
  // ?²å??–æ?çµ„ä»¶
  const IconComponent = ICON_MAP[icon] || CubeIcon;
  
  // è¶¨å‹¢?–æ?
  const TrendIcon = trend?.direction === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  // è¼‰å…¥?€??
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
      
      {/* æ»‘é??¸å??ˆæ??‡ç¤º??*/}
      {onClick && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-[#cc824d]/20 transition-colors duration-200 pointer-events-none" />
      )}
    </motion.div>
  );
};

/**
 * çµ±è??¡ç?ç¶²æ ¼çµ„ä»¶
 * @param {Object} props - çµ„ä»¶å±¬æ€?
 * @param {Array} props.cards - ?¡ç?è³‡æ????
 * @param {string} props.columns - ç¶²æ ¼?—æ•¸ (2, 3, 4)
 * @param {string} props.className - é¡å??„CSSé¡žåˆ¥
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
 * çµ±è??¡ç??€å¡Šç?ä»¶ï?å¸¶æ?é¡Œï?
 * @param {Object} props - çµ„ä»¶å±¬æ€?
 * @param {string} props.title - ?€å¡Šæ?é¡?
 * @param {Array} props.cards - ?¡ç?è³‡æ????
 * @param {string} props.columns - ç¶²æ ¼?—æ•¸
 * @param {boolean} props.collapsible - ?¯å¦?¯æ‘º??
 * @param {boolean} props.defaultExpanded - ?è¨­?¯å¦å±•é?
 * @param {string} props.className - é¡å??„CSSé¡žåˆ¥
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
      {/* ?€å¡Šæ?é¡?*/}
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

      {/* çµ±è??¡ç?ç¶²æ ¼ */}
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
