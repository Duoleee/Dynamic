"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Eye } from "lucide-react"

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
  existingSubstitutes?: ExistingSubstitute[]
}

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SubstitutionData | null
}

export function ViewDialog({
  open,
  onOpenChange,
  data,
}: ViewDialogProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5 text-primary" />
            Substitution Details
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Lenovo PPN Information */}
          <div className="bg-muted/50 rounded-lg px-4 py-3">
            <h4 className="text-sm font-semibold text-foreground mb-3">Lenovo PPN Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Lenovo PPN:</span>
                <p className="font-medium font-mono mt-1">{data.lenovoPpn}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>
                <p className="font-medium mt-1">{data.lenovoPpnDescription}</p>
              </div>
            </div>
          </div>

          {/* Substitute Lenovo PPN Table */}
          <div className="bg-muted/50 rounded-lg px-4 py-3">
            <h4 className="text-sm font-semibold text-foreground mb-3">Substitute Lenovo PPN</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground border-b">
                      Substitute Lenovo PPN
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground border-b">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground border-b">
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

          {/* Audit Information */}
          <div className="bg-muted/50 rounded-lg px-4 py-3">
            <h4 className="text-sm font-semibold text-foreground mb-3">Audit Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1"><StatusBadge status={data.status} /></div>
                </div>
              <div>
                <span className="text-muted-foreground">Created Time:</span>
                <p className="font-medium mt-1">{data.createdTime}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Auditor:</span>
                <p className="font-medium mt-1">{data.auditor || "-"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Audit Time:</span>
                <p className="font-medium mt-1">{data.auditTime || "-"}</p>
              </div>
              {data.rejectReason && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Reject Reason:</span>
                  <p className="font-medium mt-1 text-red-600 bg-red-50 px-3 py-2 rounded-md">{data.rejectReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
