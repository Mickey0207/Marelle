-- Seed fronted_address_zip_map from normalized CSV
-- 使用方式：先執行 Node 解析腳本，產出 CSV，再以 psql 將 CSV 匯入
-- 1) node Package/backend/zip3/parse_zip3_from_1031225_csv.js
-- 2) 在有權限的 psql 環境執行：
--    \copy public.fronted_address_zip_map(zip3, city, district) FROM 'Package/backend/zip3/zip3_1031225_normalized.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- 注意：Workers 上不支援直接 \copy；請於本機或 CI/CD pipeline 對資料庫執行。

BEGIN;

-- 若確定要全量覆蓋可解除註解
-- TRUNCATE TABLE public.fronted_address_zip_map;

-- 基本防呆：若表為空，插入一筆 NOTICE 記錄（非正式資料），避免前端完全查不到資料時誤判為斷線
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.fronted_address_zip_map) THEN
    RAISE NOTICE 'fronted_address_zip_map is empty. Please import CSV via \\copy as instructed.';
  END IF;
END$$;

COMMIT;
