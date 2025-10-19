-- Migration: Add variant photo columns to backend_products_photo
-- Adds inventory-level photos (3 urls) and inventory_id FK

ALTER TABLE public.backend_products_photo
  ADD COLUMN IF NOT EXISTS inventory_id bigint NULL,
  ADD COLUMN IF NOT EXISTS variant_photo_url_1 text NULL,
  ADD COLUMN IF NOT EXISTS variant_photo_url_2 text NULL,
  ADD COLUMN IF NOT EXISTS variant_photo_url_3 text NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_backend_products_photo_inventory
  ON public.backend_products_photo(inventory_id);

-- FK to inventory
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_backend_products_photo_inventory'
  ) THEN
    ALTER TABLE public.backend_products_photo
      ADD CONSTRAINT fk_backend_products_photo_inventory
      FOREIGN KEY (inventory_id) REFERENCES public.backend_products_inventory(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- We will treat product-level photos as rows where inventory_id IS NULL
-- Ensure at most one product-level row per product for simplicity
CREATE UNIQUE INDEX IF NOT EXISTS uniq_backend_products_photo_product_null_inv
  ON public.backend_products_photo(product_id)
  WHERE inventory_id IS NULL;
