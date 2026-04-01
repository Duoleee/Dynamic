"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Box,
  Layers,
  GitBranch,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
} from "lucide-react"

// 核心统计数据
const coreStats = [
  { title: "Total FRUs", value: "1,245", change: "+12.5%", trend: "up", icon: Box },
  { title: "Lenovo PPNs", value: "3,682", change: "+8.2%", trend: "up", icon: Layers },
  { title: "Vendor PPNs", value: "5,420", change: "+15.3%", trend: "up", icon: GitBranch },
  { title: "Active Mappings", value: "8,934", change: "+5.7%", trend: "up", icon: ArrowRightLeft },
]

// 处理状态数据
const detailMetrics = [
  { label: "Pending Review", value: 24, total: 100 },
  { label: "Approved Today", value: 156, total: 200 },
  { label: "Rejected", value: 8, total: 100 },
  { label: "In Progress", value: 45, total: 80 },
]

// 最近活动
const recentActivities = [
  { id: 1, user: "Admin", action: "Created FRU mapping", target: "FRU001 → LPN-12345", time: "2 min ago", type: "create" },
  { id: 2, user: "System", action: "Auto-synced vendor data", target: "50 records updated", time: "15 min ago", type: "sync" },
  { id: 3, user: "Manager", action: "Approved substitute FRU", target: "FRU001-R", time: "1 hour ago", type: "approve" },
  { id: 4, user: "Admin", action: "Deleted obsolete mapping", target: "FRU-OLD-001", time: "2 hours ago", type: "delete" },
  { id: 5, user: "System", action: "Detected conflict", target: "MT-12345", time: "3 hours ago", type: "alert" },
]

// 快捷操作
const quickActions = [
  { name: "Component Graph", icon: GitBranch, href: "/fru-bom/component-graph" },
  { name: "FRU-PPN Mgmt", icon: ArrowRightLeft, href: "/fru-bom/fru-ppn-management" },
  { name: "MT-FRU Mgmt", icon: Layers, href: "/fru-bom/mt-fru-management" },
  { name: "Export Report", icon: Download, href: "#" },
]

// 系统健康状态
const systemHealth = [
  { name: "FRU BOM Service", status: "operational", uptime: "99.9%" },
  { name: "PPN Mapping API", status: "operational", uptime: "99.8%" },
  { name: "Vendor Sync", status: "degraded", uptime: "98.5%" },
  { name: "Database", status: "operational", uptime: "100%" },
]

export default function DashboardPage() {
  return (
    <MainLayout className="p-0 lg:p-6 overflow-auto">
      <div className="h-full flex flex-col gap-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Overview of FRU BOM system performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {coreStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-muted">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Left Column - 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Metrics & Chart Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              {/* Processing Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {detailMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-medium">{metric.value}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(metric.value / metric.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Daily Activity Chart */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-1 h-[120px] px-2">
                  {[35, 55, 40, 70, 45, 80, 60, 75, 50, 85, 65, 90].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-muted rounded-t-sm relative hover:bg-muted/80 transition-colors"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded-t-sm"
                        style={{ height: `${height * 0.6}%` }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <CardDescription className="text-xs">Latest system events and actions</CardDescription>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-muted-foreground text-sm font-medium">{activity.user[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{activity.user}</span>
                          <span className="text-muted-foreground text-sm">{activity.action}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{activity.target}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {getActivityLabel(activity.type)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-muted transition-colors border rounded-md"
                  >
                    <action.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-medium">{action.name}</span>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {systemHealth.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${service.status === "operational" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <span className="text-sm truncate">{service.name}</span>
                    </div>
                    <Badge variant={service.status === "operational" ? "default" : "secondary"} className="text-xs shrink-0">
                      {service.uptime}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// Helper functions
function getActivityLabel(type: string) {
  switch (type) {
    case "create": return "Create"
    case "sync": return "Sync"
    case "approve": return "Approve"
    case "delete": return "Delete"
    case "alert": return "Alert"
    default: return "Other"
  }
}
