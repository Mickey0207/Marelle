-- Create public bucket for assets (id: store-assets)
do $$
begin
  perform storage.create_bucket('store-assets', public := true);
exception when others then
  -- ignore if bucket already exists
  null;
end
$$;

-- Public read policy for objects in store-assets bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'public read store-assets'
      and schemaname = 'storage'
      and tablename = 'objects'
  ) then
    create policy "public read store-assets"
      on storage.objects for select
      using (bucket_id = 'store-assets');
  end if;
end
$$;
