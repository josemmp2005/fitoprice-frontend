/**
 *  Companies Panel Page 
 * 
 * This page allows managing companies, including viewing existing companies and adding new ones.
 * 
 */

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CompaniesPanel() {
    const token = localStorage.getItem("token");
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");

    // Define company interface to type the product data
    interface Company {
        id: number;
        name: string;
        product_count: number;
        website: string;
    }

    // Fetch all companies from the API
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

    // Create a new company via the API
    const createNewCompany = async (companyData: any): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name: companyData.name, website: companyData.website }),
            });
            if (!response.ok) throw new Error("Error creating company");
        } catch (error) {
            console.error("Error creating company:", error);
        }
    }

    useEffect(() => {
        getCompanies();
    }, []);

    // Handle company creation with confirmation
    const handleCompanyCreation = async () => {
        // Confirm before creating a new company
        const confirmCreate = window.confirm(
            `¿Deseas crear la empresa "${companyName}"?\n\nSitio web: ${companyWebsite}`
        );

        if (!confirmCreate) {
            return; 
        }

        // Prepare company data for creation
        const companyData = {
            name: companyName,
            website: companyWebsite
        };

        try {
            // Call API to create new company
            await createNewCompany(companyData);
            
            alert("¡Empresa creada exitosamente!");
            
            // Clean up form
            setCompanyName("");
            setCompanyWebsite("");
            
            // Refresh companies list
            window.location.reload();
        } catch (error) {
            alert("Error al crear la empresa. Por favor, intenta de nuevo.");
            console.error(error);
        }
    }



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
                        <h1 className="text-2xl font-bold p-4">Empresas</h1>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">Agregar Empresa</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Agregar Empresa</SheetTitle>
                                    <SheetDescription>
                                        Agrega una nueva empresa.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="company-name">Nombre</Label>
                                        <Input 
                                            id="company-name" 
                                            placeholder="AgroProductos"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="company-website">Web</Label>
                                        <Input 
                                            id="company-website" 
                                            placeholder="www.example.com"
                                            value={companyWebsite}
                                            onChange={(e) => setCompanyWebsite(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <SheetFooter>
                                    <Button type="submit" onClick={handleCompanyCreation}>Guardar cambios</Button>
                                    <SheetClose asChild>
                                        <Button variant="outline">Cerrar</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        <div className="mt-4 companies border p-4 rounded-lg" onClick={() => navigate('/admin/companies')}>
                            <h2 className="text-2xl font-bold mb-4">Empresas Registradas</h2>
                            {companies.length === 0 ? (
                                <Skeleton className="h-10 w-full mb-2" />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Sitio Web</TableHead>
                                            <TableHead>Productos</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {companies.map((company: Company) => (
                                            <TableRow key={company.id}>
                                                <TableCell>{company.name}</TableCell>
                                                <TableCell>
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {company.website}
                                                    </a>
                                                </TableCell>
                                                <TableCell>{company.product_count}</TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </section>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
