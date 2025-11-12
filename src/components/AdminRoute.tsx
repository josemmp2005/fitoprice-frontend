import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/login/admin");
      else setSession(data.session);
    });
  }, [navigate]);

  if (!session) return <div>Cargando...</div>;

  return <>{children}</>;
}
