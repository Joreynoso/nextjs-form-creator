'use client'

// import componentes
import { useState } from "react"
import { FormField, FieldType, Form } from '@/@types/types'
import { Button } from '../ui/button'
import { updateForm } from '@/actions/forms/forms'
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
    Plus
} from 'lucide-react'
import FieldCard from './FieldCard'
import FieldEmpty from './FieldEmpty'

interface FormBuilderProps {
    initialFields?: FormField[]
    form?: Form | null
}

function FieldAddButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="flex items-center gap-2 h-9 px-3 border border-transparent hover:border-border/40 hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md group"
        >
            <div className="text-muted-foreground/60 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <span className="text-xs font-medium whitespace-nowrap">{label}</span>
        </Button>
    )
}

export default function FormBuilder({ initialFields, form }: FormBuilderProps) {

    // localt states
    const [loading, setLoading] = useState(false)

    // form states
    const [name, setName] = useState(form?.name ?? "")
    const [description, setDescription] = useState(form?.description ?? "")
    const [fields, setFields] = useState<FormField[]>(initialFields ?? [])
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

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

            {/* isDirty section */}
            <div className="w-full bg-card border border-border/40 shadow-sm backdrop-blur-sm transition-all hover:shadow-md p-6 rounded-lg flex items-center justify-between mb-4">
                {isDirty ? (
                    <span className="text-sm text-accent flex items-center gap-3">
                        {unsaveAlert} Cambios sin guardar
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground flex items-center gap-3">
                        {checkSaved} Guardado
                    </span>
                )}

                <Button
                    disabled={!isDirty || loading}
                    onClick={handleSave}
                    variant={isDirty ? "default" : "secondary"}
                    className="shadow-sm"
                >
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

            {/* nombre y descripcion */}
            <div className="bg-linear-to-br from-secondary/20 to-secondary/5 flex flex-col p-6 gap-3 border border-border/40 rounded-lg bg-card shadow-sm backdrop-blur-sm transition-all hover:shadow-md">

                {/* name input */}
                <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                    <input
                        className="font-serif text-xl w-full outline-none bg-transparent placeholder:text-muted-foreground/50"
                        value={name}
                        placeholder='Añade un titulo para tu formulario'
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* description input */}
                <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                    <input
                        className="font-sans w-full text-base text-muted-foreground outline-none bg-transparent placeholder:text-muted-foreground/40"
                        placeholder='Añade una descripcion para tu formulario'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* minimalist toolbar   */}
            <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Constructor</span>
                    <div className="h-px flex-1 bg-border/20 mx-4" />
                </div>

                <div className="flex flex-wrap items-center gap-1">
                    <FieldAddButton
                        icon={<Type className="size-3.5" />}
                        label="Texto"
                        onClick={() => addField("text")}
                    />
                    <FieldAddButton
                        icon={<Hash className="size-3.5" />}
                        label="Número"
                        onClick={() => addField("number")}
                    />
                    <FieldAddButton
                        icon={<AlignLeft className="size-3.5" />}
                        label="Área de texto"
                        onClick={() => addField("textarea")}
                    />
                    <FieldAddButton
                        icon={<ListFilter className="size-3.5" />}
                        label="Selección"
                        onClick={() => addField("select")}
                    />
                    <FieldAddButton
                        icon={<CircleDot className="size-3.5" />}
                        label="Radio"
                        onClick={() => addField("radio")}
                    />
                    <FieldAddButton
                        icon={<CheckSquare className="size-3.5" />}
                        label="Check"
                        onClick={() => addField("checkbox")}
                    />
                    <FieldAddButton
                        icon={<Minus className="size-3.5" />}
                        label="Separador"
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
        </div>
    )
}