"use client"

import * as React from "react"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

// 分隔符正则：逗号、分号、斜杠、竖线、加号、&、空格、换行、制表符
const SEPARATOR_REGEX = /[,，;；/\\|｜+&\s\n\t]+/

interface TagsInputProps {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minSearchLength?: number
  onSearch?: (query: string) => void
}

export function TagsInput({
  values,
  onChange,
  placeholder = "Enter values...",
  className,
  disabled = false,
  minSearchLength = 4,
  onSearch,
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // 检查是否包含分隔符
    if (SEPARATOR_REGEX.test(value)) {
      const parts = value.split(SEPARATOR_REGEX).filter((part) => part.trim().length > 0)

      if (parts.length > 0) {
        const newValues = [...values]
        parts.forEach((part) => {
          const trimmed = part.trim()
          if (trimmed && !newValues.includes(trimmed)) {
            newValues.push(trimmed)
          }
        })
        onChange(newValues)
        setInputValue("")
      }
    }

    // 触发搜索
    if (onSearch && value.trim().length >= minSearchLength) {
      onSearch(value.trim())
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
      e.preventDefault()
      onChange(values.slice(0, -1))
    }

    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (!values.includes(trimmed)) {
        onChange([...values, trimmed])
      }
      setInputValue("")
    }
  }

  // 删除指定标签
  const removeTag = (indexToRemove: number) => {
    onChange(values.filter((_, index) => index !== indexToRemove))
  }

  // 处理失去焦点
  const handleBlur = () => {
    if (inputValue.trim()) {
      const trimmed = inputValue.trim()
      if (!values.includes(trimmed)) {
        onChange([...values, trimmed])
      }
      setInputValue("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          className={cn(
            "flex items-center gap-1.5 h-10 w-full",
            "rounded-md border border-input bg-background px-3",
            "focus-within:ring-1 focus-within:ring-ring focus-within:border-ring",
            "cursor-text transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => {
            if (!disabled) {
              setOpen(true)
              setTimeout(() => inputRef.current?.focus(), 0)
            }
          }}
        >
          {/* 显示前2个标签 */}
          {values.slice(0, 2).map((value, index) => (
            <Badge
              key={`${value}-${index}`}
              variant="secondary"
              className="h-6 px-2 text-xs font-normal bg-secondary/80 hover:bg-secondary shrink-0 gap-1"
            >
              <span className="truncate max-w-[80px]">{value}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(index)
                }}
                className="cursor-pointer hover:text-destructive inline-flex"
              >
                <X className="h-3 w-3" />
              </span>
            </Badge>
          ))}

          {/* +X 按钮 */}
          {values.length > 2 && (
            <TooltipProvider delay={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="h-6 px-2 text-xs font-normal bg-secondary/80 shrink-0 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    +{values.length - 2}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="max-w-[280px] p-3 rounded-lg shadow-lg"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {values.slice(2).map((value, index) => (
                      <Badge
                        key={`tooltip-${value}-${index}`}
                        variant="secondary"
                        className="h-5 px-2 text-xs font-normal bg-secondary/80"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* 输入框 */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={values.length === 0 ? placeholder : ""}
            className="flex-1 bg-transparent outline-none text-sm min-w-[60px] h-full disabled:cursor-not-allowed placeholder:text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 下拉箭头 */}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </PopoverTrigger>

      {/* 下拉菜单 - 展示全部已选标签 */}
      <PopoverContent className="w-[280px] p-0" align="start" sideOffset={4}>
        <div className="p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Selected ({values.length})
          </p>
          {values.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No items selected</p>
          ) : (
            <ScrollArea className="max-h-[200px]">
              <div className="flex flex-wrap gap-1.5">
                {values.map((value, index) => (
                  <Badge
                    key={`dropdown-${value}-${index}`}
                    variant="secondary"
                    className="h-6 px-2 text-xs font-normal bg-secondary/80 hover:bg-secondary gap-1"
                  >
                    <span>{value}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => removeTag(index)}
                      className="cursor-pointer hover:text-destructive inline-flex"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
