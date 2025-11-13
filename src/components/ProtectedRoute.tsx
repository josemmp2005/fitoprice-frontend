/**
 * ProtectedRoute component to protect routes
 * Redirects to login if no active session is found.
 */


import { useEffect, useState } from "react";
import {supabase} from "../config/supabase";
import { useNavigate } from "react-router-dom";

// Define TypeScript interface for component props
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check for active session on component mount
  useEffect(() => {
    const checkSession = async () => {
      // Get current session from Supabase
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Show loading state while checking session
  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  // Render children if logged in
  return isLoggedIn ? <>{children}</> : null;
}
