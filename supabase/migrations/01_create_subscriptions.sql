CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'active',
    starts_on DATE NOT NULL,
    expires_on DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
