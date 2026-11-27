/**
 * "Tus productos": los que sigue el visitante (guardados en su navegador),
 * con lo que ha cambiado su precio desde la última vez que abrió su ficha.
 */

import { Link } from "react-router-dom";
import { X } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import LoadError from "@/components/LoadError";
import ProductListSkeleton from "@/components/ProductListSkeleton";
import ProductRow from "@/components/ProductRow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import { type FollowEntry, useFollowed } from "@/hooks/useFollowed";
import type { Product } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

function ChangeNote({ product, entry }: { product: Product; entry: FollowEntry }) {
    const since = formatDate(entry.seenAt);
    if (product.price == null) return <span className="text-muted-foreground">Ahora mismo no tiene precio en la tienda.</span>;
    if (entry.price == null || entry.price === product.price) {
        return <span className="text-muted-foreground">Igual que cuando lo miraste el {since}.</span>;
    }
    const diff = product.price - entry.price;
    return diff < 0
        ? <span className="font-semibold text-price-down">Ha bajado {formatPrice(-diff)} desde el {since}.</span>
        : <span className="font-semibold text-price-up">Ha subido {formatPrice(diff)} desde el {since}.</span>;
}

export default function Followed() {
    const { followed, count, unfollow } = useFollowed();
    const { data: products, loading, error, reload } = useApi<Product[]>(count > 0 ? "/products/all" : null);

    const list = (products ?? []).filter((p) => String(p.id) in followed);
    // Primero los que han cambiado
    const changed = (p: Product) => (followed[p.id]?.price ?? p.price) !== p.price;
    list.sort((a, b) => Number(changed(b)) - Number(changed(a)));
    const changes = list.filter(changed).length;

    return (
        <AppShell breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Tus productos" }]}>
            <PageHeader
                title="Tus productos"
                description={
                    count === 0
                        ? "Sigue los productos que compras para ver de un vistazo si han cambiado de precio. Se guardan en este navegador; no hace falta cuenta."
                        : !products
                          ? <Skeleton className="mt-1 h-4 w-96 max-w-full" />
                          : changes > 0
                          ? `${changes} de ${count} han cambiado de precio desde la última vez que los miraste.`
                          : `Ninguno de los ${count} ha cambiado de precio desde la última vez que los miraste.`
                }
            />

            {count === 0 ? (
                <div className="flex flex-col items-start gap-4 rounded-lg border bg-card p-6">
                    <p className="max-w-[60ch]">
                        Todavía no sigues ningún producto. Abre uno en el catálogo y pulsa <strong>Seguir este precio</strong>.
                    </p>
                    <Button asChild>
                        <Link to="/dashboard">Abrir el catálogo</Link>
                    </Button>
                </div>
            ) : error ? (
                <LoadError what="los precios de tus productos" onRetry={reload} className="rounded-lg border bg-card" />
            ) : loading ? (
                <div className="overflow-hidden rounded-lg border bg-card">
                    <ProductListSkeleton rows={Math.min(count, 6)} label="Cargando tus productos" />
                </div>
            ) : (
                <ul className="stagger divide-y overflow-hidden rounded-lg border bg-card">
                    {list.map((product) => (
                        <li key={product.id} className="flex items-center">
                            <ProductRow product={product} note={<ChangeNote product={product} entry={followed[product.id]} />} className="flex-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2 shrink-0 text-muted-foreground"
                                aria-label={`Dejar de seguir ${product.name}`}
                                onClick={() => unfollow(product.id)}
                            >
                                <X />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
            {count > 0 && (
                <p className="text-sm text-muted-foreground">
                    Al abrir la ficha de un producto, su precio de hoy pasa a ser la referencia para la próxima vez.
                </p>
            )}
        </AppShell>
    );
}
