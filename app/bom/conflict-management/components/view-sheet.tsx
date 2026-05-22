"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
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
  fru?: string
  lenovoPpn?: string
  lenovoPpnBasicName: string
  lenovoPpnConflictCount?: string
  vendorPpnConflictCount?: string
  odm: string
  status: "Pending" | "Resolved" | "Revoke"
  createdTime: string
  auditor: string
  auditTime: string
  notes?: string
  revokeReason?: string
}

interface ViewSheetProps {
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

export function ViewSheet({ open, onOpenChange, data }: ViewSheetProps) {
  if (!data) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Conflict Detail</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          {/* 基本信息 */}
          <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {data.fru && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">FRU:</span>
                  <span className="font-medium font-mono">{data.fru}</span>
                </div>
              )}
              {data.lenovoPpn && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Lenovo PPN:</span>
                  <span className="font-medium font-mono">{data.lenovoPpn}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">FRU Description:</span>
                <span className="font-medium">{data.odm}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <div><StatusBadge status={data.status} /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Lenovo PPN Basic Name:</span>
                <span className="font-medium">{data.lenovoPpnBasicName}</span>
              </div>
              {data.lenovoPpnConflictCount && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Lenovo PPN Conflict Count:</span>
                  <span className="font-medium">{data.lenovoPpnConflictCount}</span>
                </div>
              )}
              {data.vendorPpnConflictCount && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Vendor PPN Conflict Count:</span>
                  <span className="font-medium">{data.vendorPpnConflictCount}</span>
                </div>
              )}
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
            <div className="mt-3 pt-3 border-t">
              {data.notes && (
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-muted-foreground">Notes:</span>
                  <span className="font-medium">{data.notes}</span>
                </div>
              )}
              {data.revokeReason && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">Revoke Reason:</span>
                  <span className="font-medium text-red-600">{data.revokeReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Lenovo PPN 列表 */}
          <div className="border rounded-lg overflow-hidden">
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
                    FRU Description
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
