import { FormField } from '@/types/form.types'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      className={cn(
        "flex flex-col gap-6 rounded-2xl border bg-card py-6 text-card-foreground shadow-sm transition-all cursor-pointer",
        isActive
          ? "border-l-4 border-l-primary border-t-border border-r-border border-b-border shadow-md"
          : "border-border hover:border-input"
      )}
    >
      {/* Question Header */}
      <div className="grid gap-2 px-6">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          {field.type === "section" ? "Título de Sección" : "Pregunta"} {field.required && <span className="text-destructive">*</span>}
        </label>
        <input
          className="w-full font-serif text-2xl md:text-3xl outline-none bg-transparent text-foreground placeholder:text-muted-foreground/20 transition-all tracking-tight border-b border-b-transparent focus:border-primary/60 pb-2"
          value={field.label}
          placeholder={field.type === "section" ? "Nombre de la sección..." : "Escribe tu pregunta..."}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Content — Always visible and stable */}
      <div className="px-6 flex flex-col gap-5">
        {field.type === "text" && (
          <div className="h-10 w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm text-muted-foreground/60 shadow-xs italic font-sans flex items-center">
            Respuesta corta...
          </div>
        )}

        {field.type === "number" && (
          <div className="h-10 w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm text-muted-foreground/60 shadow-xs italic font-sans flex items-center">
            0.00
          </div>
        )}

        {field.type === "textarea" && (
          <div className="w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm text-muted-foreground/60 shadow-xs italic font-sans min-h-24">
            Respuesta extensa...
          </div>
        )}

        {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
          <div className="grid gap-4">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="size-4 shrink-0 rounded-full border border-input bg-transparent" />
                <input
                  className="flex-1 bg-transparent border-b border-muted focus:border-primary outline-none py-1 text-base text-foreground transition-all placeholder:text-muted-foreground/40 font-sans"
                  value={opt}
                  onChange={(e) => updateOptions(i, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); addOption() }}
              className="text-xs font-semibold text-primary/60 hover:text-primary transition-colors flex items-center gap-2 mt-1"
            >
              <div className="size-4 rounded-md border border-primary/20 flex items-center justify-center text-[10px] bg-primary/5">+</div>
              Añadir opción
            </button>
          </div>
        )}

        {/* No hay más contenido para sección, las líneas divisorias se eliminaron por request */}
      </div>

      {/* Footer — Stable and clear action toggle */}
      <div className="flex items-center justify-between px-6 py-4 mt-2">
        <div className="flex items-center gap-4">
          {field.type !== "section" && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange({ ...field, required: !field.required }) }}
              className={cn(
                "group flex items-center gap-2.5 px-4 py-2 rounded-md border text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm",
                field.required 
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" 
                  : "bg-muted/30 border-border text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 hover:border-muted-foreground/60"
              )}
            >
              <div className={cn(
                "size-2 rounded-full transition-all",
                field.required ? "bg-primary-foreground" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
              )} />
              Marcar como obligatorio
            </button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="size-8 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}