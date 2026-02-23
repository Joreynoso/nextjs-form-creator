'use client'

// import componentes
import { useState } from "react"
import { FormField, FieldType, Form } from '@/@types/types'
import { Button } from '../ui/button'
import { updateForm } from '@/actions/forms/forms'
import FieldCard from './FieldCard'
import FieldEmpty from './FieldEmpty'
import { toast } from 'sonner'

interface FormBuilderProps {
    initialFields?: FormField[]
    form?: Form
}

export default function FormBuilder({ initialFields, form }: FormBuilderProps) {

    // local states
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
            const result = await updateForm(form.id, name, description)
            if (!result.success) {
                toast.error(result.message)
                return
            }
            toast.success(result.message)
        } catch (error) {
            toast.error("Error al guardar el formulario")
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

    // render return
    return (
        <div className="space-y-6">

            {/* isDirty section */}
            <div className="w-full flex items-center justify-between mb-4">

                {isDirty ? (
                    <span className="text-sm text-amber-500">
                        Cambios sin guardar
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">
                        Guardado
                    </span>
                )}

                <button
                    disabled={!isDirty}
                    onClick={handleSave}
                    className={`
        px-4 py-2 rounded-md text-sm font-medium
        ${isDirty
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground cursor-not-allowed"}
    `}
                >
                    Guardar
                </button>

            </div>

            {/* nombre y descripcion */}
            <div className="flex flex-col p-5 gap-2 border rounded-xl bg-card shadow-sm">
                <input
                    className="text-lg w-full outline-none rounded-md"
                    value={name}
                    placeholder='Añade un titulo para tu formulario'
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full text-sm text-muted-foreground outline-none rounded-md resize-none"
                    placeholder='Añade una descripcion para tu formulario'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* action buttons  */}
            <div className="flex gap-2 flex-wrap">
                <Button className='cursor-pointer' variant="outline" onClick={() => addField("text")}>Texto</Button>
                <Button className='cursor-pointer' variant="outline" onClick={() => addField("textarea")}>Texto largo</Button>
                <Button className='cursor-pointer' variant="outline" onClick={() => addField("select")}>Lista desplegable</Button>
                <Button className='cursor-pointer' variant="outline" onClick={() => addField("radio")}>Opción única</Button>
                <Button className='cursor-pointer' variant="outline" onClick={() => addField("checkbox")}>Múltiple choice</Button>
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