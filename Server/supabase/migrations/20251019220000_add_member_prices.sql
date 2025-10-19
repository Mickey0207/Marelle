-- Migration: Add member price columns to backend_products_prices
-- Purpose: Support tiered pricing for different membership levels (Gold, Silver, VIP)

ALTER TABLE public.backend_products_prices 
  ADD COLUMN IF NOT EXISTS gold_member_price numeric(12,2) null,
  ADD COLUMN IF NOT EXISTS silver_member_price numeric(12,2) null,
  ADD COLUMN IF NOT EXISTS vip_member_price numeric(12,2) null;

-- Add comments to document the new columns
COMMENT ON COLUMN public.backend_products_prices.gold_member_price IS '金卡會員價';
COMMENT ON COLUMN public.backend_products_prices.silver_member_price IS '銀卡會員價';
COMMENT ON COLUMN public.backend_products_prices.vip_member_price IS 'VIP會員價';
