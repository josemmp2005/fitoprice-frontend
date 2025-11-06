import { useEffect, useState } from "react";
import {supabase} from "../config/supabase";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
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

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return isLoggedIn ? <>{children}</> : null;
}
