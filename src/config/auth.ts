/**
 * Sesión de administrador contra la API propia (token JWT guardado en localStorage).
 * El backend valida el token en cada petición; aquí solo se usa para la interfaz.
 */

import API_BASE_URL from "./api";

const STORAGE_KEY = "fitoprice-session";

export interface Session {
    token: string;
    user: { id: number; email: string };
}

// Lee la fecha de caducidad (exp) incluida en el JWT
const isExpired = (token: string): boolean => {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 <= Date.now();
};

export function getSession(): Session | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        const session: Session = JSON.parse(stored);
        if (isExpired(session.token)) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

export const getToken = (): string | null => getSession()?.token ?? null;

export async function login(email: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error(response.status === 401 ? "Credenciales incorrectas" : "Error al iniciar sesión");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(await response.json()));
}

export const logout = (): void => localStorage.removeItem(STORAGE_KEY);
