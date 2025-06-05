-- Allow authenticated users to insert into profiles (adjust as needed for your security model)
create policy "Allow authenticated insert"
on profiles
for insert
with check (auth.role() = 'authenticated');
