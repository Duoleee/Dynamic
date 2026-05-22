"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ResolvedDialog } from "../conflict-management/resolved-dialog"
import { BatchActions } from "../conflict-management/components/batch-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { RevokeDialog } from "../conflict-management/components/revoke-dialog"
import { ViewSheet } from "../conflict-management/components/view-sheet"

interface Column {
  key: string
  label: string
  width: number
  visible: boolean
}

interface ConflictData {
  id: string
  lenovoPpn: string
  lenovoPpnBasicName: string
  vendorPpnConflictCount: string
  odm: string
  status: "Pending" | "Resolved" | "Revoke"
  createdTime: string
  auditor: string
  auditTime: string
  revokeReason?: string
  notes?: string
}

const mockData: ConflictData[] = [
  {
    id: "1",
    lenovoPpn: "S670Q80231",
    lenovoPpnBasicName: "MECHANICAL",
    vendorPpnConflictCount: "3 records",
    odm: "LCFC",
    status: "Pending",
    createdTime: "2024-04-07 10:10",
    auditor: "",
    auditTime: "",
  },
  {
    id: "2",
    lenovoPpn: "S670Q80232",
    lenovoPpnBasicName: "BRACKET",
    vendorPpnConflictCount: "2 records",
    odm: "Wistron",
    status: "Resolved",
    createdTime: "2024-04-07 10:15",
    auditor: "Admin",
    auditTime: "2024-04-07 11:20",
  },
  {
    id: "3",
    lenovoPpn: "SM20R444",
    lenovoPpnBasicName: "MECHANICAL ALT",
    vendorPpnConflictCount: "5 records",
    odm: "Compal",
    status: "Revoke",
    createdTime: "2024-04-07 10:20",
    auditor: "Admin",
    auditTime: "2024-04-07 11:30",
    revokeReason: "Duplicate data",
  },
]

const odmOptions: MultiSelectOption[] = ["LCFC", "Wistron", "Compal", "Inventec", "Foxconn"].map(odm => ({
  value: odm,
  label: odm,
}))

const defaultColumns: Column[] = [
  { key: "checkbox", label: "", width: 50, visible: true },
  { key: "lenovoPpn", label: "Lenovo PPN", width: 140, visible: true },
  { key: "lenovoPpnBasicName", label: "Lenovo PPN Basic Name", width: 180, visible: true },
  { key: "vendorPpnConflictCount", label: "Vendor PPN Conflict Count", width: 200, visible: true },
  { key: "odm", label: "ODM", width: 120, visible: true },
  { key: "status", label: "Status", width: 180, visible: true },
  { key: "createdTime", label: "Created Time", width: 160, visible: true },
  { key: "auditor", label: "Auditor", width: 140, visible: true },
  { key: "auditTime", label: "Audit Time", width: 160, visible: true },
  { key: "actions", label: "Actions", width: 180, visible: true },
]

// Sortable header component for column settings
interface SortableHeaderProps {
  column: Column
  onToggleVisibility: (key: string) => void
}

function SortableHeader({ column, onToggleVisibility }: SortableHeaderProps) {
  const isCheckboxColumn = column.key === "checkbox"
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: column.key,
    disabled: isCheckboxColumn
  })

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
        "flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded select-none",
        !isCheckboxColumn && "cursor-pointer",
        isDragging && "bg-muted shadow-lg"
      )}
    >
      {!isCheckboxColumn && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
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
  disabled?: boolean
}

function SortableTableHeader({ column, isFirst, checked, onCheckedChange, disabled }: SortableTableHeaderProps) {
  const isCheckboxColumn = column.key === "checkbox"
  const isActionsColumn = column.key === "actions"
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: column.key,
    disabled: isCheckboxColumn || isActionsColumn
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isFirst ? 20 : isActionsColumn ? 30 : 10,
    width: column.width,
    position: isActionsColumn ? "sticky" : undefined,
    right: isActionsColumn ? 0 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center h-10 px-4 border-r shrink-0 bg-muted",
        !isCheckboxColumn && !isActionsColumn && "cursor-grab active:cursor-grabbing",
        isActionsColumn && "sticky right-0 border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
        isDragging && "bg-muted shadow-lg opacity-80"
      )}
      {...(!isCheckboxColumn && !isActionsColumn ? { ...attributes, ...listeners } : {})}
    >
      {isCheckboxColumn ? (
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      ) : (
        <span className={cn(
          "text-xs font-semibold text-muted-foreground tracking-wider truncate",
          isActionsColumn && "w-full text-center"
        )}>
          {column.label}
        </span>
      )}
    </div>
  )
}

export default function LenovoVendorConflictPage() {
  const router = useRouter()
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("lenovo-vendor")

  // Handle tab change with navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    switch (value) {
      case "fru-lenovo":
        router.push("/bom/conflict-management")
        break
      case "fru-vendor":
        router.push("/bom/fru-vendor-conflict")
        break
      case "lenovo-vendor":
        router.push("/bom/lenovo-vendor-conflict")
        break
    }
  }
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Dialog states
  const [resolvedDialogOpen, setResolvedDialogOpen] = useState(false)
  const [selectedRowForResolve, setSelectedRowForResolve] = useState<ConflictData | null>(null)
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedRowsForBatch, setSelectedRowsForBatch] = useState<ConflictData[]>([])
  const [batchResolveConfirmOpen, setBatchResolveConfirmOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedRowForRevoke, setSelectedRowForRevoke] = useState<ConflictData | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRowForView, setSelectedRowForView] = useState<ConflictData | null>(null)

  // Filter states
  const [selectedLenovoPpns, setSelectedLenovoPpns] = useState<string[]>([])
  const [basicNameSearch, setBasicNameSearch] = useState("")
  const [selectedOdms, setSelectedOdms] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("Pending")
  const [createdTimeRange, setCreatedTimeRange] = useState<DateRange | undefined>(undefined)
  const [auditTimeRange, setAuditTimeRange] = useState<DateRange | undefined>(undefined)
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false)
  
  const handleSyncConflicts = () => {
    setIsSyncing(true)
    
    setTimeout(() => {
      // Randomly simulate different sync outcomes
      const random = Math.random()
      if (random < 0.33) {
        toast.success("Data Sync successfully")
      } else if (random < 0.66) {
        toast.error("Data Sync failed: Network timeout")
      } else {
        toast.info("No new data to sync")
      }
      setIsSyncing(false)
    }, 5000)
  }

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
    return mockData.filter((row) => {
      if (selectedLenovoPpns.length > 0 && !selectedLenovoPpns.includes(row.lenovoPpn)) {
        return false
      }
      if (basicNameSearch && !row.lenovoPpnBasicName.toLowerCase().includes(basicNameSearch.toLowerCase())) {
        return false
      }
      if (selectedOdms.length > 0 && !selectedOdms.includes(row.odm)) {
        return false
      }
      if (selectedStatus && selectedStatus !== "All" && row.status !== selectedStatus) {
        return false
      }
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
      if (auditTimeRange?.from && row.auditTime) {
        const rowDate = new Date(row.auditTime)
        const fromDate = new Date(auditTimeRange.from)
        fromDate.setHours(0, 0, 0, 0)
        if (rowDate < fromDate) return false
        if (auditTimeRange.to) {
          const toDate = new Date(auditTimeRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (rowDate > toDate) return false
        }
      }
      return true
    })
  }, [selectedLenovoPpns, basicNameSearch, selectedOdms, selectedStatus, createdTimeRange, auditTimeRange])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLenovoPpns, basicNameSearch, selectedOdms, selectedStatus, createdTimeRange, auditTimeRange])

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
    setSelectedLenovoPpns([])
    setBasicNameSearch("")
    setSelectedOdms([])
    setSelectedStatus("Pending")
    setCreatedTimeRange(undefined)
    setAuditTimeRange(undefined)
  }

  // Check if any filter is active
  const hasActiveFilters = selectedLenovoPpns.length > 0 ||
    basicNameSearch ||
    selectedOdms.length > 0 ||
    (selectedStatus !== "Pending" && selectedStatus !== "All") ||
    createdTimeRange?.from ||
    auditTimeRange?.from

  // Handle open resolved dialog
  const handleOpenResolvedDialog = (row: ConflictData) => {
    setSelectedRowForResolve(row)
    setResolvedDialogOpen(true)
  }

  // Handle confirm resolved
  const handleConfirmResolved = (selectedIds: string[], notes: string) => {
    console.log("Resolved:", selectedRowForResolve?.lenovoPpn, "Selected IDs:", selectedIds, "Notes:", notes)
  }

  // Handle batch resolve
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
    console.log("Revoked:", selectedRowForRevoke?.lenovoPpn, "Notes:", notes)
    setSelectedRowForRevoke(null)
  }

  // Handle open view dialog
  const handleOpenViewDialog = (row: ConflictData) => {
    setSelectedRowForView(row)
    setViewDialogOpen(true)
  }

  const renderCellContent = (row: ConflictData, key: string) => {
    switch (key) {
      case "checkbox":
        return (
          <Checkbox
            checked={selectedRows.includes(row.id)}
            onCheckedChange={() => toggleRowSelection(row.id)}
            disabled={row.status !== "Pending"}
          />
        )
      case "lenovoPpn":
        return <span className="text-sm font-normal text-foreground font-mono">{row.lenovoPpn}</span>
      case "lenovoPpnBasicName":
        return <span className="text-sm font-normal text-foreground">{row.lenovoPpnBasicName}</span>
      case "vendorPpnConflictCount":
        return <span className="text-sm font-normal text-foreground">{row.vendorPpnConflictCount}</span>
      case "odm":
        return <span className="text-sm font-normal text-foreground">{row.odm}</span>
      case "status":
        return (
          <div className="flex flex-col gap-1">
            <span className={cn(
              "text-sm font-normal flex items-center gap-1.5",
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
            {row.revokeReason && (
              <span className="text-xs text-muted-foreground">{row.revokeReason}</span>
            )}
          </div>
        )
      case "createdTime":
        return <span className="text-sm font-normal text-muted-foreground">{row.createdTime}</span>
      case "auditor":
        return <span className="text-sm font-normal text-foreground">{row.auditor || "-"}</span>
      case "auditTime":
        return <span className="text-sm font-normal text-muted-foreground">{row.auditTime || "-"}</span>
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
                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => handleOpenViewDialog(row)}>
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => handleOpenRevokeDialog(row)}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Revoke
                </Button>
              </>
            )}
            {row.status === "Revoke" && (
              <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => handleOpenViewDialog(row)}>
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
        <div className="shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-foreground">Conflict Audit</h1>
              <span className="text-xs text-muted-foreground">Last Sync: 2026/4/15 10:33:26</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" className="gap-2" onClick={handleSyncConflicts} disabled={isSyncing}>
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
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
        <div className="pt-4 shrink-0">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="fru-lenovo" className="px-4 py-1.5 text-sm">FRU - Lenovo PPN Conflict</TabsTrigger>
              <TabsTrigger value="fru-vendor" className="px-4 py-1.5 text-sm">FRU - Vendor PPN Conflict</TabsTrigger>
              <TabsTrigger value="lenovo-vendor" className="px-4 py-1.5 text-sm">Lenovo PPN - Vendor PPN Conflict</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Panel */}
        <div className="py-4 shrink-0">
          <div className="flex items-start gap-3">
            {/* Basic Filters */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Lenovo PPN - Tags Input */}
              <TagsInput
                values={selectedLenovoPpns}
                onChange={setSelectedLenovoPpns}
                placeholder="Lenovo PPN"
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

              {/* Status - Single Select */}
              <Select value={selectedStatus} onValueChange={(value) => value && setSelectedStatus(value)}>
                <SelectTrigger className="!w-full !h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Revoke">Revoke</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Expanded Filters - Time Range Filters */}
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
                  {/* Audit Time - Date Range */}
                  <DateRangePicker
                    value={auditTimeRange}
                    onChange={setAuditTimeRange}
                    placeholder="Audit Time"
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
                          disabled={col.key === "checkbox" ? (selectedStatus !== "Pending" && selectedStatus !== "All") : undefined}
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
                    currentData.map((row) => (
                      <div
                        key={row.id}
                        className="flex border-b hover:bg-muted transition-colors bg-background"
                      >
                        {visibleColumns.map((col) => (
                          <div
                            key={col.key}
                            className={cn(
                              "flex items-center h-12 px-4 border-r shrink-0",
                              col.key === "actions" && "sticky right-0 border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10"
                            )}
                            style={{
                              width: col.width,
                              position: col.key === "actions" ? "sticky" : undefined,
                              right: col.key === "actions" ? 0 : undefined,
                              backgroundColor: col.key === "actions" ? "var(--background)" : undefined,
                            }}
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
                <span className="text-xs">(filtered from {mockData.length})</span>
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
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
        fru={isBatchMode ? `${selectedRowsForBatch.length} Lenovo PPNs` : (selectedRowForResolve?.lenovoPpn || "")}
        fruInfo={isBatchMode ? {
          fru: `${selectedRowsForBatch.length} Lenovo PPNs selected`,
          fruDescription: "Batch Resolve Mode",
          lenovoPpnBasicName: selectedRowsForBatch.map(r => r.lenovoPpn).join(", ").slice(0, 50) + (selectedRowsForBatch.length > 3 ? "..." : ""),
        } : (selectedRowForResolve ? {
          fru: selectedRowForResolve.lenovoPpn,
          fruDescription: "System Board with CPU",
          lenovoPpnBasicName: selectedRowForResolve.lenovoPpnBasicName,
        } : undefined)}
        onConfirm={handleConfirmResolved}
        isBatchMode={isBatchMode}
        batchCount={isBatchMode ? selectedRowsForBatch.length : undefined}
      />

      {/* Batch Resolve Confirm Dialog */}
      <ConfirmDialog
        open={batchResolveConfirmOpen}
        onOpenChange={setBatchResolveConfirmOpen}
        title="Confirm Batch Resolve"
        description={`Are you sure you want to resolve the following ${selectedRowsForBatch.length} conflict(s)?`}
        confirmText="Confirm"
        onConfirm={handleConfirmBatchResolve}
        children={
          <div className="max-h-32 overflow-y-auto rounded-md bg-muted p-3">
            <ul className="space-y-1">
              {selectedRowsForBatch.map((row) => (
                <li key={row.id} className="text-sm font-medium font-mono">
                  {row.lenovoPpn}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Revoke Dialog */}
      <RevokeDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        fru={selectedRowForRevoke?.lenovoPpn || ""}
        onConfirm={handleConfirmRevoke}
      />

      {/* View Sheet */}
      <ViewSheet
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        data={selectedRowForView}
      />
    </MainLayout>
  )
}
