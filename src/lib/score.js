// score.js
// Utility functions for working with the "scores" table in Supabase.
// - Record new scores
// - Fetch best score for current user
// - Subscribe to score inserts in real time

import { supabase } from "./supabaseClient";

// Insert a new score for the current user
export async function recordScore(finalScore) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "not-auth" };

  // Sanitize score (non-negative integer)
  const safe = Number.isFinite(finalScore)
    ? Math.max(0, Math.floor(finalScore))
    : 0;

  const { error } = await supabase
    .from("scores")
    .insert({ user_id: user.id, score: safe });
  if (error) return { ok: false, error };
  return { ok: true };
}

// Get the user's best score (highest value)
export async function getMyBestScore() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

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

// Subscribe to score inserts for the current user
export function subscribeToMyScores(onInsert) {
  let isActive = true;
  let channelRef = null;

  async function sub() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return () => {};

    // Listen for new INSERTs in the "scores" table for this user
    channelRef = supabase
      .channel("scores_my_inserts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scores",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (isActive && typeof onInsert === "function") onInsert(payload);
        }
      )
      .subscribe();

    return () => {
      isActive = false;
      if (channelRef) supabase.removeChannel(channelRef);
    };
  }

  // Return a cleanup function to unsubscribe
  const cleanupPromise = sub();
  return async () => {
    const cleanup = await cleanupPromise;
    if (typeof cleanup === "function") cleanup();
  };
}
