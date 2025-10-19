-- Migration: Seed test product with 5-level SKU variants
-- Purpose: Create a test product with 15 SKU variants (3 options per level)
-- Note: 3×3 = 9 leaf combinations, but we'll create 15 for comprehensive testing

BEGIN;

-- 1. Insert test product
INSERT INTO public.backend_products (
  base_sku, 
  name, 
  slug, 
  short_description,
  description, 
  category_ids,
  status,
  visibility,
  has_variants,
  created_at, 
  updated_at
) VALUES (
  'TEST-5LEVEL-001',
  '五層級測試商品',
  'five-level-test-product',
  '5層級SKU變體測試商品',
  '這是一個5層級SKU變體的測試商品，用於驗證NestedSKUManager和庫存系統功能。包含15個變體，涵蓋5個層級：顏色、尺寸、材質、版本、規格。',
  ARRAY[1]::bigint[],
  'active',
  'visible',
  true,
  NOW(),
  NOW()
);

-- 2. Insert inventory records using the product we just created
WITH product AS (
  SELECT id FROM public.backend_products 
  WHERE base_sku = 'TEST-5LEVEL-001' 
  LIMIT 1
)
INSERT INTO public.backend_products_inventory (
  product_id,
  sku_key,
  warehouse,
  current_stock_qty,
  safety_stock_qty,
  low_stock_threshold,
  track_inventory,
  allow_backorder,
  allow_preorder,
  barcode,
  hs_code,
  origin,
  notes,
  weight,
  length_cm,
  width_cm,
  height_cm,
  sku_level_1,
  sku_level_1_name,
  spec_level_1_name,
  sku_level_2,
  sku_level_2_name,
  spec_level_2_name,
  sku_level_3,
  sku_level_3_name,
  spec_level_3_name,
  sku_level_4,
  sku_level_4_name,
  spec_level_4_name,
  sku_level_5,
  sku_level_5_name,
  spec_level_5_name,
  created_at,
  updated_at
) VALUES
-- Level 1: 紅色 (Red), Level 2: M, Level 3: 棉, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-M-COTTON-VA-STD',
  '主倉', 100, 10, 5, true, false, false,
  'BARCODE001', 'HS001', '台灣', '紅色M號棉版本A標準', 0.5, 30, 20, 10,
  'RED', '紅色', '顏色',
  'M', 'M號', '尺寸',
  'COTTON', '棉', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 紅色, Level 2: M, Level 3: 棉, Level 4: 版本B, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-M-COTTON-VB-STD',
  '主倉', 95, 10, 5, true, false, false,
  'BARCODE002', 'HS002', '台灣', '紅色M號棉版本B標準', 0.5, 30, 20, 10,
  'RED', '紅色', '顏色',
  'M', 'M號', '尺寸',
  'COTTON', '棉', '材質',
  'VB', '版本B', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 紅色, Level 2: L, Level 3: 棉, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-L-COTTON-VA-STD',
  '主倉', 110, 10, 5, true, false, false,
  'BARCODE003', 'HS003', '台灣', '紅色L號棉版本A標準', 0.5, 32, 22, 10,
  'RED', '紅色', '顏色',
  'L', 'L號', '尺寸',
  'COTTON', '棉', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 紅色, Level 2: L, Level 3: 麻, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-L-LINEN-VA-STD',
  '主倉', 88, 10, 5, true, false, false,
  'BARCODE004', 'HS004', '台灣', '紅色L號麻版本A標準', 0.5, 32, 22, 10,
  'RED', '紅色', '顏色',
  'L', 'L號', '尺寸',
  'LINEN', '麻', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 藍色 (Blue), Level 2: M, Level 3: 棉, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-M-COTTON-VA-STD',
  '主倉', 105, 10, 5, true, false, false,
  'BARCODE005', 'HS005', '台灣', '藍色M號棉版本A標準', 0.5, 30, 20, 10,
  'BLUE', '藍色', '顏色',
  'M', 'M號', '尺寸',
  'COTTON', '棉', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 藍色, Level 2: M, Level 3: 滌綸, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-M-POLY-VA-STD',
  '主倉', 92, 10, 5, true, false, false,
  'BARCODE006', 'HS006', '台灣', '藍色M號滌綸版本A標準', 0.5, 30, 20, 10,
  'BLUE', '藍色', '顏色',
  'M', 'M號', '尺寸',
  'POLY', '滌綸', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 藍色, Level 2: L, Level 3: 棉, Level 4: 版本B, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-L-COTTON-VB-STD',
  '主倉', 78, 10, 5, true, false, false,
  'BARCODE007', 'HS007', '台灣', '藍色L號棉版本B標準', 0.5, 32, 22, 10,
  'BLUE', '藍色', '顏色',
  'L', 'L號', '尺寸',
  'COTTON', '棉', '材質',
  'VB', '版本B', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 綠色 (Green), Level 2: M, Level 3: 棉, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-M-COTTON-VA-STD',
  '主倉', 115, 10, 5, true, false, false,
  'BARCODE008', 'HS008', '台灣', '綠色M號棉版本A標準', 0.5, 30, 20, 10,
  'GREEN', '綠色', '顏色',
  'M', 'M號', '尺寸',
  'COTTON', '棉', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 綠色, Level 2: L, Level 3: 麻, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-L-LINEN-VA-STD',
  '主倉', 99, 10, 5, true, false, false,
  'BARCODE009', 'HS009', '台灣', '綠色L號麻版本A標準', 0.5, 32, 22, 10,
  'GREEN', '綠色', '顏色',
  'L', 'L號', '尺寸',
  'LINEN', '麻', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 綠色, Level 2: XL, Level 3: 滌綸, Level 4: 版本B, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-XL-POLY-VB-STD',
  '主倉', 85, 10, 5, true, false, false,
  'BARCODE010', 'HS010', '台灣', '綠色XL號滌綸版本B標準', 0.5, 34, 24, 10,
  'GREEN', '綠色', '顏色',
  'XL', 'XL號', '尺寸',
  'POLY', '滌綸', '材質',
  'VB', '版本B', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Additional variants to reach 15 total
-- Level 1: 紅色, Level 2: XL, Level 3: 麻, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-XL-LINEN-VA-STD',
  '主倉', 75, 10, 5, true, false, false,
  'BARCODE011', 'HS011', '台灣', '紅色XL號麻版本A標準', 0.5, 34, 24, 10,
  'RED', '紅色', '顏色',
  'XL', 'XL號', '尺寸',
  'LINEN', '麻', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 藍色, Level 2: XL, Level 3: 麻, Level 4: 版本B, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-XL-LINEN-VB-STD',
  '主倉', 82, 10, 5, true, false, false,
  'BARCODE012', 'HS012', '台灣', '藍色XL號麻版本B標準', 0.5, 34, 24, 10,
  'BLUE', '藍色', '顏色',
  'XL', 'XL號', '尺寸',
  'LINEN', '麻', '材質',
  'VB', '版本B', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 紅色, Level 2: M, Level 3: 滌綸, Level 4: 版本B, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-M-POLY-VB-STD',
  '主倉', 108, 10, 5, true, false, false,
  'BARCODE013', 'HS013', '台灣', '紅色M號滌綸版本B標準', 0.5, 30, 20, 10,
  'RED', '紅色', '顏色',
  'M', 'M號', '尺寸',
  'POLY', '滌綸', '材質',
  'VB', '版本B', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 藍色, Level 2: L, Level 3: 麻, Level 4: 版本A, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-L-LINEN-VA-STD',
  '主倉', 91, 10, 5, true, false, false,
  'BARCODE014', 'HS014', '台灣', '藍色L號麻版本A標準', 0.5, 32, 22, 10,
  'BLUE', '藍色', '顏色',
  'L', 'L號', '尺寸',
  'LINEN', '麻', '材質',
  'VA', '版本A', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
),
-- Level 1: 綠色, Level 2: M, Level 3: 麻, Level 4: 版本B, Level 5: 標準
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-M-LINEN-VB-STD',
  '主倉', 104, 10, 5, true, false, false,
  'BARCODE015', 'HS015', '台灣', '綠色M號麻版本B標準', 0.5, 30, 20, 10,
  'GREEN', '綠色', '顏色',
  'M', 'M號', '尺寸',
  'LINEN', '麻', '材質',
  'VB', '版本B', '版本',
  'STD', '標準', '規格'
  , NOW(), NOW()
);

COMMIT;
