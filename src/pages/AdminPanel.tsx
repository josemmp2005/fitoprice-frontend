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

export default function AdminPanel() {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    interface Company {
        id: number;
        name: string;
    }

    useEffect(() => {
        getCompanies();
    }, []);


    const getCompanies = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Error fetching companies");
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
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
                                <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Productos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <section className="p-8">
                    <div className="admin-dashboard flex gap-8">
                        <div className="flex-1 w-full">
                            <div className="companies border p-4 rounded-lg" onClick={() => navigate('/admin/companies')}>
                                <h2 className="text-2xl font-bold mb-4">Empresas Registradas</h2>
                                {companies.length === 0 ? (
                                    <Skeleton className="h-10 w-full mb-2" />
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Productos</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {companies.map((company: Company) => (
                                                <TableRow key={company.id}>
                                                    <TableCell>{company.name}</TableCell>
                                                    <TableCell>100</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                            <div className="last-scraped mt-8 border p-4 rounded-lg">
                                <h2 className="text-2xl font-bold">Última Actualización de Datos</h2>
                                <p>Fecha y hora de la última actualización: 2024-06-15 14:30:00</p>
                            </div>
                            <div className="products-overview mt-8 border p-4 rounded-lg">
                                <h2 className="text-2xl font-bold">Productos Registrados</h2>
                                <p>Lista de productos registrados en el sistema.</p>
                            </div>
                        </div>
                        <div className="products flex-2 border p-4 rounded-lg" onClick ={() => navigate('/admin/products')}>
                            <h2>Productos</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Empresa</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Producto A</TableCell>
                                        <TableCell>$100</TableCell>
                                        <TableCell>Empresa X</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Producto B</TableCell>
                                        <TableCell>$150</TableCell>
                                        <TableCell>Empresa Y</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
}
