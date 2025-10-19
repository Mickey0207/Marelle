-- Create RLS policies for products bucket
-- Run this after manually creating the products bucket in Supabase dashboard

-- Policy 1: Allow authenticated admins to upload to products bucket
CREATE POLICY "Allow authenticated admins to upload to products bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND 
  EXISTS (
    SELECT 1 FROM public.backend_admins
    WHERE backend_admins.id = auth.uid()
  )
);

-- Policy 2: Allow authenticated admins to read products bucket
CREATE POLICY "Allow authenticated admins to read products bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'products');

-- Policy 3: Allow public to read products bucket
CREATE POLICY "Allow public to read products bucket"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'products');

-- Policy 4: Allow authenticated admins to update products in bucket
CREATE POLICY "Allow authenticated admins to update products in bucket"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND 
  EXISTS (
    SELECT 1 FROM public.backend_admins
    WHERE backend_admins.id = auth.uid()
  )
);

-- Policy 5: Allow authenticated admins to delete from products bucket
CREATE POLICY "Allow authenticated admins to delete from products bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND 
  EXISTS (
    SELECT 1 FROM public.backend_admins
    WHERE backend_admins.id = auth.uid()
  )
);
