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

interface Product {
  id: number;
  name: string;
  price: number;
  product_img_url: string;
}

export default function Dashboard() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/all`);
      if (!response.ok) throw new Error("Error fetching products");

      const data: Product[] = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold mb-6">Dashboard de Productos </h1>
          <p className="mb-2">{filteredProducts.length} productos encontrados</p>

          <Input
            type="text"
            className="border border-gray-300 dark:border-neutral-700 bg-transparent p-2 rounded-lg mb-6 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
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
              {filteredProducts.map((product) => (
                console.log(product),

                <div
                  key={product.id}
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
                    <Badge variant="default" className="h-6 w-12 self-end flex items-center justify-center bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-xs">
                      ↑ 2%
                    </Badge>
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
