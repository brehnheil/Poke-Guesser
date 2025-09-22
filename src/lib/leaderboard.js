// leaderboard.js
// Utility functions for fetching and subscribing to leaderboard data.
// - getTopAllTime: best scores across all time
// - getTopSince: best scores since a given timeframe
// - subscribeLeaderboard: real-time subscription to new score inserts

import { supabase } from "./supabaseClient";

// Fetch global top scores (all time), with fallback if materialized "leaderboard" view is missing
export async function getTopAllTime(limit = 50) {
  // Try querying pre-aggregated leaderboard table
  let { data, error } = await supabase
    .from("leaderboard")
    .select("user_id, username, best_score, best_score_at, last_played_at")
    .order("best_score", { ascending: false })
    .order("best_score_at", { ascending: false })
    .limit(limit);

  if (!error && data) {
    // Normalize: prefer best_score_at, else fall back to last_played_at
    return data.map((r) => ({
      ...r,
      best_score_at: r.best_score_at ?? r.last_played_at ?? null,
    }));
  }

  // Fallback: compute best score per user from raw scores table
  const { data: rows, error: err2 } = await supabase
    .from("scores")
    .select("user_id, score, played_at, profiles:user_id(username)")
    .order("score", { ascending: false })
    .limit(1000);

  if (err2) throw err2;

  // Pick highest score (or latest if tied) per user
  const byUser = new Map();
  for (const r of rows || []) {
    const u = r.user_id;
    const name = r.profiles?.username ?? "anon";
    const prev = byUser.get(u);
    const isBetter =
      !prev ||
      r.score > prev.best_score ||
      (r.score === prev.best_score &&
        new Date(r.played_at) > new Date(prev.best_score_at || 0));
    if (isBetter) {
      byUser.set(u, {
        user_id: u,
        username: name,
        best_score: r.score,
        best_score_at: r.played_at,
      });
    }
  }

  // Sort users by score then recency, take top N
  return Array.from(byUser.values())
    .sort(
      (a, b) =>
        b.best_score - a.best_score ||
        new Date(b.best_score_at || 0) - new Date(a.best_score_at || 0)
    )
    .slice(0, limit);
}

// Fetch top scores within the last N days (default 7)
export async function getTopSince(days = 7, limit = 50) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  const { data: rows, error } = await supabase
    .from("scores")
    .select("user_id, score, played_at, profiles:user_id(username)")
    .gte("played_at", sinceISO)
    .order("score", { ascending: false })
    .limit(2000);

  if (error) throw error;

  // Aggregate best score per user in given timeframe
  const byUser = new Map();
  for (const r of rows || []) {
    const u = r.user_id;
    const name = r.profiles?.username ?? "anon";
    const prev = byUser.get(u);
    const isBetter =
      !prev ||
      r.score > prev.best_score ||
      (r.score === prev.best_score &&
        new Date(r.played_at) > new Date(prev.best_score_at || 0));
    if (isBetter) {
      byUser.set(u, {
        user_id: u,
        username: name,
        best_score: r.score,
        best_score_at: r.played_at,
      });
    }
  }

  return Array.from(byUser.values())
    .sort(
      (a, b) =>
        b.best_score - a.best_score ||
        new Date(b.best_score_at || 0) - new Date(a.best_score_at || 0)
    )
    .slice(0, limit);
}

// Subscribe to new score inserts in real-time
// Calls `onInsert` callback whenever a new score row is added
export function subscribeLeaderboard(onInsert) {
  const ch = supabase
    .channel("scores_any_inserts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "scores" },
      () => typeof onInsert === "function" && onInsert()
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(ch);
  };
}
