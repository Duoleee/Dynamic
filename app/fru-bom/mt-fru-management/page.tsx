"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  RotateCcw,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Column definition
interface Column {
  key: string
  label: string
  width: number
  visible: boolean
}

// Mock data for MT-FRU Management
interface MtFruData {
  id: string
  mt: string
  fruName: string
  ccType: string
  updateType: string
  fru: string
  level: string
  lenovoPpn: string
  vendorPpn: string
  substituteLenovoPpn: string
  lenovoPpnBasicName: string
  lenovoPpnName: string
  lenovoPpnQty: string
  specCategory: string
  specDescription: string
  attributeValue: string
  ppnDesc: string
  odmSupplierName: string
  commGroup: string
}

const mockData: MtFruData[] = [
  {
    id: "1",
    mt: "MT001",
    fruName: "Motherboard Assembly",
    ccType: "Type A",
    updateType: "New",
    fru: "FRU001",
    level: "L1",
    lenovoPpn: "LPN-12345",
    vendorPpn: "VPN-ABCDE",
    substituteLenovoPpn: "LPN-12345-R",
    lenovoPpnBasicName: "MB-ASM-001",
    lenovoPpnName: "Motherboard Assembly Gen 5",
    lenovoPpnQty: "1",
    specCategory: "Electronics",
    specDescription: "Main system board",
    attributeValue: "ATX",
    ppnDesc: "Primary Board",
    odmSupplierName: "Foxconn",
    commGroup: "HW",
  },
  {
    id: "2",
    mt: "MT002",
    fruName: "Power Supply Unit",
    ccType: "Type B",
    updateType: "Update",
    fru: "FRU002",
    level: "L1",
    lenovoPpn: "LPN-12346",
    vendorPpn: "VPN-ABCDF",
    substituteLenovoPpn: "LPN-12346-R",
    lenovoPpnBasicName: "PSU-500W",
    lenovoPpnName: "500W Power Supply",
    lenovoPpnQty: "1",
    specCategory: "Power",
    specDescription: "500W 80 Plus Gold",
    attributeValue: "500W",
    ppnDesc: "Power Unit",
    odmSupplierName: "Delta",
    commGroup: "HW",
  },
  {
    id: "3",
    mt: "MT003",
    fruName: "Memory Module 16GB",
    ccType: "Type A",
    updateType: "New",
    fru: "FRU003",
    level: "L2",
    lenovoPpn: "LPN-12347",
    vendorPpn: "VPN-ABCDG",
    substituteLenovoPpn: "LPN-12347-R",
    lenovoPpnBasicName: "DDR4-16GB",
    lenovoPpnName: "16GB DDR4 RAM",
    lenovoPpnQty: "2",
    specCategory: "Memory",
    specDescription: "DDR4 3200MHz",
    attributeValue: "16GB",
    ppnDesc: "RAM Module",
    odmSupplierName: "Samsung",
    commGroup: "MEM",
  },
  {
    id: "4",
    mt: "MT004",
    fruName: "SSD 512GB",
    ccType: "Type C",
    updateType: "Delete",
    fru: "FRU004",
    level: "L2",
    lenovoPpn: "LPN-12348",
    vendorPpn: "VPN-ABCDH",
    substituteLenovoPpn: "LPN-12348-R",
    lenovoPpnBasicName: "SSD-512GB",
    lenovoPpnName: "512GB NVMe SSD",
    lenovoPpnQty: "1",
    specCategory: "Storage",
    specDescription: "NVMe Gen4 SSD",
    attributeValue: "512GB",
    ppnDesc: "Storage Drive",
    odmSupplierName: "WD",
    commGroup: "STOR",
  },
  {
    id: "5",
    mt: "MT005",
    fruName: "WiFi Card",
    ccType: "Type A",
    updateType: "New",
    fru: "FRU005",
    level: "L3",
    lenovoPpn: "LPN-12349",
    vendorPpn: "VPN-ABCDI",
    substituteLenovoPpn: "LPN-12349-R",
    lenovoPpnBasicName: "WIFI6-CARD",
    lenovoPpnName: "WiFi 6 AX200",
    lenovoPpnQty: "1",
    specCategory: "Network",
    specDescription: "802.11ax WiFi",
    attributeValue: "WiFi6",
    ppnDesc: "Wireless Card",
    odmSupplierName: "Intel",
    commGroup: "NET",
  },
  {
    id: "6",
    mt: "MT006",
    fruName: "CPU Processor",
    ccType: "Type B",
    updateType: "Update",
    fru: "FRU006",
    level: "L1",
    lenovoPpn: "LPN-12350",
    vendorPpn: "VPN-ABCDJ",
    substituteLenovoPpn: "LPN-12350-R",
    lenovoPpnBasicName: "CPU-I7-12TH",
    lenovoPpnName: "Intel Core i7-12700",
    lenovoPpnQty: "1",
    specCategory: "Processor",
    specDescription: "12th Gen Intel CPU",
    attributeValue: "i7",
    ppnDesc: "Main Processor",
    odmSupplierName: "Intel",
    commGroup: "CPU",
  },
  {
    id: "7",
    mt: "MT007",
    fruName: "Cooling Fan",
    ccType: "Type A",
    updateType: "New",
    fru: "FRU007",
    level: "L2",
    lenovoPpn: "LPN-12351",
    vendorPpn: "VPN-ABCDK",
    substituteLenovoPpn: "LPN-12351-R",
    lenovoPpnBasicName: "FAN-120MM",
    lenovoPpnName: "120mm Cooling Fan",
    lenovoPpnQty: "3",
    specCategory: "Cooling",
    specDescription: "High airflow fan",
    attributeValue: "120mm",
    ppnDesc: "System Fan",
    odmSupplierName: "Delta",
    commGroup: "COOL",
  },
  {
    id: "8",
    mt: "MT008",
    fruName: "Graphics Card",
    ccType: "Type C",
    updateType: "Update",
    fru: "FRU008",
    level: "L1",
    lenovoPpn: "LPN-12352",
    vendorPpn: "VPN-ABCDL",
    substituteLenovoPpn: "LPN-12352-R",
    lenovoPpnBasicName: "GPU-RTX3060",
    lenovoPpnName: "NVIDIA RTX 3060",
    lenovoPpnQty: "1",
    specCategory: "Graphics",
    specDescription: "Dedicated GPU",
    attributeValue: "RTX3060",
    ppnDesc: "Video Card",
    odmSupplierName: "NVIDIA",
    commGroup: "GPU",
  },
  {
    id: "9",
    mt: "MT009",
    fruName: "Keyboard",
    ccType: "Type A",
    updateType: "New",
    fru: "FRU009",
    level: "L3",
    lenovoPpn: "LPN-12353",
    vendorPpn: "VPN-ABCDM",
    substituteLenovoPpn: "LPN-12353-R",
    lenovoPpnBasicName: "KB-US-ENG",
    lenovoPpnName: "US English Keyboard",
    lenovoPpnQty: "1",
    specCategory: "Input",
    specDescription: "Backlit keyboard",
    attributeValue: "US",
    ppnDesc: "Keyboard",
    odmSupplierName: "Lite-On",
    commGroup: "INP",
  },
  {
    id: "10",
    mt: "MT010",
    fruName: "Display Panel",
    ccType: "Type B",
    updateType: "Delete",
    fru: "FRU010",
    level: "L1",
    lenovoPpn: "LPN-12354",
    vendorPpn: "VPN-ABCDN",
    substituteLenovoPpn: "LPN-12354-R",
    lenovoPpnBasicName: "LCD-15.6FHD",
    lenovoPpnName: "15.6 FHD Display",
    lenovoPpnQty: "1",
    specCategory: "Display",
    specDescription: "Full HD IPS panel",
    attributeValue: "15.6",
    ppnDesc: "Screen",
    odmSupplierName: "LG",
    commGroup: "DISP",
  },
]

// Generate more mock data
const generateMoreData = (count: number): MtFruData[] => {
  const data: MtFruData[] = []
  const categories = ["Electronics", "Power", "Memory", "Storage", "Network", "Processor", "Cooling", "Graphics", "Input", "Display"]
  const suppliers = ["Foxconn", "Delta", "Samsung", "WD", "Intel", "NVIDIA", "LG", "Lite-On", "Innolux", "AUO"]
  const commGroups = ["HW", "MEM", "STOR", "NET", "CPU", "COOL", "GPU", "INP", "DISP", "PWR"]
  const ccTypes = ["Type A", "Type B", "Type C", "Type D"]
  const updateTypes = ["New", "Update", "Delete"]
  
  for (let i = 0; i < count; i++) {
    const idx = i % 10
    data.push({
      id: `${i + 11}`,
      mt: `MT${(i + 11).toString().padStart(3, "0")}`,
      fruName: `Component ${i + 11}`,
      ccType: ccTypes[i % 4],
      updateType: updateTypes[i % 3],
      fru: `FRU${(i + 11).toString().padStart(3, "0")}`,
      level: `L${(i % 3) + 1}`,
      lenovoPpn: `LPN-${12345 + i}`,
      vendorPpn: `VPN-${String.fromCharCode(65 + i % 26)}${String.fromCharCode(66 + i % 26)}${String.fromCharCode(67 + i % 26)}${String.fromCharCode(68 + i % 26)}${String.fromCharCode(69 + i % 26)}`,
      substituteLenovoPpn: i % 2 === 0 ? `LPN-${12345 + i}-R` : "-",
      lenovoPpnBasicName: `COMP-${i + 11}`,
      lenovoPpnName: `Component Name ${i + 11}`,
      lenovoPpnQty: `${(i % 4) + 1}`,
      specCategory: categories[idx],
      specDescription: `Description for component ${i + 11}`,
      attributeValue: `VAL-${i + 11}`,
      ppnDesc: `PPN Description ${i + 11}`,
      odmSupplierName: suppliers[idx],
      commGroup: commGroups[idx],
    })
  }
  return data
}

const allData = [...mockData, ...generateMoreData(40)]

// Default columns
const defaultColumns: Column[] = [
  { key: "mt", label: "MT", width: 100, visible: true },
  { key: "fruName", label: "Fru Name", width: 140, visible: true },
  { key: "ccType", label: "CC Type", width: 100, visible: true },
  { key: "updateType", label: "Update Type", width: 100, visible: true },
  { key: "fru", label: "FRU", width: 100, visible: true },
  { key: "level", label: "Level", width: 70, visible: true },
  { key: "lenovoPpn", label: "Lenovo PPN", width: 120, visible: true },
  { key: "vendorPpn", label: "Vendor PPN", width: 120, visible: true },
  { key: "substituteLenovoPpn", label: "Substitute Lenovo PPN", width: 140, visible: true },
  { key: "lenovoPpnBasicName", label: "Lenovo PPN Basic Name", width: 160, visible: true },
  { key: "lenovoPpnName", label: "Lenovo PPN Name", width: 160, visible: true },
  { key: "lenovoPpnQty", label: "Lenovo PPN Qty", width: 110, visible: true },
  { key: "specCategory", label: "Spec Category", width: 120, visible: true },
  { key: "specDescription", label: "Spec Description", width: 160, visible: true },
  { key: "attributeValue", label: "Attribute Value", width: 120, visible: true },
  { key: "ppnDesc", label: "PPN Desc", width: 120, visible: true },
  { key: "odmSupplierName", label: "ODM Supplier Name", width: 140, visible: true },
  { key: "commGroup", label: "Comm Group", width: 100, visible: true },
]

export default function MtFruManagementPage() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("fru-mt")

  // Pagination
  const totalRows = allData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const currentData = allData.slice(startIndex, endIndex)

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setColumns(columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ))
  }

  // Render cell content
  const renderCellContent = (row: MtFruData, key: string) => {
    switch (key) {
      case "mt":
        return <span className="text-sm font-medium text-primary font-mono">{row.mt}</span>
      case "fruName":
        return <span className="text-sm text-foreground">{row.fruName}</span>
      case "ccType":
        return <span className="text-sm text-foreground">{row.ccType}</span>
      case "updateType":
        return (
          <span className={cn(
            "text-sm font-medium",
            row.updateType === "New" ? "text-emerald-600" :
            row.updateType === "Update" ? "text-blue-600" : "text-red-600"
          )}>
            {row.updateType}
          </span>
        )
      case "fru":
        return <span className="text-sm text-muted-foreground font-mono">{row.fru}</span>
      case "level":
        return <span className="text-sm text-foreground">{row.level}</span>
      case "lenovoPpn":
        return <span className="text-sm text-muted-foreground font-mono">{row.lenovoPpn}</span>
      case "vendorPpn":
        return <span className="text-sm text-muted-foreground font-mono">{row.vendorPpn}</span>
      case "substituteLenovoPpn":
        return <span className="text-sm text-muted-foreground font-mono">{row.substituteLenovoPpn}</span>
      case "lenovoPpnBasicName":
        return <span className="text-sm text-foreground">{row.lenovoPpnBasicName}</span>
      case "lenovoPpnName":
        return <span className="text-sm text-foreground">{row.lenovoPpnName}</span>
      case "lenovoPpnQty":
        return <span className="text-sm text-foreground">{row.lenovoPpnQty}</span>
      case "specCategory":
        return <span className="text-sm text-foreground">{row.specCategory}</span>
      case "specDescription":
        return <span className="text-sm text-foreground">{row.specDescription}</span>
      case "attributeValue":
        return <span className="text-sm text-foreground">{row.attributeValue}</span>
      case "ppnDesc":
        return <span className="text-sm text-foreground">{row.ppnDesc}</span>
      case "odmSupplierName":
        return <span className="text-sm text-foreground">{row.odmSupplierName}</span>
      case "commGroup":
        return <span className="text-sm text-foreground">{row.commGroup}</span>
      default:
        return null
    }
  }

  const visibleColumns = columns.filter(col => col.visible)

  return (
    <MainLayout className="p-0 lg:p-6">
      <div className="h-full flex flex-col bg-background overflow-hidden">
        {/* Header Section */}
        <div className="bg-white shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">MT-FRU Management</h1>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs - 在标题和搜索之间 */}
        <div className="bg-white pt-4 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="fru-mt" className="px-4 py-1.5 text-sm">FRU-MT</TabsTrigger>
              <TabsTrigger value="fru-mtm" className="px-4 py-1.5 text-sm">FRU-MTM</TabsTrigger>
              <TabsTrigger value="fru-sbb" className="px-4 py-1.5 text-sm">FRU-SBB</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Panel */}
        <div className="bg-white py-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Filters - 横向排列的输入框 */}
            <div className="relative w-[200px]">
              <Input
                placeholder="MT"
                className="h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <div className="relative w-[200px]">
              <Input
                placeholder="Fru Name"
                className="h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <div className="relative w-[200px]">
              <Select>
                <SelectTrigger className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-primary focus:border-primary [&>span]:text-muted-foreground data-[state=open]:ring-primary data-[state=open]:border-primary">
                  <SelectValue placeholder="CC Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="type-a">Type A</SelectItem>
                  <SelectItem value="type-b">Type B</SelectItem>
                  <SelectItem value="type-c">Type C</SelectItem>
                  <SelectItem value="type-d">Type D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-[200px]">
              <Select>
                <SelectTrigger className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-primary focus:border-primary [&>span]:text-muted-foreground data-[state=open]:ring-primary data-[state=open]:border-primary">
                  <SelectValue placeholder="Update Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="icon" className="h-10 w-10">
              <RotateCcw className="h-4 w-4" />
            </Button>

            <div className="flex-1" />

            {/* Column Settings */}
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="end">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Column Settings</p>
                  <div className="space-y-1">
                    {columns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={col.visible}
                          onCheckedChange={() => toggleColumnVisibility(col.key)}
                        />
                        <span className="text-sm">{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Table - 增加border、rounded-2xl、overflow-hidden */}
          <div className="flex-1 border border-border rounded-2xl overflow-hidden">
            <div className="h-full overflow-auto">
              <div className="min-w-max">
                {/* Table Header */}
                <div className="flex bg-muted border-b sticky top-0 z-10">
                  {/* Frozen MT Column Header */}
                  <div className="sticky left-0 z-20 bg-muted border-r shrink-0">
                    <div className="flex items-center h-10 px-4" style={{ width: 100 }}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        MT
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Column Headers */}
                  <div className="flex">
                    {visibleColumns.filter(col => col.key !== "mt").map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center h-10 px-4 border-r shrink-0"
                        style={{ width: col.width }}
                      >
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {col.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Body */}
                <div>
                  {currentData.map((row, index) => (
                    <div
                      key={row.id}
                      className={cn(
                        "flex border-b hover:bg-muted/50 transition-colors",
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      )}
                    >
                      {/* Frozen MT Column */}
                      <div className="sticky left-0 z-10 bg-background border-r shrink-0">
                        <div className="flex items-center h-12 px-4" style={{ width: 100 }}>
                          <span className="text-sm font-medium text-primary font-mono">
                            {row.mt}
                          </span>
                        </div>
                      </div>

                      {/* Scrollable Columns */}
                      <div className="flex">
                        {visibleColumns.filter(col => col.key !== "mt").map((col) => (
                          <div
                            key={col.key}
                            className="flex items-center h-12 px-4 border-r shrink-0"
                            style={{ width: col.width }}
                          >
                            {renderCellContent(row, col.key)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t bg-card shrink-0 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total</span>
              <span className="font-semibold text-foreground">{totalRows}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
