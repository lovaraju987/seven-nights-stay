-- Allow authenticated users to upload images to the hostel-images bucket
create policy "Authenticated users can upload images to hostel-images"
  on storage.objects
  for insert
  with check (
    bucket_id = 'hostel-images' and auth.role() = 'authenticated'
  );
