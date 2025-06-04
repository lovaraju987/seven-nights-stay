-- Create move-in checklists table
create table if not exists public.checklists (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade,
  items jsonb,
  signature_url text,
  completed_at timestamptz default now()
);
