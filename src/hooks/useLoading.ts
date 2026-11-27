/**
 * Cuántas peticiones a la API hay en marcha en toda la app.
 * La cabecera lo usa para animar su línea verde mientras algo carga.
 */

import { useSyncExternalStore } from "react";

let pending = 0;
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

// Marca una petición como empezada; la función devuelta la marca como terminada (solo una vez)
export function trackRequest() {
    pending++;
    emit();
    let done = false;
    return () => {
        if (done) return;
        done = true;
        pending--;
        emit();
    };
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function useLoading() {
    return useSyncExternalStore(subscribe, () => pending > 0);
}
