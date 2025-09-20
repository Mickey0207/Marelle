#!/usr/bin/env node

// 批量修復import路徑的腳本
// 這個腳本會遍歷所有文件並自動修復import路徑

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定義路徑映射規則
const pathMappings = [
  // 前端組件重新組織
  {
    from: /from ['"]\.\/components\/Navbar['"];?/g,
    to: 'from "./components/layout/Navbar";'
  },
  {
    from: /from ['"]\.\/components\/Footer['"];?/g,
    to: 'from "./components/layout/Footer";'
  },
  {
    from: /from ['"]\.\.\/components\/Navbar['"];?/g,
    to: 'from "../components/layout/Navbar";'
  },
  {
    from: /from ['"]\.\.\/components\/Footer['"];?/g,
    to: 'from "../components/layout/Footer";'
  },
  {
    from: /from ['"]\.\.\/components\/SortDropdown['"];?/g,
    to: 'from "../components/ui/SortDropdown";'
  },
  {
    from: /from ['"]\.\.\/components\/GlassModal['"];?/g,
    to: 'from "../components/ui/GlassModal";'
  },
  {
    from: /from ['"]\.\/components\/DynamicPriceDisplay['"];?/g,
    to: 'from "./components/product/DynamicPriceDisplay";'
  },
  {
    from: /from ['"]\.\/components\/ProductVariantSelector['"];?/g,
    to: 'from "./components/product/ProductVariantSelector";'
  },
  {
    from: /from ['"]\.\/components\/StockStatusIndicator['"];?/g,
    to: 'from "./components/product/StockStatusIndicator";'
  },

  // 管理員登入和註冊路徑修復
  {
    from: /from ['"]\.\/admin\/Login['"];?/g,
    to: 'from "./admin/modules/auth/pages/AdminLogin";'
  },
  {
    from: /from ['"]\.\/admin\/Register['"];?/g,
    to: 'from "./admin/modules/auth/pages/Register";'
  },

  // 管理員模組路徑修復
  {
    from: /from ['"]\.\.\/data\/adminDataManager['"];?/g,
    to: 'from "../../shared/data/adminDataManager";'
  },
  {
    from: /from ['"]\.\.\/styles\/adminStyles['"];?/g,
    to: 'from "../../shared/adminStyles";'
  },
  {
    from: /from ['"]\.\.\/components\/StandardTable['"];?/g,
    to: 'from "../../shared/components/StandardTable";'
  },
  {
    from: /from ['"]\.\.\/components\/CustomSelect['"];?/g,
    to: 'from "../../shared/components/CustomSelect";'
  },
  {
    from: /from ['"]\.\.\/components\/QRCodeGenerator['"];?/g,
    to: 'from "../../shared/components/QRCodeGenerator";'
  },
  {
    from: /from ['"]\.\.\/components\/AnalyticsOverview['"];?/g,
    to: 'from "../../shared/components/AnalyticsOverview";'
  },
  {
    from: /from ['"]\.\.\/components\/SystemSettingsOverview['"];?/g,
    to: 'from "../../shared/components/SystemSettingsOverview";'
  },

  // 特定模組內路徑修復
  {
    from: /from ['"]\.\/orders\/OrderList['"];?/g,
    to: 'from "./OrderList";'
  },
  {
    from: /from ['"]\.\/coupons\/CouponList['"];?/g,
    to: 'from "./CouponList";'
  },

  // Data managers 路徑修復
  {
    from: /from ['"]\.\.\/data\/documentDataManager['"];?/g,
    to: 'from "../../shared/data/documentDataManager";'
  },
  {
    from: /from ['"]\.\.\/data\/giftDataManager['"];?/g,
    to: 'from "../../shared/data/giftDataManager";'
  },
  {
    from: /from ['"]\.\.\/data\/accountingDataManager['"];?/g,
    to: 'from "../../shared/data/accountingDataManager";'
  },
  {
    from: /from ['"]\.\.\/\.\.\/data\/procurementDataManager['"];?/g,
    to: 'from "../../shared/data/procurementDataManager";'
  },
  {
    from: /from ['"]\.\.\/\.\.\/data\/supplierDataManager['"];?/g,
    to: 'from "../../shared/data/supplierDataManager";'
  },
  {
    from: /from ['"]\.\.\/\.\.\/data\/logisticsDataManager['"];?/g,
    to: 'from "../../shared/data/logisticsDataManager";'
  },

  // Utils 路徑修復
  {
    from: /from ['"]\.\.\/\.\.\/utils\/data['"];?/g,
    to: 'from "../../shared/utils/data";'
  },
  {
    from: /from ['"]\.\.\/utils\/data['"];?/g,
    to: 'from "../shared/utils/data";'
  },

  // Hooks 路徑修復
  {
    from: /from ['"]\.\.\/hooks['"];?/g,
    to: 'from "../hooks";'
  },

  // 共享組件路徑修復
  {
    from: /from ['"]\.\.\/\.\.\/components\/SearchableSelect['"];?/g,
    to: 'from "../../shared/components/SearchableSelect";'
  },
  {
    from: /from ['"]\.\.\/\.\.\/components\/StandardTable['"];?/g,
    to: 'from "../../shared/components/StandardTable";'
  },
  {
    from: /from ['"]\.\.\/\.\.\/styles\/adminStyles['"];?/g,
    to: 'from "../../shared/adminStyles";'
  }
];

// 需要處理的文件類型
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

// 遞歸遍歷目錄的函數
function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 跳過 node_modules 目錄
      if (file !== 'node_modules' && file !== '.git') {
        walkDirectory(filePath, callback);
      }
    } else if (fileExtensions.includes(path.extname(file))) {
      callback(filePath);
    }
  });
}

// 修復單個文件的函數
function fixFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    pathMappings.forEach(mapping => {
      const newContent = content.replace(mapping.from, mapping.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已修復: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ 修復失敗 ${filePath}:`, error.message);
    return false;
  }
}

// 主執行函數
function main() {
  console.log('🚀 開始批量修復import路徑...\n');
  
  const srcDir = path.join(__dirname, 'src');
  let fixedCount = 0;
  let totalFiles = 0;
  
  walkDirectory(srcDir, (filePath) => {
    totalFiles++;
    if (fixFileImports(filePath)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 修復完成:`);
  console.log(`   總文件數: ${totalFiles}`);
  console.log(`   已修復文件: ${fixedCount}`);
  console.log(`   未修復文件: ${totalFiles - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✨ 批量路徑修復成功！現在可以重新啟動開發服務器。');
  } else {
    console.log('\n⚠️  沒有找到需要修復的路徑。');
  }
}

// 執行主函數
main();