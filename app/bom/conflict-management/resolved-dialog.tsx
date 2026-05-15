"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// QTY 选项类型
interface QtyOption {
  value: string
  label: string
  source: string
}

// 弹窗表格数据类型
interface ResolvedDialogItem {
  id: string
  lenovoPpn: string
  description: string
  odm: string
  sources: string[]
  isNew: boolean
  qtyOptions: QtyOption[]
}

// FRU 基本信息类型
interface FruInfo {
  fru: string
  fruDescription: string
  lenovoPpnBasicName: string
}

interface ResolvedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fru: string
  fruInfo?: FruInfo
  onConfirm: (selectedIds: string[], notes: string) => void
  isBatchMode?: boolean
  batchCount?: number
}

// Mock 数据
const mockDialogData: ResolvedDialogItem[] = [
  {
    id: "1",
    lenovoPpn: "S670Q80231",
    description: "MECHANICAL NEW",
    odm: "LCFC",
    sources: ["master_data_basic.imp_odm_bom_ods"],
    isNew: true,
    qtyOptions: [{ value: "1", label: "Qty: 1", source: "master_data_basic.imp_odm_bom_ods" }],
  },
  {
    id: "2",
    lenovoPpn: "S670Q80232",
    description: "BRACKET",
    odm: "LCFC",
    sources: ["master_data_basic.imp_odm_bom_ods"],
    isNew: true,
    qtyOptions: [{ value: "2", label: "Qty: 2", source: "master_data_basic.imp_odm_bom_ods" }],
  },
  {
    id: "3",
    lenovoPpn: "V-PPN-999",
    description: "VENDOR PART",
    odm: "-",
    sources: ["idg_md_vendor_odm_material"],
    isNew: true,
    qtyOptions: [{ value: "1", label: "Qty: 1", source: "idg_md_vendor_odm_material" }],
  },
  {
    id: "4",
    lenovoPpn: "SM20R444",
    description: "MECHANICAL",
    odm: "-",
    sources: [
      "master_data.fru_bom_combine_change_ods",
      "master_data_basic.imp_odm_bom_ods",
      "idg_md_vendor_odm_material",
    ],
    isNew: false,
    qtyOptions: [
      { value: "1", label: "Qty: 1", source: "master_data.fru_bom_combine_change_ods" },
      { value: "2", label: "Qty: 2", source: "master_data_basic.imp_odm_bom_ods" },
    ],
  },
  {
    id: "5",
    lenovoPpn: "SM20R444-ALT",
    description: "MECHANICAL ALT",
    odm: "-",
    sources: ["master_data.fru_bom_combine_change_ods"],
    isNew: false,
    qtyOptions: [{ value: "1", label: "Qty: 1", source: "master_data.fru_bom_combine_change_ods" }],
  },
]

// Mock FRU 信息
const mockFruInfo: FruInfo = {
  fru: "00HM169",
  fruDescription: "System Board with CPU",
  lenovoPpnBasicName: "MECHANICAL",
}

export function ResolvedDialog({ open, onOpenChange, fru, fruInfo, onConfirm, isBatchMode, batchCount }: ResolvedDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedQtyMap, setSelectedQtyMap] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState("")

  // 使用传入的 fruInfo 或 mock 数据
  const currentFruInfo = fruInfo || { ...mockFruInfo, fru }

  // 获取已有项（非新增项）
  const existingItems = useMemo(() => {
    return mockDialogData.filter((item) => !item.isNew)
  }, [])

  // 弹窗打开时，为已有项设置默认 QTY（第一个选项）并默认勾选非new项
  useEffect(() => {
    if (open) {
      const defaultQtyMap: Record<string, string> = {}
      const defaultSelectedIds: string[] = []
      
      existingItems.forEach((item) => {
        // 默认勾选非new项
        defaultSelectedIds.push(item.id)
        // 为已有项设置默认 QTY（第一个选项）
        if (item.qtyOptions.length > 0) {
          defaultQtyMap[item.id] = item.qtyOptions[0].value
        }
      })
      
      setSelectedIds(defaultSelectedIds)
      setSelectedQtyMap(defaultQtyMap)
    }
  }, [open, existingItems])

  // 检查是否所有已有项都选择了 QTY
  const allExistingItemsHaveQty = useMemo(() => {
    return existingItems.every((item) => selectedQtyMap[item.id])
  }, [existingItems, selectedQtyMap])

  // Confirm 按钮是否禁用
  const isConfirmDisabled = selectedIds.length === 0 || !allExistingItemsHaveQty

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === mockDialogData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(mockDialogData.map((item) => item.id))
    }
  }

  const handleQtyChange = (itemId: string, qty: string | null) => {
    if (qty) {
      setSelectedQtyMap((prev) => ({ ...prev, [itemId]: qty }))
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedIds, notes)
    // 重置状态
    setSelectedIds([])
    setSelectedQtyMap({})
    setNotes("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedIds([])
    setSelectedQtyMap({})
    setNotes("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isBatchMode ? `Batch Resolve Conflict (${batchCount} items)` : "Resolve Conflict"}</DialogTitle>
        </DialogHeader>

        {/* FRU 基本信息 */}
        <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{isBatchMode ? "Selected:" : "FRU:"}</span>
              <span className="font-medium font-mono">{currentFruInfo.fru}</span>
            </div>
            {!isBatchMode && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">FRU Description:</span>
                  <span className="font-medium">{currentFruInfo.fruDescription}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Lenovo PPN Basic Name:</span>
                  <span className="font-medium">{currentFruInfo.lenovoPpnBasicName}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="w-12 px-4 py-3 border-b">
                  <Checkbox
                    checked={
                      selectedIds.length === mockDialogData.length &&
                      mockDialogData.length > 0
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < mockDialogData.length
                    }
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground">
                  Lenovo PPN
                </th>
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground">
                  ODM
                </th>
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground">
                  Sources
                </th>
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground w-48">
                  Qty (Source)
                </th>
              </tr>
            </thead>
            <tbody>
              {mockDialogData.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b hover:bg-muted/50",
                    selectedIds.includes(item.id) && "bg-muted/30"
                  )}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={item.isNew ? selectedIds.includes(item.id) : true}
                      onCheckedChange={() => item.isNew && toggleSelection(item.id)}
                      disabled={!item.isNew}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium font-mono">
                        {item.lenovoPpn}
                      </span>
                      {item.isNew && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs"
                        >
                          NEW
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{item.description}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{item.odm}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.sources.map((source, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {item.isNew ? (
                      <span className="text-sm text-muted-foreground">
                        {item.qtyOptions[0]?.label || "-"}
                      </span>
                    ) : (
                      <Select
                        value={selectedQtyMap[item.id] || ""}
                        onValueChange={(value) => handleQtyChange(item.id, value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-40 text-xs",
                            !selectedQtyMap[item.id] &&
                              "border-destructive text-destructive"
                          )}
                        >
                          <SelectValue placeholder="Please Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {item.qtyOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-xs"
                            >
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.source}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Notes</label>
          <Textarea
            placeholder="Enter notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirmDisabled}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
