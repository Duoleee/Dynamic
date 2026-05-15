"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// 详情数据类型
interface ViewDialogItem {
  id: string
  lenovoPpn: string
  description: string
  odm: string
  sources: string[]
  isNew: boolean
  qty: string
  source: string
}

// FRU 基本信息类型
interface FruInfo {
  fru: string
  fruDescription: string
  lenovoPpnBasicName: string
}

interface ConflictDetail {
  id: string
  fru: string
  lenovoPpnBasicName: string
  lenovoPpnConflictCount: string
  odm: string
  status: "Pending" | "Resolved" | "Revoke"
  createdTime: string
  auditor: string
  auditTime: string
  notes?: string
}

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ConflictDetail | null
}

// Mock 详情数据
const mockViewDialogData: ViewDialogItem[] = [
  {
    id: "1",
    lenovoPpn: "S670Q80231",
    description: "MECHANICAL NEW",
    odm: "LCFC",
    sources: ["master_data_basic.imp_odm_bom_ods"],
    isNew: true,
    qty: "1",
    source: "master_data_basic.imp_odm_bom_ods",
  },
  {
    id: "2",
    lenovoPpn: "S670Q80232",
    description: "BRACKET",
    odm: "LCFC",
    sources: ["master_data_basic.imp_odm_bom_ods"],
    isNew: true,
    qty: "2",
    source: "master_data_basic.imp_odm_bom_ods",
  },
  {
    id: "3",
    lenovoPpn: "V-PPN-999",
    description: "VENDOR PART",
    odm: "-",
    sources: ["idg_md_vendor_odm_material"],
    isNew: true,
    qty: "1",
    source: "idg_md_vendor_odm_material",
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
    qty: "1",
    source: "master_data.fru_bom_combine_change_ods",
  },
  {
    id: "5",
    lenovoPpn: "SM20R444-ALT",
    description: "MECHANICAL ALT",
    odm: "-",
    sources: ["master_data.fru_bom_combine_change_ods"],
    isNew: false,
    qty: "1",
    source: "master_data.fru_bom_combine_change_ods",
  },
]

export function ViewDialog({ open, onOpenChange, data }: ViewDialogProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Conflict Detail</DialogTitle>
        </DialogHeader>

        {/* FRU 基本信息 */}
        <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">FRU:</span>
              <span className="font-medium font-mono">{data.fru}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">ODM:</span>
              <span className="font-medium">{data.odm}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <span className={cn(
                "text-sm font-medium",
                data.status === "Pending" ? "text-blue-600" :
                data.status === "Resolved" ? "text-green-600" : "text-orange-600"
              )}>
                {data.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Lenovo PPN Basic Name:</span>
              <span className="font-medium">{data.lenovoPpnBasicName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Conflict Count:</span>
              <span className="font-medium">{data.lenovoPpnConflictCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Created Time:</span>
              <span className="font-medium">{data.createdTime}</span>
            </div>
            {data.auditor && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Auditor:</span>
                <span className="font-medium">{data.auditor}</span>
              </div>
            )}
            {data.auditTime && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Audit Time:</span>
                <span className="font-medium">{data.auditTime}</span>
              </div>
            )}
          </div>
          {data.notes && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground">Notes:</span>
                <span className="font-medium">{data.notes}</span>
              </div>
            </div>
          )}
        </div>

        {/* Lenovo PPN 列表 */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
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
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground">
                  Qty
                </th>
                <th className="px-4 py-3 border-b text-left text-xs font-semibold text-muted-foreground">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {mockViewDialogData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-muted/50"
                >
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
                    <span className="text-sm">{item.qty}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{item.source}</span>
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
