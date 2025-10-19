-- Migration: Extend backend_products_inventory for 5-level SKU structure
-- Date: 2025-10-19
-- Purpose: Add 5 SKU level fields, 5 SKU title fields, and 5 spec name fields to support nested SKU variants

-- Add 5 SKU level fields (sku_level_1 to sku_level_5)
ALTER TABLE public.backend_products_inventory 
  ADD COLUMN IF NOT EXISTS sku_level_1 text null,
  ADD COLUMN IF NOT EXISTS sku_level_2 text null,
  ADD COLUMN IF NOT EXISTS sku_level_3 text null,
  ADD COLUMN IF NOT EXISTS sku_level_4 text null,
  ADD COLUMN IF NOT EXISTS sku_level_5 text null;

-- Add 5 SKU title/name fields (each level's display name)
ALTER TABLE public.backend_products_inventory 
  ADD COLUMN IF NOT EXISTS sku_level_1_name text null,
  ADD COLUMN IF NOT EXISTS sku_level_2_name text null,
  ADD COLUMN IF NOT EXISTS sku_level_3_name text null,
  ADD COLUMN IF NOT EXISTS sku_level_4_name text null,
  ADD COLUMN IF NOT EXISTS sku_level_5_name text null;

-- Add 5 spec name fields (specification name for each level)
ALTER TABLE public.backend_products_inventory 
  ADD COLUMN IF NOT EXISTS spec_level_1_name text null,
  ADD COLUMN IF NOT EXISTS spec_level_2_name text null,
  ADD COLUMN IF NOT EXISTS spec_level_3_name text null,
  ADD COLUMN IF NOT EXISTS spec_level_4_name text null,
  ADD COLUMN IF NOT EXISTS spec_level_5_name text null;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_backend_products_inventory_sku_levels 
  ON public.backend_products_inventory(product_id, sku_level_1, sku_level_2, sku_level_3, sku_level_4, sku_level_5);

-- Add comment to document the structure
COMMENT ON COLUMN public.backend_products_inventory.sku_level_1 IS '第1層SKU代碼 (例: 顏色)';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_2 IS '第2層SKU代碼 (例: 尺寸)';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_3 IS '第3層SKU代碼 (例: 材質)';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_4 IS '第4層SKU代碼';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_5 IS '第5層SKU代碼';

COMMENT ON COLUMN public.backend_products_inventory.sku_level_1_name IS '第1層SKU標題/選項名稱 (例: 紅色)';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_2_name IS '第2層SKU標題/選項名稱 (例: M號)';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_3_name IS '第3層SKU標題/選項名稱 (例: 棉)';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_4_name IS '第4層SKU標題/選項名稱';
COMMENT ON COLUMN public.backend_products_inventory.sku_level_5_name IS '第5層SKU標題/選項名稱';

COMMENT ON COLUMN public.backend_products_inventory.spec_level_1_name IS '第1層規格名稱 (例: 顏色)';
COMMENT ON COLUMN public.backend_products_inventory.spec_level_2_name IS '第2層規格名稱 (例: 尺寸)';
COMMENT ON COLUMN public.backend_products_inventory.spec_level_3_name IS '第3層規格名稱 (例: 材質)';
COMMENT ON COLUMN public.backend_products_inventory.spec_level_4_name IS '第4層規格名稱';
COMMENT ON COLUMN public.backend_products_inventory.spec_level_5_name IS '第5層規格名稱';
