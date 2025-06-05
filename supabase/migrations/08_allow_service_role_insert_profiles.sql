-- Allow service role to insert into profiles (for backend/admin inserts)
create policy "Allow service role insert"
on profiles
for insert
with check (auth.role() = 'service_role');
