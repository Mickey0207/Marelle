-- Alter backend_products_prices table with complete pricing structure
-- This migration updates the prices table to support per-variant pricing

ALTER TABLE public.backend_products_prices DROP COLUMN IF EXISTS sale_price CASCADE;
ALTER TABLE public.backend_products_prices DROP COLUMN IF EXISTS compare_at_price CASCADE;
ALTER TABLE public.backend_products_prices DROP COLUMN IF EXISTS cost_price CASCADE;

ALTER TABLE public.backend_products_prices ADD COLUMN IF NOT EXISTS sku_key text null;
ALTER TABLE public.backend_products_prices ADD COLUMN IF NOT EXISTS sale_price numeric(12,2) null;
ALTER TABLE public.backend_products_prices ADD COLUMN IF NOT EXISTS compare_at_price numeric(12,2) null;
ALTER TABLE public.backend_products_prices ADD COLUMN IF NOT EXISTS cost_price numeric(12,2) null;

-- Create unique constraint for product + sku_key (allowing both NULL)
-- For single-SKU products: sku_key is NULL
-- For multi-SKU products: sku_key contains the variant SKU code
CREATE UNIQUE INDEX IF NOT EXISTS idx_backend_products_prices_product_sku 
ON public.backend_products_prices(product_id, COALESCE(sku_key, ''))
WHERE sku_key IS NULL OR sku_key != '';

-- Add trigger for updated_at if not exists
DROP TRIGGER IF EXISTS trg_backend_products_prices_updated_at ON public.backend_products_prices;
CREATE TRIGGER trg_backend_products_prices_updated_at
BEFORE UPDATE ON public.backend_products_prices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Alter backend_products_inventory table with complete inventory structure
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS sku_key CASCADE;
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS current_stock_qty CASCADE;
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS safety_stock_qty CASCADE;
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS warehouse CASCADE;
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS track_inventory CASCADE;
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS allow_backorder CASCADE;
ALTER TABLE public.backend_products_inventory DROP COLUMN IF EXISTS allow_preorder CASCADE;

-- Add all inventory columns
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS sku_key text null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS warehouse text not null default '主倉';
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS current_stock_qty integer not null default 0;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS safety_stock_qty integer not null default 10;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS low_stock_threshold integer not null default 5;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS track_inventory boolean not null default true;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS allow_backorder boolean not null default false;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS allow_preorder boolean not null default false;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS barcode text null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS hs_code text null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS origin text null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS notes text null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS weight numeric(10,3) null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS length_cm numeric(10,2) null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS width_cm numeric(10,2) null;
ALTER TABLE public.backend_products_inventory ADD COLUMN IF NOT EXISTS height_cm numeric(10,2) null;

-- Create unique constraint for product + warehouse + sku_key
CREATE UNIQUE INDEX IF NOT EXISTS idx_backend_products_inventory_unique
ON public.backend_products_inventory(product_id, warehouse, COALESCE(sku_key, ''))
WHERE sku_key IS NULL OR sku_key != '';

-- Create other helpful indexes
CREATE INDEX IF NOT EXISTS idx_backend_products_inventory_sku ON public.backend_products_inventory(sku_key);
CREATE INDEX IF NOT EXISTS idx_backend_products_inventory_warehouse ON public.backend_products_inventory(warehouse);
CREATE INDEX IF NOT EXISTS idx_backend_products_inventory_barcode ON public.backend_products_inventory(barcode);

-- Add trigger for updated_at if not exists
DROP TRIGGER IF EXISTS trg_backend_products_inventory_updated_at ON public.backend_products_inventory;
CREATE TRIGGER trg_backend_products_inventory_updated_at
BEFORE UPDATE ON public.backend_products_inventory
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Verify RLS is still enabled
ALTER TABLE public.backend_products_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backend_products_inventory ENABLE ROW LEVEL SECURITY;
