/**
 * Tiendas cuyos precios recoge FitoPrice, con datos reales de la API.
 */

import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import type { Company } from "@/lib/types";

const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function Shops() {
    const { data: companies, loading } = useApi<Company[]>("/companies/all");

    return (
        <section id="tiendas" className="border-t bg-card py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 md:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
                <div className="space-y-4">
                    <h2 className="headline text-5xl md:text-6xl">Tiendas que revisamos</h2>
                    <p className="max-w-[44ch] text-muted-foreground">
                        Por ahora, tiendas online con catálogo de fitosanitarios y nutrición vegetal. Si vendes insumos
                        y quieres aparecer, <a href="#contacto" className="font-semibold text-primary underline-offset-4 hover:underline">escríbenos</a>.
                    </p>
                </div>
                <table className="w-full text-left">
                    <caption className="sr-only">Tiendas y número de productos de cada una</caption>
                    <thead>
                        <tr className="border-b-2 border-foreground text-sm">
                            <th scope="col" className="pb-2 font-semibold">Tienda</th>
                            <th scope="col" className="hidden pb-2 font-semibold sm:table-cell">Web</th>
                            <th scope="col" className="pb-2 text-right font-semibold">Productos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading
                            ? Array.from({ length: 2 }, (_, i) => (
                                <tr key={i}><td colSpan={3} className="py-4"><Skeleton className="h-8 w-full" /></td></tr>
                            ))
                            : companies?.map((company) => (
                                <tr key={company.id}>
                                    <td className="py-4 text-lg font-bold">{company.name}</td>
                                    <td className="hidden py-4 sm:table-cell">
                                        {company.website && (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                                                {hostOf(company.website)}
                                                <ExternalLink className="size-3.5" aria-hidden />
                                            </a>
                                        )}
                                    </td>
                                    <td className="stencil py-4 text-right text-3xl">{company.product_count}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
