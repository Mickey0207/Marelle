// 動態產生 SKU 庫存清單（基於產品模擬資料）
// 說明：
// - 從 mockProducts 取出有/無變體的 SKU，統一映射成庫存資料列
// - 倉庫/分類以預設值或從產品資料推導，方便前端篩選

import { mockProducts, PRODUCT_STATUS } from "../products/mockProductData";
import { loadWarehouses } from "./warehousesMock";

// 預設倉庫清單（之後可接設定）
export const DEFAULT_WAREHOUSES = loadWarehouses().map(w => ({ value: w.name, label: w.name }));

// 依倉庫數量分配數量（2 個倉庫時 70/30，其他情況平均分配，處理負數與零）
const splitQuantityByWarehouses = (quantity, warehouses) => {
  const result = {};
  const n = warehouses.length;
  if (n <= 1) {
    result[warehouses[0]] = quantity;
    return result;
  }
  // 負數（預售）分配同樣比例
  const sign = quantity < 0 ? -1 : 1;
  const absQty = Math.abs(quantity);

  if (n === 2) {
    const main = Math.floor(absQty * 0.7);
    const rest = absQty - main;
    result[warehouses[0]] = sign * main;
    result[warehouses[1]] = sign * rest;
    return result;
  }
  // 平均分配
  const base = Math.floor(absQty / n);
  let remainder = absQty % n;
  warehouses.forEach((w, idx) => {
    let q = base;
    if (remainder > 0) {
      q += 1;
      remainder -= 1;
    }
    result[w] = sign * q;
  });
  return result;
};

// 將產品資料轉為 SKU 庫存列
// 欄位對齊 Inventory.jsx 的表格 columns
// warehouses 參數：
// - 傳入字串（'主倉庫'）則全數量落在該倉庫
// - 傳入 '*' 或不傳，則會以 DEFAULT_WAREHOUSES 的清單分倉（70/30 等）
// - 傳入字串陣列，則依陣列內容分倉
export const buildInventoryFromProducts = (warehouses = '*') => {
  // 正規化倉庫列表
  let warehouseList;
  if (Array.isArray(warehouses)) {
    warehouseList = warehouses.length ? warehouses : [DEFAULT_WAREHOUSES[0].value];
  } else if (warehouses === '*' || !warehouses) {
    warehouseList = DEFAULT_WAREHOUSES.map(w => w.value);
  } else {
    warehouseList = [warehouses];
  }

  const rows = [];
  for (const p of mockProducts) {
    const categoryId = p.categories?.[0]?.id || null;
    const categoryName = p.category || p.categories?.[0]?.name || '未分類';

    if (p.hasVariants && Array.isArray(p.skuVariants) && p.skuVariants.length > 0) {
      for (const v of p.skuVariants) {
    const sku = v.sku || `${p.baseSKU}`;
    const displayPath = v.pathDisplay ? v.pathDisplay.replace(/\s*→\s*/g, ' / ') : '';
    const name = p.name;
        const quantity = Number(v.config?.quantity ?? 0);
        const avgCost = Number(v.config?.costPrice ?? p.costPrice ?? 0);
        const safeStock = Number(v.config?.lowStockThreshold ?? 5);
        const allowNegative = Boolean(v.config?.allowBackorder);
        const barcode = v.config?.barcode || `${p.baseSKU}-${sku}`.toUpperCase();

        const splitMap = splitQuantityByWarehouses(quantity, warehouseList);
        for (const wh of warehouseList) {
          const qty = Number(splitMap[wh] ?? 0);
          const status = qty < 0 ? 'presale' : (qty < safeStock ? 'low' : 'normal');
          const totalValue = Math.round(qty * avgCost);
          rows.push({
            id: `${p.baseSKU}-${sku}-${wh}`,
            sku,
            name,
            spec: displayPath || '-',
            category: categoryName,
            categoryId,
            warehouse: wh,
            currentStock: qty,
            safeStock,
            avgCost,
            totalValue,
            barcode,
            allowNegative,
            lastUpdated: new Date().toISOString().slice(0,10),
            status,
          });
        }
      }
    } else {
      const sku = p.baseSKU;
      const name = p.name;
      const quantity = Number(p.inStock ? 10 : 0); // 無變體時先給一個估計數量（可再從別處帶入）
      const avgCost = Number(p.costPrice ?? 0);
      const safeStock = 5;
      const barcode = `${sku}-0001`.toUpperCase();

      const splitMap = splitQuantityByWarehouses(quantity, warehouseList);
      for (const wh of warehouseList) {
        const qty = Number(splitMap[wh] ?? 0);
        const status = qty < 0 ? 'presale' : (qty < safeStock ? 'low' : 'normal');
        const totalValue = Math.round(qty * avgCost);
        rows.push({
          id: `${sku}-${wh}`,
          sku,
          name,
          spec: '-',
          category: categoryName,
          categoryId,
          warehouse: wh,
          currentStock: qty,
          safeStock,
          avgCost,
          totalValue,
          barcode,
          allowNegative: false,
          lastUpdated: new Date().toISOString().slice(0,10),
          status,
        });
      }
    }
  }
  return rows;
};

// 產生分類與倉庫選單
export const getInventoryFilters = (rows) => {
  const warehouses = new Set();
  const categories = new Set();
  for (const r of rows) {
    warehouses.add(r.warehouse);
    categories.add(r.category);
  }
  return {
    warehouses: ['全部', ...Array.from(warehouses)],
    categories: ['全部', ...Array.from(categories)]
  };
};

// 預設輸出（供簡單使用）
export const mockInventoryFromProducts = buildInventoryFromProducts();
export default mockInventoryFromProducts;
