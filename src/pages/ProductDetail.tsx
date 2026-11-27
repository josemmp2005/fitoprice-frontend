/**
 * Ficha de producto: último precio y precio por litro o kilo, precio en cada tienda,
 * calculadora del coste del tratamiento, evolución del precio y alternativas
 * con la misma materia activa. El visitante puede seguir el producto (se guarda en su navegador).
 * Si el producto está en el Registro Oficial de Productos Fitosanitarios, muestra sus usos autorizados.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import AppShell from "@/components/AppShell";
import CostCalculator from "@/components/CostCalculator";
import ProductRow from "@/components/ProductRow";
import RegistrySection from "@/components/RegistrySection";
import Price from "@/components/Price";
import PriceChange from "@/components/PriceChange";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useApi } from "@/hooks/useApi";
import { useFollowed } from "@/hooks/useFollowed";
import type { PriceHistoryItem, Product, ProductSeller, RegistryProduct } from "@/lib/types";
import { cn, formatDate, formatPrice, formatQuantity, unitName } from "@/lib/utils";

const chartConfig = {
    price: { label: "Precio", color: "var(--chart-1)" },
} satisfies ChartConfig;

const shortDate = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" });

function PriceChart({ history }: { history: PriceHistoryItem[] }) {
    const data = useMemo(
        () =>
            [...history]
                .sort((a, b) => a.scraped_at.localeCompare(b.scraped_at))
                .map((item) => ({ date: item.scraped_at, price: item.price / 100 })),
        [history],
    );

    if (data.length < 2) {
        return (
            <p className="max-w-[60ch] text-muted-foreground">
                {data.length === 1
                    ? `De momento solo hay una lectura, la del ${formatDate(data[0].date)}. La evolución aparecerá aquí a partir de la siguiente.`
                    : "Todavía no se ha leído ningún precio de este producto."}
            </p>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <LineChart accessibilityLayer data={data} margin={{ left: 4, right: 12, top: 12, bottom: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="2 4" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} tickFormatter={(v: string) => shortDate.format(new Date(v))} />
                <YAxis tickLine={false} axisLine={false} width={68} tickFormatter={(v: number) => formatPrice(v * 100)} domain={["auto", "auto"]} />
                <ChartTooltip
                    cursor={{ strokeDasharray: "2 4" }}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(_, payload) => formatDate(payload?.[0]?.payload?.date, true)}
                            formatter={(value) => <span className="font-semibold tabular-nums">{formatPrice(Number(value) * 100)}</span>}
                        />
                    }
                />
                <Line dataKey="price" type="stepAfter" stroke="var(--color-price)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-price)" }} activeDot={{ r: 5 }} />
            </LineChart>
        </ChartContainer>
    );
}

function SellerTable({ sellers }: { sellers: ProductSeller[] }) {
    if (sellers.length === 0) {
        return <p className="text-muted-foreground">Ninguna tienda tiene ahora mismo un precio para este producto.</p>;
    }

    return (
        <table className="w-full text-left">
            <caption className="sr-only">Último precio en cada tienda, de más barato a más caro</caption>
            <thead>
                <tr className="border-b-2 border-foreground text-sm">
                    <th scope="col" className="pb-2 font-semibold">Tienda</th>
                    <th scope="col" className="hidden pb-2 font-semibold sm:table-cell">Leído</th>
                    <th scope="col" className="pb-2 text-right font-semibold">Precio</th>
                    <th scope="col" className="w-10 pb-2"><span className="sr-only">Enlace</span></th>
                </tr>
            </thead>
            <tbody className="stagger divide-y">
                {sellers.map((seller, index) => {
                    const cheapest = index === 0 && sellers.length > 1;
                    return (
                        <tr key={seller.company_id}>
                            <td className="py-3">
                                <span className="font-bold">{seller.name}</span>
                                {cheapest && <span className="ml-2 rounded-sm bg-best px-1.5 py-0.5 text-xs font-bold text-best-foreground">Más barato</span>}
                            </td>
                            <td className="hidden py-3 text-sm text-muted-foreground sm:table-cell">{formatDate(seller.scraped_at)}</td>
                            <td className="py-3 text-right">
                                <Price cents={seller.price} className={cn("text-2xl", cheapest && "bg-best px-1 text-best-foreground")} />
                            </td>
                            <td className="py-3 text-right">
                                {seller.product_link && (
                                    <Button asChild variant="ghost" size="icon-sm" aria-label={`Abrir en ${seller.name}`}>
                                        <a href={seller.product_link} target="_blank" rel="noopener noreferrer"><ExternalLink /></a>
                                    </Button>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

// ["Cobre", "Azufre"] -> "cobre o azufre"
const listOr = (items: string[]) => {
    const lower = items.map((i) => (i === "NPK" ? i : i.toLowerCase()));
    return lower.length > 1 ? `${lower.slice(0, -1).join(", ")} o ${lower.at(-1)}` : lower[0];
};

// "Un 20 % más barato por litro" respecto al producto de la ficha
function UnitComparison({ theirs, ours, unit }: { theirs: number; ours: number; unit: "L" | "kg" }) {
    const diff = Math.round(((theirs - ours) / ours) * 100);
    if (diff === 0) return <span className="text-muted-foreground">Mismo precio por {unitName(unit)}</span>;
    return diff < 0
        ? <span className="font-semibold text-price-down">Un {-diff} % más barato por {unitName(unit)}</span>
        : <span className="text-price-up">Un {diff} % más caro por {unitName(unit)}</span>;
}

export default function ProductDetail() {
    const [params] = useSearchParams();
    const productId = params.get("id");
    const valid = productId !== null && /^\d+$/.test(productId);

    const { data: products, loading, error } = useApi<Product[]>(valid ? `/products/${productId}` : null);
    const { data: history } = useApi<PriceHistoryItem[]>(valid ? `/products/${productId}/price-history` : null);
    const { data: sellers } = useApi<ProductSeller[]>(valid ? `/companies/${productId}` : null);
    const { data: alternatives } = useApi<Product[]>(valid ? `/products/${productId}/alternatives` : null);
    // 404 si el producto no está enlazado con el registro oficial: entonces no se muestra la sección
    const { data: registry } = useApi<RegistryProduct>(valid ? `/products/${productId}/registry` : null);
    // Dosis que el visitante pasa del registro a la calculadora (n cambia la key para reiniciarla)
    const [preset, setPreset] = useState<{ value: number; unit: string; n: number } | null>(null);
    const calculatorRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (preset) calculatorRef.current?.scrollIntoView({ block: "start" });
    }, [preset]);
    const { isFollowed, toggle, markSeen } = useFollowed();
    const [pops, setPops] = useState(0);
    const product = products?.[0];
    const following = product ? isFollowed(product.id) : false;
    const packAmount = product?.pack_amount ? Number(product.pack_amount) : null;

    // Si lo sigue, el precio de hoy pasa a ser la referencia de "Tus productos"
    useEffect(() => {
        if (product) markSeen(product);
    }, [product, markSeen]);

    const crumbs = [{ label: "Inicio", to: "/" }, { label: "Catálogo", to: "/dashboard" }, { label: product?.name ?? "Producto" }];

    if (!valid || error || (!loading && !product)) {
        return (
            <AppShell breadcrumbs={crumbs}>
                <div className="space-y-4 py-16">
                    <h1 className="headline text-5xl">Este producto no está en el catálogo</h1>
                    <p className="max-w-[60ch] text-muted-foreground">
                        {error ? `No se ha podido cargar (${error}). Comprueba que la API está en marcha.` : "Puede que el enlace esté mal o que el producto se haya retirado."}
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/dashboard"><ArrowLeft /> Volver al catálogo</Link>
                    </Button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell breadcrumbs={crumbs}>
            {loading || !product ? (
                // Misma rejilla que la ficha: foto, nombre, precio, datos y botones
                <div role="status" aria-label="Cargando el producto" className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="flex flex-col gap-5">
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-11/12" />
                            <Skeleton className="h-12 w-2/3" />
                        </div>
                        <Skeleton className="h-20 w-56" />
                        <Skeleton className="h-4 w-72 max-w-full" />
                        <Skeleton className="h-5 w-80 max-w-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-60" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-44" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <article className="grid grid-cols-1 gap-8 animate-in fade-in duration-500 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
                        <ProductImage src={product.product_img_url} alt={product.name} className="aspect-square rounded-lg border" />

                        <div className="flex flex-col gap-5">
                            <h1 className="headline text-5xl md:text-6xl">{product.name}</h1>
                            <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                                {/* El precio cae como un sello, el único momento llamativo de la ficha */}
                                <Price cents={product.price} className="inline-block origin-bottom-left animate-stamp text-7xl [animation-delay:150ms] md:text-8xl" />
                                <PriceChange value={product.percentage_change} className="mb-2 text-base" />
                            </div>
                            <p className="text-muted-foreground">
                                En {product.company_name ?? "la tienda"}, leído el {formatDate(product.scraped_at, true)}.
                            </p>
                            {packAmount && product.unit && product.price_per_unit != null && (
                                <p className="text-lg">
                                    Envase de <strong>{formatQuantity(packAmount, product.unit)}</strong>:{" "}
                                    <strong>{formatPrice(product.price_per_unit)}</strong> el {unitName(product.unit)}.
                                </p>
                            )}
                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                                {product.category && (
                                    <>
                                        <dt className="text-muted-foreground">Tipo</dt>
                                        <dd>
                                            <Link to={`/dashboard?tipo=${encodeURIComponent(product.category)}`} className="font-semibold text-primary hover:underline">
                                                {product.category}
                                            </Link>
                                        </dd>
                                    </>
                                )}
                                {product.active_ingredients.length > 0 && (
                                    <>
                                        <dt className="text-muted-foreground">Contiene</dt>
                                        <dd className="font-semibold">{product.active_ingredients.join(", ")}</dd>
                                    </>
                                )}
                            </dl>
                            <div className="flex flex-wrap gap-3">
                                {product.product_link && (
                                    <Button asChild size="lg">
                                        <a href={product.product_link} target="_blank" rel="noopener noreferrer">
                                            Abrir en {product.company_name ?? "la tienda"}
                                            <ExternalLink aria-hidden />
                                        </a>
                                    </Button>
                                )}
                                <Button size="lg" variant="outline" aria-pressed={following} onClick={() => { toggle(product); setPops((n) => n + 1); }}>
                                    {/* El icono da un salto al pulsar (no al cargar la ficha) */}
                                    {following
                                        ? <BookmarkCheck key={pops} className={cn("text-primary", pops > 0 && "animate-pop")} />
                                        : <Bookmark key={pops} className={cn(pops > 0 && "animate-pop")} />}
                                    {following ? "Siguiendo este precio" : "Seguir este precio"}
                                </Button>
                            </div>
                            {following && (
                                <p className="text-sm text-muted-foreground">
                                    Lo verás en <Link to="/seguidos" className="font-semibold text-primary hover:underline">Tus productos</Link>, con lo que haya cambiado desde hoy.
                                </p>
                            )}
                        </div>
                    </article>

                    <section className="space-y-4 border-t pt-8">
                        <h2 className="headline text-4xl">Precio en cada tienda</h2>
                        {sellers ? (
                            <SellerTable sellers={sellers} />
                        ) : (
                            <div role="status" aria-label="Cargando las tiendas" className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        )}
                    </section>

                    {registry && (
                        <section className="space-y-4 border-t pt-8">
                            <h2 className="headline text-4xl">Registro oficial</h2>
                            <RegistrySection
                                registry={registry}
                                shopName={product.name}
                                unit={product.unit}
                                onUseDose={packAmount && product.price != null ? (dose) => setPreset({ ...dose, n: Date.now() }) : undefined}
                            />
                        </section>
                    )}

                    <section ref={calculatorRef} className="scroll-mt-20 space-y-4 border-t pt-8">
                        <h2 className="headline text-4xl">Coste del tratamiento</h2>
                        {packAmount && product.unit && product.price != null ? (
                            <CostCalculator
                                key={preset?.n ?? 0}
                                product={{ ...product, unit: product.unit, price: product.price }}
                                packAmount={packAmount}
                                initialDose={preset ?? undefined}
                            />
                        ) : (
                            <p className="max-w-[60ch] text-muted-foreground">
                                La tienda no indica el tamaño del envase en el nombre del producto, así que no podemos calcular cuánto necesitas.
                                Mira el formato en su web.
                            </p>
                        )}
                    </section>

                    <section className="space-y-4 border-t pt-8">
                        <h2 className="headline text-4xl">Evolución del precio</h2>
                        {history ? <PriceChart history={history} /> : <Skeleton className="h-[260px] w-full" />}
                    </section>

                    {alternatives && alternatives.length > 0 && (
                        <section className="space-y-4 border-t pt-8">
                            <div className="space-y-2">
                                <h2 className="headline text-4xl">Alternativas</h2>
                                <p className="max-w-[65ch] text-muted-foreground">
                                    Productos que también contienen {listOr(product.active_ingredients)}. Compara el precio por litro o kilo,
                                    pero ten en cuenta que la concentración y la dosis pueden ser distintas.
                                </p>
                            </div>
                            <ul className="stagger divide-y overflow-hidden rounded-lg border bg-card">
                                {alternatives.map((alt) => (
                                    <li key={alt.id}>
                                        <ProductRow
                                            product={alt}
                                            note={
                                                product.unit && alt.unit === product.unit && alt.price_per_unit != null && product.price_per_unit != null
                                                    ? <UnitComparison theirs={alt.price_per_unit} ours={product.price_per_unit} unit={product.unit} />
                                                    : null
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </>
            )}
        </AppShell>
    );
}
