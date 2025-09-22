// Profile.jsx
// User profile page.
// - Loads and displays current user profile from Supabase
// - Lets users set a unique username (with availability check)
// - Shows and refreshes the best score
// - Subscribes to score updates for live refresh

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, isUsernameAvailable, setUsername } from "../lib/profile";
import { getMyBestScore, subscribeToMyScores } from "../lib/score";
import "../css/profile.css";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();

  // Local state for profile data, username input, score, and UI messages
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [username, setUsernameInput] = useState("");
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  // Helper: refresh best score
  async function refetchBest() {
    try {
      const best = await getMyBestScore();
      setBestScore(best ?? 0);
    } catch (e) {
      console.error(e);
    }
  }

  // Load profile + best score after auth is resolved
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    (async () => {
      try {
        // load profile
        const p = await getMyProfile();
        setProfile(p);
        setUsernameInput(p?.username ?? "");
        // load best score
        await refetchBest();
      } catch (e) {
        console.error(e);
        setStatus("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  // Subscribe to score inserts to keep best score fresh
  useEffect(() => {
    if (!user) return;
    let unsubscribe = null;
    (async () => {
      unsubscribe = await subscribeToMyScores(async () => {
        await refetchBest();
      });
    })();
    return () => { if (typeof unsubscribe === "function") unsubscribe(); };
  }, [user]);

  // Handle save username action
  async function handleSave() {
    setSaving(true);
    setStatus("");
    try {
      const { available, reason } = await isUsernameAvailable(username);
      if (!available) {
        setStatus(reason || "That username is taken.");
        return;
      }
      await setUsername(username);
      setStatus("Username updated!");
      setProfile((p) => ({ ...(p || {}), username }));
    } catch (e) {
      console.error(e);
      setStatus("Error saving username.");
    } finally {
      setSaving(false);
    }
  }

  // Loading and unauthenticated states
  if (authLoading || loading) return <div className="profile-s1">Loading…</div>;
  if (!user) return <div className="profile-s2">Sign in with your email to continue.</div>;

  // Main profile UI
  return (
    <div className="profile-s3">
      <h1 className="profile-s4">My Profile</h1>
      {status && <div className="profile-s5">{status}</div>}

      <div className="profile-s6">
        <label className="profile-s7">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="your_name"
            className="profile-s8"
          />
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="profile-s9"
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <hr />

        <div className="profile-s10">
          <div>
            <div className="profile-s11">Best Score</div>
            <div className="profile-s12">{bestScore}</div>
          </div>
          <button onClick={refetchBest} className="profile-s13">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
