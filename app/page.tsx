"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRightLeft,
  BarChart3,
  Download,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

// 核心统计数据
const coreStats = [
  {
    title: "CK FRU BOM Completeness",
    value: "87.5%",
    subValue: "12.5% Missing",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Pending Conflicts",
    value: "12",
    href: "/bom/conflict-management",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Pending Substitution",
    value: "8",
    href: "/bom/substitution-audit",
    icon: ArrowRightLeft,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
]

// CK FRU Missing BOM 数据
const missingBomData = [
  { label: "C_COVER Missing", value: 45 },
  { label: "NB Kyb Missing", value: 62 },
  { label: "Touchpads Missing", value: 78 },
]

const maxValue = Math.max(...missingBomData.map(d => d.value))

export default function DashboardPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
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
          </div>
        </div>

        {/* Core Stats - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coreStats.map((stat, index) => {
            const CardWrapper = stat.href ? Link : "div"
            const wrapperProps = stat.href ? { href: stat.href, className: "block" } : {}
            
            return (
              <CardWrapper key={index} {...wrapperProps}>
                <Card className={stat.href ? "cursor-pointer hover:shadow-md transition-shadow" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{stat.title}</p>
                        {stat.subValue && (
                          <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
                        )}
                      </div>
                      {stat.href && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardWrapper>
            )
          })}
        </div>

        {/* CK FRU Missing BOM Analysis */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              CK FRU Missing BOM Analysis
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 py-6">
            <div className="space-y-5">
              {missingBomData.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="text-sm text-muted-foreground w-36 shrink-0 text-right group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500 group-hover:bg-primary/80"
                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                      />
                    </div>
                    {hoveredIndex === index && (
                      <span className="text-sm font-medium w-8 text-primary">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
