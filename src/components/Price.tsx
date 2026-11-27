/**
 * Precio en céntimos con la cifra estarcida y el símbolo del euro más pequeño.
 */

import { cn } from "@/lib/utils";

const parts = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

interface PriceProps {
    cents: number | null | undefined;
    className?: string;
}

export default function Price({ cents, className }: PriceProps) {
    if (cents == null) return <span className={cn("stencil text-muted-foreground", className)}>—</span>;

    const formatted = parts.formatToParts(cents / 100);
    const number = formatted.filter((p) => p.type !== "currency" && p.type !== "literal").map((p) => p.value).join("");

    return (
        <span className={cn("stencil whitespace-nowrap", className)} aria-label={parts.format(cents / 100)}>
            {number}
            <span className="ml-[0.08em] text-[0.62em]" aria-hidden>€</span>
        </span>
    );
}
