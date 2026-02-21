// components/forms/create-form-button.tsx
"use client"

import { createEmptyForm } from "@/actions/forms/forms"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"

export default function CreateFormButton() {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    startTransition(async () => {
      const id = await createEmptyForm()
      router.push(`/dashboard/${id}/edit`)
    })
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={isPending}
      className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
    >
      {isPending ? "Creando..." : "Crear formulario"}
    </Button>
  )
}