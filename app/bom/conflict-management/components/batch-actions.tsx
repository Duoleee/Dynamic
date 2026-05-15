"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface BatchActionsProps {
  selectedCount: number
  onBatchResolve: () => void
}

export function BatchActions({
  selectedCount,
  onBatchResolve,
}: BatchActionsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 pb-4">
      <span className="text-sm text-muted-foreground">
        {selectedCount} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onBatchResolve}
        className="h-8"
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
        Batch Resolved
      </Button>
    </div>
  )
}
