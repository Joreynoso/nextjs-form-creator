import { ClipboardList, Link2, Sliders, BarChart2, ToggleRight, LayoutDashboard } from 'lucide-react'

export const features = [
    {
        id: 1,
        icon: ClipboardList,
        title: 'Formularios clínicos a medida',
        description: 'Creá formularios de anamnesis o evaluación con campos dinámicos: texto, número, selección, casillas y más, sin necesidad de código.'
    },
    {
        id: 2,
        icon: Link2,
        title: 'Links únicos para pacientes',
        description: 'Generá un link personalizado para cada formulario y enviáselo al paciente. Ellos completan desde cualquier dispositivo, sin cuenta ni instalación.'
    },
    {
        id: 3,
        icon: Sliders,
        title: 'Campos completamente configurables',
        description: 'Personalizá cada campo: etiqueta, tipo, opciones predefinidas, respuesta libre y obligatoriedad, todo desde el editor visual.'
    },
    {
        id: 4,
        icon: BarChart2,
        title: 'Respuestas organizadas',
        description: 'Todas las respuestas de tus pacientes quedan guardadas en tu dashboard, ordenadas por formulario y fecha, listas para revisar o exportar.'
    },
    {
        id: 5,
        icon: ToggleRight,
        title: 'Control de acceso al formulario',
        description: 'Activá o desactivá el acceso público a cada formulario con un solo clic. Controlás exactamente quién puede responder y cuándo.'
    },
    {
        id: 6,
        icon: LayoutDashboard,
        title: 'Dashboard centralizado',
        description: 'Gestioná todos tus formularios desde un solo lugar. Visualizá el estado de cada uno, editá su contenido y accedé a las respuestas al instante.'
    }
]


export default function CardsHome() {

    // render return
    return (
        <div className='w-full max-w-7xl mx-auto mt-10 mb-20'>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                        <div
                            key={feature.id}
                            className="relative bg-linear-to-br from-card to-muted/10 border border-border/40 p-10 rounded-2xl text-center flex flex-col justify-center items-center h-full"
                        >
                            <div className='aspect-square w-14 h-14 mx-auto bg-muted/20 rounded-full flex justify-center items-center mb-6 transition-transform duration-500'>
                                <Icon className='w-7 h-7 text-primary/60' />
                            </div>
                            <h2 className='font-serif text-xl tracking-tight text-foreground mb-3'>{feature.title}</h2>
                            <p className='text-muted-foreground/70 text-sm leading-relaxed font-sans'>{feature.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}