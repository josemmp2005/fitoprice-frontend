/**
 * Línea fina con el degradado del logo (verde a azul) bajo las cabeceras.
 * Mientras hay peticiones a la API en marcha, un tramo verde la recorre.
 */

import { useLoading } from "@/hooks/useLoading";
import { cn } from "@/lib/utils";

interface LeafRuleProps {
    className?: string;
    // Oculta la línea cuando no carga nada (la cabecera de la landing antes de hacer scroll)
    hidden?: boolean;
}

export default function LeafRule({ className, hidden = false }: LeafRuleProps) {
    const loading = useLoading();
    return (
        <div
            aria-hidden
            className={cn(
                "h-0.5 transition-opacity duration-300",
                loading ? "leaf-rule-loading" : "leaf-rule",
                hidden && !loading && "opacity-0",
                className,
            )}
        />
    );
}
