'use client'

import { FormField } from '@/types/form.types'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { FieldValue } from '@/types/submission.types'

interface Props {
  field: FormField
  value: FieldValue
  onChange: (value: FieldValue) => void
}

export default function FieldRenderer({ field, value, onChange }: Props) {

  const inputBaseClasses = "w-full bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none py-2 text-xl font-sans font-normal transition-all placeholder:text-muted-foreground/30 placeholder:font-sans placeholder:font-normal"

  // type section
  if (field.type === "section") {
    return null
  }

  // type text
  if (field.type === "text") {
    return (
      <input
        className={inputBaseClasses}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        placeholder="Escribe tu respuesta aquí..."
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  // type numbre
  if (field.type === "number") {
    return (
      <input
        type="number"
        className={inputBaseClasses}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        placeholder="0"
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  // type textarea
  if (field.type === "textarea") {
    return (
      <textarea
        className={cn(inputBaseClasses, "min-h-[100px] resize-none")}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        placeholder="Escribe tu respuesta larga aquí..."
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  // type radio
  if (field.type === "radio") {
    return (
      <div className="grid gap-2.5 max-w-md">
        {field.options?.map((opt, index) => {
          const isSelected = value === opt
          const letter = String.fromCharCode(65 + index) // A, B, C...

          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                "group flex items-center p-0.5 rounded-md border-2 transition-all text-left",
                isSelected
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-background border-primary/10 hover:border-primary/40"
              )}
            >
              <div className="flex items-center w-full gap-3">
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded border text-[10px] font-bold transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-primary/20 group-hover:bg-primary/5 text-primary"
                )}>
                  {letter}
                </div>
                <span className={cn(
                  "text-base font-medium py-1.5",
                  isSelected ? "text-primary" : "text-foreground/80"
                )}>
                  {opt}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // type checkbox
  if (field.type === "checkbox") {
    const arr: string[] = Array.isArray(value) ? value : []

    return (
      <div className="grid gap-2.5 max-w-md">
        {field.options?.map((opt, index) => {
          const isSelected = arr.includes(opt)
          const letter = String.fromCharCode(65 + index)

          return (
            <button
              key={opt}
              onClick={() => {
                if (isSelected) {
                  onChange(arr.filter((o: string) => o !== opt))
                } else {
                  onChange([...arr, opt])
                }
              }}
              className={cn(
                "group flex items-center p-0.5 rounded-md border-2 transition-all text-left",
                isSelected
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-background border-primary/10 hover:border-primary/40"
              )}
            >
              <div className="flex items-center w-full gap-3">
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded border text-[10px] font-bold transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-primary/20 group-hover:bg-primary/5 text-primary"
                )}>
                  {letter}
                </div>
                <span className={cn(
                  "text-base font-medium py-1.5",
                  isSelected ? "text-primary" : "text-foreground/80"
                )}>
                  {opt}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  if (field.type === "select") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="relative max-w-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between bg-background border-2 rounded-md px-4 py-3 text-base transition-all",
            isOpen ? "border-primary shadow-sm" : "border-primary/10 hover:border-primary/30"
          )}
        >
          <span className={cn(value ? "text-primary font-medium" : "text-muted-foreground")}>
            {value || "Seleccionar una opción..."}
          </span>
          <svg
            className={cn("w-4 h-4 text-primary transition-transform duration-200", isOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-background border-2 border-primary/10 rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {field.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center justify-between group",
                  value === opt ? "bg-primary/10 text-primary" : "text-foreground/80"
                )}
              >
                <span>{opt}</span>
                {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}
