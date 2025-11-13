import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Apply more explicit sizing and borders so the switch matches the inspected
        // computed styles you pasted (larger track, rounded corners, dark background).
        "peer data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-slate-800 dark:data-[state=unchecked]:bg-slate-900 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-5 w-8 shrink-0 items-center rounded-[8.8px] border border-[#232424] bg-[rgb(20,20,20)] shadow-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Larger thumb to match the larger track
          "bg-white dark:bg-gray-200 pointer-events-none block h-5 w-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-4px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
