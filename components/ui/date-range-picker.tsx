"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const presets = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "This month", type: "month" as const },
  { label: "Last month", type: "lastMonth" as const },
]

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value)

  // When popover opens, sync tempRange with value
  React.useEffect(() => {
    if (open) {
      setTempRange(value)
    }
  }, [open, value])

  const handlePresetClick = (preset: typeof presets[0]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let from: Date
    let to: Date = new Date(today)

    if (preset.type === "month") {
      from = new Date(today.getFullYear(), today.getMonth(), 1)
    } else if (preset.type === "lastMonth") {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      to = new Date(today.getFullYear(), today.getMonth(), 0)
    } else {
      from = new Date(today)
      from.setDate(today.getDate() - (preset.days || 0))
    }

    const newRange = { from, to }
    setTempRange(newRange)
    onChange(newRange)
    setOpen(false)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(undefined)
  }

  const handleApply = () => {
    if (tempRange?.from && tempRange?.to) {
      onChange(tempRange)
      setOpen(false)
    }
  }

  const displayText = React.useMemo(() => {
    if (!value?.from) return placeholder
    
    if (value.to) {
      if (format(value.from, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")) {
        return format(value.from, "MMM dd, yyyy")
      }
      return `${format(value.from, "MMM dd")} - ${format(value.to, "MMM dd, yyyy")}`
    }
    return format(value.from, "MMM dd, yyyy")
  }, [value, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between min-h-10 px-3 py-2",
            "bg-background hover:bg-background border-input",
            "focus-visible:ring-primary focus-visible:border-primary",
            !value?.from && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm truncate">{displayText}</span>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {value?.from && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearSelection}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    clearSelection(e as unknown as React.MouseEvent)
                  }
                }}
                className="p-0.5 hover:bg-muted rounded-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
        <div className="flex flex-col">
          <div className="flex">
            {/* Presets Sidebar */}
            <div className="border-r border-border p-3 space-y-1 w-[160px]">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                Quick select
              </p>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="w-full justify-start h-8 text-xs font-normal"
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempRange?.from}
                selected={tempRange}
                onSelect={(range) => setTempRange(range)}
                numberOfMonths={2}
                className="[&_.rdp-day]:w-9 [&_.rdp-day]:h-9"
              />
            </div>
          </div>
          {/* Apply Button */}
          <div className="flex items-center justify-end gap-2 border-t border-border p-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleApply}
              disabled={!tempRange?.from || !tempRange?.to}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
