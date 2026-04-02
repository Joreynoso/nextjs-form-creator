import { FormField } from '@/types/form.types'
import { Button } from '@/components/ui/button'
import { Trash2, Asterisk } from 'lucide-react'

const fielCardStyle = "bg-linear-to-br from-card to-muted/10 flex flex-col p-8 gap-4 border border-border/40 rounded-3xl shadow-sm shadow-primary/5 backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-3"

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
        ? "border-primary/40 ring-1 ring-primary/10 shadow-md shadow-primary/10 -translate-y-1"
        : "border-border/30 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5"
        }`}
    >
      {/* Label & Title — Contraste mejorado */}
      <div className="flex flex-col gap-2 focus-within:opacity-100 transition-opacity">
        <label className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-[0.2em] mb-1">Pregunta</label>
        <input
          className="w-full font-serif text-2xl md:text-3xl outline-none bg-transparent text-foreground placeholder:text-muted-foreground/40 selection:bg-primary/20 transition-all border-b border-foreground/5 focus:border-primary/20 pb-2"
          value={field.label}
          placeholder="Escribe tu pregunta aquí..."
          onChange={(e) =>
            onChange({ ...field, label: e.target.value })
          }
        />
      </div>

      {/* Render según tipo — Contraste de respuesta +20% */}
      <div className="pt-4">
        {field.type === "text" && (
          <div className="w-full bg-muted/15 border border-border/40 rounded-xl py-3.5 px-5 text-sm text-muted-foreground italic font-sans tracking-wide">
            Escribe aquí la respuesta corta...
          </div>
        )}

        {field.type === "number" && (
          <div className="w-full bg-muted/15 border border-border/40 rounded-xl py-3.5 px-5 text-sm text-muted-foreground italic font-sans tracking-wide">
            0.00
          </div>
        )}

        {field.type === "textarea" && (
          <div className="w-full bg-muted/15 border border-border/40 rounded-xl py-5 px-5 text-sm text-muted-foreground italic font-sans tracking-wide min-h-[100px]">
            Escribe aquí la respuesta extensa...
          </div>
        )}

        {(field.type === "select" ||
          field.type === "radio" ||
          field.type === "checkbox") && (
            <div className="space-y-3">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 group/option">
                  <div className="size-4 rounded-full border border-border/40 bg-muted/20 group-focus-within/option:border-primary/50 transition-colors" />
                  <input
                    className="w-full bg-transparent border-b border-border/30 focus:border-primary/40 outline-none p-1 text-sm text-foreground transition-all placeholder:text-muted-foreground/50"
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

      {/* Footer Actions - Rediseñados */}
      <div className="flex items-center justify-between pt-6 mt-4 border-t border-border/5">
        <div className="flex items-center gap-3">
          {field.type !== "section" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange({ ...field, required: !field.required })
              }}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 text-[11px] font-bold tracking-wider uppercase border ${field.required
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-muted/5 border-border/5 text-muted-foreground/50 hover:bg-muted/10 hover:text-muted-foreground focus:ring-1 focus:ring-primary/20"
                }`}
            >
              <div className={`size-1.5 rounded-full transition-all duration-500 ${field.required ? "bg-primary scale-125 shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-muted-foreground/30"}`} />
              Requerido
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Delete icon-only */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full size-9 p-0"
            title="Eliminar pregunta"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
