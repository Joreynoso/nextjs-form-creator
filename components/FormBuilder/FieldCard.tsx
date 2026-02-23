'use client'

import { FormField } from '@/@types/types'

interface FieldCardProps {
  field: FormField
  isActive: boolean
  onSelect: () => void
  onChange: (updated: FormField) => void
  onDelete: () => void
}

export default function FieldCard({
  field,
  isActive,
  onSelect,
  onChange,
  onDelete
}: FieldCardProps) {

  function updateOptions(index: number, value: string) {
    const newOptions = [...(field.options ?? [])]
    newOptions[index] = value
    onChange({ ...field, options: newOptions })
  }

  function addOption() {
    const newOptions = [...(field.options ?? []), "Nueva opción"]
    onChange({ ...field, options: newOptions })
  }

  return (
    <div
      onClick={onSelect}
      className={` bg-card border rounded-lg p-4 space-y-3 ${
        isActive ? "border-primary bg-muted/40" : "border-border"
      }`}
    >
      {/* Label */}
      <input
        className="w-full font-medium outline-none bg-transparent"
        value={field.label}
        onChange={(e) =>
          onChange({ ...field, label: e.target.value })
        }
      />

      {/* Render según tipo */}
      {field.type === "text" && (
        <input
          className="w-full border rounded p-2 text-sm"
          placeholder="Respuesta corta"
          disabled
        />
      )}

      {field.type === "textarea" && (
        <textarea
          className="w-full border rounded p-2 text-sm"
          placeholder="Respuesta larga"
          disabled
        />
      )}

      {(field.type === "select" ||
        field.type === "radio" ||
        field.type === "checkbox") && (
        <div className="space-y-2">
          {field.options?.map((opt, i) => (
            <input
              key={i}
              className="w-full border rounded p-2 text-sm"
              value={opt}
              onChange={(e) => updateOptions(i, e.target.value)}
            />
          ))}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              addOption()
            }}
            className="text-xs text-primary"
          >
            + Agregar opción
          </button>
        </div>
      )}

      {field.type === "section" && (
        <div className="text-sm text-muted-foreground">
          Separador visual
        </div>
      )}

      {/* Required */}
      {field.type !== "section" && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={field.required ?? false}
            onChange={(e) =>
              onChange({ ...field, required: e.target.checked })
            }
          />
          Requerido
        </label>
      )}

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="text-destructive text-sm"
      >
        Eliminar
      </button>
    </div>
  )
}