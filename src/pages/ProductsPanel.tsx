/**
 * Listado de productos del panel de administración, con búsqueda.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Search } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import Price from "@/components/Price";
import PriceChange from "@/components/PriceChange";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ProductsPanel() {
    const { data: products, loading } = useApi<Product[]>("/products/all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return (products ?? []).filter((product) => product.name.toLowerCase().includes(term));
    }, [products, searchTerm]);

    return (
        <AppShell breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Productos" }]}>
            <PageHeader
                title="Productos"
                description={products ? `${filteredProducts.length} de ${products.length} productos` : "Cargando…"}
                actions={
                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            aria-label="Buscar productos"
                            placeholder="Buscar productos…"
                            className="bg-card pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            />

            <Card className="py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-16 pl-4">ID</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead className="hidden md:table-cell">Tienda</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="hidden lg:table-cell">Leído</TableHead>
                            <TableHead className="w-12 pr-4"><span className="sr-only">Enlace</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 8 }, (_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6} className="px-4"><Skeleton className="h-9 w-full" /></TableCell>
                                </TableRow>
                            ))
                            : filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="pl-4 text-sm text-muted-foreground tabular-nums">{product.id}</TableCell>
                                    <TableCell>
                                        <Link to={`/product?id=${product.id}`} className="flex items-center gap-3 hover:underline">
                                            <ProductImage src={product.product_img_url} alt="" className="size-9 shrink-0 rounded-sm border" />
                                            <span className="max-w-[320px] truncate font-semibold">{product.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground md:table-cell">{product.company_name ?? "—"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <PriceChange value={product.percentage_change} />
                                            <Price cents={product.price} className="text-xl" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground lg:table-cell">{formatDate(product.scraped_at)}</TableCell>
                                    <TableCell className="pr-4">
                                        {product.product_link && (
                                            <Button asChild variant="ghost" size="icon-sm" aria-label="Abrir en la tienda">
                                                <a href={product.product_link} target="_blank" rel="noopener noreferrer"><ExternalLink /></a>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        </AppShell>
    );
}
