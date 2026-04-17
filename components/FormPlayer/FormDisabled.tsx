import { CircleAlert } from 'lucide-react';

interface FormDisabledProps {
    message?: string
}

export default function FormDisabled({ message }: FormDisabledProps) {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-8 py-20 px-8 transition-all duration-500'>
            
            {/* ── Icon (Minimalist) ── */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <CircleAlert className="relative h-16 w-16 text-primary" />
            </div>
            
            {/* ── Text Content ── */}
            <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-3xl font-serif text-foreground tracking-tight">
                    Formulario Desactivado
                </h3>
                <p className='text-base font-sans text-muted-foreground/60 leading-relaxed'>
                    {message || "Este formulario no está activo en este momento. Por favor, contacta con el administrador si crees que esto es un error."}
                </p>
            </div>
        </div>
    )
}