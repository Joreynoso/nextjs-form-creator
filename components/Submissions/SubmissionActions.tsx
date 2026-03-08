'use client'

import { useState } from 'react'
import { Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteSubmission } from '@/actions/forms/forms'
import { toast } from 'sonner'
import DeleteDialog from '../ui/deleteDialog'

interface SubmissionActionsProps {
    responses?: Record<string, any>
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
        const ordered: Record<string, any> = {}
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
            await deleteSubmission(submissionId, formId)
            toast.success("Respuesta eliminada correctamente")
        } catch (error) {
            toast.error("Error al eliminar la respuesta")
        } finally {
            setIsDeleting(false)
        }
    }

    function handleClose() {
        setOpen(false)
        setIsDeleting(false)
    }

    return (
        <div className="flex items-center gap-1">
            {/* Copiar JSON — solo si hay respuestas */}
            {canCopy && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                    {copied ? (
                        <>
                            <Check className="size-3.5 text-primary" />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Copy className="size-3.5" />
                            Copiar JSON
                        </>
                    )}
                </Button>
            )}

            {/* Eliminar — solo si hay un ID */}
            {submissionId && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                    <Trash2 className="size-3.5" />
                    Eliminar
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
