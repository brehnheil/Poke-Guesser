// AuthContext.jsx
// Provides global authentication state and helpers using Supabase.
// - Wraps the app so any component can access auth info with `useAuth`.
// - Handles login (magic link), logout, and session persistence.

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Create React context and hook for accessing it
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // current authenticated user
  const [loading, setLoading] = useState(true); // true while auth state is resolving
  const [message, setMessage] = useState("");   // feedback for login actions

  useEffect(() => {
    let mounted = true;

    // Check if a user session already exists
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("getSession error:", error);
      if (!mounted) return;
      setUser(data?.session?.user ?? null);
      setLoading(false);
    })();

    // Listen for Supabase auth state changes (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // Send Supabase magic link login email
  async function signInWithEmail(email) {
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setMessage(error.message);
    else setMessage("Magic link sent! Check your inbox ✉️");
  }

  // Clear Supabase session
  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthCtx.Provider value={{ user, loading, message, signInWithEmail, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
