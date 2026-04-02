# 📸 PROJECT SNAPSHOT — nexjs-form-creator

> Generado: 2026-04-02 · Estado: en desarrollo activo · Versión Next.js: 16.1.6

---

## 🧠 ¿Qué hace este proyecto?

**Form Creator** es una plataforma premium para **profesionales de la salud** (médicos/doctores) que simplifica la creación de historias clínicas y evaluaciones. Permite diseñar formularios dinámicos, compartirlos mediante links seguros y analizar las respuestas con una experiencia de usuario de primer nivel.

**Flujo principal:**
1. **Acceso:** El doctor se autentica vía Clerk (Google/Email).
2. **Sync:** Se crea/recupera automáticamente su perfil `Doctor` en PostgreSQL.
3. **Diseño:** Crea formularios personalizados en el `FormBuilder`.
4. **Publicación:** Activa el acceso público generando un `publicToken` único.
5. **Paciente:** Completa el formulario en una interfaz tipo "Typeform" (paso a paso, animada).
6. **Análisis:** El doctor recibe notificaciones y visualiza respuestas y estadísticas en su dashboard.

---

## 🗂️ Estructura de carpetas (Actualizada)

```
nexjs-form-creator/
├── actions/
│   ├── doctors/
│   │   └── sync.ts               # Sincronización de perfiles Doctor con Clerk
│   └── forms/
│       ├── access.ts             # Gestión de tokens y acceso público
│       ├── crud.ts               # Creación, actualización y borrado
│       └── submissions.ts        # Administración de envíos
├── app/
│   ├── (dashboard)/              # Rutas con Sidebar y Navbar (Protegidas)
│   │   ├── layout.tsx            # Layout con navegación lateral
│   │   ├── dashboard/            # /dashboard (lista) y /dashboard/[id] (detalle)
│   │   ├── profile/              # Gestión de cuenta del doctor
│   │   └── sign-in / sign-up /   # Páginas de Clerk customizadas
│   ├── (public)/                 # Rutas de cara al paciente (Limpias)
│   │   ├── layout.tsx            # Sin elementos de navegación interna
│   │   └── form/[token]/         # Renderizado del formulario para el paciente
│   ├── api/                      # API Endpoints
│   │   └── public/               # Endpoints abiertos (Submit de respuestas)
│   ├── layout.tsx                # Root layout (Providers: Clerk, Theme, Sonner)
│   ├── globals.css               # Tailwind CSS v4 & Custom Design Tokens
│   └── page.tsx                  # Landing Page principal
├── components/
│   ├── ui/                       # Basado en shadcn/ui (Radix + Tailwind)
│   ├── Dashboard/                # Layout del panel, Listas y StatsCards
│   ├── FormBuilder/              # Constructor visual de formularios
│   │   ├── fields/               # Subcomponentes (Cards, List, Skeletons)
│   │   ├── toolbar/              # Barra de herramientas y controles extras
│   │   └── index.ts              # Export centralizado (Barrel)
│   ├── FormPlayer/               # Motor de visualización (Step-by-step UI)
│   ├── Submissions/              # Visualización de respuestas y tablas
│   ├── Hero/                     # Componentes de la Landing
│   ├── providers/                # Wrappers (ThemeProvider, etc.)
│   ├── navbar.tsx / footer.tsx   # Navegación global
│   ├── sidebar.tsx               # Menú lateral del dashboard
│   └── themetoggle.tsx           # Switcher Dark/Light
├── lib/
│   ├── validators/               # Lógica compartida de validaciones
│   │   └── submission.validator.ts 
│   ├── prisma.ts                 # Cliente singleton de Prisma
│   └── utils.ts                  # Helpers estilo tailwind-merge y clasx
├── prisma/
│   └── schema.prisma             # Modelado de datos (PostgreSQL)
├── types/                        # Tipos modulares
│   ├── doctor.types.ts
│   ├── form.types.ts
│   └── submission.types.ts
└── middleware.ts                  # Control de acceso con Clerk
```

---

## 🗄️ Modelos Prisma (Core)

### `Doctor`
Perfil principal. Vinculado a Clerk vía `userId`. Posee formularios y respuestas en cascada.

### `Form`
Contenedor del diseño. Almacena la estructura en `fields` (Json).
- `publicToken`: Identificador único para el paciente.
- `isPublicOpen`: Switch maestro de accesibilidad.

### `FormSubmission`
Registro de una respuesta.
- `token`: Link de sesión único para evitar colisiones.
- `status`: `pending` (empezado), `completed`, `expired` (timeout de 30m).

---

## ⚡ Server Actions (Lógica de Negocio)

Ahora modularizadas en dominios específicos para mayor mantenibilidad e inyección de dependencias más limpia:
- **`actions/forms/crud.ts`**: `createEmptyForm()`, `updateForm()`, `deleteForm()`
- **`actions/forms/access.ts`**: `enablePublicAccess()`
- **`actions/forms/submissions.ts`**: `getFormSubmissions()`
- **`actions/doctors/sync.ts`**: `getOrCreateDoctor()` (movido desde `/lib`)
- **`lib/validators/submission.validator.ts`**: Validaciones compartidas Cliente/Servidor (`validateField`, `validateSubmission`)

---

## 🔌 API Endpoints (Public)

| Ruta | Método | Descripción |
|---|---|---|
| `/api/public/submissions/[token]` | `GET` | Recupera estructura del form para el paciente. |
| `/api/public/submissions/[token]` | `POST` | Persiste las respuestas finales del paciente. |

---

## 🖥️ Experiencia de Usuario (UX/UI)

### Visualizador Premium (`FormPlayer`)
- **Typeform Style**: Una sola tarea cognitiva a la vez.
- **Responsive-First**: Optimizado para que pacientes completen desde su smartphone.
- **Feedback Visual**: Tarjetas interactivas con estados `hover/active` y micro-animaciones CSS.

### Dashboard de Doctor
- **Dark Mode Native**: Integración perfecta con el sistema operativo.
- **Real-time Revalidation**: Los datos se actualizan sin refrescar la página tras acciones.

---

## 📦 Stack Tecnológico

| Dependencia | Versión | Rol |
|---|---|---|
| `Next.js` | `16.1.6` | App Router & React Server Components |
| `React` | `19.2.3` | UI Library |
| `Tailwind CSS` | `v4.0.0` | Styling Engine (Zero-runtime) |
| `@clerk/nextjs` | `^6.37.3` | Auth & Identity |
| `Prisma` | `^7.3.0` | Database ORM |
| `Radix UI` | `^1.4.3` | Primitivas de UI accesibles |
| `Lucide React` | `^0.563.0` | Icons |

---

## 🏁 Estado de Funcionalidades

| Feature | Estado |
|---|---|
| Autenticación Doctor (Clerk) | ✅ Completado |
| CRUD de Formularios | ✅ Completado |
| Editor de Campos (JSON) | ✅ Funcional |
| Vista Pública (FormPlayer) | ✅ Completado |
| Gestión de Respuestas (Submissions) | ✅ Funcional |
| Estadísticas en Dashboard | ✅ Básico |
| Soporte Dark/Light Mode | ✅ Implementado |
| Multilenguaje (Doctor/Paciente) | 🟡 En progreso |
| Exportación a PDF/CSV | ❌ Pendiente |
