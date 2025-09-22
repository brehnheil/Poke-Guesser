// Leaderboard.jsx
// Page showing top players by score.
// - Supports All-time and Last 7 days views
// - Refreshes automatically on new score inserts
// - Provides manual refresh and rank numbers

import { useEffect, useMemo, useState } from "react";
import {
  getTopAllTime,
  getTopSince,
  subscribeLeaderboard,
} from "../lib/leaderboard";
import "../css/Leaderboard.css"; // ⟵ add this

// Two leaderboard tabs: all-time and last 7 days
const TABS = [
  { key: "all", label: "All-time" },
  { key: "7d", label: "Last 7 days" },
];

export default function Leaderboard() {
  const [tab, setTab] = useState("all"); // current tab
  const [rows, setRows] = useState([]); // leaderboard data
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load leaderboard based on selected tab
  async function load() {
    setRefreshing(true);
    try {
      if (tab === "all") {
        const data = await getTopAllTime(50);
        setRows(data);
      } else {
        const data = await getTopSince(7, 50);
        setRows(data);
      }
    } finally {
      setRefreshing(false);
    }
  }

  // Initial load when tab changes
  useEffect(() => {
    setLoading(true);
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [tab]);

  // Subscribe to real-time score inserts
  useEffect(() => {
    const unsub = subscribeLeaderboard(() => {
      load();
    });
    return () => unsub();
  }, [tab]);

  // Add rank numbers to each row
  const withRank = useMemo(() => {
    return rows.map((r, i) => ({ rank: i + 1, ...r }));
  }, [rows]);

  return (
    <div className="leaderboard-container">
      {/* Page title */}
      <h1 className="leaderboard-title">Leaderboard</h1>

      {/* Tab buttons (All-time / Last 7 days) and refresh control */}
      <div className="leaderboard-controls">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tab-button ${tab === t.key ? "active" : ""}`}
          >
            {t.label}
          </button>
        ))}

        {/* Manual refresh button */}
        <button onClick={load} disabled={refreshing} className="refresh-button">
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Conditional rendering:
          - Loading state
          - Empty state (no scores)
          - Leaderboard table */}
      {loading ? (
        <div>Loading…</div>
      ) : withRank.length === 0 ? (
        <div>No scores yet. Be the first!</div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th>User</th>
              <th className="col-score">Best Score</th>
              <th className="col-date">Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Leaderboard rows with rank, username, score, and timestamp */}
            {withRank.map((r) => (
              <tr key={r.user_id}>
                <td>{r.rank}</td>
                <td className="username">{r.username ?? "anon"}</td>
                <td>{r.best_score ?? 0}</td>
                <td>
                  {r.best_score_at
                    ? new Date(r.best_score_at).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
