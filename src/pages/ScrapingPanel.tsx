/**
 * Páginas que se raspan de cada tienda y los selectores CSS para leerlas.
 * Las lee el workflow de n8n (cada día a las 7:00) y también `npm run scrape` del backend.
 */

import { useState } from "react";
import { ExternalLink, Loader2, Pencil, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import API_BASE_URL from "@/config/api";
import { getToken } from "@/config/auth";
import { useApi } from "@/hooks/useApi";
import type { Company, CompanyUrl, CompanyWithUrls } from "@/lib/types";

interface JobForm {
    url: string;
    selector_card: string;
    selector_title: string;
    selector_price: string;
    selector_image: string;
    selector_link: string;
}

const emptyForm: JobForm = { url: "", selector_card: "", selector_title: "", selector_price: "", selector_image: "", selector_link: "" };

const selectorFields: { key: keyof JobForm; label: string; placeholder: string; hint?: string }[] = [
    { key: "selector_card", label: "Ficha de producto", placeholder: ".product-miniature", hint: "El bloque de cada producto en el listado. Los demás selectores se buscan dentro de él." },
    { key: "selector_title", label: "Nombre", placeholder: ".product-title" },
    { key: "selector_price", label: "Precio", placeholder: ".price" },
    { key: "selector_image", label: "Imagen", placeholder: ".product-thumbnail img" },
    { key: "selector_link", label: "Enlace", placeholder: ".product-title a" },
];

async function sendJob(path: string, method: "POST" | "PUT", body: object) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
}

// Campos de URL y selectores, compartidos por el alta y la edición
function JobFields({ form, onChange }: { form: JobForm; onChange: (form: JobForm) => void }) {
    const set = (key: keyof JobForm) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...form, [key]: e.target.value });

    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="job-url">URL de la página</Label>
                <Input id="job-url" type="url" placeholder="https://www.tienda.es/categoria" value={form.url} onChange={set("url")} required />
            </div>
            <fieldset className="grid gap-3">
                <legend className="mb-1 text-sm font-medium">Selectores CSS</legend>
                <div className="grid gap-3">
                    {selectorFields.map((field) => (
                        <div key={field.key} className="grid gap-1.5">
                            <Label htmlFor={`job-${field.key}`} className="text-xs text-muted-foreground">{field.label}</Label>
                            <Input id={`job-${field.key}`} className="font-mono text-xs" placeholder={field.placeholder} value={form[field.key]} onChange={set(field.key)} required aria-describedby={field.hint ? `job-${field.key}-hint` : undefined} />
                            {field.hint && <p id={`job-${field.key}-hint`} className="text-xs text-muted-foreground">{field.hint}</p>}
                        </div>
                    ))}
                </div>
            </fieldset>
        </>
    );
}

function NewJobDialog({ companies, onSaved }: { companies: Company[]; onSaved: () => void }) {
    const [open, setOpen] = useState(false);
    const [companyId, setCompanyId] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return setError("Elige una tienda.");
        setSaving(true);
        setError("");
        try {
            await sendJob("/scraping/scraping-job", "POST", { company_id: Number(companyId), ...form });
            setForm(emptyForm);
            setCompanyId("");
            setOpen(false);
            onSaved();
        } catch (err) {
            setError(`No se ha podido guardar (${err instanceof Error ? err.message : "error desconocido"}).`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus /> Nueva página</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit} className="grid gap-5">
                    <DialogHeader>
                        <DialogTitle>Nueva página a raspar</DialogTitle>
                        <DialogDescription>Indica la página del catálogo y cómo encontrar cada dato en su HTML.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label>Tienda</Label>
                        <Select value={companyId} onValueChange={setCompanyId}>
                            <SelectTrigger className="w-full" aria-label="Tienda">
                                <SelectValue placeholder="Selecciona una tienda" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem key={company.id} value={String(company.id)}>{company.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <JobFields form={form} onChange={setForm} />
                    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={saving}>{saving && <Loader2 className="animate-spin" />} Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface EditTarget {
    companyName: string;
    urlObj: CompanyUrl;
}

function EditJobSheet({ target, onClose, onSaved }: { target: EditTarget | null; onClose: () => void; onSaved: () => void }) {
    const config = target?.urlObj.scraping_config;
    const [form, setForm] = useState(emptyForm);
    const [active, setActive] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [loadedId, setLoadedId] = useState<number | null>(null);

    // Rellenar el formulario cada vez que se abre con otra página
    if (target && target.urlObj.id !== loadedId) {
        setLoadedId(target.urlObj.id);
        setForm({
            url: target.urlObj.url,
            selector_card: config?.selector_card ?? "",
            selector_title: config?.selector_title ?? "",
            selector_price: config?.selector_price ?? "",
            selector_image: config?.selector_image ?? "",
            selector_link: config?.selector_link ?? "",
        });
        setActive(target.urlObj.active);
        setError("");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!target) return;
        setSaving(true);
        setError("");
        try {
            await sendJob(`/scraping/scraping-job/${target.urlObj.id}`, "PUT", { ...form, active });
            onSaved();
            onClose();
        } catch (err) {
            setError(`No se ha podido guardar (${err instanceof Error ? err.message : "error desconocido"}).`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={target !== null} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <SheetHeader>
                        <SheetTitle>{target?.companyName}</SheetTitle>
                        <SheetDescription>Edita la página y los selectores que se usan para leerla.</SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-5 overflow-y-auto px-4">
                        <JobFields form={form} onChange={setForm} />
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <Label htmlFor="job-active">Activa</Label>
                                <p className="text-xs text-muted-foreground">Si está desactivada, el scraping la salta.</p>
                            </div>
                            <Switch id="job-active" checked={active} onCheckedChange={setActive} />
                        </div>
                        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={saving}>{saving && <Loader2 className="animate-spin" />} Guardar cambios</Button>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function ScrapingPanel() {
    const { data: scrapedCompanies, loading, reload } = useApi<CompanyWithUrls[]>("/companies/scraping-config", { auth: true });
    const { data: companies } = useApi<Company[]>("/companies/all");
    const [editing, setEditing] = useState<EditTarget | null>(null);

    const rows = (scrapedCompanies ?? []).flatMap((company) => company.company_urls.map((urlObj) => ({ company, urlObj })));

    return (
        <AppShell breadcrumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Scraping" }]}>
            <PageHeader
                title="Scraping"
                description={
                    <>
                        Páginas que se leen de cada tienda. n8n las lee todos los días a las 7:00; para lanzar una lectura en otro momento, abre el workflow en n8n y ejecútalo.
                    </>
                }
                actions={<NewJobDialog companies={companies ?? []} onSaved={reload} />}
            />

            <Card className="py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-4">Tienda</TableHead>
                            <TableHead>Página</TableHead>
                            <TableHead className="hidden lg:table-cell">Ficha de producto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-12 pr-4"><span className="sr-only">Acciones</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-4"><Skeleton className="h-9 w-full" /></TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Todavía no hay páginas configuradas.</TableCell>
                            </TableRow>
                        ) : (
                            rows.map(({ company, urlObj }) => (
                                <TableRow key={urlObj.id}>
                                    <TableCell className="pl-4 font-medium">{company.name}</TableCell>
                                    <TableCell>
                                        <a href={urlObj.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-[340px] items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline">
                                            <span className="truncate">{urlObj.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                                            <ExternalLink className="size-3.5 shrink-0" />
                                        </a>
                                    </TableCell>
                                    <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">
                                        {urlObj.scraping_config?.selector_card ?? <span className="text-destructive">Falta: n8n salta esta página</span>}
                                    </TableCell>
                                    <TableCell>
                                        {urlObj.active ? (
                                            <Badge className="bg-hoja/15 text-hoja">Activa</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactiva</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="pr-4">
                                        <Button variant="ghost" size="icon-sm" aria-label={`Editar ${urlObj.url}`} onClick={() => setEditing({ companyName: company.name, urlObj })}>
                                            <Pencil />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <EditJobSheet target={editing} onClose={() => setEditing(null)} onSaved={reload} />
        </AppShell>
    );
}
