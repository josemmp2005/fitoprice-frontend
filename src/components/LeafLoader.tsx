/**
 * Carga de una pantalla entera: la hoja del logo se llena desde el pie, como la savia.
 * Con movimiento reducido se queda llena y quieta.
 */

import { useId } from "react";
import { cn } from "@/lib/utils";

// Silueta aproximada de la hoja del logo, con el nervio central en blanco
const LEAF = "M62 2C38 18 8 46 8 82c0 25 17 40 34 44l2-58 6 60c22-4 40-22 40-50C90 48 74 22 62 2Z";

export default function LeafLoader({ className, label = "Cargando" }: { className?: string; label?: string }) {
    const id = useId();
    return (
        <div role="status" aria-label={label} className={cn("flex flex-col items-center gap-3", className)}>
            <svg viewBox="0 0 98 130" className="h-16 w-auto" aria-hidden>
                <defs>
                    {/* En coordenadas de la hoja: los colores se quedan quietos mientras la savia sube */}
                    <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="40" y2="130">
                        <stop offset="0" stopColor="#95cd50" />
                        <stop offset="0.55" stopColor="#2f8e6e" />
                        <stop offset="1" stopColor="var(--sulfato)" />
                    </linearGradient>
                    <clipPath id={`${id}-c`}>
                        <path d={LEAF} />
                    </clipPath>
                </defs>
                {/* Hoja vacía */}
                <path d={LEAF} fill="var(--muted)" />
                {/* La savia sube y vuelve a empezar */}
                <g clipPath={`url(#${id}-c)`}>
                    <rect
                        width="98"
                        height="130"
                        fill={`url(#${id}-g)`}
                        className="motion-safe:animate-[sap_1.4s_var(--ease-asienta)_infinite_alternate]"
                    />
                </g>
            </svg>
            <span className="text-sm text-muted-foreground">{label}…</span>
        </div>
    );
}
