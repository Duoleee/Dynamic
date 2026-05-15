"use client"

import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationPopover } from "@/components/notification/notification-popover"
import { Toaster } from "@/components/ui/sonner"
import { LogOut, User, Sun, Moon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

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

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function MainLayout({ children, className, title, breadcrumbs: customBreadcrumbs }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(pathname)

  const handleLogout = () => {
    // TODO: Add actual logout API call here
    router.push("/login")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

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
          <NotificationPopover />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-3 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors outline-none">
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
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Main Content - Scrollable */}
        <main className={cn("flex-1 overflow-hidden bg-background", className)}>
          {children}
        </main>
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  )
}
