# 🤖 Optimización y Seguridad del Sistema MPC (Chat & AI Tools)

Este documento detalla el análisis de seguridad, estabilidad y rendimiento del sistema **MPC** (Model-Prompt-Chat) implementado para el asistente de IA, que consume la API de Groq y gestiona la ejecución dinámica de herramientas (*tool calling*).

---

## 🔒 1. Mejoras de Seguridad

### ⚠️ Endpoint de Chat Expuesto al Público (`/api/chat`)
*   **Problema actual**: En `middleware.ts`, la ruta `/api/chat(.*)` está marcada como pública (`isPublicRoute`). Esto permite que cualquier usuario no autenticado (o un bot automatizado) envíe peticiones al chat, consumiendo la cuota y saldo de la API de Groq (`llama-3.3-70b-versatile`) sin restricción.
*   **Causa**: Se configuró como pública porque al protegerla con Clerk, las solicitudes fetch desde el cliente no enviaban las credenciales correctamente.
*   **Solución**:
    1.  Eliminar la ruta `/api/chat` de las excepciones públicas en `middleware.ts`.
    2.  Asegurar que la llamada `fetch` en `app/(dashboard)/dashboard/chat/page.tsx` incluya automáticamente los headers de autenticación o que Clerk verifique la sesión de la cookie nativa de forma transparente al estar en el mismo origen.

### ⚠️ Limitación de Tasa (Rate Limiting) para Peticiones de IA
*   **Problema actual**: No hay control sobre cuántos mensajes puede enviar un usuario autenticado por minuto. Un usuario malicioso podría automatizar un script que envíe cientos de prompts, incrementando drásticamente los costos de consumo de Groq.
*   **Solución**: Implementar un rate limiter en `/api/chat` usando la dirección IP o el ID de usuario de Clerk con `@upstash/ratelimit` y Redis, limitando, por ejemplo, a un máximo de 10 llamadas al chat por minuto.

---

## 🌀 2. Estabilidad del Turno de IA y Tool Calling

### 🔄 Bucle Infinito de Herramientas (Tool Loop)
*   **Problema actual**: Cuando la IA devuelve el resultado de una herramienta y el usuario responde con un mensaje corto ("ok", "perfecto", "sí"), el modelo en ocasiones se confunde al retener los `tool_calls` anteriores en el historial y vuelve a llamar a la misma herramienta con los mismos parámetros.
*   **Mejora implementada**: Se añadió un filtro dinámico en `/api/chat/route.ts` que limpia los mensajes de tipo `tool` y los mensajes del asistente vacíos, enviando solo interacciones de texto limpio.
*   **Solución definitiva**: Implementar un estado explícito de confirmación en el cliente. Si la herramienta requiere acción (como guardar el formulario), el flujo debe cerrarse en la UI (por ejemplo, con el botón "Guardar" o "Desechar") e impedir que el backend procese la misma herramienta de forma automática.

### 📝 Exposición de Nombres Técnicos de las Tools
*   **Problema**: Aunque el prompt del sistema prohíbe mencionar nombres técnicos de las herramientas (`createForm`, `generateForm`), el modelo puede fallar si el usuario le insiste.
*   **Solución**: Renombrar las descripciones de las herramientas en el esquema JSON para que no utilicen jerga técnica, y pre-procesar la respuesta del LLM antes de enviarla a la UI para filtrar posibles filtraciones del prompt del sistema.

---

## ⚡ 3. Optimización del Rendimiento (Performance)

### 🚀 Doble Consumo de Tokens (Llamada Groq Anidada)
*   **Problema actual**: Cuando se ejecuta la herramienta `generateForm`, la función `execute` realiza una *segunda llamada* dedicada a Groq para generar el array JSON de campos del formulario. Esto añade latencia (dos peticiones secuenciales a la API de Groq en una sola interacción) y aumenta el costo en tokens.
*   **Solución**:
    1.  **Esquemas Estructurados (Structured Outputs)**: Utilizar la capacidad nativa de Groq para responder con JSON schema en lugar de forzarlo mediante prompts convencionales.
    2.  **Modelo Ligero**: Para la sub-tarea de estructurar preguntas en JSON, utilizar un modelo mucho más rápido y económico (como `llama-3-8b-8192` o `gemma2-9b-it`) en lugar del costoso `llama-3.3-70b-versatile`.

```mermaid
seqdiagram
    User ->> Chat API: "Crea un form de nutrición"
    Chat API ->> Groq (Router): Clasifica y llama a generateForm
    generateForm ->> Groq (JSON Specialist): Genera array de campos (Latencia extra ⚠️)
    generateForm -->> Chat API: Retorna campos generados
    Chat API -->> User: Muestra preview de formulario
```

---

## 🛠️ 4. Simplificación del Código y Tipado TS

### 🧹 Tipado Estricto de los Ejecutores de Tools
*   **Problema**: En `app/api/chat/tools/index.ts`, los ejecutores están tipados con `any`:
    ```typescript
    export const toolExecutors: Record<string, (args: any, doctorId: string) => Promise<any>>
    ```
*   **Solución**: Crear tipos de unión explícitos basados en las propiedades requeridas por cada herramienta. Esto previene que se pasen argumentos mal formados durante el desarrollo:
    ```typescript
    type CreateFormArgs = { title: string; description: string };
    type FindFormArgs = { query?: string };
    type GenerateFormArgs = { title: string; description: string; topic: string; questionCount: number };

    export const toolExecutors = {
      createForm: (args: CreateFormArgs, doctorId: string) => createFormTool.execute({ ...args, doctorId }),
      findForm: (args: FindFormArgs, doctorId: string) => findFormTool.execute({ ...args, doctorId }),
      generateForm: (args: GenerateFormArgs, _doctorId: string) => generateFormTool.execute(args),
    };
    ```

### 💾 Persistencia Local del Estado de Previsualización (Preview)
*   **Problema**: Si el usuario recarga la página o cambia de vista en el dashboard mientras tiene un formulario generado por IA en el chat en modo "Preview", el estado se pierde por completo y debe volver a pedir la generación del formulario.
*   **Solución**: Guardar temporalmente las respuestas del asistente con `toolResult` en el `localStorage` del navegador o crear un estado de borrador rápido en la base de datos (`Form` con estado `isActive: false` o similar) para que la información no se pierda ante desconexiones o recargas accidentales.
