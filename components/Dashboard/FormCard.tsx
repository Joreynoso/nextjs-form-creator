'use client'

// import icons
import {
    EllipsisVertical,
    Calendar,
    Copy,
} from "lucide-react"

// imports
import Link from 'next/link'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState } from 'react'
import { deleteForm } from '@/actions/forms/forms'
import { toast } from 'sonner'

// toggle public access
import { enablePublicAccess, disablePublicAccess } from "@/actions/forms/forms"
import DeleteDialog from '../ui/deleteDialog'

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
}

export default function FormCard({ form }: FormCardProps) {

    // estado local sincronizado
    const [isPublicOpen, setIsPublicOpen] = useState(form.isPublicOpen)
    const [publicToken, setPublicToken] = useState(form.publicToken)

    const [loading, setLoading] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

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
        setLoading(true)

        try {
            const res = isPublicOpen
                ? await disablePublicAccess(form.id)
                : await enablePublicAccess(form.id)

            if (!res?.success) {
                toast.error("No se pudo actualizar el acceso")
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
        } finally {
            setLoading(false)
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
            <div className="relative flex flex-col justify-between border border-border/40 rounded-2xl bg-linear-to-br from-card to-muted/10 p-6 min-h-[180px] shadow-sm hover:shadow-md transition-[box-shadow,background-color,border-color] duration-300 backdrop-blur-sm">

                <div className="space-y-3">
                    <div className="flex justify-between items-start pr-8">
                        <p className='text-foreground line-clamp-1 font-serif text-xl' style={{ textWrap: 'balance' }}>{form.name}</p>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size="icon-xs"
                                    className='absolute top-3 right-3 opacity-70 hover:opacity-100'
                                    aria-label="Opciones del formulario"
                                >
                                    <EllipsisVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="end">
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

                                <DropdownMenuItem
                                    onClick={handleTogglePublicAccess}
                                    className="cursor-pointer"
                                >
                                    {isPublicOpen ? "Desactivar formulario" : "Activar formulario"}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setOpenDeleteDialog(true)}
                                    className="text-destructive cursor-pointer"
                                >
                                    Eliminar formulario
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <p className='text-muted-foreground text-sm line-clamp-2 leading-snug'>
                        {form.description || "Sin descripción"}
                    </p>

                    <div className="flex flex-wrap gap-2 items-center pt-1">
                        {/* Pill Status: Activo/Inactivo */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-bold uppercase tracking-wider",
                            form.isActive 
                                ? "bg-primary/5 border-primary/20 text-primary/70" 
                                : "bg-muted/10 border-border/40 text-muted-foreground/60"
                        )}>
                            <div className={cn("size-1.5 rounded-full", form.isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/40")} />
                            {form.isActive ? 'Activo' : 'Inactivo'}
                        </div>

                        {/* Pill Status: Público/Privado */}
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-bold uppercase tracking-wider",
                            isPublicOpen 
                                ? "bg-primary/5 border-primary/20 text-primary/70" 
                                : "bg-muted/10 border-border/40 text-muted-foreground/60"
                        )}>
                            {isPublicOpen ? 'Abierto' : 'Cerrado'}
                        </div>

                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleCopyLink}
                            disabled={!isPublicOpen}
                            className="h-6 text-[11px] text-muted-foreground hover:text-primary gap-1 px-1.5"
                        >
                            <Copy className="size-3" />
                            Copiar link
                        </Button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/10 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground/50 text-[0.65rem] font-medium uppercase tracking-[0.12em]">
                        <Calendar className="size-3 opacity-60" />
                        {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(form.createdAt)}
                    </span>

                    <Link
                        href={`/dashboard/${form.id}`}
                        className="text-[0.65rem] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.12em]"
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
        </>
    )
}