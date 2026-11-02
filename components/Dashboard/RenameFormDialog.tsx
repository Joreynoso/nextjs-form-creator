'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { renameForm } from '@/actions/forms/crud'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const MAX_NAME_LENGTH = 120

type RenameFormDialogProps = {
    formId: string
    currentName: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onRenamed: (name: string) => void
}

export default function RenameFormDialog({
    formId,
    currentName,
    open,
    onOpenChange,
    onRenamed,
}: RenameFormDialogProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState(currentName)
    const [isSaving, setIsSaving] = useState(false)

    const trimmedName = name.trim()
    const isUnchanged = trimmedName === currentName.trim()
    const isTooLong = name.length > MAX_NAME_LENGTH
    const canSave = trimmedName.length > 0 && !isUnchanged && !isTooLong && !isSaving

    const inputId = `rename-form-name-${formId}`
    const hintId = `rename-form-hint-${formId}`

    useEffect(() => {
        if (open) {
            setName(currentName)
            setIsSaving(false)
        }
    }, [open, currentName])

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen && isSaving) return
        onOpenChange(nextOpen)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!canSave) return

        setIsSaving(true)

        try {
            const result = await renameForm(formId, trimmedName)

            if (!result.success) {
                toast.error(result.message)
                return
            }

            onRenamed(result.form?.name ?? trimmedName)
            onOpenChange(false)
            toast.success(result.message)
        } catch {
            toast.error('No se pudo actualizar el nombre del formulario')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-w-md"
                showCloseButton={!isSaving}
                onOpenAutoFocus={(event) => {
                    event.preventDefault()
                    inputRef.current?.focus()
                    inputRef.current?.select()
                }}
                onEscapeKeyDown={(event) => {
                    if (isSaving) event.preventDefault()
                }}
            >
                <DialogHeader>
                    <DialogTitle>Renombrar formulario</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-2">
                    <label htmlFor={inputId} className="sr-only">
                        Nombre del formulario
                    </label>

                    <Input
                        ref={inputRef}
                        id={inputId}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSaving}
                        aria-invalid={isTooLong}
                        aria-describedby={hintId}
                        placeholder="Ej. Historia clínica general"
                    />

                    <div id={hintId} className="flex justify-end">
                        <span
                            className={cn(
                                'text-micro tabular-nums',
                                isTooLong ? 'font-medium text-destructive' : 'text-muted-foreground'
                            )}
                        >
                            {name.length}/{MAX_NAME_LENGTH}
                        </span>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={!canSave}
                            className="w-full sm:w-auto"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Guardando...
                                </span>
                            ) : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
