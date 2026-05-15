"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface AuditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SubstitutionData | null
  onConfirm: (approved: boolean, notes: string) => void
  isBatchMode?: boolean
  batchCount?: number
}

export function AuditDialog({
  open,
  onOpenChange,
  data,
  onConfirm,
  isBatchMode,
  batchCount,
}: AuditDialogProps) {
  const [notes, setNotes] = useState("")
  const [decision, setDecision] = useState<"approve" | "reject" | null>("approve")
  const notesRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus notes textarea when reject is selected
  useEffect(() => {
    if (decision === "reject" && notesRef.current) {
      notesRef.current.focus()
    }
  }, [decision])

  const handleConfirm = () => {
    if (!decision) return
    onConfirm(decision === "approve", notes)
    setNotes("")
    setDecision("approve")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setNotes("")
    setDecision("approve")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isBatchMode ? `Batch Audit Substitution (${batchCount} items)` : "Audit Substitution"}
          </DialogTitle>
        </DialogHeader>

        {!isBatchMode && data && (
          <div className="flex-1 overflow-auto space-y-4">
            {/* Lenovo PPN Information */}
            <div className="bg-muted/50 rounded-lg px-4 py-3">
              <h4 className="text-sm font-semibold text-foreground mb-3">Lenovo PPN Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Lenovo PPN:</span>
                  <span className="font-medium font-mono">{data.lenovoPpn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium">{data.lenovoPpnDescription}</span>
                </div>
              </div>
            </div>

            {/* Substitute Lenovo PPN */}
            <div>
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
          </div>
        )}

        {/* Decision Section */}
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Decision
            </label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={decision === "approve" ? "default" : "outline"}
                size="lg"
                className={cn(
                  "min-w-[140px]",
                  decision === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                    : "border-2 hover:border-green-500 hover:text-green-600"
                )}
                onClick={() => setDecision("approve")}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Approve
              </Button>
              <Button
                type="button"
                variant={decision === "reject" ? "default" : "outline"}
                size="lg"
                className={cn(
                  "min-w-[140px]",
                  decision === "reject"
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                    : "border-2 hover:border-red-500 hover:text-red-600"
                )}
                onClick={() => setDecision("reject")}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">
              Notes {decision === "reject" && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              ref={notesRef}
              placeholder={decision === "reject" ? "Please provide reason for rejection..." : "Optional notes..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
              required={decision === "reject"}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!decision || (decision === "reject" && !notes.trim())}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
