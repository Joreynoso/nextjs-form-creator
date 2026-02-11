# Guía de Proyecto: NextJS Form Creator

Este documento detalla la estructura, los endpoints y el roadmap para llevar a cabo la idea de un creador de formularios dinámicos para doctores y pacientes.

## Estructura del Proyecto

```text
/app
  /api
    /forms          # Gestión de plantillas de formularios
    /patients       # Gestión de datos de pacientes y respuestas
    /generate-link  # Generación de tokens y enlaces únicos
/components
  /FormBuilder      # Componentes para que el doctor cree el form
  /PatientForm      # Componentes para que el paciente complete el form
  /Dashboard        # Panel de control del doctor
/prisma
  schema.prisma     # Modelos de Doctor, Form y Patient
```

## Endpoints Principales

- `GET /api/forms`: Obtiene los formularios creados por el doctor.
- `POST /api/forms`: Crea una nueva plantilla de formulario (recibe JSON de campos).
- `POST /api/patients/generate-link`: Crea un registro de paciente vacío con un token único para el formulario.
- `GET /api/patients/:token`: Obtiene los datos del formulario asociados a un token.
- `POST /api/patients/:token`: Guarda las respuestas del paciente.

---

## Roadmap Paso a Paso

### Fase 1: Infraestructura y Autenticación
- [ ] **Configurar Prisma**: Definir modelos en `schema.prisma` (Doctor, Form, Patient) y ejecutar migraciones.
- [ ] **Configurar Clerk**: Asegurar que los componentes de Clerk funcionen en modo claro/oscuro y que la sesión del usuario sea accesible en API routes.
- [ ] **Lib Prisma**: Configurar `lib/prisma.ts` para evitar múltiples instancias en desarrollo.

### Fase 2: FormBuilder (Panel del Doctor)
- [ ] **Editor de Campos**: Desarrollar `FieldEditor.tsx` para definir tipo de campo (texto, número, checkbox, etc.), etiqueta y validación.
- [ ] **Persistencia**: Implementar la lógica de guardado en `app/api/forms/route.ts` para almacenar el esquema JSON en la DB.
- [ ] **Listado de Forms**: Mostrar los formularios creados en el Dashboard.

### Fase 3: Generación de Enlaces
- [ ] **Lógica de Token**: Crear un generador de enlaces en `app/api/patients/generate-link/route.ts` que guarde un objeto `Patient` vinculado a un `Form`.
- [ ] **UI de Compartir**: Botón en el dashboard para copiar el enlace único (`/form/[token]`).

### Fase 4: PatientForm (Vista Pública)
- [ ] **Renderizado Dinámico**: Implementar `DynamicForm.tsx` para que lea el JSON del formulario y genere los inputs correspondientes usando `FieldInput.tsx`.
- [ ] **Progreso y Validación**: Usar `ProgressBar.tsx` para formularios largos y validar campos obligatorios.
- [ ] **Guardado Final**: Implementar el POST que guarda `formResponses` en el modelo `Patient`.

### Fase 5: Análisis y Resultados
- [ ] **Dashboard de Pacientes**: Panel para que el doctor vea quién ha completado el formulario.
- [ ] **Vista de Respuestas**: Modal o página para ver las respuestas detalladas de cada paciente.
- [ ] **Exportación**: (Opcional) Exportar respuestas a CSV o PDF.
