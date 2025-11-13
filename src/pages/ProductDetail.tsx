/**
 * Product Detail Page
 * 
 * This component displays detailed information about a specific product,
 * including its price history chart and a list of companies selling the product.
 * It fetches data from the API based on the product ID obtained from the URL query parameters.
 */

"use client"
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config/api";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { TrendingUp, Loader2 } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Define the Product interface to type the product data
interface Product {
    id: number;
    name: string;
    brand: string | null;
    category: string | null;
    unit: string | null;
    created_at: string;
    product_img_url: string;
    price: number;
    percentage_change: number;
    scraped_at: string;
    product_link: string;
    company_id: number;
    company_name: string;
    company_website: string;
}

// Define the ChartDataPoint interface for chart data points
interface ChartDataPoint {
    month: string;
    desktop: number;
}

// Define the PriceHistoryItem interface for price history data
interface PriceHistoryItem {
    id: number;
    product_id: number;
    company_id: number;
    price: number;
    scraped_at: string;
}

// Define the CompanieSeller interface for companies selling the product
interface CompanieSeller {
    id: number;
    name: string;
    website: string;
    product_link: string;
    price: number;
    scraped_at: string;
}

// Chart configuration
const chartConfig = {
    desktop: {
        label: "Precio",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

// Mock data for the chart before real data is loaded
const mockChartData: ChartDataPoint[] = [
    { month: "Enero", desktop: 186 },
    { month: "Febrero", desktop: 305 },
    { month: "Marzo", desktop: 237 },
    { month: "Abril", desktop: 173 },
    { month: "Mayo", desktop: 209 },
    { month: "Junio", desktop: 214 },
]

/**
 * Params: an PriceHistoryItems[] array whitch it've at least price and scraped_at
 * Output: ChartDataPoint[] array formatted for the chart whicth it've month and desktop(price)
 * Overview: This function transforms raw price history data into a format suitable for charting.
 * 
 * @param priceHistory 
 * @returns 
 */

const setGraphicData = (priceHistory: PriceHistoryItem[]): ChartDataPoint[] => {
    // Check if priceHistory is valid and has data
    if (!priceHistory || priceHistory.length === 0) {
        return mockChartData;
    }

    // Sort price history by scraped_at date in ascending order creating a new sorted array
    const sortedHistory = [...priceHistory].sort((a, b) =>
        new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime()
    );

    // Map sorted history to chart data format
    const chartData: ChartDataPoint[] = sortedHistory.map(item => {
        const date = new Date(item.scraped_at);
        // Format date to 'DD/MM HH:MM' in Spanish locale
        const dateLabel = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Round the price to two decimal places
        return {
            month: dateLabel,
            desktop: Math.round((item.price / 100) * 100) / 100
        };
    });

    return chartData;
};

export default function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastPrice, setLastPrice] = useState<number | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>(mockChartData);
    const productId = new URLSearchParams(window.location.search).get('id') || '';
    const [companiesSellers, setCompaniesSellers] = useState<CompanieSeller[]>([]);

    // Function to fetch product details
    const getProduct = async (): Promise<void> => {
        // Validate productId 
        if (!productId) {
            setError('No se proporcionó un ID de producto');
            setLoading(false);
            return;
        }

        // Fetch product data from the API
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar el producto`);
            }

            const data = await response.json();
            setProduct(data[0] as Product);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error fetching product:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch the last price of the product
    const getLastPrice = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/last-price`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar el último precio`);
            }

            const data = await response.json();
            setLastPrice(data.price);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error fetching last price:', err);
            setError(errorMessage);
        }
    };

    // Function to fetch historical prices of the product
    const getHistoricalPrices = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/price-history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar los precios históricos`);
            }

            const data = await response.json();
            const newChartData = setGraphicData(data);
            setChartData(newChartData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error fetching historical prices:', err);
            setError(errorMessage);
        }
    };

    //  Function to fetch companies selling the product
    const getCompaniesSellers = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${productId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar las empresas vendedoras`);
            }

            const data = await response.json();
            setCompaniesSellers(data);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error fetching companies sellers:', err);
            setError(errorMessage);
        }
    };

    useEffect(() => {
        getProduct();
        getLastPrice();
        getHistoricalPrices();
        getCompaniesSellers();
    }, [productId]);

    // Render loading view if loading is true
    if (loading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex items-center justify-center h-screen">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Cargando producto...</span>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    // Render error view if error is not null
    if (error) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col items-center justify-center h-screen">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    // Render product not found view if product is null
    if (!product) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col items-center justify-center h-screen">
                        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                        <p className="text-gray-600">No se pudo encontrar el producto solicitado.</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
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
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/dashboard">Productos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{product.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <section className="p-8 space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold">{product.name}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="text-sm">ID: {product.id}</span>
                            <span className="text-3xl font-bold text-primary">
                                {lastPrice !== null ? `${(lastPrice / 100).toFixed(2)} €` : 'Cargando...'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        <Card className="xl:col-span-1 overflow-hidden flex flex-col">
                            <CardContent className="flex items-center justify-center p-6 flex-1">
                                <img
                                    src={product.product_img_url}
                                    alt={product.name}
                                    className="w-full h-auto rounded-lg  object-contain max-h-[500px] transition-transform hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder-product.png';
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Graph with price evolution */}
                        <div className="xl:col-span-3 space-y-6">
                            <Card className="h-fit">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Evolución de Precios</CardTitle>
                                            <CardDescription>Historial completo de precios ({chartData.length} registros)</CardDescription>
                                        </div>
                                        {
                                            // Display percentage change with appropriate icon and color depending on its value
                                            product.percentage_change > 0 ? (
                                                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span>{product.percentage_change}%</span>
                                                </div>
                                            ) : product.percentage_change < 0 ? (
                                                <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                                                    <TrendingUp className="h-4 w-4 rotate-180" />
                                                    <span>{product.percentage_change}%</span>
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        {/* Line chart displaying price evolution */}
                                        <LineChart
                                            accessibilityLayer
                                            data={chartData}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                                top: 12,
                                                bottom: 12,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                className="stroke-muted"
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                className="text-xs"
                                            />
                                            <ChartTooltip
                                                cursor={{ strokeDasharray: '3 3' }}
                                                content={<ChartTooltipContent
                                                    hideLabel
                                                    formatter={(value) => `${value} €`}
                                                />}
                                            />
                                            <Line
                                                dataKey="desktop"
                                                type="monotone"
                                                stroke="var(--color-desktop)"
                                                strokeWidth={3}
                                                dot={{
                                                    fill: "var(--color-desktop)",
                                                    r: 4,
                                                }}
                                                activeDot={{
                                                    r: 6,
                                                    fill: "var(--color-desktop)",
                                                    stroke: "#fff",
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
                                    <div className="text-muted-foreground leading-none">
                                        Mostrando todos los datos del historial de precios
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Invoices Table Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Proveedores</CardTitle>
                                    <CardDescription>Registro de tus proveedores de <span className="font-semibold">{product.name}</span></CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableCaption className="text-xs">
                                            Historial completo de compras del producto
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="w-[120px] font-semibold">Empresa</TableHead>
                                                <TableHead className="text-right font-semibold">Monto</TableHead>
                                                <TableHead className="text-right font-semibold">Fecha</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {companiesSellers.map((companieSeller: CompanieSeller) => (
                                                <TableRow
                                                    key={companieSeller.id}
                                                    className="transition-colors hover:bg-muted/50 cursor-pointer"
                                                    onClick={() => window.open(companieSeller.product_link, '_blank', 'noopener,noreferrer')}
                                                >
                                                    <TableCell className="font-mono font-medium">
                                                        <span className="hover:underline text-blue-600 dark:text-blue-400">
                                                            {companieSeller.name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {(companieSeller.price / 100).toFixed(2)} €
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground">
                                                        {new Date(companieSeller.scraped_at).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </SidebarInset>
        </SidebarProvider>
    )
}