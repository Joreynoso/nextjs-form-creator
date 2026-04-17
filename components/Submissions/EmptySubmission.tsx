import { Inbox } from 'lucide-react';

export default function EmptySubmission() {

    return (
        <div className='w-full bg-card/50 backdrop-blur-sm border border-border min-h-[400px] 
        flex flex-col items-center justify-center gap-8 py-16 px-8 rounded-2xl transition-all duration-500'>
            
            {/* ── Icon with Glow Effect ── */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-primary/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative rounded-full aspect-square h-24 w-24 bg-card border border-border/10 flex justify-center items-center shadow-2xl shadow-primary/5">
                    <Inbox className="h-10 w-10 text-primary/80" />
                </div>
            </div>
            
            {/* ── Text Content ── */}
            <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-3xl font-serif text-foreground tracking-tight">
                    Aún no hay respuestas
                </h3>
                <p className='text-base font-sans text-muted-foreground/50 leading-relaxed font-light'>
                    Tu formulario está listo y esperando. Cuando alguien lo complete, sus datos aparecerán aquí con este mismo nivel de claridad.
                </p>
            </div>
        </div>
    )
}