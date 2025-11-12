"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Package,
  Bot,
  Search,
  // ShoppingCart,
  BarChart3,
  // Users,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
// import { NavProjects } from "@/components/ui/nav-projects"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@/components/ui/sidebar"
import { supabase } from "@/config/supabase"
import type { Session } from "@supabase/supabase-js"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [session, setSession] = React.useState<Session | null>(null)

  React.useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Navegación para usuarios no autenticados
  const publicNavMain = [
    {
      title: "Inicio",
      url: "/",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Inicio",
          url: "/",
        },
      ]
    },
    {
      title: "Buscar Productos",
      url: "/dashboard",
      icon: Search,
      items: [
        {
          title: "Ver productos",
          url: "/dashboard",
        },
      ]
    },
  ]

  // Navegación completa para admins
  const adminNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "dashboard",
          url: "/dashboard",
        },
      ]
    },
    {
      title: "Empresas",
      url: "/admin/companies",
      icon: Building2,
      items: [
        {
          title: "Ver todas",
          url: "/admin/companies",
        },
      ],
    },
    {
      title: "Productos",
      url: "/admin/products",
      icon: Package,
      items: [
        {
          title: "Ver todos",
          url: "/admin/products",
        },
      ],
    },
    {
      title: "Scraping",
      url: "/admin/scraping-jobs",
      icon: Bot,
      items: [
        {
          title: "Jobs activos",
          url: "/admin/scraping-jobs",
        },
      ],
    },
    {
      title: "Análisis",
      url: "/admin/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Ver análisis",
          url: "/admin/dashboard",
        },
      ],
    },
  ]


  const userData = session
    ? {
        name: session.user.email?.split('@')[0] || "Admin User",
        email: session.user.email || "admin@fitoprice.com",
        avatar: session.user.user_metadata?.avatar_url || "/avatars/default.jpg",
      }
    : {
        name: "Invitado",
        email: "",
        avatar: "/avatars/guest.jpg",
      }

  const teams = session
    ? [
        {
          name: "FitoPrice Admin",
          logo: LayoutDashboard,
          plan: "Enterprise",
        },
      ]
    : [
        {
          name: "FitoPrice",
          logo: Home,
          plan: "",
        },
      ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={session ? adminNavMain : publicNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
