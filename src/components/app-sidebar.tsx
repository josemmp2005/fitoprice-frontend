/**
 * Barra lateral de la app. Los visitantes ven la parte pública;
 * con sesión de administrador aparece además la sección de administración.
 * No hay ningún enlace al login: es una ruta oculta (/login/admin).
 */

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, Bot, Building2, Home, LayoutDashboard, Package, Search, type LucideIcon } from "lucide-react";
import Logo from "@/components/Logo";
import { NavUser } from "@/components/ui/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { getSession } from "@/config/auth";

interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    // Otras rutas que también marcan este enlace como activo
    matches?: string[];
}

const publicNav: NavItem[] = [
    { title: "Inicio", url: "/", icon: Home },
    { title: "Catálogo", url: "/dashboard", icon: Search, matches: ["/product"] },
    { title: "Tus productos", url: "/seguidos", icon: Bookmark },
];

const adminNav: NavItem[] = [
    { title: "Resumen", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Productos", url: "/admin/products", icon: Package },
    { title: "Empresas", url: "/admin/companies", icon: Building2 },
    { title: "Scraping", url: "/admin/scraping-jobs", icon: Bot },
];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
    const { pathname } = useLocation();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url || Boolean(item.matches?.some((path) => pathname.startsWith(path)));
                    return (
                        <SidebarMenuItem key={item.url}>
                            {/* La página activa lleva una brizna verde a la izquierda, del color del logo */}
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={item.title}
                                className="relative before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:origin-center before:scale-y-0 before:rounded-full before:bg-brote before:transition-transform before:duration-300 before:ease-(--ease-asienta) data-[active=true]:before:scale-y-100"
                            >
                                <Link to={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const session = getSession();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-2">
                <Logo className="group-data-[collapsible=icon]:[&>span]:hidden" />
            </SidebarHeader>
            <SidebarContent>
                <NavGroup label="Explorar" items={publicNav} />
                {session && <NavGroup label="Administración" items={adminNav} />}
            </SidebarContent>
            {/* El acceso de administradores no se enlaza: se entra escribiendo la URL del login */}
            {session && (
                <SidebarFooter>
                    <NavUser email={session.user.email} />
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}
