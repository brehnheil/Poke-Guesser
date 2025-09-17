import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css";

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

      <div className="right">
        {!loading && (
          user ? (
            <>
              <span>Hi, {user.email}</span>
              <button onClick={signOut}>Log out</button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                signInWithEmail(email);
              }}
            >
              <input
                type="email"
                placeholder="Email for magic link"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Send Link</button>
            </form>
          )
        )}
        {!loading && !user && message && <span className="msg">{message}</span>}
      </div>
    </nav>
  );
}
