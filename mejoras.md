# ✨ Mejoras de Experiencia de Usuario (Documento privado)

> Documento de trabajo interno. No forma parte de la documentación pública del proyecto ni se indexa en `AGENTS.md`.
> Alcance actual: edición rápida del título de los formularios desde las tarjetas del `/dashboard`.

---

## 1. Objetivo

Permitir que el doctor renombre un formulario directamente desde su tarjeta en `/dashboard`, sin entrar al editor completo, mediante un modal rápido y una Server Action dedicada.

### Problema actual

- El título del formulario en `components/Dashboard/FormCard.tsx` es solo texto.
- Para cambiar el nombre, el usuario debe abrir **Editar formulario** y guardar el formulario completo (nombre + descripción + campos).
- No existe una acción dedicada para actualizar únicamente el título.

### Resultado esperado

- Al hacer clic en el título de la tarjeta se abre un modal con el nombre actual.
- El usuario edita, guarda y ve el nuevo nombre reflejado en la tarjeta de inmediato.
- Feedback claro de éxito/error con `toast`.
- Accesible por teclado y compatible con móvil.

---

## 2. Experiencia de usuario propuesta

### 2.1 Tarjeta (`FormCard`)

- Convertir el título en un elemento interactivo (`<button type="button">`) con:
  - `aria-label="Renombrar formulario {nombre}"`.
  - Soporte de teclado (`Enter` / `Space`).
  - Afordancia visual al hacer hover/focus: subrayado sutil y/o icono de lápiz (`Pencil`) a la derecha.
  - `cursor-pointer` y foco visible usando los tokens del design system.
- Mantener el resto de la tarjeta sin cambios funcionales (menú, estados, copiar link, eliminar).
- El nuevo nombre debe actualizarse en el estado local al guardar, sin recargar toda la página.

### 2.2 Modal de renombrado

- Componente nuevo: `components/Dashboard/RenameFormDialog.tsx`.
- Basado en `components/ui/dialog.tsx` y `components/ui/input.tsx`.
- Contenido:
  - `DialogTitle`: "Renombrar formulario".
  - `DialogDescription`: breve explicación ("Actualiza el nombre visible en tu panel").
  - `Input` con el nombre actual, autofocus y `select()` al abrir.
  - Contador de caracteres (`actual/120`).
  - `DialogFooter`: botón **Cancelar** y botón **Guardar**.
- Comportamientos:
  - `Enter` dentro del input guarda.
  - `Escape` cierra (salvo mientras guarda).
  - **Guardar** deshabilitado si el nombre está vacío, solo contiene espacios, excede 120 caracteres o no cambió.
  - Estado de carga en el botón ("Guardando…") y bloqueo del cierre durante el guardado.
  - Errores mostrados con `toast.error`; éxito con `toast.success`.
  - Al cerrar sin guardar se descarta el valor editado.

---

## 3. Cambios técnicos

### 3.1 Server Action

**Archivo:** `actions/forms/crud.ts`

Nueva acción enfocada:

```ts
export async function renameForm(formId: string, name: string)
```

Requisitos:

1. `auth()` y validación de sesión → `{ success: false, message: "No autorizado" }`.
2. `getOrCreateDoctor()` y guard de `null`.
3. Normalizar el nombre con `trim()`.
4. Validar con Zod (nuevo schema `FormNameSchema` en `lib/schemas/form.schema.ts`):
   - string
   - mínimo 1 carácter tras `trim`
   - máximo 120 caracteres
   - mensajes en español
5. Actualizar únicamente `name` verificando propiedad del formulario (`id` + `doctorId`).
6. `revalidatePath("/dashboard")`.
7. Retornar el contrato existente: `{ success, message, form? }`.
8. Envolver en `try/catch` y usar `getActionErrorMessage`.

> No reutilizar `updateForm()` para esto: exige `description` y `fields`, y obliga a cargar/validar datos innecesarios.

### 3.2 Componente cliente

**Archivo nuevo:** `components/Dashboard/RenameFormDialog.tsx`

Props sugeridas:

```ts
type RenameFormDialogProps = {
  formId: string
  currentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRenamed: (name: string) => void
}
```

Responsabilidades:

- Manejar `name`, `isSaving` y errores de validación locales.
- Llamar a `renameForm(formId, name)`.
- En éxito: `onRenamed(result.form.name)`, cerrar modal y mostrar toast.
- En error: mantener el modal abierto y mostrar `toast.error`.

### 3.3 Integración en la tarjeta

**Archivo:** `components/Dashboard/FormCard.tsx`

- Añadir estado `displayName` inicializado con `form.name`.
- Añadir estado `openRenameDialog`.
- Reemplazar el `<p>` del título por un `<button>` accesible.
- Renderizar `<RenameFormDialog ... onRenamed={setDisplayName} />`.
- Mantener el `line-clamp-1` y el estilo tipográfico actual.

### 3.4 Archivos afectados (resumen)

| Archivo | Acción |
| :--- | :--- |
| `lib/schemas/form.schema.ts` | Añadir `FormNameSchema` |
| `actions/forms/crud.ts` | Añadir `renameForm` |
| `components/Dashboard/RenameFormDialog.tsx` | Crear |
| `components/Dashboard/FormCard.tsx` | Integrar título clickeable + modal |

---

## 4. Validaciones y casos borde

| Caso | Comportamiento |
| :--- | :--- |
| Nombre vacío o solo espacios | Guardar deshabilitado + mensaje local |
| Nombre sin cambios | Guardar deshabilitado |
| Nombre > 120 caracteres | Contador en rojo + guardar deshabilitado |
| Formulario de otro doctor | La acción retorna error (sin filtrar datos) |
| Sesión expirada | `toast.error("No autorizado")` |
| Error de red / DB | `toast.error` con mensaje amigable, modal permanece abierto |
| Clic fuera / Escape mientras guarda | Se ignora el cierre |
| Nombre con espacios al inicio/fin | Se guarda con `trim()` |
| Móvil | Modal a ancho completo con padding, input y botones apilados |

---

## 5. Accesibilidad

- Título interactivo como `<button>` real, no `div` con `onClick`.
- `aria-label` descriptivo y foco visible.
- Modal con `DialogTitle` y `DialogDescription` (Radix gestiona `aria-labelledby` / `aria-describedby`).
- Autofocus en el input al abrir.
- `Enter` para guardar y `Escape` para cerrar.
- No depender solo del color para indicar error.

---

## 6. Criterios de aceptación

> Estado: implementado y verificado con `tsc`, `lint` y `build`. Las pruebas manuales de navegador quedan pendientes.

- [x] Hacer clic en el título de una tarjeta abre el modal con el nombre actual.
- [x] El título responde a `Enter` y `Space` y muestra foco visible.
- [x] Guardar un nombre válido actualiza la tarjeta sin recargar la página y muestra toast de éxito.
- [ ] El nombre persiste tras recargar `/dashboard`.
- [x] Un nombre vacío, sin cambios o mayor a 120 caracteres no se puede guardar.
- [x] Un formulario ajeno no puede renombrarse.
- [x] Los errores muestran toast y no cierran el modal.
- [ ] Funciona correctamente en móvil y escritorio.
- [x] `tsc --noEmit`, lint y `build` sin errores nuevos.
- [ ] Sin errores de hidratación ni excepciones en consola.

---

## 7. Verificación

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run dev` y probar:
   - Renombrar un formulario propio.
   - Cancelar sin guardar.
   - Enviar nombre vacío / solo espacios.
   - Superar 120 caracteres.
   - Recargar y confirmar persistencia.
   - Navegación completa solo con teclado.

---

## 8. Fuera de alcance (para futuras iteraciones)

- Edición de la descripción desde la tarjeta.
- Renombrado inline (sin modal).
- Actualización optimista con rollback.
- Historial de cambios de nombre.
- Renombrado desde el menú contextual de la tarjeta.
