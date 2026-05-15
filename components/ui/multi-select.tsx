"use client"

import * as React from "react"
import { X, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  showSearch?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found",
  className,
  disabled = false,
  showSearch = true,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options
    const query = searchQuery.toLowerCase()
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selected.includes(option.value))
  }, [options, selected])

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const removeOption = (e: React.MouseEvent, value: string) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between min-h-10 h-auto px-3 py-2",
            "bg-background hover:bg-background border-input",
            "focus-visible:ring-primary focus-visible:border-primary",
            className
          )}
        >
          <div className="flex items-center gap-1.5 flex-1 overflow-hidden whitespace-nowrap">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground text-sm truncate">{placeholder}</span>
            ) : (
              <>
                {selectedOptions.slice(0, 2).map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="h-6 px-2 text-xs font-normal bg-secondary/80 hover:bg-secondary shrink-0"
                  >
                    <span className="truncate max-w-[80px]">{option.label}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeOption(e, option.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          removeOption(e as unknown as React.MouseEvent, option.value)
                        }
                      }}
                      className="ml-1 cursor-pointer hover:text-destructive inline-flex shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
                {selectedOptions.length > 2 && (
                  <TooltipProvider delay={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="secondary"
                          className="h-6 px-2 text-xs font-normal bg-secondary/80 shrink-0 cursor-pointer"
                        >
                          +{selectedOptions.length - 2}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="start"
                        className="max-w-[280px] p-3 rounded-lg shadow-lg"
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {selectedOptions.slice(2).map((option) => (
                            <Badge
                              key={option.value}
                              variant="secondary"
                              className="h-5 px-2 text-xs font-normal bg-secondary/80"
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {selectedOptions.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    clearAll(e as unknown as React.MouseEvent)
                  }
                }}
                className="p-0.5 hover:bg-muted rounded-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        align="start"
        sideOffset={4}
      >
        <div className="flex flex-col">
          {/* Search Input */}
          {showSearch && (
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
              />
            </div>
          )}

          {/* Options List */}
          <ScrollArea className={cn("h-[200px]", !showSearch && "pt-1")}>
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer",
                      "hover:bg-muted transition-colors",
                      selected.includes(option.value) && "bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => toggleOption(option.value)}
                      className="border-muted-foreground/30"
                    />
                    <span className="flex-1 text-sm truncate">{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {selected.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/30">
              <span className="text-xs text-muted-foreground">
                {selected.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
