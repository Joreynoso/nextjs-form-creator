'use client'

import { useState, useRef, useEffect } from 'react'
import { Wrench, FilePlus, Search, ChevronDown, Sparkles } from 'lucide-react'

type Tool = {
    id: string
    label: string
    description: string
    icon: React.ElementType
    prompt: string
}

const TOOLS: Tool[] = [
    {
        id: 'createForm',
        label: 'Crear formulario',
        description: 'Crea un nuevo formulario vacio',
        icon: FilePlus,
        prompt: 'Quiero crear un formulario llamado ',
    },
    {
        id: 'findForm',
        label: 'Buscar formulario',
        description: 'Busca formularios o preguntas',
        icon: Search,
        prompt: 'Busca en mis formularios o preguntas la siguiente información: ',
    },
    {
        id: 'generateForm',
        label: 'Generar formulario con IA',
        description: 'Genera preguntas para un formulario',
        icon: Sparkles,
        prompt: 'Genera un formulario con 10 preguntas sobre ',
    }
]

type ToolsMenuProps = {
    onSelect: (prompt: string) => void
    disabled?: boolean
}

export default function ToolsMenu({ onSelect, disabled }: ToolsMenuProps) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // close on outside click
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const handleSelect = (tool: Tool) => {
        onSelect(tool.prompt)
        setOpen(false)
    }

    return (
        <div ref={containerRef} className="relative shrink-0 self-end">

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                disabled={disabled}
                aria-haspopup="true"
                aria-expanded={open}
                className={[
                    'flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-2.5 py-2 text-xs font-medium transition-all',
                    'border border-border/40 bg-muted/30 text-muted-foreground',
                    'hover:bg-muted/60 hover:text-foreground hover:border-border/70',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                    open ? 'bg-muted/60 text-foreground border-border/70' : '',
                ].join(' ')}
            >
                <Wrench className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Herramientas</span>
                <ChevronDown
                    className={`hidden sm:block w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={[
                        'absolute bottom-full mb-2 right-0 z-50 w-[260px] sm:w-[320px] max-w-[85vw]',
                        'rounded-xl border border-border/50 bg-card shadow-lg',
                        'overflow-hidden',
                        'animate-in fade-in-0 slide-in-from-bottom-2 duration-150',
                    ].join(' ')}
                >
                    <div className="px-3 py-2 border-b border-border/30">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                            Herramientas disponibles
                        </p>
                    </div>

                    <div className="p-1">
                        {TOOLS.map((tool) => {
                            const Icon = tool.icon
                            return (
                                <button
                                    key={tool.id}
                                    type="button"
                                    onClick={() => handleSelect(tool)}
                                    className={[
                                        'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                        'hover:bg-muted/40 group',
                                    ].join(' ')}
                                >
                                    <div className="mt-0.5 rounded-md p-1.5 bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-sm font-medium text-foreground leading-none">
                                            {tool.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground leading-snug">
                                            {tool.description}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
