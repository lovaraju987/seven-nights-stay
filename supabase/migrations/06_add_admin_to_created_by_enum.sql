-- Migration: Add 'admin' value to hostel_created_by enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hostel_created_by') THEN
    -- If the enum does not exist, skip (or handle as needed)
    RAISE NOTICE 'Enum hostel_created_by does not exist.';
  ELSE
    -- Add 'admin' to the enum if not already present
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumlabel = 'admin' AND enumtypid = 'hostel_created_by'::regtype
    ) THEN
      ALTER TYPE hostel_created_by ADD VALUE 'admin';
    END IF;
  END IF;
END$$;
