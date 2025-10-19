-- Drop product-related tables to reset schema
-- Requested: backend_product_categories, backend_product_inventory, backend_products
-- Note: Drop order matters due to FKs (inventory -> products -> categories)

BEGIN;

-- Drop triggers/functions if any linger (defensive)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_inventory_derived_status'
  ) THEN
    EXECUTE 'DROP FUNCTION IF EXISTS public.update_inventory_derived_status() CASCADE';
  END IF;
END$$;

-- Drop tables (CASCADE to remove dependent FKs, triggers, policies)
DROP TABLE IF EXISTS public.backend_product_inventory CASCADE;
DROP TABLE IF EXISTS public.backend_products CASCADE;
DROP TABLE IF EXISTS public.backend_product_categories CASCADE;

COMMIT;
