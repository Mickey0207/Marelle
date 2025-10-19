-- Set up RLS policies for product-categories bucket
-- Allow backend admins to upload/read/delete images
-- Note: RLS is already enabled on storage.objects by default

-- Drop existing policies if they exist
do $$
begin
  execute 'drop policy if exists "product_categories_select" on storage.objects';
exception when others then null;
end $$;

do $$
begin
  execute 'drop policy if exists "product_categories_insert" on storage.objects';
exception when others then null;
end $$;

do $$
begin
  execute 'drop policy if exists "product_categories_update" on storage.objects';
exception when others then null;
end $$;

do $$
begin
  execute 'drop policy if exists "product_categories_delete" on storage.objects';
exception when others then null;
end $$;

-- Public read policy: anyone can read images from product-categories bucket
create policy "product_categories_select"
on storage.objects for select
to public
using (bucket_id = 'product-categories');

-- Backend admins can upload to product-categories bucket
create policy "product_categories_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-categories' and
  exists (select 1 from public.backend_admins where id = auth.uid())
);

-- Backend admins can update images in product-categories bucket
create policy "product_categories_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-categories' and
  exists (select 1 from public.backend_admins where id = auth.uid())
)
with check (
  bucket_id = 'product-categories' and
  exists (select 1 from public.backend_admins where id = auth.uid())
);

-- Backend admins can delete images from product-categories bucket
create policy "product_categories_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-categories' and
  exists (select 1 from public.backend_admins where id = auth.uid())
);
