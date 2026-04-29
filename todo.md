# 📝 NexJS Form Creator - TODO & Backlog

## 🔍 Verificación de cambios en editor

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