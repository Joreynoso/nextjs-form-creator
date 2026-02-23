'use client'

// import componentes
import { useState } from "react"
import { FormField, FieldType, Form } from '@/@types/types'
import { Button } from '../ui/button'
import { updateForm } from '@/actions/forms/forms'
import FieldCard from './FieldCard'
import FieldEmpty from './FieldEmpty'
import { toast } from 'sonner'
import { Check, MessageCircleWarning } from 'lucide-react'

interface FormBuilderProps {
    initialFields?: FormField[]
    form?: Form
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
    const [originalName] = useState(form?.name ?? "")
    const [originalDescription] = useState(form?.description ?? "")

    // verificar si el formulario tiene cambios "isDirty"
    const isDirty = name !== originalName || description !== originalDescription

    // handleSave
    async function handleSave() {
        if (!form?.id) return
        try {
            setLoading(true)
            const result = await updateForm(form.id, name, description)
            if (!result.success) {
                toast.error(result.message)
                setLoading(false)
                return
            }
            toast.success(result.message)
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

    const checkSaved = (
        <div className='w-8 h-8 rounded-full aspect-square flex justify-center items-center bg-secondary'>
            <Check className="w-4 h-4" />
        </div>
    )

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
                    <span className="text-sm text-accent flex items-center gap-2">
                        {unsaveAlert} Cambios sin guardar
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
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
                <input
                    className="text-xl font-medium w-full outline-none bg-transparent text- placeholder:text-muted-foreground/50"
                    value={name}
                    placeholder='Añade un titulo para tu formulario'
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full text-base text-muted-foreground outline-none bg-transparent placeholder:text-muted-foreground/40"
                    placeholder='Añade una descripcion para tu formulario'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* action buttons   */}
            <div className="flex gap-2 flex-wrap items-center">
                <span className="text-sm font-medium text-muted-foreground mr-2">Agregar campo:</span>
                <Button variant="outline" size="sm" onClick={() => addField("text")}>Texto</Button>
                <Button variant="outline" size="sm" onClick={() => addField("textarea")}>Texto largo</Button>
                <Button variant="outline" size="sm" onClick={() => addField("select")}>Lista desplegable</Button>
                <Button variant="outline" size="sm" onClick={() => addField("radio")}>Opción única</Button>
                <Button variant="outline" size="sm" onClick={() => addField("checkbox")}>Múltiple choice</Button>
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