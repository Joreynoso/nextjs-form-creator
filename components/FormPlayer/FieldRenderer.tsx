'use client'

import { FormField } from '@/@types/types'

interface Props {
  field: FormField
  value: any
  onChange: (value: any) => void
}

export default function FieldRenderer({ field, value, onChange }: Props) {

  if (field.type === "text") {
    return (
      <input
        className="w-full border rounded px-4 py-2"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        className="w-full border rounded px-4 py-2"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (field.type === "textarea") {
    return (
      <textarea
        className="w-full border rounded px-4 py-2"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (field.type === "radio") {
    return field.options?.map(opt => (
      <label key={opt} className="block">
        <input
          type="radio"
          checked={value === opt}
          onChange={() => onChange(opt)}
        />
        {opt}
      </label>
    ))
  }

  if (field.type === "checkbox") {
    const arr = value ?? []

    return field.options?.map(opt => (
      <label key={opt} className="block">
        <input
          type="checkbox"
          checked={arr.includes(opt)}
          onChange={() => {
            if (arr.includes(opt)) {
              onChange(arr.filter((o: string) => o !== opt))
            } else {
              onChange([...arr, opt])
            }
          }}
        />
        {opt}
      </label>
    ))
  }

  if (field.type === "select") {
    return (
      <select
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded px-4 py-2"
      >
        <option value="">Seleccionar</option>
        {field.options?.map(opt => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return null
}