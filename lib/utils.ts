import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: [
        "chip",
        "badge",
        "input",
        "card",
        "panel",
        "panel-lg",
        "feature-card",
        "banner",
        "pill",
      ],
      shadow: ["subtle", "card", "mockup", "modal"],
      text: [
        "hero-display",
        "display-lg",
        "heading-1",
        "heading-2",
        "heading-3",
        "heading-4",
        "heading-5",
        "subtitle",
        "body-md",
        "body-sm",
        "caption",
        "micro",
        "micro-uppercase",
        "button-md",
        "stat-display",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function getSubmissionStatus(status: string) {
  switch (status) {
    case "completed":
      return {
        label: "✓ Completado",
        class: "bg-primary/15 text-primary"
      }

    case "expired":
      return {
        label: "⌛ Expirado",
        class: "bg-destructive/15 text-destructive"
      }

    default:
      return {
        label: "⏳ Pendiente",
        class: "bg-muted text-muted-foreground"
      }
  }
}
