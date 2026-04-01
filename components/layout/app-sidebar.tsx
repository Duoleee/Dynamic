"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ChevronDown,
  Boxes,
  SlidersHorizontal,
  Users,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

// Menu items type definitions
type MenuChild = {
  name: string
  path: string
}

type MenuItem = {
  name: string
  type: "link" | "collapsible"
  icon?: LucideIcon
  path?: string
  children?: MenuChild[]
  defaultOpen?: boolean
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
      type: "link",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      name: "FRU BOM",
      type: "collapsible",
      icon: Boxes,
      defaultOpen: true,
      children: [
        { name: "Component Graph", path: "/fru-bom/component-graph" },
        { name: "MT-FRU Management", path: "/fru-bom/mt-fru-management" },
        { name: "FRU-PPN Management", path: "/fru-bom/fru-ppn-management" },
      ],
    },
    {
      name: "BOM Management",
      type: "collapsible",
      icon: Boxes,
      defaultOpen: false,
      children: [
        { name: "Conflict Management", path: "/bom/conflict-management" },
        { name: "PPN替代关系映射", path: "/bom/ppn-mapping" },
        { name: "Original Table", path: "/bom/original-table" },
      ],
    },
  ],
}

const settingsSection: MenuSection = {
  label: "Settings",
  items: [
    {
      name: "User Management",
      type: "link",
      icon: Users,
      path: "/settings/user-management",
    },
    {
      name: "Role Management",
      type: "link",
      icon: SlidersHorizontal,
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

// Check if a path is active
function isPathActive(pathname: string, path: string): boolean {
  if (path === "/") {
    return pathname === "/"
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

// Check if any child is active
function hasActiveChild(pathname: string, children?: MenuChild[]): boolean {
  if (!children) return false
  return children.some((child) => isPathActive(pathname, child.path))
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
            <SidebarMenu>
              {platformSection.items.map((item) =>
                item.type === "link" ? (
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
                ) : (
                  <Collapsible
                    key={item.name}
                    defaultOpen={item.defaultOpen || hasActiveChild(pathname, item.children)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger className="w-full group">
                        <SidebarMenuButton tooltip={item.name} className="w-full justify-between">
                          <div className="flex items-center gap-2">
                            {item.name === "FRU BOM" ? (
                              <ArrowIcon className="size-4" />
                            ) : (
                              item.icon && <item.icon className="size-4" />
                            )}
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown className="size-4 transition-transform duration-200 group-aria-expanded:rotate-0 group-aria-[expanded=false]:-rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((child) => (
                            <SidebarMenuSubItem key={child.name}>
                              <SidebarMenuSubButton
                                isActive={isPathActive(pathname, child.path)}
                                href={child.path}
                              >
                                <span>{child.name}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
