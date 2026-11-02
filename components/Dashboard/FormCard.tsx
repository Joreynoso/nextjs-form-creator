'use client'

// import icons
import {
    EllipsisVertical,
    Calendar,
    Copy,
    Pencil,
} from "lucide-react"

// imports
import Link from 'next/link'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { FORM_CARD_TONES, getFormCardToneIndex } from "@/lib/form-tones"
import { useState } from 'react'
import { deleteForm } from '@/actions/forms/crud'
import { toast } from 'sonner'

// toggle public access
import { enablePublicAccess, disablePublicAccess } from "@/actions/forms/access"
import DeleteDialog from '../ui/deleteDialog'
import RenameFormDialog from './RenameFormDialog'

// type props
type FormCardProps = {
    form: {
        id: string
        name: string
        description: string | null
        isActive: boolean
        createdAt: Date
        isPublicOpen: boolean
        publicToken: string | null
    }
    toneIndex?: number
}

export default function FormCard({ form, toneIndex }: FormCardProps) {
    const tone = FORM_CARD_TONES[toneIndex ?? getFormCardToneIndex(form.id)]

    // estado local sincronizado
    const [isPublicOpen, setIsPublicOpen] = useState(form.isPublicOpen)
    const [publicToken, setPublicToken] = useState(form.publicToken)
    const [displayName, setDisplayName] = useState(form.name)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [openRenameDialog, setOpenRenameDialog] = useState(false)

    // delete form
    const handleDeleteForm = async (): Promise<{ success: boolean; message: string }> => {
        setIsDeleting(true)

        try {
            const result = await deleteForm(form.id)

            if (!result.success) {
                toast.error(result.message)
                return result
            }

            setOpenDeleteDialog(false)
            toast.success(result.message)

            return result
        } catch {
            const result = { success: false, message: 'Error al eliminar el formulario' }
            toast.error(result.message)
            return result
        } finally {
            setIsDeleting(false)
        }
    }

    // toggle public access
    const handleTogglePublicAccess = async () => {
        try {
            const res = isPublicOpen
                ? await disablePublicAccess(form.id)
                : await enablePublicAccess(form.id)

            if (!res?.success) {
                toast.error(res?.message ?? "No se pudo actualizar el acceso")
                return
            }

            setIsPublicOpen(res.isPublicOpen ?? false)

            if (res.token !== undefined) {
                setPublicToken(res.token)
            }

            toast.success(
                res.isPublicOpen
                    ? "Formulario abierto al público"
                    : "Formulario cerrado al público"
            )

        } catch {
            toast.error("Error al actualizar acceso público")
        }
    }

    // copy link
    const handleCopyLink = async () => {
        if (!publicToken || !isPublicOpen) {
            toast("El formulario debe estar abierto para copiar el link")
            return
        }

        try {
            const link = `${window.location.origin}/form/${publicToken}`
            await navigator.clipboard.writeText(link)
            toast.success("Link copiado")
        } catch {
            toast.error("No se pudo copiar el link")
        }
    }

    return (
        <>
            <div className={cn(
                "group relative flex-1 flex flex-col justify-between overflow-hidden border rounded-2xl p-7 min-h-[180px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg has-[button[data-state=open]]:shadow-lg",
                tone.surface
            )}>
                <span
                    aria-hidden="true"
                    className={cn("pointer-events-none absolute inset-y-0 left-0 w-1", tone.accent)}
                />

                <div className="space-y-3">
                    <div className="flex justify-between items-start pr-8">
                        <button
                            type="button"
                            onClick={() => setOpenRenameDialog(true)}
                            aria-label={`Renombrar formulario ${displayName}`}
                            title="Renombrar formulario"
                            className="group/title flex min-w-0 flex-1 items-center gap-1.5 rounded-sm text-left text-foreground font-serif text-xl font-medium tracking-tight outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            style={{ textWrap: 'balance' }}
                        >
                            <span className="line-clamp-1">{displayName}</span>
                            <Pencil className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover/title:opacity-60 group-focus-visible/title:opacity-60" aria-hidden="true" />
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size="icon-xs"
                                    className='absolute top-3 right-3 opacity-70 hover:opacity-100 data-[state=open]:opacity-100 data-[state=open]:text-primary'
                                    aria-label="Opciones del formulario"
                                >
                                    <EllipsisVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-44" align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/${form.id}`}>
                                        Ver respuestas
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/${form.id}/edit`}>
                                        Editar formulario
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={handleTogglePublicAccess}>
                                    {isPublicOpen ? "Desactivar formulario" : "Activar formulario"}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setOpenDeleteDialog(true)}
                                >
                                    Eliminar formulario
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <p className='text-muted-foreground text-sm line-clamp-2 leading-relaxed font-sans'>
                        {form.description || "Sin descripción"}
                    </p>

                    <div className="flex flex-wrap gap-2 items-center pt-1">
                        {/* Pill Status: Activo/Inactivo */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-medium uppercase tracking-wider",
                            form.isActive 
                                ? "bg-primary/5 border-primary/20 text-primary"
                                : "bg-muted/10 border-border/40 text-muted-foreground"
                        )}>
                            <div className={cn("size-1.5 rounded-full", form.isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/40")} />
                            {form.isActive ? 'Activo' : 'Inactivo'}
                        </div>

                        {/* Pill Status: Público/Privado */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-medium uppercase tracking-wider",
                            isPublicOpen 
                                ? "bg-primary/5 border-primary/20 text-primary"
                                : "bg-muted/10 border-border/40 text-muted-foreground"
                        )}>
                            {isPublicOpen ? 'Abierto' : 'Cerrado'}
                        </div>

                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleCopyLink}
                            disabled={!isPublicOpen}
                            className="h-6 text-[11px] text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1.5 px-2 font-medium transition-colors"
                        >
                            <Copy className="size-3" />
                            Copiar link
                        </Button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground text-[0.65rem] font-medium uppercase tracking-[0.12em] font-sans">
                        <Calendar className="size-3 opacity-70" />
                        {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(form.createdAt)}
                    </span>

                    <Link
                        href={`/dashboard/${form.id}`}
                        className="text-[0.65rem] font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.12em] font-sans"
                    >
                        Ver Respuestas
                    </Link>
                </div>
            </div>

            <DeleteDialog
                open={openDeleteDialog}
                onConfirm={handleDeleteForm}
                isDeleting={isDeleting}
                onClose={() => setOpenDeleteDialog(false)}
                title="Eliminar formulario"
                description="Esta acción no se puede deshacer. Se eliminará permanentemente el formulario."
            />

            <RenameFormDialog
                formId={form.id}
                currentName={displayName}
                open={openRenameDialog}
                onOpenChange={setOpenRenameDialog}
                onRenamed={setDisplayName}
            />
        </>
    )
}