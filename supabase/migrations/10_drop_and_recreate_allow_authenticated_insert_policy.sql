-- 10_drop_and_recreate_allow_authenticated_insert_policy.sql
-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.profiles;

-- Create a new policy to allow authenticated users to insert their own profile
CREATE POLICY "Allow authenticated insert" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Optionally, allow service_role to insert any profile (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow service_role insert' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Allow service_role insert" ON public.profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);
  END IF;
END $$;
