import { FormField } from '@/@types/types'
import { Button } from '../ui/button'
import { Trash2, Asterisk } from 'lucide-react'

const fielCardStyle = "bg-linear-to-br from-secondary/20 to-secondary/5 flex flex-col p-6 gap-3 border border-border/40 rounded-lg shadow-sm backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-500"

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

  // render return
  return (
    <div
      onClick={onSelect}
      className={`${fielCardStyle} ${isActive
        ? "border-primary/50 bg-primary/1"
        : "border-border/30 hover:border-border/60 hover:shadow-md"
        }`}
    >
      {/* Label */}
      <div className="flex flex-col gap-1.5 focus-within:opacity-100 transition-opacity">
        <label className="text-[10px] font-sans font-semibold text-muted-foreground/60 uppercase tracking-widest">Etiqueta de la pregunta</label>
        <input
          className="w-full font-serif text-lg outline-none bg-transparent text-foreground placeholder:text-muted-foreground/30 selection:bg-primary/20"
          value={field.label}
          placeholder="Escribe tu pregunta aquí..."
          onChange={(e) =>
            onChange({ ...field, label: e.target.value })
          }
        />
      </div>

      {/* Render según tipo */}
      <div className="pt-2">
        {field.type === "text" && (
          <div className="w-full bg-secondary/10 border border-border/20 rounded-md py-2.5 px-4 text-sm text-muted-foreground/50 italic">
            Respuesta corta
          </div>
        )}

        {field.type === "number" && (
          <div className="w-full bg-secondary/10 border border-border/20 rounded-md py-2.5 px-4 text-sm text-muted-foreground/50 italic">
            Respuesta numérica
          </div>
        )}

        {field.type === "textarea" && (
          <div className="w-full bg-secondary/10 border border-border/20 rounded-md py-4 px-4 text-sm text-muted-foreground/50 italic min-h-[80px]">
            Respuesta larga
          </div>
        )}

        {(field.type === "select" ||
          field.type === "radio" ||
          field.type === "checkbox") && (
            <div className="space-y-3">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 group/option">
                  <div className="size-4 rounded-full border border-border/40 bg-secondary/10 group-focus-within/option:border-primary/40 transition-colors" />
                  <input
                    className="w-full bg-transparent border-b border-border/10 focus:border-primary/30 outline-none p-1 text-sm text-foreground transition-all placeholder:text-muted-foreground/20"
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
                className="mt-2 text-[11px] font-medium text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5 px-1 underline-offset-4 hover:underline"
              >
                + Agregar opción
              </button>
            </div>
          )}

        {field.type === "section" && (
          <div className="h-px w-full bg-linear-to-r from-transparent via-border/40 to-transparent my-4" />
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-5 mt-3 border-t border-border/10">
        <div className="flex items-center gap-1 h-8">
          {field.type !== "section" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onChange({ ...field, required: !field.required })
              }}
              className={`h-8 px-3 text-xs gap-2 transition-all duration-300 ${field.required
                ? "text-primary bg-primary/10 hover:bg-primary/20 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
            >
              <Asterisk className={`size-3 transition-transform duration-300 ${field.required ? "rotate-30 scale-125" : "rotate-0"}`} />
              Requerido
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 h-8">
          <div className="w-px h-4 bg-border/30 mx-1" />

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 h-8 w-8 p-0 sm:w-auto sm:px-3 gap-2 transition-colors"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
