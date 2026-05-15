"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface BaseColumn {
  key: string
  label: string
  width?: number
  visible?: boolean
}

interface SortableTableHeaderProps<T extends BaseColumn> {
  column: T
  isFirst?: boolean
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: () => void
  disabled?: boolean
  children?: ReactNode
  className?: string
}

export function SortableTableHeader<T extends BaseColumn>({
  column,
  isFirst = false,
  checked,
  indeterminate,
  onCheckedChange,
  disabled = false,
  children,
  className,
}: SortableTableHeaderProps<T>) {
  const isCheckboxColumn = column.key === "checkbox"
  const isActionsColumn = column.key === "actions"

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.key,
    disabled: isCheckboxColumn || isActionsColumn || disabled,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isFirst ? 20 : isActionsColumn ? 30 : 10,
    width: column.width,
    position: isActionsColumn ? "sticky" : undefined,
    right: isActionsColumn ? 0 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center h-10 px-4 border-r shrink-0 bg-muted",
        !isCheckboxColumn && !isActionsColumn && "cursor-grab active:cursor-grabbing",
        isActionsColumn && "sticky right-0 border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
        isDragging && "bg-muted shadow-lg opacity-80",
        className
      )}
      {...(!isCheckboxColumn && !isActionsColumn ? { ...attributes, ...listeners } : {})}
    >
      {isCheckboxColumn ? (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      ) : children ? (
        children
      ) : (
        <span
          className={cn(
            "text-xs font-semibold text-muted-foreground tracking-wider truncate",
            isActionsColumn && "w-full text-center"
          )}
        >
          {column.label}
        </span>
      )}
    </div>
  )
}

interface ColumnVisibilityItemProps<T extends BaseColumn> {
  column: T
  onToggleVisibility: (key: string) => void
}

export function ColumnVisibilityItem<T extends BaseColumn>({
  column,
  onToggleVisibility,
}: ColumnVisibilityItemProps<T>) {
  const isCheckboxColumn = column.key === "checkbox"

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.key,
    disabled: isCheckboxColumn,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded select-none",
        !isCheckboxColumn && "cursor-pointer",
        isDragging && "bg-muted shadow-lg"
      )}
    >
      {!isCheckboxColumn && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="6" r="1" />
            <circle cx="15" cy="6" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="18" r="1" />
            <circle cx="15" cy="18" r="1" />
          </svg>
        </div>
      )}
      <Checkbox
        checked={column.visible !== false}
        onCheckedChange={() => onToggleVisibility(column.key)}
      />
      <span className="text-sm flex-1">{column.label}</span>
    </div>
  )
}
