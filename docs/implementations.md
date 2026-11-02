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

---

## Implementación 7 — Tipografía base con Plus Jakarta Sans

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Sección Typography
**Archivos modificados**: 2 (`app/layout.tsx`, `app/globals.css`)

### Problema

El sistema objetivo usa Roobert PRO, pero aún no se cuenta con su licencia. Además, la configuración anterior cargaba `Source_Serif_4` sin que `globals.css` la utilizara: los tokens apuntaban a `DM Sans` y `Georgia`, por lo que los encabezados se renderizaban con una serif que no pertenece al sistema visual objetivo.

### Solución

1. **`app/layout.tsx`**: Se reemplazó `Source_Serif_4` por `Plus_Jakarta_Sans` (Google Fonts, variable, OFL-1.1), con soporte normal/italic y subsets `latin`/`latin-ext`. Las variables de fuente se aplican en `<html>` y el `<body>` usa `font-sans`.
2. **`app/globals.css`**: `--font-sans` y `--font-serif` ahora apuntan a `var(--font-plus-jakarta)` con fallback `"Noto Sans"` y sistema. `--font-mono` apunta a `var(--font-jetbrains)`.
3. Se mantuvo `JetBrains_Mono` para números tabulares y micro-labels monoespaciados.
4. La sustitución por Roobert PRO queda diferida: al licenciarla solo se cambia el loader y el token, sin tocar las clases `font-sans`/`font-serif`.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes

---

## Implementación 8 — Contrato de tokens del design system

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Sección Token Contract
**Archivos modificados**: 3 (`app/globals.css`, `docs/design-system.md`, `docs/implementations.md`)

### Problema

El design system definía tokens con placeholders (`{colors.brand-yellow}`, `{colors.footer-bg}`, etc.) pero no existían valores concretos ni utilidades Tailwind equivalentes. Esto obligaba a hardcodear colores, radios y sombras durante la migración de componentes, con riesgo de inconsistencias.

### Solución

1. **`app/globals.css`**: Se agregaron tokens `--ds-*` para superficies, texto, marca, semántica, radios y sombras, con valores light en `:root` y equivalentes dark en `.dark`.
2. **`app/globals.css`**: Un nuevo bloque `@theme inline` expone los tokens como utilidades Tailwind: `bg-canvas`, `text-ink`, `border-hairline`, `bg-brand-yellow`, `rounded-pill`, `shadow-card`, `text-heading-2`, `font-display`, etc. No se sobrescribieron los tokens existentes (`--background`, `--primary`, `--border`), por lo que la apariencia actual no cambia.
3. **`docs/design-system.md`**: Se añadió la sección **Token Contract (Implementation)** con las tablas de colores light/dark, radios, sombras y utilidades tipográficas.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- Los tokens son aditivos y aún no se consumen en componentes; la migración visual empieza en la siguiente fase

---

## Implementación 9 — Activación del tema base light-first

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Sección Token Contract
**Archivos modificados**: 5 (`app/globals.css`, `app/layout.tsx`, `lib/clerk-theme.ts`, `docs/design-system.md`, `docs/implementations.md`)

### Problema

Los tokens `--ds-*` ya existían, pero la app seguía usando la paleta antigua: `--background`, `--primary`, `--border`, etc. mantenían valores oklch marrones y `defaultTheme` seguía en `dark`. Por eso fondos, textos, bordes y sombras no cambiaban. Clerk además tenía colores oklch hardcodeados.

### Solución

1. **`app/globals.css`**: Los tokens semánticos existentes (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, charts y sidebar) ahora apuntan a los `--ds-*` en light y dark.
2. **`app/globals.css`**: `--radius` subió a `0.75rem` (12px base) y la escala de sombras se reemplazó por sombras suaves con tintes `rgb(5 0 56)` en light y negro en dark.
3. **`app/layout.tsx`**: `defaultTheme="light"` y `enableSystem={false}`, manteniendo dark disponible desde el toggle.
4. **`lib/clerk-theme.ts`**: Nueva paleta light/dark, `borderRadius: 0.75rem`, Plus Jakarta Sans y clases Tailwind con los tokens nuevos para tarjeta, botones, links y avatares.
5. **`docs/design-system.md`**: Documentado que la app es light-first y que los tokens semánticos ya aliasean el contrato `--ds-*`.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- Smoke test: `/`, `/about` y `/unauthorized` responden HTTP 200
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- La migración de primitivos (`Button`, `Badge`, `Dialog`, etc.) sigue pendiente en la siguiente fase

---

## Implementación 10 — Tarjetas pastel estables en el dashboard

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Pastel feature cards
**Archivos modificados**: 2 (`components/Dashboard/FormCard.tsx`, `docs/implementations.md`)

### Problema

El dashboard había quedado demasiado blanco y negro. El design system ya contempla tarjetas pastel (amarillo, coral, teal y rosa), pero no se estaban usando en la lista de formularios.

### Solución

1. **`components/Dashboard/FormCard.tsx`**: Se agregó una paleta de 5 tonos pastel (`surface-yellow`, `coral-light`, `teal-light`, `rose-light`, `brand-orange-light`) con borde y franja de acento.
2. **`components/Dashboard/FormCard.tsx`**: El tono se elige con un hash determinístico del `form.id`, no con `Math.random()`. Así cada formulario conserva su color entre renders, recargas y sesiones, y no hay errores de hidratación.
3. **`components/Dashboard/FormCard.tsx`**: Se ajustaron textos secundarios, bordes y metadatos para mantener contraste legible sobre fondos pastel en light y dark.
4. La tarjeta conserva el dropdown, los estados activo/público, el copiado de link y las acciones existentes.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- Las utilidades pastel y el hover de elevación se generan en el CSS de producción
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- Los formularios nuevos reciben un tono estable a partir de su ID; no requiere cambios de schema ni migración

---

## Implementación 11 — Migración del primitivo Button y limpieza de radios

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Sección Buttons
**Archivos modificados**: 13 (11 componentes/lógica + 2 documentos)

### Problema

El botón compartido seguía usando radios de 6–8px, alturas de 28–36px y una variante `secondary` rellena. Los CTAs principales no eran pill, los iconos no eran circulares y varios componentes compensaban el primitivo con overrides de radio, color y tamaño. Además, `cn()`/`tailwind-merge` no reconocía los radios custom (`rounded-input`, `rounded-pill`) ni los tamaños tipográficos custom, por lo que las clases podían quedar duplicadas o eliminar el tamaño de texto correcto.

### Solución

1. **`components/ui/button.tsx`**: `default`, `destructive`, `outline` y `secondary` ahora son pill; `ghost` conserva radio de 8px; `link` usa `brand-blue`. Tamaños: default 40px, `sm` 36px, `lg` 44px, `xs` 28px; `icon`, `icon-sm`, `icon-lg` e `icon-xs` son circulares. Se añadieron estados disabled y focus visibles.
2. **`lib/utils.ts`**: `cn()` usa `extendTailwindMerge` con las escalas custom de radio, sombra y tipografía. Así `rounded-pill` puede sobrescribir `rounded-input` en iconos ghost, y `text-button-md`/`text-micro` no se confunden con colores de texto.
3. **Usos críticos limpiados**: `createFormButton`, `hero`, `FormBuilder`, `FormPlayer`, `SubmissionActions`, `FieldAddButton`, `FieldCard`, `themetoggle` y `deleteDialog`. Se eliminaron overrides de radio, altura y color que duplicaban el primitivo.
4. **`deleteDialog`**: overlay a `bg-black/50`, contenedor `rounded-panel`/`shadow-modal`, icono y descripción con contraste ajustado; acciones `secondary` y `destructive`.
5. **`themetoggle`**: el botón dejó de ser rectangular y ahora es un icono circular de 40px.
6. **`docs/design-system.md`**: añadido el mapeo real del primitivo Button y la nota de extensión de `tailwind-merge`.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- Smoke test: `/` y `/about` responden HTTP 200
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- CSS de producción contiene `rounded-pill`, `rounded-input`, `bg-charcoal`, `text-disabled`, `bg-hairline`, `text-button-md`, `text-micro`, `bg-brand-yellow`, `border-hairline-strong` y `shadow-xs`
- Comprobación runtime de `cn(buttonVariants(...))`: ghost icon resuelve solo `rounded-pill`; ghost default conserva `rounded-input`; default conserva `text-button-md`; xs usa `text-micro`
- `git diff --check`: Sin errores de whitespace
- Siguiente fase: primitivos restantes (`Badge`, `Input`/`Textarea`, `Dialog`, `Dropdown`), luego shell/navegación, marketing, producto y QA

---

## Implementación 12 — Mensajes de error contextuales y seguros en Server Actions

**Fecha**: 2026-10-29
**Referencia**: `docs/improvements.md` — Sección 1 (Seguridad), punto "Falta de Control de Errores (try/catch) en Server Actions"
**Archivos modificados**: 8 (1 archivo nuevo, 3 Server Actions, 3 componentes y documentación)

### Problema

Los `catch` de las Server Actions devolvían siempre `"Error inesperado. Intenta de nuevo."`, sin indicar qué operación falló ni qué podía hacer el usuario. Además, algunos callers descartaban el `message` devuelto o mostraban un toast de éxito aunque la acción hubiera fallado.

### Solución

1. **`lib/action-errors.ts`**: Nuevo helper `getActionErrorMessage()` que recibe la acción en lenguaje natural y el contexto de log. Registra el error completo solo en el servidor y devuelve un mensaje seguro según el tipo/código de Prisma:
   - `P2002`: datos duplicados.
   - `P2003`: información relacionada que impide la operación.
   - `P2025`: registro inexistente, eliminado o sin permisos de acceso.
   - `P1000`, `P1001`, `P1002`, `P1008`, `P1017`, `P2024` e inicialización: servicio de datos no disponible.
   - Validación de Prisma: datos enviados inválidos.
   - Cualquier otro caso: mensaje genérico con la acción afectada.
2. **Server Actions actualizadas**: `crud.ts`, `access.ts` y `submissions.ts` usan el helper en todos sus `catch`. Los mensajes ahora indican la operación ("crear el formulario", "eliminar la respuesta", "activar el acceso público", etc.) sin exponer detalles de Prisma, SQL ni stack traces.
3. **`access.ts`**: `"Form not found"` se reemplazó por `"No se encontró el formulario o no tienes permisos para modificarlo."`, manteniendo el chequeo de propiedad.
4. **UI alineada con los mensajes**: `FormCard` muestra `res.message` al fallar el acceso público; `SubmissionActions` solo muestra éxito cuando `result.success` es `true`; `createFormButton` muestra el error si no se obtiene el ID del formulario.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- Los mensajes devueltos al cliente no incluyen códigos, mensajes crudos de Prisma ni detalles internos; esos datos quedan únicamente en `console.error` del servidor

---

## Implementación 13 — Primitivos Badge, Input y Textarea

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Secciones Badges & Status e Inputs & Forms
**Archivos modificados**: 7 (`components/ui/badge.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/hero.tsx`, `app/(dashboard)/dashboard/chat/page.tsx`, `docs/design-system.md`, `docs/implementations.md`)

### Problema

El `Badge` seguía usando radio de 6px, tipografía de 12px y variantes genéricas que no representaban los badges promocionales, tags pastel y estados del design system. Tampoco existían primitivos `Input` ni `Textarea`, por lo que cada formulario o composer definía sus propios campos sin un contrato común de altura, borde, radio, foco y estados deshabilitados.

### Solución

1. **`components/ui/badge.tsx`**: Base migrada a pill de 13px/600. Se añadieron las variantes `yellow` (promo), `tag-yellow`, `tag-purple`, `tag-coral`, `success` y `discount` (radio 6px, micro tipo), manteniendo `default`, `secondary`, `destructive`, `outline`, `ghost` y `link` para compatibilidad.
2. **`components/hero.tsx`**: El badge de lanzamiento ahora usa `variant="yellow"` y `text-micro-uppercase`, sin overrides de radio, borde ni fondo.
3. **`components/ui/input.tsx`**: Nuevo primitivo de 44px, radio 8px, borde `hairline-strong`, superficie canvas, foco brand-blue, placeholder muted, estados disabled/read-only y soporte de `aria-invalid`.
4. **`components/ui/textarea.tsx`**: Nuevo primitivo con el mismo contrato visual, `min-h-28`, resize vertical desactivado por defecto y los mismos estados de validación/foco.
5. **`app/(dashboard)/dashboard/chat/page.tsx`**: Ambos composers usan `Textarea`; conservan el auto-resize, el fondo transparente, el borde integrado, el placeholder y el botón de envío.
6. **`docs/design-system.md`**: Añadidos los mapeos reales de Badge e Input/Textarea. Los campos editoriales del FormBuilder/FormPlayer siguen siendo bespoke hasta que se diseñe una variante específica.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- Smoke test: `/` y `/about` responden HTTP 200; el badge del hero se renderiza
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- CSS de producción contiene `min-h-28`, `rounded-input`, `bg-brand-yellow`, `text-caption`, `text-micro-uppercase`, `bg-success-accent`, `bg-coral-light` y `placeholder:text-disabled`
- Comprobación runtime de `badgeVariants`: `discount` resuelve `rounded-badge` + `text-micro`; el override del hero conserva `rounded-pill` y `text-micro-uppercase`
- Siguiente fase: `Dialog`/`Dropdown` y luego shell/navegación, marketing, producto y QA

---

## Implementación 14 - Primitivos Dialog y Dropdown

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Sección Overlays
**Archivos modificados**: 6 (`components/ui/dialog.tsx` nuevo, `components/ui/deleteDialog.tsx`, `components/ui/dropdown-menu.tsx`, `components/Dashboard/FormCard.tsx`, `docs/design-system.md`, `docs/implementations.md`)

### Problema

El diálogo de eliminación era un overlay manual sin foco atrapado, sin cierre con Escape, sin bloqueo de scroll y sin asociación accesible entre título y descripción. El `DropdownMenu` conservaba radios de 6px, tipografía de 14px sin peso consistente, superficie `popover` y sombra genérica, además de un item destructivo resuelto solo con una clase suelta. También faltaba el primitivo `Dialog` compartido.

### Solución

1. **`components/ui/dialog.tsx`**: Nuevo primitivo basado en Radix con portal, overlay `bg-black/50` + blur, panel `rounded-panel`/`shadow-modal`, botón de cierre accesible, `DialogHeader`/`Footer`/`Title`/`Description` y animaciones de entrada/salida. Radix aporta foco atrapado, bloqueo de scroll, cierre con Escape y restauración de foco.
2. **`components/ui/deleteDialog.tsx`**: Reemplaza el overlay manual por `Dialog`. Conserva las props y el flujo de confirmación, bloquea el cierre con Escape/overlay mientras `isDeleting` está activo y elimina los overrides de tipografía/altura de los botones.
3. **`components/ui/dropdown-menu.tsx`**: Superficie a `bg-canvas`, `rounded-card`, borde `hairline`, `shadow-modal` y padding 6px; items a `rounded-chip`, `text-body-sm`/`font-medium`, padding 12/8px; label a `text-micro-uppercase`; separador a `bg-hairline`. También se corrigió el reenvío de props del `RadioItem`.
4. **`components/Dashboard/FormCard.tsx`**: El menú usa ancho `w-44`, separador antes de la acción destructiva y `variant="destructive"` en lugar de una clase de color aislada.
5. **`docs/design-system.md`**: Añadida la sección Overlays con los contratos reales de Dialog y Dropdown.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- Smoke test: `/` y `/about` responden HTTP 200
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 16 warnings preexistentes
- CSS de producción contiene `rounded-panel`, `rounded-card`, `rounded-chip`, `shadow-modal`, `text-heading-4`, `text-body-sm`, `text-micro-uppercase`, `bg-canvas` y `border-hairline`
- `git diff --check`: Sin errores de whitespace
- Siguiente fase: shell/navegación (Navbar/Footer), luego marketing, producto y QA

---

## Implementación 15 - Shell de navegación y footer

**Fecha**: 2026-10-29
**Referencia**: `docs/design-system.md` — Secciones Navigation y Signature Components
**Archivos modificados**: 5 (`components/navbar.tsx`, `components/footer.tsx`, `app/(dashboard)/layout.tsx`, `docs/design-system.md`, `docs/implementations.md`)

### Problema

La navegación conservaba un borde inferior genérico, no era sticky, el wordmark no usaba la firma amarilla y los enlaces/CTA tenían clases antiguas. El footer era una franja delgada sin jerarquía, el shell no garantizaba que el footer quedara al final en páginas cortas y el menú móvil era un overlay manual sin foco atrapado ni semántica de diálogo.

### Solución

1. **`components/navbar.tsx`**: Barra sticky de 64px sobre `bg-canvas/85` con blur y borde `hairline`. Wordmark con cuadrado amarillo y nombre en serif; enlaces desktop `body-sm`/500 con hover pill; invitados ven login discreto + CTA black-pill; usuarios autenticados ven Dashboard/Chat, salida discreta y avatar de Clerk. El menú móvil pasa a un `Dialog` full-screen con título accesible, enlaces serif grandes, acciones de cuenta y cierre con foco restaurado.
2. **`components/footer.tsx`**: Footer oscuro `bg-footer` con wordmark, descripción y columnas Producto/Recursos/Cuenta; enlaces `on-dark-muted` con hover `on-dark`; barra inferior con crédito y GitHub. Se mantienen solo rutas existentes.
3. **`app/(dashboard)/layout.tsx`**: El shell ahora es una columna `min-h-dvh`; `main` usa `flex-1` y el footer queda al final en páginas cortas. Se eliminó el `min-h` fijo basado en 64px.
4. **`docs/design-system.md`**: Añadidos los mapeos reales de navegación y footer, incluida la decisión de tres columnas por la IA actual de rutas.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- Smoke test: `/` y `/about` responden HTTP 200
- `npm run lint`: Sin errores nuevos; la línea base baja a 6 errores y 14 warnings (se eliminaron dos warnings de `navbar`)
- CSS de producción contiene `bg-footer`, `text-on-dark`, `text-on-dark-muted`, `min-h-dvh`, `text-heading-4` y `bg-brand-yellow`
- `git diff --check`: Sin errores de whitespace
- Siguiente fase: marketing (`Hero`, `CardsHome`, `FAQ`), luego producto y QA

---

## Implementación 16 - Renombrado rápido de formularios desde el Dashboard

**Fecha**: 2026-10-30
**Referencia**: `mejoras.md` — Edición rápida del título desde las tarjetas
**Archivos modificados**: 5 (`lib/schemas/form.schema.ts`, `actions/forms/crud.ts`, `components/Dashboard/RenameFormDialog.tsx` nuevo, `components/Dashboard/FormCard.tsx`, `docs/implementations.md`)

### Problema

El título de cada tarjeta en `/dashboard` era texto estático. Para renombrar un formulario, el doctor debía abrir el editor completo y guardar nombre, descripción y campos, aunque solo quisiera cambiar el título.

### Solución

1. **`lib/schemas/form.schema.ts`**: Nuevo `FormNameSchema` que normaliza con `trim()` y exige entre 1 y 120 caracteres.
2. **`actions/forms/crud.ts`**: Nueva Server Action `renameForm(formId, name)` que valida sesión, doctor y propiedad del formulario, actualiza únicamente `name`, revalida `/dashboard` y las rutas del formulario, y retorna el contrato `{ success, message, form? }`.
3. **`components/Dashboard/RenameFormDialog.tsx`**: Modal accesible basado en `Dialog`/`Input` con autofocus y selección del nombre, contador de caracteres, validación local, guardado con `Enter`, cierre bloqueado durante el guardado y feedback con `toast`.
4. **`components/Dashboard/FormCard.tsx`**: El título ahora es un `<button>` con soporte de teclado, foco visible, icono de lápiz al hover/focus y estado local `displayName` para reflejar el nuevo nombre sin recargar.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run build`: Compilación exitosa; 13/13 páginas estáticas generadas
- `npm run lint`: Sin errores nuevos; la línea base baja a 6 errores y 13 warnings (se eliminó el warning de `loading` sin uso en `FormCard`)
- Flujo cubierto: abrir modal desde el título, cancelar, validar nombre vacío/sin cambios/mayor a 120, guardar y actualizar la tarjeta con toast

---

## Implementación 17 - Animación morph del badge en la carga del Dashboard

**Fecha**: 2026-11-02
**Referencia**: `docs/animations/brand-animation-loading.md`
**Archivos modificados**: 4 (`components/ui/form-loader.tsx` nuevo, `app/(dashboard)/dashboard/(list)/loading.tsx`, `package.json`, `package-lock.json`)

### Problema

La carga de `/dashboard` usaba un spinner genérico de Lucide, sin conexión con la identidad visual de la marca ni con el badge amarillo del wordmark.

### Solución

1. **Dependencias**: Se instalaron `flubber` y `@types/flubber` para interpolar los paths SVG; `framer-motion` ya estaba en el proyecto.
2. **`components/ui/form-loader.tsx`**: Componente cliente que mantiene un cuadrado `bg-brand-yellow` con `rounded-badge` y morpha el path interior entre punto, triángulo, círculo, rombo y F. Cada 650 ms avanza de forma y la F se retiene 1100 ms. Incluye `role="status"` y `aria-label="Cargando"`.
3. **`app/(dashboard)/dashboard/(list)/loading.tsx`**: Reemplaza el `Spinner` por `FormLoader size={48}` centrado verticalmente con el mismo fade-in del loader anterior.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 13 warnings preexistentes en archivos no relacionados

---

## Implementación 18 - Textos sincronizados y reproducción completa del loader del Dashboard

**Fecha**: 2026-11-02
**Referencia**: `docs/animations/brand-animation-loading.md`
**Archivos modificados**: 5 (`components/ui/form-loader.tsx`, `components/Dashboard/DashboardLoadingScreen.tsx` nuevo, `components/Dashboard/DashboardFirstVisitGate.tsx` nuevo, `app/(dashboard)/dashboard/(list)/loading.tsx`, `app/(dashboard)/dashboard/(list)/page.tsx`)

### Problema

El loader del Dashboard no comunicaba progreso con texto y podía desaparecer antes de que el usuario viera el ciclo completo de la animación cuando los datos cargaban rápido.

### Solución

1. **`components/ui/form-loader.tsx`**: Nuevo prop opcional `captions`. Cada caption se muestra debajo del badge y cambia con el mismo `frame` que dispara el morph, con transición de opacidad/desplazamiento y `aria-live="polite"`. Se exporta `FORM_LOADER_CYCLE_MS` (3700 ms = 4 × 650 ms + 1100 ms).
2. **`components/Dashboard/DashboardLoadingScreen.tsx`**: Loader de pantalla completa con los cinco textos: "Cargando formularios...", "Ordenando tus preguntas...", "Poniendo todo en su lugar...", "Afinando los últimos detalles..." y "Casi listo, un momento más...".
3. **`components/Dashboard/DashboardFirstVisitGate.tsx`**: Envoltorio cliente que, en la primera visita de la sesión, muestra el loader durante un ciclo completo antes de revelar el Dashboard. Usa `sessionStorage` (`dashboard-intro-seen`) para no repetirlo en navegaciones posteriores; en visitas posteriores revela el contenido antes del primer pintado mediante un layout effect isomórfico.
4. **`app/(dashboard)/dashboard/(list)/loading.tsx`**: Reutiliza `DashboardLoadingScreen` durante la carga del segmento.
5. **`app/(dashboard)/dashboard/(list)/page.tsx`**: Envuelve el contenido en `DashboardFirstVisitGate`.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npx eslint` sobre los cinco archivos tocados: Sin errores ni warnings
- Flujo esperado: primera visita muestra los cinco estados con su texto durante 3700 ms; visitas posteriores de la misma sesión abren el Dashboard sin intro

---

## Implementación 19 - Contraste de textos e iconos sobre amarillo en modo oscuro

**Fecha**: 2026-11-02
**Archivos modificados**: 8 (`app/globals.css`, `components/ui/badge.tsx`, `components/ui/form-loader.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/footer.tsx`, `components/navbar.tsx`, `components/hero.tsx`)

### Problema

Los contenedores con `bg-brand-yellow` usaban `text-primary`/`text-ink` para su contenido. En modo oscuro esos tokens se invierten a tonos casi blancos, dejando texto e iconos blancos sobre el amarillo brillante con muy poco contraste.

### Solución

1. **`app/globals.css`**: Nuevo token `--ds-on-yellow: #111111` en `:root` y `.dark` (el amarillo de marca es brillante en ambos temas), expuesto como `--color-on-yellow` en `@theme inline`. Así `text-on-yellow` permanece oscuro en los dos temas.
2. **Componentes con fondo `bg-brand-yellow`**: `badge` (`yellow`, `discount`), logo de `navbar` y `footer`, `form-loader` y el icono del badge en `hero` pasan de `text-primary`/`text-ink` a `text-on-yellow`.
3. **`input` y `textarea`**: La selección de texto usa `selection:bg-brand-yellow selection:text-on-yellow` para mantener el contraste al seleccionar.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npm run lint`: Sin errores nuevos; se mantiene la línea base de 6 errores y 13 warnings preexistentes en archivos no relacionados

---

## Implementación 20 - Marca "F" serif compartida entre logo y loader

**Fecha**: 2026-11-02
**Referencia**: `docs/animations/brand-animation-loading.md`
**Archivos modificados**: 5 (`components/ui/brand-mark.tsx` nuevo, `components/navbar.tsx`, `components/footer.tsx`, `components/ui/form-loader.tsx`, `docs/implementations.md`)

### Problema

El logo "F" del navbar y del footer se renderizaba como texto con `font-serif`, pero la fuente serif del proyecto apunta a Plus Jakarta Sans, por lo que no tenía el carácter serif de la marca ni coincidía con la F que aparece al final del morph del loader.

### Solución

1. **`components/ui/brand-mark.tsx`**: Nuevo componente `BrandMark` que dibuja el cuadrado amarillo con la F del path SVG de `brand-animation-loading.md` en `viewBox` 24×24. Exporta `BRAND_F_PATH` como fuente única de la forma y usa `currentColor`, por lo que conserva el contraste en ambos temas.
2. **`components/navbar.tsx` y `components/footer.tsx`**: El texto "F" se reemplaza por `<BrandMark />`.
3. **`components/ui/form-loader.tsx`**: El último path del morph importa `BRAND_F_PATH`, evitando que la F del loader y la del logo diverjan.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npx eslint components/ui/brand-mark.tsx components/ui/form-loader.tsx components/navbar.tsx components/footer.tsx`: Sin errores ni warnings

---

## Implementación 21 - Eliminación del intro duplicado en la primera carga del Dashboard

**Fecha**: 2026-11-02
**Referencia**: `docs/animations/brand-animation-loading.md`
**Archivos modificados**: 2 (`app/(dashboard)/dashboard/(list)/page.tsx`, `app/(dashboard)/dashboard/(list)/loading.tsx`)

### Problema

En la primera visita a `/dashboard` el texto "Cargando formularios..." aparecía dos veces. El `loading.tsx` del segmento mostraba `DashboardLoadingScreen` mientras se resolvía el RSC y, al montarse la página, `DashboardFirstVisitGate` volvía a montar el mismo loader desde el frame 0 para completar el ciclo, reiniciando la secuencia de textos.

### Solución

1. **`app/(dashboard)/dashboard/(list)/page.tsx`**: La página pasa a ser síncrona y devuelve inmediatamente `DashboardFirstVisitGate` con un `<Suspense>` cuyo hijo es el nuevo `DashboardContent` (server component async con auth, Prisma y el JSX del Dashboard). Así el shell de la página y la intro llegan antes, y los datos se cargan en paralelo durante el ciclo de la animación.
2. **`app/(dashboard)/dashboard/(list)/loading.tsx`**: Vuelve a usar `Spinner` como fallback neutro del segmento. El intro con captions queda únicamente dentro del gate, por lo que la secuencia de textos se muestra una sola vez.
3. El fallback del `<Suspense>` interno es `Spinner`, de modo que si los datos tardan más que la intro se muestra un indicador neutro en lugar de reiniciar los textos.

### Verificación

- `npx tsc --noEmit`: Sin errores
- `npx eslint` sobre los archivos tocados: Sin errores ni warnings
- `npm run build`: Compilación exitosa; 13/13 páginas generadas
- Flujo esperado: primera visita muestra una sola vez la secuencia completa de textos durante 3700 ms; los datos se resuelven en paralelo



