"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"

interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  indeterminate?: boolean
}

function Checkbox({ className, indeterminate, checked, disabled, ...props }: CheckboxProps) {
  // Handle indeterminate state
  const isIndeterminate = indeterminate === true

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      indeterminate={isIndeterminate}
      disabled={disabled}
      className={cn(
        // Base styles
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
        
        // Default state (unchecked)
        "border-input bg-background",
        
        // Hover (unchecked) - blue border
        "hover:border-primary",
        
        // Indeterminate state - blue bg, blue border, white minus (priority over checked)
        isIndeterminate && !disabled && [
          "border-primary bg-primary text-primary-foreground",
          "hover:brightness-110",
        ],
        
        // Checked state (not indeterminate) - blue bg, blue border, white check
        checked && !isIndeterminate && !disabled && [
          "border-primary bg-primary text-primary-foreground",
          "hover:brightness-110",
        ],
        
        // All disabled states - cursor not allowed, opacity reduced
        disabled && [
          "cursor-not-allowed",
          "opacity-40",
        ],
        
        // Disabled state (unchecked)
        disabled && !isIndeterminate && !checked && [
          "bg-muted border-border",
        ],
        
        // Indeterminate disabled state
        isIndeterminate && disabled && [
          "bg-muted border-border text-muted-foreground",
        ],
        
        // Checked disabled state (not indeterminate)
        checked && !isIndeterminate && disabled && [
          "bg-muted border-border text-muted-foreground",
        ],
        
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        {isIndeterminate ? (
          <MinusIcon className="size-3.5" />
        ) : (
          <CheckIcon className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
