# 📝 NexJS Form Creator - TODO & Backlog

## 🔍 Verificación de cambios en editor

## ⚡ Rendimiento & Optimización (Análisis de Rendimiento)

### Problemas de Alta Prioridad (Mayor Impacto)

#### 1. N+1 Queries en el Dashboard
- **Archivo:** `app\(dashboard)\dashboard\(list)\page.tsx:32-73`
- **Problema:** Se ejecutan 5 consultas secuenciales a la base de datos (totalForms, totalSubmissions, totalOpenForms, totalClosedForms, findMany forms).
- **Por qué pasa:** El código hace múltiples llamadas a Prisma de manera secuencial cuando podría usar `Promise.all()`.
- **Impacto:** Alto - cada consulta añade latencia y bloquea el render.
- **Solución:** Usar `Promise.all()` para ejecutar consultas en paralelo o usar `groupBy` para obtener统计数据 en una sola query.

#### 2. Carga de submissions sin paginación
- **Archivo:** `app\(dashboard)\dashboard\[formId]\page.tsx:60-63`
- **Problema:** `findMany` carga todas las submissions sin límite, causando timeouts con muchos datos.
- **Por qué pasa:** No hay paginación ni límite en la consulta.
- **Impacto:** Alto - puede causar timeouts en bases de datos con muchos datos.
- **Solución:** Implementar paginación con `take: 20` y `skip`.

#### 3. Uso de `window` en FormBuilder (Hydration Risk)
- **Archivo:** `components\FormBuilder\FormBuilder.tsx:49,56,57,62`
- **Problema:** `window.scrollY`, `window.addEventListener`, `window.scrollTo` ejecutándose durante el render inicial.
- **Por qué pasa:** Código dentro de `useEffect` pero la verificación inicial `window.scrollY > 400` se ejecuta antes del mount.
- **Impacto:** Medio - puede causar errores de hidratación o problemas en build estático.
- **Solución:** Usar estado inicial `false` para `showScrollTop` o verificar dentro del efecto.

#### 4. JSON.stringify en cada render (Sin memoización)
- **Archivo:** `components\FormBuilder\FormBuilder.tsx:76-77`
- **Problema:** `const fieldsChanged = JSON.stringify(fields) !== JSON.stringify(originalFields)` se recalcula en cada render.
- **Por qué pasa:** No se usa `useMemo` para memoizar esta comparación.
- **Impacto:** Medio - degradación notable con muchos campos.
- **Solución:** Envolver en `useMemo(() => ..., [fields, originalFields])`.

---

### Problemas de Prioridad Media

#### 5. Falta de AbortController en Chat
- **Archivo:** `app\(dashboard)\dashboard\chat\page.tsx:55-58`
- **Problema:** El fetch no tiene forma de cancelarse si el componente se desmonta.
- **Por qué pasa:** No se implementa el patrón de `AbortController`.
- **Impacto:** Medio - puede causar "Can't perform a React state update on unmounted component".
- **Solución:** Usar `useEffect` con `AbortController`.

#### 6. Falta de useCallback en handlers de FormPlayer
- **Archivo:** `components\FormPlayer\FormPlayer.tsx:67,115`
- **Problema:** `handleNext` y `handleBack` se recrean en cada render.
- **Por qué pasa:** Solo `setValue` usa `useCallback`, los otros handlers no.
- **Impacto:** Medio-Bajo - puede causar re-renders innecesarios.
- **Solución:** Envolver en `useCallback` con sus dependencias.

#### 7. Datos innecesarios en query de edición
- **Archivo:** `app\(dashboard)\dashboard\[formId]\edit\page.tsx:21-30`
- **Problema:** La consulta incluye `submissions` que no se usan en la página de edición.
- **Por qué pasa:** Código copiado de otra página que no se limpió.
- **Impacto:** Bajo - datos innecesarios traídos de la DB.
- **Solución:** Eliminar el `include: { submissions }`.

---

### Problemas de Prioridad Baja

#### 8. Console.log en producción
- **Archivo:** `components\FormBuilder\FormBuilder.tsx:95`
- **Problema:** `console.log('result', result)` queda en código de producción.
- **Solución:** Eliminar o usar debug condicional.

#### 9. Iconos recreados en cada render
- **Archivo:** `components\FormBuilder\FormBuilder.tsx:131-142`
- **Problema:** `checkSaved` y `unsaveAlert` se recrean en cada render.
- **Solución:** Mover fuera del componente o usar `useMemo`.

#### 10. ThemeProvider wrapper innecesario
- **Archivo:** `components\themeprovider.tsx:1-11`
- **Problema:** Wrapper innecesario cuando `next-themes` puede usarse directamente.
- **Solución:** Eliminar el wrapper y usar `next-themes` directamente en el layout.

#### 11. SizeScreenHelper en producción
- **Archivo:** `components\screensizehelper.tsx:1-17`
- **Problema:** Helper de desarrollo dejado en código de producción.
- **Solución:** Condicionar con `process.env.NODE_ENV === 'development'`.

#### 12. window.location hardcodeado
- **Archivo:** `components\Dashboard\FormCard.tsx:117`
- **Problema:** `const link = \`${window.location.origin}/form/${publicToken}\`` no es idiomático.
- **Solución:** Usar variable de entorno `NEXT_PUBLIC_VERCEL_URL`.

---

## 🔒 Errores de Seguridad Críticos (Alta Prioridad)

### 1. Falta de Rate Limiting (Agotamiento de cuota y DDoS)
- [ ] **Submissions (Respuestas):** Falla crítica de seguridad al no limitar la cantidad de respuestas que se pueden enviar a `/api/public/submissions/[token]`. Un atacante puede enviar miles de respuestas por minuto inundando la base de datos de "basura".
- [ ] **Chat IA:** Falta límite de llamadas a los endpoints del modelo. Si se deja libre, un usuario podría causar cobros masivos usando el modelo repetidamente.
- [ ] **Solución:** Implementar Upstash Redis para crear límites de uso por IP/Usuario.

### 2. Endpoints Privados Expuestos (Auth Bypass)
- [ ] **Ruta `/api/chat(.*)` en el Middleware:** Clerk no está protegiendo actualmente esta ruta correctamente ("si la coloco privada no puedo acceder"). Esto puede permitir que personas no autenticadas accedan a la interfaz LLM del sistema.
- [ ] **Solución:** Revisar cómo se pasan las credenciales o cookies en la petición `fetch` desde el cliente al endpoint `/api/chat` para que el `authMiddleware` de Clerk las reconozca.

### 3. Validaciones Inseguras del Server-Side y Payload (Inyección y Corrupción Omitidas)
- [ ] **Form Builder:** El JSON de `fields` que viaja al servidor no se somete a validación estricta Zod en el backend, confiando ciegamente en lo que envía la UI. Un usuario malintencionado podría interceptar la request HTTP y enviar JSON malformado o ejecutar XSS (Cross Site Scripting) inyectando etiquetas `<script>` en el label del field.
- [ ] **Acciones Generales:** Validar errores usando `zod` siempre como **primera capa** bloqueante y usar el patrón `switch`/`case` seguro devolviendo objetos tipados en los return de los server actions.

---

## 🛠️ UI & Experiencia de Usuario (Mejoras Pendientes)

- [ ] **Avisos UI en Server Actions (MPC):** La interfaz muchas veces no devuelve feedback de error cuando la request en servidor falla. Se deben personalizar mensajes de tipo Toast para avisar al usuario por qué falló algo (ej. fallos en búsqueda o creaciones).
- [ ] **Dashboard Navigation:** Crear una barra o Sidebar que agilice mejor la vista entre formularios, estadísticas crudas y submissions (respuestas individuales detalladas).
- [ ] **Menú Flotante de Acciones Rápidas (Form Builder):** En formularios inmensamente largos, considerar incluir la opción de "Guardar Cambios" y el status de `isDirty` dentro del menú circular/flotante para que el usuario no deba hacer scroll constantemente al footer/top.
- [ ] **Buscador de Submissions (Respuestas):** Implementar un buscador global dentro de los formularios para encontrar respuestas específicas. (Ver estrategias de implementación abajo).

---

## 🧠 Lógica e IA (Modelos)

- [ ] **Bug: Tool Loop (Generación de Chat):** El modelo en ciertas situaciones se cicla usando tools sin justificación si el usuario responde con mensajes cortos después de ejecutar una herramienta exitosamente.
  - *Causa:* El historial enviado retiene los tool_calls previos forzando al modelo continuar con esa inercia. (Ref: `app/api/chat/route.ts`).
- [ ] **Generación de UI con Formularios largos:** La tool de `generateForm` olvida utilizar el type de campo `"section"` (Divisor) a menos que se le fuerce mucho. Si un usuario le pide 10 preguntas organizadas, el modelo debería intercalarlas automáticamente con secciones para categorizar visualmente en UI.
- [x] **Fuga de información de Herramientas (Prompt Engineering):** El modelo expone los nombres técnicos de sus tools (createForm, generateForm, findForm). Se debe modificar el prompt del sistema para que nunca exponga los nombres reales de las funciones o herramientas, sino que use un lenguaje natural y descriptivo para el usuario.
- [ ] **Nombres de acciones de formulario:** Los nombres actuales de las acciones del formulario son poco claros para el usuario final. Deben actualizarse para ser más amigables y descriptivas.

---

## 🔄 Refactorización & Enfoque General

- [ ] **Refactorizar `getOrCreateDoctor`:** Cambiar el nombre de la función para que tenga coherencia con el nuevo enfoque general (ej. `getOrCreateUser` o `getOrCreateOwner`), y no se limite al nicho médico.
- [ ] **Modelos de Prisma y Base de Datos:** Cambiar los nombres de las propiedades y relaciones en los modelos de Prisma que actualmente usan términos médicos (ej. `doctor`, `patient`) para que sigan este nuevo enfoque general aplicable a cualquier usuario.


## ⚙️ Configuración & Compilación (Errores Pre-existentes TypeScript)

Estos errores aparecen al ejecutar `npx tsc --noEmit`:

| # | Archivo | Error | Estado |
|---|---------|-------|--------|
| 1 | `app/api/forms/route.ts:32` | `Property 'errors' does not exist on type 'ZodError'` | ✅ Solucionado (Se usó `.format()`) |
| 2 | `app/api/chat/route.ts:4` | `Cannot find module '@/actions/doctors/sync'` | ✅ Solucionado (Paths tsconfig correctos) |
| 3 | `app/api/chat/tools/createForm.tool.ts:1` | `Cannot find module '@/actions/forms/crud'` | ✅ Solucionado |
| 4 | `app/api/chat/tools/findForm.tool.ts:1` | `Cannot find module '@/actions/forms/crud'` | ✅ Solucionado |
| 5 | `app/api/chat/tools/generateForm.tool.ts:3` | `Cannot find module '@/types/form.types'` | ✅ Solucionado |

**Causa explicada:** 
1. El error del módulo alias `@/*` ocurría porque probablemente `tsconfig.json` o el cache de TS no resolvía las rutas desde la raíz (`./*`). Actualmente el alias `@/*`: `["./*"]` funciona correctamente y los módulos existen en sus respectivas rutas.
2. El error de `ZodError` ocurría porque la propiedad directa `.errors` puede fallar en la inferencia estricta de TypeScript dependiendo de la versión de Zod. La mejor práctica es utilizar el método `validation.error.format()` o `validation.error.flatten()` provistos por Zod.

**Plan de corrección ejecutado:**
1. ✅ Verificado que `tsconfig.json` tiene `paths` configurado correctamente.
2. ✅ Verificadas las rutas físicas de los módulos (`actions/` y `types/`).
3. ✅ Modificado `app/api/forms/route.ts` para utilizar `validation.error.format()` en lugar de `.errors`.
4. ✅ Ejecutado `npx tsc --noEmit` con 0 errores resultantes.