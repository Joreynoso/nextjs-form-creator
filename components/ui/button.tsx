import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-button-md font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "rounded-pill bg-primary text-primary-foreground shadow-xs hover:bg-charcoal disabled:bg-hairline disabled:text-disabled disabled:opacity-100 disabled:shadow-none",
        destructive:
          "rounded-pill bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "rounded-pill border border-hairline bg-transparent text-ink hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-pill border border-hairline-strong bg-transparent text-ink hover:bg-accent hover:text-accent-foreground",
        ghost: "rounded-input text-ink hover:bg-accent hover:text-accent-foreground",
        link: "text-brand-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 has-[>svg]:px-5",
        xs: "h-7 gap-1 px-3 text-micro has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 text-body-sm has-[>svg]:px-3",
        lg: "h-11 px-8 text-body-md has-[>svg]:px-6",
        icon: "size-10 rounded-pill",
        "icon-xs": "size-7 rounded-pill [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-pill",
        "icon-lg": "size-11 rounded-pill",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
