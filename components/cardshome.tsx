'use client'

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
        title: 'Lógica condicional',
        description: 'Mostrá u ocultá preguntas dependiendo de las respuestas previas para mantener el formulario relevante.'
    },
    {
        id: 4,
        icon: BarChart2,
        title: 'Insights y estadísticas',
        description: 'Analizá las respuestas de todos tus pacientes en un dashboard claro para tomar decisiones basadas en datos reales.'
    },
    {
        id: 5,
        icon: ToggleRight,
        title: 'Control de privacidad total',
        description: 'Activá o desactivá tus formularios con un clic. Decidí cuándo un formulario está disponible y cuándo deja de recibir respuestas.'
    },
    {
        id: 6,
        icon: LayoutDashboard,
        title: 'Secciones organizadas',
        description: 'Estructurá los formularios largos en bloques o secciones lógicas para que el paciente no se abrume y mejore la tasa de completado.'
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
                            className="group relative bg-card/50 hover:bg-card border border-border hover:shadow-lg p-10 rounded-2xl text-center flex flex-col justify-center items-center h-full transition-all duration-300"
                        >
                            <div className='w-14 h-14 mx-auto bg-background text-muted-foreground rounded-full flex justify-center items-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-sm'>
                                <Icon className='w-7 h-7' />
                            </div>
                            <h2 className='font-serif text-xl tracking-tight text-foreground mb-3 duration-300'>{feature.title}</h2>
                            <p className='text-muted-foreground/70 text-sm leading-relaxed font-sans'>{feature.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}