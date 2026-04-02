import { MessageCircleQuestionMark } from 'lucide-react';

export default function FieldEmpty() {

    return (
        <div className='w-full bg-linear-to-br from-card to-muted/5 backdrop-blur-sm border border-dashed border-border/20 min-h-[400px] 
        flex flex-col items-center justify-center gap-8 py-16 px-8 rounded-3xl transition-all duration-500'>
            <div className="relative group">
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative rounded-full aspect-square h-24 w-24 bg-card border border-border/20 flex justify-center items-center shadow-2xl">
                    <MessageCircleQuestionMark className="h-10 w-10 text-primary" />
                </div>
            </div>
            
            <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-3xl font-serif text-foreground tracking-tight">
                    Tu lienzo está listo
                </h3>
                <p className='text-base font-sans text-muted-foreground/60 leading-relaxed'>
                    Aún no has creado ninguna pregunta. Elige un tipo de campo arriba para comenzar a dar forma a tu visión.
                </p>
            </div>
        </div>
    )
}