/**
 * Variación respecto a la lectura anterior, dicha como en los boletines de lonja:
 * sube, baja o repite. Para quien compra, subir es malo (óxido) y bajar es bueno (hoja).
 * Sin lectura anterior no se muestra nada.
 */

import { cn } from "@/lib/utils";

interface PriceChangeProps {
    value: string | number | null | undefined;
    className?: string;
}

export default function PriceChange({ value, className }: PriceChangeProps) {
    if (value === null || value === undefined) return null;
    const change = Number(value);
    if (Number.isNaN(change)) return null;

    const amount = `${Math.abs(change).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;
    const [label, tone] =
        change > 0 ? [`Sube ${amount}`, "text-price-up"]
        : change < 0 ? [`Baja ${amount}`, "text-price-down"]
        : ["Repite", "text-muted-foreground"];

    return <span className={cn("text-sm font-semibold whitespace-nowrap tabular-nums", tone, className)}>{label}</span>;
}
