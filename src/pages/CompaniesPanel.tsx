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

    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    interface Company {
        id: number;
        name: string;
        product_count: number;
        website: string;
    }

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
                                        <Label htmlFor="sheet-demo-name">Nombre</Label>
                                        <Input id="sheet-demo-name" placeholder="AgroProductos" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="sheet-demo-username">Web</Label>
                                        <Input id="sheet-demo-username" placeholder="www.example.com" />
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="grid gap-3">
                                        <Label htmlFor="sheet-demo-username">Selector Nombre</Label>
                                        <Input id="sheet-demo-username" placeholder=".name" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="sheet-demo-username">Selector Precio</Label>
                                        <Input id="sheet-demo-username" placeholder=".price" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="sheet-demo-username">Selector Link</Label>
                                        <Input id="sheet-demo-username" placeholder=".link" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="sheet-demo-username">Selector Img</Label>
                                        <Input id="sheet-demo-username" placeholder=".img" />
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
                        <div className="mt-4 companies border p-4 rounded-lg" onClick={() => navigate('/admin/companies')}>
                            <h2 className="text-2xl font-bold mb-4">Empresas Registradas</h2>
                            {companies.length === 0 ? (
                                <Skeleton className="h-10 w-full mb-2" />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Productos</TableHead>
                                            <TableHead>Sitio Web</TableHead>
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
