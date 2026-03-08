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
import { Badge } from '../ui/badge'

// import dropdown menu components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from 'react'
import FormDialogDelete from './FormDialogDelete'
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
    const handleDeleteForm = async () => {
        setIsDeleting(true)
        try {
            const { success, message } = await deleteForm(form.id)

            if (!success) {
                toast.error(message)
                return
            }

            setOpenDeleteDialog(false)
            toast.success(message)
        } catch {
            toast.error('Error al eliminar el formulario')
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
            <div className="relative flex flex-col justify-between border border-border/40 rounded-lg bg-card p-6 min-h-[180px] shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">

                <div className="space-y-3">
                    <div className="flex justify-between items-start pr-8">
                        <p className='text-foreground line-clamp-1 font-serif text-xl'>{form.name}</p>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'ghost'} size="icon-xs" className='absolute top-3 right-3 opacity-70 hover:opacity-100'>
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
                        <Badge variant={form.isActive ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                            {form.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>

                        <Badge variant={isPublicOpen ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                            {isPublicOpen ? 'Abierto' : 'Cerrado'}
                        </Badge>

                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleCopyLink}
                            disabled={!isPublicOpen}
                            className="h-6 text-[11px] text-muted-foreground hover:text-primary gap-1 px-1.5"
                        >
                            <Copy className="size-3" />
                            link
                        </Button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground/60 text-[11px] font-medium uppercase tracking-tight">
                        <Calendar className="size-3 opacity-70" />
                        {form.createdAt.toLocaleDateString()}
                    </span>

                    <Link
                        href={`/dashboard/${form.id}`}
                        className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-tight"
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