/**
 * AdminRoute component to protect admin routes
 * Redirects to admin login if no active session is found.
 */

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

// Define TypeScript interface for component props
interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data }) => {
      // If no active session, redirect to admin login
      if (!data.session) navigate("/login/admin");
      else setSession(data.session);
    });
  }, [navigate]);

  // Show loading state while checking session
  if (!session) return <div>Cargando...</div>;

  // Render children if session exists
  return <>{children}</>;
}
