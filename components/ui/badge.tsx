import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill border border-transparent px-2.5 py-1 text-caption font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-surface text-ink",
        destructive: "bg-brand-red-dark text-primary-foreground",
        outline: "border-hairline-strong bg-transparent text-ink",
        ghost: "text-ink",
        link: "text-brand-blue underline-offset-4 hover:underline",
        yellow: "bg-brand-yellow text-on-yellow",
        "tag-yellow": "bg-surface-yellow text-yellow-dark",
        "tag-purple": "bg-surface-featured text-brand-blue",
        "tag-coral": "bg-coral-light text-coral-dark",
        success: "bg-success-accent text-primary-foreground",
        discount: "rounded-badge bg-brand-yellow px-1.5 py-0.5 text-micro text-on-yellow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
