import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full resize-none rounded-input border border-hairline-strong bg-canvas px-3 py-2.5 text-body-md text-ink shadow-none outline-none transition-colors selection:bg-brand-yellow selection:text-on-yellow placeholder:text-disabled disabled:cursor-not-allowed disabled:bg-surface disabled:text-disabled disabled:opacity-100 read-only:bg-surface aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
