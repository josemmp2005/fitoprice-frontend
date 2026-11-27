/**
 * Pide un recurso de la API al montar el componente.
 * Devuelve los datos, si sigue cargando y el error, para no repetir el mismo
 * try/catch/finally en cada página.
 *
 * @example const { data: products, loading } = useApi<Product[]>("/products/all")
 */

import { useCallback, useEffect, useState } from "react";
import API_BASE_URL from "@/config/api";
import { getToken } from "@/config/auth";
import { trackRequest } from "@/hooks/useLoading";

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T>(path: string | null, { auth = false } = {}): ApiState<T> & { reload: () => void } {
    const [state, setState] = useState<ApiState<T>>({ data: null, loading: Boolean(path), error: null });
    const [version, setVersion] = useState(0);
    // Vuelve a pedir el recurso (p. ej. después de crear o editar algo)
    const reload = useCallback(() => setVersion((v) => v + 1), []);

    useEffect(() => {
        if (!path) return;
        const controller = new AbortController();
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const headers: Record<string, string> = {};
        const token = auth ? getToken() : null;
        if (token) headers.Authorization = `Bearer ${token}`;
        const finish = trackRequest();

        fetch(`${API_BASE_URL}${path}`, { headers, signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Error ${response.status} al cargar ${path}`);
                setState({ data: (await response.json()) as T, loading: false, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;
                setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" });
            })
            .finally(finish);

        return () => {
            controller.abort();
            finish();
        };
    }, [path, auth, version]);

    return { ...state, reload };
}
