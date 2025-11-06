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

interface Company {
    id: number;
    name: string;
    product_count: number;
}

export default function AdminPanel() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [lastScrape, setLastScrape] = useState<string | null>(null);
    const [countProducts, setCountProducts] = useState<number | null>(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCompanies();
        lastScrapeDate();
        countTotalProducts();
        getProducts();
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

    const lastScrapeDate = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/last-scraped`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) throw new Error("Error fetching last scrape date");
            const data = await response.json();
            // console.log(data);
            setLastScrape(data.scraped_at);
        } catch (error) {
            console.error(error);
        }
    }
    
    const countTotalProducts = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/count`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Error fetching product count");
            const data = await response.json();
            setCountProducts(data.count);
        } catch (error) {
            console.error(error);
        }
    }

    const getProducts = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/fifteen`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setProducts(data);
        }
        catch (error) {
            console.error("Error fetching products:", error);
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
                                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Admin</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <section className="p-8">
                    <div className="admin-dashboard lg:flex gap-8">
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
                                            {companies.slice(0, 3).map((company: Company) => (
                                                <TableRow key={company.id}>
                                                    <TableCell>{company.name}</TableCell>
                                                    <TableCell>{company.product_count}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                            <div className="last-scraped mt-8 border p-4 rounded-lg">
                                <h2 className="text-2xl font-bold">Última Actualización de Datos</h2>
                                {lastScrape === null ? (
                                    <Skeleton className="h-6 w-48 mt-2" />
                                ) : (
                                    <p className="mt-2">{lastScrape}</p>
                                )}
                            </div>
                            <div className="products-overview mt-8 border p-4 rounded-lg">
                                <h2 className="text-2xl font-bold">Productos Registrados</h2>
                                {countProducts === null ? (
                                    <Skeleton className="h-6 w-24 mt-2" />
                                ) : (
                                    <p className="mt-2">{countProducts} productos en total.</p>
                                )}
                            </div>
                        </div>
                        <div className="products flex-2 border p-4 rounded-lg mt-10 lg:mt-0" onClick ={() => navigate('/admin/products')}>
                            <h2>Productos</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Image URL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product: any) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell className="transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => window.open(product.company_website, '_blank', 'noopener,noreferrer')}>{product.company_name}</TableCell>
                                            <TableCell><a href={product.product_img_url}>{product.product_img_url}</a></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
}
