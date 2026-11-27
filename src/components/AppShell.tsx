/**
 * Estructura común de las pantallas de la app: barra lateral, cabecera con
 * migas de pan y cambio de tema, y el contenido centrado.
 */

import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import LeafRule from "@/components/LeafRule";
import ThemeToggle from "@/components/ThemeToggle";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export interface Crumb {
    label: string;
    to?: string;
}

interface AppShellProps {
    breadcrumbs: Crumb[];
    children: ReactNode;
}

export default function AppShell({ breadcrumbs, children }: AppShellProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 bg-background/80 px-4 backdrop-blur-md">
                    <LeafRule className="absolute inset-x-0 bottom-0" />
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb className="min-w-0 flex-1">
                        <BreadcrumbList className="flex-nowrap">
                            {breadcrumbs.map((crumb, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                return (
                                    <Fragment key={crumb.label}>
                                        {index > 0 && <BreadcrumbSeparator className={isLast ? undefined : "hidden md:block"} />}
                                        <BreadcrumbItem className={isLast ? "min-w-0" : "hidden md:block"}>
                                            {isLast || !crumb.to ? (
                                                <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={crumb.to}>{crumb.label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>
                {/* reveal: los bloques de la página entran escalonados al abrirla */}
                <main className="reveal mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 md:px-8">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
