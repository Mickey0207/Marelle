-- Migration: Drop backup table backend_products_photo_old
-- Date: 2025-10-19
-- Purpose: Remove the backup table after successful photo structure migration

-- Drop the backup table
DROP TABLE IF EXISTS public.backend_products_photo_old CASCADE;

-- Record: Data migration completed, old table structure no longer needed
