# 📸 PROJECT SNAPSHOT — nexjs-form-creator

> Generado: 2026-02-27 · Estado: en desarrollo activo

---

## 🧠 ¿Qué hace este proyecto?

**Form Creator** es una aplicación web para **médicos/doctores** que les permite crear formularios personalizados de anamnesis o evaluación clínica, enviar links únicos a pacientes, y ver las respuestas recibidas desde su dashboard.

**Flujo principal:**
1. El doctor se registra / loguea con Clerk.
2. Se le crea automáticamente un perfil `Doctor` en la base de datos.
3. Crea formularios con campos dinámicos desde el FormBuilder.
4. (Pendiente) Envía un link único a un paciente → el paciente completa el formulario.
5. El doctor ve las respuestas en su dashboard.

---

## 🗂️ Estructura de carpetas

```
nexjs-form-creator/
├── @types/
│   └── types.ts                  # Tipos globales TypeScript
├── actions/
│   └── forms/
│       └── forms.ts              # Server Actions (CRUD de formularios)
├── app/
│   ├── api/
│   │   ├── forms/
│   │   │   ├── route.ts          # GET /api/forms, POST /api/forms
│   │   │   └── [formId]/
│   │   │       └── submissions/  # (pendiente implementar)
│   │   ├── patients/
│   │   │   ├── route.ts          # GET/POST /api/patients (stub)
│   │   │   └── generate-link/
│   │   │       └── route.ts      # POST /api/patients/generate-link (stub)
│   │   └── public/
│   │       └── submissions/
│   │           └── [token]/      # (pendiente implementar)
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── (list)/
│   │   │   ├── page.tsx          # Lista de formularios del doctor
│   │   │   └── loading.tsx       # Skeleton screen
│   │   └── [formId]/
│   │       ├── page.tsx          # Detalle + respuestas del formulario
│   │       └── edit/
│   │           └── page.tsx      # Editor del formulario (FormBuilder)
│   ├── form/
│   │   └── [token]/              # (pendiente) Vista pública del formulario para el paciente
│   ├── sign-in/
│   ├── sign-up/
│   ├── about/
│   ├── profile/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing page (redirige a dashboard)
├── components/
│   ├── Dashboard/
│   │   ├── FormCard.tsx
│   │   ├── FormCreate.tsx
│   │   ├── FormDialogDelete.tsx
│   │   ├── FormEmpty.tsx
│   │   ├── PatientTable.tsx
│   │   └── createFormButton.tsx
│   ├── FormBuilder/
│   │   ├── FormBuilder.tsx       # Componente principal del editor
│   │   ├── FieldCard.tsx
│   │   ├── FieldEditor.tsx
│   │   ├── FieldEmpty.tsx
│   │   └── FieldList.tsx
│   ├── PatientForm/
│   ├── Submissions/
│   ├── hero.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   ├── themeprovider.tsx
│   └── themetoggle.tsx
├── lib/
│   ├── prisma.ts                 # Cliente Prisma (singleton con pg adapter)
│   ├── get-or-create-doctor.ts   # Utilidad para obtener/crear doctor desde Clerk
│   ├── clerk-theme.ts
│   └── generated/prisma/         # Cliente generado por Prisma
├── prisma/
│   └── schema.prisma
└── middleware.ts                  # Protección de rutas con Clerk
```

---

## 🗄️ Modelos Prisma

**Provider:** PostgreSQL · **Output:** `lib/generated/prisma`

### `Doctor`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `userId` | `String` (unique) | Clerk User ID |
| `email` | `String` | |
| `firstName` | `String` | |
| `lastName` | `String` | |
| `createdAt` | `DateTime` | default now() |
| `forms` | `Form[]` | relación |
| `submissions` | `FormSubmission[]` | relación |

### `Form`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `doctorId` | `String` | FK → Doctor |
| `name` | `String` | |
| `description` | `String?` | opcional |
| `fields` | `Json` | Estructura dinámica (array de `FormField`) |
| `isActive` | `Boolean` | default true |
| `version` | `Int` | default 1 |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | @updatedAt |

**Índices:** `doctorId`, `isActive`

### `FormSubmission`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `token` | `String` (unique) | Link único del paciente |
| `doctorId` | `String` | FK → Doctor |
| `formId` | `String` | FK → Form |
| `responses` | `Json?` | `{ [fieldId]: value }` |
| `status` | `SubmissionStatus` | `pending` \| `completed` |
| `createdAt` | `DateTime` | |
| `completedAt` | `DateTime?` | |

**Índices:** `doctorId`, `formId`, `status`

### Enum `SubmissionStatus`
```prisma
enum SubmissionStatus {
  pending
  completed
}
```

---

## 🔌 API Endpoints

| Método | Ruta | Auth | Estado | Descripción |
|---|---|---|---|---|
| `GET` | `/api/forms` | ✅ Clerk | ⚠️ Stub | Devuelve mensaje (sin datos reales) |
| `POST` | `/api/forms` | ✅ Clerk | ✅ Funcional | Crea un formulario con `name`, `description`, `fields` |
| `GET` | `/api/patients` | — | ⚠️ Stub | Placeholder |
| `POST` | `/api/patients` | — | ⚠️ Stub | Placeholder |
| `POST` | `/api/patients/generate-link` | — | ⚠️ Stub | Placeholder |
| `POST` | `/api/public/submissions/[token]` | — | ⚠️ Pendiente | Para que el paciente envíe respuestas |

> **Nota:** La lógica real de CRUD se hace principalmente via **Server Actions**, no via API routes.

---

## ⚡ Server Actions — `actions/forms/forms.ts`

Todas usan `"use server"` y verifican autenticación con Clerk.

### `createEmptyForm()`
- Crea un formulario vacío (`fields: []`, nombre por defecto).
- Llama a `getOrCreateDoctor()` para asociar al doctor.
- Llama `revalidatePath("/dashboard")`.
- **Retorna:** `{ success, message, data: form.id }`

### `deleteForm(id: string)`
- Elimina el formulario por `id` sin verificar ownership (⚠️ gap de seguridad potencial).
- Llama `revalidatePath("/dashboard")`.
- **Retorna:** `{ success, message }`

### `updateForm(formId, name, description, fields)`
- Actualiza nombre, descripción y campos del formulario.
- Verifica que el `doctorId` del formulario coincida con el doctor autenticado.
- Llama `revalidatePath("/dashboard")`.
- **Retorna:** `{ success, message, form }`

---

## 📐 Tipos TypeScript — `@types/types.ts`

```ts
type FieldType = InteractiveFieldType | 'section'
type InteractiveFieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox'

interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  options?: string[]        // select, radio, checkbox
  allowOther?: boolean      // "Otro: ___"
  required?: boolean
  showIf?: {                // Lógica condicional (pendiente implementar)
    fieldId: string
    operator: 'equals' | 'includes' | 'notEmpty'
    value: string | string[]
  }
}

interface Form { id, doctorId, name, description?, fields: FormField[], isActive, createdAt, updatedAt }
interface FormWithSubmissions extends Form { submissions: FormResponse[] }
interface Patient { id, token, doctorId, formId, firstName?, lastName?, formResponses?, formCompleted, completedAt?, createdAt, linkSentAt }
interface FormResponse { [fieldId: string]: FieldValue }
type FieldValue = string | number | string[] | null | undefined
```

---

## 🖥️ Páginas y Renderizado

### `/` — Landing Page
- `app/page.tsx` → **Server Component** · Redirige directamente a `/dashboard`.

### `/dashboard` — Lista de Formularios
- `app/dashboard/(list)/page.tsx` → **Server Component (async)**
- Verifica auth con Clerk → si no autenticado, redirige a `/`.
- Llama `getOrCreateDoctor()` + `prisma.form.findMany()`.
- Renderiza `<CreateFormButton />` (Client) + grid de `<FormCard />` (Client) o `<FormEmpty />`.
- Tiene `loading.tsx` con **Skeleton screens**.

### `/dashboard/[formId]` — Ver Respuestas
- `app/dashboard/[formId]/page.tsx` → **Server Component (async)**
- Carga el formulario con sus `submissions` de DB.
- Si el formulario no existe o no es del doctor → `notFound()`.
- Renderiza tabla de respuestas inline (campo/valor) o `<EmptySubmission />`.

### `/dashboard/[formId]/edit` — Editor de Formulario
- `app/dashboard/[formId]/edit/page.tsx` → **Server Component (async)**
- Carga el formulario desde DB, verifica ownership.
- Renderiza `<FormBuilder form={form} />` (Client Component).

---

## 🧩 Componentes Clave

### `FormBuilder` — `components/FormBuilder/FormBuilder.tsx`
**Client Component** (`'use client'`)

**Props:** `initialFields?: FormField[]`, `form?: Form | null`

**Estado interno:**
- `name`, `description` → editables en inputs inline.
- `fields: FormField[]` → array de campos del formulario.
- `activeFieldId` → campo actualmente seleccionado para edición.
- `originalName`, `originalDescription`, `originalFields` → para detectar cambios (`isDirty`).

**Lógica:**
- `isDirty` → compara estado actual vs. original (evita guardado innecesario).
- `handleSave()` → llama `updateForm()` Server Action, actualiza originales, usa `sonner` para toasts.
- `addField(type)` → agrega un `FormField` nuevo con `crypto.randomUUID()`.

**UI:**
- Barra de estado: "Guardado" / "Cambios sin guardar" + botón Guardar.
- Inputs de nombre y descripción inline.
- **Field Toolbar** con botones para: Texto, Número, Área de texto, Selección, Radio, Check, Separador.
- Lista de `<FieldCard />` por cada campo, o `<FieldEmpty />` si no hay campos.

---

### `FormCard` — `components/Dashboard/FormCard.tsx`
**Client Component** (`'use client'`)

**Props:** `form: { id, name, description, isActive, createdAt }`

**Lógica:**
- `handleDeleteForm()` → llama `deleteForm()` Server Action.
- Controla `openDeleteDialog` y `isDeleting` con estado local.

**UI:**
- Card con nombre (font-serif), descripción, badge Activo/Inactivo, fecha.
- Dropdown menu: Ver respuestas · Editar formulario · Eliminar formulario.
- `<FormDialogDelete />` como dialog de confirmación de eliminación.

---

### `createFormButton` — `components/Dashboard/createFormButton.tsx`
**Client Component** — Botón que llama `createEmptyForm()` y redirige al editor con `useRouter`.

---

## 🔐 Autenticación y Middleware

- **Proveedor:** [Clerk](https://clerk.com) — `@clerk/nextjs ^6.37.3`
- **Localización:** `@clerk/localizations ^3.35.3`
- **Middleware:** `middleware.ts`
  - Rutas **públicas:** `/`, `/about`, `/sign-in(.*)`, `/sign-up(.*)`
  - Todas las demás rutas → `auth.protect()` (requieren sesión)

### `getOrCreateDoctor()` — `lib/get-or-create-doctor.ts`
- Obtiene el usuario actual de Clerk (`currentUser()`).
- Busca el `Doctor` en DB por `userId` (Clerk ID).
- Si no existe, lo **crea automáticamente** con email, firstName, lastName de Clerk.
- Permite que la app funcione sin un paso de "onboarding" explícito.

---

## 📦 Dependencias Principales

### Runtime
| Paquete | Versión | Uso |
|---|---|---|
| `next` | `16.1.6` | Framework |
| `react` / `react-dom` | `19.2.3` | UI |
| `@clerk/nextjs` | `^6.37.3` | Auth |
| `@clerk/themes` | `^2.4.51` | Tema Clerk |
| `@clerk/localizations` | `^3.35.3` | Localización Clerk |
| `@prisma/client` | `^7.3.0` | ORM |
| `@prisma/adapter-pg` | `^7.3.0` | Adapter PostgreSQL |
| `pg` | `^8.18.0` | Driver PostgreSQL |
| `next-themes` | `^0.4.6` | Dark/Light mode |
| `lucide-react` | `^0.563.0` | Iconos |
| `sonner` | `^2.0.7` | Toast notifications |
| `radix-ui` | `^1.4.3` | Primitivos UI |
| `clsx` | `^2.1.1` | Clases condicionales |
| `class-variance-authority` | `^0.7.1` | CVA para variantes |
| `tailwind-merge` | `^3.4.0` | Merging de clases Tailwind |
| `nanoid` | `^5.1.6` | IDs únicos |
| `dotenv` | `^17.2.4` | Variables de entorno |

### Dev
| Paquete | Versión | Uso |
|---|---|---|
| `tailwindcss` | `^4` | Estilos |
| `@tailwindcss/postcss` | `^4` | PostCSS plugin |
| `tw-animate-css` | `^1.4.0` | Animaciones Tailwind |
| `prisma` | `^7.3.0` | CLI Prisma |
| `shadcn` | `^3.8.4` | CLI componentes UI |
| `typescript` | `^5` | Tipos |
| `tsx` | `^4.21.0` | Ejecutar TS directamente |
| `eslint` / `eslint-config-next` | `^9` / `16.1.6` | Linting |

---

## 🗺️ Mapa de Rutas

```
/                        → Landing (redirige a /dashboard)
/sign-in                 → Clerk Sign In
/sign-up                 → Clerk Sign Up
/about                   → Página Sobre el proyecto
/profile                 → Perfil del doctor (pendiente)
/dashboard               → Lista de formularios (Server Component)
/dashboard/[formId]       → Ver respuestas del formulario (Server Component)
/dashboard/[formId]/edit  → Editor del formulario → <FormBuilder /> (Client)
/form/[token]            → Vista pública: paciente completa el formulario (pendiente)
```

---

## ⚠️ Estado Actual y Pendientes

| Feature | Estado |
|---|---|
| Auth con Clerk | ✅ Completo |
| CRUD de formularios (Server Actions) | ✅ Funcional |
| FormBuilder (editor de campos) | ✅ Funcional |
| Dashboard lista de formularios | ✅ Funcional |
| Ver respuestas de formularios | ⚠️ Parcial (tabla básica) |
| Eliminar formulario (con dialog) | ✅ Funcional |
| Vista pública del formulario para pacientes | ❌ Pendiente |
| Generar link único para paciente | ❌ Pendiente |
| Enviar respuestas del paciente (submissions) | ❌ Pendiente |
| Lógica condicional de campos (`showIf`) | ❌ Pendiente (tipos definidos, no implementado) |
| Perfil del doctor | ❌ Pendiente |
| `PatientTable` | ❌ Stub vacío |
| Seguridad en `deleteForm` (verificar ownership) | ⚠️ Gap potencial |
