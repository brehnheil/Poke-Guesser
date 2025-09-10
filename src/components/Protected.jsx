import { useAuth } from "../context/AuthContext";

export default function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <p>Please log in to view this page.</p>;
  return children;
}
