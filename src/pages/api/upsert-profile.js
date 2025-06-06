// src/pages/api/upsert-profile.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req, res) {
  console.log('API /api/upsert-profile called:', req.method, req.body);
  if (req.method !== 'POST') {
    console.log('Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, name, email, phone, role } = req.body;
  if (!id || !name || !email || !role) {
    console.log('Missing required fields:', req.body);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { error } = await supabase.from('profiles').upsert({
      id,
      name,
      email,
      phone,
      role,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.log('Supabase upsert error:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log('Profile upsert success for:', id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log('API handler exception:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
