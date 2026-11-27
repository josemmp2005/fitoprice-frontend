/**
 * Esqueleto de una lista de productos mientras carga: misma rejilla que ProductRow
 * (foto, nombre y tienda, precio) para que nada salte al llegar los datos.
 */

import { Skeleton } from "@/components/ui/skeleton";

// Anchos distintos por fila para que no parezca una cuadrícula
const NAME_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-3/5"];

export default function ProductListSkeleton({ rows = 6, label = "Cargando productos" }: { rows?: number; label?: string }) {
    return (
        <ul className="divide-y" role="status" aria-label={label}>
            {Array.from({ length: rows }, (_, i) => (
                <li key={i} className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-5">
                    <Skeleton className="size-14 rounded-sm" />
                    <div className="space-y-2">
                        <Skeleton className={`h-4 ${NAME_WIDTHS[i % NAME_WIDTHS.length]}`} />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-3 w-14" />
                    </div>
                </li>
            ))}
        </ul>
    );
}
