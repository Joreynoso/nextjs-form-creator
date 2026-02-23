import { MessageCircleQuestionMark } from 'lucide-react';

export default function FieldEmpty() {

    // render return
    return (
        <div className='w-full bg-card/70 backdrop-blur-sm border border-dashed border-border/40 min-h-[320px] 
        flex flex-col items-center justify-center gap-6 py-12 px-4 rounded-lg'>
            <div className="rounded-full aspect-square h-20 w-20 bg-secondary/30 border border-secondary/40 p-4 flex justify-center items-center">
                <MessageCircleQuestionMark className="h-10 w-10 text-muted-foreground/70" />
            </div>
            <div className="text-center space-y-3">
                <h3 className="text-lg font-medium text-foreground">
                    No hay preguntas
                </h3>
                <p className='text-sm text-muted-foreground max-w-sm'>
                    Aún no has creado tu primer pregunta.
                </p>
            </div>
        </div>
    )
}