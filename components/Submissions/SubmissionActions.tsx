'use client'

import { useState } from 'react'
import { Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteSubmission } from '@/actions/forms/forms'
import { toast } from 'sonner'
import { Submission } from '@/@types/types'
import DeleteDialog from '../ui/deleteDialog'

interface SubmissionActionsProps {
    responses?: Submission['responses']
    fields?: Array<{ id: string; label: string }>
    canCopy?: boolean
    submissionId: string
    formId: string
}

export default function SubmissionActions({ responses = {}, fields = [], canCopy = false, submissionId, formId }: SubmissionActionsProps) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [copied, setCopied] = useState(false)

    function buildOrderedJson() {
        const ordered: Record<string, unknown> = {}
        for (const field of fields) {
            const value = responses[field.id]
            if (value !== undefined && value !== null && value !== '') {
                ordered[field.label] = value
            }
        }
        return JSON.stringify(ordered, null, 2)
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(buildOrderedJson())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // clipboard no disponible
        }
    }

    async function handleDelete() {
        try {
            setIsDeleting(true)
            const result = await deleteSubmission(submissionId, formId)
            setOpen(false)
            toast.success(result.message)
            return result
        } catch {
            const errorMsg = "Error al eliminar la respuesta"
            toast.error(errorMsg)
            return { success: false, message: errorMsg }
        } finally {
            setIsDeleting(false)
        }
    }

    function handleClose() {
        setOpen(false)
        setIsDeleting(false)
    }

    return (
        <div className="flex items-center gap-0.5">

            {/* Copiar JSON — solo si hay respuestas */}
            {canCopy && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    title="Copiar respuestas como JSON"
                    className="h-7 w-7 sm:w-auto sm:px-2.5 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
                >
                    {copied ? (
                        <>
                            <Check className="size-3.5 text-primary shrink-0" />
                            <span className="hidden sm:inline">Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy className="size-3.5 shrink-0" />
                            <span className="hidden sm:inline">Copiar</span>
                        </>
                    )}
                </Button>
            )}

            {/* Eliminar */}
            {submissionId && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(true)}
                    title="Eliminar respuesta"
                    className="h-7 w-7 sm:w-auto sm:px-2.5 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                    <Trash2 className="size-3.5 shrink-0" />
                    <span className="hidden sm:inline">Eliminar</span>
                </Button>
            )}

            <DeleteDialog
                open={open}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                onClose={handleClose}
                title="Eliminar respuesta"
                description="Esta acción no se puede deshacer. Se eliminará permanentemente la respuesta."
            />
        </div>
    )
}
