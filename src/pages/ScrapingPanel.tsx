/**
 * Scraping Panel Page
 *  This component displays a panel for managing scraping jobs for companies.
 */

import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";
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
import { Switch } from "@/components/ui/switch"

export default function CompaniesPanel() {

    const [scrapedCompanies, setScrapedCompanies] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [urlScrap, setUrlScrap] = useState("");
    const [nameSelector, setNameSelector] = useState("");
    const [priceSelector, setPriceSelector] = useState("");
    const [imgSelector, setImgSelector] = useState("");
    const [linkSelector, setLinkSelector] = useState("");
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
    const [selectedUrlId, setSelectedUrlId] = useState<string | null>(null);

    // function to handle opening the sheet and setting the selected company and url config. Giving company and urlObj as parameters
    const handleOpenSheet = (company: any, urlObj: any) => {
        setSelectedCompany(company); // Set selected company
        const config = urlObj.scraping_config; // Get scraping config
        // Set form fields with existing config values
        setUrlScrap(config?.url || ""); 
        setNameSelector(config?.selector_title || "");
        setPriceSelector(config?.selector_price || "");
        setImgSelector(config?.selector_image || "");
        setLinkSelector(config?.selector_link || "");
        // initialize local active state for this url so switch is controlled
        setActiveStates(prev => ({ ...prev, [String(urlObj.id)]: Boolean(urlObj.active) }));
        setSelectedUrlId(String(urlObj.id));
    };

    // Function to create new scraping configuration
    async function createNewScrapingConf() {
        try {
            const response = await fetch(`${API_BASE_URL}/scraping/scraping-job`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_id: parseInt(selectedCompanyId),
                    url: urlScrap,
                    selector_title: nameSelector,
                    selector_price: priceSelector,
                    selector_image: imgSelector,
                    selector_link: linkSelector,
                }),
            });
            if (!response.ok) throw new Error("Error creating scraping job");
        } catch (error) {
            console.error("Error creating scraping job:", error);
        }
    }

    // Function to handle form submission for creating a new scraping configuration using the Dialog UI component
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompanyId) return;

        // Call the funciton previously defined to create the scraping configuration
        await createNewScrapingConf();

        // Reset form fields
        setSelectedCompanyId("");
        setUrlScrap("");
        setNameSelector("");
        setPriceSelector("");
        setImgSelector("");
        setLinkSelector("");

        // Reload the page to reflect new scraping job
        window.location.reload();
    }

    // Function to handle form submission for updating an existing scraping configuration using the Sheet UI component
    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany || !selectedUrlId) return;
        
        // Update scraping configuration
        try {
            const response = await fetch(`${API_BASE_URL}/scraping/scraping-job/${selectedUrlId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: urlScrap,
                    selector_title: nameSelector,
                    selector_price: priceSelector,
                    selector_image: imgSelector,
                    selector_link: linkSelector,
                    active: activeStates[selectedUrlId],
                }),
            });
            if (!response.ok) throw new Error("Error updating scraping config");
            
            // Reload the page to reflect updated scraping job
            window.location.reload();
        } catch (error) {
            console.error("Error updating scraping config:", error);
        }
    }

    // Function to fetch companies with scraping configuration
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
            setScrapedCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    // Function to fetch all companies
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

    // Fetch companies and their scraping configurations on component mount 
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
                        <h2 className="text-2xl font-bold p-4">Tareas de Scraping</h2>
                        {/* Dialog for adding new scraping job */}
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="mb-5">Add Scraping</Button>
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
                                            {/* Select company for scraping task */}
                                            <Select onValueChange={(value) => setSelectedCompanyId(value)} value={selectedCompanyId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona una empresa" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Empresas</SelectLabel>
                                                        {companies.map((company: any) => (
                                                            <SelectItem key={company.id} value={company.id.toString()}>
                                                                {company.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="url-input">Url</Label>
                                            <Input
                                                id="url-input"
                                                placeholder="http://example.com"
                                                value={urlScrap}
                                                onChange={(e) => setUrlScrap(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="name-selector-input">Selector Nombre</Label>
                                            <Input
                                                id="name-selector-input"
                                                placeholder=".name"
                                                value={nameSelector}
                                                onChange={(e) => setNameSelector(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="price-selector-input">Selector Precio</Label>
                                            <Input
                                                id="price-selector-input"
                                                placeholder=".price"
                                                value={priceSelector}
                                                onChange={(e) => setPriceSelector(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="img-selector-input">Selector Img</Label>
                                            <Input
                                                id="img-selector-input"
                                                placeholder=".img"
                                                value={imgSelector}
                                                onChange={(e) => setImgSelector(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="link-selector-input">Selector Link</Label>
                                            <Input
                                                id="link-selector-input"
                                                placeholder=".link"
                                                value={linkSelector}
                                                onChange={(e) => setLinkSelector(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" onClick={handleSubmit}>Save changes</Button>
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
                                {/* Display loading skeleton if no companies are loaded */}
                                {scrapedCompanies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Skeleton className="h-10 w-full mb-2" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    // Map through companies and their URLs to create table rows
                                    scrapedCompanies.flatMap((company: any) =>
                                        company.company_urls.length > 0
                                         // If company has URLs, map through them 
                                            ? company.company_urls.map((urlObj: any) => ( 
                                                // Create a table row for each URL
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
                                                        {/* Display active status with color coding */}
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${urlObj.active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                            {urlObj.active ? '✓ Activa' : '✗ Inactiva'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* Button to open sheet for editing scraping configuration */}
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
                                                                    <div className="flex items-center space-x-2">
                                                                        {/* Switch to toggle active state */}
                                                                        <Switch
                                                                            id={`active-switch-${urlObj.id}`}
                                                                            checked={activeStates[String(urlObj.id)] ?? Boolean(urlObj.active)}
                                                                            onCheckedChange={(checked) => {
                                                                                setActiveStates(prev => ({ ...prev, [String(urlObj.id)]: checked })); // Update local controlled state
                                                                            }}
                                                                        />
                                                                        <Label htmlFor={`active-switch-${urlObj.id}`}>Activa</Label>
                                                                    </div>

                                                                </div>

                                                                <SheetFooter>
                                                                    <Button type="submit" onClick={handleSubmitUpdate}>Guardar cambios</Button>
                                                                    <SheetClose asChild>
                                                                        <Button variant="outline">Cerrar</Button>
                                                                    </SheetClose>
                                                                </SheetFooter>
                                                            </SheetContent>
                                                        </Sheet>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            : [] // If no URLs, return empty array
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
