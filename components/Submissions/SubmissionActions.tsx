'use client'

import { useState } from 'react'
import { Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteSubmission } from '@/actions/forms/forms'
import { toast } from 'sonner'

interface SubmissionActionsProps {
    responses?: Record<string, any>
    fields?: Array<{ id: string; label: string }>
    canCopy?: boolean
    submissionId: string
    formId: string
}

export default function SubmissionActions({ responses = {}, fields = [], canCopy = false, submissionId, formId }: SubmissionActionsProps) {
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
            await deleteSubmission(submissionId, formId)
            toast.success("Respuesta eliminada correctamente")
        } catch (error) {
            toast.error("Error al eliminar la respuesta")
        }
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

            {/* Eliminar — siempre visible, solo UI por ahora */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
            >
                <Trash2 className="size-3.5" />
                Eliminar
            </Button>
        </div>
    )
}
