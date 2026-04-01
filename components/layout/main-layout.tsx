"use client"

import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
}

// 根据路径生成面包屑
function generateBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === "/") {
    return [{ label: "Platform" }, { label: "Dashboard" }]
  }

  const paths = pathname.split("/").filter(Boolean)
  const breadcrumbs: { label: string; href?: string }[] = []

  // 映射路径到可读标签
  const pathLabels: Record<string, string> = {
    "fru-bom": "FRU BOM",
    "component-graph": "Component Graph",
    "mt-fru-management": "MT-FRU Management",
    "fru-ppn-management": "FRU-PPN Management",
    "bom": "BOM Management",
    "conflict-management": "Conflict Management",
    "ppn-mapping": "PPN替代关系映射",
    "original-table": "Original Table",
    "settings": "Settings",
    "user-management": "User Management",
    "role-management": "Role Management",
  }

  let currentPath = ""
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const isLast = index === paths.length - 1
    breadcrumbs.push({
      label: pathLabels[path] || path,
      href: isLast ? undefined : currentPath,
    })
  })

  return breadcrumbs
}

export function MainLayout({ children, className, title, breadcrumbs: customBreadcrumbs }: MainLayoutProps) {
  const pathname = usePathname()
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(pathname)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-svh overflow-hidden">
        {/* Header - Fixed */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4 sticky top-0 z-30">
          <SidebarTrigger className="-ml-1 h-8 w-8" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <span className="text-muted-foreground">{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="text-muted-foreground/50" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-sm">
                  管
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:grid text-left text-sm leading-tight">
                <span className="truncate font-semibold">管理员</span>
                <span className="truncate text-xs text-muted-foreground">
                  admin@lenovo.com
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                <LogOut className="mr-2 size-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Main Content - Scrollable */}
        <main className={cn("flex-1 overflow-hidden bg-background", className)}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
