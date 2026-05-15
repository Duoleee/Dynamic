"use client"

import { useState, useMemo, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
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
import { TagsInput } from "@/components/ui/tags-input"
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  RotateCcw,
  Settings,
  RefreshCcw,
  Filter,
  CheckCircle2,
  Eye,
  ChevronDown,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ResolvedDialog } from "./resolved-dialog"
import { BatchActions } from "./components/batch-actions"
import { BatchResolveDialog } from "./components/batch-resolve-dialog"
import { RevokeDialog } from "./components/revoke-dialog"

interface Column {
  key: string
  label: string
  width: number
  visible: boolean
}

interface ConflictData {
  id: string
  fru: string
  lenovoPpnBasicName: string
  lenovoPpnConflictCount: string
  odm: string
  status: "Pending" | "Resolved" | "Revoke"
  createdTime: string
  auditor: string
  auditTime: string
}

const mockData: ConflictData[] = [
  {
    id: "1",
    fru: "00HM169",
    lenovoPpnBasicName: "MECHANICAL",
    lenovoPpnConflictCount: "3 records",
    odm: "LCFC",
    status: "Pending",
    createdTime: "2024-04-07 10:10",
    auditor: "",
    auditTime: "",
  },
  {
    id: "2",
    fru: "00HM170",
    lenovoPpnBasicName: "BDPLANAR",
    lenovoPpnConflictCount: "2 records",
    odm: "Wistron",
    status: "Pending",
    createdTime: "2024-04-07 10:15",
    auditor: "",
    auditTime: "",
  },
  {
    id: "3",
    fru: "00HM171",
    lenovoPpnBasicName: "MEMORY",
    lenovoPpnConflictCount: "3 records",
    odm: "Compal",
    status: "Resolved",
    createdTime: "2024-04-07 10:20",
    auditor: "Current User",
    auditTime: "2024-04-07 11:00",
  },
  {
    id: "4",
    fru: "00HM173",
    lenovoPpnBasicName: "MEMORY",
    lenovoPpnConflictCount: "2 records",
    odm: "LCFC",
    status: "Resolved",
    createdTime: "2024-04-07 10:30",
    auditor: "Current User",
    auditTime: "2024-04-07 12:00",
  },
  {
    id: "5",
    fru: "00HN508",
    lenovoPpnBasicName: "VRAM",
    lenovoPpnConflictCount: "2 records",
    odm: "Wistron",
    status: "Pending",
    createdTime: "2024-04-07 10:35",
    auditor: "",
    auditTime: "",
  },
  {
    id: "6",
    fru: "00HM169",
    lenovoPpnBasicName: "CABLE",
    lenovoPpnConflictCount: "2 records",
    odm: "LCFC",
    status: "Pending",
    createdTime: "2024-04-07 10:40",
    auditor: "",
    auditTime: "",
  },
]

const generateMoreData = (count: number): ConflictData[] => {
  const data: ConflictData[] = []
  const odms = ["LCFC", "Wistron", "Compal", "Inventec", "Foxconn"]
  const statuses: ("Pending" | "Resolved" | "Revoke")[] = ["Pending", "Resolved", "Revoke"]
  const basicNames = ["MECHANICAL", "BDPLANAR", "MEMORY", "VRAM", "CABLE", "SSD", "HDD", "WIFI"]

  for (let i = 0; i < count; i++) {
    const idx = i % 6
    data.push({
      id: `${i + 7}`,
      fru: `00HM${(170 + i).toString().padStart(3, "0")}`,
      lenovoPpnBasicName: basicNames[idx % basicNames.length],
      lenovoPpnConflictCount: `${(i % 4) + 2} records`,
      odm: odms[idx % odms.length],
      status: statuses[idx % 3],
      createdTime: "2024-04-07 10:" + (10 + i).toString().padStart(2, "0"),
      auditor: idx % 3 === 0 ? "" : "Current User",
      auditTime: idx % 3 === 0 ? "" : "2024-04-07 11:" + (20 + i).toString().padStart(2, "0"),
    })
  }
  return data
}

const allData = [...mockData, ...generateMoreData(20)]

// Filter options
const odmOptions: MultiSelectOption[] = ["LCFC", "Wistron", "Compal", "Inventec", "Foxconn"].map(odm => ({
  value: odm,
  label: odm,
}))

const statusOptions: MultiSelectOption[] = [
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" },
  { value: "Revoke", label: "Revoke" },
]

const defaultColumns: Column[] = [
  { key: "checkbox", label: "", width: 50, visible: true },
  { key: "fru", label: "FRU", width: 120, visible: true },
  { key: "lenovoPpnBasicName", label: "Lenovo PPN Basic Name", width: 180, visible: true },
  { key: "lenovoPpnConflictCount", label: "Lenovo PPN Conflict Count", width: 160, visible: true },
  { key: "odm", label: "ODM", width: 120, visible: true },
  { key: "status", label: "Status", width: 120, visible: true },
  { key: "createdTime", label: "Created Time", width: 160, visible: true },
  { key: "auditor", label: "Auditor", width: 140, visible: true },
  { key: "auditTime", label: "Audit Time", width: 160, visible: true },
  { key: "actions", label: "Actions", width: 140, visible: true },
]

// Sortable header component for column settings
interface SortableHeaderProps {
  column: Column
  onToggleVisibility: (key: string) => void
}

function SortableHeader({ column, onToggleVisibility }: SortableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer select-none",
        isDragging && "bg-muted shadow-lg"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Checkbox
        checked={column.visible}
        onCheckedChange={() => onToggleVisibility(column.key)}
      />
      <span className="text-sm flex-1">{column.label}</span>
    </div>
  )
}

// Sortable table header component
interface SortableTableHeaderProps {
  column: Column
  isFirst: boolean
  checked?: boolean
  onCheckedChange?: () => void
}

function SortableTableHeader({ column, isFirst, checked, onCheckedChange }: SortableTableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isFirst ? 20 : 10,
    width: column.width,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center h-10 px-4 border-r shrink-0 bg-muted cursor-grab active:cursor-grabbing",
        isFirst && "sticky left-0 z-20",
        isDragging && "bg-muted shadow-lg opacity-80"
      )}
      {...attributes}
      {...listeners}
    >
      {column.key === "checkbox" ? (
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground tracking-wider truncate">
          {column.label}
        </span>
      )}
    </div>
  )
}

export default function ConflictAuditPage() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("fru-lenovo")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Resolved Dialog states
  const [resolvedDialogOpen, setResolvedDialogOpen] = useState(false)
  const [selectedRowForResolve, setSelectedRowForResolve] = useState<ConflictData | null>(null)
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedRowsForBatch, setSelectedRowsForBatch] = useState<ConflictData[]>([])

  // Batch Resolve Confirm Dialog state
  const [batchResolveConfirmOpen, setBatchResolveConfirmOpen] = useState(false)

  // Revoke Dialog state
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedRowForRevoke, setSelectedRowForRevoke] = useState<ConflictData | null>(null)

  // Filter states
  const [selectedFrus, setSelectedFrus] = useState<string[]>([])
  const [basicNameSearch, setBasicNameSearch] = useState("")
  const [selectedOdms, setSelectedOdms] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [createdTimeRange, setCreatedTimeRange] = useState<DateRange | undefined>(undefined)

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end for column settings
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id)
        const newIndex = items.findIndex((item) => item.key === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Handle drag end for table header
  const handleTableDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id)
        const newIndex = items.findIndex((item) => item.key === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Filter data
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      // FRU filter
      if (selectedFrus.length > 0 && !selectedFrus.includes(row.fru)) {
        return false
      }

      // Basic Name filter (fuzzy search)
      if (basicNameSearch && !row.lenovoPpnBasicName.toLowerCase().includes(basicNameSearch.toLowerCase())) {
        return false
      }

      // ODM filter
      if (selectedOdms.length > 0 && !selectedOdms.includes(row.odm)) {
        return false
      }

      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(row.status)) {
        return false
      }

      // Created Time filter
      if (createdTimeRange?.from) {
        const rowDate = new Date(row.createdTime)
        const fromDate = new Date(createdTimeRange.from)
        fromDate.setHours(0, 0, 0, 0)

        if (rowDate < fromDate) return false

        if (createdTimeRange.to) {
          const toDate = new Date(createdTimeRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (rowDate > toDate) return false
        }
      }

      return true
    })
  }, [selectedFrus, basicNameSearch, selectedOdms, selectedStatuses, createdTimeRange])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFrus, basicNameSearch, selectedOdms, selectedStatuses, createdTimeRange])

  const totalRows = filteredData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const currentData = filteredData.slice(startIndex, endIndex)

  const toggleColumnVisibility = (key: string) => {
    setColumns(columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    ))
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === currentData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentData.map(row => row.id))
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedFrus([])
    setBasicNameSearch("")
    setSelectedOdms([])
    setSelectedStatuses([])
    setCreatedTimeRange(undefined)
  }

  // Check if any filter is active
  const hasActiveFilters = selectedFrus.length > 0 ||
    basicNameSearch ||
    selectedOdms.length > 0 ||
    selectedStatuses.length > 0 ||
    createdTimeRange?.from

  // Handle open resolved dialog
  const handleOpenResolvedDialog = (row: ConflictData) => {
    setSelectedRowForResolve(row)
    setResolvedDialogOpen(true)
  }

  // Handle confirm resolved
  const handleConfirmResolved = (selectedIds: string[], notes: string) => {
    if (isBatchMode) {
      console.log("Batch Resolved:", selectedRowsForBatch.map(r => r.fru), "Selected IDs:", selectedIds, "Notes:", notes)
      // TODO: Implement API call to batch resolve conflicts
      setSelectedRows([])
      setSelectedRowsForBatch([])
      setIsBatchMode(false)
    } else {
      console.log("Resolved:", selectedRowForResolve?.fru, "Selected IDs:", selectedIds, "Notes:", notes)
      // TODO: Implement API call to resolve conflict
    }
  }

  // Handle batch resolve - open confirm dialog
  const handleBatchResolve = () => {
    const selectedData = filteredData.filter(row => selectedRows.includes(row.id))
    setSelectedRowsForBatch(selectedData)
    setBatchResolveConfirmOpen(true)
  }

  // Handle confirm batch resolve
  const handleConfirmBatchResolve = () => {
    setBatchResolveConfirmOpen(false)
    setIsBatchMode(true)
    setResolvedDialogOpen(true)
  }

  // Handle open revoke dialog
  const handleOpenRevokeDialog = (row: ConflictData) => {
    setSelectedRowForRevoke(row)
    setRevokeDialogOpen(true)
  }

  // Handle confirm revoke
  const handleConfirmRevoke = (notes: string) => {
    console.log("Revoked:", selectedRowForRevoke?.fru, "Notes:", notes)
    // TODO: Implement API call to revoke conflict
    setSelectedRowForRevoke(null)
  }

  const renderCellContent = (row: ConflictData, key: string) => {
    switch (key) {
      case "checkbox":
        return (
          <Checkbox
            checked={selectedRows.includes(row.id)}
            onCheckedChange={() => toggleRowSelection(row.id)}
          />
        )
      case "fru":
        return <span className="text-sm font-medium text-foreground font-mono">{row.fru}</span>
      case "lenovoPpnBasicName":
        return <span className="text-sm text-foreground font-medium">{row.lenovoPpnBasicName}</span>
      case "lenovoPpnConflictCount":
        return <span className="text-sm font-bold text-foreground">{row.lenovoPpnConflictCount}</span>
      case "odm":
        return <span className="text-sm text-foreground">{row.odm}</span>
      case "status":
        return (
          <span className={cn(
            "text-sm font-medium flex items-center gap-1.5",
            row.status === "Pending" ? "text-blue-600" :
            row.status === "Resolved" ? "text-green-600" : "text-orange-600"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              row.status === "Pending" ? "bg-blue-600" :
              row.status === "Resolved" ? "bg-green-600" : "bg-orange-600"
            )} />
            {row.status}
          </span>
        )
      case "createdTime":
        return <span className="text-sm text-muted-foreground">{row.createdTime}</span>
      case "auditor":
        return <span className="text-sm text-foreground">{row.auditor || "-"}</span>
      case "auditTime":
        return <span className="text-sm text-muted-foreground">{row.auditTime || "-"}</span>
      case "actions":
        return (
          <div className="flex items-center justify-center gap-1.5">
            {row.status === "Pending" && (
              <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => handleOpenResolvedDialog(row)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Resolved
              </Button>
            )}
            {row.status === "Resolved" && (
              <>
                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleOpenRevokeDialog(row)}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Revoke
                </Button>
              </>
            )}
            {row.status === "Revoke" && (
              <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs">
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            )}
          </div>
        )
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
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-foreground">Conflict Audit</h1>
              <span className="text-xs text-muted-foreground">Last Sync: 2026/4/15 10:33:26</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Sync Conflicts
              </Button>
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white pt-4 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="fru-lenovo" className="px-4 py-1.5 text-sm">FRU - Lenovo PPN Conflict</TabsTrigger>
              <TabsTrigger value="fru-vendor" className="px-4 py-1.5 text-sm">FRU - Vendor PPN Conflict</TabsTrigger>
              <TabsTrigger value="lenovo-vendor" className="px-4 py-1.5 text-sm">Lenovo PPN - Vendor PPN Conflict</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Panel */}
        <div className="bg-white py-4 shrink-0">
          <div className="flex items-start gap-3">
            {/* Default Filters - Always Visible */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* FRU - Tags Input */}
              <TagsInput
                values={selectedFrus}
                onChange={setSelectedFrus}
                placeholder="FRU"
              />

              {/* Basic Name - Fuzzy Search */}
              <Input
                placeholder="Basic Name"
                value={basicNameSearch}
                onChange={(e) => setBasicNameSearch(e.target.value)}
                className="h-10"
              />

              {/* ODM - MultiSelect */}
              <MultiSelect
                options={odmOptions}
                selected={selectedOdms}
                onChange={setSelectedOdms}
                placeholder="ODM"
                searchPlaceholder="Search..."
              />

              {/* Status - MultiSelect */}
              <MultiSelect
                options={statusOptions}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
                placeholder="Status"
                searchPlaceholder="Search..."
              />
            </div>

            {/* Expand/Collapse Button */}
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

            {/* Column Settings */}
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="end">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Column Settings</p>
                  <p className="text-xs text-muted-foreground">Drag to reorder columns</p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={columns.map(col => col.key)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        {columns.filter(col => col.key !== "checkbox").map((col) => (
                          <SortableHeader
                            key={col.key}
                            column={col}
                            onToggleVisibility={toggleColumnVisibility}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Expanded Filters - Created Time */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <div className="mt-3 flex items-start gap-3">
                {/* Time Filters */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Created Time - Date Range */}
                  <DateRangePicker
                    value={createdTimeRange}
                    onChange={setCreatedTimeRange}
                    placeholder="Created Time"
                  />
                </div>
                {/* Spacer for buttons alignment */}
                <div className="h-10 w-10 shrink-0" />
                {hasActiveFilters && <div className="h-10 w-10 shrink-0" />}
                <div className="h-10 w-10 shrink-0" />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Batch Actions - Below Filter Panel */}
        <BatchActions
          selectedCount={selectedRows.length}
          onBatchResolve={handleBatchResolve}
        />

        {/* Table Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Table */}
          <div className="flex-1 border border-border rounded-2xl overflow-hidden">
            <div className="h-full overflow-auto">
              <div className="min-w-max">
                {/* Table Header - with drag and drop */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleTableDragEnd}
                >
                  <SortableContext
                    items={visibleColumns.map(col => col.key)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex bg-muted border-b sticky top-0 z-10">
                      {visibleColumns.map((col, index) => (
                        <SortableTableHeader
                          key={col.key}
                          column={col}
                          isFirst={index === 0}
                          checked={col.key === "checkbox" ? (currentData.length > 0 && selectedRows.length === currentData.length) : undefined}
                          onCheckedChange={col.key === "checkbox" ? toggleAllRows : undefined}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

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
                        {visibleColumns.map((col) => (
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t bg-card shrink-0 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total</span>
              <span className="font-semibold text-foreground">{totalRows}</span>
              {hasActiveFilters && (
                <span className="text-xs">(filtered from {allData.length})</span>
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
        </div>
      </div>

      {/* Resolved Dialog */}
      <ResolvedDialog
        open={resolvedDialogOpen}
        onOpenChange={(open) => {
          setResolvedDialogOpen(open)
          if (!open) {
            setIsBatchMode(false)
            setSelectedRowForResolve(null)
          }
        }}
        fru={isBatchMode ? `${selectedRowsForBatch.length} FRUs` : (selectedRowForResolve?.fru || "")}
        fruInfo={isBatchMode ? {
          fru: `${selectedRowsForBatch.length} FRUs selected`,
          fruDescription: "Batch Resolve Mode",
          lenovoPpnBasicName: selectedRowsForBatch.map(r => r.fru).join(", ").slice(0, 50) + (selectedRowsForBatch.length > 3 ? "..." : ""),
        } : (selectedRowForResolve ? {
          fru: selectedRowForResolve.fru,
          fruDescription: "System Board with CPU",
          lenovoPpnBasicName: selectedRowForResolve.lenovoPpnBasicName,
        } : undefined)}
        onConfirm={handleConfirmResolved}
        isBatchMode={isBatchMode}
        batchCount={isBatchMode ? selectedRowsForBatch.length : undefined}
      />

      {/* Batch Resolve Confirm Dialog */}
      <BatchResolveDialog
        open={batchResolveConfirmOpen}
        onOpenChange={setBatchResolveConfirmOpen}
        fruList={selectedRowsForBatch.map(r => r.fru)}
        onConfirm={handleConfirmBatchResolve}
      />

      {/* Revoke Dialog */}
      <RevokeDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        fru={selectedRowForRevoke?.fru || ""}
        onConfirm={handleConfirmRevoke}
      />
    </MainLayout>
  )
}
