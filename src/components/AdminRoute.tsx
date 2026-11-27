/**
 * Protege las rutas de administración.
 * Sin sesión se muestra la página 404 en lugar de redirigir al login,
 * para no delatar dónde está el acceso de administradores.
 */

import { getSession } from "@/config/auth";
import NotFound from "@/pages/NotFound";

interface AdminRouteProps {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    if (!getSession()) return <NotFound />;
    return <>{children}</>;
}
