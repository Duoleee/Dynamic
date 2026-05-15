"use client"

import { Button } from "@/components/ui/button"
import { Power, PowerOff, Trash2 } from "lucide-react"

interface BatchActionsProps {
  selectedCount: number
  onBatchEnable: () => void
  onBatchDisable: () => void
  onBatchDelete: () => void
}

export function BatchActions({
  selectedCount,
  onBatchEnable,
  onBatchDisable,
  onBatchDelete,
}: BatchActionsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onBatchEnable}
        className="h-8"
      >
        <Power className="h-3.5 w-3.5 mr-1.5" />
        Enable
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onBatchDisable}
        className="h-8"
      >
        <PowerOff className="h-3.5 w-3.5 mr-1.5" />
        Disable
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onBatchDelete}
        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
        Delete
      </Button>
    </div>
  )
}
