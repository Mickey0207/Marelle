-- Create storage bucket for product category images
-- Note: This is a SQL-only migration; storage bucket must be created via Supabase dashboard or SDK
-- The bucket 'product-categories' should be created with:
-- - Name: product-categories
-- - Public: true
-- - For production, use Supabase CLI: supabase storage buckets create product-categories --public
-- Or use the web dashboard: Storage > New bucket

-- Alternatively, uncomment the following to use Supabase RPC (requires admin context):
-- select storage.create_bucket('product-categories', false, 'public');

-- Public read policy for objects in product-categories bucket (only if bucket exists)
do $$
begin
  if exists (
    select 1 from storage.buckets where id = 'product-categories'
  ) then
    if not exists (
      select 1 from pg_policies
      where policyname = 'public read product-categories'
        and schemaname = 'storage'
        and tablename = 'objects'
    ) then
      create policy "public read product-categories"
        on storage.objects for select
        using (bucket_id = 'product-categories');
    end if;
  end if;
end
$$;
