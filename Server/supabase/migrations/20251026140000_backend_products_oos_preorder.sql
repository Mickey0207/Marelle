-- Migration: Add OOS and Preorder controls to backend_products
-- Up
ALTER TABLE backend_products
  ADD COLUMN IF NOT EXISTS auto_hide_when_oos boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS enable_preorder boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS preorder_start_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS preorder_end_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS preorder_max_qty integer NULL,
  ADD COLUMN IF NOT EXISTS oos_status text NULL;

-- Optionally, you can add a CHECK constraint for oos_status values later.
-- ALTER TABLE backend_products ADD CONSTRAINT oos_status_chk CHECK (oos_status IN ('normal','low','auto_hidden','oos'));

-- Down
-- ALTER TABLE backend_products
--   DROP COLUMN IF EXISTS auto_hide_when_oos,
--   DROP COLUMN IF EXISTS enable_preorder,
--   DROP COLUMN IF EXISTS preorder_start_at,
--   DROP COLUMN IF EXISTS preorder_end_at,
--   DROP COLUMN IF EXISTS preorder_max_qty,
--   DROP COLUMN IF EXISTS oos_status;
