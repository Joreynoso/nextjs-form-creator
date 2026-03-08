// import components
import { Button } from '../ui/button'
import { AlertTriangle } from 'lucide-react'

type SubmissionDeleteDialogProps = {
    onConfirm: () => Promise<void>
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-5 animate-in fade-in duration-200'>
            <div className='bg-card border border-border p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200'>

                <div className='flex flex-col items-center text-center space-y-4'>
                    <div className='bg-destructive/10 p-3 rounded-full'>
                        <AlertTriangle className='size-8 text-destructive' />
                    </div>

                    <div className='space-y-2'>
                        <h2 className='text-xl font-serif tracking-tight text-foreground'>{title}</h2>
                        <p className='font-sans text-muted-foreground text-sm leading-relaxed'>
                            {description}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row justify-end gap-3 mt-8'>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        disabled={isDeleting}
                        className='w-full sm:w-auto hover:bg-secondary/20 transition-all font-medium text-muted-foreground hover:text-foreground'
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={() => onConfirm()}
                        disabled={isDeleting}
                        className='w-full sm:w-auto font-medium'
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