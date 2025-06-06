// src/pages/api/upsert-profile.ts
import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

// Load from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Handler for Vite/Express API route
export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optionally: check for a secret header here for extra security

  const { id, name, email, phone, role } = req.body;
  if (!id || !name || !email || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { error } = await supabase.from("profiles").upsert({
      id,
      name,
      email,
      phone,
      role,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}

// If using Vite, you may need to adapt this to your dev server's API route conventions.
// If you use a custom server, import and use this handler in your Express app.
