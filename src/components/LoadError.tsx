/**
 * Aviso para el usuario cuando una petición a la API falla.
 * No enseña el error técnico (va a la consola desde useApi): solo qué ha pasado
 * y un botón para volver a intentarlo.
 */

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadErrorProps {
    /** Qué no se ha podido cargar: "los precios", "el catálogo"… */
    what: string;
    onRetry: () => void;
    className?: string;
}

export default function LoadError({ what, onRetry, className }: LoadErrorProps) {
    return (
        <div role="alert" className={cn("flex flex-col items-center gap-3 px-5 py-10 text-center", className)}>
            <p className="font-semibold">No hemos podido cargar {what}.</p>
            <p className="max-w-[48ch] text-sm text-muted-foreground">Puede ser un corte momentáneo. Vuelve a intentarlo en unos segundos.</p>
            <Button variant="outline" onClick={onRetry}>
                <RotateCw /> Volver a intentarlo
            </Button>
        </div>
    );
}
