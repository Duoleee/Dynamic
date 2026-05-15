"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface BatchConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lenovoPpnList: string[]
  onConfirm: () => void
  type: "approve" | "reject"
}

export function BatchConfirmDialog({
  open,
  onOpenChange,
  lenovoPpnList,
  onConfirm,
  type,
}: BatchConfirmDialogProps) {
  const isApprove = type === "approve"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            {isApprove ? "Batch Approve Confirmation" : "Batch Reject Confirmation"}
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to {isApprove ? "approve" : "reject"} the following {lenovoPpnList.length} substitution(s)?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="max-h-32 overflow-y-auto rounded-md bg-muted p-3">
            <ul className="space-y-1">
              {lenovoPpnList.map((ppn) => (
                <li key={ppn} className="text-sm font-medium font-mono">
                  {ppn}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className={isApprove ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            Confirm {isApprove ? "Approve" : "Reject"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
