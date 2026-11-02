// components/forms/create-form-button.tsx
"use client"

import { createEmptyForm } from "@/actions/forms/crud"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

export default function CreateFormButton() {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    startTransition(async () => {
      const { data: id, message } = await createEmptyForm()
      if (!id) {
        toast.error(message)
        return
      }
      toast.success(message)
      router.push(`/dashboard/${id}/edit`)
    })
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={isPending}
    >
      {isPending ? "Creando…" : "Crear formulario"}
    </Button>
  )
}