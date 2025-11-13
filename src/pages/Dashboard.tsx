/**
 * Dashboard Page Component - Displays a list of products with search functionality.
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input";

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

export default function Dashboard() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // State to hold all products
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search term
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to manage loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products on component mount
    getAllProducts();
  }, []);

  // Function to fetch all products from the API
  const getAllProducts = async (): Promise<void> => {
    try {
      // Indicate loading state
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/all`);
      if (!response.ok) throw new Error("Error fetching products");

      // Parse the JSON response
      const data: Product[] = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on the search term
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <BreadcrumbPage>Productos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <section className="p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard de Productos </h1>
          <p className="mb-2">{filteredProducts.length} productos encontrados</p>

          <Input
            type="text"
            className="border border-gray-300 dark:border-neutral-700 bg-transparent p-2 rounded-lg mb-6 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/** Display loading skeletons while data is being fetched */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 [@media(min-width:2920px)]:grid-cols-8 gap-6">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 shadow-sm space-y-3"
                >
                  <Skeleton className="h-60 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/** Display filtered products */}
              {filteredProducts.map((product) => (
                console.log(product),

                <div
                  key={product.id}
                  // Navigate to product details on click
                  onClick={() => navigate(`/product?id=${product.id}`)}
                  className="cursor-pointer bg-gray-100 dark:bg-neutral-900 rounded-xl border shadow-sm p-4 transition hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden rounded-lg mb-3">
                    <img
                      src={product.product_img_url}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>
                  <h2 className="text-lg font-semibold truncate">
                    {product.name}
                  </h2>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mt-1">Desde:</p>
                      <p className="text-lg font-medium">{product.price / 100}  €</p>

                    </div>
                    {
                      // Display percentage change badge with appropriate color and arrow
                      product.percentage_change > 0 ? (
                        <Badge variant="default" className="h-6 w-12 self-end flex items-center justify-center bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md text-xs">
                          ↓ {product.percentage_change}%
                        </Badge>
                      ) : product.percentage_change < 0 ? (
                        <Badge variant="default" className="h-6 w-12 self-end flex items-center justify-center bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-xs">
                         ↑ {product.percentage_change}%
                        </Badge>
                      ) : (
                        <Badge variant="default" className="h-6 w-12 self-end flex items-center justify-center bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-md text-xs">
                         = {product.percentage_change}%
                        </Badge>
                      )
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
