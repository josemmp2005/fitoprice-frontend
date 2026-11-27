/**
 * Hero de la landing: la propia herramienta. Una pregunta, un buscador sobre el
 * catálogo real y los resultados al momento.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import ProductRow from "@/components/ProductRow";
import { Input } from "@/components/ui/input";
import LoadError from "@/components/LoadError";
import ProductListSkeleton from "@/components/ProductListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/lib/types";
import { formatDate, normalize } from "@/lib/utils";

const suggestions = ["Cobre", "Azufre", "Parafina", "Cipermetrina", "Aminoácidos", "Hierro"];
const MAX_RESULTS = 5;

export default function Hero() {
    const { data: products, loading, error, reload } = useApi<Product[]>("/products/all");
    const [query, setQuery] = useState("");

    const matches = useMemo(() => {
        const term = normalize(query.trim());
        if (!products) return [];
        if (!term) return products;
        return products.filter((p) => normalize(p.name).includes(term));
    }, [products, query]);

    const shops = useMemo(() => [...new Set((products ?? []).map((p) => p.company_name).filter((name): name is string => Boolean(name)))], [products]);
    const lastRead = useMemo(
        () => (products ?? []).reduce<string | null>((max, p) => (p.scraped_at && (!max || p.scraped_at > max) ? p.scraped_at : max), null),
        [products],
    );

    const catalogLink = query.trim() ? `/dashboard?q=${encodeURIComponent(query.trim())}` : "/dashboard";

    return (
        <section className="pt-28 pb-16 md:pt-32 md:pb-24">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <h1 className="headline max-w-[15ch] text-[clamp(3.25rem,8.5vw,7.5rem)]">¿Cuánto cuesta lo que vas a echar al campo?</h1>
            </div>
            <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 px-4 md:px-6 lg:mt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
                <div className="space-y-5">
                    <p className="max-w-[46ch] text-lg">
                        FitoPrice lee los precios de fitosanitarios, abonos y correctores en tiendas online
                        y te los enseña juntos, con la fecha en que se leyeron.
                    </p>
                    {products ? (
                        <p className="animate-in fade-in text-sm text-muted-foreground duration-500">
                            {products.length} productos de {new Intl.ListFormat("es", { type: "conjunction" }).format(shops)}. Última lectura: {formatDate(lastRead)}.
                        </p>
                    ) : loading ? (
                        <Skeleton className="h-4 w-72 max-w-full" />
                    ) : null}
                </div>

                <div className="min-w-0">
                    <label htmlFor="hero-search" className="mb-2 block font-semibold">Busca un producto</label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <Input
                            id="hero-search"
                            type="search"
                            autoComplete="off"
                            placeholder="Nombre o materia activa"
                            className="h-14 rounded-lg border-2 bg-card pl-12 text-lg md:text-lg"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Prueba con</span>
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setQuery(s)}
                                className="rounded-md border bg-card px-2.5 py-1 transition-colors hover:border-primary hover:text-primary"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 overflow-hidden rounded-lg border bg-card">
                        {error ? (
                            <LoadError what="los precios" onRetry={reload} />
                        ) : loading ? (
                            <ProductListSkeleton rows={MAX_RESULTS} />
                        ) : matches.length === 0 ? (
                            <p className="px-5 py-10 text-center text-muted-foreground">
                                No hay ningún producto que contenga «{query}». Prueba con la materia activa o una palabra más corta.
                            </p>
                        ) : (
                            <ul key={query} className="stagger divide-y" aria-live="polite">
                                {matches.slice(0, MAX_RESULTS).map((product) => (
                                    <li key={product.id}>
                                        <ProductRow product={product} />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {!error && matches.length > 0 && (
                            <Link to={catalogLink} className="block border-t bg-muted/50 px-5 py-3 text-sm font-semibold text-primary hover:bg-muted">
                                {query.trim()
                                    ? `Ver los ${matches.length} resultados en el catálogo`
                                    : `Ver los ${matches.length} productos en el catálogo`}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
