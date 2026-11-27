/**
 * Foto de producto sobre fondo blanco (las tiendas las publican así) con
 * un icono de reserva si la imagen no carga.
 */

import { useState } from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
    const [failed, setFailed] = useState(false);

    return (
        <div className={cn("flex items-center justify-center overflow-hidden bg-white", className)}>
            {src && !failed ? (
                <img src={src} alt={alt} loading="lazy" className="size-full object-contain p-[8%]" onError={() => setFailed(true)} />
            ) : (
                <Leaf className="size-1/3 text-neutral-300" aria-hidden />
            )}
        </div>
    );
}
