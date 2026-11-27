/**
 * Tiendas registradas y alta de nuevas.
 */

import { useState } from "react";
import { ExternalLink, Loader2, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import API_BASE_URL from "@/config/api";
import { getToken } from "@/config/auth";
import { useApi } from "@/hooks/useApi";
import type { Company } from "@/lib/types";

function NewCompanySheet({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/companies/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name, website }),
            });
            if (!response.ok) throw new Error(`Error ${response.status}`);
            setName("");
            setWebsite("");
            setOpen(false);
            onCreated();
        } catch (err) {
            setError(`No se ha podido crear la tienda (${err instanceof Error ? err.message : "error desconocido"}).`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button><Plus /> Nueva tienda</Button>
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <SheetHeader>
                        <SheetTitle>Nueva tienda</SheetTitle>
                        <SheetDescription>Después podrás añadirle páginas a leer desde Scraping.</SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-5 px-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company-name">Nombre</Label>
                            <Input id="company-name" placeholder="AgroProductos" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company-website">Web</Label>
                            <Input id="company-website" type="url" placeholder="https://www.ejemplo.es" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="animate-spin" />} Guardar
                        </Button>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function CompaniesPanel() {
    const { data: companies, loading, reload } = useApi<Company[]>("/companies/all");

    return (
        <AppShell breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Empresas" }]}>
            <PageHeader
                title="Tiendas"
                description="Empresas cuyos precios recoge FitoPrice."
                actions={<NewCompanySheet onCreated={reload} />}
            />

            <Card className="py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-4">Nombre</TableHead>
                            <TableHead>Web</TableHead>
                            <TableHead className="pr-4 text-right">Productos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="px-4"><Skeleton className="h-9 w-full" /></TableCell>
                            </TableRow>
                        ) : companies?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">Todavía no hay tiendas.</TableCell>
                            </TableRow>
                        ) : (
                            companies?.map((company) => (
                                <TableRow key={company.id}>
                                    <TableCell className="pl-4 font-medium">{company.name}</TableCell>
                                    <TableCell>
                                        {company.website ? (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline">
                                                {company.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        ) : "—"}
                                    </TableCell>
                                    <TableCell className="stencil pr-4 text-right text-2xl">{company.product_count}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </AppShell>
    );
}
