import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css"

export default function Navbar() {
  const { user, loading, message, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/">Home</Link>
        <Link to="/game">Game</Link>
        <Link to="/howtoplay">How To Play</Link>
      </div>

      <div className="right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {!loading && (
          user ? (
            <>
              <span style={{ fontSize: 14 }}>Hi, {user.email}</span>
              <button onClick={signOut}>Log out</button>
            </>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); signInWithEmail(email); }}
              style={{ display: "flex", gap: 6 }}
            >
              <input
                type="email"
                placeholder="Email for magic link"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "4px 8px" }}
              />
              <button type="submit">Send Link</button>
            </form>
          )
        )}
        {!loading && !user && message && <span style={{ fontSize: 12 }}>{message}</span>}
      </div>
    </nav>
  );
}
