"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"

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

interface ViewSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SubstitutionData | null
}

export function ViewSheet({
  open,
  onOpenChange,
  data,
}: ViewSheetProps) {
  if (!data) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Substitution Details</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          {/* 基本信息 */}
          <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Lenovo PPN:</span>
                <span className="font-medium font-mono">{data.lenovoPpn}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Description:</span>
                <span className="font-medium">{data.lenovoPpnDescription}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <div><StatusBadge status={data.status} /></div>
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
            <div className="mt-3 pt-3 border-t">
              {data.notes && (
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-muted-foreground">Notes:</span>
                  <span className="font-medium">{data.notes}</span>
                </div>
              )}
              {data.rejectReason && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">Reject Reason:</span>
                  <span className="font-medium text-red-600">{data.rejectReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Substitute Lenovo PPN 列表 */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground border-b">
                    Substitute Lenovo PPN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground border-b">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground border-b">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* New Substitute */}
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium font-mono">{data.substituteLenovoPpn}</span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs"
                      >
                        NEW
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{data.substituteLenovoPpnDescription}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                      {data.source}
                    </span>
                  </td>
                </tr>
                {/* Existing Substitutes */}
                {data.existingSubstitutes?.map((sub, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium font-mono">{sub.substituteLenovoPpn}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{sub.substituteLenovoPpnDescription}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {sub.source}
                      </span>
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
