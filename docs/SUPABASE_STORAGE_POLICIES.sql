-- Supabase Storage RLS Policies for Image Upload
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create the media bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy for INSERT (upload) - Users can upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy for SELECT (download/view) - Users can view their own files and public files
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'media'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR bucket_id = 'media' -- Allow public access to media bucket
  )
);

-- 5. Policy for UPDATE - Users can update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Policy for DELETE - Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Alternative: If you want to allow public read access to all files in media bucket
-- (Remove the previous SELECT policy and use this one instead)
/*
CREATE POLICY "Public read access to media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');
*/

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
