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
  ChevronDown,
  Filter,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Column definition
interface Column {
  key: string
  label: string
  width: number
  visible: boolean
  required?: boolean
}

// Mock data for MT-FRU Management
interface MtFruData {
  id: string
  fru: string
  fruName: string
  commodityCode: string
  basicName: string
  name: string
  description: string
  mt: string
  productName: string
  productType: string
  brand: string
  segment: string
  series: string
  newRefresh: string
  ss: string
  changeType: string
  changeTime: string
  updateTime: string
  status: "current" | "history"
}

const mockData: MtFruData[] = [
  {
    id: "1",
    fru: "00HM169",
    fruName: "Motherboard Assembly",
    commodityCode: "CC001",
    basicName: "MB-ASM",
    name: "Motherboard Assembly Gen 5",
    description: "Main system board with Intel chipset",
    mt: "MT001",
    productName: "ThinkPad X1 Carbon",
    productType: "Laptop",
    brand: "ThinkPad",
    segment: "Premium",
    series: "X1",
    newRefresh: "New",
    ss: "SS01",
    changeType: "Add",
    changeTime: "2024-04-07 10:10:00",
    updateTime: "2024-04-07 10:10:00",
    status: "current",
  },
  {
    id: "2",
    fru: "00HM170",
    fruName: "Power Supply Unit",
    commodityCode: "CC002",
    basicName: "PSU-500W",
    name: "500W Power Supply",
    description: "High efficiency power supply unit",
    mt: "MT002",
    productName: "ThinkPad T14",
    productType: "Laptop",
    brand: "ThinkPad",
    segment: "Business",
    series: "T",
    newRefresh: "Refresh",
    ss: "SS02",
    changeType: "Modify",
    changeTime: "2024-04-07 09:15:00",
    updateTime: "2024-04-07 09:15:00",
    status: "current",
  },
  {
    id: "3",
    fru: "00HM171",
    fruName: "Memory Module 16GB",
    commodityCode: "CC003",
    basicName: "DDR4-16GB",
    name: "16GB DDR4 RAM",
    description: "High performance memory module",
    mt: "MT003",
    productName: "ThinkPad P1",
    productType: "Workstation",
    brand: "ThinkPad",
    segment: "Premium",
    series: "P",
    newRefresh: "New",
    ss: "SS03",
    changeType: "Add",
    changeTime: "2024-04-06 16:20:00",
    updateTime: "2024-04-06 16:20:00",
    status: "current",
  },
  {
    id: "4",
    fru: "00HM173",
    fruName: "SSD 512GB",
    commodityCode: "CC004",
    basicName: "SSD-512GB",
    name: "512GB NVMe SSD",
    description: "Fast NVMe storage drive",
    mt: "MT004",
    productName: "ThinkPad E14",
    productType: "Laptop",
    brand: "ThinkPad",
    segment: "Entry",
    series: "E",
    newRefresh: "Refresh",
    ss: "SS04",
    changeType: "Delete",
    changeTime: "2024-04-05 14:30:00",
    updateTime: "2024-04-05 14:30:00",
    status: "history",
  },
  {
    id: "5",
    fru: "00HN508",
    fruName: "WiFi Card",
    commodityCode: "CC005",
    basicName: "WIFI6-CARD",
    name: "WiFi 6 AX200",
    description: "Wireless network adapter",
    mt: "MT005",
    productName: "ThinkPad X13",
    productType: "Laptop",
    brand: "ThinkPad",
    segment: "Premium",
    series: "X",
    newRefresh: "New",
    ss: "SS05",
    changeType: "Add",
    changeTime: "2024-04-07 08:00:00",
    updateTime: "2024-04-07 08:00:00",
    status: "current",
  },
  {
    id: "6",
    fru: "00HM175",
    fruName: "CPU Processor",
    commodityCode: "CC006",
    basicName: "CPU-I7-12TH",
    name: "Intel Core i7-12700",
    description: "High performance processor",
    mt: "MT006",
    productName: "ThinkPad P15",
    productType: "Workstation",
    brand: "ThinkPad",
    segment: "Premium",
    series: "P",
    newRefresh: "New",
    ss: "SS06",
    changeType: "Modify",
    changeTime: "2024-04-04 11:20:00",
    updateTime: "2024-04-04 11:20:00",
    status: "history",
  },
  {
    id: "7",
    fru: "00HM176",
    fruName: "Cooling Fan",
    commodityCode: "CC007",
    basicName: "FAN-120MM",
    name: "120mm Cooling Fan",
    description: "High airflow cooling fan",
    mt: "MT007",
    productName: "ThinkPad L14",
    productType: "Laptop",
    brand: "ThinkPad",
    segment: "Business",
    series: "L",
    newRefresh: "Refresh",
    ss: "SS07",
    changeType: "Add",
    changeTime: "2024-04-07 07:30:00",
    updateTime: "2024-04-07 07:30:00",
    status: "current",
  },
  {
    id: "8",
    fru: "00HM177",
    fruName: "Graphics Card",
    commodityCode: "CC008",
    basicName: "GPU-RTX3060",
    name: "NVIDIA RTX 3060",
    description: "Dedicated graphics card",
    mt: "MT008",
    productName: "ThinkPad P17",
    productType: "Workstation",
    brand: "ThinkPad",
    segment: "Premium",
    series: "P",
    newRefresh: "New",
    ss: "SS08",
    changeType: "Modify",
    changeTime: "2024-04-03 15:45:00",
    updateTime: "2024-04-03 15:45:00",
    status: "history",
  },
  {
    id: "9",
    fru: "00HM178",
    fruName: "Keyboard",
    commodityCode: "CC009",
    basicName: "KB-US-ENG",
    name: "US English Keyboard",
    description: "Backlit keyboard with TrackPoint",
    mt: "MT009",
    productName: "ThinkPad X1 Yoga",
    productType: "2-in-1",
    brand: "ThinkPad",
    segment: "Premium",
    series: "X1",
    newRefresh: "Refresh",
    ss: "SS09",
    changeType: "Add",
    changeTime: "2024-04-07 06:15:00",
    updateTime: "2024-04-07 06:15:00",
    status: "current",
  },
  {
    id: "10",
    fru: "00HM179",
    fruName: "Display Panel",
    commodityCode: "CC010",
    basicName: "LCD-15.6FHD",
    name: "15.6 FHD Display",
    description: "Full HD IPS display panel",
    mt: "MT010",
    productName: "ThinkPad T15",
    productType: "Laptop",
    brand: "ThinkPad",
    segment: "Business",
    series: "T",
    newRefresh: "New",
    ss: "SS10",
    changeType: "Delete",
    changeTime: "2024-04-02 10:20:00",
    updateTime: "2024-04-02 10:20:00",
    status: "history",
  },
]

// Generate more mock data
const generateMoreData = (count: number): MtFruData[] => {
  const data: MtFruData[] = []
  const changeTypes = ["Add", "Modify", "Delete"]
  const brands = ["ThinkPad", "IdeaPad", "Legion"]
  const segments = ["Premium", "Business", "Entry"]
  const series = ["X1", "T", "X", "P", "E", "L", "Yoga"]
  const newRefresh = ["New", "Refresh"]
  const fruList = ["00HM169", "00HM170", "00HM171", "00HM173", "00HN508", "00HM175", "00HM176", "00HM177", "00HM178", "00HM179"]

  for (let i = 0; i < count; i++) {
    const idx = i % 10
    const isCurrent = i % 3 !== 0
    const date = new Date(2024, 3, 7 - (i % 10), 10 - (i % 10), i % 60, i % 60)
    data.push({
      id: `${i + 11}`,
      fru: fruList[idx],
      fruName: `Component ${i + 11}`,
      commodityCode: `CC${(i + 11).toString().padStart(3, "0")}`,
      basicName: `BASIC-${i + 11}`,
      name: `Component Name ${i + 11}`,
      description: `Description for component ${i + 11}`,
      mt: `MT${(i + 11).toString().padStart(3, "0")}`,
      productName: `Product ${i + 11}`,
      productType: i % 2 === 0 ? "Laptop" : "Workstation",
      brand: brands[i % 3],
      segment: segments[i % 3],
      series: series[i % 7],
      newRefresh: newRefresh[i % 2],
      ss: `SS${(i + 11).toString().padStart(2, "0")}`,
      changeType: changeTypes[i % 3],
      changeTime: date.toISOString().replace("T", " ").slice(0, 19),
      updateTime: date.toISOString().replace("T", " ").slice(0, 19),
      status: isCurrent ? "current" : "history",
    })
  }
  return data
}

const allData = [...mockData, ...generateMoreData(40)]

// Default columns - 按照要求的字段顺序
// required: true 表示不可隐藏的列
const defaultColumns: Column[] = [
  { key: "fru", label: "FRU", width: 110, visible: true, required: true },
  { key: "fruName", label: "FRU Name", width: 160, visible: true },
  { key: "commodityCode", label: "Commodity Code", width: 130, visible: true },
  { key: "basicName", label: "Basic Name", width: 130, visible: true },
  { key: "name", label: "Name", width: 180, visible: true },
  { key: "description", label: "Description", width: 220, visible: true },
  { key: "mt", label: "MT", width: 100, visible: true, required: true },
  { key: "productName", label: "Product Name", width: 160, visible: true },
  { key: "productType", label: "Product Type", width: 120, visible: true },
  { key: "brand", label: "Brand", width: 100, visible: true },
  { key: "segment", label: "Segment", width: 100, visible: true },
  { key: "series", label: "Series", width: 90, visible: true },
  { key: "newRefresh", label: "New Refresh", width: 100, visible: true },
  { key: "ss", label: "SS", width: 70, visible: true },
  { key: "changeType", label: "Change Type", width: 110, visible: true, required: true },
  { key: "changeTime", label: "Change Time", width: 150, visible: true, required: true },
]

// Filter options
const changeTypeOptions: MultiSelectOption[] = [
  { value: "Add", label: "Add" },
  { value: "Modify", label: "Modify" },
  { value: "Delete", label: "Delete" },
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
        isDragging && "bg-muted shadow-lg",
        column.required && "opacity-80"
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
        disabled={column.required}
      />
      <span className="text-sm flex-1">{column.label}</span>
      {column.required && (
        <span className="text-xs text-muted-foreground">Required</span>
      )}
    </div>
  )
}

// Sortable table header component
interface SortableTableHeaderProps {
  column: Column
  isFirst: boolean
}

function SortableTableHeader({ column, isFirst }: SortableTableHeaderProps) {
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
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
        {column.label}
      </span>
    </div>
  )
}

export default function MtFruManagementPage() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("fru-mt")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Status toggle: "current" | "all"
  const [statusView, setStatusView] = useState<"current" | "all">("current")

  // Filter states
  const [selectedFrus, setSelectedFrus] = useState<string[]>([])
  const [fruNameSearch, setFruNameSearch] = useState("")
  const [selectedMts, setSelectedMts] = useState<string[]>([])
  const [selectedChangeTypes, setSelectedChangeTypes] = useState<string[]>([])
  const [changeTimeRange, setChangeTimeRange] = useState<DateRange | undefined>(undefined)
  const [updateTimeRange, setUpdateTimeRange] = useState<DateRange | undefined>(undefined)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = allData.filter((row) => {
      // Status view filter
      if (statusView === "current" && row.status !== "current") {
        return false
      }

      // FRU filter
      if (selectedFrus.length > 0 && !selectedFrus.includes(row.fru)) {
        return false
      }

      // FRU Name filter (fuzzy search)
      if (fruNameSearch && !row.fruName.toLowerCase().includes(fruNameSearch.toLowerCase())) {
        return false
      }

      // MT filter
      if (selectedMts.length > 0 && !selectedMts.includes(row.mt)) {
        return false
      }

      // Change Type filter
      if (selectedChangeTypes.length > 0 && !selectedChangeTypes.includes(row.changeType)) {
        return false
      }

      // Change Time filter
      if (changeTimeRange?.from) {
        const rowDate = new Date(row.changeTime)
        const fromDate = new Date(changeTimeRange.from)
        fromDate.setHours(0, 0, 0, 0)

        if (rowDate < fromDate) return false

        if (changeTimeRange.to) {
          const toDate = new Date(changeTimeRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (rowDate > toDate) return false
        }
      }

      // Update Time filter
      if (updateTimeRange?.from) {
        const rowDate = new Date(row.updateTime)
        const fromDate = new Date(updateTimeRange.from)
        fromDate.setHours(0, 0, 0, 0)

        if (rowDate < fromDate) return false

        if (updateTimeRange.to) {
          const toDate = new Date(updateTimeRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (rowDate > toDate) return false
        }
      }

      return true
    })

    // Sort by changeTime desc
    result = result.sort((a, b) => {
      return new Date(b.changeTime).getTime() - new Date(a.changeTime).getTime()
    })

    return result
  }, [statusView, selectedFrus, fruNameSearch, selectedMts, selectedChangeTypes, changeTimeRange, updateTimeRange])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusView, selectedFrus, fruNameSearch, selectedMts, selectedChangeTypes, changeTimeRange, updateTimeRange])

  // Pagination
  const totalRows = filteredData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const currentData = filteredData.slice(startIndex, endIndex)

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setColumns(columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    ))
  }

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

  // Handle drag end for table header (same logic, updates all columns order)
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

  // Reset all filters
  const resetFilters = () => {
    setSelectedFrus([])
    setFruNameSearch("")
    setSelectedMts([])
    setSelectedChangeTypes([])
    setChangeTimeRange(undefined)
    setUpdateTimeRange(undefined)
  }

  // Check if any filter is active
  const hasActiveFilters = selectedFrus.length > 0 ||
    fruNameSearch ||
    selectedMts.length > 0 ||
    selectedChangeTypes.length > 0 ||
    changeTimeRange?.from ||
    updateTimeRange?.from

  // Check if expanded filters have values
  const hasExpandedFilterValues = selectedMts.length > 0 || updateTimeRange?.from

  // Render cell content
  const renderCellContent = (row: MtFruData, key: string) => {
    switch (key) {
      case "fru":
        return <span className="text-sm font-medium text-primary font-mono">{row.fru}</span>
      case "fruName":
        return <span className="text-sm text-foreground">{row.fruName}</span>
      case "commodityCode":
        return <span className="text-sm text-muted-foreground font-mono">{row.commodityCode}</span>
      case "basicName":
        return <span className="text-sm text-foreground">{row.basicName}</span>
      case "name":
        return <span className="text-sm text-foreground font-medium">{row.name}</span>
      case "description":
        return <span className="text-sm text-muted-foreground truncate max-w-[200px]" title={row.description}>{row.description}</span>
      case "mt":
        return <span className="text-sm font-medium text-primary font-mono">{row.mt}</span>
      case "productName":
        return <span className="text-sm text-foreground">{row.productName}</span>
      case "productType":
        return <span className="text-sm text-foreground">{row.productType}</span>
      case "brand":
        return <span className="text-sm text-foreground">{row.brand}</span>
      case "segment":
        return <span className="text-sm text-foreground">{row.segment}</span>
      case "series":
        return <span className="text-sm text-foreground">{row.series}</span>
      case "newRefresh":
        return (
          <span className={cn(
            "text-sm font-medium",
            row.newRefresh === "New" ? "text-emerald-600" : "text-blue-600"
          )}>
            {row.newRefresh}
          </span>
        )
      case "ss":
        return <span className="text-sm text-muted-foreground font-mono">{row.ss}</span>
      case "changeType":
        return (
          <span className={cn(
            "text-sm font-medium",
            row.changeType === "Add" ? "text-emerald-600" :
            row.changeType === "Modify" ? "text-blue-600" : "text-red-600"
          )}>
            {row.changeType}
          </span>
        )
      case "changeTime":
        return <span className="text-sm text-muted-foreground">{row.changeTime}</span>
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

        {/* Filter Panel */}
        <div className="bg-white py-4 shrink-0 space-y-3">
          {/* Default Filters - Always Visible (4 items) */}
          <div className="flex items-start gap-3">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* FRU - Tags Input */}
              <TagsInput
                values={selectedFrus}
                onChange={setSelectedFrus}
                placeholder="FRU"
              />

              {/* FRU Name - Fuzzy Search */}
              <Input
                placeholder="FRU Name"
                value={fruNameSearch}
                onChange={(e) => setFruNameSearch(e.target.value)}
                className="h-10"
              />

              {/* Change Type - MultiSelect */}
              <MultiSelect
                options={changeTypeOptions}
                selected={selectedChangeTypes}
                onChange={setSelectedChangeTypes}
                placeholder="Change Type"
                searchPlaceholder="Search..."
              />

              {/* Change Time - Date Range */}
              <DateRangePicker
                value={changeTimeRange}
                onChange={setChangeTimeRange}
                placeholder="Change Time"
              />
            </div>

            {/* Expand/Collapse Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                "h-10 w-10 shrink-0 transition-colors",
                (filtersOpen || hasExpandedFilterValues) && "bg-muted"
              )}
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
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-3">
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
                        {columns.map((col) => (
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

          {/* Expanded Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <div className="flex items-start gap-3 pt-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* MT - Tags Input */}
                  <TagsInput
                    values={selectedMts}
                    onChange={setSelectedMts}
                    placeholder="MT"
                  />

                  {/* Update Time - Date Range */}
                  <DateRangePicker
                    value={updateTimeRange}
                    onChange={setUpdateTimeRange}
                    placeholder="Update Time"
                  />

                  {/* Data Filtering - Status Select */}
                  <Select value={statusView} onValueChange={(v) => setStatusView(v as "current" | "all")}>
                    <SelectTrigger className="!w-full !h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <SelectValue>
                        {statusView === "current" ? "Current Status" : "All History"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Status</SelectItem>
                      <SelectItem value="all">All History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Spacer for alignment */}
                <div className="h-10 w-10 shrink-0" />
                {hasActiveFilters && <div className="h-10 w-10 shrink-0" />}
                <div className="h-10 w-10 shrink-0" />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

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
                        {visibleColumns.map((col, colIndex) => (
                          <div
                            key={col.key}
                            className={cn(
                              "flex items-center h-12 px-4 border-r shrink-0",
                              colIndex === 0 && "sticky left-0 z-10 bg-background"
                            )}
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
