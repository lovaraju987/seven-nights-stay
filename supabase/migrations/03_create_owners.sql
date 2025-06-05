-- Migration: Create owners table
CREATE TABLE owners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Optional: Add index for faster lookups
CREATE INDEX idx_owners_user_id ON owners(user_id);

-- Optional: Migrate existing owners from profiles (if needed)
-- INSERT INTO owners (user_id, name, email, phone)
-- SELECT id, name, email, phone FROM profiles WHERE role = 'owner';
