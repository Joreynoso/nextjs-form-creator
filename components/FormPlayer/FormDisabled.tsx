import { CircleAlert, ClipboardType } from 'lucide-react';

export default function FormDisabled() {
    return (
        <div className='w-full 
        flex flex-col items-center justify-center gap-6 py-12 px-4 rounded-lg'>
            <div className="rounded-full aspect-square h-20 w-20 bg-secondary/30 border border-secondary/40 p-4 flex justify-center items-center">
                <CircleAlert className="h-10 w-10 text-muted-foreground/70" />
            </div>
            <div className="text-center space-y-3">
                <h3 className="text-lg font-serif text-foreground">
                    Formulario Desactivado
                </h3>
                <p className='text-sm font-sans text-muted-foreground max-w-sm'>
                    Este formulario no está activo.
                </p>
            </div>
        </div>
    )
}