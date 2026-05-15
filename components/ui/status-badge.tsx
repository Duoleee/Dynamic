"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType =
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Resolved"
  | "Revoke"
  | "Active"
  | "Inactive"
  | "EOL"

interface StatusBadgeProps {
  status: StatusType
  className?: string
  children?: React.ReactNode
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const getBadgeStyles = (status: StatusType) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "Confirmed":
      case "Resolved":
      case "Active":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "Rejected":
      case "Revoke":
      case "Inactive":
      case "EOL":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  return (
    <Badge className={cn(getBadgeStyles(status), className)}>
      {children || status}
    </Badge>
  )
}
