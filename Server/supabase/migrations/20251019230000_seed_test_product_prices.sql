-- Migration: Add price records for test product with 5-level SKU variants
-- Purpose: Seed pricing data for the test product

WITH product AS (
  SELECT id FROM public.backend_products 
  WHERE base_sku = 'TEST-5LEVEL-001' 
  LIMIT 1
)
INSERT INTO public.backend_products_prices (
  product_id,
  sku_key,
  sale_price,
  compare_at_price,
  cost_price,
  gold_member_price,
  silver_member_price,
  vip_member_price,
  created_at,
  updated_at
) VALUES
-- Variant 1: RED-M-COTTON-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-M-COTTON-VA-STD',
  999.00, 1299.00, 500.00,
  899.00, 899.00, 799.00,
  NOW(), NOW()
),
-- Variant 2: RED-M-COTTON-VB-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-M-COTTON-VB-STD',
  999.00, 1299.00, 500.00,
  899.00, 899.00, 799.00,
  NOW(), NOW()
),
-- Variant 3: RED-L-COTTON-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-L-COTTON-VA-STD',
  1099.00, 1399.00, 550.00,
  989.00, 989.00, 879.00,
  NOW(), NOW()
),
-- Variant 4: RED-L-LINEN-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-L-LINEN-VA-STD',
  1199.00, 1499.00, 600.00,
  1079.00, 1079.00, 959.00,
  NOW(), NOW()
),
-- Variant 5: BLUE-M-COTTON-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-M-COTTON-VA-STD',
  999.00, 1299.00, 500.00,
  899.00, 899.00, 799.00,
  NOW(), NOW()
),
-- Variant 6: BLUE-M-POLY-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-M-POLY-VA-STD',
  899.00, 1199.00, 450.00,
  809.00, 809.00, 719.00,
  NOW(), NOW()
),
-- Variant 7: BLUE-L-COTTON-VB-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-L-COTTON-VB-STD',
  1099.00, 1399.00, 550.00,
  989.00, 989.00, 879.00,
  NOW(), NOW()
),
-- Variant 8: GREEN-M-COTTON-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-M-COTTON-VA-STD',
  999.00, 1299.00, 500.00,
  899.00, 899.00, 799.00,
  NOW(), NOW()
),
-- Variant 9: GREEN-L-LINEN-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-L-LINEN-VA-STD',
  1199.00, 1499.00, 600.00,
  1079.00, 1079.00, 959.00,
  NOW(), NOW()
),
-- Variant 10: GREEN-XL-POLY-VB-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-XL-POLY-VB-STD',
  1299.00, 1599.00, 650.00,
  1169.00, 1169.00, 1039.00,
  NOW(), NOW()
),
-- Variant 11: RED-XL-LINEN-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-XL-LINEN-VA-STD',
  1299.00, 1599.00, 650.00,
  1169.00, 1169.00, 1039.00,
  NOW(), NOW()
),
-- Variant 12: BLUE-XL-LINEN-VB-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-XL-LINEN-VB-STD',
  1299.00, 1599.00, 650.00,
  1169.00, 1169.00, 1039.00,
  NOW(), NOW()
),
-- Variant 13: RED-M-POLY-VB-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-RED-M-POLY-VB-STD',
  899.00, 1199.00, 450.00,
  809.00, 809.00, 719.00,
  NOW(), NOW()
),
-- Variant 14: BLUE-L-LINEN-VA-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-BLUE-L-LINEN-VA-STD',
  1199.00, 1499.00, 600.00,
  1079.00, 1079.00, 959.00,
  NOW(), NOW()
),
-- Variant 15: GREEN-M-LINEN-VB-STD
(
  (SELECT id FROM product),
  'TEST-5LEVEL-001-GREEN-M-LINEN-VB-STD',
  1199.00, 1499.00, 600.00,
  1079.00, 1079.00, 959.00,
  NOW(), NOW()
);
