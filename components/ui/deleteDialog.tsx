// import components
'use client'
import { Button } from '../ui/button'
import { AlertTriangle } from 'lucide-react'

type SubmissionDeleteDialogProps = {
    onConfirm: () => Promise<{ success: boolean; message: string }>
    open: boolean
    isDeleting?: boolean
    onClose: () => void
    title?: string
    description?: string
}

export default function DeleteDialog({ open, onConfirm, isDeleting, onClose, title, description }: SubmissionDeleteDialogProps) {

    if (!open) return null

    // render return
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm px-5 animate-in fade-in duration-300'>
            <div className='bg-linear-to-br from-card to-muted/10 border border-border/40 p-10 rounded-[2rem] max-w-md w-full animate-in zoom-in-95 duration-300 backdrop-blur-2xl'>

                <div className='flex flex-col items-center text-center space-y-5'>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-destructive/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative rounded-full aspect-square h-24 w-24 bg-card border border-border/20 flex justify-center items-center shadow-2xl">
                            <AlertTriangle className='h-10 w-10 text-destructive' />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h2 className='text-2xl font-serif tracking-tight text-foreground'>{title}</h2>
                        <p className='font-sans text-muted-foreground/80 text-base leading-relaxed'>
                            {description}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row justify-center gap-4 mt-10'>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        disabled={isDeleting}
                        className='w-full sm:w-auto h-11 hover:bg-secondary/20 transition-all font-bold text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground/60 hover:text-foreground px-8 rounded-lg'
                    >
                        Cancelar
                    </Button>
 
                    <Button
                        variant='default'
                        onClick={() => onConfirm()}
                        disabled={isDeleting}
                        className='w-full sm:w-auto h-11 font-bold text-[0.7rem] uppercase tracking-[0.12em] px-8 active:scale-95 transition-transform rounded-lg'
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Eliminando...
                            </span>
                        ) : 'Eliminar'}
                    </Button>
                </div>
            </div>
        </div>
    )
}