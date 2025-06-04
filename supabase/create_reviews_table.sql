-- Create reviews table
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  hostel_id uuid references hostels(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  inserted_at timestamp with time zone default now()
);
