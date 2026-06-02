"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Network,
  FileText,
  ClipboardList,
  Settings,
  Users,
  Shield,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// Menu items type definitions
type MenuItem = {
  name: string
  icon?: LucideIcon
  path: string
}

type MenuSection = {
  label?: string
  items: MenuItem[]
}

// Menu data based on the specification
const platformSection: MenuSection = {
  label: "Platform",
  items: [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
  ],
}

const fruBomSection: MenuSection = {
  label: "Fru bom",
  items: [
    {
      name: "Component Graph",
      icon: Network,
      path: "/fru-bom/component-graph",
    },
    {
      name: "MT-FRU Management",
      icon: ClipboardList,
      path: "/fru-bom/mt-fru-management",
    },
    {
      name: "FRU-PPN Management",
      icon: FileText,
      path: "/fru-bom/fru-ppn-management",
    },
  ],
}

const bomManagementSection: MenuSection = {
  label: "Bom Managment",
  items: [
    {
      name: "Conflict Audit",
      icon: Shield,
      path: "/bom/conflict-management",
    },
    {
      name: "Substitution Audit",
      icon: ClipboardList,
      path: "/bom/substitution-audit",
    },
    {
      name: "Original Table",
      icon: FileText,
      path: "/bom/original-table",
    },
  ],
}

const settingsSection: MenuSection = {
  label: "Settings",
  items: [
    {
      name: "User Management",
      icon: Users,
      path: "/settings/user-management",
    },
    {
      name: "Role Management",
      icon: Settings,
      path: "/settings/role-management",
    },
  ],
}

// Custom icon components
function LenovoLogo({ className, collapsed }: { className?: string; collapsed?: boolean }) {
  if (collapsed) {
    return (
      <img
        src="/logo-1.png"
        alt="Lenovo"
        className={cn("h-6 w-6 object-contain", className)}
      />
    )
  }
  return (
    <img
      src="/logo.png"
      alt="Lenovo"
      className={cn("h-6 w-auto object-contain", className)}
    />
  )
}

// Check if a path is active
function isPathActive(pathname: string, path: string): boolean {
  if (path === "/") {
    return pathname === "/"
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className={cn(
                "flex items-center justify-center overflow-hidden",
                state === "collapsed" ? "size-8" : "h-8 px-2"
              )}>
                <LenovoLogo className={state === "collapsed" ? "size-5" : "h-6 w-auto"} collapsed={state === "collapsed"} />
              </div>
              {state !== "collapsed" && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Lenovo</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Dynamic Part
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto scrollbar-thin">
        {/* Platform Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {platformSection.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={isPathActive(pathname, item.path || "")}
                    tooltip={item.name}
                  >
                    <a href={item.path} className="flex items-center gap-2 w-full">
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Fru bom Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Fru bom</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {fruBomSection.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={isPathActive(pathname, item.path || "")}
                    tooltip={item.name}
                  >
                    <a href={item.path} className="flex items-center gap-2 w-full">
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bom Managment Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Bom Managment</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {bomManagementSection.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={isPathActive(pathname, item.path || "")}
                    tooltip={item.name}
                  >
                    <a href={item.path} className="flex items-center gap-2 w-full">
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {settingsSection.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={isPathActive(pathname, item.path || "")}
                    tooltip={item.name}
                  >
                    <a href={item.path} className="flex items-center gap-2 w-full">
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarRail />
    </Sidebar>
  )
}
