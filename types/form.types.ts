import { Prisma } from '@/lib/generated/prisma';

// Tipos de campos soportados
export type FieldType =
  | InteractiveFieldType
  | 'section'

export type InteractiveFieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'

// Operadores para lógica condicional
export type ConditionalOperator =
  | 'equals'      // Igual a un valor
  | 'includes'    // Incluye un valor (para checkbox)
  | 'notEmpty';   // Tiene algún valor


export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];           // Para select, radio, checkbox
  allowOther?: boolean;         // Permite "Otro: ___"
  required?: boolean;
  showIf?: {
    fieldId: string;
    operator: ConditionalOperator;
    value: string | string[];
  };
}

export interface Form {
  id: string;
  doctorId: string;
  name: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  publicToken: string | null;
  isPublicOpen: boolean;
}

export type FormWithSubmissions =
  Prisma.FormGetPayload<{
    include: { submissions: true }
  }>

export type PublicAccessResult = {
  success: boolean
  isPublicOpen?: boolean
  token?: string | null
  message?: string
}
