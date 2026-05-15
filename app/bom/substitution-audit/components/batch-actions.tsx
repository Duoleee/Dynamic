"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface BatchActionsProps {
  selectedCount: number
  onBatchApprove: () => void
  onBatchReject: () => void
}

export function BatchActions({
  selectedCount,
  onBatchApprove,
  onBatchReject,
}: BatchActionsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onBatchApprove}
        className="h-8 gap-1.5 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Batch Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onBatchReject}
        className="h-8 gap-1.5 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <XCircle className="h-3.5 w-3.5" />
        Batch Reject
      </Button>
    </div>
  )
}
