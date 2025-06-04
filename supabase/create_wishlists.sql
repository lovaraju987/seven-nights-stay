-- Create wishlists table
create table if not exists wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hostel_id uuid not null references hostels(id) on delete cascade,
  inserted_at timestamptz default now()
);

-- Index for fast lookup
create index if not exists wishlists_user_hostel_idx on wishlists(user_id, hostel_id);
