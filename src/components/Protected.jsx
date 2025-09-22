// Protected.jsx
// Higher-order component for guarding routes/pages.
// - Renders children only if a user is authenticated.
// - Shows a sign-in prompt if not authenticated.

import { useAuth } from "../context/AuthContext";

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  // Don’t render anything until auth state is resolved
  if (loading) return null;

  // If no user, show a simple sign-in message
  if (!user) return <div style={{ padding: 20 }}>Sign in with your email to continue.</div>;

  // Authenticated: render protected content
  return children;
}