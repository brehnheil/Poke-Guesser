// profile.js
// Utility functions for interacting with the "profiles" table in Supabase.
// - Handles profile creation, username management, and best score lookup.

import { supabase } from "./supabaseClient";

// Ensure a profile row exists for the current user
export async function ensureProfileRow() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return null;

  const { error } = await supabase
    .from("profiles")
    .insert({ id: user.id })
    .select("id")
    .maybeSingle();

  // Ignore duplicate row errors; rethrow any others
  if (error && !String(error.message).toLowerCase().includes("duplicate")) {
    throw error;
  }
  return user.id;
}

// Fetch the current user's profile (or null if missing)
export async function getMyProfile() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null; // null means missing row
}

// Validate and normalize a username
export function validateUsername(name) {
  const clean = (name ?? "").trim().toLowerCase();
  const ok = /^[a-z0-9_]{3,20}$/.test(clean);
  return { clean, ok };
}

// Check if a username is available
export async function isUsernameAvailable(name) {
  const { clean, ok } = validateUsername(name);
  if (!ok)
    return {
      available: false,
      reason: "Username must be 3–20 chars: a–z, 0–9, or _",
    };

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", clean)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return { available: !data };
}

// Update the current user's username
export async function setUsername(uname) {
  const { clean, ok } = validateUsername(uname);
  if (!ok) throw new Error("Username must be 3–20 chars: a–z, 0–9, or _");

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Not signed in");

  // Try to update username
  let { data, error } = await supabase
    .from("profiles")
    .update({ username: clean, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select("id, username")
    .maybeSingle();

  // If no profile row, create one then retry
  const noRows = (!data && !error) || (error && error.code === "PGRST116");
  if (noRows) {
    await ensureProfileRow();
    ({ data, error } = await supabase
      .from("profiles")
      .update({ username: clean, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("id, username")
      .maybeSingle());
  }

  if (error) throw error;
  return data;
}

// Get the current user's best score from the "scores" table
export async function getMyBestScore() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("scores")
    .select("score")
    .eq("user_id", user.id)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return data?.score ?? 0;
}
