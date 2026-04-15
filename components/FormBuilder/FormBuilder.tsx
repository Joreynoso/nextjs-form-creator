'use client'

// import componentes
import { useState, useEffect } from "react"
import { FormField, FieldType, Form } from '@/types/form.types'
import { Button } from '../ui/button'
import { updateForm } from '@/actions/forms/crud'
import { toast } from 'sonner'
import {
    Check,
    MessageCircleWarning,
    Pencil,
    Type,
    AlignLeft,
    ListFilter,
    CircleDot,
    CheckSquare,
    Hash,
    Minus,
    Plus,
    ArrowUp
} from 'lucide-react'
import { FieldAddButton } from './toolbar/FieldAddButton'
import FieldCard from './fields/FieldCard'
import FieldEmpty from './fields/FieldEmpty'

interface FormBuilderProps {
    initialFields?: FormField[]
    form?: Form | null
}



export default function FormBuilder({ initialFields, form }: FormBuilderProps) {

    // localt states
    const [loading, setLoading] = useState(false)

    // form states
    const [name, setName] = useState(form?.name ?? "")
    const [description, setDescription] = useState(form?.description ?? "")
    const [fields, setFields] = useState<FormField[]>(initialFields ?? [])
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
    const [showScrollTop, setShowScrollTop] = useState(false)

    // effect to handle scroll for floating button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true)
            } else {
                setShowScrollTop(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // states para verificar si hubo cambios o no
    const [originalName, setOriginalName] = useState(form?.name ?? "")
    const [originalDescription, setOriginalDescription] = useState(form?.description ?? "")
    const [originalFields, setOriginalFields] = useState<FormField[]>(
        structuredClone(initialFields ?? [])
    )

    // verificar si las preguntas cambiaron
    const fieldsChanged =
        JSON.stringify(fields) !== JSON.stringify(originalFields)

    // verificar si el formulario tiene cambios "isDirty"
    const isDirty = name !== originalName || description !== originalDescription || fieldsChanged

    // handleSave
    async function handleSave() {
        if (!form?.id) return
        try {
            setLoading(true)
            const result = await updateForm(form.id, name, description, fields)
            if (!result.success) {
                toast.error(result.message)
                setLoading(false)
                return
            }

            toast.success(result.message)
            console.log('result', result)

            // setear los valores originales nuevos
            setOriginalName(name)
            setOriginalDescription(description)
            setOriginalFields(structuredClone(fields))


            setLoading(false)
        } catch (error) {
            toast.error("Error al guardar el formulario")
        } finally {
            setLoading(false)
        }
    }

    // agregar una nueva pregunta
    function addField(type: FieldType) {

        const newField: FormField = {
            id: crypto.randomUUID(),
            type,
            label: "Nueva pregunta",
            required: false,
            ...(type === "select" ||
                type === "radio" ||
                type === "checkbox"
                ? { options: ["Opción 1"] }
                : {})
        }

        setFields(prev => [...prev, newField])
        setActiveFieldId(newField.id)
    }

    // icon saved
    const checkSaved = (
        <div className='w-8 h-8 rounded-full aspect-square flex justify-center items-center bg-secondary'>
            <Check className="w-4 h-4" />
        </div>
    )

    // icon unsave
    const unsaveAlert = (
        <span className="w-8 h-8 rounded-full aspect-square flex justify-center items-center bg-secondary">
            <MessageCircleWarning className="w-4 h-4" />
        </span>
    )

    // render return
    return (
        <div className="space-y-6">

            {/* isDirty section - Pill compacta integrada */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    {isDirty ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 transition-all duration-500">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[11px] font-medium text-primary uppercase tracking-wider">Cambios sin guardar</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/20">
                            <Check className="size-3 text-muted-foreground/80" />
                            <span className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider">Guardado</span>
                        </div>
                    )}
                </div>

                <Button
                    disabled={!isDirty || loading}
                    onClick={handleSave}
                    className={`rounded-md px-6 transition-all duration-300 ${isDirty 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30" 
                        : "bg-muted/10 text-muted-foreground/40 overflow-hidden"}`}
                >
                    {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
            </div>

            <div className="flex flex-col gap-4 py-8 border-b border-border/10 mb-8 group relative lg:max-w-[90%]">
                <input
                    className="font-serif text-3xl sm:text-4xl md:text-6xl w-full outline-none bg-transparent placeholder:text-muted-foreground/30 text-foreground transition-all focus:placeholder:opacity-0 tracking-tight truncate z-10"
                    value={name}
                    placeholder='Formulario sin título'
                    onChange={(e) => setName(e.target.value)}
                />
                
                {/* Custom hover info para nombres largos */}
                {name && name.length > 20 && (
                    <div className="absolute left-0 -top-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0 z-20">
                        <div className="bg-card border border-border/40 px-3 py-1.5 rounded-lg shadow-xl text-xs font-serif text-muted-foreground whitespace-nowrap">
                            {name}
                        </div>
                    </div>
                )}
                
                <textarea
                    className="font-sans w-full text-lg md:text-2xl text-muted-foreground/70 outline-none bg-transparent placeholder:text-muted-foreground/50 leading-relaxed resize-none h-auto min-h-[40px] border-l-2 border-primary/20 pl-6 focus:border-primary/50 transition-colors"
                    placeholder='Añade una descripción sutil para guiar a tus usuarios...'
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        e.target.style.height = 'auto'
                        e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                />
            </div>

            {/* Toolbar revisada - Pills/Chips modernos */}
            <div className="flex flex-col gap-4 py-8">
                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/60 whitespace-nowrap">Añadir Campo</span>
                    <div className="h-px w-full bg-linear-to-r from-border/40 to-transparent" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <FieldAddButton
                        icon={<Type className="size-4" />}
                        label="Texto"
                        onClick={() => addField("text")}
                    />
                    <FieldAddButton
                        icon={<Hash className="size-4" />}
                        label="Número"
                        onClick={() => addField("number")}
                    />
                    <FieldAddButton
                        icon={<AlignLeft className="size-4" />}
                        label="Largo"
                        onClick={() => addField("textarea")}
                    />
                    <FieldAddButton
                        icon={<ListFilter className="size-4" />}
                        label="Selección"
                        onClick={() => addField("select")}
                    />
                    <FieldAddButton
                        icon={<CircleDot className="size-4" />}
                        label="Radio"
                        onClick={() => addField("radio")}
                    />
                    <FieldAddButton
                        icon={<CheckSquare className="size-4" />}
                        label="Check"
                        onClick={() => addField("checkbox")}
                    />
                    <FieldAddButton
                        icon={<Minus className="size-4" />}
                        label="Divisor"
                        onClick={() => addField("section")}
                    />
                </div>
            </div>

            {/* campos */}
            <div>
                {fields.length === 0 ? (
                    <FieldEmpty />
                ) : (
                    <div className="space-y-4">
                        {fields.map(field => (
                            <FieldCard
                                key={field.id}
                                field={field}
                                isActive={activeFieldId === field.id}
                                onSelect={() => setActiveFieldId(field.id)}
                                onChange={(updated) =>
                                    setFields(prev =>
                                        prev.map(f =>
                                            f.id === updated.id ? updated : f
                                        )
                                    )
                                }
                                onDelete={() =>
                                    setFields(prev =>
                                        prev.filter(f => f.id !== field.id)
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary/90 text-primary-foreground shadow-2xl backdrop-blur-md border border-primary/20 transition-all duration-500 hover:scale-110 active:scale-95 group ${
                    showScrollTop 
                        ? "opacity-100 translate-y-0 pointer-events-auto" 
                        : "opacity-0 translate-y-12 pointer-events-none"
                }`}
            >
                <div className="relative overflow-hidden">
                    <ArrowUp className="size-6 transition-all duration-300 group-hover:-translate-y-1" />
                    <div className="absolute inset-0 bg-white/20 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 rounded-full blur-xl" />
                </div>
            </button>
        </div>
    )
}