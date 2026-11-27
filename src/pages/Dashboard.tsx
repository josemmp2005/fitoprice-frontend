/**
 * Catálogo público: tablilla con todos los productos y su último precio,
 * con búsqueda, filtros por tienda y tipo, y orden (también por precio por litro o kilo).
 * La búsqueda (?q=) y el tipo (?tipo=) viven en la URL para poder enlazarlos.
 */

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import LoadError from "@/components/LoadError";
import ProductListSkeleton from "@/components/ProductListSkeleton";
import ProductRow from "@/components/ProductRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/lib/types";
import { cn, formatDate, normalize } from "@/lib/utils";

type SortKey = "catalog" | "price-asc" | "unit-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
    { value: "catalog", label: "Orden del catálogo" },
    { value: "price-asc", label: "Más baratos primero" },
    { value: "unit-asc", label: "Más baratos por litro o kilo" },
    { value: "price-desc", label: "Más caros primero" },
    { value: "name", label: "Por nombre" },
];

const ALL_TYPES = "all";

const sorters: Record<SortKey, ((a: Product, b: Product) => number) | null> = {
    catalog: null,
    "price-asc": (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
    // Los que no tienen envase conocido van al final
    "unit-asc": (a, b) => (a.price_per_unit ?? Infinity) - (b.price_per_unit ?? Infinity) || (a.price ?? Infinity) - (b.price ?? Infinity),
    "price-desc": (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity),
    name: (a, b) => a.name.localeCompare(b.name, "es"),
};

export default function Dashboard() {
    const { data: products, loading, error, reload } = useApi<Product[]>("/products/all");
    const [params, setParams] = useSearchParams();
    const searchTerm = params.get("q") ?? "";
    const type = params.get("tipo");
    const [company, setCompany] = useState<string | null>(null);
    const [sort, setSort] = useState<SortKey>("catalog");

    // Cambia un parámetro de la URL sin tocar los demás
    const setParam = (key: string, value: string | null) =>
        setParams((current) => {
            const next = new URLSearchParams(current);
            if (value) next.set(key, value);
            else next.delete(key);
            return next;
        }, { replace: true });
    const setSearchTerm = (value: string) => setParam("q", value);
    const setType = (value: string | null) => setParam("tipo", value);

    // Tipos con su número de productos, de más a menos
    const types = useMemo(() => {
        const counts = new Map<string, number>();
        for (const p of products ?? []) if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
        return [...counts].sort((a, b) => b[1] - a[1]);
    }, [products]);

    const companies = useMemo(
        () => [...new Set((products ?? []).map((p) => p.company_name).filter((name): name is string => Boolean(name)))].sort(),
        [products],
    );

    const lastRead = useMemo(
        () => (products ?? []).reduce<string | null>((max, p) => (p.scraped_at && (!max || p.scraped_at > max) ? p.scraped_at : max), null),
        [products],
    );

    const visibleProducts = useMemo(() => {
        const term = normalize(searchTerm.trim());
        const filtered = (products ?? []).filter(
            (p) =>
                (!company || p.company_name === company) &&
                (!type || p.category === type) &&
                (!term || normalize(p.name).includes(term) || p.active_ingredients.some((a) => normalize(a).includes(term))),
        );
        const sorter = sorters[sort];
        return sorter ? [...filtered].sort(sorter) : filtered;
    }, [products, searchTerm, company, type, sort]);

    const filtering = Boolean(searchTerm || company || type);

    return (
        <AppShell breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Catálogo" }]}>
            <PageHeader
                title="Catálogo"
                description={
                    products ? (
                        <span className="animate-in fade-in duration-500">
                            {products.length} productos de {companies.length} tiendas. Última lectura de precios: {formatDate(lastRead)}.
                        </span>
                    ) : loading ? (
                        <Skeleton className="mt-1 h-4 w-80 max-w-full" />
                    ) : null
                }
            />

            {/* Con cuatro tiendas los filtros no caben junto al buscador: el buscador va en su propia fila */}
            <div className="flex flex-col gap-3">
                <div className="w-full max-w-xl">
                    <label htmlFor="catalog-search" className="mb-1.5 block text-sm font-semibold">Buscar</label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <Input
                            id="catalog-search"
                            type="search"
                            placeholder="Nombre o materia activa"
                            className="h-11 bg-card pl-9 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <p id="shop-filter" className="mb-1.5 text-sm font-semibold">Tienda</p>
                        <div role="group" aria-labelledby="shop-filter" className="flex h-11 items-center gap-1 rounded-md border bg-card p-1">
                            {[null, ...companies].map((name) => (
                                <button
                                    key={name ?? "all"}
                                    type="button"
                                    aria-pressed={company === name}
                                    onClick={() => setCompany(name)}
                                    className={cn(
                                        "h-full rounded-sm px-3 text-sm font-semibold transition-colors",
                                        company === name ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    {name ?? "Todas"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="mb-1.5 text-sm font-semibold" id="type-label">Tipo</p>
                        <Select value={type ?? ALL_TYPES} onValueChange={(value) => setType(value === ALL_TYPES ? null : value)}>
                            <SelectTrigger className="h-11 w-[250px] bg-card text-base data-[size=default]:h-11" aria-labelledby="type-label">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_TYPES}>Todos los tipos</SelectItem>
                                {types.map(([name, count]) => (
                                    <SelectItem key={name} value={name}>
                                        {name} <span className="text-muted-foreground">({count})</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="mb-1.5 text-sm font-semibold" id="sort-label">Ordenar</p>
                        <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                            <SelectTrigger className="h-11 w-[250px] bg-card text-base data-[size=default]:h-11" aria-labelledby="sort-label">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="flex items-baseline justify-between border-b-2 border-foreground px-4 py-2.5 text-sm font-semibold sm:px-5">
                    <span>{filtering && products ? `${visibleProducts.length} de ${products.length} productos` : "Producto"}</span>
                    <span>Último precio</span>
                </div>

                {error ? (
                    <LoadError what="el catálogo" onRetry={reload} className="py-12" />
                ) : loading ? (
                    <ProductListSkeleton rows={8} label="Cargando el catálogo" />
                ) : visibleProducts.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                        <p className="font-semibold">Ningún producto coincide con la búsqueda.</p>
                        <p className="max-w-[48ch] text-sm text-muted-foreground">Prueba con la materia activa (cobre, azufre…) o quita los filtros de tienda y tipo.</p>
                        <Button variant="outline" onClick={() => { setParams({}, { replace: true }); setCompany(null); }}>Quitar filtros</Button>
                    </div>
                ) : (
                    // Al cambiar tienda, tipo u orden la lista vuelve a entrar escalonada (al escribir no, para no marear)
                    <ul key={`${company}|${type}|${sort}`} className="stagger divide-y">
                        {visibleProducts.map((product) => (
                            <li key={product.id}>
                                <ProductRow product={product} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AppShell>
    );
}
