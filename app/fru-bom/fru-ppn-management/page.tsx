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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
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

// Mock data for FRU-PPN Management
interface FruPpnData {
  id: string
  fru: string
  fruName: string
  substituteFru: string[]
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
  children?: FruPpnData[]
}

const mockData: FruPpnData[] = [
  {
    id: "1",
    fru: "FRU001",
    fruName: "Motherboard Assembly",
    substituteFru: ["FRU001-R", "FRU001-A", "FRU001-B"],
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
    children: [
      {
        id: "1-1",
        fru: "FRU001",
        fruName: "Motherboard Assembly",
        substituteFru: ["FRU001-R", "FRU001-A", "FRU001-B"],
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
    ],
  },
  {
    id: "2",
    fru: "FRU002",
    fruName: "Power Supply Unit",
    substituteFru: ["FRU002-R"],
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
    fru: "FRU003",
    fruName: "Memory Module 16GB",
    substituteFru: ["FRU003-R", "FRU003-X"],
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
    fru: "FRU004",
    fruName: "SSD 512GB",
    substituteFru: ["FRU004-R"],
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
    fru: "FRU005",
    fruName: "WiFi Card",
    substituteFru: ["FRU005-R", "FRU005-A", "FRU005-B", "FRU005-C"],
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
    fru: "FRU006",
    fruName: "CPU Processor",
    substituteFru: ["FRU006-R"],
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
    children: [
      {
        id: "6-1",
        fru: "FRU006",
        fruName: "CPU Processor",
        substituteFru: ["FRU006-R"],
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
    ],
  },
  {
    id: "7",
    fru: "FRU007",
    fruName: "Cooling Fan",
    substituteFru: ["FRU007-R", "FRU007-X"],
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
    fru: "FRU008",
    fruName: "Graphics Card",
    substituteFru: ["FRU008-R"],
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
    fru: "FRU009",
    fruName: "Keyboard",
    substituteFru: ["FRU009-R", "FRU009-A", "FRU009-B"],
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
    fru: "FRU010",
    fruName: "Display Panel",
    substituteFru: ["FRU010-R"],
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
const generateMoreData = (count: number): FruPpnData[] => {
  const data: FruPpnData[] = []
  const categories = ["Electronics", "Power", "Memory", "Storage", "Network", "Processor", "Cooling", "Graphics", "Input", "Display"]
  const suppliers = ["Foxconn", "Delta", "Samsung", "WD", "Intel", "NVIDIA", "LG", "Lite-On", "Innolux", "AUO"]
  const commGroups = ["HW", "MEM", "STOR", "NET", "CPU", "COOL", "GPU", "INP", "DISP", "PWR"]
  
  for (let i = 0; i < count; i++) {
    const hasChildren = i % 3 === 0
    const idx = i % 10
    const subCount = i % 4
    const subs: string[] = []
    for (let j = 0; j < subCount; j++) {
      subs.push(`FRU${(i + 11).toString().padStart(3, "0")}-${String.fromCharCode(82 + j)}`)
    }
    data.push({
      id: `${i + 11}`,
      fru: `FRU${(i + 11).toString().padStart(3, "0")}`,
      fruName: `Component ${i + 11}`,
      substituteFru: subs.length > 0 ? subs : [],
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
      children: hasChildren ? [
        {
          id: `${i + 11}-1`,
          fru: `FRU${(i + 11).toString().padStart(3, "0")}`,
          fruName: `Component ${i + 11}`,
          substituteFru: subs.length > 0 ? subs : [],
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
        },
      ] : undefined,
    })
  }
  return data
}

const allData = [...mockData, ...generateMoreData(40)]

// Default columns - 根据CSV文件调整列
const defaultColumns: Column[] = [
  { key: "fru", label: "FRU", width: 100, visible: true },
  { key: "fruName", label: "FRU Name", width: 140, visible: true },
  { key: "substituteFru", label: "Substitute FRU", width: 180, visible: true },
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

// Changelog data interface
interface ChangelogEntry {
  fru: string
  lenovoPpn: string
  action: string
  lenovoPpnLevel: string
  timeStamp: string
}

// Mock changelog data
const mockChangelogData: ChangelogEntry[] = [
  { fru: "5B21U02708", lenovoPpn: "001", action: "Add", lenovoPpnLevel: "L1", timeStamp: "2025-03-30" },
  { fru: "5B21U02708", lenovoPpn: "001", action: "Add", lenovoPpnLevel: "L1", timeStamp: "2025-03-30" },
  { fru: "5B21U02708", lenovoPpn: "001", action: "Add", lenovoPpnLevel: "L1", timeStamp: "2025-03-30" },
  { fru: "5B21U02708", lenovoPpn: "001", action: "Add", lenovoPpnLevel: "L1", timeStamp: "2025-03-30" },
  { fru: "5B21U02708", lenovoPpn: "001", action: "Add", lenovoPpnLevel: "L1", timeStamp: "2025-03-30" },
]

export default function FruPpnManagementPage() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [selectedFru, setSelectedFru] = useState<string>("")

  // Pagination
  const totalRows = allData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const currentData = allData.slice(startIndex, endIndex)

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setColumns(columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ))
  }

  // Handle FRU click to open changelog
  const handleFruClick = (fru: string) => {
    setSelectedFru(fru)
    setChangelogOpen(true)
  }

  // Render cell content
  const renderCellContent = (row: FruPpnData, key: string) => {
    switch (key) {
      case "fru":
        return (
          <button
            onClick={() => handleFruClick(row.fru)}
            className="text-sm font-medium text-primary font-mono hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            {row.fru}
          </button>
        )
      case "fruName":
        return <span className="text-sm text-foreground">{row.fruName}</span>
      case "substituteFru":
        if (row.substituteFru.length === 0) return <span className="text-sm text-muted-foreground">-</span>
        const displayText = row.substituteFru.join(", ")
        return (
          <Popover>
            <PopoverTrigger>
              <div className="w-full flex items-center justify-center cursor-pointer">
                <span className="text-sm text-foreground line-clamp-2 text-center">{displayText}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-md p-3" align="center">
              <div className="space-y-2">
                <p className="text-sm font-medium">Substitute FRU List</p>
                <div className="flex flex-wrap gap-1">
                  {row.substituteFru.map((fru, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      {fru}
                    </span>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )
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
        {/* Header Section - 与Component Graph保持一致 */}
        <div className="bg-white shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">FRU-PPN Management</h1>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Search Panel - 与Component Graph保持一致 */}
        <div className="bg-white py-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Filters - 横向排列的输入框 */}
            <div className="relative w-[200px]">
              <Input
                placeholder="FRU"
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
              <Input
                placeholder="Lenovo PPN"
                className="h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <div className="relative w-[200px]">
              <Input
                placeholder="Vendor PPN"
                className="h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary"
              />
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
                <div className="flex bg-muted border-b sticky top-0 z-30">
                  {/* Expand Column */}
                  <div className="flex items-center justify-center h-10 w-10 border-r bg-muted shrink-0 z-30">
                    <span className="text-xs font-semibold text-muted-foreground"></span>
                  </div>
                  
                  {/* Frozen FRU Column Header */}
                  <div className="sticky left-0 z-40 bg-muted border-r shrink-0">
                    <div className="flex items-center h-10 px-4" style={{ width: 100 }}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        FRU
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Column Headers */}
                  <div className="flex">
                    {visibleColumns.filter(col => col.key !== "fru").map((col) => (
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
                    <div key={row.id}>
                      {/* Parent Row */}
                      <div
                        className={cn(
                          "flex border-b hover:bg-muted/50 transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        {/* Expand Button */}
                        <div className="flex items-center justify-center h-12 w-10 border-r shrink-0">
                          {row.children && row.children.length > 0 && (
                            <button
                              onClick={() => toggleRowExpansion(row.id)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              {expandedRows.has(row.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Frozen FRU Column */}
                        <div className="sticky left-0 z-10 bg-background border-r shrink-0">
                          <div className="flex items-center h-12 px-4" style={{ width: 100 }}>
                            <span className="text-sm font-medium text-primary font-mono">
                              {row.fru}
                            </span>
                          </div>
                        </div>

                        {/* Scrollable Columns */}
                        <div className="flex">
                          {visibleColumns.filter(col => col.key !== "fru").map((col) => (
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

                      {/* Child Rows - 增加背景颜色区分 */}
                      {row.children && expandedRows.has(row.id) && row.children.map((child, childIndex) => (
                        <div
                          key={child.id}
                          className={cn(
                            "flex border-b hover:bg-blue-200 transition-colors",
                            childIndex % 2 === 0 ? "bg-blue-100" : "bg-blue-200"
                          )}
                        >
                          {/* Expand Button Placeholder */}
                          <div className={cn(
                            "flex items-center justify-center h-12 w-10 border-r shrink-0 z-10",
                            childIndex % 2 === 0 ? "bg-blue-100" : "bg-blue-200"
                          )}>
                          </div>

                          {/* Frozen FRU Column */}
                          <div className={cn(
                            "sticky left-0 z-20 border-r shrink-0",
                            childIndex % 2 === 0 ? "bg-blue-100" : "bg-blue-200"
                          )}>
                            <div className="flex items-center h-12 px-4" style={{ width: 100 }}>
                              <span className="text-sm font-medium text-primary font-mono">
                                {child.fru}
                              </span>
                            </div>
                          </div>

                          {/* Scrollable Columns */}
                          <div className="flex">
                            {visibleColumns.filter(col => col.key !== "fru").map((col) => (
                              <div
                                key={col.key}
                                className="flex items-center h-12 px-4 border-r shrink-0"
                                style={{ width: col.width }}
                              >
                                {renderCellContent(child, col.key)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
      {/* Changelog Dialog */}
      <Dialog open={changelogOpen} onOpenChange={setChangelogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Changelog</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="fru-lenovo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fru-lenovo">FRU - Lenovo PPN changelog</TabsTrigger>
              <TabsTrigger value="fru-substitute">FRU - Substitute FRU changelog</TabsTrigger>
            </TabsList>
            <TabsContent value="fru-lenovo" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="flex bg-muted border-b">
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">FRU</span>
                  </div>
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Lenovo PPN</span>
                  </div>
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Action</span>
                  </div>
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Lenovo PPN Level</span>
                  </div>
                  <div className="flex items-center h-10 px-4 flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Time Stamp</span>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-auto">
                  {mockChangelogData.map((entry, index) => (
                    <div key={index} className="flex border-b last:border-b-0 hover:bg-muted/50">
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm font-medium text-primary font-mono">{entry.fru}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm text-foreground">{entry.lenovoPpn}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm text-foreground">{entry.action}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm text-foreground">{entry.lenovoPpnLevel}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 flex-1">
                        <span className="text-sm text-muted-foreground">{entry.timeStamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="fru-substitute" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="flex bg-muted border-b">
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">FRU</span>
                  </div>
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Substitute FRU</span>
                  </div>
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Action</span>
                  </div>
                  <div className="flex items-center h-10 px-4 border-r flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Level</span>
                  </div>
                  <div className="flex items-center h-10 px-4 flex-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Time Stamp</span>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-auto">
                  {mockChangelogData.map((entry, index) => (
                    <div key={index} className="flex border-b last:border-b-0 hover:bg-muted/50">
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm font-medium text-primary font-mono">{entry.fru}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm text-foreground">{entry.lenovoPpn}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm text-foreground">{entry.action}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 border-r flex-1">
                        <span className="text-sm text-foreground">{entry.lenovoPpnLevel}</span>
                      </div>
                      <div className="flex items-center h-12 px-4 flex-1">
                        <span className="text-sm text-muted-foreground">{entry.timeStamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
