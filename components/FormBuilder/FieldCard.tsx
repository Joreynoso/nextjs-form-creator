import { FormField } from '@/@types/types'
import { Button } from '../ui/button'

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
      className={`bg-card border p-5 space-y-4 rounded-lg shadow-sm transition-all duration-200 ${isActive ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "border-border/40 hover:shadow-md"
        }`}
    >
      {/* Label */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Etiqueta de la pregunta</label>
        <input
          className="w-full font-medium text-lg outline-none bg-transparent text-foreground placeholder:text-muted-foreground/30"
          value={field.label}
          onChange={(e) =>
            onChange({ ...field, label: e.target.value })
          }
        />
      </div>

      {/* Render según tipo */}
      <div className="pt-2">
        {field.type === "text" && (
          <input
            className="w-full bg-secondary/30 border border-border/40 rounded-md p-3 text-sm text-foreground/70"
            placeholder="Respuesta corta"
            disabled
          />
        )}

        {field.type === "textarea" && (
          <textarea
            className="w-full bg-secondary/30 border border-border/40 rounded-md p-3 text-sm text-foreground/70 resize-none"
            placeholder="Respuesta larga"
            disabled
            rows={2}
          />
        )}

        {(field.type === "select" ||
          field.type === "radio" ||
          field.type === "checkbox") && (
            <div className="space-y-3">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-4 rounded-full border border-border/60 bg-secondary/20" />
                  <input
                    className="w-full bg-transparent border-b border-border/20 focus:border-primary/50 outline-none p-1 text-sm text-foreground transition-colors"
                    value={opt}
                    onChange={(e) => updateOptions(i, e.target.value)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  addOption()
                }}
                className="mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                + Agregar opción
              </button>
            </div>
          )}

        {field.type === "section" && (
          <div className="h-px w-full bg-border/40 my-4" />
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/20">
        <div className="flex items-center gap-6">
          {field.type !== "section" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer group">
              <input
                type="checkbox"
                className="size-4 rounded border-border/40 text-primary focus:ring-primary/20"
                checked={field.required ?? false}
                onChange={(e) =>
                  onChange({ ...field, required: e.target.checked })
                }
              />
              <span className="group-hover:text-foreground transition-colors">Requerido</span>
            </label>
          )}
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3"
        >
          Eliminar
        </Button>
      </div>
    </div>
  )
}