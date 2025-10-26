-- Migration: Add promotion/product tag label and color columns to backend_products
-- Up
ALTER TABLE backend_products
  ADD COLUMN IF NOT EXISTS promotion_label TEXT,
  ADD COLUMN IF NOT EXISTS promotion_label_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS promotion_label_text_color TEXT,
  ADD COLUMN IF NOT EXISTS product_tag_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS product_tag_text_color TEXT;

-- Optional sensible defaults (can be adjusted in app)
UPDATE backend_products
SET 
  promotion_label_bg_color = COALESCE(promotion_label_bg_color, '#CC824D'),
  promotion_label_text_color = COALESCE(promotion_label_text_color, '#FFFFFF'),
  product_tag_bg_color = COALESCE(product_tag_bg_color, '#CC824D'),
  product_tag_text_color = COALESCE(product_tag_text_color, '#FFFFFF');

-- Down (no-op safe): you may drop columns if rollback is required
-- ALTER TABLE backend_products
--   DROP COLUMN IF EXISTS promotion_label,
--   DROP COLUMN IF EXISTS promotion_label_bg_color,
--   DROP COLUMN IF EXISTS promotion_label_text_color,
--   DROP COLUMN IF EXISTS product_tag_bg_color,
--   DROP COLUMN IF EXISTS product_tag_text_color;
