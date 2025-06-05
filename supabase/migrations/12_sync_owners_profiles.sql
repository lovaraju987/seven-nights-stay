-- 12_sync_owners_profiles.sql
-- Ensure every owner has a matching profile record
INSERT INTO profiles (id, name, email, phone, role)
SELECT user_id, name, email, phone, 'owner'
FROM owners
WHERE user_id IS NOT NULL
  AND user_id NOT IN (SELECT id FROM profiles);
