/**
 * Productos que sigue el visitante, guardados en su navegador (sin cuenta).
 * Para cada uno se guarda el precio de la última vez que miró su ficha,
 * así "Tus productos" puede decir qué ha cambiado desde entonces.
 */

import { useCallback, useSyncExternalStore } from "react";
import type { Product } from "@/lib/types";

const KEY = "fitoprice:seguidos";

export interface FollowEntry {
    price: number | null; // céntimos, la última vez que se vio
    seenAt: string;       // ISO
}

type Store = Record<string, FollowEntry>;

const EMPTY: Store = {};
const listeners = new Set<() => void>();
let cacheRaw: string | null = null;
let cache: Store = EMPTY;

// Lee localStorage solo si ha cambiado, para que useSyncExternalStore reciba siempre el mismo objeto
function read(): Store {
    try {
        const raw = localStorage.getItem(KEY) ?? "{}";
        if (raw !== cacheRaw) {
            cacheRaw = raw;
            const parsed = JSON.parse(raw);
            cache = parsed && typeof parsed === "object" ? parsed : EMPTY;
        }
        return cache;
    } catch {
        return EMPTY;
    }
}

function write(store: Store) {
    try {
        localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
        // Navegación privada o almacenamiento bloqueado: se pierde al recargar
        cacheRaw = null;
        cache = store;
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => e.key === KEY && listener(); // otras pestañas
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

export function useFollowed() {
    const followed = useSyncExternalStore(subscribe, read, () => EMPTY);

    const isFollowed = useCallback((id: number) => String(id) in followed, [followed]);

    const toggle = useCallback((product: Product) => {
        const next = { ...read() };
        const key = String(product.id);
        if (key in next) delete next[key];
        else next[key] = { price: product.price, seenAt: new Date().toISOString() };
        write(next);
    }, []);

    const unfollow = useCallback((id: number) => {
        const next = { ...read() };
        delete next[String(id)];
        write(next);
    }, []);

    // Al abrir la ficha de un producto seguido, su precio actual pasa a ser la referencia
    const markSeen = useCallback((product: Product) => {
        const current = read()[String(product.id)];
        if (!current || current.price === product.price) return;
        write({ ...read(), [product.id]: { price: product.price, seenAt: new Date().toISOString() } });
    }, []);

    return { followed, count: Object.keys(followed).length, isFollowed, toggle, unfollow, markSeen };
}
