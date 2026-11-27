/**
 * Resumen del panel de administración: estado de la recogida de precios,
 * tiendas y primeros productos.
 */

import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import Price from "@/components/Price";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/useApi";
import type { Company, Product } from "@/lib/types";
import { formatDate, formatRelative } from "@/lib/utils";

export default function AdminPanel() {
    const { data: companies } = useApi<Company[]>("/companies/all");
    const { data: count } = useApi<{ count: number }>("/products/count");
    const { data: last } = useApi<{ scraped_at: string | null }>("/products/last-scraped");
    const { data: products } = useApi<Product[]>("/products/fifteen");
    const ready = companies && count && last;

    return (
        <AppShell breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Resumen" }]}>
            <PageHeader title="Resumen" />

            <div className="rounded-lg border-l-4 border-primary bg-card px-5 py-4 text-lg">
                {ready ? (
                    <p>
                        Hay <strong>{count.count} productos</strong> de <strong>{companies.length} tiendas</strong>.
                        La última lectura de precios fue {formatRelative(last.scraped_at)} ({formatDate(last.scraped_at, true)}).
                    </p>
                ) : (
                    <Skeleton className="h-7 w-full max-w-xl" />
                )}
            </div>

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <section className="space-y-4">
                    <div className="flex items-end justify-between">
                        <h2 className="headline text-4xl">Tiendas</h2>
                        <Button asChild variant="link" className="px-0"><Link to="/admin/companies">Gestionar tiendas</Link></Button>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-foreground text-sm">
                                <th scope="col" className="pb-2 font-semibold">Tienda</th>
                                <th scope="col" className="pb-2 text-right font-semibold">Productos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(companies ?? []).map((company) => (
                                <tr key={company.id}>
                                    <td className="py-3 font-bold">{company.name}</td>
                                    <td className="stencil py-3 text-right text-2xl">{company.product_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="space-y-4">
                    <div className="flex items-end justify-between">
                        <h2 className="headline text-4xl">Productos</h2>
                        <Button asChild variant="link" className="px-0"><Link to="/admin/products">Ver los {count?.count ?? ""} productos</Link></Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-2 border-foreground hover:bg-transparent">
                                <TableHead className="pl-0 font-semibold text-foreground">Producto</TableHead>
                                <TableHead className="hidden font-semibold text-foreground sm:table-cell">Tienda</TableHead>
                                <TableHead className="pr-0 text-right font-semibold text-foreground">Precio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(products ?? []).slice(0, 6).map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="pl-0">
                                        <Link to={`/product?id=${product.id}`} className="flex items-center gap-3 hover:underline">
                                            <ProductImage src={product.product_img_url} alt="" className="size-9 shrink-0 rounded-sm border" />
                                            <span className="max-w-[280px] truncate font-semibold">{product.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground sm:table-cell">{product.company_name}</TableCell>
                                    <TableCell className="pr-0 text-right"><Price cents={product.price} className="text-xl" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
            </div>
        </AppShell>
    );
}
