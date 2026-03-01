# 📸 PROJECT SNAPSHOT — nexjs-form-creator

> Generado: 2026-03-01 · Estado: en desarrollo activo

---

## 🧠 ¿Qué hace este proyecto?

**Form Creator** es una aplicación web para **médicos/doctores** que les permite crear formularios personalizados de anamnesis o evaluación clínica, enviar links únicos a pacientes, y ver las respuestas recibidas desde su dashboard.

**Flujo principal:**
1. El doctor se registra / loguea con Clerk.
2. Se le crea automáticamente un perfil `Doctor` en la base de datos.
3. Crea formularios con campos dinámicos desde el FormBuilder.
4. El doctor habilita el acceso público → se genera un link único (`publicToken`).
5. El doctor envía el link al paciente → el paciente completa el formulario (en desarrollo).
6. El doctor ve las respuestas en su dashboard.

---

## 🗂️ Estructura de carpetas

```
nexjs-form-creator/
├── @types/
│   └── types.ts                  # Tipos globales TypeScript
├── actions/
│   └── forms/
│       └── forms.ts              # Server Actions (CRUD, Public Access)
├── app/
│   ├── (dashboard)/              # Rutas con Navbar y Footer
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── (list)/           # Lista de formularios (page.tsx)
│   │   │   └── [formId]/         # Detalle y edición
│   │   ├── about/
│   │   ├── profile/
│   │   └── sign-in / sign-up /
│   ├── (public)/                 # Rutas limpias (sin Navbar/Footer)
│   │   ├── layout.tsx
│   │   └── form/[token]/         # Vista pública para el paciente
│   ├── api/                      # Endpoints (legacy/stubs)
│   ├── layout.tsx                # Root layout (Providers solamente)
│   ├── globals.css
│   └── page.tsx                  # Landing page (redirige a dashboard)
├── components/
│   ├── ui/                       # Componentes de Shadcn UI
│   ├── Dashboard/                # Componentes del panel de control
│   ├── FormBuilder/              # Editor de formularios (Artesano)
│   ├── FormPlayer/               # Visualizador de formularios (Paciente)
│   │   ├── FormPlayer.tsx        # Lógica de pasos y validación
│   │   ├── FieldRenderer.tsx     # Renderizado dinámico de campos
│   │   └── FormDisabled.tsx      # Pantalla para formularios cerrados
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── screensizehelper.tsx      # Utilidad de desarrollo (viewport size)
├── lib/
│   ├── prisma.ts                 # Cliente Prisma
│   └── get-or-create-doctor.ts   # Integración Clerk -> DB
├── prisma/
│   └── schema.prisma             # Modelos PostgreSQL
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
| `publicToken` | `String?` (unique)| Token para acceso público (nanoid) |
| `isPublicOpen` | `Boolean` | Si el formulario acepta respuestas públicas |
| `version` | `Int` | default 1 |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | @updatedAt |

**Índices:** `doctorId`, `isActive`, `publicToken`

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

### CRUD Básico
- `createEmptyForm()`: Crea form inicial.
- `updateForm()`: Actualiza meta y campos. Revalida rutas de dashboard y edición.
- `deleteForm()`: Elimina por ID (⚠️ mejorar seguridad).

### Public Access
- `enablePublicAccess(formId)`: Genera un `publicToken` (si no existe) y activa `isPublicOpen`.
- `disablePublicAccess(formId)`: Desactiva `isPublicOpen`.

---

## 📐 Tipos TypeScript — `@types/types.ts`

```ts
type FieldType = InteractiveFieldType | 'section'
type InteractiveFieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox'

interface FormField {
  id: string
  type: FieldType
  label: string
  required?: boolean
  // ... props específicas por tipo
}

interface PublicAccessResult {
  success: boolean
  message: string
  isPublicOpen?: boolean
  token?: string | null
}
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

### `FormBuilder` (Editor)
- Gestión de estado para `fields` dinámicos.
- Botones de "Guardar" con detección de cambios (`isDirty`).
- **Field Toolbar** para añadir nuevos elementos con micro-animaciones.

### `FormPlayer` (Visualizador)
- **Modo Pasos:** Renderiza una pregunta a la vez (step-by-step).
- **Validación:** Verifica `required` antes de avanzar.
- `FieldRenderer`: Componente recursivo/switch para renderizar el input correcto.
- Utiliza `FormDisabled` si el formulario no está disponible.

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

## 🏁 Estado y Pendientes

| Feature | Estado |
|---|---|
| Auth con Clerk | ✅ Completo |
| CRUD de formularios | ✅ Completo |
| Editor dinámico (FormBuilder) | ✅ Funcional |
| Separación de Layouts (Auth vs Public) | ✅ Completo |
| Gestión de Link Público (Tokens) | ✅ Completo |
| Vista pública del paciente (`FormPlayer`) | 🏗️ En desarrollo |
| Envío de respuestas (submissions) | ❌ Pendiente |
| Lógica condicional (`showIf`) | ❌ Pendiente |
| Dashboard: Tabla de respuestas real | ⚠️ Stub básico |
| Seguridad: Validación de dueño en delete | ⚠️ Gap pendiente |
