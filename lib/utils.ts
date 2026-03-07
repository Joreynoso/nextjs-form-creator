import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
