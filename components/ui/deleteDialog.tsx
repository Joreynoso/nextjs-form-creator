'use client'

import { Button } from './button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './dialog'

type SubmissionDeleteDialogProps = {
    onConfirm: () => Promise<{ success: boolean; message: string }>
    open: boolean
    isDeleting?: boolean
    onClose: () => void
    title?: string
    description?: string
}

export default function DeleteDialog({ open, onConfirm, isDeleting, onClose, title, description }: SubmissionDeleteDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen && !isDeleting) onClose()
            }}
        >
            <DialogContent
                showCloseButton={!isDeleting}
                className='max-w-md'
                onEscapeKeyDown={(event) => {
                    if (isDeleting) event.preventDefault()
                }}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className='pt-2'>
                    <Button
                        variant='secondary'
                        onClick={onClose}
                        disabled={isDeleting}
                        className='w-full sm:w-auto'
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant='destructive'
                        onClick={() => onConfirm()}
                        disabled={isDeleting}
                        className='w-full sm:w-auto'
                    >
                        {isDeleting ? (
                            <span className='flex items-center gap-2'>
                                <span className='size-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                Eliminando...
                            </span>
                        ) : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
