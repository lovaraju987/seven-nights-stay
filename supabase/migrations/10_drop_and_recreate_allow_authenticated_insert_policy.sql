-- 10_drop_and_recreate_allow_authenticated_insert_policy.sql
-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.profiles;

CREATE POLICY "Allow authenticated insert" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins and agents to insert any profile
DROP POLICY IF EXISTS "Allow admin_agent insert" ON public.profiles;
CREATE POLICY "Allow admin_agent insert" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

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

-- Allow admins and agents to update any profile (fully permissive for debugging)
DROP POLICY IF EXISTS "Allow admin_agent update" ON public.profiles;
CREATE POLICY "Allow admin_agent update" ON public.profiles
FOR UPDATE
TO authenticated
WITH CHECK (true);

-- Drop any old update policies that restrict updates to own profile
DROP POLICY IF EXISTS "Allow authenticated update own profile" ON public.profiles;
