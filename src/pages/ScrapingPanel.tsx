import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";


import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default function CompaniesPanel() {

    const [scrapedCompanies, setScrapedCompanies] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [nameSelector, setNameSelector] = useState("");
    const [priceSelector, setPriceSelector] = useState("");
    const [imgSelector, setImgSelector] = useState("");
    const [linkSelector, setLinkSelector] = useState("");
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const navigate = useNavigate();

    const handleOpenSheet = (company: any, urlObj: any) => {
        setSelectedCompany(company);
        // Cargar los valores por defecto desde scraping_config de la URL
        const config = urlObj.scraping_config;
        setNameSelector(config?.selector_title || "");
        setPriceSelector(config?.selector_price || "");
        setImgSelector(config?.selector_image || "");
        setLinkSelector(config?.selector_link || "");
    };

    const getCompaniesConf = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/scraping-config`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }
            const data = await response.json();
            // console.log(data[1].company_urls[0].scraping_config.selector_title);
            setScrapedCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };


    const getCompanies = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    }


    useEffect(() => {
        getCompaniesConf();
        getCompanies();
    }, []);

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Empresas</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>

                    <section className="p-8">
                        <h1 className="text-2xl font-bold p-4">Tareas de Scraping</h1>
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Add Scraping</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Añadir tarea de scraping</DialogTitle>
                                        <DialogDescription>
                                            Añade nuevas tareas de scraping aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name-1">Empresa</Label>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona una empresa" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Empresas</SelectLabel>
                                                        {companies.map((company: any) => (
                                                            <SelectItem key={company.id} value={company.id}>
                                                                {company.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1">Url</Label>
                                            <Input id="username-1" name="username" placeholder="http://example.com" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1">Selector Nombre</Label>
                                            <Input id="username-1" name="username" placeholder=".name" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1">Selector Precio</Label>
                                            <Input id="username-1" name="username" placeholder=".price" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1">Selector Img</Label>
                                            <Input id="username-1" name="username" placeholder=".img" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1">Selector Link</Label>
                                            <Input id="username-1" name="username" placeholder=".link" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empresa</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Activa</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scrapedCompanies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Skeleton className="h-10 w-full mb-2" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    scrapedCompanies.flatMap((company: any) =>
                                        company.company_urls.length > 0
                                            ? company.company_urls.map((urlObj: any) => (
                                                <TableRow key={`${company.id}-${urlObj.id}`}>
                                                    <TableCell className="font-medium">{company.name}</TableCell>
                                                    <TableCell>
                                                        <a
                                                            href={urlObj.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            {urlObj.url}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>{company.scrape_status || "Desconocido"}</TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${urlObj.active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                            {urlObj.active ? '✓ Activa' : '✗ Inactiva'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Sheet>
                                                            <SheetTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => handleOpenSheet(company, urlObj)}
                                                                >
                                                                    →
                                                                </Button>
                                                            </SheetTrigger>
                                                            <SheetContent>
                                                                <SheetHeader>
                                                                    <SheetTitle>Configuración de Scraping - {selectedCompany?.name}</SheetTitle>
                                                                    <SheetDescription>
                                                                        Edita los selectores CSS para el scraping de esta empresa.
                                                                    </SheetDescription>
                                                                </SheetHeader>
                                                                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="name-selector">Selector de Nombre</Label>
                                                                        <Input
                                                                            id="name-selector"
                                                                            placeholder=".product-name"
                                                                            value={nameSelector}
                                                                            onChange={(e) => setNameSelector(e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="price-selector">Selector de Precio</Label>
                                                                        <Input
                                                                            id="price-selector"
                                                                            placeholder=".product-price"
                                                                            value={priceSelector}
                                                                            onChange={(e) => setPriceSelector(e.target.value)}

                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="img-selector">Selector de Imagen</Label>
                                                                        <Input
                                                                            id="img-selector"
                                                                            placeholder=".product-img"
                                                                            value={imgSelector}
                                                                            onChange={(e) => setImgSelector(e.target.value)}

                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="link-selector">Selector de Link</Label>
                                                                        <Input
                                                                            id="link-selector"
                                                                            placeholder=".product-link"
                                                                            value={linkSelector}
                                                                            onChange={(e) => setLinkSelector(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <SheetFooter>
                                                                    <Button type="submit">Guardar cambios</Button>
                                                                    <SheetClose asChild>
                                                                        <Button variant="outline">Cerrar</Button>
                                                                    </SheetClose>
                                                                </SheetFooter>
                                                            </SheetContent>
                                                        </Sheet>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            : [] // No mostrar nada si no tiene URLs
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </section>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
