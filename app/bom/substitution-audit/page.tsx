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
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AuditDialog } from "./components/audit-dialog"
import { BatchActions } from "@/components/ui/batch-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { RevokeDialog } from "./components/revoke-dialog"
import { ViewSheet } from "./components/view-sheet"
import { toast } from "sonner"

interface Column {
  key: string
  label: string
  width: number
  visible: boolean
}

interface ExistingSubstitute {
  substituteLenovoPpn: string
  substituteLenovoPpnDescription: string
  source: string
}

interface SubstitutionData {
  id: string
  lenovoPpn: string
  lenovoPpnDescription: string
  substituteLenovoPpn: string
  substituteLenovoPpnDescription: string
  source: string
  status: "Pending" | "Confirmed" | "Rejected"
  rejectReason?: string
  createdTime: string
  auditor: string
  auditTime: string
  notes?: string
  existingSubstitutes?: ExistingSubstitute[]
}

const mockData: SubstitutionData[] = [
  {
    id: "1",
    lenovoPpn: "S670Q80231",
    lenovoPpnDescription: "MECHANICAL NEW",
    substituteLenovoPpn: "S670Q80232",
    substituteLenovoPpnDescription: "MECHANICAL ALT",
    source: "master_data_basic.imp_odm_bom_ods",
    status: "Pending",
    createdTime: "2024-04-07 10:10",
    auditor: "",
    auditTime: "",
    existingSubstitutes: [
      {
        substituteLenovoPpn: "S670Q80230",
        substituteLenovoPpnDescription: "MECHANICAL OLD",
        source: "master_data_basic.imp_odm_bom_ods",
      },
    ],
  },
  {
    id: "2",
    lenovoPpn: "SM20R444",
    lenovoPpnDescription: "BRACKET",
    substituteLenovoPpn: "SM20R445",
    substituteLenovoPpnDescription: "BRACKET ALT",
    source: "idg_md_vendor_odm_material",
    status: "Pending",
    createdTime: "2024-04-07 10:15",
    auditor: "",
    auditTime: "",
  },
  {
    id: "3",
    lenovoPpn: "00HM169",
    lenovoPpnDescription: "System Board",
    substituteLenovoPpn: "00HM170",
    substituteLenovoPpnDescription: "System Board V2",
    source: "master_data.fru_bom_combine_change_ods",
    status: "Confirmed",
    createdTime: "2024-04-07 10:20",
    auditor: "Current User",
    auditTime: "2024-04-07 11:00",
    notes: "Confirmed substitution after verifying compatibility",
  },
  {
    id: "4",
    lenovoPpn: "00HN508",
    lenovoPpnDescription: "VRAM",
    substituteLenovoPpn: "00HN509",
    substituteLenovoPpnDescription: "VRAM V2",
    source: "LCFC",
    status: "Rejected",
    rejectReason: "Invalid substitution relationship",
    createdTime: "2024-04-07 10:30",
    auditor: "Current User",
    auditTime: "2024-04-07 12:00",
  },
  {
    id: "5",
    lenovoPpn: "00HM171",
    lenovoPpnDescription: "MEMORY",
    substituteLenovoPpn: "00HM172",
    substituteLenovoPpnDescription: "MEMORY ALT",
    source: "Wistron",
    status: "Pending",
    createdTime: "2024-04-07 10:35",
    auditor: "",
    auditTime: "",
  },
  {
    id: "6",
    lenovoPpn: "00HM173",
    lenovoPpnDescription: "CABLE",
    substituteLenovoPpn: "00HM174",
    substituteLenovoPpnDescription: "CABLE ALT",
    source: "Compal",
    status: "Confirmed",
    createdTime: "2024-04-07 10:40",
    auditor: "Current User",
    auditTime: "2024-04-07 11:30",
  },
]

const generateMoreData = (count: number): SubstitutionData[] => {
  const data: SubstitutionData[] = []
  const sources = ["LCFC", "Wistron", "Compal", "Inventec", "Foxconn", "master_data_basic.imp_odm_bom_ods", "idg_md_vendor_odm_material"]
  const statuses: ("Pending" | "Confirmed" | "Rejected")[] = ["Pending", "Confirmed", "Rejected"]
  const descriptions = ["MECHANICAL", "BDPLANAR", "MEMORY", "VRAM", "CABLE", "SSD", "HDD", "WIFI"]

  for (let i = 0; i < count; i++) {
    const idx = i % 6
    const status = statuses[idx % 3]
    data.push({
      id: `${i + 7}`,
      lenovoPpn: `S670Q${(80240 + i).toString().padStart(5, "0")}`,
      lenovoPpnDescription: descriptions[idx % descriptions.length],
      substituteLenovoPpn: `S670Q${(80250 + i).toString().padStart(5, "0")}`,
      substituteLenovoPpnDescription: `${descriptions[idx % descriptions.length]} ALT`,
      source: sources[idx % sources.length],
      status: status,
      rejectReason: status === "Rejected" ? "Invalid substitution relationship" : undefined,
      createdTime: "2024-04-07 10:" + (10 + i).toString().padStart(2, "0"),
      auditor: idx % 3 === 0 ? "" : "Current User",
      auditTime: idx % 3 === 0 ? "" : "2024-04-07 11:" + (20 + i).toString().padStart(2, "0"),
    })
  }
  return data
}

const allData = [...mockData, ...generateMoreData(20)]

// Filter options
const sourceOptions: MultiSelectOption[] = [
  "LCFC",
  "Wistron",
  "Compal",
  "Inventec",
  "Foxconn",
  "master_data_basic.imp_odm_bom_ods",
  "idg_md_vendor_odm_material",
  "master_data.fru_bom_combine_change_ods",
].map(source => ({
  value: source,
  label: source,
}))

const statusOptions: MultiSelectOption[] = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Rejected", label: "Rejected" },
]

const defaultColumns: Column[] = [
  { key: "checkbox", label: "", width: 50, visible: true },
  { key: "lenovoPpn", label: "Lenovo PPN", width: 140, visible: true },
  { key: "lenovoPpnDescription", label: "Lenovo PPN Description", width: 180, visible: true },
  { key: "substituteLenovoPpn", label: "Substitute Lenovo PPN", width: 160, visible: true },
  { key: "substituteLenovoPpnDescription", label: "Substitute Lenovo PPN Description", width: 220, visible: true },
  { key: "source", label: "Source", width: 240, visible: true },
  { key: "status", label: "Status", width: 140, visible: true },
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
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: () => void
}

function SortableTableHeader({ column, checked, indeterminate, onCheckedChange }: SortableTableHeaderProps) {
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
    disabled: isCheckboxColumn || isActionsColumn,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isActionsColumn ? 30 : 10,
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
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
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

export default function SubstitutionAuditPage() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Audit Dialog states
  const [auditDialogOpen, setAuditDialogOpen] = useState(false)
  const [selectedRowForAudit, setSelectedRowForAudit] = useState<SubstitutionData | null>(null)
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedRowsForBatch, setSelectedRowsForBatch] = useState<SubstitutionData[]>([])

  // Batch Confirm Dialog states
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false)
  const [batchConfirmType, setBatchConfirmType] = useState<"approve" | "reject">("approve")

  // Revoke Dialog state
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedRowForRevoke, setSelectedRowForRevoke] = useState<SubstitutionData | null>(null)

  // View Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRowForView, setSelectedRowForView] = useState<SubstitutionData | null>(null)

  // Filter states
  const [selectedLenovoPpns, setSelectedLenovoPpns] = useState<string[]>([])
  const [selectedSubstitutePpns, setSelectedSubstitutePpns] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [createdTimeRange, setCreatedTimeRange] = useState<DateRange | undefined>(undefined)
  const [auditTimeRange, setAuditTimeRange] = useState<DateRange | undefined>(undefined)

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
      // Lenovo PPN filter
      if (selectedLenovoPpns.length > 0 && !selectedLenovoPpns.includes(row.lenovoPpn)) {
        return false
      }

      // Substitute Lenovo PPN filter
      if (selectedSubstitutePpns.length > 0 && !selectedSubstitutePpns.includes(row.substituteLenovoPpn)) {
        return false
      }

      // Source filter
      if (selectedSources.length > 0 && !selectedSources.includes(row.source)) {
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

      // Audit Time filter
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
  }, [selectedLenovoPpns, selectedSubstitutePpns, selectedSources, selectedStatuses, createdTimeRange, auditTimeRange])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLenovoPpns, selectedSubstitutePpns, selectedSources, selectedStatuses, createdTimeRange, auditTimeRange])

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

  // 计算当前页可选的行（只计算 Pending 状态的）
  const selectableRows = useMemo(() => {
    return currentData.filter(row => row.status === "Pending")
  }, [currentData])

  // 计算已选择的行（只计算在 selectableRows 中的）
  const selectedSelectableRows = useMemo(() => {
    return selectableRows.filter(row => selectedRows.includes(row.id))
  }, [selectableRows, selectedRows])

  const toggleAllRows = () => {
    if (selectedSelectableRows.length === selectableRows.length) {
      // 取消全选：只取消当前页可选的行
      setSelectedRows(prev => prev.filter(id => !selectableRows.some(row => row.id === id)))
    } else {
      // 全选：将当前页可选的行全部添加进去
      const selectableIds = selectableRows.map(row => row.id)
      setSelectedRows(prev => [...new Set([...prev, ...selectableIds])])
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedLenovoPpns([])
    setSelectedSubstitutePpns([])
    setSelectedSources([])
    setSelectedStatuses([])
    setCreatedTimeRange(undefined)
    setAuditTimeRange(undefined)
  }

  // Check if any filter is active
  const hasActiveFilters = selectedLenovoPpns.length > 0 ||
    selectedSubstitutePpns.length > 0 ||
    selectedSources.length > 0 ||
    selectedStatuses.length > 0 ||
    createdTimeRange?.from ||
    auditTimeRange?.from

  // Handle open audit dialog
  const handleOpenAuditDialog = (row: SubstitutionData) => {
    setSelectedRowForAudit(row)
    setAuditDialogOpen(true)
  }

  // Handle confirm audit
  const handleConfirmAudit = (approved: boolean, notes: string) => {
    if (isBatchMode) {
      const count = selectedRowsForBatch.length
      console.log("Batch Audit:", selectedRowsForBatch.map(r => r.lenovoPpn), "Approved:", approved, "Notes:", notes)
      if (approved) {
        toast.success("Substitutions approved successfully", {
          description: `Successfully approved ${count} substitution(s)`,
          icon: "✓",
        })
      } else {
        toast.error("Substitutions rejected", {
          description: `Successfully rejected ${count} substitution(s)`,
          icon: "✕",
        })
      }
      setSelectedRows([])
      setSelectedRowsForBatch([])
      setIsBatchMode(false)
    } else {
      console.log("Audit:", selectedRowForAudit?.lenovoPpn, "Approved:", approved, "Notes:", notes)
      if (approved) {
        toast.success("Substitution approved successfully", {
          description: `Lenovo PPN: ${selectedRowForAudit?.lenovoPpn}`,
          icon: "✓",
        })
      } else {
        toast.error("Substitution rejected", {
          description: `Lenovo PPN: ${selectedRowForAudit?.lenovoPpn}`,
          icon: "✕",
        })
      }
    }
  }

  // Handle batch approve - open confirm dialog
  const handleBatchApprove = () => {
    const selectedData = filteredData.filter(row => selectedRows.includes(row.id))
    setSelectedRowsForBatch(selectedData)
    setBatchConfirmType("approve")
    setBatchConfirmOpen(true)
  }

  // Handle batch reject - open confirm dialog
  const handleBatchReject = () => {
    const selectedData = filteredData.filter(row => selectedRows.includes(row.id))
    setSelectedRowsForBatch(selectedData)
    setBatchConfirmType("reject")
    setBatchConfirmOpen(true)
  }

  // Handle confirm batch action
  const handleConfirmBatchAction = () => {
    setBatchConfirmOpen(false)
    setIsBatchMode(true)
    setAuditDialogOpen(true)
  }

  // Handle open revoke dialog
  const handleOpenRevokeDialog = (row: SubstitutionData) => {
    setSelectedRowForRevoke(row)
    setRevokeDialogOpen(true)
  }

  // Handle confirm revoke
  const handleConfirmRevoke = (notes: string) => {
    console.log("Revoked:", selectedRowForRevoke?.lenovoPpn, "Notes:", notes)
    setSelectedRowForRevoke(null)
  }

  // Handle open view dialog
  const handleOpenViewDialog = (row: SubstitutionData) => {
    setSelectedRowForView(row)
    setViewDialogOpen(true)
  }

  const renderCellContent = (row: SubstitutionData, key: string) => {
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
      case "lenovoPpnDescription":
        return <span className="text-sm font-normal text-foreground">{row.lenovoPpnDescription}</span>
      case "substituteLenovoPpn":
        return <span className="text-sm font-normal text-foreground font-mono">{row.substituteLenovoPpn}</span>
      case "substituteLenovoPpnDescription":
        return <span className="text-sm font-normal text-foreground">{row.substituteLenovoPpnDescription}</span>
      case "source":
        return <span className="text-sm font-normal text-muted-foreground truncate" title={row.source}>{row.source}</span>
      case "status":
        return (
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-normal flex items-center gap-1.5",
              row.status === "Pending" ? "text-blue-600" :
              row.status === "Confirmed" ? "text-green-600" : "text-red-600"
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full",
                row.status === "Pending" ? "bg-blue-600" :
                row.status === "Confirmed" ? "bg-green-600" : "bg-red-600"
              )} />
              {row.status}
            </span>
            {row.status === "Rejected" && row.rejectReason && (
              <div className="group relative">
                <Info className="h-4 w-4 text-red-500 cursor-help" />
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {row.rejectReason}
                </div>
              </div>
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
              <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => handleOpenAuditDialog(row)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Audit
              </Button>
            )}
            {(row.status === "Confirmed" || row.status === "Rejected") && (
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
              <h1 className="text-xl font-semibold text-foreground">Substitution Audit</h1>
              <span className="text-xs text-muted-foreground">Last Sync: 2026/4/15 10:33:26</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Sync from System
              </Button>
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="py-4 shrink-0">
          <div className="flex items-start gap-3">
            {/* Default Filters - Always Visible */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Lenovo PPN - Tags Input */}
              <TagsInput
                values={selectedLenovoPpns}
                onChange={setSelectedLenovoPpns}
                placeholder="Lenovo PPN"
              />

              {/* Substitute Lenovo PPN - Tags Input */}
              <TagsInput
                values={selectedSubstitutePpns}
                onChange={setSelectedSubstitutePpns}
                placeholder="Substitute Lenovo PPN"
              />

              {/* Source - MultiSelect */}
              <MultiSelect
                options={sourceOptions}
                selected={selectedSources}
                onChange={setSelectedSources}
                placeholder="Source"
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

          {/* Expanded Filters - Created Time & Audit Time */}
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
          label="selected"
          className="py-2"
          actions={[
            {
              key: "approve",
              label: "Batch Approve",
              icon: <CheckCircle2 className="h-3.5 w-3.5" />,
              onClick: handleBatchApprove,
              variant: "outline",
              className: "h-8 gap-1.5 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700",
            },
            {
              key: "reject",
              label: "Batch Reject",
              icon: <Info className="h-3.5 w-3.5" />,
              onClick: handleBatchReject,
              variant: "outline",
              className: "h-8 gap-1.5 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700",
            },
          ]}
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
                      {visibleColumns.map((col) => (
                        <SortableTableHeader
                    key={col.key}
                    column={col}
                    checked={col.key === "checkbox" ? (selectableRows.length > 0 && selectedSelectableRows.length === selectableRows.length) : undefined}
                    indeterminate={col.key === "checkbox" ? (selectableRows.length > 0 && selectedSelectableRows.length > 0 && selectedSelectableRows.length < selectableRows.length) : undefined}
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

      {/* Audit Dialog */}
      <AuditDialog
        open={auditDialogOpen}
        onOpenChange={(open) => {
          setAuditDialogOpen(open)
          if (!open) {
            setIsBatchMode(false)
            setSelectedRowForAudit(null)
          }
        }}
        data={selectedRowForAudit}
        onConfirm={handleConfirmAudit}
        isBatchMode={isBatchMode}
        batchCount={selectedRowsForBatch.length}
      />

      {/* Batch Confirm Dialog */}
      <ConfirmDialog
        open={batchConfirmOpen}
        onOpenChange={setBatchConfirmOpen}
        title={batchConfirmType === "approve" ? "Batch Approve Confirmation" : "Batch Reject Confirmation"}
        description={`Are you sure you want to ${batchConfirmType === "approve" ? "approve" : "reject"} the following ${selectedRowsForBatch.length} substitution(s)?`}
        confirmText={batchConfirmType === "approve" ? "Confirm Approve" : "Confirm Reject"}
        type={batchConfirmType === "approve" ? "default" : "destructive"}
        onConfirm={handleConfirmBatchAction}
      />

      {/* Revoke Dialog */}
      <RevokeDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        lenovoPpn={selectedRowForRevoke?.lenovoPpn || ""}
        substitutePpn={selectedRowForRevoke?.substituteLenovoPpn || ""}
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
