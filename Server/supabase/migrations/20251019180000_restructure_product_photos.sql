-- Migration: Restructure product photos table for fixed 10 photo URLs
-- Date: 2025-10-19
-- Purpose: Convert backend_products_photo from row-based to column-based (10 fixed photo URLs)
--          Add 3 photo URLs to backend_products_inventory for SKU variant photos

-- Drop existing indexes and constraints for backend_products_photo
DROP INDEX IF EXISTS idx_backend_products_photo_product;
DROP INDEX IF EXISTS idx_backend_products_photo_order;

-- Rename old table as backup (if we need to rollback)
ALTER TABLE IF EXISTS public.backend_products_photo RENAME TO backend_products_photo_old;

-- Recreate backend_products_photo with 10 fixed photo URL columns
CREATE TABLE IF NOT EXISTS public.backend_products_photo (
  id bigserial primary key,
  product_id bigint not null unique references public.backend_products(id) on delete cascade,
  
  -- Main product photos (10 fixed URLs)
  photo_url_1 text null,
  photo_url_2 text null,
  photo_url_3 text null,
  photo_url_4 text null,
  photo_url_5 text null,
  photo_url_6 text null,
  photo_url_7 text null,
  photo_url_8 text null,
  photo_url_9 text null,
  photo_url_10 text null,
  
  created_by uuid null references public.backend_admins(id) on delete set null,
  updated_by uuid null references public.backend_admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_backend_products_photo_product ON public.backend_products_photo(product_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_backend_products_photo_updated_at ON public.backend_products_photo;
CREATE TRIGGER trg_backend_products_photo_updated_at
BEFORE UPDATE ON public.backend_products_photo
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add 3 photo URL columns to backend_products_inventory for SKU variant photos
ALTER TABLE public.backend_products_inventory 
  ADD COLUMN IF NOT EXISTS variant_photo_url_1 text null,
  ADD COLUMN IF NOT EXISTS variant_photo_url_2 text null,
  ADD COLUMN IF NOT EXISTS variant_photo_url_3 text null;

-- Create index on product_id + sku_key for inventory
CREATE INDEX IF NOT EXISTS idx_backend_products_inventory_product_sku 
  ON public.backend_products_inventory(product_id, COALESCE(sku_key, ''));

-- Enable RLS on photo table
ALTER TABLE public.backend_products_photo ENABLE ROW LEVEL SECURITY;

-- RLS Policies for backend_products_photo
DO $$ BEGIN
  -- Select
  EXECUTE 'DROP POLICY IF EXISTS backend_products_photo_select ON public.backend_products_photo';
  EXECUTE 'CREATE POLICY backend_products_photo_select ON public.backend_products_photo FOR SELECT USING (EXISTS (SELECT 1 FROM public.backend_admins a WHERE a.id = auth.uid()))';
  
  -- Insert
  EXECUTE 'DROP POLICY IF EXISTS backend_products_photo_insert ON public.backend_products_photo';
  EXECUTE 'CREATE POLICY backend_products_photo_insert ON public.backend_products_photo FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.backend_admins a WHERE a.id = auth.uid()))';
  
  -- Update
  EXECUTE 'DROP POLICY IF EXISTS backend_products_photo_update ON public.backend_products_photo';
  EXECUTE 'CREATE POLICY backend_products_photo_update ON public.backend_products_photo FOR UPDATE USING (EXISTS (SELECT 1 FROM public.backend_admins a WHERE a.id = auth.uid()))';
  
  -- Delete
  EXECUTE 'DROP POLICY IF EXISTS backend_products_photo_delete ON public.backend_products_photo';
  EXECUTE 'CREATE POLICY backend_products_photo_delete ON public.backend_products_photo FOR DELETE USING (EXISTS (SELECT 1 FROM public.backend_admins a WHERE a.id = auth.uid()))';
END $$;

-- Cleanup old table after verification
-- UNCOMMENT THIS AFTER VERIFICATION: DROP TABLE IF EXISTS public.backend_products_photo_old CASCADE;
