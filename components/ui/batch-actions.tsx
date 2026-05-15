"use client"

import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface BatchAction {
  key: string
  label: string
  icon: ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

interface BatchActionsProps {
  selectedCount: number
  actions: BatchAction[]
  className?: string
  label?: string
}

export function BatchActions({
  selectedCount,
  actions,
  className,
  label = "selected",
}: BatchActionsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {selectedCount} {label}
        </span>
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            className={action.className}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
