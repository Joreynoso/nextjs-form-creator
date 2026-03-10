# 📸 PROJECT SNAPSHOT — nexjs-form-creator

> Generado: 2026-03-10 · Estado: en desarrollo activo

---

## 🧠 ¿Qué hace este proyecto?

**Form Creator** es una aplicación web para **médicos/doctores** que les permite crear formularios personalizados de anamnesis o evaluación clínica, enviar links únicos a pacientes, y ver las respuestas recibidas desde su dashboard.

**Flujo principal:**
1. El doctor se registra / loguea con Clerk.
2. Se le crea automáticamente un perfil `Doctor` en la base de datos.
3. Crea formularios con campos dinámicos desde el FormBuilder.
4. El doctor habilita el acceso público → se genera un link único (`publicToken`).
5. El doctor envía el link al paciente → el paciente completa el formulario con un estilo premium tipo "Typeform".
6. El doctor ve las respuestas en su dashboard con estadísticas básicas.

---

## 🗂️ Estructura de carpetas

```
nexjs-form-creator/
├── @types/
│   └── types.ts                  # Tipos globales TypeScript
├── actions/
│   └── forms/
│       └── forms.ts              # Server Actions (CRUD, Public Access, Submissions)
├── app/
│   ├── (dashboard)/              # Rutas con Navbar y Footer
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── (list)/           # Lista de formularios + Estadísticas (page.tsx)
│   │   │   └── [formId]/         # Detalle y gestión de respuestas
│   │   ├── about/
│   │   ├── profile/
│   │   └── sign-in / sign-up /
│   ├── (public)/                 # Rutas limpias (sin Navbar/Footer)
│   │   ├── layout.tsx
│   │   └── form/[token]/         # Vista pública premium (Typeform-style)
│   ├── api/                      # Endpoints
│   │   └── public/               # Endpoints abiertos para el paciente
│   │       └── submissions/
│   │           └── [token]/      # GET (datos form) / POST (enviar respuestas)
│   ├── layout.tsx                # Root layout (Providers solamente)
│   ├── globals.css               # Estilos globales y tokens de diseño
│   └── page.tsx                  # Landing page (redirige a dashboard)
├── components/
│   ├── ui/                       # Componentes de Shadcn UI
│   ├── Dashboard/                # Componentes del panel (Cards, Listas de Forms, Stats)
│   ├── FormBuilder/              # Editor de formularios
│   ├── FormPlayer/               # Visualizador premium (Step-by-step)
│   │   ├── FormPlayer.tsx        # Lógica de pasos, numeración y animaciones
│   │   ├── FieldRenderer.tsx     # Renderizado de inputs personalizados (Option Cards)
│   │   └── FormDisabled.tsx      # Pantalla para formularios cerrados
│   ├── Submissions/              # Visualización de respuestas para el Doctor
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── screensizehelper.tsx      # Utilidad de desarrollo
├── lib/
│   ├── prisma.ts                 # Cliente Prisma
│   └── get-or-create-doctor.ts   # Integración Clerk -> DB
├── prisma/
│   └── schema.prisma             # Modelos PostgreSQL (Cascading deletes, Enums)
└── middleware.ts                  # Protección de rutas con Clerk
```

---

## 🗄️ Modelos Prisma

**Provider:** PostgreSQL · **Output:** `../lib/generated/prisma`

### `Doctor`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `userId` | `String` (unique) | Clerk User ID |
| `email` | `String` | |
| `firstName` | `String` | |
| `lastName` | `String` | |
| `createdAt` | `DateTime` | default now() |
| `forms` | `Form[]` | relación (onDelete: Cascade) |
| `submissions` | `FormSubmission[]` | relación (onDelete: Cascade) |

### `Form`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `doctorId` | `String` | FK → Doctor |
| `name` | `String` | |
| `description` | `String?` | |
| `fields` | `Json` | Estructura dinámica |
| `isActive` | `Boolean` | default true |
| `publicToken` | `String?` (unique) | Token para vista pública |
| `isPublicOpen` | `Boolean` | default false |
| `version` | `Int` | default 1 |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

### `FormSubmission`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | `String` (cuid) | PK |
| `token` | `String` (unique) | Link único para el paciente |
| `doctorId` | `String` | FK → Doctor |
| `formId` | `String` | FK → Form |
| `responses` | `Json?` | `{ [fieldId]: value }` |
| `status` | `SubmissionStatus` | `pending` \| `completed` \| `expired` \| `cancelled` |
| `createdAt` | `DateTime` | |
| `completedAt` | `DateTime?` | |

### Enum `SubmissionStatus`
```prisma
enum SubmissionStatus {
  pending
  completed
  expired
  cancelled
}
```

---

## ⚡ Server Actions — `actions/forms/forms.ts`

Lógica centralizada para evitar exposición excesiva de API routes.

- `createEmptyForm()`: Inicializa un formulario para el doctor actual.
- `updateForm()`: Guarda campos y metadatos. Revalida `/dashboard` y rutas de edición.
- `deleteForm()`: Eliminación con cascada habilitada en DB.
- `enablePublicAccess(formId)`: Genera `publicToken` y abre el form al público.
- `disablePublicAccess(formId)`: Cierra el acceso al formulario.
- `expireOldSubmissions(formId)`: Pasa a `expired` las sesiones de más de 30 minutos.
- `deleteSubmission(submissionId, formId)`: Elimina una respuesta específica con validación de dueño.

---

## 🔌 API Endpoints (Public)

| Método | Ruta | Auth | Estado | Descripción |
|---|---|---|---|---|
| `GET` | `/api/public/submissions/[token]` | — | ✅ Funcional | Obtiene estructura del form para el paciente |
| `POST` | `/api/public/submissions/[token]` | — | ✅ Funcional | Envía las respuestas del paciente |

---

## 🖥️ Páginas y Renderizado

### `/dashboard`
Renderiza estadísticas a través de `<StatisticList />` y `<StatisticCard />`. Carga formularios dinámicamente.

### `/form/[token]` — Experiencia del Paciente
Visualizador premium optimizado para mobile y desktop:
- **Stepped UI**: Una pregunta a la vez con numeración.
- **Micro-Animations**: Transiciones de entrada por paso.
- **Custom Inputs**:
  - `Radio/Checkbox`: Tarjetas con letras (A, B, C...) y feedback visual instantáneo.
  - `Select`: Dropdown personalizado que reemplaza al estándar de HTML.
  - `Text/Textarea`: Líneas minimalistas con foco animado.
- **Pantalla Final**: Celebración animada al completar el envío.

---

## 📦 Dependencias Principales

| Paquete | Versión | Uso Princial |
|---|---|---|
| `next` | `16.1.6` | App Router & Server Components |
| `react` | `19.2.3` | UI |
| `@clerk/nextjs` | `^6.37.3` | Gestión de identidades y Auth |
| `@prisma/client` | `^7.3.0` | ORM (PostgreSQL) |
| `lucide-react` | `^0.563.0` | Iconografía premium |
| `tw-animate-css` | `^1.4.0` | Animaciones de Tailwind CSS |
| `sonner` | `^2.0.7` | UI Toasts |
| `nanoid` | `^5.1.6` | Tokens de seguridad |

---

## 🏁 Estado de Funcionalidades

| Feature | Estado |
|---|---|
| Onboarding Doctor (integración Clerk) | ✅ Completo |
| Editor dinámico (FormBuilder) | ✅ Funcional |
| Vista pública Premium (Mode Typeform) | ✅ Completo |
| Envío de respuestas (Submissions) | ✅ Funcional |
| Dashboard con Estadísticas | ✅ Básico/Funcional |
| Lógica condicional (`showIf`) | ❌ Pendiente |
| Reportes avanzados / PDF | ❌ Pendiente |
