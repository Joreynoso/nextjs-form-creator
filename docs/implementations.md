# 📋 Registro de Implementaciones

Este documento registra cada implementación, corrección o mejora realizada en el proyecto, ordenada cronológicamente.

---

## Implementación 1 — try/catch en `sync.ts` y null-checks en callers

**Fecha**: 2026-06-03
**Referencia**: `docs/improvements.md` — Sección 1 (Seguridad), punto "Falta de Control de Errores (try/catch) en Server Actions"
**Archivos modificados**: 13

### Problema

`getOrCreateDoctor()` en `actions/doctors/sync.ts` lanzaba `throw new Error()` en lugar de retornar un resultado estructurado, lo que podía causar `Unhandled Promise Rejection` si un caller no lo envolvía en try/catch.

### Solución

1. **`actions/doctors/sync.ts`**: Se cambió `getOrCreateDoctor()` para retornar `Doctor | null` en lugar de lanzar excepción. Tanto el caso de usuario no autenticado como errores de Prisma retornan `null`.
2. **Null-checks en todos los callers**: Se agregaron guards después de cada llamada a `getOrCreateDoctor()` para manejar el caso `null`:
   - Server Actions (`actions/forms/crud.ts`, `access.ts`, `submissions.ts`): retornan `{ success: false, message: "No autorizado" }`
   - API Routes (`app/api/forms/route.ts`, `app/api/forms/[formId]/submissions/route.ts`, `app/api/chat/route.ts`): retornan `401 Unauthorized`
   - Páginas (`app/(dashboard)/dashboard/page.tsx`, `edit/page.tsx`, `[formId]/page.tsx`): redirigen con `redirect("/")` o `notFound()`

### Verificación

- `tsc --noEmit`: Sin errores
- `npm run dev`: Compilación exitosa
- Rutas `/` y `/dashboard`: 200 OK

---

## Implementación 2 — Página `/unauthorized`

**Fecha**: 2026-06-03
**Referencia**: `docs/improvements.md` — Sección 1 (Seguridad)
**Archivos modificados**: 4 (`app/unauthorized/page.tsx` creado, 3 pages actualizados)

### Problema

No existía una vista personalizada para errores 401/unauthorized. Los pages callers redirigían a `/` o `notFound()` sin dar feedback al usuario sobre por qué se le negó el acceso.

### Solución

1. **`app/unauthorized/page.tsx`**: Nueva página con estilo consistente a `not-found.tsx` (mismo layout: título grande, texto descriptivo, botón "Volver al inicio").
2. **Pages actualizados**: Los 3 pages que redirigían por `!doctor` ahora apuntan a `/unauthorized`:
   - `app/(dashboard)/dashboard/(list)/page.tsx`: `redirect("/unauthorized")`
   - `app/(dashboard)/dashboard/[formId]/edit/page.tsx`: `redirect("/unauthorized")`
   - `app/(dashboard)/dashboard/[formId]/page.tsx`: `redirect("/unauthorized")`

### Verificación

- `tsc --noEmit`: Sin errores
- `npm run dev`: Servidor compila sin errores

---

## Implementación 3 — Validación Zod en payloads de submissions

**Fecha**: 2026-06-03
**Referencia**: `docs/improvements.md` — Sección 1 (Seguridad), punto "Falta de Validación de Payloads en el Backend"
**Archivos modificados**: 4 (`lib/schemas/submission.schema.ts` creado, 2 API routes actualizados, 1 archivo actualizado)

### Problema

Los endpoints públicos de submissions (`/api/public/submissions/[token]` y `/api/public/forms/[publicToken]/submit`) recibían el payload `responses` sin validación estructural vía Zod. Solo tenían un chequeo básico de tipo (`typeof responses !== 'object'`), permitiendo datos corruptos o maliciosos.

### Solución

1. **`lib/schemas/submission.schema.ts`**: Nuevo schema Zod `SubmissionResponsesSchema` que valida:
   - `responses` debe ser un objeto (`Record<string, FieldValue>`)
   - Cada valor puede ser: `string` (max 5000 chars), `number`, `boolean`, `string[]` (max 100 items), o `null`
   - Previene la inyección de tipos no esperados y datos malformados

2. **`app/api/public/submissions/[token]/route.ts`**: Reemplazado el `typeof` check por `SubmissionResponsesSchema.safeParse()`. Los datos validados (`parsed.data`) se pasan tanto a `validateSubmission()` como a Prisma.

3. **`app/api/public/forms/[publicToken]/submit/route.ts`**: Misma validación Zod aplicada.

### Verificación

- `tsc --noEmit`: Sin errores
- `npm run dev`: Compilación exitosa, rutas `/`, `/dashboard`, `/dashboard/chat` responden 200

---

## Implementación 4 — Corrección de rutas públicas en middleware

**Fecha**: 2026-06-03
**Referencia**: `docs/improvements.md` — Sección 1, `docs/mpc_improvements.md` — Sección 1
**Archivos modificados**: 1 (`middleware.ts`)

### Problema

El middleware de Clerk solo tenía como públicas las rutas `/`, `/about`, `/sign-in`, `/sign-up` y `/api/chat`. Esto causaba que:
- Las rutas de pacientes (`/form/[token]`, `/api/public/*`) redirigieran al login, rompiendo el flujo de pacientes
- La página `/unauthorized` (recién creada) no fuera accesible sin sesión
- `/api/chat` estuviera pública innecesariamente, exponiendo el consumo de Groq

### Solución

Se actualizó `createRouteMatcher` en `middleware.ts`:

| Ruta | Antes | Después |
|------|-------|---------|
| `/api/chat(.*)` | Pública | **Protegida** |
| `/form(.*)` | Protegida | **Pública** |
| `/api/public(.*)` | Protegida | **Pública** |
| `/unauthorized` | Protegida | **Pública** |

### Verificación

- `tsc --noEmit`: Sin errores

---

## Implementación 5 — Rate limiting in-memory

**Fecha**: 2026-06-03
**Referencia**: `docs/improvements.md` — Sección 1 (Seguridad), punto "Ausencia de Rate Limiting"
**Archivos creados/modificados**: 4 (`lib/rate-limiter.ts` creado, 3 API routes actualizados)

### Problema

Los endpoints públicos de envío de formularios y el chat de IA no tenían límite de peticiones, permitiendo abuso (DDoS, consumo de créditos de Groq, llenado de DB con submissions falsas).

### Solución

1. **`lib/rate-limiter.ts`**: Rate limiter in-memory con:
   - Store basado en `Map<string, { count, resetAt }>`
   - Limpieza periódica cada 5 minutos para evitar memory leaks
   - Helper `getClientIp()` para extraer IP del request desde headers estándar (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`)

2. **`app/api/chat/route.ts`**: 20 requests/minuto por `userId`

3. **`app/api/public/submissions/[token]/route.ts`**: 5 requests/minuto por IP + token

4. **`app/api/public/forms/[publicToken]/submit/route.ts`**: 5 requests/minuto por IP + publicToken

### Verificación

- `tsc --noEmit`: Sin errores
- Prueba unitaria del rate limiter: límite de 3 requests, el 4to es bloqueado correctamente, diferentes IPs tienen contadores independientes

---

## Implementación 6 — Feedback visual para rate limiting

**Fecha**: 2026-06-03
**Referencia**: `docs/improvements.md` — Sección 1 (Seguridad)
**Archivos modificados**: 2

### Problema

Cuando el rate limiter bloqueaba una petición (429), el usuario solo recibía un JSON crudo sin feedback visual. El FormPlayer mostraba "No se pudo enviar el formulario" genérico, y el chat mostraba "Error al procesar tu solicitud". Sin indicación de que debía esperar.

### Solución

1. **`components/FormPlayer/FormPlayer.tsx`**: Detección específica de `res.status === 429`. Muestra mensaje claro: "Has enviado demasiadas solicitudes. Espera un minuto e intenta de nuevo." con toast y error inline.

2. **`app/(dashboard)/dashboard/chat/page.tsx`**: Se agregó:
   - Verificación de `response.ok` antes de parsear JSON (evita errores silenciosos)
   - Detección de 429 con mensaje específico: "Has enviado demasiados mensajes. Espera un minuto e intenta de nuevo."
   - Manejo de `!response.ok` genérico para otros errores HTTP

### Límites aplicados

| Endpoint | Límite | Clave |
|----------|--------|-------|
| `POST /api/chat` | 20 req/min | `userId` |
| `POST /api/public/*` | 5 req/min | IP + token |

### Verificación

- `tsc --noEmit`: Sin errores
