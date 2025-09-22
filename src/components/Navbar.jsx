// Navbar.jsx
// Application's top navigation bar.
// - Shows primary navigation links (Home, Game, How To Play, Leaderboard)
// - Reflects auth state (magic link login, user dropdown, sign out)
// - Loads the user's profile to show a friendly display name

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../lib/profile";
import "../css/navbar.css";

export default function Navbar() {
  const { user, loading, message, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(null);

  // Load the authenticated user's profile so we can display a username
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) { setProfile(null); return; }
      try {
        const p = await getMyProfile();
        if (mounted) setProfile(p);
      } catch {
        // no-op: show navbar even if profile fetch fails
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // Choose a concise display name for the navbar (username > email local-part > fallback)
  const displayName =
    profile?.username ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Account";

  // Send Supabase magic link to the provided email
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    await signInWithEmail(email);
  }

  return (
    <nav className="navbar">
      {/* Left: primary site navigation */}
      <div className="left">
        <Link to="/">Home</Link>
        <Link to="/game">Game</Link>
        <Link to="/howtoplay">How To Play</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>

      {/* Right: auth-aware area (user menu or magic link form) */}
      <div className="right">
        {loading && <span className="msg">Loading…</span>}

        {/** If authenticated, show a simple dropdown with profile actions */}
        {!loading && user && (
          <details className="user-menu">
            <summary className="user-summary">
              <span className="user-name">{displayName}</span>
            </summary>
            <div className="menu">
              <Link to="/profile" className="menu-item">Profile</Link>
              <Link to="/leaderboard" className="menu-item">Leaderboard</Link>
              <button onClick={signOut} className="menu-item btn-like">Sign out</button>
            </div>
          </details>
        )}

        {/* Not authenticated: email input for Supabase magic link */}
        {!loading && !user && (
          <form className="magic-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email for magic link"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Link</button>
          </form>
        )}

        {/* Feedback text from auth flow (e.g., "Check your email for a magic link") */}
        {!loading && !user && message && <span className="msg">{message}</span>}
      </div>
    </nav>
  );
}
