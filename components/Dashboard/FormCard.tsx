'use client'

// import icons
import {
    EllipsisVertical,
    Calendar,
    Copy,
} from "lucide-react"

// imports
import Link from 'next/link';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// import dropdown menu components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react';
import FormDialogDelete from './FormDialogDelete';

// type props
type FormCardProps = {
    form: {
        id: string
        name: string
        description: string | null
        isActive: boolean
        createdAt: Date
    }
}

export default function FormCard({ form }: FormCardProps) {

    // Estado para abrir el dialog de eliminación
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Handle delete form (Actual deletion logic)
    const handleDeleteForm = async () => {
        setIsDeleting(true)
        try {
            console.log('eliminando formulario...')

            // server action aqui

            setOpenDeleteDialog(false)
        } catch (error) {
            console.log(error)
        } finally {
            setIsDeleting(false)
        }
    }

    // render return
    return (
        <>
            <div key={form.id} className="relative flex flex-col justify-between border rounded-xl bg-card p-5 min-h-[160px] shadow-sm">

                {/* dropdown menu */}
                <div className="space-y-3">
                    <div className="flex justify-between items-start pr-8">
                        <p className='text-foreground font-semibold line-clamp-1'>{form.name}</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'ghost'} size="icon-xs" className='absolute top-3 right-3 opacity-70 hover:opacity-100'>
                                    <EllipsisVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/${form.id}`} className="flex items-center gap-2 cursor-pointer">
                                        Ver respuestas
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    Editar formulario
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setOpenDeleteDialog(true)}
                                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer">
                                    Eliminar formulario
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* description */}
                    <p className='text-muted-foreground text-sm line-clamp-2 leading-snug'>
                        {form.description || "Sin descripción"}
                    </p>

                    {/* badge y link */}
                    <div className="flex flex-wrap gap-2 items-center pt-1">
                        <Badge variant={form.isActive ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                            {form.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Button variant="ghost" size="xs" className="h-6 text-[11px] text-muted-foreground hover:text-primary gap-1 px-1.5">
                            <Copy className="size-3" />
                            Link
                        </Button>
                    </div>
                </div>

                {/* footer */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground/80 text-[11px]">
                        <Calendar className="size-3" />
                        {form.createdAt.toLocaleDateString()}
                    </span>
                    <Link
                        href={`/dashboard/${form.id}`}
                        className="text-[11px] font-medium text-primary flex items-center gap-1 hover:underline"
                    >
                        Ver Respuestas
                    </Link>
                </div>
            </div>

            {/* dialog delete */}
            <FormDialogDelete
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteForm}
                isDeleting={isDeleting}
                />
            </>
    )
}
