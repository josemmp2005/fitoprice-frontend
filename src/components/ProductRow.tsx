/**
 * Una línea de la tablilla de precios: foto, nombre, tienda y precio,
 * con el precio por litro o kilo debajo cuando se conoce el envase.
 */

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Price from "@/components/Price";
import PriceChange from "@/components/PriceChange";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";
import { cn, formatUnitPrice } from "@/lib/utils";

interface ProductRowProps {
    product: Product;
    // Línea extra bajo la tienda (p. ej. qué ha cambiado desde la última visita)
    note?: ReactNode;
    className?: string;
}

export default function ProductRow({ product, note, className }: ProductRowProps) {
    const unitPrice = formatUnitPrice(product.price_per_unit, product.unit);

    return (
        <Link
            to={`/product?id=${product.id}`}
            className={cn(
                "group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/60 focus-visible:bg-accent focus-visible:outline-none sm:px-5",
                className,
            )}
        >
            <ProductImage src={product.product_img_url} alt="" className="size-14 rounded-sm border transition-transform duration-300 ease-(--ease-asienta) group-hover:scale-105" />
            <div className="min-w-0">
                <p className="line-clamp-2 font-semibold leading-snug">{product.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{product.company_name ?? "Sin tienda"}</p>
                {note && <div className="mt-1 text-sm">{note}</div>}
            </div>
            <div className="flex flex-col items-end gap-1">
                <Price cents={product.price} className="text-2xl sm:text-3xl" />
                {unitPrice && <span className="text-sm font-semibold tabular-nums text-muted-foreground">{unitPrice}</span>}
                <PriceChange value={product.percentage_change} />
            </div>
        </Link>
    );
}
