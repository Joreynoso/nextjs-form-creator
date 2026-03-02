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
                            className='bg-linear-to-br from-card via-card to-muted/20 border border-border/50 p-8 rounded-2xl text-center flex flex-col justify-center items-center hover:bg-secondary transition-colors duration-300 ease-in-out'
                        >
                            <div className='aspect-square w-12 h-12 mx-auto bg-muted rounded-full flex justify-center items-center mb-6'>
                                <Icon className='w-6 h-6 text-primary' />
                            </div>
                            <h2 className='font-serif text-lg font-medium mb-2'>{feature.title}</h2>
                            <p className='text-muted-foreground'>{feature.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}