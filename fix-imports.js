/**
 * 批量修復 import 路徑腳本
 * 用於修復專案重構後的路徑問題
 */

const fs = require('fs');
const path = require('path');

// 路徑映射規則
const pathMappings = {
  // 前台組件路徑映射
  './components/Navbar': './components/layout/Navbar',
  './components/Footer': './components/layout/Footer',
  '../components/Navbar': '../components/layout/Navbar',
  '../components/Footer': '../components/layout/Footer',
  './components/SortDropdown': './components/ui/SortDropdown',
  '../components/SortDropdown': '../components/ui/SortDropdown',
  './components/GlassModal': './components/ui/GlassModal',
  '../components/GlassModal': '../components/ui/GlassModal',
  './components/SearchableSelect': './components/ui/SearchableSelect',
  '../components/SearchableSelect': '../components/ui/SearchableSelect',
  './components/StandardTable': './components/ui/StandardTable',
  '../components/StandardTable': '../components/ui/StandardTable',
  './components/ProductVariantSelector': './components/product/ProductVariantSelector',
  '../components/ProductVariantSelector': '../components/product/ProductVariantSelector',
  './components/DynamicPriceDisplay': './components/product/DynamicPriceDisplay',
  '../components/DynamicPriceDisplay': '../components/product/DynamicPriceDisplay',
  './components/StockStatusIndicator': './components/product/StockStatusIndicator',
  '../components/StockStatusIndicator': '../components/product/StockStatusIndicator',

  // Admin 模組路徑映射
  './styles/adminStyles': './shared/adminStyles',
  '../styles/adminStyles': '../shared/adminStyles',
  '../../styles/adminStyles': '../../shared/adminStyles',
  '../../../styles/adminStyles': '../../../shared/adminStyles',
  
  './data/adminDataManager': './shared/data/adminDataManager',
  '../data/adminDataManager': '../shared/data/adminDataManager',
  '../../data/adminDataManager': '../../shared/data/adminDataManager',
  '../../../data/adminDataManager': '../../../shared/data/adminDataManager',
  
  './data/supplierDataManager': './shared/data/supplierDataManager',
  '../data/supplierDataManager': '../shared/data/supplierDataManager',
  '../../data/supplierDataManager': '../../shared/data/supplierDataManager',
  
  './data/logisticsDataManager': './shared/data/logisticsDataManager',
  '../data/logisticsDataManager': '../shared/data/logisticsDataManager',
  '../../data/logisticsDataManager': '../../shared/data/logisticsDataManager',
  
  './data/accountingDataManager': './shared/data/accountingDataManager',
  '../data/accountingDataManager': '../shared/data/accountingDataManager',
  '../../data/accountingDataManager': '../../shared/data/accountingDataManager',
  
  './data/documentDataManager': './shared/data/documentDataManager',
  '../data/documentDataManager': '../shared/data/documentDataManager',
  '../../data/documentDataManager': '../../shared/data/documentDataManager',
  
  './data/giftDataManager': './shared/data/giftDataManager',
  '../data/giftDataManager': '../shared/data/giftDataManager',
  '../../data/giftDataManager': '../../shared/data/giftDataManager',
  
  './data/procurementDataManager': './shared/data/procurementDataManager',
  '../data/procurementDataManager': '../shared/data/procurementDataManager',
  '../../data/procurementDataManager': '../../shared/data/procurementDataManager',

  // 共享組件路徑映射
  './components/StandardTable': './shared/components/StandardTable',
  '../components/StandardTable': '../shared/components/StandardTable',
  '../../components/StandardTable': '../../shared/components/StandardTable',
  
  './components/CustomSelect': './shared/components/CustomSelect',
  '../components/CustomSelect': '../shared/components/CustomSelect',
  '../../components/CustomSelect': '../../shared/components/CustomSelect',
  
  './components/QRCodeGenerator': './shared/components/QRCodeGenerator',
  '../components/QRCodeGenerator': '../shared/components/QRCodeGenerator',
  '../../components/QRCodeGenerator': '../../shared/components/QRCodeGenerator',
  
  './components/SystemSettingsOverview': './shared/components/SystemSettingsOverview',
  '../components/SystemSettingsOverview': '../shared/components/SystemSettingsOverview',
  '../../components/SystemSettingsOverview': '../../shared/components/SystemSettingsOverview',
  
  './components/AnalyticsOverview': './shared/components/AnalyticsOverview',
  '../components/AnalyticsOverview': '../shared/components/AnalyticsOverview',
  '../../components/AnalyticsOverview': '../../shared/components/AnalyticsOverview',

  // 新模組結構路徑映射
  './pages/Orders': './modules/orders/pages/Orders',
  './pages/Products': './modules/products/pages/Products',
  './pages/Inventory': './modules/products/pages/Inventory',
  './pages/Overview': './modules/dashboard/pages/Overview',
  './pages/SalesAnalytics': './modules/dashboard/pages/SalesAnalytics',
  './pages/OperationsManagement': './modules/dashboard/pages/OperationsManagement',
  './pages/FinanceReports': './modules/dashboard/pages/FinanceReports',
  './pages/LogisticsManagement': './modules/dashboard/pages/LogisticsManagement',
  
  './components/DashboardTabs': './modules/dashboard/components/DashboardTabs',
  './components/DashboardStatsCard': './modules/dashboard/components/DashboardStatsCard',
  './components/DashboardStatsSection': './modules/dashboard/components/DashboardStatsSection',
  
  './utils/dashboardStatsManager': './modules/dashboard/utils/dashboardStatsManager',
  '../utils/dashboardStatsManager': '../modules/dashboard/utils/dashboardStatsManager',

  // 子頁面路徑映射
  './orders/OrderList': './OrderList',
  './coupons/CouponList': './CouponList',
  './coupons/CouponDetails': './CouponDetails',
  './coupons/CouponForm': './CouponForm',
  './coupons/SharingManager': './SharingManager',
  './coupons/StackingRulesManager': './StackingRulesManager',

  // 跨模組路徑調整
  '../../utils/data': '../../../utils/data',
  '../../components/SearchableSelect': '../../shared/components/SearchableSelect'
};

// 獲取所有需要處理的文件
function getAllJsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        traverse(fullPath);
      } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// 修復單個文件的 import 路徑
function fixImportsInFile(filePath) {
  console.log(`正在處理: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 遍歷所有路徑映射規則
    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      // 匹配 import 語句中的路徑
      const importRegex = new RegExp(`(import\\s+[^'"]+['"])(${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(['"])`, 'g');
      const fromRegex = new RegExp(`(from\\s+['"])(${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(['"])`, 'g');
      
      if (content.match(importRegex) || content.match(fromRegex)) {
        content = content.replace(importRegex, `$1${newPath}$3`);
        content = content.replace(fromRegex, `$1${newPath}$3`);
        hasChanges = true;
        console.log(`  ✓ 替換: ${oldPath} → ${newPath}`);
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ 文件已更新: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ 處理文件時出錯 ${filePath}:`, error.message);
  }
}

// 主函數
function main() {
  console.log('🚀 開始批量修復 import 路徑...\n');
  
  const projectRoot = __dirname;
  const srcDir = path.join(projectRoot, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ src 目錄不存在');
    return;
  }
  
  // 獲取所有 JSX/JS 文件
  const files = getAllJsxFiles(srcDir);
  console.log(`📂 找到 ${files.length} 個文件需要處理\n`);
  
  // 處理每個文件
  let processedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    try {
      fixImportsInFile(file);
      processedCount++;
    } catch (error) {
      console.error(`❌ 處理文件失敗: ${file}`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 處理結果統計:');
  console.log(`✅ 成功處理: ${processedCount} 個文件`);
  console.log(`❌ 處理失敗: ${errorCount} 個文件`);
  console.log('\n🎉 批量修復完成！');
}

// 運行腳本
if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, pathMappings };