"use client"

import { useState, useMemo, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  RotateCcw,
  Filter,
  ChevronDown,
  Search,
  FileUp,
  History,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ==================== Types ====================

type TableSource = "System Sync" | "Manual Upload"

interface OriginalTable {
  id: string
  name: string
  source: TableSource
  description?: string
  lastUpdated: string
  rowCount: number
}

interface Column {
  key: string
  label: string
  width: number
}

interface TableData {
  id: string
  [key: string]: string | number | boolean
}

interface UploadHistory {
  id: string
  fileName: string
  uploadedAt: string
  uploadedBy: string
  rowCount: number
  status: "Success" | "Failed" | "Processing"
}

// ==================== Mock Data ====================

const mockTables: OriginalTable[] = [
  {
    id: "1",
    name: "mtsbomweeklyreport_ods",
    source: "System Sync",
    description: "MTS BOM Weekly Report",
    lastUpdated: "2024-04-15 10:33:26",
    rowCount: 12580,
  },
  {
    id: "2",
    name: "Product_readiness_list_ods",
    source: "System Sync",
    description: "Product Readiness List",
    lastUpdated: "2024-04-15 09:15:00",
    rowCount: 3420,
  },
  {
    id: "3",
    name: "SCI Full List",
    source: "Manual Upload",
    description: "SCI Full Material List",
    lastUpdated: "2024-04-14 16:20:00",
    rowCount: 8950,
  },
  {
    id: "4",
    name: "Manual Monthly Sharing",
    source: "Manual Upload",
    description: "Monthly Sharing Data",
    lastUpdated: "2024-04-14 14:30:00",
    rowCount: 5600,
  },
  {
    id: "5",
    name: "fru_fap_mm_new_final",
    source: "System Sync",
    description: "FRU FAP MM New Final",
    lastUpdated: "2024-04-15 08:45:00",
    rowCount: 7890,
  },
  {
    id: "6",
    name: "dpe_ftp_basic.delivery_full_svc_s...",
    source: "System Sync",
    description: "DPE FTP Basic Delivery",
    lastUpdated: "2024-04-15 07:20:00",
    rowCount: 45200,
  },
  {
    id: "7",
    name: "master_data_basic.dcpngroup_ods",
    source: "System Sync",
    description: "Master Data DCPN Group",
    lastUpdated: "2024-04-15 06:10:00",
    rowCount: 12300,
  },
  {
    id: "8",
    name: "master_data_basic.sbb_ppn_sub...",
    source: "System Sync",
    description: "Master Data SBB PPN",
    lastUpdated: "2024-04-15 05:30:00",
    rowCount: 8900,
  },
  {
    id: "9",
    name: "idg_md_vendor_odm_material",
    source: "Manual Upload",
    description: "IDG MD Vendor ODM Material",
    lastUpdated: "2024-04-13 11:45:00",
    rowCount: 6780,
  },
  {
    id: "10",
    name: "master_data.fru_bom_combine_c...",
    source: "System Sync",
    description: "Master Data FRU BOM Combine",
    lastUpdated: "2024-04-15 04:20:00",
    rowCount: 15600,
  },
  {
    id: "11",
    name: "master_data_basic.imp_odm_bo...",
    source: "System Sync",
    description: "Master Data IMP ODM BOM",
    lastUpdated: "2024-04-15 03:15:00",
    rowCount: 23400,
  },
]

// Mock data for different tables
const generateMockTableData = (tableName: string): TableData[] => {
  const data: TableData[] = []
  const count = 25

  if (tableName.includes("bom")) {
    for (let i = 0; i < count; i++) {
      data.push({
        id: `${i + 1}`,
        lenovoPpn: `S670Q${(80240 + i).toString().padStart(5, "0")}`,
        description: ["MECHANICAL", "BDPLANAR", "MEMORY", "VRAM", "CABLE"][i % 5],
        vendor: ["LCFC", "Wistron", "Compal", "Inventec", "Foxconn"][i % 5],
        qty: Math.floor(Math.random() * 10) + 1,
        unit: "EA",
        level: Math.floor(Math.random() * 5) + 1,
        createdAt: "2024-04-07 10:" + (10 + i).toString().padStart(2, "0"),
      })
    }
  } else if (tableName.includes("material")) {
    for (let i = 0; i < count; i++) {
      data.push({
        id: `${i + 1}`,
        materialNo: `M${(100000 + i).toString().padStart(6, "0")}`,
        description: ["CPU", "MEMORY", "SSD", "HDD", "WIFI"][i % 5],
        category: ["Processor", "Memory", "Storage", "Storage", "Network"][i % 5],
        vendor: ["Intel", "Samsung", "WD", "Seagate", "Qualcomm"][i % 5],
        status: ["Active", "Inactive", "EOL"][i % 3],
        updatedAt: "2024-04-07 10:" + (10 + i).toString().padStart(2, "0"),
      })
    }
  } else {
    for (let i = 0; i < count; i++) {
      data.push({
        id: `${i + 1}`,
        itemCode: `ITEM${(1000 + i).toString().padStart(4, "0")}`,
        itemName: `Item ${i + 1}`,
        type: ["Type A", "Type B", "Type C"][i % 3],
        value: Math.floor(Math.random() * 1000),
        status: ["Active", "Pending", "Archived"][i % 3],
        createdAt: "2024-04-07 10:" + (10 + i).toString().padStart(2, "0"),
      })
    }
  }
  return data
}

// Mock upload history
const mockUploadHistory: UploadHistory[] = [
  {
    id: "1",
    fileName: "SCI_Full_List_20240414.xlsx",
    uploadedAt: "2024-04-14 16:20:00",
    uploadedBy: "John Doe",
    rowCount: 8950,
    status: "Success",
  },
  {
    id: "2",
    fileName: "SCI_Full_List_20240315.xlsx",
    uploadedAt: "2024-03-15 14:30:00",
    uploadedBy: "John Doe",
    rowCount: 8720,
    status: "Success",
  },
  {
    id: "3",
    fileName: "SCI_Full_List_20240215.xlsx",
    uploadedAt: "2024-02-15 10:15:00",
    uploadedBy: "Jane Smith",
    rowCount: 8500,
    status: "Success",
  },
  {
    id: "4",
    fileName: "Monthly_Sharing_202404.xlsx",
    uploadedAt: "2024-04-14 14:30:00",
    uploadedBy: "John Doe",
    rowCount: 5600,
    status: "Success",
  },
  {
    id: "5",
    fileName: "IDG_Vendor_Material_20240413.xlsx",
    uploadedAt: "2024-04-13 11:45:00",
    uploadedBy: "Jane Smith",
    rowCount: 6780,
    status: "Success",
  },
]

// Upload History Dialog
interface UploadHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableName: string
}

function UploadHistoryDialog({ open, onOpenChange, tableName }: UploadHistoryDialogProps) {
  const history = mockUploadHistory.filter(h => 
    tableName.toLowerCase().replace(/\s+/g, "_").includes(
      h.fileName.toLowerCase().split("_").slice(0, 2).join("_").replace(/_\d{8}\.xlsx$/, "")
    ) || Math.random() > 0.5
  ).slice(0, 5)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Upload History - {tableName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 text-sm font-medium whitespace-nowrap">File Name</th>
                <th className="text-left py-2 px-4 text-sm font-medium whitespace-nowrap">Uploaded At</th>
                <th className="text-left py-2 px-4 text-sm font-medium whitespace-nowrap">Uploaded By</th>
                <th className="text-right py-2 px-4 text-sm font-medium whitespace-nowrap">Rows</th>
                <th className="text-center py-2 px-4 text-sm font-medium whitespace-nowrap">Status</th>
                <th className="text-center py-2 px-4 text-sm font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[200px]" title={item.fileName}>{item.fileName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">{item.uploadedAt}</td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">{item.uploadedBy}</td>
                  <td className="py-3 px-4 text-sm text-right whitespace-nowrap">{item.rowCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      item.status === "Success" && "bg-green-100 text-green-700",
                      item.status === "Failed" && "bg-red-100 text-red-700",
                      item.status === "Processing" && "bg-blue-100 text-blue-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ==================== Main Page ====================

export default function OriginalTablePage() {
  const [tables] = useState<OriginalTable[]>(mockTables)
  const [selectedTableId, setSelectedTableId] = useState<string>(mockTables[0]?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [sourceFilter, setSourceFilter] = useState<"All" | TableSource>("All")

  // Table view states
  const [columns, setColumns] = useState<Column[]>([])
  const [tableData, setTableData] = useState<TableData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  // Filter states
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({})
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Filter tables based on search and source filter
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch = searchQuery === "" || 
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (table.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesSource = sourceFilter === "All" || table.source === sourceFilter
      return matchesSearch && matchesSource
    })
  }, [tables, searchQuery, sourceFilter])

  // Get selected table
  const selectedTable = useMemo(() => {
    return tables.find((t) => t.id === selectedTableId) || null
  }, [tables, selectedTableId])

  // Generate columns based on table data
  useEffect(() => {
    if (selectedTable) {
      const data = generateMockTableData(selectedTable.name)
      setTableData(data)
      
      if (data.length > 0) {
        const keys = Object.keys(data[0]).filter(k => k !== "id")
        const newColumns: Column[] = keys.map((key, index) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
          width: [140, 180, 160, 120, 100, 140, 160][index % 7] || 140,
        }))
        setColumns(newColumns)
      }
      setCurrentPage(1)
      setFilterValues({})
      setDateRange(undefined)
    }
  }, [selectedTable])

  // Generate filter options based on current data
  const filterOptions = useMemo(() => {
    const options: Record<string, MultiSelectOption[]> = {}
    if (tableData.length > 0) {
      const keys = Object.keys(tableData[0]).filter(k => k !== "id")
      keys.forEach(key => {
        const values = [...new Set(tableData.map(row => String(row[key])))]
        options[key] = values.map(v => ({ value: v, label: v }))
      })
    }
    return options
  }, [tableData])

  // Filter data
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      // Apply multi-select filters
      for (const [key, values] of Object.entries(filterValues)) {
        if (values.length > 0 && !values.includes(String(row[key]))) {
          return false
        }
      }

      // Apply date range filter if exists
      if (dateRange?.from) {
        const dateKey = Object.keys(row).find(k => k.toLowerCase().includes("date") || k.toLowerCase().includes("time") || k.toLowerCase().includes("at"))
        if (dateKey) {
          const rowDate = new Date(String(row[dateKey]))
          const fromDate = new Date(dateRange.from)
          fromDate.setHours(0, 0, 0, 0)

          if (rowDate < fromDate) return false

          if (dateRange.to) {
            const toDate = new Date(dateRange.to)
            toDate.setHours(23, 59, 59, 999)
            if (rowDate > toDate) return false
          }
        }
      }

      return true
    })
  }, [tableData, filterValues, dateRange])

  // Pagination
  const totalRows = filteredData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const currentData = filteredData.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterValues, dateRange])

  // Reset all filters
  const resetFilters = () => {
    setFilterValues({})
    setDateRange(undefined)
  }

  // Check if any filter is active
  const hasActiveFilters = Object.values(filterValues).some(v => v.length > 0) || dateRange?.from

  // Handle export
  const handleExport = () => {
    toast.success("Export started. You will receive an email when it's ready.")
  }

  // Handle import
  const handleImport = () => {
    toast.info("Import dialog will open here")
  }

  // Handle view history
  const handleViewHistory = () => {
    setHistoryDialogOpen(true)
  }

  // Render cell content
  const renderCellContent = (row: TableData, key: string) => {
    const value = row[key]
    if (typeof value === "boolean") {
      return <span className="text-sm text-muted-foreground">{value ? "Yes" : "No"}</span>
    }
    if (key.toLowerCase().includes("status")) {
      return (
        <span className={cn(
          "text-sm font-normal px-2 py-0.5 rounded-full",
          value === "Active" && "bg-green-100 text-green-700",
          value === "Inactive" && "bg-gray-100 text-gray-700",
          value === "Pending" && "bg-yellow-100 text-yellow-700",
          value === "Archived" && "bg-blue-100 text-blue-700",
          value === "EOL" && "bg-red-100 text-red-700"
        )}>
          {String(value)}
        </span>
      )
    }
    return <span className="text-sm font-normal text-foreground truncate">{String(value)}</span>
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] flex flex-col p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Original Table</h1>
        </div>

        <Card className="flex-1 flex flex-col min-h-0 !py-0">
          <CardContent className="flex-1 flex p-0 min-h-0">
            {/* Left: Table List */}
            <div className="w-[320px] flex flex-col shrink-0 border-r">
              {/* Search and Filter */}
              <div className="p-4 border-b space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={sourceFilter}
                  onValueChange={(value) => setSourceFilter(value as "All" | TableSource)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Sources</SelectItem>
                    <SelectItem value="System Sync">System Sync</SelectItem>
                    <SelectItem value="Manual Upload">Manual Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredTables.map((table) => (
                    <div
                      key={table.id}
                      onClick={() => setSelectedTableId(table.id)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                        selectedTableId === table.id
                          ? "bg-primary/5 border-primary ring-1 ring-primary"
                          : "bg-card border-border hover:bg-muted/50 hover:border-muted-foreground/20"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <FileText className={cn(
                          "h-5 w-5 shrink-0 mt-0.5",
                          table.source === "System Sync" ? "text-blue-500" : "text-green-500"
                        )} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{table.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {table.source}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {table.rowCount.toLocaleString()} rows
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Table Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {selectedTable ? (
                <>
                  {/* Header */}
                  <div className="px-4 py-4 border-b shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">{selectedTable.name}</div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {selectedTable.description}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Last Updated: {selectedTable.lastUpdated}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedTable.source === "Manual Upload" && (
                          <>
                            <Button variant="outline" size="sm" onClick={handleImport}>
                              <FileUp className="h-4 w-4 mr-2" />
                              Import
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleViewHistory}>
                              <History className="h-4 w-4 mr-2" />
                              History
                            </Button>
                          </>
                        )}
                        <Button variant="default" size="sm" onClick={handleExport}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Filter Panel */}
                  <div className="px-4 py-4 shrink-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Default Filters - Always Visible */}
                        <div className="grid grid-cols-4 gap-3">
                          {Object.entries(filterOptions).slice(0, 3).map(([key, options]) => (
                            <MultiSelect
                              key={key}
                              options={options}
                              selected={filterValues[key] || []}
                              onChange={(values) => setFilterValues(prev => ({ ...prev, [key]: values }))}
                              placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                              searchPlaceholder="Search..."
                              className="w-full min-w-0"
                            />
                          ))}
                          {/* Date Range Filter */}
                          <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            placeholder="Date Range"
                            className="w-full min-w-0"
                          />
                        </div>

                        {/* Expanded Filters */}
                        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                          <CollapsibleContent>
                            <div className="grid grid-cols-4 gap-3 mt-3">
                              {Object.entries(filterOptions).slice(3).map(([key, options]) => (
                                <MultiSelect
                                  key={key}
                                  options={options}
                                  selected={filterValues[key] || []}
                                  onChange={(values) => setFilterValues(prev => ({ ...prev, [key]: values }))}
                                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                                  searchPlaceholder="Search..."
                                  className="w-full min-w-0"
                                />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>

                      {/* Expand/Collapse Button - Show only if more than 4 filters */}
                      {Object.entries(filterOptions).length > 4 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFiltersOpen(!filtersOpen)}
                          className="h-10 w-10 shrink-0"
                        >
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            filtersOpen && "rotate-180"
                          )} />
                        </Button>
                      )}

                      {/* Reset Button */}
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={resetFilters}
                          className="h-10 w-10 shrink-0 text-muted-foreground"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-hidden px-4 pb-4">
                    <div className="h-full border border-border rounded-lg overflow-hidden">
                      <div className="h-full overflow-auto">
                        <div className="min-w-max">
                          {/* Table Header - Simple static header */}
                          <div className="flex bg-muted border-b sticky top-0 z-10">
                            {columns.map((col) => (
                              <div
                                key={col.key}
                                className="flex items-center h-10 px-4 border-r shrink-0 bg-muted"
                                style={{ width: col.width }}
                              >
                                <span className="text-xs font-semibold text-muted-foreground tracking-wider truncate">
                                  {col.label}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Table Body */}
                          <div>
                            {currentData.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Filter className="h-12 w-12 mb-4 opacity-30" />
                                <p className="text-sm">No data matching the filters</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={resetFilters}
                                  className="mt-2"
                                >
                                  Clear all filters
                                </Button>
                              </div>
                            ) : (
                              currentData.map((row, index) => (
                                <div
                                  key={row.id}
                                  className={cn(
                                    "flex border-b hover:bg-muted/50 transition-colors",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                  )}
                                >
                                  {columns.map((col) => (
                                    <div
                                      key={col.key}
                                      className="flex items-center h-12 px-4 border-r shrink-0"
                                      style={{ width: col.width }}
                                    >
                                      {renderCellContent(row, col.key)}
                                    </div>
                                  ))}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mx-4 px-4 py-3 border-t bg-card shrink-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Total</span>
                      <span className="font-semibold text-foreground">{totalRows}</span>
                      {hasActiveFilters && (
                        <span className="text-xs">(filtered from {tableData.length})</span>
                      )}
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
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Select a table to view its contents</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload History Dialog */}
      {selectedTable && (
        <UploadHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          tableName={selectedTable.name}
        />
      )}
    </MainLayout>
  )
}
