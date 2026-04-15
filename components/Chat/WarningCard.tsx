export default function WarningCard() {
    return (
        <div className='w-full max-w-md mx-auto mt-4'>
            <p className='text-center text-xs sm:text-sm leading-relaxed text-muted-foreground opacity-70'>
                Las respuestas del agente son generadas por IA y pueden contener errores. Verifica la información antes de usarla.
            </p>
        </div>
    )
}