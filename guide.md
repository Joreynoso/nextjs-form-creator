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

## Modelo de Datos (Prisma)

El sistema utiliza **Prisma ORM** con una base de datos PostgreSQL. La estructura está diseñada para ser flexible y escalable.

### Modelos y Relaciones

1.  **Doctor**: Representa al usuario autenticado (vía Clerk).
    *   `userId`: ID único de Clerk para vincular la sesión.
    *   **Relaciones**: Un doctor puede tener múltiples `Form` (plantillas) y múltiples `Patient` (registros de respuesta).
2.  **Form**: Son las plantillas de los formularios creadas por los doctores.
    *   `fields`: Columna de tipo **JSON** que almacena la estructura de preguntas (labels, tipos, opciones).
    *   **Relación**: Pertenece a un `Doctor` y puede ser usado por múltiples `Patient`.
3.  **Patient**: Representa una instancia de respuesta o un paciente invitado.
    *   `token`: String único usado en la URL para que el paciente acceda sin login.
    *   `formResponses`: Columna de tipo **JSON** que almacena las respuestas enviadas.
    *   **Relación**: Vinculado a un `Doctor` (quien lo invitó) y a un `Form` (la plantilla que debe llenar).

### Cómo Implementarlo
- **Uso de JSON**: Al leer un `Form`, debes iterar sobre `fields` en el frontend para renderizar los inputs. Al guardar, envía un objeto clave-valor que coincida con lo esperado por el modelo `Patient`.
- **Seguridad**: Aunque el paciente usa un `token`, el acceso a la gestión de esos datos en el dashboard debe estar protegido por el `doctorId` vinculado.

### Limitantes y Consideraciones
- **Consultas complejas**: Al usar campos `JSON`, las búsquedas directas por una respuesta específica dentro de `formResponses` pueden ser más complejas que en columnas de texto plano (requiere sintaxis JSON de PostgreSQL).
- **Consistencia**: Prisma no valida la estructura interna del JSON. Es recomendable usar **Zod** en el backend para validar el esquema antes de guardar en `fields` o `formResponses`.
- **Migraciones**: Si cambias la lógica de cómo se estructuran las preguntas en el JSON, los formularios antiguos podrían romperse si no manejas versiones.

---

## Ideas de Estadísticas para el Dashboard

Para que el doctor tenga una visión clara del estado de sus formularios al entrar al Dashboard, se sugieren las siguientes métricas basadas en los modelos `Form` y `Patient`:

### 1. Métricas de Resumen (KPIs)
- **Total de Pacientes Atendidos**: Contador total de registros en el modelo `Patient` vinculados al doctor.
- **Tasa de Conversión/Finalización**: Porcentaje de pacientes que han marcado `formCompleted: true` frente al total de invitados.
- **Formularios Activos**: Cantidad de registros en el modelo `Form` donde `isActive: true`.
- **Nuevas Respuestas (Hoy/Esta Semana)**: Conteo de registros en `Patient` donde `completedAt` es reciente.

### 2. Rendimiento por Formulario (Gráficos)
- **Formularios más Respondidos**: Un gráfico de barras que compare cuántas respuestas tiene cada `Form`.
- **Tiempo Promedio de Respuesta**: (Calculado restando `completedAt` - `linkSentAt`). Útil para saber qué formularios son muy largos o difíciles de llenar.

### 3. Estado de Seguimiento
- **Pacientes en Espera**: Lista o contador de pacientes donde `formCompleted: false` y el `linkSentAt` fue hace más de 48 horas (seguimiento preventivo).
- **Últimas Respuestas Recibidas**: Un feed o lista con los últimos 5 pacientes que completaron un formulario, con acceso directo a sus respuestas.

### 4. Análisis de Contenido (Avanzado)
- **Distribución de Respuestas**: Si tienes campos cerrados (select/radio) en el JSON de `fields`, puedes contar las opciones más elegidas en `formResponses` para ver tendencias de salud o síntomas comunes.

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
